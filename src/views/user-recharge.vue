<template>
  <div class="user-recharge-page">
    <div class="header">
      <h1>用户充值 <el-tag :type="isTestnet ? 'warning' : 'success'" size="small">{{ isTestnet ? '测试网' : '主网' }}</el-tag>
      </h1>
      <el-button type="primary" size="small" @click="goBack">返回</el-button>
    </div>

    <!-- 充值金额显示 -->
    <div class="amount-display">
      <span class="amount-value">{{ amount }} {{ currency }}</span>
    </div>

    <!-- 充值地址和二维码 -->
    <el-card shadow="hover" class="card-container">
      <template #header>
        <div class="card-header">
          <span>充值地址</span>
        </div>
      </template>
      <div class="address-value">
        <el-input :value="address" size="small" readonly>
          <template #append>
            <el-button @click="copyText(address)">
              <el-icon>
                <CopyDocument />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <div class="qrcode-container">
        <qrcode-vue :value="address" :size="180" level="H" class="qrcode-image" />
      </div>
    </el-card>

    <!-- 订单信息 -->
    <el-card shadow="hover" class="card-container">
      <template #header>
        <div class="card-header">
          <span>订单信息</span>
        </div>
      </template>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="币种">{{ currency }}</el-descriptions-item>
        <el-descriptions-item label="链">{{ getChainDisplayName(chain) }}</el-descriptions-item>
        <!-- <el-descriptions-item label="用户ID">{{ uid }}</el-descriptions-item> -->
        <el-descriptions-item label="订单ID">
          {{ orderId }}
          <el-button link type="primary" size="small" @click="copyText(orderId)">
            <el-icon>
              <CopyDocument />
            </el-icon>
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(orderStatus)">{{ getStatusText(orderStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="过期时间" v-if="expiryTimeRemaining > 0">
          <span class="countdown">{{ formatCountdown(expiryTimeRemaining) }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-alert title="充值提示" type="warning" description="请确保从正规渠道转账，充值将在区块确认后到账。请勿向上述地址充值任何非上述币种资产，否则资产将不可找回。" show-icon
      :closable="false" class="recharge-alert" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { CopyDocument } from '@element-plus/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { XPay } from 'x-pay-sdk-official';
import { merchantApiKey, testUserRecharge, testUserGetOrderStatus } from '@/api/xpay/merchant';

export default {
  components: {
    CopyDocument,
    QrcodeVue
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 从URL参数中获取数据
    const currency = ref('');
    const chain = ref('');
    const amount = ref(0);
    const uid = ref('');
    const address = ref('');
    const isTestnet = ref(false);
    const orderId = ref('');
    const orderStatus = ref('PENDING');
    const expiryTime = ref(null);
    const expiryTimeRemaining = ref(0);
    let statusCheckInterval = null;
    let countdownInterval = null;

    // XPay SDK实例
    const xpayInstance = ref(null);

    onMounted(async () => {
      // 从URL查询参数中获取数据
      currency.value = route.query.currency || 'USDT';
      chain.value = route.query.chain || 'TRON';
      amount.value = parseFloat(route.query.amount || '100');
      uid.value = route.query.uid || '';
      // 检查是否是测试网
      isTestnet.value = route.query.network === 'TEST';

      // 初始化XPay SDK实例
      //   await initXPayInstance();

      // 检查本地存储中是否有未完成的订单
      const savedOrderData = localStorage.getItem(`recharge_order_${uid.value}_${currency.value}_${chain.value}_${amount.value}`);
      // console.log('Saved order data:', savedOrderData);
      if (savedOrderData) {
        try {
          const orderData = JSON.parse(savedOrderData);

          // 检查订单是否过期
          const now = new Date();
          const expiryDate = new Date(orderData.expiryTime);
          const isExpired = !expiryDate || now > expiryDate;
          // console.log('Order is expired:', isExpired)
          // 如果订单未过期或状态不是PENDING，先查询订单状态
          if (!isExpired) {
            // 恢复订单数据
            address.value = orderData.address;
            orderId.value = orderData.orderId;
            orderStatus.value = orderData.status;
            expiryTime.value = orderData.expiryTime ? new Date(orderData.expiryTime) : null;
            amount.value = orderData.amount;

            // 查询最新订单状态
            await getOrderStatus(orderData.orderId);

            // 如果订单仍然有效，设置倒计时和状态检查
            if (!['SUCCESS', 'FAILED', 'EXPIRED'].includes(orderStatus.value)) {
              // 设置倒计时
              updateExpiryTimeRemaining();

              // 设置定时器，每秒更新倒计时
              countdownInterval = setInterval(updateExpiryTimeRemaining, 1000);

              // 设置定时器，每10秒查询一次订单状态
              statusCheckInterval = setInterval(() => {
                getOrderStatus(orderId.value);
              }, 5000);

              // console.log('Restored existing order:', orderData);
              return; // 不创建新订单
            }
          }
        } catch (err) {
          console.error('Error parsing saved order data:', err);
        }
      }

      // 如果没有有效的未完成订单，创建新订单
      createCollectionOrder();
    });

    onUnmounted(() => {
      // 清除定时器
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    // 初始化XPay SDK实例
    const initXPayInstance = async () => {
      try {
        const xpayBaseUrl = import.meta.env.VITE_XPAY_BASE_URL;
        const res = await merchantApiKey();
        const { apiKey, webhookSecret } = res.data;

        xpayInstance.value = new XPay({
          apiKey,
          apiSecret: webhookSecret,
          baseUrl: xpayBaseUrl
        });

        return true;
      } catch (err) {
        console.error('初始化XPay SDK失败:', err);
        ElMessage({
          message: '初始化支付SDK失败，请刷新页面重试',
          type: 'error'
        });
        return false;
      }
    };

    const generateOrderId = () => {
      return `test-payin-${Date.now()}`;
    }

    const createCollectionOrder = async () => {
      try {
        // if (!xpayInstance.value) {
        //   await initXPayInstance();
        //   if (!xpayInstance.value) return;
        // }

        // const response = await xpayInstance.value.createCollection({
        //   amount: amount.value,
        //   symbol: currency.value,
        //   chain: chain.value,
        //   uid: uid.value || 'test-user',
        //   orderId: generateOrderId()
        // });

        const response = await testUserRecharge({
          amount: amount.value,
          symbol: currency.value,
          chain: chain.value,
          uid: uid.value || 'test-user',
          orderId: generateOrderId()
        });

        console.log(response);

        // Create payment data for QR code
        if (response && response.code === 200 && response.data && response.data.address) {
          const paymentData = {
            amount: response.data.amount || amount.value,
            symbol: response.data.symbol || currency.value,
            chain: response.data.chain || chain.value,
            address: response.data.address,
            status: response.data.status || 'PENDING', // Use uppercase status to match the API format
            expiryTime: response.data.expiredTime ? new Date(response.data.expiredTime * 1000) : new Date(Date.now() + 30 * 60 * 1000), // Default 30 min expiry if not provided
            orderId: response.data.orderId,
            orderType: response.data.orderType || 'COLLECTION'
          };

          address.value = paymentData.address;
          orderId.value = paymentData.orderId;
          orderStatus.value = paymentData.status;
          expiryTime.value = paymentData.expiryTime;

          // 保存订单数据到本地存储
          saveOrderToLocalStorage(paymentData);

          // 设置倒计时
          updateExpiryTimeRemaining();

          // 设置定时器，每秒更新倒计时
          countdownInterval = setInterval(updateExpiryTimeRemaining, 1000);

          // 设置定时器，每10秒查询一次订单状态
          statusCheckInterval = setInterval(() => {
            getOrderStatus(orderId.value);
          }, 10000);

          console.log('Payment data created:', paymentData);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 更新倒计时剩余时间
    const updateExpiryTimeRemaining = () => {
      if (!expiryTime.value) return;

      const now = new Date();
      const remaining = expiryTime.value.getTime() - now.getTime();
      expiryTimeRemaining.value = Math.max(0, Math.floor(remaining / 1000));

      // 如果已过期且状态仍为PENDING，更新状态为EXPIRED
      if (expiryTimeRemaining.value <= 0 && orderStatus.value === 'PENDING') {
        orderStatus.value = 'EXPIRED';
        // 清除状态查询定时器
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
        }
      }
    };

    // 格式化倒计时显示
    const formatCountdown = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 获取状态对应的标签类型
    const getStatusType = (status) => {
      const statusMap = {
        'INIT': 'warning',
        'PENDING': 'warning',
        'PENDING_CONFIRMATION': 'info',
        'SUCCESS': 'success',
        'FAILED': 'danger',
        'EXPIRED': 'info'
      };
      return statusMap[status] || 'info';
    };

    // 获取状态对应的中文文本
    const getStatusText = (status) => {
      const statusMap = {
        'INIT': '等待中',
        'PENDING': '等待',
        'PENDING_CONFIRMATION': '确认中',
        'SUCCESS': '已完成',
        'FAILED': '失败',
        'EXPIRED': '已过期'
      };
      return statusMap[status] || status;
    };

    // 保存订单数据到本地存储
    const saveOrderToLocalStorage = (orderData) => {
      try {
        const storageKey = `recharge_order_${uid.value}_${currency.value}_${chain.value}_${amount.value}`;
        localStorage.setItem(storageKey, JSON.stringify({
          address: orderData.address,
          orderId: orderData.orderId,
          status: orderData.status,
          expiryTime: orderData.expiryTime,
          amount: orderData.amount,
          symbol: orderData.symbol,
          chain: orderData.chain,
          createdAt: new Date().toISOString()
        }));
      } catch (err) {
        console.error('Error saving order to local storage:', err);
      }
    };

    // 清除本地存储中的订单数据
    const clearOrderFromLocalStorage = () => {
      try {
        const storageKey = `recharge_order_${uid.value}_${currency.value}_${chain.value}`;
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.error('Error clearing order from local storage:', err);
      }
    };

    const getOrderStatus = async (orderId) => {
      try {
        // if (!xpayInstance.value) {
        //   await initXPayInstance();
        //   if (!xpayInstance.value) return;
        // }

        // const response = await xpayInstance.value.getOrderStatus(orderId);
        const response = await testUserGetOrderStatus(orderId);
        console.log('Get order status:', response);

        // 更新订单状态
        if (response && response.code === 200 && response.data) {
          orderStatus.value = response.data.status || orderStatus.value;

          // 更新本地存储中的订单状态
          const storageKey = `recharge_order_${uid.value}_${currency.value}_${chain.value}`;
          const savedOrderData = localStorage.getItem(storageKey);
          if (savedOrderData) {
            try {
              const orderData = JSON.parse(savedOrderData);
              orderData.status = orderStatus.value;
              localStorage.setItem(storageKey, JSON.stringify(orderData));
            } catch (err) {
              console.error('Error updating order status in local storage:', err);
            }
          }

          // 如果订单已完成或失败，清除定时器和本地存储
          if (['SUCCESS', 'FAILED', 'EXPIRED'].includes(orderStatus.value)) {
            if (statusCheckInterval) {
              clearInterval(statusCheckInterval);
            }

            // 延迟一段时间后清除本地存储，让用户有时间看到最终状态
            setTimeout(() => {
              clearOrderFromLocalStorage();
            }, 60000); // 1分钟后清除
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 获取链的显示名称
    const getChainDisplayName = (chainCode) => {
      const chainMap = {
        'TRON': 'TRON (主网)',
        'TRON_TEST': 'TRON (测试网)',
        'ETH': 'ETH (主网)',
        'ETH_SEPOLIA': 'ETH (Sepolia测试网)',
        'BSC': 'BSC (主网)',
        'BSC_TEST': 'BSC (测试网)'
      };

      return chainMap[chainCode] || chainCode;
    };

    // 复制文本
    const copyText = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        ElMessage({
          message: '复制成功',
          type: 'success'
        });
      }).catch(() => {
        ElMessage({
          message: '复制失败，请手动复制',
          type: 'error'
        });
      });
    };

    // 返回上一页
    const goBack = () => {
      router.push('/');
    };

    // 模拟充值成功
    const simulateRecharge = () => {
      // 更新订单状态为已完成
      orderStatus.value = 'COMPLETED';

      // 更新本地存储中的订单状态
      const storageKey = `recharge_order_${uid.value}_${currency.value}_${chain.value}`;
      const savedOrderData = localStorage.getItem(storageKey);
      if (savedOrderData) {
        try {
          const orderData = JSON.parse(savedOrderData);
          orderData.status = 'COMPLETED';
          localStorage.setItem(storageKey, JSON.stringify(orderData));
        } catch (err) {
          console.error('Error updating order status in local storage:', err);
        }
      }

      // 清除定时器
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }

      ElMessage({
        message: `模拟充值 ${amount.value} ${currency.value} 成功！`,
        type: 'success'
      });

      setTimeout(() => {
        // 清除本地存储中的订单数据
        clearOrderFromLocalStorage();
        goBack();
      }, 2000);
    };

    return {
      currency,
      chain,
      amount,
      uid,
      address,
      isTestnet,
      orderId,
      orderStatus,
      expiryTime,
      expiryTimeRemaining,
      getChainDisplayName,
      getStatusType,
      getStatusText,
      formatCountdown,
      copyText,
      goBack,
      simulateRecharge
    };
  }
};
</script>

<style scoped>
.user-recharge-page {
  padding: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header h1 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-display {
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 4px;
}

.amount-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.card-container {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-value {
  margin-bottom: 15px;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.qrcode-image {
  width: 180px;
  height: 180px;
}

.recharge-alert {
  margin: 15px 0;
  font-size: 12px;
}

.countdown {
  font-family: monospace;
  font-weight: bold;
  font-size: 14px;
  color: #E6A23C;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .user-recharge-page {
    padding: 10px;
  }

  .qrcode-image {
    width: 150px;
    height: 150px;
  }

  .amount-value {
    font-size: 20px;
  }
}
</style>

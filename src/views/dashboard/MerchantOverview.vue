<template>
  <div v-if="isMerchant" class="merchant-dashboard">
    <!-- Google Authenticator Binding Dialog -->
    <el-dialog v-model="googleBindingDialogVisible" title="绑定谷歌验证器" width="500px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="true">
      <div class="google-auth-setup">
        <el-steps :active="googleBindingStep" finish-status="success" simple style="width: 100%">
          <el-step title="下载" />
          <el-step title="扫码" />
          <el-step title="验证" />
        </el-steps>

        <div v-if="googleBindingStep === 0" class="step-content">
          <div class="step-title">步骤 1: 下载谷歌验证器应用</div>
          <p>请在您的移动设备上下载并安装谷歌验证器应用：</p>
          <div class="app-links">
            <el-link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank" type="primary">
              <el-icon>
                <Download />
              </el-icon> 安卓 - Google Play
            </el-link>
            <el-link href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank"
              type="primary">
              <el-icon>
                <Download />
              </el-icon> 苹果 - App Store
            </el-link>
          </div>
          <div class="step-actions">
            <el-button type="primary" @click="googleBindingStep = 1">下一步</el-button>
          </div>
        </div>

        <div v-if="googleBindingStep === 1" class="step-content">
          <div class="step-title">步骤 2: 扫描二维码</div>
          <p>打开谷歌验证器应用并扫描此二维码：</p>
          <div class="qrcode-container">
            <qrcode-vue :value="googleAuthSecret" :size="200" level="H" class="qrcode-image" />
          </div>
          <div class="secret-key">
            <p>手动输入密钥：</p>
            <el-tag size="large">{{ googleAuthSecretKey }}</el-tag>
            <el-button link type="primary" size="small" @click="copyText(googleAuthSecretKey)">
              <el-icon>
                <CopyDocument />
              </el-icon>
            </el-button>
          </div>
          <div class="step-actions">
            <el-button @click="googleBindingStep = 0">返回</el-button>
            <el-button type="primary" @click="googleBindingStep = 2">下一步</el-button>
          </div>
        </div>

        <div v-if="googleBindingStep === 2" class="step-content">
          <div class="step-title">步骤 3: 验证码确认</div>
          <p>请输入谷歌验证器应用中的6位验证码：</p>
          <el-form :model="googleBindingForm" :rules="googleBindingRules" ref="googleBindingFormRef">
            <el-form-item prop="verificationCode">
              <el-input v-model="googleBindingForm.verificationCode" placeholder="请输入6位验证码" maxlength="6"
                class="verification-input" />
            </el-form-item>
            <div class="step-actions">
              <el-button @click="googleBindingStep = 1">返回</el-button>
              <el-button type="primary" @click="verifyAndBindGoogleAuth">完成绑定</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 商户余额卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="balance-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon>
                  <Money />
                </el-icon> 商户余额</h3>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-for="asset in assetsData" :key="asset.symbol">
              <div class="asset-section">
                <div class="asset-title">{{ asset.symbol }}</div>
                <div class="balance-amount">
                  <span class="label">有效余额:</span>
                  <span class="amount">{{ asset.balance }}</span>
                </div>
                <div class="balance-amount">
                  <span class="label">冻结余额:</span>
                  <span class="amount">{{ asset.frozenBalance }}</span>
                </div>
                <div class="balance-amount">
                  <span class="label">总余额:</span>
                  <span class="amount">{{ asset.totalBalance }}</span>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="balance-actions mt-20">
            <el-button type="info" @click="openEditColdWalletDialog">修改冷钱包地址</el-button>
            <el-button type="primary" @click="openRechargeDialog">充值</el-button>
            <el-button type="warning" @click="openWithdrawDialog">提现</el-button>
            <el-button type="success" @click="openUserRechargeTestDialog">用户充值测试</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- API信息和数据概览 -->
    <el-row :gutter="20" class="mt-20">
      <!-- API信息卡片 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="api-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3><el-icon>
                  <Connection />
                </el-icon> API接口信息</h3>
            </div>
          </template>
          <div class="api-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Token">
                <div class="api-value-container">
                  <el-tag size="small" v-if="apiInfo.tokenVisible">{{ apiInfo.token }}</el-tag>
                  <el-tag size="small" v-else>****************</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="showApiValue('token')"
                      v-if="!apiInfo.tokenVisible">
                      <el-icon>
                        <View />
                      </el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="hideApiValue('token')" v-else>
                      <el-icon>
                        <Hide />
                      </el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.token)"
                      v-if="apiInfo.tokenVisible">
                      <el-icon>
                        <CopyDocument />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Secret">
                <div class="api-value-container">
                  <div v-if="apiInfo.secretVisible" style="word-break: break-all;">
                    <el-tag size="small"
                      style="max-width: 100%; white-space: normal; height: auto; line-height: 1.5; padding: 5px;">{{
                        apiInfo.secret }}</el-tag>
                  </div>
                  <el-tag size="small" v-else>****************</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="showApiValue('secret')"
                      v-if="!apiInfo.secretVisible">
                      <el-icon>
                        <View />
                      </el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="hideApiValue('secret')" v-else>
                      <el-icon>
                        <Hide />
                      </el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.secret)"
                      v-if="apiInfo.secretVisible">
                      <el-icon>
                        <CopyDocument />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="回调地址">
                <div class="api-value-container">
                  <el-tag size="small">{{ apiInfo.callbackUrl }}</el-tag>
                  <div class="api-actions">
                    <el-button link type="primary" size="small" @click="editCallbackUrl">
                      <el-icon>
                        <Edit />
                      </el-icon>
                    </el-button>
                    <el-button link type="primary" size="small" @click="copyText(apiInfo.callbackUrl)">
                      <el-icon>
                        <CopyDocument />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="IP白名单">
                <div class="ip-whitelist-container">
                  <div class="ip-whitelist-tags">
                    <el-tag v-for="(ip, index) in apiInfo.ipWhitelist" :key="index" class="ip-tag">
                      {{ ip }}
                    </el-tag>
                    <el-button class="add-ip-button" type="primary" size="small" @click="openAddIpDialog">
                      <el-icon>
                        <Plus />
                      </el-icon>
                    </el-button>
                  </div>
                  <div class="ip-whitelist-info">
                    <small>最多可添加10个IP地址，当前已添加 {{ apiInfo.ipWhitelist.length }} 个</small>
                    <small>（多个IP地址请换行输入，每行一个IP）</small>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <div class="api-doc-link">
              <!-- <el-link type="primary" href="https://vtqvpkz5zj.apifox.cn" target="_blank"> -->
              <el-link type="primary" href="https://docs.xpaylabs.com" target="_blank">
                <el-icon>
                  <Document />
                </el-icon> API接入文档
              </el-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>



    <!-- 充值对话框 -->
    <el-dialog v-model="rechargeDialogVisible" title="充值" width="500px" destroy-on-close>
      <el-form :model="rechargeForm" label-width="120px">
        <el-form-item label="币种">
          <el-select v-model="rechargeForm.currency" placeholder="请选择币种">
            <el-option v-for="currency in getCurrencyOptions()" :key="currency.value" :label="currency.label"
              :value="currency.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" v-if="getChainOptionsBySymbol(rechargeForm.currency).length >= 1">
          <el-select v-model="rechargeForm.chain" placeholder="请选择链">
            <el-option v-for="chain in getChainOptionsBySymbol(rechargeForm.currency)" :key="chain.value"
              :label="chain.label" :value="chain.value" />
          </el-select>
        </el-form-item>
        <el-divider />
        <div class="recharge-address-info">
          <p class="address-label">充值地址:</p>
          <div class="address-value">
            <el-input :value="getRechargeAddress()" readonly>
              <template #append>
                <el-button @click="copyText(getRechargeAddress())">
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="qrcode-container">
            <qrcode-vue :value="getRechargeAddress()" :size="200" level="H" class="qrcode-image" />
          </div>
          <el-alert title="充值提示" type="warning" description="请确保从正规渠道转账，充值将在区块确认后到账，一般需要10-30分钟。" show-icon
            :closable="false" />
        </div>
      </el-form>
    </el-dialog>

    <!-- 提现对话框 -->
    <el-dialog v-model="withdrawDialogVisible" title="提现" width="560px" destroy-on-close>
      <el-form :model="withdrawForm" :rules="withdrawRules" ref="withdrawFormRef" label-width="100px">
        <el-form-item label="币种" prop="currency">
          <el-select v-model="withdrawForm.currency" placeholder="请选择币种">
            <el-option v-for="currency in getCurrencyOptions()" :key="currency.value" :label="currency.label"
              :value="currency.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" prop="chain" v-if="getChainOptionsBySymbol(withdrawForm.currency).length >= 1">
          <el-select v-model="withdrawForm.chain" placeholder="请选择链">
            <el-option v-for="chain in getChainOptionsBySymbol(withdrawForm.currency)" :key="chain.value"
              :label="chain.label" :value="chain.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现地址" prop="address">
          <el-input v-model="withdrawForm.address" placeholder="默认使用冷钱包地址，可修改">
            <template #append>
              <el-button @click="copyText(withdrawForm.address)">
                <el-icon>
                  <CopyDocument />
                </el-icon>
              </el-button>
            </template>
          </el-input>
          <div class="form-tip">默认使用对应链的冷钱包地址，可自行修改</div>
        </el-form-item>
        <el-form-item label="提现数量" prop="amount">
          <el-input-number v-model="withdrawForm.amount" :min="getMinWithdrawAmount()"
            :max="maxWithdrawAmount > getMinWithdrawAmount() ? maxWithdrawAmount : getMinWithdrawAmount()"
            :precision="withdrawForm.currency === 'USDT' || withdrawForm.currency === 'TRX' ? 2 : 4"
            style="width: 100%" />
          <div class="form-tip">
            <div>
              最小提币数量: {{ getMinWithdrawAmount() }} {{ withdrawForm.currency }}
            </div>
            <div>
              最大可提现: <span id="maxWithdrawAmount">{{ truncateDecimal(maxWithdrawAmount, withdrawForm.currency === 'USDT'
                ||
                withdrawForm.currency === 'TRX' ? 2 : 4) }}</span>
              {{ withdrawForm.currency }}
              <el-tooltip content="已扣除gas费和平台手续费" placement="top">
                <el-icon class="info-icon">
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </div>
            <div>
              提现手续费: {{ merchant?.feeRatio || 0.5 }}%
            </div>
          </div>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="withdrawForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWithdraw">提交</el-button>
          <el-button @click="withdrawDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 谷歌验证码对话框 -->
    <el-dialog v-model="googleVerifyDialogVisible" title="谷歌验证" width="400px" destroy-on-close>
      <el-form :model="googleVerifyForm" :rules="googleVerifyRules" ref="googleVerifyFormRef" label-width="100px">
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="googleVerifyForm.code" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGoogleVerify">确认</el-button>
          <el-button @click="googleVerifyDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改回调地址对话框 -->
    <el-dialog v-model="editCallbackDialogVisible" title="修改回调地址" width="500px" destroy-on-close>
      <el-form :model="editCallbackForm" :rules="editCallbackRules" ref="editCallbackFormRef" label-width="100px">
        <el-form-item label="回调地址" prop="url">
          <el-input v-model="editCallbackForm.url" placeholder="请输入新的回调地址" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="editCallbackForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditCallback">确认修改</el-button>
          <el-button @click="editCallbackDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 用户充值测试对话框 -->
    <el-dialog v-model="userRechargeTestDialogVisible" title="用户充值测试" width="500px" destroy-on-close>
      <el-form :model="userRechargeTestForm" label-width="120px">
        <el-form-item label="币种">
          <el-select v-model="userRechargeTestForm.currency" placeholder="请选择币种">
            <el-option v-for="currency in getCurrencyOptions()" :key="currency.value" :label="currency.label"
              :value="currency.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="链" v-if="getChainOptionsBySymbol(userRechargeTestForm.currency).length >= 1">
          <el-select v-model="userRechargeTestForm.chain" placeholder="请选择链">
            <el-option v-for="chain in getChainOptionsBySymbol(userRechargeTestForm.currency)" :key="chain.value"
              :label="chain.label" :value="chain.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="uid">
          <el-input 
            v-model="userRechargeTestForm.uid" 
            placeholder="请输入用户ID（可选）"
            style="width: 100%"
          />
        </el-form-item> -->
        <el-form-item label="充值金额">
          <el-input-number v-model="userRechargeTestForm.amount" :min="0.001"
            :precision="userRechargeTestForm.currency === 'USDT' || userRechargeTestForm.currency === 'TRX' ? 2 : 4"
            style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goToUserRechargeTest">确认</el-button>
          <el-button @click="userRechargeTestDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改冷钱包地址对话框 -->
    <el-dialog v-model="editColdWalletDialogVisible" title="修改冷钱包地址" width="500px" destroy-on-close>
      <el-form :model="editColdWalletForm" :rules="editColdWalletRules" ref="editColdWalletFormRef" label-width="100px">
        <el-form-item label="链" prop="chain">
          <el-select v-model="editColdWalletForm.chain" placeholder="请选择链">
            <el-option v-for="chain in getChainOptions()" :key="chain.value" :label="chain.label"
              :value="chain.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前地址">
          <el-input :value="getCurrentColdAddress()" readonly />
        </el-form-item>
        <el-form-item label="新地址" prop="address">
          <el-input v-model="editColdWalletForm.address" placeholder="请输入新的冷钱包地址" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="editColdWalletForm.code" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditColdWallet">确认修改</el-button>
          <el-button @click="editColdWalletDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!-- IP白名单对话框 -->
    <el-dialog v-model="addIpDialogVisible" title="添加IP白名单" width="500px" destroy-on-close>
      <el-form :model="addIpForm" :rules="addIpRules" ref="addIpFormRef" label-width="100px">
        <el-form-item label="IP地址" prop="ipList">
          <el-input v-model="addIpForm.ipList" type="textarea" :rows="5" placeholder="请输入IP地址，多个IP请换行输入，每行一个IP" />
          <div class="ip-input-tip">
            <small>最多可添加10个IP地址，当前已添加 {{ apiInfo.ipWhitelist.length }} 个，还可添加 {{ 10 - apiInfo.ipWhitelist.length }}
              个</small>
          </div>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="addIpForm.googleCode" placeholder="请输入谷歌验证码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddIp">确认添加</el-button>
          <el-button @click="addIpDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Money, Connection, Document, CopyDocument, DataAnalysis, Histogram, View, Hide, Edit, Download, InfoFilled, Plus } from '@element-plus/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { bind2fa, verify2fa, merchantInfo, merchantApiKey, withdrawal, updateCallbackUrl, setWhitelistIp, updateColdAddress, assetTypeList } from '@/api/xpay/merchant';
import { merchantAssets } from '@/api/xpay/merchantAssets';
import { myAddressList } from '@/api/xpay/merchantAddress';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
// import { Google2fa, Verify2faForm, Verify2faSuccess } from '@/api/xpay/merchant/types';

export default {
  components: {
    Money,
    Connection,
    Document,
    CopyDocument,
    DataAnalysis,
    Histogram,
    View,
    Hide,
    Edit,
    Download,
    InfoFilled,
    QrcodeVue
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const isMerchant = ref(false);
    const merchant = ref({});

    const truncateDecimal = (num, digits) => {
      const factor = 10 ** digits;
      return Math.trunc(num * factor) / factor;
    }

    // 资产数据
    const assetsData = ref([{ symbol: 'USDT', balance: 0, frozenBalance: 0, totalBalance: 0 }]);

    // 地址数据
    const addressData = ref([]);
    // 资产类型数据
    const assetTypeData = ref([]);

    // 加载商户资产
    const loadMerchantAssets = async () => {
      try {
        const { data } = await merchantAssets();
        assetsData.value = data || [];
      } catch (error) {
        console.error('获取商户资产失败:', error);
        ElMessage({
          message: '获取商户资产失败，请刷新页面重试',
          type: 'error'
        });
      }
    };

    // 加载商户地址
    const loadMerchantAddress = async () => {
      try {
        const { data } = await myAddressList();
        addressData.value = data || [];
      } catch (error) {
        console.error('获取商户地址失败:', error);
        ElMessage({
          message: '获取商户地址失败，请刷新页面重试',
          type: 'error'
        });
      }
    };

    // 加载资产类型列表
    const loadAssetTypeList = async () => {
      const { data } = await assetTypeList();
      assetTypeData.value = data || [];

    };

    // 检查用户是否是商户
    const checkIsMerchant = async () => {
      // 检查用户角色是否包含商户角色
      const userRoles = userStore.roles;
      if (userRoles.includes('merchant')) {
        isMerchant.value = true;

        const { data } = await merchantInfo();
        merchant.value = data
        apiInfo.callbackUrl = data.callbackUrl;
        apiInfo.ipWhitelist = data.whiteListIp.split(',');

        // 只有当用户是商户时才执行这些方法
        checkGoogleAuthBinding();
        loadMerchantAssets();
        loadMerchantAddress();
        loadAssetTypeList();

        // 设置每分钟自动刷新一次资产
        // refreshTimer = setInterval(() => {
        //   console.log('自动刷新商户资产和地址...');
        //   loadMerchantAssets();
        //   loadMerchantAddress();
        // }, 60000 * 5); // 60000毫秒 = 1分钟
      } else {
        // 如果不是商户，跳转到其他页面
        // ElMessage({
        //   message: '您不是商户，无法访问商户后台',
        //   type: 'warning'
        // });
        // router.push('/dashboard');
      }
    };

    // Google Authenticator binding status
    const isGoogleAuthBound = ref(false);
    const googleBindingDialogVisible = ref(false);
    const googleBindingStep = ref(0);
    const googleBindingFormRef = ref(null);
    const googleAuthSecretKey = ref(''); // Example secret key, should be generated on server
    const googleAuthSecret = ref('');

    const googleBindingForm = reactive({
      verificationCode: ''
    });

    const googleBindingRules = {
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码必须为6位数字', trigger: 'blur' },
        { pattern: /^[0-9]{6}$/, message: '验证码只能包含数字', trigger: 'blur' }
      ]
    };


    // 自动刷新定时器
    let refreshTimer = null;





    // 检查谷歌验证器是否已绑定
    const checkGoogleAuthBinding = async () => {
      isGoogleAuthBound.value = merchant.value.googleStatus === 'UNBOUND' ? false : true;

      if (!isGoogleAuthBound.value) {
        googleBindingDialogVisible.value = true;
        const { data: { secretKey, qrCodeUrl } } = await bind2fa();
        googleAuthSecretKey.value = secretKey;
        googleAuthSecret.value = qrCodeUrl;
      }

    };

    // 验证并绑定谷歌验证器
    const verifyAndBindGoogleAuth = async () => {
      if (!googleBindingFormRef.value) return;

      googleBindingFormRef.value.validate(async (valid) => {
        if (valid) {
          const { data: { verify } } = await verify2fa({ code: googleBindingForm.verificationCode });
          if (verify) {
            isGoogleAuthBound.value = true;
            googleBindingDialogVisible.value = false;

            ElMessage({
              message: '谷歌验证器绑定成功',
              type: 'success'
            });
          } else {
            ElMessage({
              message: '谷歌验证码错误',
              type: 'error'
            });
          }

        }
      });
    };
    // 页面加载时检查用户是否是商户
    onMounted(async () => {
      checkIsMerchant();
    });

    // 组件卸载时清除定时器
    onUnmounted(() => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    });

    // API信息
    const apiInfo = reactive({
      token: '',
      secret: '',
      callbackUrl: 'https://your-callback-url.com',
      tokenVisible: false,
      secretVisible: false,
      ipWhitelist: []
    });

    // 从assetTypeData获取币种选项
    const getCurrencyOptions = () => {
      if (!assetTypeData.value || assetTypeData.value.length === 0) {
        return [];
      }

      // 去重获取所有币种
      const symbols = [...new Set(assetTypeData.value.map(item => item.symbol))];
      return symbols.map(symbol => ({ label: symbol, value: symbol }));
    };

    // 从assetTypeData获取所有不重复的链选项
    const getChainOptions = () => {
      if (!assetTypeData.value || assetTypeData.value.length === 0) {
        return [];
      }

      // 去重获取所有链
      const chains = [...new Set(assetTypeData.value.map(item => item.chain))];
      return chains.map(chain => ({ label: chain, value: chain }));
    };

    // 根据选择的币种获取对应的链选项
    const getChainOptionsBySymbol = (symbol) => {
      if (!assetTypeData.value || assetTypeData.value.length === 0 || !symbol) {
        return [];
      }

      // 获取该币种对应的所有链
      const chains = assetTypeData.value
        .filter(item => item.symbol === symbol)
        .map(item => item.chain);

      // 去重并转换为选项格式
      const uniqueChains = [...new Set(chains)];
      return uniqueChains.map(chain => ({ label: chain, value: chain }));
    };

    // 根据链名称判断网络类型（主网或测试网）
    const getNetworkType = (chain) => {
      if (!chain) return 'MAIN'; // 默认为主网

      // 从assetTypeData中查找链的网络类型
      const chainData = assetTypeData.value.find(item => item.chain === chain);
      if (chainData) {
        return chainData.network || 'MAIN';
      }

      // 如果在数据中找不到，根据链名称判断
      const testNetKeywords = ['TEST', 'SEPOLIA', 'AMOY', 'FUJI'];
      const isTestNet = testNetKeywords.some(keyword =>
        chain.toUpperCase().includes(keyword)
      );

      return isTestNet ? 'TEST' : 'MAIN';
    };

    // 充值对话框
    const rechargeDialogVisible = ref(false);
    const rechargeForm = reactive({
      currency: 'USDT',
      chain: 'TRON'
    });

    // 提现对话框
    const withdrawDialogVisible = ref(false);
    const withdrawFormRef = ref(null);
    const withdrawForm = reactive({
      currency: 'USDT',
      chain: 'TRON',
      address: '',
      amount: 0,
      googleCode: ''
    });

    // 提现表单验证规则
    const withdrawRules = {
      currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
      chain: [{ required: true, message: '请选择链', trigger: 'change' }],
      address: [{ required: true, message: '请输入提现地址', trigger: 'blur' }],
      amount: [
        { required: true, message: '请输入提现数量', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            const minAmount = getMinWithdrawAmount();
            if (value < minAmount) {
              callback(new Error(`提现数量不能小于${minAmount}`));
            } else if (value > maxWithdrawAmount.value) {
              callback(new Error(`提现数量不能大于${maxWithdrawAmount.value}`));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 谷歌验证对话框
    const googleVerifyDialogVisible = ref(false);
    const googleVerifyFormRef = ref(null);
    const googleVerifyForm = reactive({
      code: '',
      action: '', // 'showToken', 'showSecret', 'editColdWallet'
      data: null // 用于存储额外数据，如编辑冷钱包时的链类型
    });

    // 谷歌验证表单验证规则
    const googleVerifyRules = {
      code: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 修改回调地址对话框
    const editCallbackDialogVisible = ref(false);
    const editCallbackFormRef = ref(null);
    const editCallbackForm = reactive({
      url: '',
      googleCode: ''
    });

    // 修改回调地址表单验证规则
    const editCallbackRules = {
      url: [
        { required: true, message: '请输入回调地址', trigger: 'blur' },
        {
          pattern: /^https?:\/\/.+/,
          message: '请输入正确的URL格式',
          trigger: 'blur'
        }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };



    // IP白名单对话框
    const addIpDialogVisible = ref(false);
    const addIpFormRef = ref(null);
    const addIpForm = reactive({
      ipList: '',
      googleCode: ''
    });

    // IP白名单表单验证规则
    const addIpRules = {
      ipList: [
        { required: true, message: '请输入IP地址', trigger: 'blur' }
      ],
      googleCode: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };

    // 修改冷钱包地址对话框
    const editColdWalletDialogVisible = ref(false);
    const editColdWalletFormRef = ref(null);
    const editColdWalletForm = reactive({
      chain: '',
      address: '',
      code: ''
    });

    // 修改冷钱包地址表单验证规则
    const editColdWalletRules = {
      chain: [
        { required: true, message: '请选择链', trigger: 'change' }
      ],
      address: [
        { required: true, message: '请输入新的冷钱包地址', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '谷歌验证码为6位数字', trigger: 'blur' }
      ]
    };



    // 用户充值测试对话框
    const userRechargeTestDialogVisible = ref(false);
    const userRechargeTestForm = reactive({
      currency: 'USDT',
      chain: 'TRON',
      amount: 0.01,
      uid: ''
    });

    // 打开用户充值测试对话框
    const openUserRechargeTestDialog = () => {
      // 初始化默认币种和链
      const currencies = getCurrencyOptions();
      if (currencies.length > 0) {
        userRechargeTestForm.currency = currencies[0].value;
        const chains = getChainOptionsBySymbol(userRechargeTestForm.currency);
        if (chains.length > 0) {
          userRechargeTestForm.chain = chains[0].value;
        }
      }
      userRechargeTestDialogVisible.value = true;
    };

    // 跳转到用户充值测试页面
    const goToUserRechargeTest = () => {
      // 检查用户ID是否已填写
      // if (!userRechargeTestForm.uid) {
      //   ElMessage({
      //     message: '请输入用户ID',
      //     type: 'warning'
      //   });
      //   return;
      // }

      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('currency', userRechargeTestForm.currency);
      queryParams.append('chain', userRechargeTestForm.chain);
      queryParams.append('amount', userRechargeTestForm.amount.toString());
      queryParams.append('uid', userRechargeTestForm.uid);

      // 添加网络类型信息
      const networkType = getNetworkType(userRechargeTestForm.chain);
      queryParams.append('network', networkType);

      // 关闭对话框
      userRechargeTestDialogVisible.value = false;

      // 在新窗口打开充值测试页面
      window.open(`/user-recharge?${queryParams.toString()}`, '_blank');
    };





    // 打开充值对话框
    const openRechargeDialog = () => {
      // 初始化默认币种和链
      const currencies = getCurrencyOptions();
      if (currencies.length > 0) {
        rechargeForm.currency = currencies[0].value;
        const chains = getChainOptionsBySymbol(rechargeForm.currency);
        if (chains.length > 0) {
          rechargeForm.chain = chains[0].value;
        }
      }
      rechargeDialogVisible.value = true;
    };

    // 获取最小提币数量
    const getMinWithdrawAmount = () => {
      const currency = withdrawForm.currency;

      // 根据不同币种返回最小提币数量
      switch (currency) {
        case 'USDT':
          return 10;
        case 'TRX':
          return 50;
        case 'ETH':
          return 0.002;
        case 'BNB':
          return 0.01;
        default:
          return 0.01;
      }
    };

    // 打开提现对话框
    const openWithdrawDialog = () => {
      // 初始化默认币种和链
      const currencies = getCurrencyOptions();
      if (currencies.length > 0) {
        withdrawForm.currency = currencies[0].value;
        const chains = getChainOptionsBySymbol(withdrawForm.currency);
        if (chains.length > 0) {
          withdrawForm.chain = chains[0].value;
        }
      }
      // 默认填充冷钱包地址
      withdrawForm.address = getWithdrawAddress();
      withdrawDialogVisible.value = true;
      // 计算初始最大可提现金额
      calculateMaxWithdrawAmount();
    };

    // 监听提现表单变化，重新计算最大可提现金额
    watch(
      () => withdrawForm.currency,
      () => {
        calculateMaxWithdrawAmount();
        withdrawForm.amount = getMinWithdrawAmount();
        // 自动选择第一个可用的链
        const chains = getChainOptionsBySymbol(withdrawForm.currency);
        if (chains.length > 0) {
          withdrawForm.chain = chains[0].value;
        }
      }
    );

    // 监听链变化，自动更新提现地址默认值
    watch(
      () => withdrawForm.chain,
      () => {
        withdrawForm.address = getWithdrawAddress();
      }
    );

    // 监听充值表单币种变化
    watch(
      () => rechargeForm.currency,
      () => {
        // 自动选择第一个可用的链
        const chains = getChainOptionsBySymbol(rechargeForm.currency);
        if (chains.length > 0) {
          rechargeForm.chain = chains[0].value;
        }
      }
    );

    // 监听用户充值测试表单币种变化
    watch(
      () => userRechargeTestForm.currency,
      () => {
        // 自动选择第一个可用的链
        const chains = getChainOptionsBySymbol(userRechargeTestForm.currency);
        if (chains.length > 0) {
          userRechargeTestForm.chain = chains[0].value;
        }
      }
    );

    // 获取充值地址
    const getRechargeAddress = () => {
      // 从地址数据中获取对应的热钱包地址
      if (!addressData.value || addressData.value.length === 0) {
        return '';
      }

      // 根据币种和链查找对应的地址
      const address = addressData.value.find(item => {
        return item.symbol === rechargeForm.currency && item.chain === rechargeForm.chain;
      });

      return address ? address.hotAddress || '' : '';
    };

    // 获取提现地址（冷钱包地址）
    const getWithdrawAddress = () => {
      // 从地址数据中获取对应的冷钱包地址
      if (!addressData.value || addressData.value.length === 0) {
        return '';
      }

      // 根据币种和链查找对应的地址
      const address = addressData.value.find(item => {
        return item.symbol === withdrawForm.currency && item.chain === withdrawForm.chain;
      });

      return address ? address.coldAddress || '' : '';
    };



    // 最大可提现金额
    const maxWithdrawAmount = ref(0);

    // 计算最大可提现金额（扣除gas费和平台手续费）
    const calculateMaxWithdrawAmount = async () => {
      // 获取当前选择的币种
      const currency = withdrawForm.currency;

      // 从资产数据中获取对应的余额
      let balance = 0;
      if (assetsData.value && assetsData.value.length > 0) {
        const asset = assetsData.value.find(item => item.symbol === currency);
        balance = asset ? parseFloat(asset.balance) || 0 : 0;
      }

      // 计算平台手续费（百分比）
      const platformFeeRate = (merchant.value?.feeRatio || 0.5) / 100;

      // 计算最大可提现金额（扣除平台手续费）
      const maxAmount = Math.max(balance * (1 - platformFeeRate), 0);
      maxWithdrawAmount.value = truncateDecimal(maxAmount, 4);
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

    // 显示API值（仅第一次需要谷歌验证）
    const showApiValue = (type) => {
      // 如果是token且已经获取过
      if (type === 'token') {
        if (apiInfo.token) {
          apiInfo.tokenVisible = true;
          return;
        }
      }

      // 如果是secret且已经获取过
      if (type === 'secret') {
        if (apiInfo.secret) {
          apiInfo.secretVisible = true;
          return;
        }
      }

      // 如果还没有获取过API信息，需要谷歌验证
      googleVerifyForm.action = type === 'token' ? 'showToken' : 'showSecret';
      googleVerifyDialogVisible.value = true;
    };

    // 隐藏API值
    const hideApiValue = (type) => {
      if (type === 'token') {
        apiInfo.tokenVisible = false;
      } else {
        apiInfo.secretVisible = false;
      }
    };

    // 编辑回调地址
    const editCallbackUrl = () => {
      editCallbackForm.url = apiInfo.callbackUrl;
      editCallbackDialogVisible.value = true;
    };

    // 提交谷歌验证
    const submitGoogleVerify = async () => {
      if (!googleVerifyFormRef.value) return;

      googleVerifyFormRef.value.validate(async (valid) => {
        if (valid) {
          if (googleVerifyForm.action === 'showToken') {
            if (!apiInfo.token) {
              const res = await merchantApiKey({ code: googleVerifyForm.code });
              if (res && res.data) {
                apiInfo.token = res.data.apiKey;
                apiInfo.secret = res.data.webhookSecret;
              }
            }
            apiInfo.tokenVisible = true;

          } else if (googleVerifyForm.action === 'showSecret') {
            if (!apiInfo.secret) {
              const res = await merchantApiKey({ code: googleVerifyForm.code });
              if (res && res.data) {
                apiInfo.token = res.data.apiKey;
                apiInfo.secret = res.data.webhookSecret;
              }
            }
            apiInfo.secretVisible = true;
          }

          googleVerifyDialogVisible.value = false;
          googleVerifyForm.code = '';
        }
      });
    };



    // 打开添加IP白名单对话框
    const openAddIpDialog = () => {
      addIpForm.ipList = apiInfo.ipWhitelist.join('\n');
      addIpForm.googleCode = '';
      addIpDialogVisible.value = true;
    };

    // 打开修改冷钱包地址对话框
    const openEditColdWalletDialog = () => {
      if (!addressData.value || addressData.value.length === 0) {
        ElMessage({
          message: '暂无可用的地址信息',
          type: 'warning'
        });
        return;
      }
      editColdWalletForm.chain = addressData.value[0]?.chain || '';
      editColdWalletForm.address = '';
      editColdWalletForm.code = '';
      editColdWalletDialogVisible.value = true;
    };

    // 获取当前冷钱包地址
    const getCurrentColdAddress = () => {
      if (!addressData.value || addressData.value.length === 0 || !editColdWalletForm.chain) {
        return '';
      }
      const address = addressData.value.find(item => item.chain === editColdWalletForm.chain);
      return address ? address.coldAddress || '' : '';
    };

    // 提交添加IP白名单
    const submitAddIp = async () => {
      if (!addIpFormRef.value) return;

      addIpFormRef.value.validate(async (valid) => {
        if (valid) {
          // 将输入的IP地址按行分割
          const ipList = addIpForm.ipList.split('\n').filter(ip => ip.trim() !== '');

          // 验证IP格式 (支持IPv4和IPv6)
          const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
          const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1}:([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){2}:([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){3}:([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){4}:([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4}:){0,1}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){6}:[0-9a-fA-F]{1,4})$/;
          const invalidIps = ipList.filter(ip => !ipv4Regex.test(ip.trim()) && !ipv6Regex.test(ip.trim()));

          if (invalidIps.length > 0) {
            ElMessage({
              message: `以下IP地址格式不正确: ${invalidIps.join(', ')}`,
              type: 'error'
            });
            return;
          }

          // 检查是否超过最大数量限制
          if (ipList.length > 10) {
            ElMessage({
              message: `IP白名单最多只能添加10个IP地址`,
              type: 'error'
            });
            return;
          }

          // // 检查是否有重复IP
          // const duplicateIps = ipList.filter(ip => apiInfo.ipWhitelist.includes(ip.trim()));
          // if (duplicateIps.length > 0) {
          //   ElMessage({
          //     message: `以下IP地址已存在: ${duplicateIps.join(', ')}，移除重复IP`,
          //     type: 'warning'
          //   });
          //   return;
          // }

          const res = await setWhitelistIp({ ips: ipList, code: addIpForm.googleCode });
          if (res && res.code === 200) {
            ElMessage({
              message: `成功添加${ipList.length}个IP地址到白名单`,
              type: 'success'
            });
            apiInfo.ipWhitelist = ipList;
            addIpDialogVisible.value = false;
            return;
          }
        }
      });
    };



    // 提交修改冷钱包地址
    const submitEditColdWallet = async () => {
      if (!editColdWalletFormRef.value) return;

      editColdWalletFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const res = await updateColdAddress({
              chain: editColdWalletForm.chain,
              coldAddress: editColdWalletForm.address,
              code: parseInt(editColdWalletForm.code)
            });

            if (res && res.code === 200) {
              ElMessage({
                message: '冷钱包地址修改成功',
                type: 'success'
              });

              // 更新本地地址数据
              const addressIndex = addressData.value.findIndex(item => item.chain === editColdWalletForm.chain);
              if (addressIndex !== -1) {
                addressData.value[addressIndex].coldAddress = editColdWalletForm.address;
              }

              editColdWalletDialogVisible.value = false;

              // 重新加载地址数据以确保同步
              loadMerchantAddress();
            } else {
              ElMessage({
                message: res?.msg || '修改失败，请重试',
                type: 'error'
              });
            }
          } catch (error) {
            // console.error('修改冷钱包地址失败:', error);
            // ElMessage({
            //   message: '修改失败，请检查网络连接',
            //   type: 'error'
            // });
          }
        }
      });
    };


    // 提交修改回调地址
    const submitEditCallback = async () => {
      if (!editCallbackFormRef.value) return;

      editCallbackFormRef.value.validate(async (valid) => {
        if (valid) {
          const res = await updateCallbackUrl({ callbackUrl: editCallbackForm.url, code: editCallbackForm.googleCode });
          if (res && res.code === 200) {
            apiInfo.callbackUrl = editCallbackForm.url;
            ElMessage({
              message: '回调地址修改成功',
              type: 'success'
            });
            editCallbackDialogVisible.value = false;
            editCallbackForm.googleCode = '';
          }

        }
      });
    };

    // 提交提现
    const submitWithdraw = async () => {
      if (!withdrawFormRef.value) return;

      // 先检查提现金额是否在有效范围内
      const minAmount = getMinWithdrawAmount();
      if (withdrawForm.amount < minAmount) {
        ElMessage({
          message: `提现数量不能小于${minAmount}`,
          type: 'error'
        });
        return;
      }

      if (withdrawForm.amount > maxWithdrawAmount.value || maxWithdrawAmount.value < minAmount) {
        ElMessage({
          message: `提现数量不能大于${maxWithdrawAmount.value}`,
          type: 'error'
        });
        return;
      }

      withdrawFormRef.value.validate(async (valid) => {
        if (valid) {
          ElMessageBox.confirm(
            `确认提现 ${withdrawForm.amount} ${withdrawForm.currency} 到地址 ${withdrawForm.address}?`,
            '提现确认',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            }
          ).then(async () => {
            const res = await withdrawal({ chain: withdrawForm.chain, address: withdrawForm.address, amount: withdrawForm.amount, symbol: withdrawForm.currency, code: withdrawForm.googleCode });
            if (res && res.code === 200) {
              ElMessage({
                message: '提现申请已提交，请等待处理',
                type: 'success'
              });
              withdrawDialogVisible.value = false;
            } else {
              ElMessage({
                message: '提现申请失败',
                type: 'error'
              });
            }
          }).catch(() => {
            // 用户取消提现
          });
        }
      });
    };

    return {
      isMerchant,
      merchant, // Added merchant ref to the return statement
      assetsData,
      addressData,
      loadMerchantAssets,
      loadMerchantAddress,
      // Google Authenticator binding
      isGoogleAuthBound,
      googleBindingDialogVisible,
      googleBindingStep,
      googleBindingFormRef,
      googleAuthSecret,
      googleAuthSecretKey,
      googleBindingForm,
      googleBindingRules,
      verifyAndBindGoogleAuth,

      apiInfo,
      getCurrencyOptions,
      getChainOptions,
      getChainOptionsBySymbol,
      getNetworkType,

      rechargeDialogVisible,
      rechargeForm,
      withdrawDialogVisible,
      withdrawForm,
      withdrawRules,
      withdrawFormRef,
      googleVerifyDialogVisible,
      googleVerifyForm,
      googleVerifyRules,
      googleVerifyFormRef,
      editCallbackDialogVisible,
      editCallbackForm,
      editCallbackRules,
      editCallbackFormRef,

      // User recharge test
      userRechargeTestDialogVisible,
      userRechargeTestForm,
      openUserRechargeTestDialog,
      goToUserRechargeTest,

      openRechargeDialog,
      openWithdrawDialog,
      getRechargeAddress,
      getWithdrawAddress,
      maxWithdrawAmount,
      calculateMaxWithdrawAmount,
      getMinWithdrawAmount,
      copyText,
      showApiValue,
      hideApiValue,
      editCallbackUrl,
      submitGoogleVerify,
      submitEditCallback,
      submitWithdraw,

      truncateDecimal,
      // IP whitelist methods
      addIpDialogVisible,
      addIpForm,
      addIpRules,
      addIpFormRef,
      openAddIpDialog,
      submitAddIp,

      // 修改冷钱包地址相关
      editColdWalletDialogVisible,
      editColdWalletForm,
      editColdWalletRules,
      editColdWalletFormRef,
      openEditColdWalletDialog,
      getCurrentColdAddress,
      submitEditColdWallet,

    };
  }
};
</script>

<style scoped>
.merchant-dashboard {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.wallet-tabs {
  margin-left: 20px;
}

.balance-card {
  height: 100%;
}

.wallet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9fafc;
}

.asset-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9fafc;
}

.asset-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #409EFF;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 8px;
}

.balance-amount {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.balance-amount .label {
  color: #606266;
}

.balance-amount .amount {
  font-weight: bold;
  font-size: 16px;
}

.wallet-address {
  margin-top: 15px;
}

.address-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 5px;
}

.address-value {
  margin-bottom: 10px;
}

.balance-actions {
  display: flex;
  justify-content: space-around;
}

.api-info {
  margin-bottom: 20px;
}

.api-value-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.api-actions {
  display: flex;
  gap: 5px;
}

.api-doc-link {
  margin-top: 15px;
  text-align: center;
}

.stats-overview-card {
  height: 100%;
}

.stat-item {
  padding: 10px;
  margin-bottom: 15px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-rate {
  font-size: 12px;
  color: #606266;
}

.recharge-address-info {
  padding: 10px;
}

.address-label {
  font-weight: bold;
  margin-bottom: 10px;
}

.address-value {
  margin-bottom: 20px;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.qrcode-image {
  width: 200px;
  height: 200px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  line-height: 1.4;
}

/* Google Authenticator binding styles */
.google-auth-setup {
  padding: 20px 0;
}

.step-content {
  margin-top: 30px;
}

.step-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #409EFF;
}

.app-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.step-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secret-key {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.verification-input {
  width: 200px;
  margin: 0 auto;
  display: block;
}

/* IP whitelist styles */
.ip-whitelist-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ip-whitelist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ip-tag {
  margin-right: 5px;
}

.add-ip-button {
  padding: 5px;
  height: 28px;
}

.ip-whitelist-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.ip-input-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>

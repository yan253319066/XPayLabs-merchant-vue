<template>
  <div v-loading="loading" class="dashboard-stats">
    <div class="toolbar">
      <el-radio-group v-model="range" @change="load">
        <el-radio-button value="today">今日</el-radio-button>
        <el-radio-button value="7d">近7日</el-radio-button>
        <el-radio-button value="30d">近30日</el-radio-button>
      </el-radio-group>
      <el-select
        v-if="isAdmin"
        v-model="merchantId"
        clearable
        filterable
        placeholder="全部商户"
        style="width: 220px; margin-left: 12px"
        @change="load"
      >
        <el-option v-for="m in merchants" :key="m.id" :label="m.name" :value="m.id" />
      </el-select>
      <el-button style="margin-left: 12px" @click="load">刷新</el-button>
    </div>

    <div v-if="loadError" class="error-panel">
      <el-alert type="error" :title="errorMsg" show-icon :closable="false" />
      <el-button type="primary" class="retry-btn" @click="load">重试</el-button>
    </div>

    <template v-else-if="stats">
      <!-- A 交易量 -->
      <div class="section-header">交易量</div>
      <el-row :gutter="16" class="metric-row">
        <el-col :xs="24" :sm="12">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">代收</div>
            <div class="bucket-grid">
              <div>
                <div class="stat-sub">总笔数</div>
                <div class="stat-value">{{ trade.collection.totalCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功笔数</div>
                <div class="stat-value">{{ trade.collection.successCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功金额</div>
                <div class="stat-value amount">{{ trade.collection.successAmount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功率</div>
                <div class="stat-value">{{ trade.collection.successRate ?? '0.00%' }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">代付</div>
            <div class="bucket-grid">
              <div>
                <div class="stat-sub">总笔数</div>
                <div class="stat-value">{{ trade.payout.totalCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功笔数</div>
                <div class="stat-value">{{ trade.payout.successCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功金额</div>
                <div class="stat-value amount">{{ trade.payout.successAmount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功率</div>
                <div class="stat-value">{{ trade.payout.successRate ?? '0.00%' }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="table-card">
        <template #header>按币种</template>
        <el-table :data="trade.bySymbol" border empty-text="暂无数据">
          <el-table-column prop="symbol" label="币种" min-width="100" />
          <el-table-column label="类型" min-width="100">
            <template #default="{ row }">{{ orderTypeLabel(row.orderType) }}</template>
          </el-table-column>
          <el-table-column prop="successCount" label="成功笔数" min-width="110" />
          <el-table-column prop="successAmount" label="成功金额" min-width="140" />
        </el-table>
      </el-card>

      <!-- B 资金 -->
      <div class="section-header">资金</div>
      <el-row :gutter="16" class="metric-row">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">充值</div>
            <div class="bucket-grid two">
              <div>
                <div class="stat-sub">成功笔数</div>
                <div class="stat-value">{{ fund.recharge.successCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功金额</div>
                <div class="stat-value amount">{{ fund.recharge.successAmount ?? 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">提现</div>
            <div class="bucket-grid two">
              <div>
                <div class="stat-sub">成功笔数</div>
                <div class="stat-value">{{ fund.withdraw.successCount ?? 0 }}</div>
              </div>
              <div>
                <div class="stat-sub">成功金额</div>
                <div class="stat-value amount">{{ fund.withdraw.successAmount ?? 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">手续费合计</div>
            <div class="stat-value amount">{{ fund.feeTotal ?? 0 }}</div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="table-card">
        <template #header>按币种</template>
        <el-table :data="fund.bySymbol" border empty-text="暂无数据">
          <el-table-column prop="symbol" label="币种" min-width="100" />
          <el-table-column label="类型" min-width="100">
            <template #default="{ row }">{{ orderTypeLabel(row.orderType) }}</template>
          </el-table-column>
          <el-table-column prop="successCount" label="成功笔数" min-width="110" />
          <el-table-column prop="successAmount" label="成功金额" min-width="140" />
        </el-table>
      </el-card>

      <!-- C 健康 -->
      <div class="section-header">运营健康</div>
      <el-row :gutter="16" class="metric-row">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">失败订单</div>
            <div class="stat-value" :class="{ warn: (health.failedOrderCount ?? 0) > 0 }">
              {{ health.failedOrderCount ?? 0 }}
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">过期订单</div>
            <div class="stat-value" :class="{ warn: (health.expiredOrderCount ?? 0) > 0 }">
              {{ health.expiredOrderCount ?? 0 }}
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">回调失败</div>
            <div class="stat-value" :class="{ warn: (health.callbackFailCount ?? 0) > 0 }">
              {{ health.callbackFailCount ?? 0 }}
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">待确认</div>
            <div class="stat-value">{{ health.pendingConfirmCount ?? 0 }}</div>
          </el-card>
        </el-col>
      </el-row>

      <template v-if="isAdmin">
        <el-row :gutter="16" class="metric-row">
          <el-col :xs="24" :sm="12">
            <el-card shadow="hover" class="stat-card clickable" @click="goTo('/xpay/errorBlock')">
              <div class="stat-label">错误块</div>
              <div class="stat-value" :class="{ warn: (health.errorBlockCount ?? 0) > 0 }">
                {{ health.errorBlockCount ?? 0 }}
              </div>
              <div class="stat-hint">点击查看错误块</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-card shadow="hover" class="stat-card clickable" @click="goTo('/xpay/blockHeightTracker')">
              <div class="stat-label">过期 Tracker</div>
              <div class="stat-value" :class="{ warn: staleTrackers.length > 0 }">
                {{ staleTrackers.length }}
              </div>
              <div class="stat-hint">点击查看区块高度追踪</div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" class="table-card">
          <template #header>
            <div class="card-header">
              <span>过期链 Tracker</span>
              <el-button link type="primary" @click="goTo('/xpay/blockHeightTracker')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="staleTrackers" border empty-text="暂无过期 Tracker">
            <el-table-column prop="chain" label="链" min-width="120" />
            <el-table-column prop="lastHeight" label="最后高度" min-width="140" />
            <el-table-column prop="updateTime" label="更新时间" min-width="180" />
          </el-table>
        </el-card>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getDashboardStats } from '@/api/xpay/dashboard';
import type { DashboardRange, DashboardStatsVO } from '@/api/xpay/dashboard/types';
import { listMerchant } from '@/api/xpay/merchant';
import type { MerchantVO } from '@/api/xpay/merchant/types';

const props = defineProps<{
  isAdmin: boolean;
}>();

const router = useRouter();
const loading = ref(false);
const loadError = ref(false);
const errorMsg = ref('加载统计失败');
const range = ref<DashboardRange>('today');
const merchantId = ref<number | string | undefined>(undefined);
const merchants = ref<MerchantVO[]>([]);
const stats = ref<DashboardStatsVO | null>(null);

const emptyBucket = () => ({
  totalCount: 0,
  successCount: 0,
  successAmount: 0,
  successRate: '0.00%'
});

const trade = computed(
  () =>
    stats.value?.trade ?? {
      collection: emptyBucket(),
      payout: emptyBucket(),
      bySymbol: []
    }
);

const fund = computed(
  () =>
    stats.value?.fund ?? {
      recharge: emptyBucket(),
      withdraw: emptyBucket(),
      feeTotal: 0,
      bySymbol: []
    }
);

const health = computed(
  () =>
    stats.value?.health ?? {
      failedOrderCount: 0,
      expiredOrderCount: 0,
      callbackFailCount: 0,
      pendingConfirmCount: 0,
      errorBlockCount: 0,
      staleTrackers: []
    }
);

const staleTrackers = computed(() => (props.isAdmin ? (health.value.staleTrackers ?? []) : []));

const orderTypeLabel = (type?: string) => {
  const map: Record<string, string> = {
    COLLECTION: '代收',
    PAYOUT: '代付',
    RECHARGE: '充值',
    WITHDRAW: '提现'
  };
  return type ? map[type] ?? type : '-';
};

const loadMerchants = async () => {
  try {
    const res = await listMerchant({ pageNum: 1, pageSize: 500 });
    merchants.value = res.rows ?? [];
  } catch {
    merchants.value = [];
  }
};

const load = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    const { data } = await getDashboardStats(range.value, merchantId.value || undefined);
    stats.value = data ?? null;
  } catch (e: any) {
    loadError.value = true;
    stats.value = null;
    errorMsg.value = e?.message || '加载统计失败';
    ElMessage.error(errorMsg.value);
  } finally {
    loading.value = false;
  }
};

const goTo = (path: string) => {
  router.push(path).catch(() => {
    ElMessage.warning('页面路由暂不可用，请从侧栏菜单进入');
  });
};

onMounted(() => {
  if (props.isAdmin) {
    loadMerchants();
  }
  load();
});
</script>

<style scoped>
.dashboard-stats {
  min-height: 200px;
  padding: 4px 0 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}

.error-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 8px;
}

.retry-btn {
  margin-left: 0;
}

.section-header {
  margin: 8px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.metric-row {
  margin-bottom: 16px;
}

.stat-card {
  margin-bottom: 12px;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  border-color: var(--el-color-primary-light-5);
}

.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.stat-sub {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--el-text-color-primary);
  word-break: break-all;
}

.stat-value.amount {
  font-size: 20px;
}

.stat-value.warn {
  color: var(--el-color-danger);
}

.stat-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.bucket-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 8px;
}

.bucket-grid.two {
  grid-template-columns: 1fr 1fr;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

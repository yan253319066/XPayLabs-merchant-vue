<template>
  <div v-loading="loading" class="admin-overview">
    <div v-if="loadError" class="error-panel">
      <el-alert type="error" :title="errorMsg" show-icon :closable="false" />
      <el-button type="primary" class="retry-btn" @click="fetchOverview">重试</el-button>
    </div>

    <template v-else-if="overview">
      <div class="section-header">平台快照</div>
      <el-row :gutter="16" class="snapshot-row">
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">商户总数</div>
            <div class="stat-value">{{ overview.merchantTotal ?? 0 }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">今日活跃商户</div>
            <div class="stat-value">{{ overview.activeMerchantToday ?? 0 }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">今日代收笔数</div>
            <div class="stat-value">{{ overview.todayCollectionCount ?? 0 }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">今日代收金额</div>
            <div class="stat-value amount">{{ overview.todayCollectionAmount ?? 0 }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">今日代付笔数</div>
            <div class="stat-value">{{ overview.todayPayoutCount ?? 0 }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">今日代付金额</div>
            <div class="stat-value amount">{{ overview.todayPayoutAmount ?? 0 }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="section-header">系统健康</div>
      <el-row :gutter="16" class="health-row">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            shadow="hover"
            class="stat-card clickable"
            @click="goTo('/xpay/callbackNotice')"
          >
            <div class="stat-label">回调失败</div>
            <div class="stat-value" :class="{ warn: (overview.callbackFailCount ?? 0) > 0 }">
              {{ overview.callbackFailCount ?? 0 }}
            </div>
            <div class="stat-hint">点击查看回调通知</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            shadow="hover"
            class="stat-card clickable"
            @click="goTo('/xpay/errorBlock')"
          >
            <div class="stat-label">错误块</div>
            <div class="stat-value" :class="{ warn: (overview.errorBlockCount ?? 0) > 0 }">
              {{ overview.errorBlockCount ?? 0 }}
            </div>
            <div class="stat-hint">点击查看错误块</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card
            shadow="hover"
            class="stat-card clickable"
            @click="goTo('/xpay/blockHeightTracker')"
          >
            <div class="stat-label">过期 Tracker</div>
            <div class="stat-value" :class="{ warn: staleTrackers.length > 0 }">
              {{ staleTrackers.length }}
            </div>
            <div class="stat-hint">点击查看区块高度追踪</div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="tracker-card">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getAdminOverview } from '@/api/xpay/dashboard';
import type { DashboardAdminOverviewVO } from '@/api/xpay/dashboard/types';

const router = useRouter();
const loading = ref(false);
const loadError = ref(false);
const errorMsg = ref('加载平台概览失败');
const overview = ref<DashboardAdminOverviewVO | null>(null);

const staleTrackers = computed(() => overview.value?.staleTrackers ?? []);

const fetchOverview = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    const res = await getAdminOverview();
    overview.value = (res as any).data ?? res;
  } catch (e: any) {
    loadError.value = true;
    overview.value = null;
    errorMsg.value = e?.message || '加载平台概览失败';
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
  fetchOverview();
});
</script>

<style scoped>
.admin-overview {
  min-height: 200px;
  padding: 4px 0 16px;
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

.snapshot-row,
.health-row {
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

.tracker-card {
  margin-top: 4px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

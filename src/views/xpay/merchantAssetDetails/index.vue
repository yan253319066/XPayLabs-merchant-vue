<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="交易流水号" prop="transactionNo" label-width="100px">
              <el-input v-model="queryParams.transactionNo" placeholder="请输入交易流水号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择" clearable>
                <el-option label="充值" value="RECHARGE" />
                <el-option label="提现" value="WITHDRAW" />
                <el-option label="提现请求" value="WITHDRAW_REQUEST" />
                <el-option label="代收" value="PAYIN" />
                <el-option label="代付" value="PAYOUT" />
                <el-option label="代付请求" value="PAYOUT_REQUEST" />
                <el-option label="提现退款" value="WITHDRAW_REFUND" />
                <el-option label="代付退款" value="PAYOUT_REFUND" />
                <el-option label="法币代收" value="FIAT_CURRENCY_PAYIN" />
                <el-option label="法币代付" value="FIAT_CURRENCY_PAYOUT" />
                <el-option label="法币代付请求" value="FIAT_CURRENCY_PAYOUT_REQUEST" />
                <el-option label="法币代付退款" value="FIAT_CURRENCY_PAYOUT_REFUND" />
              </el-select>
            </el-form-item>
            <el-form-item label="收支" prop="inOut">
              <el-select v-model="queryParams.inOut" placeholder="请选择" clearable>
                <el-option label="收入" value="IN" />
                <el-option label="支出" value="OUT" />
                <el-option label="转入冻结" value="TO_FROZEN" />
                <el-option label="解冻" value="TO_UNFROZEN" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeCreateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantAssetDetails:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantAssetDetailsList">
        <el-table-column label="ID" align="center" prop="id" width="180" />
        <el-table-column label="交易流水号" align="center" prop="transactionNo" min-width="160" />
        <el-table-column label="商家ID" align="center" prop="merchantId" width="100" />
        <el-table-column label="币种" align="center" prop="symbol" width="80" />
        <el-table-column label="类型" align="center" prop="type" width="120">
          <template #default="scope">
            <el-tag :type="typeTagType(scope.row.type)">{{ typeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="收支" align="center" prop="inOut" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.inOut === 'IN'" type="success">收入</el-tag>
            <el-tag v-else-if="scope.row.inOut === 'OUT'" type="danger">支出</el-tag>
            <el-tag v-else-if="scope.row.inOut === 'TO_FROZEN'" type="warning">转入冻结</el-tag>
            <el-tag v-else type="info">解冻</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变动金额" align="center" prop="amount" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.amount).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动前可用" align="center" prop="oldBalance" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.oldBalance).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动后可用" align="center" prop="newBalance" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.newBalance).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动前冻结" align="center" prop="oldFrozen" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.oldFrozen).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动后冻结" align="center" prop="newFrozen" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.newFrozen).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手续费" align="center" prop="fee" width="120">
          <template #default="scope">
            <span>{{ Number(scope.row.fee).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手续费币种" align="center" prop="feeSymbol" width="100" />
        <el-table-column label="兑换汇率" align="center" prop="rate" width="100">
          <template #default="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{mi}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="MerchantAssetDetails" lang="ts">
import { listMerchantAssetDetails } from '@/api/xpay/merchantAssetDetails';
import { MerchantAssetDetailsVO, MerchantAssetDetailsQuery } from '@/api/xpay/merchantAssetDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantAssetDetailsList = ref<MerchantAssetDetailsVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();

const queryParams = reactive<MerchantAssetDetailsQuery>({
  pageNum: 1,
  pageSize: 10,
  transactionNo: undefined,
  merchantId: undefined,
  symbol: undefined,
  type: undefined,
  inOut: undefined,
  params: {
    createTime: undefined
  }
});

const typeLabelMap: Record<string, string> = {
  RECHARGE: '充值',
  WITHDRAW: '提现',
  WITHDRAW_REQUEST: '提现请求',
  PAYIN: '代收',
  PAYOUT: '代付',
  PAYOUT_REQUEST: '代付请求',
  WITHDRAW_REFUND: '提现退款',
  PAYOUT_REFUND: '代付退款',
  FIAT_CURRENCY_PAYIN: '法币代收',
  FIAT_CURRENCY_PAYOUT: '法币代付',
  FIAT_CURRENCY_PAYOUT_REQUEST: '法币代付请求',
  FIAT_CURRENCY_PAYOUT_REFUND: '法币代付退款'
};

const typeTagMap: Record<string, string> = {
  RECHARGE: 'success',
  WITHDRAW: 'danger',
  WITHDRAW_REQUEST: 'warning',
  PAYIN: 'success',
  PAYOUT: 'danger',
  PAYOUT_REQUEST: 'warning',
  WITHDRAW_REFUND: 'info',
  PAYOUT_REFUND: 'info',
  FIAT_CURRENCY_PAYIN: 'success',
  FIAT_CURRENCY_PAYOUT: 'danger',
  FIAT_CURRENCY_PAYOUT_REQUEST: 'warning',
  FIAT_CURRENCY_PAYOUT_REFUND: 'info'
};

const typeLabel = (type: string) => typeLabelMap[type] || type;
const typeTagType = (type: string) => typeTagMap[type] || 'info';

const getList = async () => {
  loading.value = true;
  queryParams.params = {};
  proxy?.addDateRange(queryParams, dateRangeCreateTime.value, 'CreateTime');
  const res = await listMerchantAssetDetails(queryParams);
  merchantAssetDetailsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
};

const handleExport = () => {
  proxy?.download(
    'xpay/merchantAssetDetails/export',
    {
      ...queryParams
    },
    `merchantAssetDetails_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>

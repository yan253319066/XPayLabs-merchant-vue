<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            
            <el-form-item label="链" prop="chain">
              <el-select v-model="queryParams.chain" clearable placeholder="请选择链" @keyup.enter="handleQuery">
                <el-option key="TRON" label="TRON" value="TRON" />
                <el-option key="ETH" label="ETH" value="ETH" />
                <el-option key="BSC" label="BSC" value="BSC" />
              </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-select v-model="queryParams.symbol" clearable placeholder="请选择币种" @keyup.enter="handleQuery">
                <el-option key="USDT" label="USDT" value="USDT" />
                <el-option key="TRX" label="TRX" value="TRX" />
                <el-option key="ETH" label="ETH" value="ETH" />
                <el-option key="BNB" label="BNB" value="BNB" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="支付地址" prop="payAddress">
              <el-input v-model="queryParams.payAddress" placeholder="请输入支付地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="接收地址" prop="receiveAddress">
              <el-input v-model="queryParams.receiveAddress" placeholder="请输入接收地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="数量" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="失败原因" prop="reason">
              <el-input v-model="queryParams.reason" placeholder="请输入失败原因" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="txId" prop="txId">
              <el-input v-model="queryParams.txId" placeholder="请输入txId" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="GAS费" prop="txGas">
              <el-input v-model="queryParams.txGas" placeholder="请输入GAS费" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手续费" prop="fee">
              <el-input v-model="queryParams.fee" placeholder="请输入手续费" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchantRechargeWithdraw:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchantRechargeWithdraw:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchantRechargeWithdraw:remove']">删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantRechargeWithdraw:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantRechargeWithdrawList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="txId" align="center" prop="txId" /> -->
        <!-- <el-table-column label="商家ID" align="center" prop="merchantId" /> -->
        <el-table-column label="订单号" align="center" prop="transactionNo" />
        <el-table-column label="类型" align="center" prop="type" >
          <template #default="scope">
            <el-tag v-if="scope.row.type === 'RECHARGE'" type="success">充值</el-tag>
            <el-tag v-else type="info">提现</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="链" align="center" prop="chain" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <!-- <el-table-column label="支付地址" align="center" prop="payAddress" />
        <el-table-column label="接收地址" align="center" prop="receiveAddress" /> -->
        <el-table-column label="数量" align="center" prop="amount" />
        <el-table-column label="状态" align="center" prop="status" >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'INIT'" type="warning">待审核</el-tag>
            <el-tag v-if="scope.row.status === 'APPROVED'" type="warning">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 'REJECTED'" type="warning">拒绝</el-tag>
            <el-tag v-if="scope.row.status === 'SUBMITTED'" type="warning">已提交</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING'" type="warning">等待</el-tag>
            <el-tag v-else-if="scope.row.status === 'SUCCESS'" type="success">成功</el-tag>
            <el-tag v-else-if="scope.row.status === 'FAILED'" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="GAS费" align="center" prop="txGas" /> -->
        <el-table-column label="手续费(含矿工费)" align="center" prop="fee" />
        <el-table-column label="费率(%)" align="center" prop="rate" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失败原因" align="center" prop="reason" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip v-if="scope.row.status === 'INIT'" content="审核" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleApproval(scope.row)" v-hasPermi="['xpay:merchantRechargeWithdraw:approve']"></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchantRechargeWithdraw:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchantRechargeWithdraw:remove']"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商家充值提现对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantRechargeWithdrawFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="支付地址" prop="payAddress">
          <el-input v-model="form.payAddress" placeholder="请输入支付地址" />
        </el-form-item>
        <el-form-item label="接收地址" prop="receiveAddress">
          <el-input v-model="form.receiveAddress" placeholder="请输入接收地址" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="失败原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入失败原因" />
        </el-form-item>
        <el-form-item label="txId" prop="txId">
          <el-input v-model="form.txId" placeholder="请输入txId" />
        </el-form-item>
        <el-form-item label="GAS费" prop="txGas">
          <el-input v-model="form.txGas" placeholder="请输入GAS费" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 审核对话框 -->
    <el-dialog title="审核" v-model="approveDialogVisible" width="500px" append-to-body>
      <el-form label-width="80px">
        <el-form-item label="订单号">{{ approveRow.transactionNo }}</el-form-item>
        <el-form-item label="类型">{{ approveRow.type === 'RECHARGE' ? '充值' : '提现' }}</el-form-item>
        <el-form-item label="数量">{{ approveRow.amount }}</el-form-item>
        <el-form-item label="拒绝原因" v-if="showRejectInput">
          <el-input v-model="rejectReason" type="textarea" placeholder="请输入拒绝原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelApprove">取 消</el-button>
          <el-button v-if="!showRejectInput" type="danger" @click="showRejectInput = true">拒 绝</el-button>
          <el-button v-if="showRejectInput" type="danger" @click="submitReject" :loading="approveLoading">确认拒绝</el-button>
          <el-button type="primary" @click="onApprove" :loading="approveLoading">通 过</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MerchantRechargeWithdraw" lang="ts">
import { listMerchantRechargeWithdraw, getMerchantRechargeWithdraw, delMerchantRechargeWithdraw, addMerchantRechargeWithdraw, updateMerchantRechargeWithdraw, approveMerchantRechargeWithdraw, unapproveMerchantRechargeWithdraw } from '@/api/xpay/merchantRechargeWithdraw';
import { MerchantRechargeWithdrawVO, MerchantRechargeWithdrawQuery, MerchantRechargeWithdrawForm } from '@/api/xpay/merchantRechargeWithdraw/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantRechargeWithdrawList = ref<MerchantRechargeWithdrawVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const approveDialogVisible = ref(false);
const approveRow = ref<MerchantRechargeWithdrawVO>({} as MerchantRechargeWithdrawVO);
const showRejectInput = ref(false);
const rejectReason = ref('');
const approveLoading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const merchantRechargeWithdrawFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantRechargeWithdrawForm = {
  id: undefined,
  merchantId: undefined,
  type: undefined,
  chain: undefined,
  symbol: undefined,
  payAddress: undefined,
  receiveAddress: undefined,
  amount: undefined,
  status: undefined,
  reason: undefined,
  txId: undefined,
  txGas: undefined,
  fee: undefined,
}
const data = reactive<PageData<MerchantRechargeWithdrawForm, MerchantRechargeWithdrawQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    type: undefined,
    chain: undefined,
    symbol: undefined,
    payAddress: undefined,
    receiveAddress: undefined,
    amount: undefined,
    status: undefined,
    reason: undefined,
    txId: undefined,
    txGas: undefined,
    fee: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    merchantId: [
      { required: true, message: "商家ID不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "记录类型：充值，提现不能为空", trigger: "change" }
    ],
    chain: [
      { required: true, message: "链不能为空", trigger: "change" }
    ],
    symbol: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    payAddress: [
      { required: true, message: "支付地址不能为空", trigger: "blur" }
    ],
    receiveAddress: [
      { required: true, message: "接收地址不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态：PENDING,SUCCESS,FAILED;不能为空", trigger: "change" }
    ],
    reason: [
      { required: true, message: "失败原因不能为空", trigger: "blur" }
    ],
    txId: [
      { required: true, message: "txId不能为空", trigger: "blur" }
    ],
    txGas: [
      { required: true, message: "GAS费不能为空", trigger: "blur" }
    ],
    fee: [
      { required: true, message: "手续费不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商家充值提现列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listMerchantRechargeWithdraw(queryParams.value);
  merchantRechargeWithdrawList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  merchantRechargeWithdrawFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MerchantRechargeWithdrawVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商家充值提现";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MerchantRechargeWithdrawVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMerchantRechargeWithdraw(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商家充值提现";
}

/** 提交按钮 */
const submitForm = () => {
  merchantRechargeWithdrawFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchantRechargeWithdraw(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMerchantRechargeWithdraw(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MerchantRechargeWithdrawVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商家充值提现编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMerchantRechargeWithdraw(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/merchantRechargeWithdraw/export', {
    ...queryParams.value
  }, `merchantRechargeWithdraw_${new Date().getTime()}.xlsx`)
}

/** 打开审核对话框 */
const handleApproval = (row: MerchantRechargeWithdrawVO) => {
  approveRow.value = row;
  showRejectInput.value = false;
  rejectReason.value = '';
  approveDialogVisible.value = true;
}

/** 审核通过 */
const onApprove = async () => {
  await proxy?.$modal.confirm('确认审核通过？').finally(() => approveLoading.value = false);
  approveLoading.value = true;
  try {
    await approveMerchantRechargeWithdraw(approveRow.value.id);
    proxy?.$modal.msgSuccess('审核通过');
    approveDialogVisible.value = false;
    await getList();
  } finally {
    approveLoading.value = false;
  }
}

/** 提交拒绝 */
const submitReject = async () => {
  if (!rejectReason.value) {
    proxy?.$modal.msgWarning('请输入拒绝原因');
    return;
  }
  approveLoading.value = true;
  try {
    await unapproveMerchantRechargeWithdraw(approveRow.value.id, rejectReason.value);
    proxy?.$modal.msgSuccess('已拒绝');
    approveDialogVisible.value = false;
    await getList();
  } finally {
    approveLoading.value = false;
  }
}

/** 取消审核 */
const cancelApprove = () => {
  approveDialogVisible.value = false;
  rejectReason.value = '';
  showRejectInput.value = false;
}

onMounted(() => {
  getList();
});
</script>

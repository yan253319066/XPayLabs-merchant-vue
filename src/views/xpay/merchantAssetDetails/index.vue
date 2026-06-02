<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="交易流水号" prop="transactionNo">
              <el-input v-model="queryParams.transactionNo" placeholder="请输入交易流水号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种符号" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种符号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动金额" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入变动金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动前可用余额" prop="oldBalance">
              <el-input v-model="queryParams.oldBalance" placeholder="请输入变动前可用余额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动后可用余额" prop="newBalance">
              <el-input v-model="queryParams.newBalance" placeholder="请输入变动后可用余额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动前冻结余额" prop="oldFrozen">
              <el-input v-model="queryParams.oldFrozen" placeholder="请输入变动前冻结余额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动后冻结余额" prop="newFrozen">
              <el-input v-model="queryParams.newFrozen" placeholder="请输入变动后冻结余额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收入/支出IN/OUT" prop="inOut">
              <el-input v-model="queryParams.inOut" placeholder="请输入收入/支出IN/OUT" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手续费" prop="fee">
              <el-input v-model="queryParams.fee" placeholder="请输入手续费" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手续费费率" prop="feerate">
              <el-input v-model="queryParams.feerate" placeholder="请输入手续费费率" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手续费币种" prop="feeSymbol">
              <el-input v-model="queryParams.feeSymbol" placeholder="请输入手续费币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="兑换汇率" prop="rate">
              <el-input v-model="queryParams.rate" placeholder="请输入兑换汇率" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchantAssetDetails:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchantAssetDetails:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchantAssetDetails:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantAssetDetails:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantAssetDetailsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="交易流水号" align="center" prop="transactionNo" />
        <el-table-column label="商家ID" align="center" prop="merchantId" />
        <el-table-column label="币种符号" align="center" prop="symbol" />
        <el-table-column label="变动金额" align="center" prop="amount" />
        <el-table-column label="变动前可用余额" align="center" prop="oldBalance" />
        <el-table-column label="变动后可用余额" align="center" prop="newBalance" />
        <el-table-column label="变动前冻结余额" align="center" prop="oldFrozen" />
        <el-table-column label="变动后冻结余额" align="center" prop="newFrozen" />
        <el-table-column label="类型:deposit/withdraw/payin/payout" align="center" prop="type" />
        <el-table-column label="收入/支出IN/OUT" align="center" prop="inOut" />
        <el-table-column label="手续费" align="center" prop="fee" />
        <el-table-column label="手续费费率" align="center" prop="feerate" />
        <el-table-column label="手续费币种" align="center" prop="feeSymbol" />
        <el-table-column label="兑换汇率" align="center" prop="rate" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchantAssetDetails:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchantAssetDetails:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改资产变动明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantAssetDetailsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="交易流水号" prop="transactionNo">
          <el-input v-model="form.transactionNo" placeholder="请输入交易流水号" />
        </el-form-item>
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="币种符号" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种符号" />
        </el-form-item>
        <el-form-item label="变动金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入变动金额" />
        </el-form-item>
        <el-form-item label="变动前可用余额" prop="oldBalance">
          <el-input v-model="form.oldBalance" placeholder="请输入变动前可用余额" />
        </el-form-item>
        <el-form-item label="变动后可用余额" prop="newBalance">
          <el-input v-model="form.newBalance" placeholder="请输入变动后可用余额" />
        </el-form-item>
        <el-form-item label="变动前冻结余额" prop="oldFrozen">
          <el-input v-model="form.oldFrozen" placeholder="请输入变动前冻结余额" />
        </el-form-item>
        <el-form-item label="变动后冻结余额" prop="newFrozen">
          <el-input v-model="form.newFrozen" placeholder="请输入变动后冻结余额" />
        </el-form-item>
        <el-form-item label="收入/支出IN/OUT" prop="inOut">
          <el-input v-model="form.inOut" placeholder="请输入收入/支出IN/OUT" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="手续费费率" prop="feerate">
          <el-input v-model="form.feerate" placeholder="请输入手续费费率" />
        </el-form-item>
        <el-form-item label="手续费币种" prop="feeSymbol">
          <el-input v-model="form.feeSymbol" placeholder="请输入手续费币种" />
        </el-form-item>
        <el-form-item label="兑换汇率" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入兑换汇率" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MerchantAssetDetails" lang="ts">
import { listMerchantAssetDetails, getMerchantAssetDetails, delMerchantAssetDetails, addMerchantAssetDetails, updateMerchantAssetDetails } from '@/api/xpay/merchantAssetDetails';
import { MerchantAssetDetailsVO, MerchantAssetDetailsQuery, MerchantAssetDetailsForm } from '@/api/xpay/merchantAssetDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantAssetDetailsList = ref<MerchantAssetDetailsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const merchantAssetDetailsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantAssetDetailsForm = {
  id: undefined,
  transactionNo: undefined,
  merchantId: undefined,
  symbol: undefined,
  amount: undefined,
  oldBalance: undefined,
  newBalance: undefined,
  oldFrozen: undefined,
  newFrozen: undefined,
  type: undefined,
  inOut: undefined,
  fee: undefined,
  feerate: undefined,
  feeSymbol: undefined,
  rate: undefined,
  remark: undefined,
}
const data = reactive<PageData<MerchantAssetDetailsForm, MerchantAssetDetailsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    transactionNo: undefined,
    merchantId: undefined,
    symbol: undefined,
    amount: undefined,
    oldBalance: undefined,
    newBalance: undefined,
    oldFrozen: undefined,
    newFrozen: undefined,
    type: undefined,
    inOut: undefined,
    fee: undefined,
    feerate: undefined,
    feeSymbol: undefined,
    rate: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    transactionNo: [
      { required: true, message: "交易流水号不能为空", trigger: "blur" }
    ],
    merchantId: [
      { required: true, message: "商家ID不能为空", trigger: "blur" }
    ],
    symbol: [
      { required: true, message: "币种符号不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "变动金额不能为空", trigger: "blur" }
    ],
    oldBalance: [
      { required: true, message: "变动前可用余额不能为空", trigger: "blur" }
    ],
    newBalance: [
      { required: true, message: "变动后可用余额不能为空", trigger: "blur" }
    ],
    oldFrozen: [
      { required: true, message: "变动前冻结余额不能为空", trigger: "blur" }
    ],
    newFrozen: [
      { required: true, message: "变动后冻结余额不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型:deposit/withdraw/payin/payout不能为空", trigger: "change" }
    ],
    inOut: [
      { required: true, message: "收入/支出IN/OUT不能为空", trigger: "blur" }
    ],
    rate: [
      { required: true, message: "兑换汇率不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询资产变动明细列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listMerchantAssetDetails(queryParams.value);
  merchantAssetDetailsList.value = res.rows;
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
  merchantAssetDetailsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MerchantAssetDetailsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加资产变动明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MerchantAssetDetailsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMerchantAssetDetails(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改资产变动明细";
}

/** 提交按钮 */
const submitForm = () => {
  merchantAssetDetailsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchantAssetDetails(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMerchantAssetDetails(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MerchantAssetDetailsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除资产变动明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMerchantAssetDetails(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/merchantAssetDetails/export', {
    ...queryParams.value
  }, `merchantAssetDetails_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

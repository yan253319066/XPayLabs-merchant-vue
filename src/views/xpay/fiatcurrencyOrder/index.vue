<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商户订单号" prop="orderNo">
              <el-input v-model="queryParams.orderNo" placeholder="请输入商户订单号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商户ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="currency">
              <el-input v-model="queryParams.currency" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款人姓名" prop="payerName">
              <el-input v-model="queryParams.payerName" placeholder="请输入付款人姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款人账号" prop="payerAccount">
              <el-input v-model="queryParams.payerAccount" placeholder="请输入付款人账号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款人手机号" prop="payerPhone">
              <el-input v-model="queryParams.payerPhone" placeholder="请输入付款人手机号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款人邮箱" prop="payerEmail">
              <el-input v-model="queryParams.payerEmail" placeholder="请输入付款人邮箱" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款代码" prop="payerCode">
              <el-input v-model="queryParams.payerCode" placeholder="请输入付款代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款人姓名" prop="payeeName">
              <el-input v-model="queryParams.payeeName" placeholder="请输入收款人姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款人账号" prop="payeeAccount">
              <el-input v-model="queryParams.payeeAccount" placeholder="请输入收款人账号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款人手机号" prop="payeePhone">
              <el-input v-model="queryParams.payeePhone" placeholder="请输入收款人手机号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款人邮箱" prop="payeeEmail">
              <el-input v-model="queryParams.payeeEmail" placeholder="请输入收款人邮箱" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款代码" prop="payeeCode">
              <el-input v-model="queryParams.payeeCode" placeholder="请输入收款代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="支付通道代码" prop="channelCode">
              <el-input v-model="queryParams.channelCode" placeholder="请输入支付通道代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商户通知地址" prop="notifyUrl">
              <el-input v-model="queryParams.notifyUrl" placeholder="请输入商户通知地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="第三方响应内容" prop="thirdPartyResponse">
              <el-input v-model="queryParams.thirdPartyResponse" placeholder="请输入第三方响应内容" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:fiatcurrencyOrder:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:fiatcurrencyOrder:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:fiatcurrencyOrder:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:fiatcurrencyOrder:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="fiatcurrencyOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="商户订单号" align="center" prop="orderNo" />
        <el-table-column label="商户ID" align="center" prop="merchantId" />
        <el-table-column label="订单类型" align="center" prop="orderType" />
        <el-table-column label="金额" align="center" prop="amount" />
        <el-table-column label="币种" align="center" prop="currency" />
        <el-table-column label="付款人姓名" align="center" prop="payerName" />
        <el-table-column label="付款人账号" align="center" prop="payerAccount" />
        <el-table-column label="付款人手机号" align="center" prop="payerPhone" />
        <el-table-column label="付款人邮箱" align="center" prop="payerEmail" />
        <el-table-column label="付款代码" align="center" prop="payerCode" />
        <el-table-column label="扩展字段，JSON格式" align="center" prop="extra" />
        <el-table-column label="收款人姓名" align="center" prop="payeeName" />
        <el-table-column label="收款人账号" align="center" prop="payeeAccount" />
        <el-table-column label="收款人手机号" align="center" prop="payeePhone" />
        <el-table-column label="收款人邮箱" align="center" prop="payeeEmail" />
        <el-table-column label="收款代码" align="center" prop="payeeCode" />
        <el-table-column label="订单状态: INIT,WAIT, PADDING, SUCCESS, FAIL" align="center" prop="status" />
        <el-table-column label="支付通道代码" align="center" prop="channelCode" />
        <el-table-column label="商户通知地址" align="center" prop="notifyUrl" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="第三方响应内容" align="center" prop="thirdPartyResponse" />
        <el-table-column label="第三方回调内容" align="center" prop="callbackContent" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:fiatcurrencyOrder:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:fiatcurrencyOrder:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改法币订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="fiatcurrencyOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="商户ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商户ID" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="付款人姓名" prop="payerName">
          <el-input v-model="form.payerName" placeholder="请输入付款人姓名" />
        </el-form-item>
        <el-form-item label="付款人账号" prop="payerAccount">
          <el-input v-model="form.payerAccount" placeholder="请输入付款人账号" />
        </el-form-item>
        <el-form-item label="付款人手机号" prop="payerPhone">
          <el-input v-model="form.payerPhone" placeholder="请输入付款人手机号" />
        </el-form-item>
        <el-form-item label="付款人邮箱" prop="payerEmail">
          <el-input v-model="form.payerEmail" placeholder="请输入付款人邮箱" />
        </el-form-item>
        <el-form-item label="付款代码" prop="payerCode">
          <el-input v-model="form.payerCode" placeholder="请输入付款代码" />
        </el-form-item>
        <el-form-item label="收款人姓名" prop="payeeName">
          <el-input v-model="form.payeeName" placeholder="请输入收款人姓名" />
        </el-form-item>
        <el-form-item label="收款人账号" prop="payeeAccount">
          <el-input v-model="form.payeeAccount" placeholder="请输入收款人账号" />
        </el-form-item>
        <el-form-item label="收款人手机号" prop="payeePhone">
          <el-input v-model="form.payeePhone" placeholder="请输入收款人手机号" />
        </el-form-item>
        <el-form-item label="收款人邮箱" prop="payeeEmail">
          <el-input v-model="form.payeeEmail" placeholder="请输入收款人邮箱" />
        </el-form-item>
        <el-form-item label="收款代码" prop="payeeCode">
          <el-input v-model="form.payeeCode" placeholder="请输入收款代码" />
        </el-form-item>
        <el-form-item label="支付通道代码" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="请输入支付通道代码" />
        </el-form-item>
        <el-form-item label="商户通知地址" prop="notifyUrl">
          <el-input v-model="form.notifyUrl" placeholder="请输入商户通知地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="第三方响应内容" prop="thirdPartyResponse">
            <el-input v-model="form.thirdPartyResponse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="第三方回调内容">
          <editor v-model="form.callbackContent" :min-height="192"/>
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

<script setup name="FiatcurrencyOrder" lang="ts">
import { listFiatcurrencyOrder, getFiatcurrencyOrder, delFiatcurrencyOrder, addFiatcurrencyOrder, updateFiatcurrencyOrder } from '@/api/xpay/fiatcurrencyOrder';
import { FiatcurrencyOrderVO, FiatcurrencyOrderQuery, FiatcurrencyOrderForm } from '@/api/xpay/fiatcurrencyOrder/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const fiatcurrencyOrderList = ref<FiatcurrencyOrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeUpdateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const fiatcurrencyOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FiatcurrencyOrderForm = {
  id: undefined,
  orderNo: undefined,
  merchantId: undefined,
  orderType: undefined,
  amount: undefined,
  currency: undefined,
  payerName: undefined,
  payerAccount: undefined,
  payerPhone: undefined,
  payerEmail: undefined,
  payerCode: undefined,
  extra: undefined,
  payeeName: undefined,
  payeeAccount: undefined,
  payeePhone: undefined,
  payeeEmail: undefined,
  payeeCode: undefined,
  status: undefined,
  channelCode: undefined,
  notifyUrl: undefined,
  remark: undefined,
  thirdPartyResponse: undefined,
  callbackContent: undefined
}
const data = reactive<PageData<FiatcurrencyOrderForm, FiatcurrencyOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNo: undefined,
    merchantId: undefined,
    orderType: undefined,
    amount: undefined,
    currency: undefined,
    payerName: undefined,
    payerAccount: undefined,
    payerPhone: undefined,
    payerEmail: undefined,
    payerCode: undefined,
    extra: undefined,
    payeeName: undefined,
    payeeAccount: undefined,
    payeePhone: undefined,
    payeeEmail: undefined,
    payeeCode: undefined,
    status: undefined,
    channelCode: undefined,
    notifyUrl: undefined,
    thirdPartyResponse: undefined,
    callbackContent: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    orderNo: [
      { required: true, message: "商户订单号不能为空", trigger: "blur" }
    ],
    merchantId: [
      { required: true, message: "商户ID不能为空", trigger: "blur" }
    ],
    orderType: [
      { required: true, message: "订单类型不能为空", trigger: "change" }
    ],
    amount: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    payerName: [
      { required: true, message: "付款人姓名不能为空", trigger: "blur" }
    ],
    payerAccount: [
      { required: true, message: "付款人账号不能为空", trigger: "blur" }
    ],
    payerPhone: [
      { required: true, message: "付款人手机号不能为空", trigger: "blur" }
    ],
    payerEmail: [
      { required: true, message: "付款人邮箱不能为空", trigger: "blur" }
    ],
    payerCode: [
      { required: true, message: "付款代码不能为空", trigger: "blur" }
    ],
    extra: [
      { required: true, message: "扩展字段，JSON格式不能为空", trigger: "blur" }
    ],
    payeeName: [
      { required: true, message: "收款人姓名不能为空", trigger: "blur" }
    ],
    payeeAccount: [
      { required: true, message: "收款人账号不能为空", trigger: "blur" }
    ],
    payeePhone: [
      { required: true, message: "收款人手机号不能为空", trigger: "blur" }
    ],
    payeeEmail: [
      { required: true, message: "收款人邮箱不能为空", trigger: "blur" }
    ],
    payeeCode: [
      { required: true, message: "收款代码不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "订单状态: INIT,WAIT, PADDING, SUCCESS, FAIL不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询法币订单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeUpdateTime.value, 'UpdateTime');
  const res = await listFiatcurrencyOrder(queryParams.value);
  fiatcurrencyOrderList.value = res.rows;
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
  fiatcurrencyOrderFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  dateRangeUpdateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: FiatcurrencyOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加法币订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: FiatcurrencyOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getFiatcurrencyOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改法币订单";
}

/** 提交按钮 */
const submitForm = () => {
  fiatcurrencyOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateFiatcurrencyOrder(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addFiatcurrencyOrder(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: FiatcurrencyOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除法币订单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delFiatcurrencyOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/fiatcurrencyOrder/export', {
    ...queryParams.value
  }, `fiatcurrencyOrder_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

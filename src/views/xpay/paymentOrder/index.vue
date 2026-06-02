<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="订单编号" prop="merchantOrderId">
              <el-input v-model="queryParams.merchantOrderId" placeholder="请输入订单编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="uid" prop="uid">
              <el-input v-model="queryParams.uid" placeholder="请输入uid" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="支付币种ID" prop="assetTypeId">
              <el-input v-model="queryParams.assetTypeId" placeholder="请输入支付币种ID" clearable @keyup.enter="handleQuery" />
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
            <!-- <el-form-item label="付款地址" prop="payAddress">
              <el-input v-model="queryParams.payAddress" placeholder="请输入付款地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款地址" prop="receiveAddress">
              <el-input v-model="queryParams.receiveAddress" placeholder="请输入收款地址" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="数量" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="过期时间" prop="expiredTime">
              <el-date-picker clearable
                v-model="queryParams.expiredTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择过期时间"
              />
            </el-form-item>
            <el-form-item label="失败原因" prop="reason">
              <el-input v-model="queryParams.reason" placeholder="请输入失败原因" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="txId" prop="txId">
              <el-input v-model="queryParams.txId" placeholder="请输入txId" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="GAS" prop="txGas">
              <el-input v-model="queryParams.txGas" placeholder="请输入GAS" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="回调URL" prop="callbackUrl">
              <el-input v-model="queryParams.callbackUrl" placeholder="请输入回调URL" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="回调时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeNotifyTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:paymentOrder:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:paymentOrder:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:paymentOrder:remove']">删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:paymentOrder:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="paymentOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="商家ID" align="center" prop="merchantId" /> -->
        <el-table-column label="订单编号" align="center" prop="merchantOrderId" />
        <!-- <el-table-column label="txId" align="center" prop="txId" width="180" /> -->
        <!-- <el-table-column label="uid" align="center" prop="uid" /> -->
        <el-table-column label="订单类型" align="center" prop="orderType" >
          <template #default="scope">
            <el-tag v-if="scope.row.orderType === 'PAYOUT'" type="success">代付</el-tag>
            <el-tag v-else type="info">代收</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="链" align="center" prop="chain" >
          <template #default="scope">
            <el-tag type="success">{{scope.row.chain}}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="币种" align="center" prop="symbol" />
        <!-- <el-table-column label="付款地址" align="center" prop="payAddress" /> -->
        <!-- <el-table-column label="收款地址" align="center" prop="receiveAddress" /> -->
        <el-table-column label="数量" align="center" prop="amount" >
          <template #default="scope">
            <span>{{ parseFloat(scope.row.amount).toString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手续费(含矿工费)" align="center" prop="handingFee" />
        <el-table-column label="费率(%)" align="center" prop="handingRate" />
        <!-- <el-table-column label="过期时间" align="center" prop="expiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiredTime) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" align="center" prop="status" >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'INIT'" type="warning">等待中</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING'" type="warning">等待</el-tag>
            <el-tag v-else-if="scope.row.status === 'PENDING_CONFIRMATION'" type="warning">确认中</el-tag>
            <el-tag v-else-if="scope.row.status === 'SUCCESS'" type="success">成功</el-tag>
            <el-tag v-else-if="scope.row.status === 'FAILED'" type="danger">失败</el-tag>
            <el-tag v-else-if="scope.row.status === 'EXPIRED'" type="info">过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="失败原因" align="center" prop="reason" />
        <!-- <el-table-column label="GAS" align="center" prop="txGas" /> -->
        <!-- <el-table-column label="回调状态" align="center" prop="notifyStatus" />
        <el-table-column label="回调URL" align="center" prop="callbackUrl" />
        <el-table-column label="回调时间" align="center" prop="notifyTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.notifyTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:paymentOrder:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:paymentOrder:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改支付订单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="paymentOrderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="订单编号" prop="merchantOrderId">
          <el-input v-model="form.merchantOrderId" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="uid" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入uid" />
        </el-form-item>
        <el-form-item label="支付币种ID" prop="assetTypeId">
          <el-input v-model="form.assetTypeId" placeholder="请输入支付币种ID" />
        </el-form-item>
        <el-form-item label="链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入链" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="付款地址" prop="payAddress">
          <el-input v-model="form.payAddress" placeholder="请输入付款地址" />
        </el-form-item>
        <el-form-item label="收款地址" prop="receiveAddress">
          <el-input v-model="form.receiveAddress" placeholder="请输入收款地址" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="手续费" prop="handingFee">
          <el-input v-model="form.handingFee" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="费率" prop="handingRate">
          <el-input v-model="form.handingRate" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expiredTime">
          <el-date-picker clearable
            v-model="form.expiredTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失败原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入失败原因" />
        </el-form-item>
        <el-form-item label="txId" prop="txId">
          <el-input v-model="form.txId" placeholder="请输入txId" />
        </el-form-item>
        <el-form-item label="GAS" prop="txGas">
          <el-input v-model="form.txGas" placeholder="请输入GAS" />
        </el-form-item>
        <el-form-item label="回调URL" prop="callbackUrl">
          <el-input v-model="form.callbackUrl" placeholder="请输入回调URL" />
        </el-form-item>
        <el-form-item label="回调时间" prop="notifyTime">
          <el-date-picker clearable
            v-model="form.notifyTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择回调时间">
          </el-date-picker>
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

<script setup name="PaymentOrder" lang="ts">
import { listPaymentOrder, getPaymentOrder, delPaymentOrder, addPaymentOrder, updatePaymentOrder } from '@/api/xpay/paymentOrder';
import { PaymentOrderVO, PaymentOrderQuery, PaymentOrderForm } from '@/api/xpay/paymentOrder/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const paymentOrderList = ref<PaymentOrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeNotifyTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const paymentOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PaymentOrderForm = {
  id: undefined,
  merchantId: undefined,
  merchantOrderId: undefined,
  uid: undefined,
  orderType: undefined,
  assetTypeId: undefined,
  chain: undefined,
  symbol: undefined,
  payAddress: undefined,
  receiveAddress: undefined,
  amount: undefined,
  expiredTime: undefined,
  status: undefined,
  reason: undefined,
  txId: undefined,
  txGas: undefined,
  notifyStatus: undefined,
  callbackUrl: undefined,
  notifyTime: undefined,
}
const data = reactive<PageData<PaymentOrderForm, PaymentOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    merchantOrderId: undefined,
    uid: undefined,
    orderType: undefined,
    assetTypeId: undefined,
    chain: undefined,
    symbol: undefined,
    payAddress: undefined,
    receiveAddress: undefined,
    amount: undefined,
    expiredTime: undefined,
    status: undefined,
    reason: undefined,
    txId: undefined,
    txGas: undefined,
    notifyStatus: undefined,
    callbackUrl: undefined,
    params: {
      notifyTime: undefined,
      createTime: undefined,
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    merchantId: [
      { required: true, message: "商家ID不能为空", trigger: "blur" }
    ],
    merchantOrderId: [
      { required: true, message: "订单编号不能为空", trigger: "blur" }
    ],
    orderType: [
      { required: true, message: "订单类型不能为空", trigger: "change" }
    ],
    assetTypeId: [
      { required: true, message: "支付币种ID不能为空", trigger: "blur" }
    ],
    receiveAddress: [
      { required: true, message: "收款地址不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    expiredTime: [
      { required: true, message: "过期时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询支付订单列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeNotifyTime.value, 'NotifyTime');
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listPaymentOrder(queryParams.value);
  paymentOrderList.value = res.rows;
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
  paymentOrderFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeNotifyTime.value = ['', ''];
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PaymentOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加支付订单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PaymentOrderVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getPaymentOrder(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改支付订单";
}

/** 提交按钮 */
const submitForm = () => {
  paymentOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePaymentOrder(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPaymentOrder(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PaymentOrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除支付订单编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delPaymentOrder(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/paymentOrder/export', {
    ...queryParams.value
  }, `paymentOrder_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

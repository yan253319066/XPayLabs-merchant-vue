<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="区块高度" prop="blockNumber">
              <el-input v-model="queryParams.blockNumber" placeholder="请输入区块高度" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="付款地址" prop="fromAddress">
              <el-input v-model="queryParams.fromAddress" placeholder="请输入付款地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款地址" prop="toAddress">
              <el-input v-model="queryParams.toAddress" placeholder="请输入收款地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="链" prop="chain">
              <el-input v-model="queryParams.chain" placeholder="请输入链" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="数量" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="Hash" prop="txId">
              <el-input v-model="queryParams.txId" placeholder="请输入Hash" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="合约" prop="contractAddress">
              <el-input v-model="queryParams.contractAddress" placeholder="请输入合约" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="GAS费" prop="txFee">
              <el-input v-model="queryParams.txFee" placeholder="请输入GAS费" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="确实数" prop="confirmedNum">
              <el-input v-model="queryParams.confirmedNum" placeholder="请输入确实数" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <!-- <el-form-item label="确认时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeBlockTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item> -->
            <!-- <el-form-item label="预计转账数量" prop="collectAmount">
              <el-input v-model="queryParams.collectAmount" placeholder="请输入预计转账数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="平台手续费" prop="fee">
              <el-input v-model="queryParams.fee" placeholder="请输入平台手续费" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="平台手续费率" prop="feeRatio">
              <el-input v-model="queryParams.feeRatio" placeholder="请输入平台手续费率" clearable @keyup.enter="handleQuery" />
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
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:collectRecord:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:collectRecord:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:collectRecord:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:collectRecord:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="collectRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="商家ID" align="center" prop="merchantId" />
        <el-table-column label="区块高度" align="center" prop="blockNumber" />
        <el-table-column label="付款地址" align="center" prop="fromAddress" />
        <el-table-column label="收款地址" align="center" prop="toAddress" />
        <el-table-column label="链" align="center" prop="chain" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="数量" align="center" prop="amount" />
        <el-table-column label="Hash" align="center" prop="txId" />
        <el-table-column label="合约" align="center" prop="contractAddress" />
        <el-table-column label="GAS费" align="center" prop="txFee" />
        <el-table-column label="确实数" align="center" prop="confirmedNum" />
        <el-table-column label="交易状态" align="center" prop="status" />
        <el-table-column label="确认时间" align="center" prop="blockTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.blockTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计转账数量" align="center" prop="collectAmount" />
        <el-table-column label="平台手续费" align="center" prop="fee" />
        <el-table-column label="平台手续费率" align="center" prop="feeRatio" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:collectRecord:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:collectRecord:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改链上归集记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="collectRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="区块高度" prop="blockNumber">
          <el-input v-model="form.blockNumber" placeholder="请输入区块高度" />
        </el-form-item>
        <el-form-item label="付款地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="请输入付款地址" />
        </el-form-item>
        <el-form-item label="收款地址" prop="toAddress">
          <el-input v-model="form.toAddress" placeholder="请输入收款地址" />
        </el-form-item>
        <el-form-item label="链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入链" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="Hash" prop="txId">
          <el-input v-model="form.txId" placeholder="请输入Hash" />
        </el-form-item>
        <el-form-item label="合约" prop="contractAddress">
          <el-input v-model="form.contractAddress" placeholder="请输入合约" />
        </el-form-item>
        <el-form-item label="GAS费" prop="txFee">
          <el-input v-model="form.txFee" placeholder="请输入GAS费" />
        </el-form-item>
        <el-form-item label="确实数" prop="confirmedNum">
          <el-input v-model="form.confirmedNum" placeholder="请输入确实数" />
        </el-form-item>
        <el-form-item label="确认时间" prop="blockTime">
          <el-date-picker clearable
            v-model="form.blockTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择确认时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计转账数量" prop="collectAmount">
          <el-input v-model="form.collectAmount" placeholder="请输入预计转账数量" />
        </el-form-item>
        <el-form-item label="平台手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入平台手续费" />
        </el-form-item>
        <el-form-item label="平台手续费率" prop="feeRatio">
          <el-input v-model="form.feeRatio" placeholder="请输入平台手续费率" />
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

<script setup name="CollectRecord" lang="ts">
import { listCollectRecord, getCollectRecord, delCollectRecord, addCollectRecord, updateCollectRecord } from '@/api/xpay/collectRecord';
import { CollectRecordVO, CollectRecordQuery, CollectRecordForm } from '@/api/xpay/collectRecord/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const collectRecordList = ref<CollectRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeBlockTime = ref<[DateModelType, DateModelType]>(['', '']);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const collectRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CollectRecordForm = {
  id: undefined,
  merchantId: undefined,
  blockNumber: undefined,
  fromAddress: undefined,
  toAddress: undefined,
  chain: undefined,
  symbol: undefined,
  amount: undefined,
  txId: undefined,
  contractAddress: undefined,
  txFee: undefined,
  confirmedNum: undefined,
  status: undefined,
  blockTime: undefined,
  collectAmount: undefined,
  fee: undefined,
  feeRatio: undefined,
}
const data = reactive<PageData<CollectRecordForm, CollectRecordQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    blockNumber: undefined,
    fromAddress: undefined,
    toAddress: undefined,
    chain: undefined,
    symbol: undefined,
    amount: undefined,
    txId: undefined,
    contractAddress: undefined,
    txFee: undefined,
    confirmedNum: undefined,
    status: undefined,
    collectAmount: undefined,
    fee: undefined,
    feeRatio: undefined,
    params: {
      blockTime: undefined,
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
    txId: [
      { required: true, message: "Hash不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询链上归集记录列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeBlockTime.value, 'BlockTime');
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listCollectRecord(queryParams.value);
  collectRecordList.value = res.rows;
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
  collectRecordFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeBlockTime.value = ['', ''];
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CollectRecordVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加链上归集记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CollectRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCollectRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改链上归集记录";
}

/** 提交按钮 */
const submitForm = () => {
  collectRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCollectRecord(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCollectRecord(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CollectRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除链上归集记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCollectRecord(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/collectRecord/export', {
    ...queryParams.value
  }, `collectRecord_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

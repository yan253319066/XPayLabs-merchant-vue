<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!-- <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="数量" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="业务ID" prop="businessId">
              <el-input v-model="queryParams.businessId" placeholder="请输入业务ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchantCostDetail:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchantCostDetail:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchantCostDetail:remove']">删除</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantCostDetail:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantCostDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="id" v-if="true" /> -->
        <!-- <el-table-column label="商家ID" align="center" prop="merchantId" /> -->
        <el-table-column label="费用类型" align="center" prop="costType" />
        <el-table-column label="链" align="center" prop="chain" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="数量" align="center" prop="amount" />
        <el-table-column label="业务ID" align="center" prop="businessId" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchantCostDetail:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchantCostDetail:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商家费用明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantCostDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="业务ID" prop="businessId">
          <el-input v-model="form.businessId" placeholder="请输入业务ID" />
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

<script setup name="MerchantCostDetail" lang="ts">
import { listMerchantCostDetail, getMerchantCostDetail, delMerchantCostDetail, addMerchantCostDetail, updateMerchantCostDetail } from '@/api/xpay/merchantCostDetail';
import { MerchantCostDetailVO, MerchantCostDetailQuery, MerchantCostDetailForm } from '@/api/xpay/merchantCostDetail/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantCostDetailList = ref<MerchantCostDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const merchantCostDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantCostDetailForm = {
  id: undefined,
  merchantId: undefined,
  costType: undefined,
  chain: undefined,
  symbol: undefined,
  amount: undefined,
  businessId: undefined,
}
const data = reactive<PageData<MerchantCostDetailForm, MerchantCostDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    costType: undefined,
    chain: undefined,
    symbol: undefined,
    amount: undefined,
    businessId: undefined,
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
    costType: [
      { required: true, message: "费用类型不能为空", trigger: "change" }
    ],
    chain: [
      { required: true, message: "链不能为空", trigger: "change" }
    ],
    symbol: [
      { required: true, message: "币种不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商家费用明细列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listMerchantCostDetail(queryParams.value);
  merchantCostDetailList.value = res.rows;
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
  merchantCostDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MerchantCostDetailVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商家费用明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MerchantCostDetailVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMerchantCostDetail(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商家费用明细";
}

/** 提交按钮 */
const submitForm = () => {
  merchantCostDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchantCostDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMerchantCostDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MerchantCostDetailVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商家费用明细编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMerchantCostDetail(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/merchantCostDetail/export', {
    ...queryParams.value
  }, `merchantCostDetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

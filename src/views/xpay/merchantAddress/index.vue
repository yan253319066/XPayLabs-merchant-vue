<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="链" prop="chain">
              <el-input v-model="queryParams.chain" placeholder="请输入链" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="冷钱包地址" prop="coldAddress">
              <el-input v-model="queryParams.coldAddress" placeholder="请输入冷钱包地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="归集触发数量" prop="collectAmount">
              <el-input v-model="queryParams.collectAmount" placeholder="请输入归集触发数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="热钱包地址" prop="hotAddress">
              <el-input v-model="queryParams.hotAddress" placeholder="请输入热钱包地址" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchantAddress:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchantAddress:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchantAddress:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantAddress:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantAddressList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="商家ID" align="center" prop="merchantId" />
        <el-table-column label="链" align="center" prop="chain" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="冷钱包地址" align="center" prop="coldAddress" />
        <el-table-column label="归集触发数量" align="center" prop="collectAmount" />
        <el-table-column label="热钱包地址" align="center" prop="hotAddress" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchantAddress:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchantAddress:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商家钱包地址对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantAddressFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入链" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="冷钱包地址" prop="coldAddress">
          <el-input v-model="form.coldAddress" placeholder="请输入冷钱包地址" />
        </el-form-item>
        <el-form-item label="归集触发数量" prop="collectAmount">
          <el-input v-model="form.collectAmount" placeholder="请输入归集触发数量" />
        </el-form-item>
        <el-form-item label="热钱包地址" prop="hotAddress">
          <el-input v-model="form.hotAddress" placeholder="请输入热钱包地址" />
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

<script setup name="MerchantAddress" lang="ts">
import { listMerchantAddress, getMerchantAddress, delMerchantAddress, addMerchantAddress, updateMerchantAddress } from '@/api/xpay/merchantAddress';
import { MerchantAddressVO, MerchantAddressQuery, MerchantAddressForm } from '@/api/xpay/merchantAddress/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantAddressList = ref<MerchantAddressVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const merchantAddressFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantAddressForm = {
  id: undefined,
  merchantId: undefined,
  chain: undefined,
  symbol: undefined,
  coldAddress: undefined,
  collectAmount: undefined,
  hotAddress: undefined
}
const data = reactive<PageData<MerchantAddressForm, MerchantAddressQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    chain: undefined,
    symbol: undefined,
    coldAddress: undefined,
    collectAmount: undefined,
    hotAddress: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商家钱包地址列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMerchantAddress(queryParams.value);
  merchantAddressList.value = res.rows;
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
  merchantAddressFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MerchantAddressVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商家钱包地址";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MerchantAddressVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMerchantAddress(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商家钱包地址";
}

/** 提交按钮 */
const submitForm = () => {
  merchantAddressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchantAddress(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMerchantAddress(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MerchantAddressVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商家钱包地址编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMerchantAddress(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/merchantAddress/export', {
    ...queryParams.value
  }, `merchantAddress_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

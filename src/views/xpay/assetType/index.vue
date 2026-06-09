<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="链" prop="chain">
              <el-input v-model="queryParams.chain" placeholder="请输入链" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="合约地址" prop="contractAddress">
              <el-input v-model="queryParams.contractAddress" placeholder="请输入合约地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="网络" prop="network">
              <el-input v-model="queryParams.network" placeholder="请输入网络" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
              <el-select v-model="queryParams.enabled" placeholder="请选择" clearable>
                <el-option label="启用" value="ENABLED" />
                <el-option label="禁用" value="DISABLED" />
              </el-select>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:assetType:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:assetType:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:assetType:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:assetType:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="assetTypeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="80" />
        <el-table-column label="链" align="center" prop="chain" width="100" />
        <el-table-column label="币种" align="center" prop="symbol" width="80" />
        <el-table-column label="合约地址" align="center" prop="contractAddress" show-overflow-tooltip min-width="160" />
        <el-table-column label="精度" align="center" prop="decimals" width="80" />
        <el-table-column label="网络" align="center" prop="network" width="100" />
        <el-table-column label="热钱包地址" align="center" prop="hotAddress" show-overflow-tooltip min-width="160" />
        <el-table-column label="冷钱包地址" align="center" prop="coldAddress" show-overflow-tooltip min-width="160" />
        <el-table-column label="触发归集数量" align="center" prop="collectAmount" width="140" />
        <el-table-column label="确认数" align="center" prop="confirmedNum" width="80" />
        <el-table-column label="是否启用" align="center" prop="enabled" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.enabled === 'ENABLED'" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:assetType:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:assetType:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改支持的币种资产类型对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="assetTypeFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入链" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="合约地址" prop="contractAddress">
          <el-input v-model="form.contractAddress" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="精度" prop="decimals">
          <el-input v-model="form.decimals" placeholder="请输入精度" />
        </el-form-item>
        <el-form-item label="网络" prop="network">
          <el-input v-model="form.network" placeholder="请输入网络" />
        </el-form-item>
        <el-form-item label="热钱包地址" prop="hotAddress">
          <el-input v-model="form.hotAddress" type="textarea" placeholder="请输入热钱包地址" />
        </el-form-item>
        <el-form-item label="冷钱包地址" prop="coldAddress">
          <el-input v-model="form.coldAddress" type="textarea" placeholder="请输入冷钱包地址" />
        </el-form-item>
        <el-form-item label="触发归集数量" prop="collectAmount">
          <el-input v-model="form.collectAmount" placeholder="请输入触发归集数量" />
        </el-form-item>
        <el-form-item label="确认数" prop="confirmedNum">
          <el-input v-model="form.confirmedNum" placeholder="请输入确认数" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="form.enabled" active-value="ENABLED" inactive-value="DISABLED" active-text="启用" inactive-text="禁用" />
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

<script setup name="AssetType" lang="ts">
import { listAssetType, getAssetType, delAssetType, addAssetType, updateAssetType } from '@/api/xpay/assetType';
import { AssetTypeVO, AssetTypeQuery, AssetTypeForm } from '@/api/xpay/assetType/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const assetTypeList = ref<AssetTypeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const assetTypeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AssetTypeForm = {
  id: undefined,
  chain: undefined,
  symbol: undefined,
  contractAddress: undefined,
  decimals: undefined,
  network: undefined,
  coldAddress: undefined,
  hotAddress: undefined,
  collectAmount: undefined,
  confirmedNum: undefined,
  enabled: 'ENABLED'
};
const data = reactive<PageData<AssetTypeForm, AssetTypeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    chain: undefined,
    symbol: undefined,
    contractAddress: undefined,
    network: undefined,
    enabled: undefined,
    params: {}
  },
  rules: {
    chain: [{ required: true, message: '链不能为空', trigger: 'blur' }],
    symbol: [{ required: true, message: '币种不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const getList = async () => {
  loading.value = true;
  const res = await listAssetType(queryParams.value);
  assetTypeList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const cancel = () => {
  reset();
  dialog.visible = false;
};

const reset = () => {
  form.value = { ...initFormData };
  assetTypeFormRef.value?.resetFields();
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

const handleSelectionChange = (selection: AssetTypeVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加支持的币种资产类型';
};

const handleUpdate = async (row?: AssetTypeVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAssetType(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改支持的币种资产类型';
};

const submitForm = () => {
  assetTypeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAssetType(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addAssetType(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

const handleDelete = async (row?: AssetTypeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除支持的币种资产类型编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delAssetType(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

const handleExport = () => {
  proxy?.download(
    'xpay/assetType/export',
    {
      ...queryParams.value
    },
    `assetType_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>

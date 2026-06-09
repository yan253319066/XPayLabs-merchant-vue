<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商家ID" prop="merchantId">
              <el-input v-model="queryParams.merchantId" placeholder="请输入商家ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种(USDT, BTC等)" clearable @keyup.enter="handleQuery" />
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
            <el-form-item label="更新时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeUpdateTime"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchantAssets:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchantAssets:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchantAssets:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchantAssets:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantAssetsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="180" />
        <el-table-column label="商家ID" align="center" prop="merchantId" width="180" />
        <el-table-column label="币种" align="center" prop="symbol" width="100" />
        <el-table-column label="可用余额" align="center" prop="balance" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.balance).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="冻结余额" align="center" prop="frozenBalance" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.frozenBalance).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总余额" align="center" prop="totalBalance" width="140">
          <template #default="scope">
            <span>{{ Number(scope.row.totalBalance).toFixed(6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchantAssets:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchantAssets:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商家资产对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantAssetsFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商家ID" prop="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商家ID" />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种(USDT, BTC等)" />
        </el-form-item>
        <el-form-item label="可用余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入可用余额" />
        </el-form-item>
        <el-form-item label="冻结余额" prop="frozenBalance">
          <el-input v-model="form.frozenBalance" placeholder="请输入冻结余额" />
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

<script setup name="MerchantAssets" lang="ts">
import { listMerchantAssets, getMerchantAssets, delMerchantAssets, addMerchantAssets, updateMerchantAssets } from '@/api/xpay/merchantAssets';
import { MerchantAssetsVO, MerchantAssetsQuery, MerchantAssetsForm } from '@/api/xpay/merchantAssets/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantAssetsList = ref<MerchantAssetsVO[]>([]);
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
const merchantAssetsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantAssetsForm = {
  id: undefined,
  merchantId: undefined,
  symbol: undefined,
  balance: undefined,
  frozenBalance: undefined
};
const data = reactive<PageData<MerchantAssetsForm, MerchantAssetsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    merchantId: undefined,
    symbol: undefined,
    params: {
      createTime: undefined,
      updateTime: undefined
    }
  },
  rules: {
    merchantId: [{ required: true, message: '商家ID不能为空', trigger: 'blur' }],
    symbol: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
    balance: [{ required: true, message: '可用余额不能为空', trigger: 'blur' }],
    frozenBalance: [{ required: true, message: '冻结余额不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeUpdateTime.value, 'UpdateTime');
  const res = await listMerchantAssets(queryParams.value);
  merchantAssetsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const cancel = () => {
  reset();
  dialog.visible = false;
};

const reset = () => {
  form.value = { ...initFormData };
  merchantAssetsFormRef.value?.resetFields();
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  dateRangeUpdateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
};

const handleSelectionChange = (selection: MerchantAssetsVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加商家资产';
};

const handleUpdate = async (row?: MerchantAssetsVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getMerchantAssets(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改商家资产';
};

const submitForm = () => {
  merchantAssetsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchantAssets(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addMerchantAssets(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

const handleDelete = async (row?: MerchantAssetsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商家资产编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delMerchantAssets(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

const handleExport = () => {
  proxy?.download(
    'xpay/merchantAssets/export',
    {
      ...queryParams.value
    },
    `merchantAssets_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>

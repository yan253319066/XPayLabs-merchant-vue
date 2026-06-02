<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商户名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入商户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="商户鉴权Token" prop="token">
              <el-input v-model="queryParams.token" placeholder="请输入商户鉴权Token" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="webhook秘钥" prop="webhookSecret">
              <el-input v-model="queryParams.webhookSecret" placeholder="请输入webhook秘钥" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="VIP等级" prop="vip">
              <el-input v-model="queryParams.vip" placeholder="请输入VIP等级" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手续费(百分比)" prop="feeRatio">
              <el-input v-model="queryParams.feeRatio" placeholder="请输入手续费(百分比)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="回调URL" prop="callbackUrl">
              <el-input v-model="queryParams.callbackUrl" placeholder="请输入回调URL" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:merchant:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:merchant:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:merchant:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:merchant:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="merchantList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="ID" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="商户名称" align="center" prop="name" />
        <!-- <el-table-column label="商户鉴权Token" align="center" prop="token" />
        <el-table-column label="webhook秘钥" align="center" prop="webhookSecret" /> -->
        <!-- <el-table-column label="VIP等级" align="center" prop="vip" /> -->
        <el-table-column label="手续费(百分比)" align="center" prop="feeRatio" />
        <!-- <el-table-column label="提币类型" align="center" prop="withdrawalType" >
          <template #default="scope">
            <el-tag v-if="scope.row.withdrawalType === 'AUTO'" type="success">自动</el-tag>
            <el-tag v-else type="info">手动</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="回调URL" align="center" prop="callbackUrl" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:merchant:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:merchant:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="merchantFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商户名称" />
        </el-form-item>
        <!-- <el-form-item label="商户鉴权Token" prop="token">
          <el-input v-model="form.token" placeholder="请输入商户鉴权Token" />
        </el-form-item>
        <el-form-item label="webhook秘钥" prop="webhookSecret">
          <el-input v-model="form.webhookSecret" placeholder="请输入webhook秘钥" />
        </el-form-item> -->
        <el-form-item label="系统版本" prop="merchantSysVersion">
          <el-select v-model="form.merchantSysVersion" clearable placeholder="请选择提币方式">
            <el-option key="V3" label="V3" value="V3" />
            <el-option key="V2" label="V2" value="V2" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="提币方式" prop="withdrawalType">
          <el-select v-model="form.withdrawalType" clearable placeholder="请选择系统版本">
              <el-option key="AUTO" label="自动" value="AUTO" />
              <el-option key="MANUAL" label="手动" value="MANUAL" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="VIP等级" prop="vip">
          <el-input v-model="form.vip" placeholder="请输入VIP等级" />
        </el-form-item> -->
        <el-form-item label="手续费(百分比)" prop="feeRatio">
          <el-input v-model="form.feeRatio" placeholder="请输入手续费(百分比)" />
        </el-form-item>
        <el-form-item label="回调URL" prop="callbackUrl">
          <el-input v-model="form.callbackUrl" placeholder="请输入回调URL" />
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

<script setup name="Merchant" lang="ts">
import { listMerchant, getMerchant, delMerchant, addMerchant, updateMerchant } from '@/api/xpay/merchant';
import { MerchantVO, MerchantQuery, MerchantForm } from '@/api/xpay/merchant/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const merchantList = ref<MerchantVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const merchantFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantForm = {
  id: undefined,
  name: undefined,
  token: undefined,
  webhookSecret: undefined,
  vip: undefined,
  feeRatio: undefined,
  withdrawalType: undefined,
  callbackUrl: undefined,
}
const data = reactive<PageData<MerchantForm, MerchantQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    token: undefined,
    webhookSecret: undefined,
    vip: undefined,
    feeRatio: undefined,
    withdrawalType: undefined,
    callbackUrl: undefined,
    params: {
      createTime: undefined
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "商户名称不能为空", trigger: "blur" }
    ],
    merchantSysVersion: [
      { required: true, message: "系统版本不能为空", trigger: "change" }
    ],
    token: [
      { required: true, message: "商户鉴权Token不能为空", trigger: "blur" }
    ],
    webhookSecret: [
      { required: true, message: "webhook秘钥不能为空", trigger: "blur" }
    ],
    // withdrawalType: [
    //   { required: true, message: "提币类型不能为空", trigger: "change" }
    // ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询商户信息列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listMerchant(queryParams.value);
  merchantList.value = res.rows;
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
  merchantFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MerchantVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商户信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MerchantVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMerchant(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商户信息";
}

/** 提交按钮 */
const submitForm = () => {
  merchantFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMerchant(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addMerchant(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MerchantVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商户信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMerchant(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/merchant/export', {
    ...queryParams.value
  }, `merchant_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

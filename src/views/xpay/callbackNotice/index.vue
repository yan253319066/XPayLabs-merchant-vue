<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="订单ID" prop="orderId">
              <el-input v-model="queryParams.orderId" placeholder="请输入订单ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="回调URL" prop="callbackUrl">
              <el-input v-model="queryParams.callbackUrl" placeholder="请输入回调URL" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="通知时间" prop="notifyTime">
              <el-date-picker clearable
                v-model="queryParams.notifyTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择通知时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:callbackNotice:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:callbackNotice:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:callbackNotice:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:callbackNotice:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="callbackNoticeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="订单ID" align="center" prop="orderId" />
        <el-table-column label="回调URL" align="center" prop="callbackUrl" />
        <el-table-column label="回调通知状态" align="center" prop="notifyStatus" />
        <el-table-column label="通知时间" align="center" prop="notifyTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.notifyTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:callbackNotice:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:callbackNotice:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改回调通知对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="callbackNoticeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="回调URL" prop="callbackUrl">
          <el-input v-model="form.callbackUrl" placeholder="请输入回调URL" />
        </el-form-item>
        <el-form-item label="通知时间" prop="notifyTime">
          <el-date-picker clearable
            v-model="form.notifyTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择通知时间">
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

<script setup name="CallbackNotice" lang="ts">
import { listCallbackNotice, getCallbackNotice, delCallbackNotice, addCallbackNotice, updateCallbackNotice } from '@/api/xpay/callbackNotice';
import { CallbackNoticeVO, CallbackNoticeQuery, CallbackNoticeForm } from '@/api/xpay/callbackNotice/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const callbackNoticeList = ref<CallbackNoticeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeCreateTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const callbackNoticeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CallbackNoticeForm = {
  id: undefined,
  orderId: undefined,
  callbackUrl: undefined,
  notifyStatus: undefined,
  notifyTime: undefined,
}
const data = reactive<PageData<CallbackNoticeForm, CallbackNoticeQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderId: undefined,
    callbackUrl: undefined,
    notifyStatus: undefined,
    notifyTime: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    orderId: [
      { required: true, message: "订单ID不能为空", trigger: "blur" }
    ],
    callbackUrl: [
      { required: true, message: "回调URL不能为空", trigger: "blur" }
    ],
    notifyStatus: [
      { required: true, message: "回调通知状态不能为空", trigger: "change" }
    ],
    notifyTime: [
      { required: true, message: "通知时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询回调通知列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  const res = await listCallbackNotice(queryParams.value);
  callbackNoticeList.value = res.rows;
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
  callbackNoticeFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CallbackNoticeVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加回调通知";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CallbackNoticeVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCallbackNotice(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改回调通知";
}

/** 提交按钮 */
const submitForm = () => {
  callbackNoticeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCallbackNotice(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCallbackNotice(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CallbackNoticeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除回调通知编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCallbackNotice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/callbackNotice/export', {
    ...queryParams.value
  }, `callbackNotice_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

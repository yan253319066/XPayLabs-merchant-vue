<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="链" prop="chain">
              <el-input v-model="queryParams.chain" placeholder="请输入链" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当前高度" prop="lastHeight">
              <el-input v-model="queryParams.lastHeight" placeholder="请输入当前高度" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['xpay:blockHeightTracker:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['xpay:blockHeightTracker:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['xpay:blockHeightTracker:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['xpay:blockHeightTracker:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="blockHeightTrackerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="链" align="center" prop="chain" />
        <el-table-column label="当前高度" align="center" prop="lastHeight" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['xpay:blockHeightTracker:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['xpay:blockHeightTracker:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改区块监听高度追踪对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="blockHeightTrackerFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入链" />
        </el-form-item>
        <el-form-item label="当前高度" prop="lastHeight">
          <el-input v-model="form.lastHeight" placeholder="请输入当前高度" />
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

<script setup name="BlockHeightTracker" lang="ts">
import { listBlockHeightTracker, getBlockHeightTracker, delBlockHeightTracker, addBlockHeightTracker, updateBlockHeightTracker } from '@/api/xpay/blockHeightTracker';
import { BlockHeightTrackerVO, BlockHeightTrackerQuery, BlockHeightTrackerForm } from '@/api/xpay/blockHeightTracker/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const blockHeightTrackerList = ref<BlockHeightTrackerVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const blockHeightTrackerFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BlockHeightTrackerForm = {
  id: undefined,
  chain: undefined,
  lastHeight: undefined,
}
const data = reactive<PageData<BlockHeightTrackerForm, BlockHeightTrackerQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    chain: undefined,
    lastHeight: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "ID不能为空", trigger: "blur" }
    ],
    chain: [
      { required: true, message: "链不能为空", trigger: "blur" }
    ],
    lastHeight: [
      { required: true, message: "当前高度不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询区块监听高度追踪列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBlockHeightTracker(queryParams.value);
  blockHeightTrackerList.value = res.rows;
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
  blockHeightTrackerFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BlockHeightTrackerVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加区块监听高度追踪";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BlockHeightTrackerVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getBlockHeightTracker(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改区块监听高度追踪";
}

/** 提交按钮 */
const submitForm = () => {
  blockHeightTrackerFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBlockHeightTracker(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBlockHeightTracker(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BlockHeightTrackerVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除区块监听高度追踪编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delBlockHeightTracker(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('xpay/blockHeightTracker/export', {
    ...queryParams.value
  }, `blockHeightTracker_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

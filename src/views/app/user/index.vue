<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入用户账号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="queryParams.email" placeholder="请输入用户邮箱" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机区号" prop="areacode">
              <el-input v-model="queryParams.areacode" placeholder="请输入手机区号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="VIP等级" prop="vipLevel">
              <el-input v-model="queryParams.vipLevel" placeholder="请输入VIP等级" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="邀请码" prop="inviteCode">
              <el-input v-model="queryParams.inviteCode" placeholder="请输入邀请码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="推荐人ID" prop="parentId">
              <el-input v-model="queryParams.parentId" placeholder="请输入推荐人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="最后登录时间" prop="loginDate">
              <el-date-picker clearable v-model="queryParams.loginDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择最后登录时间" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['app:user:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['app:user:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['app:user:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['app:user:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" v-if="true" />
        <el-table-column label="用户编号" align="center" prop="userCode" />
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="用户昵称" align="center" prop="nickName" />
        <el-table-column label="用户类型" align="center" prop="userType" />
        <el-table-column label="用户邮箱" align="center" prop="email" />
        <el-table-column label="手机区号" align="center" prop="areacode" />
        <el-table-column label="手机号码" align="center" prop="phonenumber" />
        <el-table-column label="用户性别" align="center" prop="sex" />
        <el-table-column label="头像" align="center" prop="avatarUrl" >
          <template #default="scope">
            <ImagePreview
              :width="100"
              :height="100"
              :src="scope.row.avatarUrl"
              :preview-src-list="[scope.row.avatarUrl]"
            />
          </template>
        </el-table-column>

        <el-table-column label="VIP等级" align="center" prop="vipLevel" />

        <el-table-column label="邀请码" align="center" prop="inviteCode" />
        <el-table-column label="推荐人ID" align="center" prop="parentId" />
        <el-table-column label="有效推荐人数" align="center" prop="validRecommend" />
        <el-table-column label="积分" align="center" prop="point" />
        <el-table-column label="帐号状态" align="center" prop="status" />
        <el-table-column label="最后登录IP" align="center" prop="loginIp" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['app:user:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['app:user:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="form.userName" :readonly="form.userId" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机区号" prop="areacode">
          <el-input v-model="form.areacode" placeholder="请输入手机区号" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <image-upload v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="VIP等级" prop="vipLevel">
          <el-input v-model="form.vipLevel" placeholder="请输入VIP等级" />
        </el-form-item>
        <el-form-item label="支付密码" prop="payPwd">
          <el-input v-model="form.payPwd" type="password" placeholder="请输入支付密码" />
        </el-form-item>
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input v-model="form.inviteCode" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item label="推荐人ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入推荐人ID" />
        </el-form-item>
        <el-form-item label="积分" prop="point">
          <el-input v-model="form.point" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="User" lang="ts">
import { listUser, getUser, delUser, addUser, updateUser } from '@/api/app/user';
import { UserVO, UserQuery, UserForm } from '@/api/app/user/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userList = ref<UserVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserForm = {
  userName: undefined,
  nickName: undefined,
  userType: undefined,
  email: undefined,
  areacode: undefined,
  phonenumber: undefined,
  sex: undefined,
  avatar: undefined,
  password: undefined,
  vipLevel: undefined,
  payPwd: undefined,
  inviteCode: undefined,
  parentId: undefined,
  referrerIds: undefined,
  point: undefined,
  status: undefined,
  remark: undefined
}
const data = reactive<PageData<UserForm, UserQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    nickName: undefined,
    userType: undefined,
    email: undefined,
    areacode: undefined,
    phonenumber: undefined,
    sex: undefined,
    avatar: undefined,
    password: undefined,
    vipLevel: undefined,
    payPwd: undefined,
    inviteCode: undefined,
    parentId: undefined,
    referrerIds: undefined,
    point: undefined,
    status: undefined,
    loginIp: undefined,
    loginDate: undefined,
    params: {
    }
  },
  rules: {
    userName: [
      { required: true, message: "用户账号不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUser(queryParams.value);
  userList.value = res.rows;
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
  form.value = { ...initFormData };
  userFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  data.rules.password  = [{ required: true, message: "密码不能为空", trigger: "blur" }]
  dialog.visible = true;
  dialog.title = "添加用户信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserVO) => {
  reset();
  const _userId = row?.userId || ids.value[0]

  delete data.rules.password

  const res = await getUser(_userId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户信息";
}

/** 提交按钮 */
const submitForm = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.userId) {
        await updateUser(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addUser(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserVO) => {
  const _userIds = row?.userId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户信息编号为"' + _userIds + '"的数据项？').finally(() => loading.value = false);
  await delUser(_userIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('app/user/export', {
    ...queryParams.value
  }, `user_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

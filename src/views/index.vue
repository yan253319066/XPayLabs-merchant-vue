<template>
  <div>
    <el-dialog v-model="googleBindingVisible" title="绑定谷歌验证器" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="google-auth-setup">
        <el-steps :active="step" finish-status="success" simple style="width: 100%">
          <el-step title="下载" />
          <el-step title="扫码" />
          <el-step title="验证" />
        </el-steps>

        <div v-if="step === 0" class="step-content">
          <div class="step-title">步骤 1: 下载谷歌验证器应用</div>
          <p>请在您的移动设备上下载并安装谷歌验证器应用：</p>
          <div class="app-links">
            <el-link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" type="primary">
              <el-icon><Download /></el-icon> 安卓 - Google Play
            </el-link>
            <el-link href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" type="primary">
              <el-icon><Download /></el-icon> 苹果 - App Store
            </el-link>
          </div>
          <div class="step-actions">
            <el-button type="primary" @click="step = 1">下一步</el-button>
          </div>
        </div>

        <div v-if="step === 1" class="step-content">
          <div class="step-title">步骤 2: 扫描二维码</div>
          <p>打开谷歌验证器应用并扫描此二维码：</p>
          <div class="qrcode-container">
            <QrcodeVue :value="qrCodeUrl" :size="200" level="H" class="qrcode-image" />
          </div>
          <div class="secret-key">
            <p>手动输入密钥：</p>
            <el-tag size="large">{{ secretKey }}</el-tag>
            <el-button link type="primary" size="small" @click="copyText(secretKey)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
          <div class="step-actions">
            <el-button @click="step = 0">返回</el-button>
            <el-button type="primary" @click="step = 2">下一步</el-button>
          </div>
        </div>

        <div v-if="step === 2" class="step-content">
          <div class="step-title">步骤 3: 验证码确认</div>
          <p>请输入谷歌验证器应用中的 6 位验证码：</p>
          <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item prop="code">
              <el-input v-model="form.code" placeholder="请输入6位验证码" maxlength="6" />
            </el-form-item>
            <div class="step-actions">
              <el-button @click="step = 1">返回</el-button>
              <el-button type="primary" @click="handleBind">完成绑定</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Download, CopyDocument } from '@element-plus/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { bind2fa, verify2fa, merchantInfo } from '@/api/xpay/merchant';
import { verify2faLogin } from '@/api/login';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const googleBindingVisible = ref(false);
const step = ref(0);
const secretKey = ref('');
const qrCodeUrl = ref('');
const formRef = ref<ElFormInstance>();
const form = ref({ code: '' });
const rules: ElFormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码必须为6位数字', trigger: 'blur' },
    { pattern: /^[0-9]{6}$/, message: '验证码只能包含数字', trigger: 'blur' }
  ]
};

const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  ElMessage.success('已复制');
};

const handleBind = async () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    const { data } = await verify2fa({ code: Number(form.value.code) });
    if (data.verify) {
      await verify2faLogin({ code: Number(form.value.code) });
      googleBindingVisible.value = false;
      ElMessage.success('谷歌验证器绑定成功');
    } else {
      ElMessage.error('谷歌验证码错误');
    }
  });
};

onMounted(async () => {
  const isAdmin = userStore.roles.includes('superadmin');
  if (!isAdmin) return;
  const { data } = await merchantInfo();
  if (data.googleStatus === 'UNBOUND') {
    googleBindingVisible.value = true;
    const res = await bind2fa();
    secretKey.value = res.data.secretKey;
    qrCodeUrl.value = res.data.qrCodeUrl;
  }
});
</script>

<style scoped>
.google-auth-setup {
  padding: 10px 0;
}
.step-content {
  margin-top: 20px;
}
.step-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.app-links {
  display: flex;
  gap: 20px;
  margin: 15px 0;
}
.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}
.secret-key {
  text-align: center;
  margin: 15px 0;
}
.step-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
</style>

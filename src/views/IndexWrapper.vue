<template>
  <component :is="currentComponent" />
</template>

<script setup lang="ts">
import { shallowRef, onMounted, defineAsyncComponent } from 'vue';
import { merchantInfo } from '@/api/xpay/merchant';
import { useUserStore } from '@/store/modules/user';

// 动态组件引用 - 使用 shallowRef 避免组件被响应式化
const currentComponent = shallowRef();

// 异步加载组件
const IndexV3 = defineAsyncComponent(() => import('@/views/index-v3.vue'));
const IndexV2 = defineAsyncComponent(() => import('@/views/index-v2.vue'));

onMounted(async () => {
  try {
    const userStore = useUserStore();

    // 检查用户是否是superadmin
    if (userStore.roles.includes('superadmin')) {
      currentComponent.value = IndexV3;
      return;
    }
    
    // 获取商户信息
    const { data: merchant } = await merchantInfo();
    
    // 根据 merchantSysVersion 判断使用哪个组件
    if (merchant?.merchantSysVersion === 'V3') {
      currentComponent.value = IndexV3;
    } else {
      // V2 或其他版本使用 index-v2.vue
      currentComponent.value = IndexV2;
    }
  } catch (error) {
    console.error('获取商户信息失败，使用默认版本:', error);
    // 出错时默认使用 V3 版本
    currentComponent.value = IndexV3;
  }
});
</script>
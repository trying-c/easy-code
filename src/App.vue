<template>
  <!-- 动态组件，根据计算出的布局组件名来渲染对应的布局 -->
  <component :is="layoutComponent" :key="layoutName">
    <!-- 路由视图现在被包裹在动态布局之内 -->
    <router-view />
  </component>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/store/modules/settings';

const AppLayout = defineAsyncComponent(() => import('./layout/AppLayout.vue'));
const BlankLayout = defineAsyncComponent(() => import('./layout/BlankLayout.vue'));

// 创建一个布局组件的映射
const layouts = {
  AppLayout,
  BlankLayout,
};

const route = useRoute();
const settingsStore = useSettingsStore();

// 计算当前路由的布局名称
const layoutName = computed(() => route.meta.layout || 'AppLayout');

// 计算属性，用于动态选择布局组件
const layoutComponent = computed(() => {
  settingsStore.setLayoutComponent(layoutName.value); // 更新设置
  return layouts[layoutName.value] || AppLayout;      // 返回对应的组件
});
</script>

<style>
/* App.vue 通常不需要 scoped 样式，全局样式在 assets/styles/index.scss 中 */
</style>
<template>
  <!-- 动态组件，根据计算出的布局组件名来渲染对应的布局 -->
  <component :is="layoutComponent">
    <!-- 路由视图现在被包裹在动态布局之内 -->
    <router-view />
  </component>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/store/modules/settings';

// 异步加载布局组件，可以实现代码分割，优化初始加载速度
const AppLayout = defineAsyncComponent(() => import('./layout/AppLayout.vue'));
const BlankLayout = defineAsyncComponent(() => import('./layout/BlankLayout.vue'));

const route = useRoute();
const settingsStore = useSettingsStore();

// 创建一个布局组件的映射
const layouts = {
  AppLayout,
  BlankLayout,
};

// 计算属性，用于根据当前路由的 meta.layout 动态选择布局组件
const layoutComponent = computed(() => {
  // 从路由元信息获取布局名称，如果没有指定，则默认使用 AppLayout
  const layoutName = route.meta.layout || 'AppLayout';

  settingsStore.setLayoutComponent(layoutName); // 更新设置存储中的布局组件

  return layouts[layoutName] || AppLayout; // 返回对应的组件
});
</script>

<style>
/* App.vue 通常不需要 scoped 样式，全局样式在 assets/styles/index.scss 中 */
</style>
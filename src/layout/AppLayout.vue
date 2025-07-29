<template>
    <div class="app-wrapper" :class="{
        'layout-side': settingsStore.layout === 'side',
        'layout-top': settingsStore.layout === 'top',
        'sidebar-expanded': !settingsStore.isSidebarCollapsed,
        'sidebar-collapsed': settingsStore.isSidebarCollapsed,
    }">
        <!-- 侧边栏 (只在侧边栏布局时渲染) -->
        <Sidebar v-if="settingsStore.layout === 'side'" />

        <!-- 折叠按钮 (只在侧边栏布局时渲染) -->
        <el-button v-if="settingsStore.layout === 'side'" class="layout-collapse-button"
            @click="settingsStore.toggleSidebar" circle
            :icon="settingsStore.isSidebarCollapsed ? 'ArrowRightBold' : 'ArrowLeftBold'" />

        <!-- 主容器 -->
        <div class="main-container">
            <!-- 顶栏 (只在顶部布局时渲染) -->
            <div v-if="settingsStore.layout === 'top'" class="header-wrapper">
                <Header />
            </div>

            <!-- 主内容区 -->
            <div class="content-wrapper">
                <AppMain />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import AppMain from './components/AppMain.vue';

const settingsStore = useSettingsStore();

</script>

<style lang="scss" scoped>
$sidebar-width: 210px;
$gap: 16px;
$header-height: 60px;
$button-size: 32px;
$transition-duration: 0.35s;
$transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);

.app-wrapper {
    position: relative;
    height: 100vh;
    width: 100vw;
    // 基础样式，为两个布局模式提供一个带间距的画布
    padding: $gap;
    box-sizing: border-box;
    overflow: hidden;
}

/* ================== 侧边栏布局 (.layout-side) ================== */
.layout-side {

    /* 侧边栏 */
    .sidebar-container {
        // position: absolute;
        top: $gap;
        bottom: $gap;
        left: $gap;
        width: $sidebar-width;
        z-index: 10;
        transform: translateX(0);
        transition: transform $transition-duration $transition-timing-function;

        @include frosted-glass(var(--app-glass-bg-color), 20px);
        @include elegant-border();
        @include soft-shadow();
        border-radius: 12px;
    }

    &.sidebar-collapsed .sidebar-container {
        transform: translateX(calc(-100% - #{$gap}));
    }

    /* 主内容区 */
    .main-container {
        position: absolute;
        top: $gap;
        bottom: $gap;
        right: $gap;
        z-index: 9;
        transition: left $transition-duration $transition-timing-function;
    }

    &.sidebar-expanded .main-container {
        left: calc(#{$sidebar-width} + #{$gap} * 2);
    }

    &.sidebar-collapsed .main-container {
        left: $gap;
    }

    .content-wrapper {
        width: 100%;
        height: 100%;
        @include frosted-glass();
        @include elegant-border();
        @include soft-shadow();
        border-radius: 12px;
    }

    /* 折叠按钮 */
    .layout-collapse-button {
        position: absolute;
        top: 50%;
        z-index: 12;
        transform: translateY(-50%);
        transition: left $transition-duration $transition-timing-function;
        border: 1px solid var(--app-border-color);
        background-color: var(--app-glass-bg-color);
    }

    &.sidebar-expanded .layout-collapse-button {
        left: calc(#{$sidebar-width} + #{$gap} * 2 - (#{$button-size} / 2) - #{$gap});
    }

    &.sidebar-collapsed .layout-collapse-button {
        left: calc(#{$gap} * -1);
    }
}

/* ================== 顶部布局 (.layout-top) ================== */
.layout-top {
    display: flex;
    flex-direction: column;
    gap: $gap;

    .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: $gap;
    }

    .header-wrapper,
    .content-wrapper {
        @include frosted-glass();
        @include elegant-border();
        @include soft-shadow();
        border-radius: 12px;
    }

    .header-wrapper {
        flex-shrink: 0;
        height: $header-height;
    }

    .content-wrapper {
        flex-grow: 1;
        min-height: 0;
    }
}
</style>
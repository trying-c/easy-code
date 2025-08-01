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


        <GlobalSettings v-bind="settings" />
    </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import AppMain from './components/AppMain.vue';
import GlobalSettings from '@/components/GlobalSettings.vue';
import { computed } from 'vue';

const settingsStore = useSettingsStore();

const settings = computed(() => {

    return settingsStore.layout === 'side' ? {
        class: 'side-setting',
        placement: 'bottom-left'
    } : {
        class: 'top-setting',
        placement: 'top-right'
    }
});
</script>

<style lang="scss" scoped>
$sidebar-width: 180px;
$gap: 16px;
$header-height: 36px;
$button-size: 32px;
$transition-duration: 0.35s;
$transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);



.app-wrapper {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}


/* ================== 侧边栏布局 (.layout-side) ================== */
.layout-side {
    display: flex;
    gap: $gap;
    /* 新增：将间距移到最外层 */
    /* 新增：使用 gap 来创建侧边栏和主内容区的间距 */

    /* 侧边栏 */
    .sidebar-container {
        flex-shrink: 0;
        /* 防止侧边栏被压缩 */
        width: $sidebar-width;
        transform: translateX(0);
        // 关键改动：移除 transform
        transition: width $transition-duration $transition-timing-function,
            min-width $transition-duration $transition-timing-function;

        // @include frosted-glass(var(--app-glass-bg-color), 20px);
        // @include elegant-border();
        // @include soft-shadow();
        border-radius: 12px;
    }

    &.sidebar-collapsed .sidebar-container {
        width: 48px;
        // transform: translateX(calc(-100% - #{$gap}));
        min-width: 0;
        /* 关键新增：允许宽度收缩到0 */
        overflow: hidden;
        /* 新增：隐藏内部内容，避免在收缩时溢出 */

    }

    /* 主内容区 */
    .main-container {
        flex-grow: 1;
        min-width: 0;
        margin: $gap;
        margin-left: calc(#{$gap} * -1 + 5px);
        // transition: all $transition-duration $transition-timing-function;
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
        z-index: 1;
        // transform: translateY(-50%);
        transition: left $transition-duration $transition-timing-function;
        border: 1px solid var(--app-border-color);
        background-color: var(--app-glass-bg-color);
    }

    &.sidebar-expanded .layout-collapse-button {
        left: calc(#{$sidebar-width} - #{$gap} * 2 - 6px);
    }

    &.sidebar-collapsed .layout-collapse-button {
        // left: calc(#{$gap} - 16px);
        left: 12px;
    }


    .side-setting {

        :deep(.settings-trigger) {
            margin-bottom: 10px;
        }

        :deep(.settings-panel) { 
            margin-bottom: 16px;
        }
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
        // gap: $gap;
    }

    // .header-wrapper,
    .content-wrapper {
        margin: $gap;
        margin-top: calc(#{$gap} - 5px);
        @include frosted-glass();
        @include elegant-border();
        @include soft-shadow();
        border-radius: 12px;
    }

    .header-wrapper {
        flex-shrink: 0;
        height: $header-height;
        margin-top: calc(#{$gap} / 2);
    }

    .content-wrapper {
        flex-grow: 1;
        min-height: 0;
    }

    .top-setting :deep(.settings-trigger) {
        margin-right: 10px;
    }
}
</style>
<template>
    <div class="sidebar-container">
        <div class="sidebar-content">
            <div class="logo">
                <img src="@/assets/tc.png" alt="logo" />
                <h1 v-show="!settingsStore.isSidebarCollapsed">Trying's Room</h1>
            </div>
            <el-scrollbar>
                <el-menu :class="{ 'is-sidebar-collapsed': settingsStore.isSidebarCollapsed }"
                    :default-active="activeMenu" :router="true" :collapse="settingsStore.isSidebarCollapsed"
                    :collapse-transition="false" :unique-opened="true" text-color="var(--app-glass-text-color)"
                    active-text-color="var(--el-color-primary)">
                    <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.path">
                        <el-icon>
                            <component :is="route.meta.icon || 'Menu'" />
                        </el-icon>
                        <template #title>{{ route.meta.title }}</template>
                    </el-menu-item>
                </el-menu>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '@/store/modules/settings';

const settingsStore = useSettingsStore();
const router = useRouter();
const route = useRoute();
const activeMenu = computed(() => route.path);


const menuRoutes = computed(() => {
    // 直接从 router.options.routes 中过滤出需要主布局且未被隐藏的路由
    return router.options.routes.filter(r => r.meta?.layout === 'AppLayout' && !r.meta?.hidden);
}); 
</script>

<style lang="scss" scoped>
.sidebar-container,
.sidebar-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    height: 60px;
    width: 100%;
    padding: 10px 12px 0;
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;

    img {
        height: 28px;
    }

    h1 {
        font-size: 18px;
        font-weight: bold;
        color: var(--app-glass-text-color);
        white-space: nowrap;
    }
}

.el-scrollbar {
    width: 100%;
}

.el-menu {
    width: 100%;
    border-right: none !important;
    background-color: transparent !important;
    flex: 1;

    &.is-sidebar-collapsed :deep(.el-menu-tooltip__trigger) {
        padding: 0 12px !important;
    }
}


.bottom-plane {
    display: flex;
    justify-content: space-around;
    gap: $gap-base;
    padding-bottom: 16px;

    &.is-sidebar-collapsed {
        flex-direction: column;
        padding: 8px 0;
        padding-bottom: 16px;
    }

}

.icon-button {
    margin-left: 10px;
    font-size: 18px;
    color: var(--app-glass-text-color);
    cursor: pointer;
    transition: color 0.3s;

    &.is-active {
        color: var(--el-color-primary);
    }

    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
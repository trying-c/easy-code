<template>
    <div class="sidebar-container">
        <div class="sidebar-content">
            <div class="logo">
                <img src="@/assets/tc.png" alt="logo" />
                <h1 v-show="!isMenuTextHidden">Trying's Room</h1>
            </div>
            <el-scrollbar>
                <el-menu :default-active="activeMenu" :router="true" :collapse="isMenuTextHidden"
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
            <div class="bottom-plane">
                <el-icon class="icon-button" @click="router.push('/settings')">
                    <Setting />
                </el-icon>
                <el-icon class="icon-button" @click="router.push('/profile')">
                    <User />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '@/store/modules/settings';

const settingsStore = useSettingsStore();
const router = useRouter();
const route = useRoute();
const activeMenu = computed(() => route.path);
const isMenuTextHidden = ref(settingsStore.isSidebarCollapsed);
let timer = null;

const menuRoutes = computed(() => {
    // 直接从 router.options.routes 中过滤出需要主布局且未被隐藏的路由
    return router.options.routes.filter(r => r.meta?.layout === 'AppLayout' && !r.meta?.hidden);
});
watch(() => settingsStore.isSidebarCollapsed, (isCollapsed) => {
    if (isCollapsed) {
        isMenuTextHidden.value = true;
    } else {
        timer = setTimeout(() => {
            isMenuTextHidden.value = false;
            clearTimeout(timer);
        }, 150);
    }
}, { immediate: true });

onUnmounted(() => { clearTimeout(timer); });
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;

    img {
        height: 32px;
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
}

.bottom-plane {
    padding-bottom: 16px;
}

.icon-button {
    margin-left: 10px;
    font-size: 18px;
    color: var(--app-glass-text-color);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
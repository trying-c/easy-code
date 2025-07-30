<template>
    <div class="sidebar-container">
        <div class="sidebar-content">
            <div class="logo">
                <img src="@/assets/tc.png" alt="logo" />
                <h1 v-show="!settingsStore.isSidebarCollapsed">Trying's Room</h1>
            </div>
            <el-scrollbar>
                <Menus :collapse="settingsStore.isSidebarCollapsed" />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings';
import Menus from '@/components/Menus.vue';

const settingsStore = useSettingsStore();

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
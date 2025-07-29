<template>
    <div class="header-container">
        <div class="left-panel">
            <!-- 顶部菜单 -->
            <el-menu :default-active="activeMenu" mode="horizontal" :router="true"
                text-color="var(--app-glass-text-color)" active-text-color="var(--el-color-primary)">
                <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.path">
                    <el-icon>
                        <component :is="route.meta.icon || 'Menu'" />
                    </el-icon>
                    <span>{{ route.meta.title }}</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 右侧面板留作将来扩展 -->
        <div class="right-panel">
            <el-icon class="icon-button" @click="router.push('/settings')">
                <Setting />
            </el-icon>
            <el-icon class="icon-button" @click="router.push('/profile')">
                <User />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menuRoutes = computed(() => {
    // 直接从 router.options.routes 中过滤出需要主布局且未被隐藏的路由
    return router.options.routes.filter(r => r.meta?.layout === 'AppLayout' && !r.meta?.hidden);
});

const activeMenu = computed(() => route.path);
</script>

<style lang="scss" scoped>
.header-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.left-panel {
    flex-grow: 1;
}

.el-menu--horizontal {
    border-bottom: none;
    height: 100%;

    .el-menu-item {
        color: var(--app-glass-text-color);

        &.is-active {
            color: var(--el-color-primary) !important;
            border-bottom-color: var(--el-color-primary) !important;
        }

        &:hover {
            background-color: var(--el-menu-hover-bg-color) !important;
        }
    }
}

.right-panel {
    display: flex;
    align-items: center;

    .icon-button {
        margin-left: 10px;
        cursor: pointer;
        font-size: 18px;
        color: var(--app-glass-text-color);
        transition: color 0.3s;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
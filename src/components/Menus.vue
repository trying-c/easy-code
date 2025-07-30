<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    collapse: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'vertical' // 默认是 vertical 模式
    },
    ellipsis: {
        type: Boolean,
        default: true
    }
});

const router = useRouter();
const route = useRoute();
const routes = computed(() => router.options.routes.filter(r => r.meta?.layout === 'AppLayout' && !r.meta?.hidden));

const activeMenu = computed(() => {
    const { meta, path } = route;
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    // 对于子路由，我们需要高亮其父菜单
    // 例如，在 /finance/transactions 页面，activeMenu 应该是 /finance
    const matchedParent = route.matched.find(r => r.path === path)?.parent;
    if (matchedParent) {
        // 这里的逻辑可以更复杂，但简单的处理是直接返回父路径
        // 但 Element Plus 的 `router` 模式通常能自动处理好这个，所以 path 即可
    }
    return path;
});

// --- 辅助函数 (直接定义在组件内) ---

/**
 * 判断一个路由是否有可见的子路由。
 * @param {object} routeItem - 单个路由配置对象。
 * @returns {boolean}
 */
const hasVisibleChildren = (routeItem) => {
    // 如果没有 children 数组，或者数组为空，则返回 false
    if (!routeItem.children || routeItem.children.length === 0) {
        return false;
    }
    // 检查 children 中是否至少有一个没有被 hidden
    const visibleChildren = routeItem.children.filter(child => !child.meta?.hidden);
    return visibleChildren.length > 0;
};

/**
 * 拼接父路径和子路径。
 * 这是一个简化的、无依赖的路径拼接函数。
 * @param {string} basePath - 父路由的路径。
 * @param {string} routePath - 子路由的路径。
 * @returns {string} - 完整的绝对路径。
 */
const resolvePath = (basePath, routePath) => {
    // 简单地拼接，确保路径正确
    // URL 构造函数是现代浏览器原生支持的，比 path-browserify 更轻量
    // 但对于简单的拼接，直接字符串操作更直观
    const newPath = `${basePath}/${routePath}`;
    // 替换掉可能出现的 '//'
    return newPath.replace(/\/\//g, '/');
};
</script>

<template>

    <el-menu :class="{ 'is-sidebar-collapsed': props.collapse }" :mode="props.mode" :ellipsis="props.ellipsis"
        :default-active="activeMenu" router :collapse="props.collapse" :collapse-transition="false"
        :unique-opened="true" text-color="var(--app-glass-text-color)" active-text-color="var(--el-color-primary)">

        <!-- 循环遍历所有路由配置 -->
        <template v-for="route in routes" :key="route.path">
            <!-- 1. 只渲染那些没有被隐藏的路由 -->
            <template v-if="!route.meta?.hidden">

                <!-- 2. 情况一：如果路由有可见的子路由 (children)，渲染成 SubMenu -->
                <el-sub-menu v-if="hasVisibleChildren(route)" :index="route.path">
                    <template #title>
                        <el-icon v-if="route.meta?.icon">
                            <component :is="route.meta.icon" />
                        </el-icon>
                        <span>{{ route.meta.title }}</span>
                    </template>

                    <!-- 循环渲染子菜单项 -->
                    <el-menu-item v-for="child in route.children" :key="child.path"
                        :index="resolvePath(route.path, child.path)">
                        <!-- 子菜单项可以不显示图标，或者也给它配上图标 -->
                        <el-icon v-if="child.meta?.icon">
                            <component :is="child.meta.icon" />
                        </el-icon>
                        <span>{{ child.meta.title }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <!-- 3. 情况二：如果路由没有子路由，渲染成普通的 MenuItem -->
                <el-menu-item v-else :index="route.path">
                    <el-icon v-if="route.meta?.icon">
                        <component :is="route.meta.icon" />
                    </el-icon>
                    <template #title>
                        <span>{{ route.meta?.title }}</span>
                    </template>
                </el-menu-item>

            </template>
        </template>
    </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
    width: 100%;
    border-right: none !important;
    background-color: transparent !important;
    flex: 1;

    &.is-sidebar-collapsed :deep(.el-menu-tooltip__trigger) {
        padding: 0 12px !important;
    }
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
</style>
// index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useMenuStore } from '@/stores/menu';
import { generateRoutesFromConfig } from './generator'; // 导入我们的新生成器

/**
 * 静态路由 (Static Routes)
 * 无需权限，所有用户都能访问的页面，如登录页、404页等。
 */
export const staticRoutes = [
    {
        path: '/',
        redirect: '/dashboard',
        meta: { hidden: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/errors/404.vue'),
        meta: {
            title: '404 - 页面未找到',
            layout: 'BlankLayout',
            hidden: true
        }
    },
];

/**
 * 路由配置
 */
const router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes // 初始化时只挂载静态路由
});

/**
 * 重载动态路由
 * 该函数会清空所有旧的动态路由，并根据最新的菜单配置添加新路由。
 */
export async function reloadDynamicRoutes() {
    const router = await import('@/router').then(m => m.default);
    const menuStore = useMenuStore();

    // 1. 移除所有旧的动态路由
    // 我们通过检查 meta.isDynamic 标记来找到它们
    const existingRoutes = router.getRoutes();
    existingRoutes.forEach(route => {
        if (route.meta.isDynamic) {
            router.removeRoute(route.name);
        }
    });

    // 2. 从 Pinia store 获取最新的菜单配置
    const menuConfig = menuStore.config;

    // 3. 使用生成器函数将新配置转换为路由
    const newDynamicRoutes = generateRoutesFromConfig(menuConfig);

    // 4. 动态添加新的路由
    newDynamicRoutes.forEach(route => {
        router.addRoute(route);
    });

    console.log('动态路由已重新加载:', router.getRoutes());
}

/**
 * 动态添加路由
 * 这个函数应该在应用初始化时（例如，在 main.js 的导航守卫中）被调用一次。
 */
export function setupDynamicRoutes() {
    const menuStore = useMenuStore();

    // 从 Pinia store 获取菜单配置
    const menuConfig = menuStore.config;

    // 使用生成器函数将配置转换为路由
    const dynamicRoutes = generateRoutesFromConfig(menuConfig);

    // 动态添加路由
    dynamicRoutes.forEach(route => {
        router.addRoute(route);
    });

    console.log('动态路由已添加:', router.getRoutes());
}

export default router;
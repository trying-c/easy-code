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
import { createRouter, createWebHistory } from 'vue-router';

/**
 * 路由配置
 *
 * meta 参数说明:
 *   title: string        // 菜单和面包屑导航的标题
 *   icon: string         // 菜单项的图标
 *   layout: string       // 指定该路由使用的布局组件名 (AppLayout, BlankLayout, etc.)
 */
export const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
            title: '看板',
            icon: 'House',
            layout: 'AppLayout'
        }
    },
    {
        path: '/weight',
        name: 'Weight',
        component: () => import('@/views/weight/index.vue'),
        meta: {
            title: '体重管理',
            icon: 'Histogram',
            layout: 'AppLayout'
        }
    },
    {
        path: '/sleep',
        name: 'Sleep',
        component: () => import('@/views/sleep/index.vue'),
        meta: {
            title: '睡眠管理',
            icon: 'MoonNight',
            layout: 'AppLayout'
        }
    },
    {
        path: '/finance',
        name: 'Finance',
        component: () => import('@/views/finance/index.vue'),
        meta: {
            title: '财务管理',
            icon: 'Money',
            layout: 'AppLayout'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/user/profile.vue'),
        meta: {
            title: '个人中心',
            icon: 'User',
            layout: 'AppLayout',
            hidden: true
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: {
            title: '系统设置',
            icon: 'Setting',
            layout: 'AppLayout',
            hidden: true
        }
    },
    // 根路径重定向
    {
        path: '/',
        redirect: '/dashboard'
    },
    // =======================================================
    // 关键：添加 404 通配符路由
    // =======================================================
    {
        // 使用带参数的路径来匹配所有未被其他规则捕获的路径
        // a. :pathMatch(.*)* 是一种高级匹配模式，能捕获多层级的路径
        // b. :catchAll(.*) 是更常见的写法，两者效果类似
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error-page/404.vue'),
        meta: {
            title: '404 - 页面未找到',
            // 这个页面通常不需要布局，或者使用一个空白布局
            layout: 'BlankLayout',
            hidden: true // 确保它不会出现在菜单里
        }
    },
    // 示例：一个将来可能添加的登录页，它使用空白布局
    // {
    //     path: '/login',
    //     name: 'Login',
    //     component: () => import('@/views/login/index.vue'),
    //     meta: {
    //         title: '登录',
    //         layout: 'BlankLayout'
    //     }
    // }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;
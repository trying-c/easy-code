import { createRouter, createWebHistory } from 'vue-router';

/**
 * 静态路由 (Static Routes)
 * - 无需权限，所有用户都能访问的页面，如登录页、404页等。
 * - 它们在应用初始化时被直接挂载。
 */
const staticRoutes = [
    {// 根路径重定向
        path: '/',
        redirect: '/dashboard',
        meta: {
            hidden: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/errors/404.vue'),
        meta: {
            title: '404 - 页面未找到',
            // 这个页面通常不需要布局，或者使用一个空白布局
            layout: 'BlankLayout',
            hidden: true // 确保它不会出现在菜单里
        }
    },
]

/**
 * 动态路由，又叫菜单路由，暂时固定配置，后续应该由Pinia菜单配置数据改造而成。
 */
const menuRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
            title: '看板',
            icon: 'House',
        }
    },
    {
        path: '/weight',
        name: 'Weight',
        component: () => import('@/views/weight/index.vue'),
        meta: {
            title: '体重管理',
            icon: 'Histogram',
        }
    },
    {
        path: '/sleep',
        name: 'Sleep',
        component: () => import('@/views/sleep/index.vue'),
        meta: {
            title: '睡眠管理',
            icon: 'MoonNight',
        }
    },
    {
        path: '/notion',
        name: 'Notion',
        component: () => import('@/views/notion/index.vue'),
        meta: {
            title: 'Notion',
            icon: 'Notification',
            hidden: true
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/user/profile.vue'),
        meta: {
            title: '个人中心',
            icon: 'User',
            hidden: true
        }
    },
    {
        path: "/system",
        meta: {
            title: "系统管理",
            icon: "Setting",
        },
        children: [
            {
                path: "menu-config",
                name: "MenuConfig",
                component: () => import("@/views/system/menu-config/index.vue"),
                meta: {
                    title: "菜单配置"
                }
            }
        ]
    }
]

export const routes = [...staticRoutes, ...menuRoutes];

/**
 * 路由配置
 *
 * meta 参数说明:
 *   title: string        // 菜单和面包屑导航的标题
 *   icon: string         // 菜单项的图标
 *   layout: string       // 指定该路由使用的布局组件名 (AppLayout, BlankLayout, etc.)
 */
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

/**
 * 动态路由 (Dynamic Routes)
 * - 将在这里被生成和添加。
 * - 我们会在路由守卫 (router.beforeEach) 中调用一个函数，
 *   该函数会读取 Pinia 中的菜单配置，生成路由，然后使用 router.addRoute() 添加。
 * - 目前我们只做准备工作。
 */

// export function addDynamicRoutes() {
//   // 伪代码
//   const menuStore = useMenuStore();
//   const dynamicRoutes = generateRoutesFromConfig(menuStore.config);
//   dynamicRoutes.forEach(route => {
//     router.addRoute(route);
//   })
// }

export default router;
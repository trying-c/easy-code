
/**
 * 使用 import.meta.glob 预先获取所有视图组件。
 * 这会创建一个映射，键是文件路径，值是动态导入该模块的函数。
 * 例如：{ '/src/views/dashboard/index.vue': () => import('/src/views/dashboard/index.vue') }
 * 
 * 我们使用 { eager: false } 来实现懒加载（默认就是 false）。
 */
const viewModules = import.meta.glob('@/views/**/*.vue');

/**
 * 将路径字符串转换为驼峰式命名，用于生成路由的 name 属性。
 * e.g., '/system/menu-config' -> 'SystemMenuConfig'
 * @param {string} path - 路由路径
 * @returns {string} 转换后的名称
 */
function generateRouteName(path) {
    if (!path || path === '/') return 'Home';
    return path.split('/')
        .filter(p => p)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
}

/**
 * 递归转换函数，将单个菜单配置项转换为单个路由记录。
 * @param {object} menuItem - 来自 menu.default.json 的单个菜单项
 * @param {boolean} isChild - 标记是否为子路由，用于处理路径
 * @returns {object | null} Vue Router 的 RouteRecordRaw 对象，如果菜单被禁用则返回 null
 */
function transformMenuToRoute(menuItem, isChild = false) {
    // 如果菜单项被禁用，则直接跳过
    if (menuItem.meta?.enabled === false) {
        return null;
    }

    const route = {
        // 对于子路由，路径应该是相对的，而不是绝对的。
        // e.g., 'menu-config' 而不是 '/menu-config'
        path: isChild ? menuItem.path.replace(/^\//, '') : menuItem.path,
        name: menuItem.name || generateRouteName(menuItem.path),
        meta: { ...menuItem.meta }, // 复制 meta 数据
    };

    // 如果有 'page' 字段，则它是一个视图组件路由
    if (menuItem.page) {
        // 构造模块路径并从预先加载的映射中获取组件
        const componentPath = `/src/views/${menuItem.page}.vue`;
        if (viewModules[componentPath]) {
            route.component = viewModules[componentPath];
        } else {
            // 如果在映射中找不到组件，打印一个警告，避免应用崩溃
            console.warn(`组件未找到：${componentPath}。请检查 menu.default.json 中的 'page' 配置。`);
            // 你可以设置一个默认的空组件或错误组件
            route.component = () => import('@/errors/ViewCoding.vue'); // 建议创建一个这样的组件
        }
    } else if (!menuItem.children || menuItem.children.length === 0) {
        // 如果在映射中找不到组件，打印一个警告，避免应用崩溃
        console.warn(`菜单项 ${menuItem.name} 没有指定 'page' 或 'children'，请检查配置。`);
        // 你可以设置一个默认的空组件或错误组件
        route.component = () => import('@/errors/ViewCoding.vue'); // 建议创建一个这样的组件

    }

    // 如果有 'layout' 字段，将其 component 名存入 meta
    if (menuItem.layout?.component) {
        route.meta.layout = `${menuItem.layout.component.charAt(0).toUpperCase() + menuItem.layout.component.slice(1)}Layout`; // e.g., 'app' -> 'AppLayout'
    }

    // 递归处理子菜单
    if (menuItem.children && menuItem.children.length > 0) {
        route.children = menuItem.children
            .map(child => transformMenuToRoute(child, true)) // 传入 isChild = true
            .filter(Boolean); // 过滤掉被禁用的子菜单 (null)
    }

    return route;
}

/**
 * 主函数：将整个菜单配置数组转换为 Vue Router 的路由记录数组。
 * @param {Array} menuConfig - 完整的菜单配置数组
 * @returns {Array} RouteRecordRaw[]
 */
export function generateRoutesFromConfig(menuConfig) {
    if (!Array.isArray(menuConfig)) {
        console.error("Menu config must be an array.");
        return [];
    }
    return menuConfig
        .map(menuItem => transformMenuToRoute(menuItem, false))
        .filter(Boolean); // 过滤掉顶级被禁用的菜单 (null)
}
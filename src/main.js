import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import router, { setupDynamicRoutes } from './router' // 导入 router 和新函数

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/styles/index.scss'; // 导入全局 SCSS 样式
import 'element-plus/theme-chalk/dark/css-vars.css'; // !! 关键：手动引入 Element Plus 的暗黑主题样式文件 !!


const app = createApp(App)

// 注册所有 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)

setupDynamicRoutes();

app.use(router)
app.use(ElementPlus)
app.mount('#app')

// --- 更健壮的方案(处理异步权限和重复添加)-- -
// 你可能需要一个更复杂的导航守卫，如下所示：

/*
let routesAdded = false; // 标志位，防止重复添加

router.beforeEach(async (to, from, next) => {
    // 假设你有 token 验证逻辑
    // const hasToken = getToken(); 

    if (!routesAdded) {
        // 在这里可以先从后端获取用户权限/菜单
        // await userStore.getInfo(); 
        
        setupDynamicRoutes();
        routesAdded = true;
        
        // 使用 replace: true, 确保导航守卫会使用新添加的路由重新进入
        return next({ ...to, replace: true });
    }
    
    next();
});
*/
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

import router, { setupDynamicRoutes } from './router' // 导入 router 和新函数

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
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
app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')

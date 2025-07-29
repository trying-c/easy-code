import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// !! 关键：手动引入 Element Plus 的暗黑主题样式文件 !!
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入全局 SCSS 样式
import '@/assets/styles/index.scss'

const app = createApp(App)

// 注册所有 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
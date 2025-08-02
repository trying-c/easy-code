import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig((mode) => {

    return {
        plugins: [
            vue(),
            // 自动导入和组件注册
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],

        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // --- 添加下面的 CSS 配置 ---
        css: {
            preprocessorOptions: {
                scss: {
                    // 自动注入我们定义的 mixin 和变量
                    // 注意：结尾的分号scss是必须的
                    additionalData: `
                        @use "@/assets/styles/_variables.scss" as *;
                        @use "@/assets/styles/_mixin.scss" as *;
                    `
                }
            }
        }
    }
})

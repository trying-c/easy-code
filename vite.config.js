import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { Client } from '@notionhq/client';

// 自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 这是一个 Vite 插件，用来创建我们的后端 API 接口
const notionServerPlugin = (env) => {
    // 初始化 Notion 客户端
    const notion = new Client({
        auth: env.VITE_NOTION_SECRET
        // auth: "***REMOVED***"
    });

    return {
        name: 'vite-plugin-notion-server',
        configureServer(server) {
            // 创建一个中间件，拦截特定的 URL 请求
            server.middlewares.use(async (req, res, next) => {
                // 如果前端请求的 URL 是 '/api/getNotionPage'，我们就处理它
                if (req.url === '/api/getNotionPage') {
                    try {
                        // 使用 Notion SDK 安全地从后端请求数据
                        const response = await notion.blocks.children.list({
                            block_id: env.VITE_NOTION_PAGE_ID,
                            // block_id: "Test-to-Vue-24285b62a463808fb1d3d644fbabb6a9",
                        });

                        // 设置响应头为 JSON
                        res.setHeader('Content-Type', 'application/json');
                        // 将从 Notion 获取到的数据返回给前端
                        res.end(JSON.stringify(response));

                    } catch (error) {
                        // 如果出错，返回 500 错误和错误信息
                        console.error('Error fetching from Notion API:', error);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Failed to fetch data from Notion' }));
                    }
                } else {
                    // 如果不是我们想要的 URL，交给下一个中间件处理
                    next();
                }
            });
        }
    };
};
// https://vite.dev/config/
export default defineConfig((mode) => {

    // 加载 .env 文件中的环境变量
    const env = loadEnv(mode, process.cwd(), '');


    return {
        plugins: [
            vue(),
            notionServerPlugin(env),
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

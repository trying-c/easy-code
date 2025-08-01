<template>
    <div v-if="loading" class="loading-state">
        正在加载 Notion 内容...
    </div>
    <div v-if="error" class="error-state">
        加载失败：{{ error }}
    </div>
    <div v-if="blockMap" class="notion-page-container">
        <!-- 核心渲染组件 -->
        <!-- <div v-for="block in blockMap" :key="block.id">
            {{ block }}
        </div> -->
        <!-- <NotionRenderer :blockMap="blockMap" fullPage /> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NotionRenderer, getPageBlocks } from 'vue-notion';
import axios from 'axios';

const blockMap = ref(null);
const loading = ref(true);
const error = ref(null);

// 组件挂载后，执行获取数据的逻辑
onMounted(async () => {

    try {
        // 调用我们自己创建的后端代理 API
        const response = await axios.get('/api/getNotionPage');
        blockMap.value = response.data.results;
        debugger
    } catch (err) {
        console.error('Failed to fetch notion data:', err);
        error.value = err.response?.data?.message || err.message;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.loading-state,
.error-state {
    padding: 40px;
    text-align: center;
    font-size: 1.2rem;
    color: #666;
}

.notion-page-container {
    /* 你可以在这里添加一些外边距或样式来控制 Notion 内容的显示区域 */
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}
</style>

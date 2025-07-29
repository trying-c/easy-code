<template>
    <div class="page-container">
        <h1><el-icon>
                <Histogram />
            </el-icon> 体重管理</h1>

        <el-row :gutter="16">
            <el-col :span="8">
                <el-card class="data-card">
                    <template #header>记录今日体重</template>
                    <el-form label-position="top">
                        <el-form-item label="体重 (kg)">
                            <el-input-number v-model="currentWeight" :precision="1" :step="0.1" :min="0"
                                style="width: 100%;" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%;">保存记录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card class="data-card">
                    <template #header>体重趋势图</template>
                    <div class="placeholder-chart">
                        此处未来将渲染图表 (e.g., ECharts)
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const currentWeight = ref(65.0);
</script>

<style lang="scss" scoped>
// 通用页面样式
.page-container {
    h1 {
        color: var(--app-glass-text-color);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
}

.data-card {
    background-color: transparent !important;
    border: 1px solid var(--app-border-color);

    :deep(.el-card__header),
    :deep(.el-form-item__label) {
        color: var(--app-glass-text-color);
    }
}

.placeholder-chart {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--app-glass-text-color);
    opacity: 0.5;
}
</style>
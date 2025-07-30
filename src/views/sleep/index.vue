<template>
    <div class="page-container">
        <h1><el-icon>
                <MoonNight />
            </el-icon> 睡眠管理</h1>

        <el-row :gutter="16">
            <el-col :span="8">
                <el-card shadow="hover">
                    <template #header>记录昨晚睡眠</template>
                    <el-form label-position="top">
                        <el-form-item label="入睡时间">
                            <el-time-picker v-model="sleepTime" style="width: 100%;" />
                        </el-form-item>
                        <el-form-item label="起床时间">
                            <el-time-picker v-model="wakeTime" style="width: 100%;" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%;">保存记录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover">
                    <template #header>睡眠质量分析</template>
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
const sleepTime = ref(new Date(2024, 1, 1, 23, 0));
const wakeTime = ref(new Date(2024, 1, 2, 7, 30));
</script>

<style lang="scss" scoped>
/* 样式与体重管理页面一致，可复用或提取为全局类 */
.page-container {
    h1 {
        color: var(--app-glass-text-color);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
}


.placeholder-chart {
    height: 257px;
    /* 调整高度以对齐左侧卡片 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--app-glass-text-color);
    opacity: 0.5;
}
</style>
<template>
    <div>
        <h1>概览</h1>
        <p>Welcome to your new framework!</p>
        <el-card class="box-card" style="margin-top: 20px;">
            <template #header>
                <div class="card-header">
                    <span>Try Element Plus Components</span>
                </div>
            </template>
            <p>The theme color of these components will change based on your selection.</p>
            <el-button type="primary">Primary Button</el-button>
            <el-button type="success">Success Button</el-button>
            <el-switch v-model="value1" />
            <el-slider v-model="value2" style="width: 200px; margin-top: 10px;" />
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const value1 = ref(true)
const value2 = ref(50)
</script>

<style scoped>
/* 页面文字颜色也应该适应主题 */
h1,
p {
    color: var(--app-glass-text-color);
}

/* 卡片在不同主题下的背景 */
.el-card {
    background-color: transparent !important;
    border: 1px solid var(--app-border-color);
    color: var(--app-glass-text-color);
}
</style>
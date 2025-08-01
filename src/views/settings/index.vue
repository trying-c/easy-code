<template>
    <div>
        <h1>系统设置</h1>

        <el-card class="setting-card">
            <template #header>外观设置</template>
            <el-form label-width="120px" label-position="left">

                <!-- 主题模式：使用 Switch 组件 -->
                <el-form-item label="暗黑模式">
                    <el-switch v-model="isDarkMode" inline-prompt :active-icon="'Moon'" :inactive-icon="'Sunny'"
                        style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #f2f2f2;" />
                </el-form-item>

                <!-- 布局模式：使用 Segmented 组件 -->
                <el-form-item label="布局模式">
                    <el-segmented v-model="settingsStore.layout" :options="layoutOptions" />
                </el-form-item>

                <!-- 主题色：保持 Color Picker -->
                <el-form-item label="主题色">
                    <el-color-picker v-model="settingsStore.themeColor" />
                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingsStore } from '@/store/settings';

const settingsStore = useSettingsStore();

// 为布局模式的 Segmented 组件定义选项
const layoutOptions = [
    { label: '侧边栏', value: 'side' },
    { label: '顶部', value: 'top' },
];

/**
 * 创建一个计算属性来桥接 Switch 的布尔值 (true/false)
 * 和我们 store 中的字符串值 ('dark'/'light')
 */
const isDarkMode = computed({
    // getter：当 store 中的 theme 是 'dark' 时，返回 true
    get() {
        return settingsStore.theme === 'dark';
    },
    // setter：当 Switch 状态改变时，更新 store
    set(newValue) {
        settingsStore.theme = newValue ? 'dark' : 'light';
    }
});
</script>

<style lang="scss" scoped>
h1 {
    color: var(--app-glass-text-color);
    margin-bottom: 20px;
}

.setting-card {
    max-width: 600px;
    background-color: transparent !important;
    border: 1px solid var(--app-border-color);

    // 深度选择器，确保在任何主题下标签文字颜色正确
    :deep(.el-card__header),
    :deep(.el-form-item__label) {
        color: var(--app-glass-text-color);
    }
}
</style>
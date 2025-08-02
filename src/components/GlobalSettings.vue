<template>
    <div ref="settingsRef" class="global-settings" :class="[placementClass, { 'is-active': isPanelVisible }]"
        @mouseenter="openPanel">
        <!-- 交互方式依然是点击 -->
        <div class="settings-trigger" @click="togglePanel">
            <el-icon :size="20">
                <Setting />
            </el-icon>
        </div>

        <!-- 展开的设置面板 -->
        <transition name="panel-fade">
            <div v-if="isPanelVisible" class="settings-panel">
                <h4 class="panel-title">系统设置</h4>

                <!-- 主题切换 -->
                <div class="setting-item">
                    <span class="label">外观</span>
                    <el-switch :model-value="settingsStore.theme === 'dark'" inline-prompt :active-icon="Moon"
                        :inactive-icon="Sunny" @change="settingsStore.toggleTheme" />
                </div>

                <!-- 布局模式切换 -->
                <div class="setting-item">
                    <span class="label">布局模式</span>
                    <el-radio-group :model-value="settingsStore.layout" size="small"
                        @update:model-value="settingsStore.setLayout($event)">
                        <el-radio-button value="side">侧边</el-radio-button>
                        <el-radio-button value="top">顶部</el-radio-button>
                    </el-radio-group>
                </div>

                <!-- 主色调选择 -->
                <div class="setting-item">
                    <span class="label">主色调</span>
                    <!-- v-model 直接绑定 store 中的 themeColor -->
                    <el-color-picker v-model="settingsStore.themeColor" />
                </div>

            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Setting, Moon, Sunny } from '@element-plus/icons-vue';
// 1. 从 VueUse 引入 onClickOutside
import { onClickOutside } from '@vueuse/core'
// 1. 引入你的 settings store
import { useSettingsStore } from '@/stores/settings'; // 请确保路径正确

// 1. 定义 props
const props = defineProps({
    placement: {
        type: String,
        // 默认值为 'bottom-right'
        default: 'bottom-right',
        // 使用 validator 确保传入的值是合法的
        validator: (value) => {
            return ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value);
        }
    }
});
// 2. 创建一个计算属性来生成动态的 class 
const placementClass = computed(() => `placement-${props.placement}`);

// 2. 实例化 store
const settingsStore = useSettingsStore();

const isPanelVisible = ref(false);
const settingsRef = ref(null);

// 3. 切换面板的函数保持不变
const togglePanel = () => {
    isPanelVisible.value = !isPanelVisible.value;
};

const openPanel = () => {
    isPanelVisible.value = true;
};

// 使用 watch 来动态启用/禁用 onClickOutside
const stopClickOutside = ref(() => { });

watch(isPanelVisible, (isVisible) => {
    if (isVisible) {
        // 当面板打开时，我们才开始监听外部点击  
        stopClickOutside.value = onClickOutside(
            settingsRef,
            () => { isPanelVisible.value = false; },
            { ignore: ['.el-popper'] }
        ).stop; // 获取停止函数
    } else {
        if (stopClickOutside.value) {
            stopClickOutside.value();
        }
    }
});


</script>

<style lang="scss" scoped>
$button-position: 10px;
$panel-width: 280px;
$panel-height: 210px;
$panel-position: 40px;

.global-settings {
    position: fixed;
    z-index: 1000;

    // --- 默认位置：右下角 ---
    &.placement-bottom-right {
        bottom: $button-position;
        right: $button-position;

        .settings-panel {
            bottom: $panel-position; // 位于按钮上方
            right: 0;
        }
    }

    // --- 新增位置：左下角 ---
    &.placement-bottom-left {
        bottom: $button-position;
        left: $button-position;

        .settings-panel {
            bottom: $panel-position; // 位于按钮上方
            left: 0;
        }
    }

    // --- 新增位置：右上角 ---
    &.placement-top-right {
        top: $button-position;
        right: $button-position;

        .settings-panel {
            top: $panel-position; // 位于按钮下方
            right: 0;
        }
    }

    // --- 新增位置：左上角 ---
    &.placement-top-left {
        top: $button-position;
        left: $button-position;

        .settings-panel {
            top: $panel-position; // 位于按钮下方
            left: 0;
        }
    }

    .settings-trigger {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease-in-out;

        @include frosted-glass(var(--app-glass-bg-color), 8px);
        border: 1px solid var(--app-border-color);
        box-shadow: 0 1px 4px var(--app-shadow-color);

        .el-icon {
            color: var(--app-glass-text-color);
            transition: transform 0.4s ease;
        }

        &:hover,
        &.is-active {
            // 这里的 .is-active 是我们组件内部的，当面板展开时按钮也高亮
            background-color: var(--el-color-primary) !important;
            border-color: var(--el-color-primary) !important;

            .el-icon {
                color: #fff !important;
                transform: rotate(90deg);
            }
        }
    }

    .settings-panel {
        position: absolute;
        bottom: 60px;
        right: 0;
        width: $panel-width;
        height: $panel-height;
        padding: 16px 20px;
        border-radius: var(--app-border-radius-lg, 12px);

        @include frosted-glass;
        @include elegant-border;
        @include soft-shadow;

        .panel-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--app-glass-text-color);
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--app-border-color);
        }

        .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;

            .label {
                color: var(--app-glass-text-color);
                font-size: 14px;
            }
        }
    }
}

.panel-fade-enter-active,
.panel-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}
</style>
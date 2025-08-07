<template>
    <el-calendar ref="calendar">
        <!-- 1. 自定义头部插槽 (#header) -->
        <template #header="{ date }">
            <div class="cute-calendar-header">
                <!-- 标题，可以加上可爱的小图标点缀 -->
                <span class="cute-calendar-title"> {{ date }}</span>

                <!-- 操作按钮组 -->
                <div class="cute-calendar-buttons">
                    <el-button-group>
                        <!-- 上个月/下个月按钮改为圆形图标按钮 -->
                        <el-button @click="handleSelectDate('prev-month')" circle :icon="ArrowLeftBold" />

                        <!-- "今天" 按钮保持文字，但使用圆角矩形（药丸形状）-->
                        <el-button @click="handleSelectDate('today')" round>今天</el-button>

                        <el-button @click="handleSelectDate('next-month')" circle :icon="ArrowRightBold" />
                    </el-button-group>
                </div>
            </div>
        </template>

        <template #date-cell="{ data }">
            <div class="cute-date-cell" :class="{ 'is-selected': data.isSelected }">
                <!-- 单元格头部：放置日期和标记 -->
                <div class="cell-header">
                    <span class="day-number">{{ data.day.split('-')[2].replace(/^0/, '') }}</span>
                    <div v-if="data.isToday" class="today-marker">✨</div>
                </div>

                <!-- 单元格内容区：未来可以在这里添加日程、消费等数据 -->
                <div class="cell-content">
                    <!-- 例如: <div class="schedule-item">开产品会议</div> -->
                </div>
            </div>
        </template>
    </el-calendar>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const calendar = ref(null);

function handleSelectDate(value) {
    if (!calendar.value) return;
    calendar.value.selectDate(value);
}
</script>


<style lang="scss" scoped>
.el-calendar {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 !important;

    :deep(.el-calendar__body) {
        flex: 1;

        .el-calendar-table {
            width: 100%;
            height: 100%;
        }
    }

    :deep(.el-calendar__header) {
        padding: 1rem;
        padding-bottom: 0;
    }
}

// 可爱风头部样式 (保持不变)
.cute-calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .cute-calendar-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--app-glass-text-color);
    }

    .el-button-group .el-button {
        @include frosted-glass(var(--app-input-bg-color), 8px);
        @include elegant-border;
        box-shadow: none !important;
        background-color: transparent !important;
        color: var(--app-glass-text-color);
        transition: all 0.2s ease-out;

        &:hover {
            transform: scale(1.08);
            background-color: hsla(var(--el-color-primary-hue), 50%, 50%, 0.2) !important;
            border-color: var(--el-color-primary) !important;
            color: var(--el-color-primary) !important;
        }
    }
}

// 1. 表格布局：保持镂空效果
:deep(.el-calendar-table) {
    border-collapse: separate !important;
    border-spacing: 8px !important;

    thead th {
        font-size: 0.9rem;
    }

    td.is-selected {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
    }

    td {
        border-bottom: none !important;
        border-right: none !important;
    }

    .el-calendar-row,
    td {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
    }
}

// 2. 关键重置：清空 Element Plus 在 .el-calendar-day 上的默认样式
:deep(.el-calendar-day) {
    padding: 0 !important;
    border: none !important;
    height: 100% !important; // 让其撑满父级 td
    background-color: transparent !important; // 【重要】移除默认背景，特别是选中时的蓝色背景
}

// 3. 我们的“可爱卡片”样式
.cute-date-cell {
    @include frosted-glass(var(--app-glass-bg-color), 12px);
    width: 100%;
    min-height: 100%;
    border-radius: var(--app-border-radius-lg);
    padding: 8px;
    display: flex;
    flex-direction: column;
    transition: all 0.25s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .cell-header {
        display: flex;
        align-items: center;

        .day-number {
            font-weight: 500;
            color: var(--app-glass-text-color);
        }

        .today-marker {
            margin-left: 4px;
            font-size: 1rem;
            animation: sparkle-anim 1.5s infinite ease-in-out;
        }
    }

    .cell-content {
        flex-grow: 1;
        margin-top: 8px;
    }

    // --- 交互状态 (使用修正后的选择器) ---
    // 悬浮状态
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        background-color: hsla(var(--el-color-primary-hue), 50%, 50%, 0.1);
    }
}

// 【重要】选中状态的样式覆盖
.is-selected .cute-date-cell {
    background-color: var(--el-color-primary) !important;
    transform: translateY(-2px);

    // 使内部所有文字变白
    .day-number,
    .cell-content,
    .cell-content * {
        color: #fff !important;
    }

    .today-marker {
        display: none;
    }
}

// 弱化非本月日期
.el-calendar-table .prev .cute-date-cell,
.el-calendar-table .next .cute-date-cell {
    opacity: 0.4;
    pointer-events: none;
}

// 动画 (复用)
@keyframes sparkle-anim {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
}
</style>
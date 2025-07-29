<template>
    <div class="page-container">
        <h1><el-icon>
                <Money />
            </el-icon> 财务管理</h1>

        <el-row :gutter="16">
            <el-col :span="24">
                <el-card class="data-card">
                    <template #header>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>近期交易记录</span>
                            <el-button type="primary" icon="Plus">记一笔</el-button>
                        </div>
                    </template>
                    <el-table :data="tableData" style="width: 100%; background-color: transparent;">
                        <el-table-column prop="date" label="日期" />
                        <el-table-column prop="type" label="类型" />
                        <el-table-column prop="category" label="分类" />
                        <el-table-column prop="amount" label="金额" />
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
const tableData = [
    { date: '2024-07-28', type: '支出', category: '餐饮', amount: '- ¥35.00' },
    { date: '2024-07-27', type: '支出', category: '交通', amount: '- ¥12.50' },
    { date: '2024-07-26', type: '收入', category: '工资', amount: '+ ¥8000.00' },
];
</script>

<style lang="scss" scoped>
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
    :deep(.el-table th),
    :deep(.el-table tr) {
        color: var(--app-glass-text-color);
        background-color: transparent;
    }

    :deep(.el-table td, .el-table th.is-leaf) {
        border-bottom: 1px solid var(--app-border-color);
    }
}
</style>
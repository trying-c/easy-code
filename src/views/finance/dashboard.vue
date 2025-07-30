<template>
    <div class="finance-dashboard-no-charts">
        <!-- 第一行：核心数据统计 -->
        <el-row :gutter="20">
            <el-col :xs="24" :sm="8">
                <el-card shadow="hover">
                    <el-statistic :value="monthlyStats.income" :precision="2">
                        <template #title>
                            <div class="statistic-title">
                                <span>本月收入</span>
                                <el-tag type="success" size="small">Income</el-tag>
                            </div>
                        </template>
                        <template #prefix>¥</template>
                    </el-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="8">
                <el-card shadow="hover">
                    <el-statistic :value="monthlyStats.expense" :precision="2">
                        <template #title>
                            <div class="statistic-title">
                                <span>本月支出</span>
                                <el-tag type="warning" size="small">Expense</el-tag>
                            </div>
                        </template>
                        <template #prefix>¥</template>
                    </el-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="8">
                <el-card shadow="hover">
                    <el-statistic :value="monthlyStats.balance" :precision="2">
                        <template #title>
                            <div class="statistic-title">
                                <span>本月结余</span>
                                <el-tag type="info" size="small">Balance</el-tag>
                            </div>
                        </template>
                        <template #prefix>
                            <span
                                :style="{ color: monthlyStats.balance >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">¥</span>
                        </template>
                    </el-statistic>
                </el-card>
            </el-col>
        </el-row>

        <!-- 第二行：近期账单 和 账户余额 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <!-- 左侧：近期账单 -->
            <el-col :xs="24" :md="15">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>近期账单</span>
                            <el-button type="primary" :icon="Plus" @click="openAddDialog">记一笔</el-button>
                        </div>
                    </template>
                    <el-table :data="recentTransactions" stripe style="width: 100%" empty-text="暂无账单，快去记一笔吧！">
                        <el-table-column label="分类" min-width="150">
                            <template #default="{ row }">
                                <div class="category-cell">
                                    <el-icon :size="20">
                                        <component :is="categoryStore.getCategoryIconById(row.categoryId)" />
                                    </el-icon>
                                    <span class="category-name">{{ categoryStore.getFullCategoryNameById(row.categoryId)
                                    }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="right" width="120">
                            <template #default="{ row }">
                                <span :class="row.type === 'income' ? 'income-color' : 'expense-color'">
                                    {{ (row.type === 'income' ? '+' : '-') }} {{ row.amount.toFixed(2) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="日期" width="160">
                            <template #default="{ row }">
                                {{ formatDate(row.date) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

            <!-- 右侧：账户余额 -->
            <el-col :xs="24" :md="9">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>账户余额</span>
                        </div>
                    </template>
                    <div v-if="accountBalances.length > 0" class="account-list">
                        <div v-for="account in accountBalances" :key="account.id" class="account-item">
                            <span class="account-name">{{ account.name }}</span>
                            <span class="account-balance">{{ account.balance.toFixed(2) }} ¥</span>
                        </div>
                    </div>
                    <el-empty v-else description="请先在设置中添加账户" />
                </el-card>
            </el-col>
        </el-row>

        <!-- 记一笔的对话框 (复用 TransactionList 的逻辑) -->
        <el-dialog v-model="dialogVisible" title="记一笔新账" width="500px" destroy-on-close>
            <TransactionForm v-if="dialogVisible" @success="handleSuccess" @cancel="dialogVisible = false" />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/store/modules/transaction';
import { useCategoryStore } from '@/store/modules/category';
import { useAccountStore } from '@/store/modules/account';
import TransactionForm from '@/components/finance/TransactionForm.vue';

// 引入 Pinia Stores
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

// --- 计算属性 ---

// 1. 计算当月统计数据
const monthlyStats = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const stats = { income: 0, expense: 0, balance: 0 };

    transactionStore.transactions
        .filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getFullYear() === year && txDate.getMonth() === month;
        })
        .forEach(tx => {
            if (tx.type === 'income') {
                stats.income += tx.amount;
            } else {
                stats.expense += tx.amount;
            }
        });

    stats.balance = stats.income - stats.expense;
    return stats;
});

// 2. 获取最近的7条交易记录
const recentTransactions = computed(() => {
    return transactionStore.transactions.slice(0, 7);
});

// 3. 计算所有账户的当前余额
const accountBalances = computed(() => {
    // 创建一个以账户ID为键，初始余额为值的映射
    const balances = new Map(
        accountStore.accounts.map(acc => [acc.id, acc.initialBalance])
    );

    // 遍历所有交易，更新余额
    transactionStore.transactions.forEach(tx => {
        if (balances.has(tx.accountId)) {
            const currentBalance = balances.get(tx.accountId);
            if (tx.type === 'income') {
                balances.set(tx.accountId, currentBalance + tx.amount);
            } else if (tx.type === 'expense') {
                balances.set(tx.accountId, currentBalance - tx.amount);
            }
            // 注意：转账功能需要额外处理，此处暂不实现
        }
    });

    // 格式化为模板所需的数组
    return accountStore.accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        balance: balances.get(acc.id) || 0,
    }));
});


// --- 对话框逻辑 ---
const dialogVisible = ref(false);

const openAddDialog = () => {
    dialogVisible.value = true;
};

const handleSuccess = () => {
    dialogVisible.value = false;
};

// --- 工具函数 ---
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
</script>

<style lang="scss" scoped>
.finance-dashboard-no-charts {
    .el-col {
        margin-bottom: 20px;
    }
}

.statistic-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-regular);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.category-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .category-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.income-color {
    color: var(--el-color-success);
    font-weight: bold;
}

.expense-color {
    color: var(--el-color-danger);
}

.account-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    .account-name {
        color: var(--el-text-color-primary);
    }

    .account-balance {
        font-weight: bold;
        font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
        color: var(--el-text-color-secondary);
    }
}

// 响应式调整
@media (max-width: 768px) {
    .el-col {
        margin-bottom: 15px;
    }

    .el-card {
        :deep(.el-card__body) {
            padding: 15px;
        }
    }
}
</style>
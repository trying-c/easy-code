<template>
    <div class="transaction-list-page">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>账单列表</span>
                    <el-button type="primary" :icon="Plus" @click="openAddDialog">记一笔</el-button>
                </div>
            </template>

            <el-table :data="transactionStore.transactions" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="date" label="日期" width="180" sortable>
                    <template #default="{ row }">
                        {{ new Date(row.date).toLocaleString() }}
                    </template>
                </el-table-column>

                <el-table-column label="类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.type === 'income' ? 'success' : 'warning'">
                            {{ row.type === 'income' ? '收入' : '支出' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="分类" width="180">
                    <template #default="{ row }">
                        <el-icon>
                            <component :is="categoryStore.getCategoryIconById(row.categoryId)" />
                        </el-icon>
                        <span style="margin-left: 5px">{{ categoryStore.getFullCategoryNameById(row.categoryId)
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="amount" label="金额 (元)" width="150" align="right">
                    <template #default="{ row }">
                        <span
                            :style="{ color: row.type === 'income' ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                            {{ (row.type === 'income' ? '+' : '-') + ' ' + row.amount.toFixed(2) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="账户" width="180">
                    <template #default="{ row }">
                        {{ accountStore.getAccountNameById(row.accountId) }}
                    </template>
                </el-table-column>

                <el-table-column prop="notes" label="备注" />

                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" :icon="Edit" @click="handleEdit(row)" />
                        <el-popconfirm title="确定要删除这笔记录吗？" @confirm="handleDelete(row.id)" width="200">
                            <template #reference>
                                <el-button size="small" type="danger" :icon="Delete" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- Add/Edit Dialog -->
        <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑账单' : '记一笔新账'" width="500px"
            :before-close="handleClose">
            <TransactionForm v-if="dialogVisible" :transaction-id="currentTxId" @success="handleSuccess"
                @cancel="handleClose" />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/store/modules/transaction';
import { useCategoryStore } from '@/store/modules/category';
import { useAccountStore } from '@/store/modules/account';
import TransactionForm from '@/components/finance/TransactionForm.vue';
import { ElMessage } from 'element-plus';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

const loading = ref(false);
const dialogVisible = ref(false);
const isEditMode = ref(false);
const currentTxId = ref(null);

const openAddDialog = () => {
    isEditMode.value = false;
    currentTxId.value = null;
    dialogVisible.value = true;
};

const handleEdit = (row) => {
    isEditMode.value = true;
    currentTxId.value = row.id;
    dialogVisible.value = true;
};

const handleDelete = (id) => {
    transactionStore.deleteTransaction(id);
    ElMessage.success('删除成功');
};

const handleSuccess = () => {
    dialogVisible.value = false;
};

const handleClose = () => {
    dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-button+.el-popconfirm {
    margin-left: 8px;
}
</style>
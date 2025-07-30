import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid'; // 用于生成唯一ID

export const useTransactionStore = defineStore('transactions', () => {
    // 使用 useStorage 将数据与 localStorage 同步
    const transactions = useStorage('my-finance-transactions', []);

    // Actions
    const addTransaction = (tx) => {
        const newTx = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...tx, // tx 包含 type, amount, categoryId, accountId, date, notes
        };
        transactions.value.unshift(newTx); // 添加到数组开头
    };

    const deleteTransaction = (id) => {
        transactions.value = transactions.value.filter((tx) => tx.id !== id);
    };

    const updateTransaction = (id, updatedTx) => {
        const index = transactions.value.findIndex((tx) => tx.id === id);
        if (index !== -1) {
            transactions.value[index] = { ...transactions.value[index], ...updatedTx };
        }
    };

    // Getters (用 computed 实现)
    const getTransactionById = computed(() => {
        return (id) => transactions.value.find((tx) => tx.id === id);
    });

    return {
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getTransactionById,
    };
});
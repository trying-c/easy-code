import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';

export const useAccountStore = defineStore('accounts', () => {
    // 使用 useStorage 将数据持久化到 localStorage
    const accounts = useStorage('my-finance-accounts', [
        { id: 'acc-1', name: '现金钱包', initialBalance: 500 },
        { id: 'acc-2', name: '招商银行储蓄卡', initialBalance: 15000 },
        { id: 'acc-3', name: '支付宝', initialBalance: 2000 },
        { id: 'acc-4', name: '信用卡', initialBalance: -5000 }, // 信用卡可以是负的初始值
    ]);

    const addAccount = (account) => {
        accounts.value.push({ id: uuidv4(), ...account });
    };

    const updateAccount = (id, updatedAccount) => {
        const index = accounts.value.findIndex((acc) => acc.id === id);
        if (index !== -1) {
            accounts.value[index] = { ...accounts.value[index], ...updatedAccount };
        }
    };

    const deleteAccount = (id) => {
        accounts.value = accounts.value.filter((acc) => acc.id !== id);
    };

    const getAccountNameById = computed(() => {
        const accountMap = new Map(accounts.value.map(acc => [acc.id, acc.name]));
        return (id) => accountMap.get(id) || '未知账户';
    });

    return {
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        getAccountNameById
    };
});
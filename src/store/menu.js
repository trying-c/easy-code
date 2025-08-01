// src/stores/menu.js
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import defaultMenuConfig from '@/config/menu.default.json';
import { ElMessage } from 'element-plus';

export const useMenuStore = defineStore('menu', () => {
    // defaultMenuConfig 是初始值/默认值
    const config = useStorage('menu-config', defaultMenuConfig, localStorage, {
        // 使用自定义的序列化/反序列化，保证格式正确
        serializer: {
            read: v => (v ? JSON.parse(v) : null),
            write: v => JSON.stringify(v),
        },
    });

    /**
     * 更新菜单配置
     * @param {object | Array} newConfig - 新的菜单配置对象
     */
    function updateMenuConfig(newConfig) {
        if (typeof newConfig !== 'object' || newConfig === null) {
            ElMessage.error('菜单配置必须是一个JSON对象或数组！');
            return;
        }
        config.value = newConfig;
    }

    /**
     * 恢复为默认配置
     */
    function resetMenuConfig() {
        config.value = [].concat(defaultMenuConfig);
    }

    return {
        config,
        updateMenuConfig,
        resetMenuConfig,
    };
});

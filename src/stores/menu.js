// src/stores/menu.js
import { defineStore } from 'pinia';
import { useStorage, toValue } from '@vueuse/core';
import defaultMenuConfig from '@/config/menu.default.json';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';


// 递归函数，为菜单项及其子项添加唯一ID
function ensureIds(menuItems) {
    if (!Array.isArray(menuItems)) return [];
    return menuItems.map(item => {
        // 如果没有ID，或者ID不是一个字符串，就给它一个新的ID
        if (!item.id || typeof item.id !== 'string') {
            item.id = `menu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }
        // 递归处理子项
        if (item.children) {
            item.children = ensureIds(item.children);
        }
        return item;
    });
}


export const useMenuStore = defineStore('menu', () => {
    // defaultMenuConfig 是初始值/默认值
    const _config = useStorage('menu-config', defaultMenuConfig, localStorage, {
        // 使用自定义的序列化/反序列化，保证格式正确
        serializer: {
            read: v => (v ? JSON.parse(v) : null),
            write: v => JSON.stringify(v),
        },
    });
    // 创建一个响应式引用来持有经过处理的数据
    const config = ref(ensureIds(toValue(_config)));
    // 监听 useStorage 的变化，并同步更新我们的 config
    watch(_config, (newConfig) => {
        config.value = ensureIds(newConfig);
    });
    /**
     * 更新菜单配置
     * @param {object | Array} newConfig - 新的菜单配置对象
     */
    async function updateMenuConfig(newConfig) {
        if (typeof newConfig !== 'object' || newConfig === null) {
            ElMessage.error('菜单配置必须是一个JSON对象或数组！');
            return;
        }
        _config.value = ensureIds(newConfig);
    }

    /**
     * 恢复为默认配置
     */
    function resetMenuConfig() {
        _config.value = ensureIds(JSON.parse(JSON.stringify(defaultMenuConfig)));
    }

    return {
        config,
        updateMenuConfig,
        resetMenuConfig,
    };
});

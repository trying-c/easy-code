import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';

export const useCategoryStore = defineStore('categories', () => {
    const categories = useStorage('my-finance-categories', [ // 注意：修改了 key 以避免旧数据冲突
        // --- 支出大类 ---
        { id: 'cat-exp-1', name: '餐饮美食', type: 'expense', icon: 'Food', parentId: null },
        { id: 'cat-exp-2', name: '交通出行', type: 'expense', icon: 'Van', parentId: null },
        { id: 'cat-exp-3', name: '购物消费', type: 'expense', icon: 'ShoppingBag', parentId: null },
        { id: 'cat-exp-4', name: '生活居家', type: 'expense', icon: 'House', parentId: null },

        // --- 餐饮子类 ---
        { id: 'cat-exp-1-1', name: '早餐', type: 'expense', icon: 'MostlyCloudy', parentId: 'cat-exp-1' },
        { id: 'cat-exp-1-2', name: '午餐', type: 'expense', icon: 'Sunny', parentId: 'cat-exp-1' },
        { id: 'cat-exp-1-3', name: '晚餐', type: 'expense', icon: 'Moon', parentId: 'cat-exp-1' },
        { id: 'cat-exp-1-4', name: '外卖', type: 'expense', icon: 'Eleme', parentId: 'cat-exp-1' },
        { id: 'cat-exp-1-5', name: '水果零食', type: 'expense', icon: 'IceCream', parentId: 'cat-exp-1' },

        // --- 交通子类 ---
        { id: 'cat-exp-2-1', name: '公交地铁', type: 'expense', icon: 'Platform', parentId: 'cat-exp-2' },
        { id: 'cat-exp-2-2', name: '打车', type: 'expense', icon: 'Guide', parentId: 'cat-exp-2' },

        // --- 收入大类 ---
        { id: 'cat-inc-1', name: '职业收入', type: 'income', icon: 'Money', parentId: null },
        { id: 'cat-inc-2', name: '其他收入', type: 'income', icon: 'Collection', parentId: null },

        // --- 职业收入子类 ---
        { id: 'cat-inc-1-1', name: '工资', type: 'income', icon: 'Coin', parentId: 'cat-inc-1' },
        { id: 'cat-inc-1-2', name: '奖金', type: 'income', icon: 'Trophy', parentId: 'cat-inc-1' },
    ]);

    const categoryMap = computed(() => new Map(categories.value.map(c => [c.id, c])));

    // --- Getters ---
    const getCategoryById = (id) => categoryMap.value.get(id);

    const getFullCategoryNameById = (id) => {
        const category = getCategoryById(id);
        if (!category) return '未分类';
        if (category.parentId) {
            const parent = getCategoryById(category.parentId);
            return parent ? `${parent.name} - ${category.name}` : category.name;
        }
        return category.name;
    };

    const getCategoryIconById = (id) => getCategoryById(id)?.icon || 'QuestionFilled';

    // 新增：将扁平数据转换为树形结构，用于级联选择器和树状表格
    const getCategoryTree = (type) => {
        const list = categories.value.filter(c => c.type === type);
        const map = new Map(list.map(item => [item.id, { ...item, children: [] }]));
        const tree = [];

        for (const item of list) {
            const node = map.get(item.id);
            if (item.parentId && map.has(item.parentId)) {
                map.get(item.parentId).children.push(node);
            } else {
                tree.push(node);
            }
        }
        return tree;
    };

    // --- Actions ---
    const addCategory = (category) => {
        categories.value.push({ id: uuidv4(), ...category });
    };

    const updateCategory = (id, updatedCategory) => {
        const index = categories.value.findIndex((cat) => cat.id === id);
        if (index !== -1) {
            categories.value[index] = { ...categories.value[index], ...updatedCategory };
        }
    };

    const deleteCategory = (id) => {
        // 同时删除所有子分类
        const idsToDelete = [id];
        const findChildren = (parentId) => {
            categories.value.forEach(cat => {
                if (cat.parentId === parentId) {
                    idsToDelete.push(cat.id);
                    findChildren(cat.id); // 递归查找
                }
            });
        };
        findChildren(id);
        categories.value = categories.value.filter(cat => !idsToDelete.includes(cat.id));
    };


    return {
        categories,
        getCategoryById,
        getFullCategoryNameById,
        getCategoryIconById,
        getCategoryTree,
        addCategory,
        updateCategory,
        deleteCategory
    };
});
<!-- src/views/system/menu-config/index.vue -->
<template>
    <div class="menu-config-container" :class="[settingsStore.layout]">
        <div class="menu-config-main" :class="[settingsStore.layout]">
            <!-- 头部标题和操作按钮 -->
            <div class="menu-config-header">
                <h2>菜单路由配置</h2>
                <div>
                    <el-button @click="addRootMenu" :icon="Plus">添加一级菜单</el-button>
                    <el-button type="primary" @click="handleSave" :loading="isSaving"
                        :disabled="!isDirty">保存配置</el-button>
                    <el-button @click="handleReset">恢复默认</el-button>
                </div>
            </div>

            <!-- 递归组件的根节点 -->
            <div class="menu-tree-wrapper">
                <draggable v-model="menuTree" item-key="id" :options="draggableOptions" tag="div">
                    <template #item="{ element: item, index }">
                        <div :key="item.id">
                            <MenuItemEditor :item="item" @add-child="handleAddChild(item)"
                                @remove="removeRootMenu(index)" :is-children="false" />
                        </div>
                    </template>
                </draggable>
                <el-empty v-if="!menuTree.length" description="暂无菜单配置，请添加一级菜单"></el-empty>
            </div>
        </div>


        <el-divider v-if="settingsStore.layout == 'side'" direction="vertical" style="height: 100%;" />

        <div class="menu-config-overview" :class="[settingsStore.layout]">
            <!-- 头部标题和操作按钮 -->
            <!-- <div class="menu-config-header"> -->
            <h2>预览</h2>
            <!-- </div> -->
        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { reloadDynamicRoutes } from '@/router'; // 导入我们的新函数
import { useMenuStore } from '@/stores/menu';
import { useSettingsStore } from '@/stores/settings';
import { Plus } from '@element-plus/icons-vue';
import MenuItemEditor from './components/MenuItemEditor.vue';
import draggable from "vuedraggable";

// #region----- data ------- 
const menuStore = useMenuStore();//  初始化 Store
const settingsStore = useSettingsStore(); //  初始化设置 Store

// 2. 本地响应式状态
// **关键**：我们不直接修改store，而是创建一个深拷贝进行编辑，只有保存时才提交。
const menuTree = ref([]);
const isSaving = ref(false);

// 新增: 用于存储原始数据，作为对比基准
const originalMenuTree = ref([]);

//  #endregion----------------

/**
 * 深拷贝函数
 * @param {Object} item 子项
 */
const deepClone = item => JSON.parse(JSON.stringify(item));

// 创建新菜单项的模板
const createNewMenuItem = () => ({
    id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // 保证唯一性
    path: "",
    page: "",
    layout: {
        component: "app",
        mode: "side"
    },
    meta: {
        title: "",
        icon: "",
        enabled: true
    }
});
//  关键修正3: 递归函数，为从 store 加载的树形数据添加稳定 id 
const addStableIds = (nodes) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach(node => {
        // 如果节点没有 id，就给它加上一个
        if (!node.id) {
            node.id = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }
        // 递归处理子节点
        if (node.children) {
            addStableIds(node.children);
        }
    });
};
// 3. 监听 store.config 的变化，并更新本地 menuTree
// 这确保了在重置配置后，UI能正确响应
watch(
    () => menuStore.config,
    (newConfig) => {
        const clonedConfig = deepClone(newConfig || []);
        addStableIds(clonedConfig); // 为所有节点确保有 id
        menuTree.value = clonedConfig;
        // 更新原始备份
        originalMenuTree.value = deepClone(clonedConfig);
    },
    {
        immediate: true,
        deep: true
    }
);
// 新增: 创建计算属性来判断数据是否被修改 ("脏"状态)
const isDirty = computed(() => {
    return JSON.stringify(menuTree.value) !== JSON.stringify(originalMenuTree.value);
});

const draggableOptions = computed(() => {
    return {
        animation: 200,
        group: 'menu-tree', // 关键：所有可拖拽区域共享一个组名，以实现跨级拖拽
        disabled: false,
        handle: '.drag-handle', // 指定拖拽手柄的 CSS 选择器
        ghostClass: 'ghost', // 拖拽时占位符的类名 
        moveClass: 'draggable-move-transition'
    };
});



// 4. 操作方法
const addRootMenu = () => {
    menuTree.value.push(createNewMenuItem());
};
const removeRootMenu = (index) => {
    menuTree.value.splice(index, 1);
};
const handleAddChild = (parentItem) => {
    if (!parentItem.children) {
        parentItem.children = [];
    }
    parentItem.children.push(createNewMenuItem());
}


const handleSave = () => {
    isSaving.value = true;
    // 从 menuTree 创建一个干净的克隆用于保存
    const configToSave = deepClone(menuTree.value);

    menuStore.updateMenuConfig(configToSave).then(async () => {
        // 保存成功后, 更新原始备份，这样 isDirty 会变为 false
        originalMenuTree.value = deepClone(menuTree.value);
        // 2. 调用函数重载路由
        await reloadDynamicRoutes().then(() => {
            ElMessage.success('菜单配置已更新，新路由已生效！');
        })
    }).catch(error => {
        ElMessage.error('保存失败，请重试。');
        console.error("Save failed:", error);
    }).finally(() => {
        isSaving.value = false;
    });
};

const handleReset = () => {
    ElMessageBox.confirm(
        '确定要恢复为系统默认菜单配置吗？所有未保存的修改将丢失。',
        '警告',
        { confirmButtonText: '确定恢复', type: 'warning' }
    ).then(() => {
        menuStore.resetMenuConfig();
        // menuTree会自动通过watch更新，无需手动赋值 
        ElMessage.success('已恢复为默认配置！');
    }).catch(() => { });
};

onBeforeRouteLeave(async () => {
    // 如果数据没有被修改，则直接允许离开
    if (!isDirty.value) {
        return true;
    }

    // 如果数据被修改了，弹窗确认
    try {
        await ElMessageBox.confirm(
            '您有未保存的更改，确定要离开吗？所有未保存的数据都将丢失。',
            '未保存的更改',
            {
                confirmButtonText: '确定离开',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );
        // 用户点击了 "确定离开"
        return true;
    } catch (error) {
        return false; // 阻止导航
    }
});
</script>

<style lang="scss" scoped>
.menu-config {
    &-container {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &.top {
            flex-direction: column-reverse;
        }

        &.side {
            flex-direction: row;
        }
    }

    &-overview {
        flex: 2;

        h2 {
            width: 100%;
            text-align: right;
        }

        &.top {
            flex: 1;

            h2 {
                text-align: left;
            }
        }
    }

    &-main {
        flex: 3;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: calc($padding-base / 2);
        padding-right: $padding-base;
    }
}

.menu-tree-wrapper {
    min-height: 200px;
    padding: $padding-base;
    padding-top: calc($padding-base / 2);
    padding-left: 0;

    border-top: 1px solid var(--el-border-color);

    flex: 1;

    overflow-y: auto;
}
</style>

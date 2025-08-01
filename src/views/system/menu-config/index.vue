<!-- src/views/system/menu-config/index.vue -->
<template>
    <div class="menu-config-container">
        <div class="menu-config-main">
            <!-- 头部标题和操作按钮 -->
            <div class="menu-config-header">
                <h2>菜单路由配置</h2>
                <div>
                    <el-button @click="addRootMenu" :icon="Plus">添加一级菜单</el-button>
                    <el-button type="primary" @click="handleSave" :loading="isSaving">保存配置</el-button>
                    <el-button @click="handleReset">恢复默认</el-button>
                </div>
            </div>

            <!-- <el-alert title="操作提示" type="info" description="拖拽手柄可调整同级顺序(功能待实现)，点击 +/- 按钮管理层级。所有修改将在点击“保存配置”并刷新页面后生效。"
                show-icon :closable="false" style="margin-bottom: 20px;" /> -->

            <!-- 递归组件的根节点 -->
            <div class="menu-tree-wrapper">
                <MenuItemEditor v-for="(item, index) in menuTree" :key="item.id" :item="item" @add-child="addChild"
                    @remove="() => removeRootMenu(index)" />
                <el-empty v-if="!menuTree.length" description="暂无菜单配置，请添加一级菜单"></el-empty>
            </div>
        </div>


        <div class="menu-config-overview">
            <!-- 头部标题和操作按钮 -->
            <!-- <div class="menu-config-header"> -->
            <h2>预览</h2>
            <!-- </div> -->
        </div>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMenuStore } from '@/store/menu';
import { Plus } from '@element-plus/icons-vue';
import MenuItemEditor from '@/components/menu-config/MenuItemEditor.vue';

// 1. 初始化 Store
const menuStore = useMenuStore();

// 2. 本地响应式状态
// **关键**：我们不直接修改store，而是创建一个深拷贝进行编辑，只有保存时才提交。
const menuTree = ref([]);
const isSaving = ref(false);

// 深拷贝函数
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

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
// **关键修正3: 递归函数，为从 store 加载的树形数据添加稳定 id**
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
    },
    {
        immediate: true,
        deep: true
    }
);

// 4. 操作方法
const addRootMenu = () => {
    menuTree.value.push(createNewMenuItem());
};

const removeRootMenu = (index) => {
    menuTree.value.splice(index, 1);
};

const addChild = (parentItem) => {
    if (!parentItem.children) {
        parentItem.children = [];
    }
    parentItem.children.push(createNewMenuItem());
};

const handleSave = () => {
    // 注意：在保存前，可以选择性地移除我们添加的临时 id
    const configToSave = deepClone(menuTree.value);
    isSaving.value = true;
    // 直接将本地编辑好的树提交给 store
    menuStore.updateMenuConfig(configToSave);
    setTimeout(() => {
        isSaving.value = false;
        ElMessage.success('菜单配置已保存！');
    }, 300); // 模拟保存延迟
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
</script>

<style lang="scss" scoped>
.menu-config {
    &-container {
        // padding: $padding-base 0;
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;

        // flex-direction: row-reverse;
    }

    &-overview {
        flex: 2;
        // border-right: 1px solid var(--el-border-color);

        h2 {
            width: 100%;
            text-align: right;
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

<template>
    <div class="menu-item-editor" :style="{ marginLeft: `${level * 20}px` }">
        <el-card shadow="hover">
            <div class="item-content">
                <!-- 拖拽手柄 (功能预留) -->
                <el-icon :class="[isChildren ? 'drag-child-handle' : 'drag-handle']" title="拖拽排序">
                    <Rank />
                </el-icon>

                <!-- 表单区域 -->
                <el-form :model="item" label-width="80px" class="item-form">
                    <el-row :gutter="5">
                        <!-- 核心配置 -->
                        <el-col :span="8">
                            <el-form-item label="标题">
                                <el-input v-model="item.meta.title" placeholder="菜单显示名称" />
                            </el-form-item>
                        </el-col>
                        <!-- 布局配置 -->
                        <el-col v-if="!isChildren" :span="8">
                            <el-form-item label="布局组件">
                                <el-select v-model="item.layout.component" placeholder="选择布局" style="width: 100%;">
                                    <el-option v-for="opt in layoutComponentOptions" :key="opt.value" :label="opt.label"
                                        :value="opt.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="布局模式">
                                <el-select v-model="item.layout.mode" placeholder="选择模式" style="width: 100%;">
                                    <el-option v-for="opt in layoutModeOptions" :key="opt.value" :label="opt.label"
                                        :value="opt.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- Meta配置 -->
                        <el-col :span="8">
                            <el-form-item label="图标">
                                <el-input v-model="item.meta.icon" placeholder="Element Plus 图标名" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="路径">
                                <el-input v-model="item.path" placeholder="路径" />
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isChildren || !item.children || item.children.length == 0" :span="8">
                            <el-form-item label="页面">
                                <el-select v-model="item.page" placeholder="选择页面" clearable filterable
                                    style="width: 100%;">
                                    <el-option v-for="opt in pageOptions" :key="opt" :label="opt" :value="opt" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="毛玻璃">
                                <el-switch v-model="item.meta.isFrostedGlass" active-text="开启" inactive-text="关闭"
                                    inline-prompt />
                            </el-form-item>
                        </el-col>


                    </el-row>
                </el-form>

                <!-- 操作区域 -->
                <div class="item-actions">
                    <el-switch v-model="item.meta.enabled" active-text="启用" inactive-text="禁用" inline-prompt />
                    <div>
                        <el-button v-if="!isChildren" circle :icon="Plus" title="添加子菜单"
                            @click="() => emits('addChild', item)" />
                        <el-button :disabled="item.path == '/system' || item.path == '/menu-config'" type="danger"
                            circle :icon="Delete" title="删除此菜单" @click="() => emits('remove')" />
                    </div>
                </div>
            </div>

            <!-- 递归渲染子菜单 -->
            <div v-if="item.children && item.children.length > 0" class="children-container">
                <draggable v-model="item.children" item-key="id" v-bind="dragOptions" tag="div">
                    <template #item="{ element: child, index }">
                        <div :key="child.id">
                            <MenuItemEditor :item="child" is-children :level="level + 1"
                                @add-child="handleAddChild(child)" @remove="handleRemoveChild(index)" />
                        </div>
                    </template>
                </draggable>
            </div>
        </el-card>

    </div>
</template>

<script setup>
import { computed } from 'vue';
// 2. 导入 draggable 和图标
import draggable from 'vuedraggable';
import { pageOptions, layoutComponentOptions, layoutModeOptions } from '../options';
import { Plus, Delete } from '@element-plus/icons-vue';
import { tr } from 'element-plus/es/locales.mjs';

// 声明组件的 props 和 emits
const props = defineProps({
    item: {
        type: Object,
        required: true,
        default: () => ({
            path: '',
            page: '',
            layout: {
                component: 'app',
                mode: 'side'
            },
            meta: {
                title: '',
                icon: '',
                isFrostedGlass: true,
                enabled: true
            },
            children: []
        })
    },
    level: {
        type: Number,
        default: 0
    },

    isChildren: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['addChild', 'remove']);

// 4. 添加 vuedraggable 的配置
const dragOptions = computed(() => {
    return {
        animation: 200,
        group: 'menu-item', // 关键：所有可拖拽区域共享一个组名，以实现跨级拖拽
        disabled: false,
        handle: '.drag-child-handle', // 指定拖拽手柄的 CSS 选择器
        ghostClass: 'ghost', // 拖拽时占位符的类名 
        moveClass: 'draggable-move-transition'
    };
});

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
    },
    children: []
});

const handleAddChild = (parentItem) => {
    if (!parentItem.children) {
        parentItem.children = [];
    }
    parentItem.children.push(createNewMenuItem());
};

const handleRemoveChild = (index) => {
    props.item.children.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.menu-item-editor {
    margin-top: 15px;
    transition: all 0.3s ease;
}

.item-content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.drag-child-handle,
.drag-handle {
    cursor: grab;
    font-size: 20px;
    margin-top: 8px;
    color: #a9a9a9;
}

.item-form {
    flex-grow: 1;
}

.item-actions {
    display: flex;
    flex-direction: column-reverse;
    // justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    padding-top: 5px;
    white-space: nowrap;

    // .el-button {
    //     margin: 0;
    // }
}

.children-container {
    margin-top: 15px;
    border-top: 1px dashed #dcdfe6;
    padding-top: 5px;
}
</style>

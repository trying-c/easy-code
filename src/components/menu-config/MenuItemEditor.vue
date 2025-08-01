<template>
    <div class="menu-item-editor" :style="{ marginLeft: `${level * 20}px` }">
        <el-card shadow="hover">
            <div class="item-content">
                <!-- 拖拽手柄 (功能预留) -->
                <!-- <el-icon class="drag-handle">
                    <Rank />
                </el-icon> -->

                <!-- 表单区域 -->
                <el-form :model="item" label-width="80px" class="item-form">
                    <el-row :gutter="5">
                        <!-- 核心配置 -->
                        <el-col :span="8">
                            <el-form-item label="标题">
                                <el-input v-model="item.meta.title" placeholder="菜单显示名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="路径">
                                <el-input v-model="item.path" placeholder="路径" />
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isChildren || !item.children" :span="8">
                            <el-form-item label="页面">
                                <el-select v-model="item.page" placeholder="选择页面" clearable filterable
                                    style="width: 100%;">
                                    <el-option v-for="opt in pageOptions" :key="opt" :label="opt" :value="opt" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <template v-if="!isChildren">
                            <!-- 布局配置 -->
                            <el-col :span="8">
                                <el-form-item label="布局组件">
                                    <el-select v-model="item.layout.component" placeholder="选择布局" style="width: 100%;">
                                        <el-option v-for="opt in layoutComponentOptions" :key="opt.value"
                                            :label="opt.label" :value="opt.value" />
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
                        </template>

                        <!-- Meta配置 -->
                        <el-col :span="8">
                            <el-form-item label="图标">
                                <el-input v-model="item.meta.icon" placeholder="Element Plus 图标名" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <!-- 操作区域 -->
                <div class="item-actions">
                    <el-switch v-model="item.meta.enabled" active-text="启用" inactive-text="禁用" inline-prompt />
                    <el-button v-if="!isChildren" @click="emits('addChild', item)" circle :icon="Plus" title="添加子菜单" />
                    <el-button @click="emits('remove')" type="danger" circle :icon="Delete" title="删除此菜单" />
                </div>
            </div>

            <!-- 递归渲染子菜单 -->
            <div v-if="item.children && item.children.length > 0" class="children-container">
                <!-- 递归调用自身 -->
                <MenuItemEditor v-for="(child, index) in item.children" :key="child.id" :item="child" is-children
                    :level="level + 1" @add-child="emits('addChild', $event)" @remove="() => removeChild(index)" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { pageOptions, layoutComponentOptions, layoutModeOptions } from './options';
import { Plus, Delete } from '@element-plus/icons-vue';

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

// 组件内部的方法，用于处理子项的删除
const removeChild = (index) => {
    props.item.children.splice(index, 1);
    if (props.item.children.length == 0) {
        delete props.item.children;
    }
};
</script>

<style scoped>
.menu-item-editor {
    margin-top: 15px;
    transition: all 0.3s ease;
}

.item-content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

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
    align-items: center;
    gap: 10px;
    padding-top: 5px;
    white-space: nowrap;
}

.children-container {
    margin-top: 15px;
    border-top: 1px dashed #dcdfe6;
    padding-top: 5px;
}
</style>

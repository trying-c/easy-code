<template>
    <div class="category-manager">
        <el-button type="primary" :icon="Plus" @click="openDialog(null)">添加大类</el-button>

        <el-table :data="categoryTree" style="width: 100%; margin-top: 20px;" row-key="id" border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="type" label="类型" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.type === 'income' ? 'success' : ''">{{ row.type === 'income' ? '收入' : '支出'
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="{ row }">
                    <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
                    <el-button v-if="!row.parentId" size="small" type="primary" link
                        @click="openDialog(null, row.id, row.type)">添加子类</el-button>
                    <el-popconfirm title="确定删除吗？将同时删除其所有子分类！" @confirm="handleDelete(row.id)">
                        <template #reference>
                            <el-button size="small" type="danger" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
            <el-form ref="formRef" :model="form" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type" :disabled="!!form.parentId || isEditMode">
                        <el-radio label="expense">支出</el-radio>
                        <el-radio label="income">收入</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="form.icon" placeholder="输入Element Plus图标名" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useCategoryStore } from '@/store/modules/category';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore();

// 计算支出和收入的树形数据
const expenseTree = computed(() => categoryStore.getCategoryTree('expense'));
const incomeTree = computed(() => categoryStore.getCategoryTree('income'));
const categoryTree = computed(() => [...expenseTree.value, ...incomeTree.value]);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditMode = ref(false);
const formRef = ref(null);
const form = reactive({
    id: null,
    name: '',
    type: 'expense',
    icon: '',
    parentId: null,
});

const openDialog = (rowData = null, parentId = null, parentType = 'expense') => {
    if (rowData) { // 编辑模式
        isEditMode.value = true;
        dialogTitle.value = '编辑分类';
        Object.assign(form, rowData);
    } else { // 新增模式
        isEditMode.value = false;
        Object.assign(form, { id: null, name: '', icon: '', parentId });
        if (parentId) {
            dialogTitle.value = '添加子分类';
            form.type = parentType;
        } else {
            dialogTitle.value = '添加大类';
            form.type = 'expense';
        }
    }
    dialogVisible.value = true;
};

const handleDelete = (id) => {
    categoryStore.deleteCategory(id);
    ElMessage.success('删除成功');
};

const handleSubmit = () => {
    if (isEditMode.value) {
        categoryStore.updateCategory(form.id, form);
        ElMessage.success('更新成功');
    } else {
        categoryStore.addCategory({ ...form });
        ElMessage.success('添加成功');
    }
    dialogVisible.value = false;
};
</script>
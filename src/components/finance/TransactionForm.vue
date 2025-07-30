<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
                <el-radio-button label="expense">支出</el-radio-button>
                <el-radio-button label="income">收入</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
            <el-input-number v-model="form.amount" :precision="2" :step="10" :min="0.01" controls-position="right"
                style="width: 100%;" />
        </el-form-item>

        <el-form-item label="分类" prop="cascaderValue">
            <el-cascader v-model="form.cascaderValue" :options="categoryOptions"
                :props="{ value: 'id', label: 'name', children: 'children', emitPath: true }" placeholder="请选择分类"
                filterable style="width: 100%;" />
        </el-form-item>

        <el-form-item label="账户" prop="accountId">
            <el-select v-model="form.accountId" placeholder="请选择账户" filterable style="width: 100%;">
                <el-option v-for="item in accountStore.accounts" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="date">
            <el-date-picker v-model="form.date" type="datetime" style="width: 100%;" format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DDTHH:mm:ss.sssZ" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
            <el-input v-model="form.notes" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item>
            <el-button @click="emits('cancel')">取消</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useTransactionStore } from '@/store/modules/transaction';
import { useCategoryStore } from '@/store/modules/category';
import { useAccountStore } from '@/store/modules/account';
import { ElMessage } from 'element-plus';

// Props and Emits
const props = defineProps({
    transactionId: {
        type: String,
        default: null,
    },
});
const emits = defineEmits(['success', 'cancel']);

// Stores
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

// Form
const formRef = ref(null);
const form = reactive({
    type: 'expense',
    amount: undefined,
    categoryId: '',
    accountId: '',
    date: new Date().toISOString(),
    notes: '',
    cascaderValue: [], // 用于级联选择器 v-model
});

// Rules
const rules = {
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    accountId: [{ required: true, message: '请选择账户', trigger: 'change' }],
    date: [{ required: true, message: '请选择日期', trigger: 'change' }],
    cascaderValue: [{ required: true, message: '请选择分类', trigger: 'change' }],
};

// !!! 修改点：计算属性，为 Cascader 提供数据 !!!
const categoryOptions = computed(() => {
    return categoryStore.getCategoryTree(form.type);
});
// !!! 修改点：监听类型变化，清空级联选择器的值 !!!
watch(() => form.type, () => {
    form.cascaderValue = [];
    form.categoryId = '';
});


// 编辑模式时，填充表单
onMounted(() => {
    if (props.transactionId) {
        const tx = transactionStore.getTransactionById.value(props.transactionId);
        if (tx) {
            Object.assign(form, tx);
            // 回填 Cascader 的值
            const path = [];
            let current = categoryStore.getCategoryById(tx.categoryId);
            while (current) {
                path.unshift(current.id);
                current = current.parentId ? categoryStore.getCategoryById(current.parentId) : null;
            }
            form.cascaderValue = path;
        }
    }
})

const submitForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
        if (valid) {
            // !!! 修改点：从级联选择器的值中提取子分类ID !!!
            form.categoryId = form.cascaderValue[form.cascaderValue.length - 1];
            const dataToSave = { ...form };
            delete dataToSave.cascaderValue; // 不保存这个临时值

            if (props.transactionId) {
                transactionStore.updateTransaction(props.transactionId, dataToSave);
                ElMessage.success('更新成功！');
            } else {
                transactionStore.addTransaction(dataToSave);
                ElMessage.success('记账成功！');
            }
            emits('success');
        }
    });
};
</script>
<template>
    <div class="finance-settings">
        <el-card>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="分类管理" name="categories">
                    <CategoryManager />
                </el-tab-pane>
                <el-tab-pane label="账户管理" name="accounts">
                    <AccountManager />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AccountManager from '@/components/finance/AccountManager.vue';
import CategoryManager from '@/components/finance/CategoryManager.vue';

const activeTab = ref('categories');
</script>
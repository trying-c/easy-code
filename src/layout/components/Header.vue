<template>
    <div class="header-container">
        <div class="left-panel">
            <Menus :collapse="false" mode="horizontal" :ellipsis="false" />
        </div>
        <!-- 右侧面板留作将来扩展 -->
        <div class="right-panel">

        </div>
    </div>
</template>

<script setup>
import Menus from '@/components/Menus.vue'; 
</script>

<style lang="scss" scoped>
.header-container {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}

.left-panel {
    height: 100%;
}

.right-panel {
    display: flex;
    align-items: center;
    margin-right: 50px;

    .icon-button {
        margin-left: 10px;
        cursor: pointer;
        font-size: 18px;
        color: var(--app-glass-text-color);
        transition: color 0.3s;

        &.is-active {
            color: var(--el-color-primary);
        }

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
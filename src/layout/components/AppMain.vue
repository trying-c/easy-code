<template>
    <section class="app-main">
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component :is="Component" :key="route.path" style="padding: 20px;" />
            </keep-alive>
        </router-view>
    </section>
</template>

<style lang="scss" scoped>
.app-main {
    height: 100%;
    width: 100%;
    position: relative;
    // overflow: hidden; // 内容超出时可滚动
    overflow-x: hidden; // 始终隐藏水平滚动条
    // padding: 20px;
    box-sizing: border-box;
}
</style>
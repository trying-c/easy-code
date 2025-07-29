<template>
    <section class="app-main">
        <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
                <component :is="Component" :key="route.path" />
            </transition>
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
    padding: 20px;
    box-sizing: border-box;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
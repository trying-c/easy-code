<template>
    <section class="app-main">
        <router-view v-slot="{ Component, route }">
            <!-- <transition name="fade" mode="out-in"> -->
            <component :is="Component" :key="route.path" />
            <!-- </transition> -->
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

// /* 定义过渡动画 */
// /* fade-enter-active: 新页面进入时的动画 */
// /* fade-leave-active: 旧页面离开时的动画 */

// .fade-enter-active,
// .fade-leave-active {
//     transition: opacity 0.25s ease;
// }

// /*
//   进入前和离开后的状态
//   我们让新页面开始时完全透明，旧页面结束时也完全透明
// */
// .fade-enter-from,
// .fade-leave-to {
//     opacity: 0;
// }
</style>
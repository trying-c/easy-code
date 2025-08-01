<template>
    <div class="not-found-container">
        <div class="content-box">
            <h1 class="status-code">404</h1>
            <p class="message">抱歉，您访问的页面不存在</p>
            <p class="tip">您输入的网址有误或权限不足，请点击下方按钮返回首页。</p>
            <el-button type="primary" size="large" round @click="goHome">
                返回首页
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/'); // 跳转到根路径，它会自动重定向到 /dashboard
};
</script>

<style lang="scss" scoped>
.not-found-container {
    // 使用 Flexbox 让内容垂直和水平居中
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.content-box {
    // 应用我们熟悉的毛玻璃盒子样式
    @include frosted-glass();
    @include elegant-border();
    @include soft-shadow();
    border-radius: 20px;

    padding: 4rem 7rem;
    text-align: center;
    color: var(--app-glass-text-color);

    // 给盒子一个最大宽度，防止在大屏幕上过于拉伸
    max-width: 800px;
}

.status-code {
    font-size: 10rem;
    font-weight: bold;
    line-height: 1;
    margin: 0;
    // 使用主题色作为文字颜色，并添加阴影增加立体感
    color: var(--el-color-primary);
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.message {
    font-size: 24px;
    margin: 20px 0 10px;
}

.tip {
    font-size: 16px;
    opacity: 0.7;
    margin-bottom: 30px;
}
</style>
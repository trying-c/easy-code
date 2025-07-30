import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { watch } from 'vue';

// --- 辅助函数 ---

/**
 * 将颜色与白色混合，用于生成 light-x 派生色
 * @param {string} color 基础颜色 (HEX, e.g., #409EFF)
 * @param {number} tint 混合比例 (0-1)，值越大，白色越多
 * @returns {string} 混合后的颜色 (HEX)
 */
const mix = (color, tint) => {
    const B = 255, G = 255, R = 255;
    let p = tint;
    // h 变量用于处理 #FFF 和 #FFFFFF 两种格式
    let h = color.length > 7;
    // 解析 R, G, B
    let [r, g, b] = (h ? color.slice(1, 7) : color.slice(1, 4).repeat(2)).match(/.{2}/g).map(x => parseInt(x, 16));
    // 混合公式
    let f = (c, i) => Math.round(i * p + c * (1 - p));
    // 返回新的 HEX 颜色
    return "#" + [f(r, R), f(g, G), f(b, B)].map(x => x.toString(16).padStart(2, '0')).join('');
};

/**
 * 将颜色与黑色混合，用于生成 dark-x 派生色
 * @param {string} color 基础颜色 (HEX)
 * @param {number} tint 混合比例 (0-1)，值越大，黑色越多
 * @returns {string} 混合后的颜色 (HEX)
 */
const darkMix = (color, tint) => {
    let [r, g, b] = color.slice(1).match(/.{2}/g).map(x => parseInt(x, 16));
    let f = (c, i) => Math.round(i * tint + c * (1 - tint));
    return "#" + [f(r, 0), f(g, 0), f(b, 0)].map(x => x.toString(16).padStart(2, '0')).join('');
};

/**
 * 将 HEX 颜色转换为带有透明度的 RGBA 字符串
 * @param {string} hex HEX 颜色值
 * @param {number} alpha 透明度 (0-1)
 * @returns {string} RGBA 颜色字符串
 */
const hexToRgba = (hex, alpha) => {
    let r = parseInt("0x" + hex.slice(1, 3));
    let g = parseInt("0x" + hex.slice(1, 5).slice(2, 4));
    let b = parseInt("0x" + hex.slice(1, 7).slice(4, 6));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export const useSettingsStore = defineStore('settings', () => {
    // --- State ---
    // 使用 useStorage 自动持久化到 localStorage
    const theme = useStorage('app-theme', 'light'); // 'light' or 'dark'
    const layout = useStorage('app-layout', 'side'); // 'side' or 'top'
    const themeColor = useStorage('app-theme-color', '#409EFF');
    const isSidebarCollapsed = useStorage('app-sidebar-collapsed', false); // false 为展开
    const layoutComponent = useStorage('app-layout-component', 'AppLayout'); // 默认布局组件

    // --- Watcher ---
    // 监听所有会影响全局样式的状态
    watch(
        [theme, themeColor, layoutComponent],
        ([newTheme, newColor, newLayoutComponent]) => {
            const el = document.documentElement;

            // Part 1: 处理亮/暗模式
            if (newTheme === 'dark') {
                el.setAttribute('data-theme', 'dark');
                el.classList.add('dark');
            } else {
                el.setAttribute('data-theme', ''); // 或者 removeAttribute
                el.classList.remove('dark');
            }

            // Part 2: 计算并设置 Element Plus 的主题色及派生色
            el.style.setProperty('--el-color-primary', newColor);
            for (let i = 1; i <= 9; i++) {
                el.style.setProperty(`--el-color-primary-light-${i}`, mix(newColor, i * 0.1));
            }
            el.style.setProperty(`--el-color-primary-dark-2`, darkMix(newColor, 0.2));

            // // Part 3: 智能设置菜单的 hover 背景色
            // if (newTheme === 'dark') {
            //     // 暗黑模式下，使用自定义的半透明颜色，确保对比度
            el.style.setProperty('--el-menu-hover-bg-color', hexToRgba(newColor, 0.15));
            // } else {
            //     // 亮色模式下，使用 Element Plus 的默认行为 (light-9)
            //     el.style.setProperty('--el-menu-hover-bg-color', mix(newColor, 0.9));
            // }
        },
        {
            // 首次加载时立即执行，以应用初始主题和颜色
            immediate: true,
        }
    );

    // --- Actions ---
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }

    function setLayout(newLayout) {
        layout.value = newLayout;
    }

    //  切换侧边栏折叠状态的 action  
    function toggleSidebar() {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }

    function setLayoutComponent(componentName) {
        layoutComponent.value = componentName;
    }

    // --- Return ---
    return {
        theme,
        layout,
        themeColor,
        isSidebarCollapsed,
        toggleTheme,
        setLayout,
        toggleSidebar,
        setLayoutComponent,
    };
});
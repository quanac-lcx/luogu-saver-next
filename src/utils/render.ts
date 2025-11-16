import { h, type Component } from 'vue';
import { NIcon } from 'naive-ui';

/**
 * 专门用于 Naive UI 菜单等组件渲染图标的辅助函数
 * @param icon - 要渲染的图标组件 (例如 HomeOutline)
 */
export function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}
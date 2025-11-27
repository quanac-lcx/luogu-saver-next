<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render';

const props = defineProps<{
	content?: string;
	loading?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);

const renderMath = () => {
	if (contentRef.value) {
		renderMathInElement(contentRef.value, {
			delimiters: [
		 	 { left: '$$', right: '$$', display: true },
		 	 { left: '$', right: '$', display: false },
		 	 { left: '\\(', right: '\\)', display: false },
		 	 { left: '\\[', right: '\\]', display: true }
			],
			throwOnError: false
		});
	}
};

watch(() => props.content, async () => {
	await nextTick();
	renderMath();
});

onMounted(async () => {
	await nextTick();
	renderMath();
});
</script>

<template>
	<div class="markdown-wrapper">
		<div v-if="loading" class="empty-tip">加载中...</div>
		<div v-else-if="!content" class="empty-tip">暂无内容</div>
		
		<div
			v-else
			ref="contentRef"
			class="markdown-body"
			v-html="content"
		></div>
	</div>
</template>

<style scoped>
.markdown-body {
	line-height: 1.6;
	overflow-wrap: break-word;
}
:deep(pre) {
	padding: 16px;
	border-radius: 6px;
	background-color: #f6f8fa;
	overflow: auto;
}
.empty-tip {
	text-align: center;
	color: #999;
	padding: 40px;
}
</style>
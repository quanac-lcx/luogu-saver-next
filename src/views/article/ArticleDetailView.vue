<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage, useDialog, NSpace, NButton, NIcon, NTag, NDivider, NGrid, NGi, NSkeleton } from 'naive-ui';
import {
	ShareSocialOutline, CopyOutline, SyncOutline, TrashOutline,
	ArrowBackOutline, NewspaperOutline, CalendarOutline
} from '@vicons/ionicons5';

import { getArticleById } from '@/api/article';
import type { Article } from '@/types/article';

import Card from '@/components/Card.vue';
import UserLink from '@/components/UserLink.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';
import { ARTICLE_CATEGORIES, UNKNOWN_CATEGORY } from '@/utils/constants';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const articleId = route.params.id as string;
const article = ref<Article | null>(null);
const loading = ref(true);

const currentCategory = computed(() => {
	if (article.value?.category && ARTICLE_CATEGORIES[article.value.category]) {
		return ARTICLE_CATEGORIES[article.value.category];
	}
	return UNKNOWN_CATEGORY;
});

const formatDate = (timestamp: number) => {
	return new Date(timestamp).toLocaleString('zh-CN', {hour12: false});
};

const loadData = async () => {
	loading.value = true;
	try {
		const res = await getArticleById(articleId);
		article.value = res.data;
	} catch (err: any) {
		message.error(err.message || '加载失败');
	} finally {
		loading.value = false;
	}
};

const handleCopy = () => {
	if (article.value?.content) {
		navigator.clipboard.writeText(article.value.content);
		message.success('Markdown 源码已复制');
	}
};

const handleDelete = () => {
	dialog.warning({
		title: '确认删除',
		content: '确定要申请删除这篇文章吗？',
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: () => console.log('Deleted')
	});
};

onMounted(() => {
	loadData();
});
</script>

<template>
	<div class="article-detail-page">
		
		<LoadingSkeleton :loading="loading">
			<template #skeleton>
				<Card>
					<div style="margin-bottom: 8px;">
						<n-skeleton text style="width: 40%; height: 28px; margin-bottom: 8px;"/>
					</div>
					<n-divider style="margin: 12px 0"/>
					<n-grid x-gap="12" cols="1 s:2">
						<n-gi>
							<div class="info-item">
								<span class="label">作者</span>
								<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
									<n-skeleton circle size="small"/>
									<n-skeleton text style="width: 80px"/>
								</div>
							</div>
						</n-gi>
						<n-gi>
							<div class="info-item">
								<span class="label">分类</span>
								<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
									<n-skeleton width="18px" height="18px"/>
									<n-skeleton text style="width: 60px"/>
								</div>
							</div>
						</n-gi>
					</n-grid>
				</Card>
			</template>
			
			<div v-if="article">
				<Card :title="article.title" :icon="NewspaperOutline">
					<div class="meta-row">
						<n-tag :bordered="false" size="small">
							<template #icon>
								<NIcon :component="CalendarOutline"/>
							</template>
							更新于 {{ formatDate(article.updatedAt) }}
						</n-tag>
					</div>
					
					<n-divider style="margin: 12px 0"/>
					
					<n-grid x-gap="12" cols="1 s:2">
						<n-gi>
							<div class="info-item">
								<span class="label">作者</span>
								<UserLink :user="article.author" show-avatar/>
							</div>
						</n-gi>
						<n-gi>
							<div class="info-item">
								<span class="label">分类</span>
								<div class="category-link">
									<NIcon :component="currentCategory.icon" :color="currentCategory.color"/>
									<span :style="{ color: currentCategory.color }">{{ currentCategory.label }}</span>
								</div>
							</div>
						</n-gi>
					</n-grid>
					
					<n-divider style="margin: 12px 0"/>
					
					<n-space>
						<n-button size="small" @click="router.go(-1)">
							<template #icon>
								<NIcon :component="ArrowBackOutline"/>
							</template>
							返回
						</n-button>
						<n-button size="small" secondary tag="a" :href="`https://www.luogu.com/article/${article.id}`"
						          target="_blank">
							<template #icon>
								<NIcon :component="ShareSocialOutline"/>
							</template>
							原站
						</n-button>
						<n-button size="small" secondary @click="handleCopy">
							<template #icon>
								<NIcon :component="CopyOutline"/>
							</template>
							源码
						</n-button>
						<n-button size="small" type="primary">
							<template #icon>
								<NIcon :component="SyncOutline"/>
							</template>
							更新
						</n-button>
						<n-button size="small" type="error" ghost @click="handleDelete">
							<template #icon>
								<NIcon :component="TrashOutline"/>
							</template>
							删除
						</n-button>
					</n-space>
				</Card>
			</div>
		</LoadingSkeleton>
		
		<div style="margin-top: 16px;">
			<LoadingSkeleton :loading="loading">
				<template #skeleton>
					<Card>
						<n-space vertical size="large">
							<n-space vertical>
								<n-skeleton text :repeat="2"/>
								<n-skeleton text style="width: 60%"/>
							</n-space>
							<n-skeleton height="120px" style="border-radius: 4px"/>
							<n-space vertical>
								<n-skeleton text :repeat="4"/>
							</n-space>
						</n-space>
					</Card>
				</template>
				
				<Card v-if="article">
					<MarkdownViewer :content="article.renderedContent"/>
				</Card>
			</LoadingSkeleton>
		</div>
	
	</div>
</template>

<style scoped>
.article-detail-page {
	padding-bottom: 40px;
}

.meta-row {
	margin-bottom: 8px;
	display: flex;
	gap: 8px;
}

.info-item {
	background: #f9fafb;
	padding: 8px 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.label {
	font-size: 12px;
	color: #999;
}

.category-link {
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 600;
}
</style>
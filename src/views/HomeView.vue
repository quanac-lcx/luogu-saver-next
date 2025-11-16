<script setup lang="ts">
import CardTitle from '@/components/CardTitle.vue';
import Card from '@/components/Card.vue';
import Statistic from '@/components/Statistic.vue';
import { NGrid, NGi } from 'naive-ui';
import {
	Bookmark, Megaphone, Newspaper, Clipboard
} from '@vicons/ionicons5';
</script>

<template>
	<n-grid cols="1" y-gap="16">
		<n-gi>
			<CardTitle
				title="洛谷保存站"
				subtitle="Save everything, keep it alive."
				:icon="Bookmark"
			/>
		</n-gi>
		<n-gi>
			<n-grid cols="24" :x-gap="16">
				<n-gi span="17">
					<n-grid cols="1" y-gap="16">
						<n-gi>
							<Card title="公告" :icon="Megaphone">
								This is a sample announcement text.
							</Card>
						</n-gi>
					</n-grid>
				</n-gi>
				<n-gi span="7">
					<n-grid cols="1" y-gap="16">
						<n-gi>
							<Statistic value="99999" label="文章总数" :icon="Newspaper" />
						</n-gi>
						<n-gi>
							<Statistic value="99999" label="剪贴板总数" :icon="Clipboard" />
						</n-gi>
					</n-grid>
				</n-gi>
			</n-grid>
		</n-gi>
	</n-grid>
</template>

<style scoped>

</style>
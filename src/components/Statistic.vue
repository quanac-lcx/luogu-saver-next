<script setup lang="ts">
import { type Component } from 'vue'
import { NIcon, NStatistic } from 'naive-ui'
import Card from './Card.vue'

defineProps({
	icon: {
		type: Object as () => Component,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	value: {
		type: [String, Number],
		required: true
	},
	iconColor: {
		type: String,
		default: '#667eea'
	}
})
</script>

<template>
	<Card style="text-align: center;">
		<n-icon :component="icon" size="40" :color="iconColor" />

		<n-statistic
			:label="label"
			:value="value"
		>
		</n-statistic>
	</Card>
</template>

<style scoped>
.n-icon {
	margin-bottom: 16px;
}

:deep(.n-statistic-value__content) {
	font-size: 2.3rem !important;
	font-weight: 550;
}

:deep(.n-statistic__label) {
	font-size: 1.1rem;
	color: black;
}
</style>
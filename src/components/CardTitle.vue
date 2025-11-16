<script setup lang="ts">
import { computed, type Component, type CSSProperties } from 'vue'
import { NIcon, NCard, NH1, NText } from 'naive-ui'

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		default: null,
	},
	icon: {
		type: Object as () => Component,
		default: null,
	},
	backgroundColor: {
		type: String,
		default: '#d6e3ff',
	},
	textColor: {
		type: String,
		default: '#667eea',
	}
})

const containerStyle = computed(() : CSSProperties => ({
	textAlign: 'center',
	backgroundColor: props.backgroundColor,
	padding: '16px',
	borderRadius: '8px'
}))

const titleStyle = computed(() : CSSProperties => ({
	color: props.textColor,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '8px'
}))
</script>

<template>
	<n-card :bordered="false" content-style="padding: 0;">
		<div :style="containerStyle">
			<n-h1 class="title">
				<span :style="titleStyle">
					<n-icon v-if="icon" :component="icon" :color="textColor" size="36" :depth="1" />
					{{ title }}
				</span>
			</n-h1>
			<n-text v-if="subtitle" class="subtitle" :depth="3">
				{{ subtitle }}
			</n-text>
		</div>
	</n-card>
</template>

<style scoped>
.title {
	margin-top: 8px;
	margin-bottom: 4px;
	font-weight: bold;
}
.subtitle {
	font-size: 1rem;
}
</style>
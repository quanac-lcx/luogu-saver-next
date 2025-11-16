<script setup lang="ts">
import { type CSSProperties } from "vue";
import { NCard, NH3, NIcon, useThemeVars, type ThemeCommonVars } from 'naive-ui';
import { computed, type Component } from 'vue'

const themeVars : ThemeCommonVars = useThemeVars().value;

const props = defineProps({
	title: {
		type: String
	},
	icon: {
		type: Object as () => Component,
		default: null
	},
	iconColor: {
		type: String,
		default: null
	},
	backgroundColor: {
		type: String,
		default: null
	}
})

const effectiveIconColor = computed(() => {
	return props.iconColor || themeVars.primaryColor
})

const effectiveBackgroundColor = computed(() => {
	return props.backgroundColor || themeVars.cardColor
})

const containerStyle = computed(() : CSSProperties => ({
	padding: '24px',
	borderRadius: '8px',
	backgroundColor: effectiveBackgroundColor,
	boxShadow: '2px 2px 4px #e4e4e4'
}))

</script>

<template>
	<n-card :bordered="false" content-style="padding: 0;">
		<div :style="containerStyle">
			<n-h3 v-if="title" class="title">
				<span style="display: flex; align-items: center; gap: 8px; font-weight: bold;">
					<n-icon v-if="icon" :component="icon" :color="effectiveIconColor" size="24" :depth="1" />
					{{ title }}
				</span>
			</n-h3>
			<slot />
		</div>
	</n-card>
</template>

<style scoped>

</style>
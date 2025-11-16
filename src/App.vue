<template>
	<n-config-provider :theme-overrides="themeOverrides">
		<n-space vertical>
			<n-layout has-sider style="height: 100vh; background-color: #f0f5ff;">
				<n-back-top :right="100" />
				<n-layout-sider
					bordered
					show-trigger="bar"
					:collapsed="collapsed"
					:width="240"
					:collapsed-width="64"
					collapse-mode="width"
					@collapse="collapsed = true"
					@expand="collapsed = false"
				>
					<div style="height: 64px; display: flex; align-items: center; justify-content: center;">
						<img v-if="!collapsed" src="/logo-text.png" alt="洛谷保存站" style="height: 32px"/>
						<img v-else src="/logo-icon.png" alt="洛谷保存站" style="height: 32px;"/>
					</div>
					
					<n-menu
						v-model:value="activeKey"
						:collapsed="collapsed"
						:collapsed-width="64"
						:options="menuOptions"
						@update:value="handleMenuSelect"
					/>
				</n-layout-sider>
				
				<n-layout :native-scrollbar="false">
					<n-layout-content
						content-style="padding: 24px;"
					>
						<div class="router-view">
							<router-view/>
						</div>
					</n-layout-content>
					
					<IconConfigProvider size="14">
						<n-layout-footer bordered style="padding: 10px 40px;">
							<n-grid cols="2">
								<n-gi>
									<p class="footer-element">
										<Icon><Copyright /></Icon>
										<span> 2025 洛谷保存站 </span>
									</p>
									<p class="footer-element">
										<a href="https://github.com/laikit-dev/luogu-saver-next" class="footer-link">
											<Icon><Github /></Icon>
											<span> GitHub </span>
										</a>
										<a href="https://help.luogu.me" class="footer-link">
											<Icon><Book /></Icon>
											<span> 帮助文档 </span>
										</a>
										<a href="https://help.luogu.me/docs/update" class="footer-link">
											<Icon><History /></Icon>
											<span> 更新日志 </span>
										</a>
									</p>
									<p class="footer-element">
										<Icon><Clock /></Icon>
										<span> 本网站已运行 {{ timeSinceFound }} 秒 </span>
									</p>
									<p class="footer-element">
										<a href="https://github.com/laikit-dev/luogu-saver/graphs/contributors" class="footer-link">
											<Icon><Users /></Icon>
											<span> 项目贡献者 </span>
										</a>
									</p>
								</n-gi>
								<n-gi>
									<p class="footer-element right-aligned">
										<Icon><Code /></Icon>
										<span> 开发者：Federico2903 & Murasame & quanac-lcx </span>
									</p>
									<p class="footer-element right-aligned">
										<a href="https://qm.qq.com/q/QVM9YFEb26" target="_blank" class="footer-link">
											<Icon><Qq /></Icon>
											<span>洛谷保存站用户群：1017248143（点击加入）</span>
										</a>
									</p>
									<p class="footer-element right-aligned">
										<a href="/privacy" class="footer-link">
											<Icon><UserShield /></Icon>
											<span>隐私协议</span>
										</a>
										<a href="/disclaimer" class="footer-link">
											<Icon><ExclamationCircle /></Icon>
											<span>免责声明</span>
										</a>
										<a href="/deletion" class="footer-link">
											<Icon><TrashAlt /></Icon>
											<span>数据移除政策</span>
										</a>
									</p>
									<p class="footer-element right-aligned">
										<a href="https://www.rainyun.com/MjUxMDAy_?s=saver" target="_blank" class="footer-link">
											<Icon><Server /></Icon>
											<span>本站由雨云提供支持</span>
										</a>
									</p>
								</n-gi>
							</n-grid>
						</n-layout-footer>
					</IconConfigProvider>
				</n-layout>
			</n-layout>
		</n-space>
	</n-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	NLayout, NLayoutSider, NLayoutContent, NLayoutFooter,
	NSpace, NMenu, NConfigProvider, type GlobalThemeOverrides, NGrid, NGi,
	type MenuOption
} from 'naive-ui';

import {
	HomeOutline, AppsOutline, PersonOutline,
	SearchOutline, BrushOutline, ShareSocialOutline, ListOutline,
//	AtOutline, CloudCircleOutline, CloudDownloadOutline, ImageOutline, KeyOutline,
	StatsChartOutline, HammerOutline, GlobeOutline
} from '@vicons/ionicons5';

import { Icon, IconConfigProvider } from '@vicons/utils';

import {
	Copyright, Code, UserShield, ExclamationCircle,
	TrashAlt, Qq, Server, Github, Clock, Book, History, Users
} from '@vicons/fa';

import { renderIcon } from '@/utils/render';

const collapsed = ref(true);
const activeKey = ref('home');

const menuOptions : MenuOption[] = [
	{
		label: '主页',
		key: 'home',
		icon: renderIcon(HomeOutline)
	},
	{
		label: '用户',
		key: 'user',
		icon: renderIcon(PersonOutline)
	},
	{
		label: '搜索',
		key: 'search',
		icon: renderIcon(SearchOutline)
	},
	{
		label: '题目',
		key: 'problem',
		icon: renderIcon(ListOutline)
	},
	{
		label: '犇犇',
		key: 'benben',
		icon: renderIcon(ShareSocialOutline)
	},
	{
		label: '冬日绘板',
		key: 'paintboard',
		icon: renderIcon(BrushOutline)
	},
	{
		label: '最近更新',
		key: 'recent',
		icon: renderIcon(GlobeOutline)
	},
	{
		label: '陶片放逐',
		key: 'judgement',
		icon: renderIcon(HammerOutline)
	},
	{
		label: '统计数据',
		key: 'statistic',
		icon: renderIcon(StatsChartOutline)
	},
	{
		label: '关于',
		key: 'about',
		icon: renderIcon(AppsOutline)
	}
];

const themeOverrides: GlobalThemeOverrides = {
	common: {
		fontFamily: "'Lato', sans-serif",
		fontFamilyMono: "'Fira Code', monospace",
		bodyColor: '#f8fafc'
	}
};

const router = useRouter();

const handleMenuSelect = (key: string) => {
	activeKey.value = key;
	if (key === 'home') {
		router.push('/');
	}
	else {
		router.push(`/${key}`);
	}
};

const foundDate = new Date('2025-02-12T00:00:00Z').getTime();
const timeSinceFound = ref(Math.floor((Date.now() - foundDate) / 1000));
setInterval(() => {
	timeSinceFound.value = Math.floor((Date.now() - foundDate) / 1000);
}, 1000);
</script>

<style scoped>
.n-layout {
	height: 100vh;
}
.footer-element {
	display: flex;
	align-items: center;
}
.footer-element.right-aligned {
	justify-content: flex-end;
}
.footer-element > :nth-child(2) {
	margin-left: 8px;
}
.footer-element > a > :nth-child(2) {
	margin-left: 8px;
}
.footer-link {
	display: flex;
	align-items: center;
	color: #000;
	transition: color 0.2s;
	text-decoration: none;
}
.footer-link:hover {
	color: #337ab7 !important;
	text-decoration-color: #000;
	text-underline-position: under;
}
.footer-link:not(:first-child) {
	margin-left: 16px;
}
.router-view {
	max-width: 1200px;
	margin: 0 auto;
}
</style>
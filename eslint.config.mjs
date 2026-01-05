// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

/** * 使用 tseslint.config 包裹配置，
 * 它能自动解决 flat config 中插件依赖找不到的问题
 */
export default [
	// 1. 全局忽略
	{ ignores: ["**/dist", "**/node_modules", "**/.git"] },

	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/recommended"],

	{
 	 files: ["*.vue", "**/*.vue"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				sourceType: "module",
			},
		},
	},

	{
		files: ["**/*.{js,mjs,cjs,ts,vue}"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			"curly": ["error", "all"],
			"@typescript-eslint/no-explicit-any": "off",
			"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
			"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
			"vue/multi-word-component-names": "off",
		},
	},

	eslintConfigPrettier
];
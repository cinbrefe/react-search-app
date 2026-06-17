import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
		plugins: {
			'jsx-a11y': jsxA11y,
			'react': reactPlugin,
		},
		extends: [
			js.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		rules: {
			semi: ['error', 'never'],
			...jsxA11y.flatConfigs.recommended.rules,

			'jsx-a11y/anchor-is-valid': 'warn',
		},
	},
])

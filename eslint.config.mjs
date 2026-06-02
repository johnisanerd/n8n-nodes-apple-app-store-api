import { config } from '@n8n/node-cli/eslint';

export default [
	// include base n8n config first
	...config,

	// ignore test folders
	{
		ignores: ['**/__tests__/**'],
	},

	// allow `any` in helpers (Apify dataset rows are loosely typed)
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];

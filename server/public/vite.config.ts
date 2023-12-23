import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Terminal from 'vite-plugin-terminal'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		nodePolyfills(),
		sveltekit(),
		Terminal({
			console: "terminal",
			output: ['console', 'terminal']
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		},
	},

});

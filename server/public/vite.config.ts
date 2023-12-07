import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Terminal from 'vite-plugin-terminal'

export default defineConfig({
	plugins: [
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

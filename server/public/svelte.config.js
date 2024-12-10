import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		preprocess(),
		vitePreprocess()
	],

	kit: {
		adapter: adapter({
			pages: "build", assets: "build",
			fallback: "200.html",
			precompress: false,
			strict: true
		})
	}
};

export default config;

// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Skript',
            favicon: '/favicon.svg',
            logo: {
                src: './src/assets/banner.webp',
                replacesTitle: true,
            },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/SkriptLang' }],
            components: {
                Search: './src/components/Search.astro',
                TableOfContents: './src/components/TableOfContents.astro',
            },
            customCss: [
                // Relative path to your custom CSS file
                './src/styles/custom.css',
            ],
            editLink: {
                baseUrl: 'https://github.com/SkriptLang/docs/edit/master/',
            },
            pagination: false,
		}),
	],
});

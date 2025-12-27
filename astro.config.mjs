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
    redirects: {
        "tutorials": "/scripting",
        "events": "/syntaxes",
        "conditions": "/syntaxes",
        "effects": "/syntaxes",
        "types": "/syntaxes",
        "structures": "/syntaxes",
        "functions": "/syntaxes",
        "sections": "/syntaxes",
        "classes": "/syntaxes",
        "docs/events": "/syntaxes",
        "docs/conditions": "/syntaxes",
        "docs/effects": "/syntaxes",
        "docs/types": "/syntaxes",
        "docs/structures": "/syntaxes",
        "docs/functions": "/syntaxes",
        "docs/sections": "/syntaxes",
        "docs/classes": "/syntaxes",
    },
});

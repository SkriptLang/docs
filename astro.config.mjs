// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightAutoSidebar from 'starlight-auto-sidebar'

// https://astro.build/config
export default defineConfig({
    site: 'https://beta-docs.skriptlang.org',
    integrations: [
        starlight({
            plugins: [starlightAutoSidebar()],
            title: 'Skript',
            favicon: '/favicon.svg',
            /*logo: {
                src: './src/assets/banner.webp',
                replacesTitle: true,
            },*/
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/SkriptLang' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/ZPsZAg6ygu' },
            ],
            components: {
                MobileTableOfContents: './src/components/overrides/MobileTableOfContents.astro',
                Search: './src/components/overrides/Search.astro',
                Sidebar: './src/components/overrides/Sidebar.astro',
                TableOfContents: './src/components/overrides/TableOfContents.astro',
            },
            customCss: [
                './src/styles/custom.css',
                '@fontsource/poppins/400.css',
            ],
            editLink: {
                baseUrl: 'https://github.com/SkriptLang/docs/edit/master/',
            },
            expressiveCode: {
                tabWidth: 4,
                styleOverrides: { borderRadius: '0.25rem' },
            },
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

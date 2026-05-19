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
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/skriptlang-988998880794402856' },
                { icon: 'openCollective', label: 'OpenCollective', href: 'https://opencollective.com/skriptlang' },
            ],
            components: {
                Footer: './src/components/overrides/Footer.astro',
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
        "tutorials.html": "/scripting",
        "text.html": "/scripting/text",
        "events.html": "/syntaxes?types=Event",
        "conditions.html": "/syntaxes?types=Condition",
        "sections.html": "/syntaxes?types=Section",
        "effects.html": "/syntaxes?types=Effect",
        "expressions.html": "/syntaxes?types=Expression",
        "classes.html": "/syntaxes?types=Type",
        "structures.html": "/syntaxes?types=Structure",
        "functions.html": "/syntaxes?types=Function",
    },
});

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { autoSidebarLoader } from 'starlight-auto-sidebar/loader'
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema'

export const collections = {
	docs: defineCollection({
        loader: docsLoader(),
        schema: docsSchema(),
    }),
    autoSidebar: defineCollection({
        loader: autoSidebarLoader(),
        schema: autoSidebarSchema(),
    }),
    syntaxes: defineCollection({
        loader: glob({
            pattern: '*.json',
            base: './src/assets/syntaxes/',
        }),
    }),
    addonSyntaxes: defineCollection({
        loader: glob({
            pattern: '*.json',
            base: './src/assets/syntaxes/addons/',
        }),
    }),
};

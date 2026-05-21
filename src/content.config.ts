import { defineCollection } from 'astro:content';
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
    skriptReleasesJson: defineCollection({
       loader: async() =>
           fetch('https://api.github.com/repos/SkriptLang/Skript/releases?per_page=100', {
               headers: {
                   'Accept': 'application/vnd.github+json',
                   'X-GitHub-Api-Version': '2022-11-28',
                   'User-Agent': 'SkriptLang',
               },
           }).then(response => {
               if (!response.ok) {
                   throw new Error("Failed to fetch versions... aborting");
               }
               return response.json();
           }).then(json => json.map((release: any) => ({
               ...release,
               id: release.id.toString(),
           })))
    }),
};

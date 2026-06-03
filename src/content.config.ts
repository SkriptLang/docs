import {defineCollection} from 'astro:content';
import {glob, type Loader} from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { autoSidebarLoader } from 'starlight-auto-sidebar/loader'
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema'

const skriptReleases = await fetch('https://api.github.com/repos/SkriptLang/Skript/releases?per_page=100', {
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
    });

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
       loader: () => {
           let order = 0;
           return skriptReleases.map((release: any) => ({
               ...release,
               id: release.id.toString(),
               order: order++,
           }));
       }
    }),
    githubReleaseBodies: defineCollection({
       loader: function releaseLoader() {
           return {
               name: 'githubReleaseBodies',
               async load({ renderMarkdown, store }) {
                   store.clear();

                   const entries = {
                       'Skript/latest': skriptReleases[0],
                       'Skript/latestStable': skriptReleases.find((entry: any) => !entry.prerelease)!,
                   }

                   for (const [id, data] of Object.entries(entries)) {
                       let body = data.body;
                       // TODO this is very questionable
                       body = '##' + body.substring(0, body.indexOf('Happy Skripting!') + 16);
                       store.set({
                           id: id,
                           data: {
                               tag_name: data.tag_name,
                               prerelease: data.prerelease,
                               url: data.html_url,
                               download_url: data.assets[0].browser_download_url,
                           },
                           rendered: await renderMarkdown(body),
                       });
                   }
               },
           } satisfies Loader;
       }()
    }),
};

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tutorials = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/assets/tutorials/" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        date: z.coerce.date(),
        url: z.string(),
    })
});

export const collections = { tutorials };
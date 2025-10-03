import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.boolean().default(true),
    date: z.string(),
  }),
});

const studies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    passage: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.string(),
    diagram: z.string().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = { posts, studies };

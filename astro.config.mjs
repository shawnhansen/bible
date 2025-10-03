// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';

export default defineConfig({
  site: 'https://biblestudyforhackers.dev',
  integrations: [mdx(), sitemap(), image()],
  image: { serviceEntryPoint: '@astrojs/image/sharp' },
});

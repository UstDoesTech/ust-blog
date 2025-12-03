// @ts-check

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkMermaid } from './src/plugins/remark-mermaid.js'; // Import the new plugin

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://ustdoes.tech',
    integrations: [mdx(), sitemap(), react()],
    markdown: {
        remarkPlugins: [remarkMermaid], // Add the plugin here
        shikiConfig: {
            // Ensure Shiki doesn't try to highlight mermaid if it slips through
            langs: [],
            wrap: true,
        },
    },
});
import { defineConfig } from 'vitepress';
import { SearchPlugin } from 'vitepress-plugin-search';

export default defineConfig({
    lang: 'en-US',
    base: '/VueGridle/',
    title: 'VueGridle',
    description:
        'Small, typed Vue 3 grid primitives for controlled dashboards and draggable layouts.',
    vite: {
        plugins: [
            SearchPlugin({
                tokenize: 'full',
            }),
        ],
    },
    themeConfig: {
        logo: './logo.png',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Examples', link: '/examples/basic' },
            { text: 'GitHub', link: 'https://github.com/FrankieSR/VueGridle' },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Getting Started', link: '/guide/getting-started' },
                    { text: 'Controlled Layout', link: '/guide/controlled-layout' },
                    { text: 'Usage Patterns', link: '/guide/usage' },
                    { text: 'Accessibility', link: '/guide/accessibility' },
                    { text: 'Props', link: '/guide/props' },
                    { text: 'Events', link: '/guide/events' },
                    { text: 'Styles', link: '/guide/styles' },
                    { text: 'SSR and Nuxt', link: '/guide/ssr' },
                    { text: 'Migration Notes', link: '/guide/migration' },
                ],
            },
            {
                text: 'Examples',
                items: [
                    { text: 'Basic', link: '/examples/basic' },
                    { text: 'Dashboard Layout', link: '/examples/dashboard' },
                    { text: 'Draggable and Resizable', link: '/examples/draggable-resizable' },
                    { text: 'Add and Remove', link: '/examples/add-remove' },
                    { text: 'Drag Outside', link: '/examples/drag-outside' },
                    { text: 'Collision Handling', link: '/examples/collision-handling' },
                ],
            },
        ],

        socialLinks: [{ icon: 'github', link: 'https://github.com/FrankieSR/VueGridle' }],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present Artem Doroshko',
        },
        search: {
            provider: 'local',
        },
    },
});

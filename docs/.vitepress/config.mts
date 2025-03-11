import { defineConfig } from 'vitepress';
import { SearchPlugin } from 'vitepress-plugin-search';

export default defineConfig({
  lang: 'en-US',
  base: "/VueGridle/",
  title: "VueGridle",
  description: "VueGridle is an ultra-light (~4 kB gzip) and flexible grid library for Vue 3. Built with TypeScript and  Composition API for smooth, dynamic layouts.",
  vite: {
    plugins: [
      SearchPlugin({
        tokenize: 'full'
      })
    ]
  },
  themeConfig: {
    logo: './logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'Guide', link: '/guide/getting-started' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Usage', link: '/guide/usage' },
          { text: 'Props', link: '/guide/props' },
          { text: 'Events', link: '/guide/events' },
          { text: 'Styles', link: '/guide/styles' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Basic', link: '/examples/basic' },
          { text: 'Draggable and resizable', link: '/examples/draggable-resizable' },
          { text: 'Add and remove', link: '/examples/add-remove' },
          { text: 'Drag outside', link: '/examples/drag-outside.md' },
          { text: 'Collision Handling', link: '/examples/collision-handling.md' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FrankieSR/VueGridle' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Artem Doroshko'
    }
  }
})

import { defineConfig } from 'vitepress'


// 源码学习、LC、日常博客

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ihaoze",
  description: "lihaoze's technology blog",
  cleanUrls: true,
  outDir: "../dist",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

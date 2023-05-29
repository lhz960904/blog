import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed'

const BASE_URL = '/blog/'

export default defineConfig({
  title: "ihaoze",
  description: "lihaoze's technology blog",
  cleanUrls: true,
  base: BASE_URL,
  srcDir: './src',
  outDir: "../dist",
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: `${BASE_URL}favicon.ico`
      }
    ],
  ],
  buildEnd: genFeed,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '算法', link: '/algorithm/guide/' },
      { text: '源码解析', link: '/peel/guide/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lhz960904' }
    ]
  }
})

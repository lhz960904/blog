import { defineConfig } from "vitepress";
import { genFeed } from "./genFeed";

const BASE_URL = "/blog/";

export default defineConfig({
  title: "ihaoze",
  description: "lihaoze's technology blog",
  cleanUrls: true,
  base: BASE_URL,
  srcDir: "./src",
  outDir: "./dist",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/x-icon",
        href: `${BASE_URL}favicon.ico`,
      },
    ],
  ],
  buildEnd: genFeed,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "算法", link: "/algorithm/guide/" },
      { text: "源码解析", link: "/peel/guide/" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/lhz960904" }],
    sidebar: {
      "/algorithm/": [
        { text: "开篇", link: "/algorithm/guide/" },
        {
          text: "位运算技巧",
          collapsed: false,
          items: [
            { text: "介绍", link: "/algorithm/bit/" },
            { text: "加减乘除", link: "/algorithm/bit/operation" },
            { text: "状态压缩&集合操作", link: "/algorithm/bit/set" },
          ],
        },
      ]
    }
  }
});

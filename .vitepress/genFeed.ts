import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = `https://ihaoze.cn/blog/`

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'ihaoze',
    description: 'lihaoze\'s technology blog',
    id: baseUrl,
    link: baseUrl,
    language: 'zh-CN',
    // image: 'https://vuejs.org/images/logo.png',
    favicon: `${baseUrl}/favicon.ico`,
    copyright:
      'Copyright (c) 2023-present, HaoZe Li and blog contributors'
  })

  const posts = await createContentLoader('posts/*.md', {
    excerpt: true,
    render: true
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html,
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}
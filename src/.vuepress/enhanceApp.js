export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 或 客户端
}) => {
  let list = siteData.pages.filter(page => /\/leetcode\/\w+/.test(page.path));
  list = list.map((item, index) => {
    const idx = item.title.indexOf('.')
    return {
      ...item,
      index: item.title.substr(0, idx),
      name: item.title.substr(idx + 1),
      difficulty: item.frontmatter.difficulty,
      prev: list[index - 1] || null,
      next: list[index + 1] || null,
    }
  }).sort((a, b) => a.index - b.index);
  Vue.prototype.$leetcode = list;
}
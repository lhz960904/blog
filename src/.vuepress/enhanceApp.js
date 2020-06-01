export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 或 客户端
}) => {
  let list = siteData.pages.filter(page => /\/leetcode\/\w+/.test(page.path));
  list = list.map((item, index) => {
    const idx = item.title.search(/[^面试题|\s|\-|\d|.]/)
    
    return {
      ...item,
      index: item.title.substr(0, idx).trim().replace(/.$/, ''),
      name: item.title.substr(idx),
      difficulty: item.frontmatter.difficulty,
      prev: list[index - 1] || null,
      next: list[index + 1] || null,
    }
  }).sort((a, b) => {
    const aIdx = parseInt(a.index);
    const bIdx = parseInt(b.index);
    if (!Number.isNaN(aIdx) && !Number.isNaN(bIdx)) {
      return aIdx - bIdx;
    }
    if (Number.isNaN(aIdx) && Number.isNaN(bIdx)) {
      return a.index > b.index ? 1 : -1;
    }
    return Number.isNaN(aIdx) ? 1 : -1;
  });
  Vue.prototype.$leetcode = list;
}
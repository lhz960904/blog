module.exports = {
  title: 'ihaoze',
  description: 'when your talent can\'t support your ambition, you should calm down and lear',
  theme: 'meteorlxy',
  themeConfig: {
    lang: Object.assign(require('vuepress-theme-meteorlxy/lib/langs/zh-CN'), {
      home: `Welcome to lihaoze's Homepage`,
      posts: 'My Posts',
    }),
    personalInfo: {
      // 昵称
      nickname: 'lihaoze',
      // 个人简介 (支持 HTML)
      description: '⌨️ Make progress everyday !',
      // 电子邮箱
      email: 'lihaozecq@gmail.com',
      // 所在地
      location: 'Hangzhou, China',
      // 头像
      avatar: '/images/avatar.jpeg',
      // 社交平台帐号信息
      sns: {
        // Github 帐号和链接
        github: {
          account: 'lhz960904',
          link: 'https://github.com/lhz960904',
        },
        // 新浪微博 帐号和链接
        weibo: {
          account: '@_泽zZ',
          link: 'https://weibo.com/u/5220436046',
        },
        // 知乎 帐号和链接
        zhihu: {
          account: 'lihaoze',
          link: 'https://www.zhihu.com/people/li-hao-ze-55-4',
        },
        // 掘金 帐号和链接
        juejin: {
          account: 'lihaozecq',
          link: 'https://juejin.im/user/595361faf265da6c1f760178',
        },
      },
    },
    // 上方 header 的相关设置 (可选)
    header: {
      background: {
        useGeo: true,
      },
      // 是否在 header 显示标题
      showTitle: true,
    },
    // 底部 footer 的相关设置 (可选)
    footer: {
      // 是否显示 Powered by VuePress
      poweredBy: true,
      // 是否显示使用的主题
      poweredByTheme: true,
    },
    // 个人信息卡片相关设置 (可选)
    infoCard: {
      headerBackground: {
        useGeo: true,
      },
    },
    // 是否显示文章的最近更新时间
    lastUpdated: true,
    // 顶部导航栏内容
    nav: [
      { text: 'Home', link: '/', exact: true },
      { text: 'Posts', link: '/posts/', exact: false },
      { text: 'Github', link: 'https://github.com/lhz960904' },
    ],

    // 评论配置，参考下方 [页面评论] 章节
    comments: {
      owner: 'lhz960904',
      repo: 'Blog',
      clientId: '3ab954a3c8d256acad94',
      clientSecret: 'c1f9253a9e642e4d7913517e527d96fdd401eb9e',
      prefix: '[Comments] ',
    },
    // 分页配置 (可选)
    pagination: {
      perPage: 5,
    },
    // 默认页面（可选，默认全为 true）
    defaultPages: {
      // 是否允许主题自动添加 Home 页面 (url: /)
      home: true,
      // 是否允许主题自动添加 Posts 页面 (url: /posts/)
      posts: true,
    },
  },
}
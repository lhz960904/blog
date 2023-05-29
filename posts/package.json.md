---
category: 技术
tags:
  - npm
date: 2019-10-23
title: package.json各字段的作用
---

介绍package.json各字段的作用

<!-- more -->

## name

> npm包的名字，必须是一个小写的单词，可以包含连字符`-`和下划线`_`。**发布时必填**。


## version

> npm包的版本号，必须是`x.x.x`的形式，并且遵循语义化版本规则。**发布时必填**。

|   阶段   |             规则              | 例子  |
| :------: | :---------------------------: | :---: |
| 首次发版 |          从1.0.0开始          | 1.0.0 |
| 补丁发布 |         递增第三位数          | 1.0.8 |
| 次要版本 |  递增第二位数，将第三位置位0  | 1.2.0 |
| 主要版本 | 递增第一位数，将后俩位数置位0 | 3.0.0 |

**注**：版本号不存在十进制说法，当代码一直处于同一阶段更新时，版本号可以一直增加、`1.0.35`、`1.12.5`都是可以的。

## description

> npm包的简短描述，它会显示在npm官方搜索的列表中。

```json
"description": "A Component Library for React"
```

## keywords

> npm包的关键词，是一个字符串数组，可以帮助其他人在npm搜索列表中发现你的包。

```json
"keywords": [
  "react",
  "component",
  "ui"
],
```

## homepage

> npm包项目主页地址，可以是托管平台的地址。

```json
"homepage": "https://github.com/lhz960904/ouio#readme"
```

## bugs

> npm包问题反馈的地址，可以是github的issue或者是邮箱地址。对于那些使用遇到问题的人很有帮助。

```json
"bugs": {
  "url": "https://github.com/lhz960904/ouio/issues",
  "email": "lihaozecq@gmail.com"
}
```

## license

> 为npm包指定许可证，以便其他人知道他们被允许使用方式以及该npm包被施加的任何限制。

## author

> npm包的作者，电子邮件和网站都是可以的，以下俩种方式都可以。

```json
 "author": "lihaozecq <lihaozecq@gmail.com> (https://github.com/lhz960904)" 
```

```json
"author": {
  "name" : "lihaozecq",
  "email" : "lihaozecq@gmail.com",
  "url" : "https://github.com/lhz960904"
}
```

## files

> npm包作为依赖安装时要包括的文件，格式是文件正则的数组，`["*"]`代表所有文件。也可以使用`npmignore` 来忽略个别文件。 `files`字段优先级最大，不会被`npmignore`和`.gitignore`覆盖。

以下文件总是被包含的，与配置无关

- package.json
- README.md
- CHANGES / CHANGELOG / HISTORY
- LICENCE / LICENSE 

以下文件总是被忽略的，与配置无关

- .git
- .DS_Store
- node_modules
- .npmrc
- npm-debug.log
- package-lock.json
- [等等](https://docs.npmjs.com/files/package.json.html#files)

## main

> 指定npm包的入口文件，例 `"main": "src/index.js"`当`require(name)`的时候实质是引入了改文件。

## bin

> 开发可执行文件时，bin字段可以帮助你设置链接，不需要手动设置PATH。

```json
"bin" : { 
  "oui" : "./cli.js" 
}
```

当像上面这样指定时，下载npm包，会自动链接`cli.js`到`use/local/bin/oui`，可以直接在命令行执行`oui`实质上执行的是npm包的`cli,js`文件，需要在可执行文件头部加上`#!/usr/bin/env node`，否则会在没有node的时候执行。当只有一个可执行文件且名字和包名一样，可以直接写成字符串形式。

```json
"bin": "./cli.js"
```

## repository

> npm包托管的地方，对于想贡献代码的人是有帮助的。

```json
"repository": {
  "type": "git",
  "url": "https://github.com/lhz960904/ouio"
}
```

## scripts

> 可执行的命令。[具体文档](https://docs.npmjs.com/misc/scripts)

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development node server.js",
  "build": "cross-env NODE_ENV=production node server.js"
}
```

## dependencies

> npm包所依赖的其他npm包，当使用`npm install` 下载该包时，`dependencies`中指定的包都会一并被下载。指定版本范围的规则如下：

- version 严格匹配
- \> version 必须大于该版本
- \<= version 必须小于等于该版本
- ^version 兼容版本
- 1.2.x  1.2.0, 1.2.1等，不能是1.3x
- [等等](https://docs.npmjs.com/files/package.json.html#dependencies)

```json
"dependencies": {
  "react": "^16.10.2",
  "react-dom": "^16.10.2"
}
```

## devDependencies

> npm包所依赖的构建和测试相关的npm包，放置到`devDependencies`，当使用`npm install` 下载该包时，`devDependencies`中指定的包不会一并被下载。

```json
"devDependencies": {
  "eslint": "^6.1.0",
  "jest": "^24.8.0",
  "webpack": "^4.0.0"
}
```

## peerDependencies

> 指定npm包与主npm包的兼容性，当开发插件时是需要的，例如开发React组件时，其组件是依赖于`react`、`react-dom`npm包的，可以在`peerDependencies`指定需要的版本。

```json
"peerDependencies": {
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```

**注**：如果`peerDependencies `指定的npm包没有下载，npm版本1和2会直接下载。 npm3不会下载，会给出警告。

## engines

> 指定npm包可以使用的Node版本

```json
"engines" : {
  "node" : ">=10.0.0"
}
```


## 参考

- [npm官方文档-更全](https://docs.npmjs.com/files/package.json.html)


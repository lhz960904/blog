---
title: 利用正则转换成自定义格式的时间字符串
date: 2018-09-08
tags:
  - javascript
---

每个网站都会有时间相关的展示，例如文章、新闻的发布时间，时间选择器的时间展示，显示当天时间等等。基本上后端数据库存储的都是Unix时间戳，前端需要将它转换成对应格式的字符串

<!-- more -->

格式类似于```2018.09.08```,```18-09-08```,```09-08 16:37```, ```2018-09-08 16:37:00```等等等。如果网站的时间展示格式是统一的，你完全可以定一个函数来转换对应的格式，如下

<!-- more -->
```javascript
// 转换成 ‘2018-09-08 16:37:00’
function dateFormat(time) {
  const date = new Date(time * 1000)
  // 不足俩位补0
  const fillZero = number => number > 9 ? number : '0' + number
  const year = date.getFullYear()
  const month = fillZero(date.getMonth() + 1)
  const day = fillZero(date.getDate())
  const hours = fillZero(date.getHours())
  const minutes = fillZero(date.getMinutes())
  const seconds = fillZero(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}  
```
但当你网站有一区域的时间展示不需要时分秒的时候，这时也可以通过将函数增加参数，来返回不同格式：
```javascript
// isHours 参数代表是否需要时分秒
function dateFormat(time, isHours) {
  // .....
  if (isHours) {
    return `${year}-${month}-${day}`
  } else {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}
```
如果有的情况需要将连接符改为'.'，类似于```2018.09.08```,再定义个连接符参数，虽然也可以解决问题，但当又有其他格式(类似于只需要年份后俩位```18.09.08```, 不需要补0```2018.9.8```)时,你的```dateFormat```函数就会臃肿起来，传的参数也会越来越多。
***
想要写一个通用的时间转换函数是可以借鉴成熟插件的方法，传入一个格式参数(```'YYYY-MM-dd HH:mm:ss'```)，来转换对应格式的字符串。这时就可以使用正则，去匹配替换格式中的字母。
```javascript
/**
 * 将时间戳转换为相对应格式时间
 * @param {时间戳} time 
 * @param {时间格式} format 
 */

function dateFormat(time, format) {
  const date = new Date(time * 1000)

  const pattern = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (var k in pattern) {
    const regexp = new RegExp(`(${k})`)
    const replaceFn = (match) => {
      // 当匹配到俩个YY或以上时，替换成年份
      if (match.includes('YY')) {
        return ('' + pattern[k]).substr(4 - match.length)
      }
      // 其他的都判断匹配长度是否大于1，大于则补充0，否则直接输出
      const fillZero = num => num > 9 ? num : '0' + num
      return match.length === 1 ? pattern[k] : fillZero(pattern[k])
    }
    // 将字符串按照正则匹配替换成函数返回值
    format = format.replace(regexp, replaceFn)
  }

  return format
}
```
上面函数首先定义了格式参数需要的正则和对应的取值操作，循环遍历正则对象，将匹配出来的字符串替换成时间即可。其中```String.replace```第一个参数可以是正则，第二个参数可以是返回替换字符串的函数，接受的参数是匹配到的字符传。[传送门](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
这个函数还有许多不足，其中没有对不允许的格式进行判断，而且只能转换对应时间，不能通过时间戳转换前几天，或几周前的时间。如果业务涉及到复杂的时间转换，可以使用以下几种成熟的时间插件。例如：[date-fns](https://github.com/date-fns/date-fns)、[moment](https://github.com/moment/moment)、[dayjs](https://github.com/iamkun/dayjs)
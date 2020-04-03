---
layout: LeetCodeContent
title: 71. 简化路径
difficulty: 1
leetcodeTags:
  - 栈
---


::: slot desc

Unix 风格给出一个文件的绝对路径，你需要简化它。或者换句话说，将其转换为规范路径。

**示例1**:

```
输入："/home/"
输出："/home"
解释：注意，最后一个目录名后面没有斜杠。
```

**示例2**:

```
输入："/../"
输出："/"
解释：从根目录向上一级是不可行的，因为根是你可以到达的最高级。
```

**示例3**:

```
输入："/a/../../b/../c//.//"
输出："/c"
```
:::


::: slot solution

```javascript
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
  // 按/分割字母
  const arr = path.split('/');
  const stack = [];
  arr.forEach(char => {
    // 过滤掉. 空字符串
    if (char === '.'  || !char) return;
    // 需要返回上一级，出栈一层
    if (char === '..') {
      stack.pop();
      return;
    }
    // 入栈
    stack.push(char);
  })
  return '/' + stack.join('/');
};
```

:::
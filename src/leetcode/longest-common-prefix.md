---
layout: LeetCodeContent
title: 14. 最长公共前缀
difficulty: 0
leetcodeTags:
  - 字符串
---


::: slot desc

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

**示例1**:

```
输入: ["flower","flow","flight"]
输出: "fl"
```

**示例2**:

```
输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。
```
:::


::: slot solution

```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  let ans = strs[0] || '';
  for (let i = 1; i < strs.length; i++) {
    let j = 0;
    for (;j < ans.length && j < strs[i].length; j++) {
      const charA = ans[j];
      const charB = strs[i][j];
      if (charA !== charB) {
        break;
      }
    }
    ans = ans.substring(0, j);
    if (ans === '') {
      return '';
    }
  }
  return ans;
};
```

:::
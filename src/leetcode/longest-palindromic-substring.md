---
layout: LeetCodeContent
title: 5. 最长回文子串
difficulty: 1
leetcodeTags:
  - 双指针
---


::: slot desc

给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

**示例1**:

```
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。
```

**示例2**:

```
输入: "cbbd"
输出: "bb"
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  if (!s.length) return '';
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    // 以每个元素或者每俩个元素当做中心，向外扩展
    const len = Math.max(getMaxLen(i, i), getMaxLen(i, i + 1));
    console.log(len, i)
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2) + 1;
    }
  }

  function getMaxLen(left, right) {
    let L = left, R = right;
    while (L >= 0 && R < s.length && s[L] === s[R]) {
      L--;
      R++;
    }
    return R - L - 1;
  }

  return s.substring(start, end);
   
};
```

:::
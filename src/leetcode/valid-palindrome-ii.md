---
layout: LeetCodeContent
title: 680. 验证回文字符串 Ⅱ
difficulty: 0
leetcodeTags:
  - 双指针
---


::: slot desc

给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。

**示例1**:

```
输入: "aba"
输出: True
```

**示例2**:

```
输入: "abca"
输出: True
解释: 你可以删除c字符。
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
  let time = 1;

  function valid(left, right) {
    if (left > right) return true;
    if (s.charAt(left) === s.charAt(right)) {
      return valid(left + 1, right - 1);
    } else if (time) {
      time--;
      return valid(left + 1, right) || valid(left, right - 1);
    } else {
      return false;
    }
  }

  return valid(0, s.length - 1);
};
```

:::
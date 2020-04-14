---
layout: LeetCodeContent
title: 344. 反转字符串
difficulty: 0
leetcodeTags:
  - 双指针
---


::: slot desc

编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 char[] 的形式给出。

不要给另外的数组分配额外的空间，你必须**原地**修改输入数组、使用 O(1) 的额外空间解决这一问题。

你可以假设数组中的所有字符都是 ASCII 码表中的可打印字符

**示例**:

```
输入：["h","e","l","l","o"]
输出：["o","l","l","e","h"]
```
:::


::: slot solution

```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    [s[i++], s[j--]] = [s[j], s[i]];
  }
};
```

:::
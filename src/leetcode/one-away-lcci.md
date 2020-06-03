---
layout: LeetCodeContent
title: 面试题01.05. 一次编辑
difficulty: 1
leetcodeTags:
  - 字符串
---


::: slot desc

字符串有三种编辑操作:插入一个字符、删除一个字符或者替换一个字符。 给定两个字符串，编写一个函数判定它们是否只需要一次(或者零次)编辑。


**示例1**:

```
输入: 
first = "pale"
second = "ple"
输出: True
```

**示例2**:

```
输入: 
first = "pales"
second = "pal"
输出: False
```
:::


::: slot solution

```javascript
/**
 * @param {string} first
 * @param {string} second
 * @return {boolean}
 */
var oneEditAway = function(first, second) {
  // 相等不需要操作
  if (first === second) return true;
  const firstLen = first.length;
  const secondLen = second.length;
  // 长度大于1，一次操作没有办法完成
  if (Math.abs(firstLen - secondLen) > 1) return false;

  let i = 0, j = firstLen - 1, k = secondLen - 1;

  // 从左开始比较，相同移动i指针
  while (i < firstLen && i < secondLen && first[i] === second[i]) {
    i++;
  }

  // 从右开始比较，相同移动j、k指针
  while (j >= 0 && k  >= 0 && first[j] === second[k]) {
    j--;
    k--;
  }

  return j - i < 1 && k - i < 1;
};
```

:::
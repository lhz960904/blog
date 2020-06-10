---
layout: LeetCodeContent
title: 9. 回文数
difficulty: 0
leetcodeTags:
  - 数学
---


::: slot desc

判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

**进阶**:

你能不将整数转为字符串来解决这个问题吗？

**示例1**:

```
输入: 121
输出: true
```

**示例2**:

```
输入: -121
输出: false
解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```
:::


::: slot solution

**将数字转换成字符换，可以使用对撞指针的方法，下面是进阶解法，利用除余来反转后半部分进行比较**

```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  // 负数、位数是0直接不满足回文数条件
  if (x < 0 || (x > 0 && x % 10 === 0)) return false;
  let reverseNum = 0;
  // 反转后半部分
  while (x > reverseNum) {
    const mod = x % 10;
    reverseNum = reverseNum * 10 + mod;
    x = Math.floor(x / 10);
  }
  // 相等，考虑奇数情况，取出中位数相等也可以。
  return reverseNum === x || x == Math.floor(reverseNum / 10);
};
```

:::
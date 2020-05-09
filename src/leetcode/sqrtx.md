---
layout: LeetCodeContent
title: 69. x 的平方根
difficulty: 0
leetcodeTags:
  - 二分查找法
---


::: slot desc

实现 int sqrt(int x) 函数。

计算并返回 x 的平方根，其中 x 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

**示例1**:

```
输入: 4
输出: 2
```

**示例2**:

```
输入: 8
输出: 2
说明: 8 的平方根是 2.82842..., 
     由于返回类型是整数，小数部分将被舍去。
```
:::


::: slot solution

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
  if (x === 0) return 0;
  let left = 1;
  let right = Math.floor(x / 2);
  while (left < right) {
    const mid =  Math.ceil((right + left) / 2);
    const count = mid * mid;
    if (count > x) {
      right = mid - 1;
    } else {
      left = mid;
    }
  }
  return left;
};
```

:::
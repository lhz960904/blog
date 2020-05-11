---
layout: LeetCodeContent
title: 50. Pow(x, n)
difficulty: 1
leetcodeTags:
  - 分治
  - 数学
---


::: slot desc

实现 pow(x, n) ，即计算 x 的 n 次幂函数。

**示例1**:

```
输入: 2.00000, 10
输出: 1024.00000
```

**示例2**:

```
输入: 2.00000, -2
输出: 0.25000
解释: 2-2 = 1/22 = 1/4 = 0.25
```
:::


::: slot solution

**分治，每次都递归算出n / 2的结果，然后根据是否是偶数，进行平方或者平方乘x**

```javascript
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {
  function fastPow(x, n) {
    if(n === 0) {
      return 1;
    }
    const half = fastPow(x, parseInt(n / 2));
    return n % 2 === 0 ? half * half : half * half * x;
  }

  return n < 0 ? fastPow(1 / x, -(-n)) : fastPow(x, n);
};
```

**从左到右迭代遍历，减少空间复杂度 [详细题解](https://leetcode-cn.com/problems/powx-n/solution/powx-n-by-leetcode-solution/)**

```javascript
var myPow = function(x, n) {
  if (n < 0) {
    n = -n;
    x = 1 / x;
  }
  let ans = 1;
  let current = x;
  while(n > 0) {
    // 每次比较最后一位是否是1（1就除不开），是的话，进行累乘
    if (n % 2 == 1) {
      ans *= current;
    }
    current *= current;
    // 除以2向下取余，移除二进制的最后一位
    n = parseInt(n / 2);
  }
  return ans;
};
```
:::
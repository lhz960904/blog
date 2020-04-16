---
layout: LeetCodeContent
title: 66. 加一
difficulty: 0
leetcodeTags:
  - 数组
---


::: slot desc

给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。

你可以假设除了整数 0 之外，这个整数不会以零开头。


**示例**:

```
输入: [1,2,3]
输出: [1,2,4]
解释: 输入数组表示数字 123。
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
  if (!digits.length) return [1];
  for (let i = digits.length - 1; i >=0; i--) {
    digits[i] = (digits[i] + 1) % 10;
    // 因为尾部+1，所以进位的时候只有可能是等于10。余数是0说明是10，不能提前返回。
    if(digits[i] !== 0) return digits;
  }
  // 没有提前返回，证明都进位了，最后要填充1
  digits.unshift(1) 
  return digits;
};
```

:::
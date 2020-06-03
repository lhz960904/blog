---
layout: LeetCodeContent
title: 面试题01.06. 字符串压缩
difficulty: 0
leetcodeTags:
  - 字符串
---


::: slot desc

字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没有变短，则返回原先的字符串。你可以假设字符串中只包含大小写英文字母（a至z）。

**示例1**:

```
输入："aabcccccaaa"
输出："a2b1c5a3"
```

**示例2**:

```
 输入："abbccd"
 输出："abbccd"
 解释："abbccd"压缩后为"a1b2c2d1"，比原字符串长度更长。
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
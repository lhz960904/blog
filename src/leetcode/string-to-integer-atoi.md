---
layout: LeetCodeContent
title: 8. 字符串转换整数 (atoi)
difficulty: 1
leetcodeTags:
  - 数学
  - 字符串
---


::: slot desc

请你来实现一个 atoi 函数，使其能将字符串转换成整数。

[题目详情](https://leetcode-cn.com/problems/string-to-integer-atoi/)

:::


::: slot solution

## 方法1

根据题意，就是实现JS的parseInt，但是不能小于Math.pow(-2, 31)，不能大于Math.pow(2, 31) - 1

```javascript
/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
  const number = parseInt(str);
  // NaN
  if (number !== number) {
    return 0
  }
  return Math.min(Math.max(number, Math.pow(-2, 31)), Math.pow(2, 31) - 1)
};
```

### 方法2

不用JS提供的parseInt，自己来实现。

```javascript
var myAtoi = function(str) {
  // 去除字符串前面空格
  str = str.trim();
  // 结果
  let ans = 0; 
  // 代表是整数
  let plus = true;
  // 需要先考虑符号
  if (str.charAt(0)  === '-' || str.charAt(0) === '+') {
    plus = str.charAt(0)  === '-' ? false : true;
    str = str.substr(1);
  }
  // 遍历字符串，*10 向左移，
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    // 不是数字
    if (!/[0-9]/g.test(char)) {
      return plus ? ans : -ans;
    }
    // 超出最大数， 可能是 *10 也可能是 +char, 所以移到右边判断
    if (ans > (Math.pow(2, 31) - 1 - char) / 10) {
      return plus ? Math.pow(2, 31) - 1 : Math.pow(-2, 31);
    }
    ans = ans * 10 + (+char);
  }
  return plus ? ans : -ans;
};
```

:::
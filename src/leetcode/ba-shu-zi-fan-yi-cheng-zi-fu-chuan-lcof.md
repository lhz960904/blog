---
layout: LeetCodeContent
title: 面试题46. 把数字翻译成字符串
difficulty: 1
leetcodeTags:
  - 动态规划
  - 递归
---


::: slot desc

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

**示例1**:

```
输入: 12258
输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
```

:::


::: slot solution

**缓存+递归**

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function(num) {
  let memo = {};
  function _translateNum(str) {
    // 存在缓存，直接使用
    if (memo[str]) return memo[str];
    // 递归终止条件
    if (str.length <= 1) return 1;
    // 结果
    let count = 0;
    // 截取前俩个字符
    const char1 = str.substring(0, 1);
    const char2 = str.substring(0, 2);
    // 取一个字符一定满足[0, 25]之间
    count += _translateNum(str.substring(1));
    // 判断俩个字符是否满足[0, 25], 注意：0开头俩位数也不能满足
    if (char2.indexOf('0') == 0 || +char2 > 25) return count;
    // 满足条件时，count继续累加
    count += _translateNum(str.substring(2))
    // 缓存
    memo[str] = count;
    return count;
  }

  return _translateNum(String(num));
};
```

**动态规划dp[i]代表前i个字符的翻译数量，其总是与前俩个有关系**

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var translateNum = function(num) {
  const str = num.toString()
  const n = str.length
  const dp = [1, 1]
  for (let i = 2; i < n + 1; i++) {
    const temp = Number(str[i - 2] + str[i - 1]);
    if (temp >= 10 && temp <= 25) {
      dp[i] = dp[i - 1] + dp[i - 2]
    } else {
      dp[i] = dp[i - 1]
    }
  }
  return dp[n]
};
```

:::
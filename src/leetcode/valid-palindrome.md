---
layout: LeetCodeContent
title: 125. 验证回文串
difficulty: 0
leetcodeTags:
  - 双指针
---


::: slot desc

给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

**说明**：本题中，我们将空字符串定义为有效的回文串。

**示例1**:

```
输入: "A man, a plan, a canal: Panama"
输出: true
```

**示例2**:

```
输入: "race a car"
输出: false
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
  let i = 0; j = s.length - 1;
  while (i < j) {
    // 都是字母或数字，进行比较，不相同返回false，相同++
    if (/[a-zA-Z0-9]/.test(s[i]) && /[a-zA-Z0-9]/.test(s[j])) {
      if (s[i].toLowerCase() !== s[j].toLowerCase()) {
        return false;
      }
      i++;
      j--;
    } else {
      // 不都是字母或数字，进行移动
      !/[a-zA-Z0-9]/.test(s[i]) && i++;
      !/[a-zA-Z0-9]/.test(s[j]) && j--;
    }
  }
  return true;
};
```

:::
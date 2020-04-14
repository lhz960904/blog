---
layout: LeetCodeContent
title: 345. 反转字符串中的元音字母
difficulty: 0
leetcodeTags:
  - 双指针
---


::: slot desc

编写一个函数，以字符串作为输入，反转该字符串中的元音字母。

**示例1**:

```
输入: "hello"
输出: "holle"
```

**示例2**:

```
输入: "leetcode"
输出: "leotcede"
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
  let i = 0; j = s.length - 1;
  let ans = s.split('');
  while (i < j) {
    // 元音字符交换
    if (vowels.includes(ans[i]) && vowels.includes(ans[j])) {
      [ans[i], ans[j]] = [ans[j], ans[i]];
      i++;
      j--;
    } else {
      !vowels.includes(ans[i]) && i++;
      !vowels.includes(ans[j]) && j--;
    }
  }
  return ans.join('');
};
```

:::
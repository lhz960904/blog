---
layout: LeetCodeContent
title: 316. 去除重复字母
difficulty: 2
leetcodeTags:
  - 栈
---


::: slot desc

给你一个仅包含小写字母的字符串，请你去除字符串中重复的字母，使得每个字母只出现一次。需保证返回结果的字典序最小（要求不能打乱其他字符的相对位置）。

**示例1**:

```
输入: "bcabc"
输出: "abc"
```

**示例2**:

```
输入: "cbacdcbc"
输出: "acdb"
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicateLetters = function(s) {
  // 栈
  const stack = [];
  // 存储已经入栈的元素
  const set = new Set();
  for (let i = 0; i < s.length; i++) {
    const char = s.charAt(i);
    if (set.has(char)) continue;
    while (
      stack.length && 
      // 栈顶元素字典序大于当前元素
      char < stack[stack.length - 1] &&
      // 判断后续字符串中是否存在栈顶元素，存在就出栈
      s.substr(i).indexOf(stack[stack.length - 1]) > -1
    ) {
      set.delete(stack[stack.length - 1])
      stack.pop();
    }
    set.add(char);
    stack.push(char);
  }
  return stack.join('');
};
```

:::
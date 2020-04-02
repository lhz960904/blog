---
layout: LeetCodeContent
title: 20. 有效的括号
difficulty: 0
leetcodeTags:
  - 栈
---


::: slot desc

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

注意空字符串可被认为是有效字符串。

**示例1**:

```
输入: "()"
输出: true
```

**示例2**:

```
输入: "()[]{}"
输出: true
```

**示例3**:

```
输入: "(]"
输出: false
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const char = s.charAt(i);
    if (char === '(' || char === '[' || char === '{' ) {
      stack.push(char);
      continue;
    }
    const top = stack.pop();
    if (
      !top ||
      (top === '(' && char !== ')') ||
      (top === '[' && char !== ']') ||
      (top === '{' && char !== '}')
    ) {
      return false;
    }
  }

  return !stack.length
};
```

:::
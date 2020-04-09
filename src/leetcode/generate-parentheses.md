---
layout: LeetCodeContent
title: 22. 括号生成
difficulty: 1
leetcodeTags:
  - 深度优先搜索
---


::: slot desc

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

 

**示例**:

```
输入：n = 3
输出：[
       "((()))",
       "(()())",
       "(())()",
       "()(())",
       "()()()"
     ]
```
:::


::: slot solution

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  const ans = [];
  function dfs(l, r, s) {
    if (l === 0 && r === 0) {
      ans.push(s); 
    }
    // 左括号还有剩余
    if (l > 0) {
      dfs(l - 1, r, s + '(');
    }
    // 右括号剩余数量大于左括号剩余数量
    if (r > l) {
      dfs(l, r - 1, s + ')');
    }
  }

  dfs(n, n, '');
  return ans;
};
```

:::
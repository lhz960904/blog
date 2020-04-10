---
layout: LeetCodeContent
title: 151. 翻转字符串里的单词
difficulty: 0
leetcodeTags:
  - 字符串
---


::: slot desc

给定一个字符串，逐个翻转字符串中的每个单词。

**示例1**:

```
输入: "the sky is blue"
输出: "blue is sky the"
```

**示例2**:

```
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```

**示例3**:

```
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```
:::


::: slot solution

## API解法

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
};

```

:::
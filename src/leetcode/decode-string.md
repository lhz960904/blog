---
layout: LeetCodeContent
title: 394. 字符串解码
difficulty: 1
leetcodeTags:
  - 栈
---


::: slot desc

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

**示例**:

```
s = "3[a]2[bc]", 返回 "aaabcbc".
s = "3[a2[c]]", 返回 "accaccacc".
s = "2[abc]3[cd]ef", 返回 "abcabccdcdcdef".
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== ']') {
      stack.push(s[i]);
      continue;
    }
    // 从栈中取出元素一直到[拼接字符串
    let char = '';
    while (true) {
      const top = stack.pop();
      if (top === '[') break;
      char = top + char;
    }
    // 找到[前面的数字，注意：100这种0的情况
    let count = '';
    while (/\d/.test(stack[stack.length - 1])) {
      const top = stack.pop();
      count = top + count;
    }
    char = char.repeat(count);
    stack.push(char);
  }

  return stack.join('');
};
```

:::
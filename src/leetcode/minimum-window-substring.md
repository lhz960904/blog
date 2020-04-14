---
layout: LeetCodeContent
title: 76. 最小覆盖子串
difficulty: 2
leetcodeTags:
  - 哈希表
  - 滑动窗口
---


::: slot desc

给你一个字符串 S、一个字符串 T，请在字符串 S 里面找出：包含 T 所有字母的最小子串。

**示例**:

```
输入: S = "ADOBECODEBANC", T = "ABC"
输出: "BANC"
```

**说明**：

如果 S 中不存这样的子串，则返回空字符串 ""。
如果 S 中存在这样的子串，我们保证它是唯一的答案。
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  // 记录t中各字母的数量
  const map = {};
  t.split('').forEach((char) => {
    map[char] = map[char] || 0;
    map[char]++;
  })
  // 窗口中各字母的数量
  const window = {};
  // 匹配字母数量相等的数量，当等于t的长度说明满足异位词
  let matched = 0
  let min = s.length + 1;
  // 最小子串的起始位置
  let start = 0;
  let i = 0; j = 0;
  while (j < s.length) {
    const char = s.charAt(j);
    // 当前字母在p字符串存在，数量++
    if (map[char]) {
      window[char] =  window[char] || 0;
      window[char]++;
      // 数量相同时，说明p其中一个字母匹配成功
      if (window[char] === map[char]) {
        matched++;
      }
    }
    // 当匹配成功的数量等于p中字母个数时
    while (matched === Object.keys(map).length) {
      // console.log(min, i , j)
      if (j - i < min) {
        // 更新最小子串的位置和长度
        start = i;
        min = j - i + 1;
      }
      const c = s.charAt(i);
      if (map[c]) {
        window[c]--;
        // 维护matched数量,
        if (window[c] <  map[c]) {
          matched--;
        }
      }
     i++;
    }
    j++;
  }
  return min > s.length ? '' : s.substr(start, min);
};
```

:::
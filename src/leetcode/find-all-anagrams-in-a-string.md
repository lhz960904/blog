---
layout: LeetCodeContent
title: 438. 找到字符串中所有字母异位词
difficulty: 1
leetcodeTags:
  - 滑动窗口
  - 哈希表
---


::: slot desc

给定一个字符串 s 和一个非空字符串 p，找到 s 中所有是 p 的字母异位词的子串，返回这些子串的起始索引。

**示例**:

```
输入:
s: "cbaebabacd" p: "abc"

输出:
[0, 6]

解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的字母异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的字母异位词。
```

[题目详情](https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/)
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
  // 记录p中各字母的数量
  const map = {};
  p.split('').forEach((char) => {
    map[char] = map[char] || 0;
    map[char]++;
  })
  // 窗口中各字母的数量
  const windows = {};
  // 匹配字母数量相等的数量，当等于p的长度说明满足异位词
  let matched = 0
  const ans = [];
  let i = 0; j = 0;
  while (j < s.length) {
    const char = s.charAt(j);
    // 当前字母在p字符串存在，数量++
    if (map[char]) {
      windows[char] =  windows[char] || 0;
      windows[char]++;
      // 数量相同时，说明p其中一个字母匹配成功
      if (windows[char] === map[char]) {
        matched++;
      }
    }
    // 当匹配成功的数量等于p中字母个数时
    while (matched === Object.keys(map).length) {
      // 属于异位词，除了匹配成功，长度也必须相同。
      if (j - i + 1 === p.length) {
        ans.push(i);
      }
      const c = s.charAt(i);
      if (map[c]) {
        windows[c]--;
        // 维护matched数量,
        if (windows[c] <  map[c]) {
          matched--;
        }
      }
      // 持续缩小窗口
      i++;
    }
    j++;
  }
  return ans;
};
```

:::
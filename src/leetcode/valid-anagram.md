---
layout: LeetCodeContent
title: 242. 有效的字母异位词
difficulty: 0
leetcodeTags:
  - 哈希表
---


::: slot desc

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

**示例1**:

```
输入: s = "anagram", t = "nagaram"
输出: true
```

**示例2**:

```
输入: s = "rat", t = "car"
输出: false
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  const map = new Map();
  // 将s各字符存在哈希表中
  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i])) {
      map.set(s[i], map.get(s[i]) + 1);
    } else {
      map.set(s[i], 1);
    }
  }
  // 哈希表中存在-1
  for (let i = 0; i < t.length; i++) {
    if (!map.has(t[i])) {
      return false;
    }
    const count = map.get(t[i]) - 1;
    if (count === 0) {
      map.delete(t[i]);
    } else {
      map.set(t[i], count);
    }
  }
  // 是异位词，经过上述操作，map中不会存在键值
  return map.size === 0;
};
```

:::
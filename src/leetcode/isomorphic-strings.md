---
layout: LeetCodeContent
title: 205. 同构字符串
difficulty: 0
leetcodeTags:
  - 哈希表
---


::: slot desc

给定两个字符串 s 和 t，判断它们是否是同构的。

如果 s 中的字符可以被替换得到 t ，那么这两个字符串是同构的。

所有出现的字符都必须用另一个字符替换，同时保留字符的顺序。两个字符不能映射到同一个字符上，但字符可以映射自己本身。

**示例1**:

```
输入: s = "egg", t = "add"
输出: true
```
**示例2**:

```
输入: s = "foo", t = "bar"
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
var isIsomorphic = function(s, t) {
  // s中字母 => t中字母的映射
  const map = new Map();
  // t字母被映射的集合
  const set = new Set();
  for (let i = 0; i < s.length; i++) {
    // 当字母、非空单词都没有建立关系时，建立关系
    if (!map.has(s[i]) && !set.has(t[i])) {
      map.set(s[i], t[i]);
      set.add(t[i]);
    } 
    // 通过s字母拿到t字母进行比较，不相等说明不是同构
    if (map.get(s[i]) !== t[i]) {
      return false;
    }
  }
  return true;
};
```

:::
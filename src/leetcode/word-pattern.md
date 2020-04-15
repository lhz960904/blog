---
layout: LeetCodeContent
title: 290. 单词规律
difficulty: 0
leetcodeTags:
  - 哈希表
---


::: slot desc

给定一种规律 pattern 和一个字符串 str ，判断 str 是否遵循相同的规律。

这里的 遵循 指完全匹配，例如， pattern 里的每个字母和字符串 str 中的每个非空单词之间存在着双向连接的对应规律。

**示例1**:

```
输入: pattern = "abba", str = "dog cat cat dog"
输出: true
```
**示例2**:

```
输入:pattern = "abba", str = "dog cat cat fish"
输出: false
```
:::


::: slot solution

```javascript
/**
 * @param {string} pattern
 * @param {string} str
 * @return {boolean}
 */
var wordPattern = function(pattern, str) {
  const charArr = str.split(' ');
  if (charArr.length !== pattern.length) return false;
  // 非空单词 => 字母的映射
  const map = new Map();
  // 字母被映射的集合
  const set = new Set();
  for (let i = 0; i < charArr.length; i++) {
    // 当字母、非空单词都没有建立关系时，建立关系
    if (!map.has(charArr[i]) && !set.has(pattern[i])) {
      map.set(charArr[i], pattern[i]);
      set.add(pattern[i])
    } 
    // 通过非空单词拿到对应的字母，进行比较，不相等说明不遵循规律
    if (map.get(charArr[i]) !== pattern[i]) {
      return false;
    }
  }
  return true;
};
```

:::
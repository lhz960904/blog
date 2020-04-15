---
layout: LeetCodeContent
title: 451. 根据字符出现频率排序
difficulty: 1
leetcodeTags:
  - 哈希表
---


::: slot desc

给定一个字符串，请将字符串里的字符按照出现的频率降序排列

**示例1**:

```
输入:
"tree"

输出:
"eert"

解释:
'e'出现两次，'r'和't'都只出现一次。
因此'e'必须出现在'r'和't'之前。此外，"eetr"也是一个有效的答案。

```
**示例2**:

```
输入:
"cccaaa"

输出:
"cccaaa"

解释:
'c'和'a'都出现三次。此外，"aaaccc"也是有效的答案。
注意"cacaca"是不正确的，因为相同的字母必须放在一起。
```
:::


::: slot solution

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function(s) {
  // 哈希表存储每个字母的频次
  const map = new Map();
  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i])) {
      map.set(s[i], map.get(s[i]) + 1);
    } else {
      map.set(s[i], 1);
    }
  }
  // 根据频次高到底进行排序
  const arr = Array.from([...map.keys()]).sort((a, b) => map.get(b) - map.get(a));
  const getRepeatStr = (k) => {
    const len = map.get(k)
    let res = '';
    for (let i = 0; i < len; i++) {
      res += k;
    }
    return res;
  }
  return arr.reduce((a, c) => a + getRepeatStr(c), '');
};
```

:::
---
layout: LeetCodeContent
title: 3. 无重复字符的最长子串
difficulty: 1
leetcodeTags:
  - 双指针
  - 哈希表
  - 滑动窗口
---


::: slot desc

给定一个字符串，请你找出其中不含有重复字符的**最长子串**的长度。

**示例1**:

```
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例2**:

```
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例3**:

```
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```
:::


::: slot solution

## 方法一

暴力求解，把每一个字符当做最长子串的首字母，向后遍历直到找到重复的停止。result一直保存着最大值。

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const set = new Set([char]);
    let j = i + 1;
    for (;j < s.length; j++) {
      if (set.has(s[j])) break;
      set.add(s[j]);
    }
    result = Math.max(result, j - i);
  }

  return result;
};
```

## 方法二

**滑动窗口**

```javascript
var lengthOfLongestSubstring = function(s) {
  // 滑动窗口
  let i = 0;
  let j = 0;
  let len = s.length;
  const set = new Set();
  let ans = 0;
  while (i < len && j < len) {
    if (!set.has(s[j])) {
      set.add(s[j++]);
      ans = Math.max(ans, j - i);
    } else {
      set.delete(s[i++]);
    }
  }
  return ans;
};
```

### 方法三

上面俩种方法发现重复后，都是i+1，但其实j位置的元素可能跟i+1以后的元素相同，所以优化代码。直接将i滑动到重复的位置加1上

```javascript
var lengthOfLongestSubstring = function(s) {
  let i = 0;
  let j = 0;
  let ans = 0;
  const map = new Map();
  // (s.length - i) > ans 代表当剩余长度小于最大长度的时候，没必要进行下去
  while (j < s.length && (s.length - i) > ans) {
    if (map.has(s[j])) {
      i = Math.max(map.get(s[j]) + 1, i);
    }
    ans = Math.max(ans, j - i + 1);
    map.set(s[j], j);
    j++;
  }

  return ans;
};
```
:::
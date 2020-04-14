---
layout: LeetCodeContent
title: 209. 长度最小的子数组
difficulty: 1
leetcodeTags:
  - 双指针
  - 滑动窗口
---


::: slot desc

给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的连续子数组。如果不存在符合条件的连续子数组，返回 0。

**示例**:

```
输入: s = 7, nums = [2,3,1,2,4,3]
输出: 2
解释: 子数组 [4,3] 是该条件下的长度最小的连续子数组。
```
:::


::: slot solution

```javascript
/**
 * @param {number} s
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(s, nums) {
  let l = 0, r = -1;
  let sum = 0;
  let len = nums.length + 1;
  while (l < nums.length) {
    if (sum < s) {
      sum += nums[++r];
    } else {
      sum -= nums[l++];
    }
    if (sum >= s) {
      len = Math.min(len, r - l + 1);
    }
  }
  return len > nums.length ? 0 : len;
};
```

:::
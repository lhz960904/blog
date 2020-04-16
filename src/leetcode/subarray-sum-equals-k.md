---
layout: LeetCodeContent
title: 560. 和为K的子数组
difficulty: 1
leetcodeTags:
  - 数组
  - 哈希表
---


::: slot desc

给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。

**示例**:

```
输入:nums = [1,1,1], k = 2
输出: 2 , [1,1] 与 [1,1] 为两种不同的情况。
```
:::


::: slot solution

## 暴力解法

每一个元素当做子数组的第一个元素，开始向后遍历，求和等于k，结果+1。O(n2)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  let ans = 0;
  for (let i = 0; i < nums.length; i++) {
    let total = 0;
    for (let j = i; j < nums.length; j++) {
      total += nums[j];
      if (total === k) {
        ans++;
      } 
    }
  }
  return ans;
};
```

## 前缀和解法

我们用哈希表记录i位置的前缀和，当遍历到j位置， `sum[j] - k = sum[i]`说明i~j区间内形成的子数组和就是k。

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  let ans = 0;
  const map = new Map([[0, 1]]);
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (map.has(sum - k)) {
      ans += map.get(sum - k);
    }
    if (map.has(sum)) {
      map.set(sum, map.get(sum) + 1);
    } else {
      map.set(sum, 1);
    }
  }
  return ans;
};
```

:::
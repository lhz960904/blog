---
layout: LeetCodeContent
title: 152. 乘积最大子数组
difficulty: 1
leetcodeTags:
  - 动态规划
---


::: slot desc

给你一个整数数组 nums ，请你找出数组中乘积最大的连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

**示例1**:

```
输入: [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

**示例2**:

```
输入: [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
  let ans = nums[0], max = nums[0], min = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const nextMax = Math.max(max * nums[i], min * nums[i], nums[i]);
    const nextMin = Math.min(max * nums[i], min * nums[i], nums[i]);
    max = nextMax;
    min = nextMin;
    ans = Math.max(max, ans);
  }

  return ans;
};
```

:::
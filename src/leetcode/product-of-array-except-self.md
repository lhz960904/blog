---
layout: LeetCodeContent
title: 238. 除自身以外数组的乘积
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给你一个长度为 n 的整数数组 nums，其中 n > 1，返回输出数组 output ，其中 output[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。

**说明**: 请不要使用除法，且在 O(n) 时间复杂度内完成此题。

**示例1**:

```
输入: [1,2,3,4]
输出: [24,12,8,6]
```

[题目详情](https://leetcode-cn.com/problems/product-of-array-except-self/)

:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
  // 当前元素结果 = 左侧乘积结果 * 右侧乘积结果

  const ans = [1]; // 先存储左侧前缀乘积
  for (let i = 1; i < nums.length; i++) {
    ans.push(nums[i - 1] * ans[i - 1]);
  }

  // 反向遍历，维护右侧乘积结果R
  let R = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    ans[i] = ans[i] * R;
    R *= nums[i];
  }

  return ans;
};
```

:::
---
layout: LeetCodeContent
title: 16. 最接近的三数之和
difficulty: 1
leetcodeTags:
  - 双指针
---


::: slot desc

给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。

**示例**:

```
输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
  let ans = Infinity, closest = Infinity;
  nums.sort((a, b) => a - b);
  // 至少三个数
  for (let i = 0; i < nums.length - 2; i++) {
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (Math.abs(sum - target) < closest) {
        ans = sum;
        closest = Math.abs(sum - target);
      }
      if (sum > target) {
        r--;
      } else {
        l++;
      }
    }
  }
  
  return ans;
};
```

:::
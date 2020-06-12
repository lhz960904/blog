---
layout: LeetCodeContent
title: 15. 三数之和
difficulty: 1
leetcodeTags:
  - 双指针
---


::: slot desc

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。

**注意**：答案中不可以包含重复的三元组。

**示例**:

```
给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```
:::


::: slot solution

**将数组排序后，针对每一个nums[i]，利用双指针解two sum题**

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  // 升序排序
  nums.sort((a, b) => a - b);
  let ans = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0 || nums[i] === nums[i - 1]) continue;
    const delta = 0 - nums[i];
    let L = i + 1, R = nums.length - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if(sum == 0){
        ans.push([nums[i],nums[L],nums[R]]);
        while (L < R && nums[L] == nums[L+1]) L++; // 去重
        while (L < R && nums[R] == nums[R-1]) R--; // 去重
        L++;
        R--;
      }
      else if (sum < 0) L++;
      else if (sum > 0) R--;
    }
  }
  
  return ans;
};
```

:::
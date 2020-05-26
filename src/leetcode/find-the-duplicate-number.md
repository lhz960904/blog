---
layout: LeetCodeContent
title: 287. 寻找重复数
difficulty: 1
leetcodeTags:
  - 二分查找法
---


::: slot desc

给定一个包含 n + 1 个整数的数组 nums，其数字都在 1 到 n 之间（包括 1 和 n），可知至少存在一个重复的整数。假设只有一个重复的整数，找出这个重复的数。

**示例**:

```
输入: [1,3,4,2,2]
输出: 2
```

**示例**:

```
输入: [3,1,3,4,2]
输出: 3
```
:::


::: slot solution

[二分查找法详细题解](https://leetcode-cn.com/problems/find-the-duplicate-number/solution/er-fen-fa-si-lu-ji-dai-ma-python-by-liweiwei1419/)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function(nums) {
  let left = 0, right = nums.length - 1;

  while (left < right) {
    let count = 0;
    const mid = (left + right) >> 1;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] <= mid) {
        count++;
      }
    }
    if (count > mid) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
};
```

:::
---
layout: LeetCodeContent
title: 41. 缺失的第一个正数
difficulty: 2
leetcodeTags:
  - 数组
---


::: slot desc

给你一个未排序的整数数组，请你找出其中没有出现的最小的正整数。

**示例**:

```
输入: [1,2,0]
输出: 3
```
:::


::: slot solution

**标记法**

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const N = nums.length;
  // 把所有数变成1~N
  for (let i = 0; i < N; i++) {
    if (nums[i] <= 0) {
      nums[i] = N + 1;
    }
  }
  // 遍历到1~N的数，将对应的索引变成相应负数(标记)
  for (let i = 0; i < N; i++) {
    const cur = Math.abs(nums[i]);
    if (cur > 0 && cur <= N) {
      nums[cur - 1] = -Math.abs(nums[cur - 1]);
    }
  }
  // 再次遍历找到不为负数的，说明没有出现过
  for (let i = 0; i < N; i++) {
    const cur = nums[i];
    if (cur > 0) {
      return i + 1;
    }
  }
  return N + 1;
};
```

**置换**

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const N = nums.length;
  // 将1-N的数放到对应的索引上
  for (let i = 0; i < N; i++) {
    while (nums[i] > 0 && nums[i] <= N && nums[nums[i] - 1] != nums[i]) {
      const temp = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = temp;
    }
  }
  // 遍历数组，如果当前值与索引不匹配，则是答案
  for (let i = 1; i <= N; i++) {
    if (nums[i - 1] !== i) {
      return i;
    }
  }
  return N + 1;
};
```

:::
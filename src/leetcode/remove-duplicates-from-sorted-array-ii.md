---
layout: LeetCodeContent
title: 80. 删除排序数组中的重复项 II
difficulty: 1
leetcodeTags:
  - 数组
  - 双指针
---


::: slot desc

给定一个排序数组，你需要在**原地**删除重复出现的元素，使得每个元素最多出现两次，返回移除后数组的新长度。

不要使用额外的数组空间，你必须在**原地**修改输入数组 并在使用**O(1)**额外空间的条件下完成。

**示例**:

```
给定 nums = [1,1,1,2,2,3],

函数应返回新长度 length = 5, 并且原数组的前五个元素被修改为 1, 1, 2, 2, 3 。

你不需要考虑数组中超出新长度后面的元素。

```
:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  if (!nums.length) return 0;
  let k = 0, i = 1, count = 1;
  while (i < nums.length) {
    if (nums[i] !== nums[k] || count < 2) {
      count = nums[i] !== nums[k] ? 1 : 2;
      nums[++k] = nums[i];
    }
    i++;
  }
  return k + 1;
};
```

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (k < 2 || nums[i] > nums[k - 2]) {
      nums[k++] = nums[i];
    }
  }
  return k;
};
```

:::
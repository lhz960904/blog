---
layout: LeetCodeContent
title: 88. 合并两个有序数组
difficulty: 1
leetcodeTags:
  - 数组
  - 双指针
---


::: slot desc

给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。

说明:
  - 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
  - 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

**示例**:

```
输入:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]
```
:::


::: slot solution

## 双指针 / 从前往后

```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  const nums1Copy = [...nums1];
  let i = 0, j = 0, idx = 0;
  while (i < m || j < n) {
    const a = i < m ? nums1Copy[i] : Number.MAX_VALUE;
    const b = j < n ? nums2[j] : Number.MAX_VALUE;
    if (a > b) {
      nums1[idx++] = b;
      j++;
    } else {
      nums1[idx++] = a;
      i++;
    }
  }
};
```

## 双指针 / 从后往前

从后往前不需要拷贝nums1数组，节省O(n)的空间复杂度

```javascript
var merge = function(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, idx = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[idx--] = nums1[i];
      i--;
    } else {
      nums1[idx--] = nums2[j];
      j--;
    }
    console.log(nums1)
  }
  if (i < 0 && j >= 0) {
    for (let x = idx; x >= 0; x--) {
      console.log(x, nums2, j)
      nums1[x] = nums2[j--];
    }
  }
  if (j < 0 && i >= 0) {
    for (let x = idx; x >= 0; x--) {
      nums1[x] = nums1[i--];
    }
  }
};
```

:::
---
layout: LeetCodeContent
title: 4. 寻找两个正序数组的中位数
difficulty: 2
leetcodeTags:
  - 二分查找法
---


::: slot desc

给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。

请你找出这两个正序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

你可以假设 nums1 和 nums2 不会同时为空。

**示例1**:

```
nums1 = [1, 3]
nums2 = [2]

则中位数是 2.0
```

**示例2**:

```
nums1 = [1, 2]
nums2 = [3, 4]

则中位数是 (2 + 3)/2 = 2.5
```
:::


::: slot solution

**要求时间复杂度是O(log(m + n))，所以可以使用二分查找法**

[具体题解](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by-w-2/)

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  // 如果总长度是奇数，left === right 
  const left = Math.floor((m + n + 1) / 2);
  const right = Math.floor((m + n + 2) / 2);
  // [1,2,3,4] 取第2个小的和第三个小的 [2,3,4] 取俩次第二个小的
  return (
    getKth(nums1, 0, m - 1, nums2, 0, n - 1, left) + 
    getKth(nums1, 0, m - 1, nums2, 0, n - 1, right)
  ) * 0.5;
};

/**
 * 从俩个有序数组中取出第k小的树
 * start1、end1 是 nums1的起始位置、终止位置
 * start2、end2 是 nums2的起始位置、终止位置
 */
function getKth(nums1, start1, end1, nums2, start2, end2, k) {
  const len1 = end1 - start1 + 1;
  const len2 = end2 - start2 + 1;
  // 让 len1 的长度小于 len2，这样就能保证如果有数组空了，一定是 len1 
  if (len1 > len2)  return getKth(nums2, start2, end2, nums1, start1, end1, k);
  // nums1数组空了，直接取nums2得第k最小值
  if (len1 == 0) return nums2[start2 + k - 1];
  // 正常递归到底，取第一个k小的值，返回俩个数组中第一个数最小
  if (k == 1) return Math.min(nums1[start1], nums2[start2]);

  // 防止数组越界
  const i = start1 + Math.min(len1, Math.floor(k / 2)) - 1;
  const j = start2 + Math.min(len2, Math.floor(k / 2)) - 1;

  if (nums1[i] > nums2[j]) {
    // 可排除掉nums2 j前面的所有元素
    return getKth(nums1, start1, end1, nums2, j + 1, end2, k - (j - start2 + 1));
  } else {
    // 可排除掉nums1 i前面的所有元素
    return getKth(nums1, i + 1, end1, nums2, start2, end2, k - (i - start1 + 1));
  }
}
```


:::
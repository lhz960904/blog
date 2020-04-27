---
layout: LeetCodeContent
title: 33. 搜索旋转排序数组
difficulty: 1
leetcodeTags:
  - 二分查找法
---


::: slot desc

假设按照升序排序的数组在预先未知的某个点上进行了旋转。

( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。

搜索一个给定的目标值，如果数组中存在这个目标值，则返回它的索引，否则返回 -1 。

你可以假设数组中不存在重复的元素。

你的算法时间复杂度必须是 O(log n) 级别。

**示例**:

```
输入: nums = [4,5,6,7,0,1,2], target = 0
输出: 4
```
:::


::: slot solution

**先通过二分查找法找到最小值（旋转位置），然后判断目标值是在最小值的右侧、还是左侧。接下来就是在有序的数组中通过二分查找到目标值**

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  // 二分查找到目标值
  const _search = (l, r) => {
    if (l > r) {
      return -1;
    }
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] > target) {
      return _search(l, mid - 1);
    } else {
      return _search(mid + 1, r);
    }
  } 
  // 二分查找找到最小值
  const findMinIndex = (l, r) => {
    if (l > r) {
      return 0;
    }
    const mid = Math.ceil((l + r) / 2);
    if (nums[mid] > nums[mid + 1]) {
      return mid + 1;
    } else if (nums[mid] > nums[l]) {
      return findMinIndex(mid + 1, r);
    } else {
      return findMinIndex(l, mid - 1);
    }
  } 
  if (!nums.length) return -1;
  const idx = findMinIndex(0, nums.length - 1);
  if (idx === 0) {
    return _search(0, nums.length - 1);
  }
  if (nums[0] > target) {
    return _search(idx, nums.length - 1);
  } else {
    return _search(0, idx);
  }
};
```

**二分查找时，nums[mid] >= nums[0]说明左侧是升序，右侧存在降序，反之亦然。所以通过target跟第一个元素、或最后一个元素进行比较，能确定在哪一个侧进行二分查找**

```javascript
var search = function(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    if (nums[mid] >= nums[0]) {
      // target > nums[0] 说明在反转左侧区间内，如果比nums[0]还小，那在反转右侧
      if (nums[mid] > target && target >= nums[0]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      // 大于mid且小于最右侧元素，说明在反转右侧区间
      if (nums[mid] < target && target <= nums[nums.length - 1]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    console.log(l, r)
  }
  return -1;
};
```

:::
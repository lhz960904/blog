---
layout: LeetCodeContent
title: 1095. 山脉数组中查找目标值
difficulty: 2
leetcodeTags:
  - 二分查找法
---


::: slot desc

给你一个 山脉数组 mountainArr，请你返回能够使得 mountainArr.get(index) 等于 target 最小 的下标 index 值。

如果不存在这样的下标 index，就请返回 -1。

[题目详情](https://leetcode-cn.com/problems/find-in-mountain-array/)

**示例1**:

```
输入：array = [1,2,3,4,5,3,1], target = 3
输出：2
解释：3 在数组中出现了两次，下标分别为 2 和 5，我们返回最小的下标 2。
```

**示例2**:

```
输入：array = [0,1,2,4,2,1], target = 3
输出：-1
解释：3 在数组中没有出现，返回 -1。
```
:::


::: slot solution

```javascript
/**
 * // This is the MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * function MountainArray() {
 *     @param {number} index
 *     @return {number}
 *     this.get = function(index) {
 *         ...
 *     };
 *
 *     @return {number}
 *     this.length = function() {
 *         ...
 *     };
 * };
 */

/**
 * @param {number} target
 * @param {MountainArray} mountainArr
 * @return {number}
 */
var findInMountainArray = function(target, mountainArr) {
  // 缓存长度
  let right = mountainArr.length() - 1;
  // 二分查找找到山顶i
  function findIIndex() {
    let l = 0, r = right;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      const cur = mountainArr.get(mid);
      const rItem = mountainArr.get(mid + 1);
      if (cur < rItem) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    return l;
  }

  // 单调序列中二分查找target， isReverse为true代表是降序数组
  function search(l, r, isReverse) {
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      const cur = mountainArr.get(mid);
      if (cur === target) return mid;
      if (cur > target) {
        // console.log(isReverse, l, r)
        if (!isReverse) {
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      } else {
        if (!isReverse) {
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
    }
    return -1;
  }

  // 找到山脉顶部
  const i = findIIndex();
  // 尝试在顶部左侧查找目标值
  const idx1 = search(0, i);
  // 存在直接返回，因为不管右侧有没有，左侧一定是索引最小
  if (idx1 > -1) return idx1;
  // 左侧没有，尝试查找右侧
  const idx2 = search(i + 1, right, true);
  // 右侧存在返回
  if (idx2 > -1) return idx2;
  // 都不存在
  return -1;
};
```

:::
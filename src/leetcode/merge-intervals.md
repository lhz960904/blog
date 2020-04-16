---
layout: LeetCodeContent
title: 56. 合并区间
difficulty: 1
leetcodeTags:
  - 数学
  - 链表
---


::: slot desc

给出一个区间的集合，请合并所有重叠的区间。

**示例1**:

```
输入: [[1,3],[2,6],[8,10],[15,18]]
输出: [[1,6],[8,10],[15,18]]
解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
```

**示例2**:

```
输入: [[1,4],[4,5]]
输出: [[1,5]]
解释: 区间 [1,4] 和 [4,5] 可被视为重叠区间。
```
:::


::: slot solution

**1.按照左区间大小升序排列，遍历列表，与结果最后一个区间比较重叠，不重叠直接加入到结果中，重叠进行合并**

```javascript
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  // 集合没有区间直接返回
  if (!intervals.length) return [];
  // 左区间升序排序
  intervals.sort((a, b) => a[0] - b[0]);
  // 结果区间
  const ans = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = ans[ans.length - 1];
    const current = intervals[i];
    // 重叠进行合并
    if (
      (current[0] >= last[0] && current[0] <= last[1]) ||
      (current[1] >= last[0] && current[1] <= last[1]) ||
      (current[0] < last[0] && current[1] > last[1])
    ) {
      const left = last[0];
      const right = Math.max(last[1], current[1]);
      ans[ans.length - 1] = [left, right];
    } else {
      // 不重叠直接push到结果里
      ans.push(current);
    }
  }
  return ans;
};
```

**2.排序+双指针，排序后遍历区间集合，维护右边界right，如果下一个区间的左边界小于right，就代表是重叠**

```javascript
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  // 集合没有区间直接返回
  if (!intervals.length) return [];
  // 左区间升序排序
  intervals.sort((a, b) => a[0] - b[0]);
  // 结果区间
  const ans = [];
  for (let i = 0; i < intervals.length;) {
    let right = intervals[i][1];
    let j = i + 1;
    // 寻找重叠的可能，持续维护t
    while (j < intervals.length && intervals[j][0] <= right) {
      right = Math.max(right, intervals[j][1])
      j++;
    }
    ans.push([intervals[i][0], right]);
    // j是下一个不重叠的区间的位置
    i = j;
  }
  return ans;
};
```
:::
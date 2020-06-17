---
layout: LeetCodeContent
title: 1014. 最佳观光组合
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给定正整数数组 A，A[i] 表示第 i 个观光景点的评分，并且两个景点 i 和 j 之间的距离为 j - i。

一对景点（i < j）组成的观光组合的得分为（A[i] + A[j] + i - j）：景点的评分之和减去它们两者之间的距离。

返回一对观光景点能取得的最高分

**示例1**:

```
输入：[8,1,5,2,6]
输出：11
解释：i = 0, j = 2, A[i] + A[j] + i - j = 8 + 5 + 0 - 2 = 11
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} A
 * @return {number}
 */
var maxScoreSightseeingPair = function(A) {
  // A[i] + A[j] + i - j   --->  (A[i] + i) + (A[j] - j)
  // 遍历数组，针对j的时候，后半部门值不变，所以遍历的同时维护前半部分最大值
  let ans = -1;
  let max = A[0];
  for (let i = 1; i < A.length; i++) {
    // 维护结果
    ans = Math.max(ans, A[i] - [i] + max);
    // 维护A[i] + i最大值
    max = Math.max(max, A[i] + i);
  }
  return ans;
};
```

:::
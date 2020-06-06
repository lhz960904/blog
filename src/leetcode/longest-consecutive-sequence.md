---
layout: LeetCodeContent
title: 128. 最长连续序列
difficulty: 2
leetcodeTags:
  - 并查集
  - 数组
---


::: slot desc

给定一个未排序的整数数组，找出最长连续序列的长度。

要求算法的时间复杂度为 O(n)。

**示例1**:

```
输入: [100, 4, 200, 1, 3, 2]
输出: 4
解释: 最长连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
  const set = new Set(nums);
  let ans = 0;
  for (let num of set) {
    // 如果前一个数存在，那从该数开始累积连续长度一定不是最优解，直接跳过
    if (set.has(num - 1)) continue;

    let currentLen = 1, currentNum = num + 1;
    while (set.has(currentNum)) {
      currentLen++;
      currentNum++;
    }
    ans = Math.max(ans, currentLen);
  }

  return ans;
};
```

:::
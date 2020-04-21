---
layout: LeetCodeContent
title: 1248. 统计「优美子数组」
difficulty: 1
leetcodeTags:
  - 链表
---


::: slot desc

给你一个整数数组 nums 和一个整数 k。

如果某个 连续 子数组中恰好有 k 个奇数数字，我们就认为这个子数组是「优美子数组」。

请返回这个数组中「优美子数组」的数目。

**示例1**:

```
输入：nums = [1,1,2,1,1], k = 3
输出：2
解释：包含 3 个奇数的子数组是 [1,1,2,1] 和 [1,2,1,1] 。
```

**示例2**:

```
输入：nums = [2,2,2,1,2,2,1,2,2,2], k = 2
输出：16
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var numberOfSubarrays = function(nums, k) {
  // 将奇数对应的索引存在数组中
  let idx = 1, arr = [-1];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 !== 0) {
      arr[idx++] = i;
    }
  }
  arr[idx] = nums.length;
  let ans = 0;
  for (let i = 1; i + k < arr.length; i++) {
    // 始终窗口的左侧、右侧都是奇数，可以形成子数组的个数 = 左侧的偶数个数 * 右侧的偶数个数
    // 注：偶数个数是指到达下一次奇数的中间数量
    ans += (arr[i] - arr[i - 1]) * (arr[i + k] - arr[i + k - 1]);
  }
  return ans;
}
```

:::
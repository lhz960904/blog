---
layout: LeetCodeContent
title: 974. 和可被 K 整除的子数组
difficulty: 1
leetcodeTags:
  - 数组
  - 哈希表
---


::: slot desc

给定一个整数数组 A，返回其中元素之和可被 K 整除的（连续、非空）子数组的数目。


**示例**:

```
输入：A = [4,5,0,-2,-3,1], K = 5
输出：7
解释：
有 7 个子数组满足其元素之和可被 K = 5 整除：
[4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]
```
:::


::: slot solution

**前缀和解法, 用哈希表记录i位置的前缀和对K取余，当遍历到j位置， 前缀和取余后跟i位置一样， 说明i~j区间内形成的子数组和可以被整除**

```javascript
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var subarraysDivByK = function(A, K) {
  let ans = 0;
  // 存储前缀和
  const map = new Map([[0, 1]]);
  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    sum += A[i];
    // 负数需要+K找正整数
    let mod = sum % K;
    mod < 0 && (mod += K);
    if (map.has(mod)) {
      ans += map.get(mod);
      map.set(mod, map.get(mod) + 1);
    } else {
      map.set(mod, 1);
    }
  }
  return ans;
};
```

:::
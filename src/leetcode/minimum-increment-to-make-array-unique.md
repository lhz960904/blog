---
layout: LeetCodeContent
title: 945. 使数组唯一的最小增量
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给定整数数组 A，每次 move 操作将会选择任意 A[i]，并将其递增 1。

返回使 A 中的每个值都是唯一的最少操作次数。

**示例1**:

```
输入：[1,2,2]
输出：1
解释：经过一次 move 操作，数组将变为 [1, 2, 3]。
```

**示例2**:

```
输入：[3,2,1,2,1,7]
输出：6
解释：经过 6 次 move 操作，数组将变为 [3, 4, 1, 2, 5, 7]。
可以看出 5 次或 5 次以下的 move 操作是不能让数组的每个值唯一的。
```
:::


::: slot solution

最开始想法是暴力求解，如果元素重复就一直累加1到不重复，但时间复杂度较大。没办法通过。

所以我们可以通过对数组进行排序，然后当出现重复时，使每个元素都比前一个元素大于1就可以了。

```javascript
/**
 * @param {number[]} A
 * @return {number}
 */
var minIncrementForUnique = function(A) {
    // 从小到大排序
    A.sort((a, b) => a - b);
    let result = 0;
    for (let i = 1; i < A.length; i++) {
        // 这里要判断小于等于。例如[1,1,1,3,5] => [1,2,1,3,5]时，第三个元素比第二个元素小
        if (A[i] <= A[i-1]) {
            result += A[i - 1] - A[i] + 1;
            A[i] = A[i - 1] + 1;
        }
    }
    return result;
};
```

:::
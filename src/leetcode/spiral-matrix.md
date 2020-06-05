---
layout: LeetCodeContent
title: 54. 螺旋矩阵
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。

**示例1**:

```
输入:
[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
]
输出: [1,2,3,6,9,8,7,4,5]
```

:::


::: slot solution

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  let m = matrix.length;
  if (!m) return [];
  let n = matrix[0].length;

  let top = 0, bottom = m - 1, left = 0, right = n - 1;
  const ans = [];
  while (true) {
    // 向右移动
    for (let i = left; i <= right; i++) {
      ans.push(matrix[top][i]);
    }
    if (++top > bottom) break;

    // 向下移动
    for (let i = top; i <= bottom; i++) {
      ans.push(matrix[i][right]);
    }
    if (--right < left) break;

    // 向左移动
    for (let i = right; i >= left; i--) {
      ans.push(matrix[bottom][i]);
    }
    if (--bottom < top) break;
    
    // 向上移动
    for (let i = bottom; i >= top; i--) {
      ans.push(matrix[i][left]);
    }
    if (++left > right) break;

  }

  return ans;
};
```

:::
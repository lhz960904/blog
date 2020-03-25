---
layout: LeetCodeContent
title: 892. 三维形体的表面积
difficulty: 0
leetcodeTags:
  - 几何
  - 数学
---


::: slot desc

在 N * N 的网格上，我们放置一些 1 * 1 * 1  的立方体。

每个值 v = grid[i][j] 表示 v 个正方体叠放在对应单元格 (i, j) 上。

请你返回最终形体的表面积。

**示例1**:

```
输入：[[2]]
输出：10
```

**示例2**:

```
输入：[[1,2],[3,4]]
输出：34
```

**示例3**:

```
输入：[[1,0],[0,2]]
输出：16
```

**示例4**:

```
输入：[[1,1,1],[1,0,1],[1,1,1]]
输出：32
```

**示例5**:

```
输入：[[2,2,2],[2,1,2],[2,2,2]]
输出：46
```
:::


::: slot solution

- 对于顶面和底面的表面积，如果 v > 0，那么顶面和底面各贡献了 1 的表面积，总计 2 的表面积

- 对于四个侧面的表面积，只有在相邻位置的高度小于 v 时，对应的那个侧面才会贡献表面积。

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var surfaceArea = function(grid) {
  const len = grid.length;
  let ans = 0;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      const current = grid[i][j];
      if (current > 0) {
        // 上下俩个面
        ans += 2; 
        // top
        const top = i > 0 ? grid[i - 1][j] : 0
        ans += Math.max((current - top), 0);
        // bottom
        const bottom = (i < len - 1) ? grid[i + 1][j] : 0
        ans += Math.max((current - bottom), 0);
        // left
        const left = j > 0 ? grid[i][j - 1] : 0
        ans += Math.max((current - left), 0);
        // right
        const right = (j < len - 1) ? grid[i][j + 1] : 0
        ans += Math.max((current - right), 0);
      }
    }
  }
  return ans;
};
```

:::
---
layout: LeetCodeContent
title: 1162. 地图分析
difficulty: 1
leetcodeTags:
  - 广度优先搜索
  - 图
---


::: slot desc

你现在手里有一份大小为 N x N 的『地图』（网格） grid，上面的每个『区域』（单元格）都用 0 和 1 标记好了。其中 0 代表海洋，1 代表陆地，你知道距离陆地区域最远的海洋区域是是哪一个吗？请返回该海洋区域到离它最近的陆地区域的距离。

我们这里说的距离是『曼哈顿距离』（ Manhattan Distance）：(x0, y0) 和 (x1, y1) 这两个区域之间的距离是 |x0 - x1| + |y0 - y1| 。

如果我们的地图上只有陆地或者海洋，请返回 -1。

[题目详情](https://leetcode-cn.com/problems/as-far-from-land-as-possible/)

:::


::: slot solution

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxDistance = function(grid) {
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  // 所有触及到的区域，为空时代表地图广度搜索结束。
  const queue = [];

  // 先找到所有的陆地
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === 1) {
        queue.push([i, j]);
      }
    }
  }

  // 标志位：是否有海洋
  let hasOcean = false;
  // 存放最后一次搜索到区域， 如果存在海洋，那最后一次搜索到的区域就是最远海洋区域
  let lastPoint = [];
  // 以陆地为源开始广度搜索
  while (queue.length) {
    lastPoint = queue.shift();
  
    // 向四个方向搜索
    for (let i = 0; i < 4; i++) {
      let x = lastPoint[0] + dx[i];
      let y = lastPoint[1] + dy[i];
      // 超出边界，或者当前区域被访问(大于0时)过直接终止
      if (x < 0 || y < 0 || x >= grid.length || y >= grid.length || grid[x][y] > 0) {
        continue;
      }
      hasOcean = true;
      // 改变该区域的值，代表被访问过，以及存储距离；
      grid[x][y] = grid[lastPoint[0]][lastPoint[1]] + 1;
      queue.push([x, y]);
    }
  }
  // 不存在海洋直接返回-1，有俩种情况 1.全是海洋，没有进行搜索。 2.全是陆地，没有海洋。
  if (!hasOcean) {
    return -1;
  }
  // 这里要减去1 是因为我们是从陆地开始搜索，陆地初始值是1
  return grid[lastPoint[0]][lastPoint[1]] - 1;

};
```

:::
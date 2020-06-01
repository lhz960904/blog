---
layout: LeetCodeContent
title: 542. 零一矩阵
difficulty: 1
leetcodeTags:
  - 广度优先搜索
---


::: slot desc

给定一个由 0 和 1 组成的矩阵，找出每个元素到最近的 0 的距离。

两个相邻元素间的距离为 1 

**示例1**:

```
输入：
0 0 0
0 1 0
0 0 0
输出：
0 0 0
0 1 0
0 0 0
```

**示例2**:

```
输入：
0 0 0
0 1 0
1 1 1
输出：
0 0 0
0 1 0
1 2 1
```
:::


::: slot solution

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var updateMatrix = function(matrix) {
  const dx = [0, 0, -1, 1];
  const dy = [-1, 1, 0, 0];
  const row = matrix.length;
  const col = row ? matrix[0].length : 0;
  const ans = Array.from({length: row},() => []);
  const queue = [];
  // 找到所有的0，然后去广度遍历，修改周围的值
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (matrix[i][j] === 0) {
        ans[i][j] = 0;
        queue.push(`${i},${j},0`)
      }
    }
  }
  while (queue.length) {
    const [x, y, d] = queue.shift().split(',');
    for (let i = 0; i < 4; i++) {
      const m = +x + dx[i];
      const n = +y + dy[i];
      const nextD = +d + 1;
      const key = `${m},${n},${nextD}`
      // console.log(m, n, ans, nextD)
      // 越界情况
      if (m < 0 || n < 0 || m >= row || n >= col) continue;
      // 跟d + 1比较，如果小于，则不添加queue中，大于说明不是最近距离，需要放到queue中重新计算。
      // console.log(m, n,  ans[m][n], nextD)
      if (matrix[m][n] === 0) continue;
      if (ans[m][n] == undefined || ans[m][n] > nextD) {
        ans[m][n] = nextD;
        queue.push(key);
      }
    }
  }
  return ans;
};
```

:::
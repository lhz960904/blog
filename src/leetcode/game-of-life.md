---
layout: LeetCodeContent
title: 289. 生命游戏
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给定一个包含 m × n 个格子的面板，每一个格子都可以看成是一个细胞。每个细胞都具有一个初始状态：1 即为活细胞（live），或 0 即为死细胞（dead）。每个细胞与其八个相邻位置（水平，垂直，对角线）的细胞都遵循以下四条生存定律：

1. 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡；
2. 如果活细胞周围八个位置有两个或三个活细胞，则该位置活细胞仍然存活；
3. 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡；
4. 如果死细胞周围正好有三个活细胞，则该位置死细胞复活；

根据当前状态，写一个函数来计算面板上所有细胞的下一个（一次更新后的）状态。下一个状态是通过将上述规则同时应用于当前状态下的每个细胞所形成的，其中细胞的出生和死亡是同时发生的。

**示例**:

```
输入： 
[
  [0,1,0],
  [0,0,1],
  [1,1,1],
  [0,0,0]
]
输出：
[
  [0,0,0],
  [1,0,1],
  [0,1,1],
  [0,1,0]
]
```
:::


::: slot solution

## 方法1

暴力解法，找到每个元素的周围8个元素，按照活/死计数，然后根据规则进行填充。此题需要改变原数，所以利用map存储之前状态。

```javascript
/**
 * @param {number[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var gameOfLife = function(board) {
  // 定义方向
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  // 定义原来的值map
  const map = {}
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let liveCount = 0;
      let deadCount = 0;
      // 获取周围8个元素的信息
      for (let z = 0; z < 8; z++) {
        const x = i + dx[z];
        const y = j + dy[z];
        if (x < 0 || y < 0 || x >= board.length || y >= board[i].length) {
          continue;
        }
        // 试图从map拿到开始状态，不存在代表还没有被改变过。
        const status =  map[`${x},${y}`] === undefined ? board[x][y] : map[`${x},${y}`];
        if (status === 0) {
          deadCount++
        } else {
          liveCount++;
        }
      }
      // 存储之前位置对应的状态
      map[`${i},${j}`] = board[i][j];
      // 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡
      if (board[i][j] === 1 && liveCount < 2) {
        board[i][j] = 0;
        continue;
      }
      // 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡
      if (board[i][j] === 1 && liveCount > 3) {
        board[i][j] = 0;
        continue;
      }
      // 如果死细胞周围正好有三个活细胞，则该位置死细胞复活
      if (board[i][j] === 0 && liveCount === 3) {
        board[i][j] = 1;
        continue;
      }
    }
  }
};
```

## 方法2

解答进阶，方法一map需要占用内存，我们可以通过复合状态，来更新原数组。从复合状态知道当前的状态以及之前的状态。

```javascript
var gameOfLife = function(board) {
  // 定义方向
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let liveCount = 0;
      let deadCount = 0;
      // 获取周围8个元素的信息
      for (let z = 0; z < 8; z++) {
        const x = i + dx[z];
        const y = j + dy[z];
        if (x < 0 || y < 0 || x >= board.length || y >= board[i].length) {
          continue;
        }
        // 2代表从死到活， -1代表从活到死
        if (board[x][y] === 0 || board[x][y] === 2) {
          deadCount++
        } 
        if (board[x][y] === 1 || board[x][y] === -1) {
          liveCount++;
        } 
      }
      // 定义复合状态 -1 代表 从 活到死， 2代表从死到活
      // 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡
      if (board[i][j] === 1 && liveCount < 2) {
        board[i][j] = -1;
        continue;
      }
      // 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡
      if (board[i][j] === 1 && liveCount > 3) {
        board[i][j] = -1;
        continue;
      }
      // 如果死细胞周围正好有三个活细胞，则该位置死细胞复活
      if (board[i][j] === 0 && liveCount === 3) {
        board[i][j] = 2;
        continue;
      }
    }
  }
  // 需要将复合状态改回来
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === -1) {
        board[i][j] = 0;
      }
      if (board[i][j] === 2) {
        board[i][j] = 1;
      }
    }
  }
};
```

:::
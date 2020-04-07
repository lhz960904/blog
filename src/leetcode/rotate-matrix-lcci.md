---
layout: LeetCodeContent
title: 面试题 01-07.旋转矩阵
difficulty: 1
leetcodeTags:
  - 数组
---


::: slot desc

给你一幅由 N × N 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。

不占用额外内存空间能否做到？

**示例1**:

```
给定 matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

原地旋转输入矩阵，使其变为:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
```

**示例2**:

```
给定 matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 

原地旋转输入矩阵，使其变为:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]

```
:::


::: slot solution

## 占用额外内存空间旋转

找规律，每一行都是x在变化，y没有变。 x是根据遍历到行内第几个所得。循环遍历一步步更改值，更改之前map缓存之前的值。

```
// row1 [2, 0] [1, 0] [0, 0]
// row2 [2, 1] [1, 1] [0, 1]
// row3 [2, 2] [1, 2] [0, 2]


// row1 [3, 0] [2, 0] [1, 0] [0, 0]
// row2 [3, 1] [2, 1] [1, 1] [0, 1]
// row3 [3, 2] [2, 2] [1, 2] [0, 2]
// row4 [3, 3] [2, 3] [1, 3] [0, 3]

```

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  const map = {}; // 占用额外的空间
  const N =  matrix.length;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      map[`${i}-${j}`] = matrix[i][j];
      const y = i;
      const x = N - 1 - j;
      matrix[i][j] = map[`${x}-${y}`] === undefined ?  matrix[x][y] : map[`${x}-${y}`] ;
    }
  }
};
```

## 不占用额外内存旋转

```javascript
var rotate = function(matrix) {
  const N = matrix.length;
  // 1.对角线交换
  for (let i = 0; i < N - 1; i++) {
    for (let j = i + 1; j < N; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp;
    }
  }
  console.log(matrix);

  // 2.每一行再进行对折交换
  const mid = Math.floor(N / 2);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < mid; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[i][N - 1 - j];
      matrix[i][N - 1 - j] = tmp;
    }
  }
};
```

:::
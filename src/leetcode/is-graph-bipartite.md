---
layout: LeetCodeContent
title: 785. 判断二分图
difficulty: 1
leetcodeTags:
  - 深度优先遍历
---


::: slot desc

给定一个无向图graph，当这个图为二分图时返回true。

如果我们能将一个图的节点集合分割成两个独立的子集A和B，并使图中的每一条边的两个节点一个来自A集合，一个来自B集合，我们就将这个图称为二分图。

graph将会以邻接表方式给出，graph[i]表示图中与节点i相连的所有节点。每个节点都是一个在0到graph.length-1之间的整数。这图中没有自环和平行边： graph[i] 中不存在i，并且graph[i]中没有重复的值。

**示例1**:

```
示例 1:
输入: [[1,3], [0,2], [1,3], [0,2]]
输出: true
解释: 
无向图如下:
0----1
|    |
|    |
3----2
我们可以将节点分成两组: {0, 2} 和 {1, 3}。
```
:::


::: slot solution

**将相同的俩点染成不同颜色，染色的过程中出现矛盾（一个点已有颜色且与要染的色不同）时，证明不是二分图**


```javascript
/**
 * @param {number[][]} graph
 * @return {boolean}
 */
var isBipartite = function(graph) {
  const COLOR_ENUM = {
    NONE: 0,
    RED: 1,
    BLUE: 2
  }
  const n = graph.length;
  const colors = new Array(n).fill(COLOR_ENUM.NONE);
  let isValid = true;

  for (let i = 0; i < n && isValid; i++) {
    if (colors[i] == COLOR_ENUM.NONE) {
        dfs(i, COLOR_ENUM.RED,);
    }
  }

  return isValid;


  function dfs(c, color) {
    colors[c] = color;
    const nextColor = color === COLOR_ENUM.RED ? COLOR_ENUM.BLUE : COLOR_ENUM.RED;
    const arr = graph[c];
    for (let i = 0; i < arr.length; i++) {
      const idx = arr[i];
      if (colors[idx] === COLOR_ENUM.NONE) {
        dfs(idx, nextColor);
        if (!isValid) return;
      } else if (colors[idx] !== nextColor) {
        isValid = false;
        return;
      }
    }
  }
};
```

:::
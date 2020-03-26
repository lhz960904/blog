---
layout: LeetCodeContent
title: 999. 车的可用捕获量
difficulty: 0
leetcodeTags:
  - 数组
---


::: slot desc

在一个 8 x 8 的棋盘上，有一个白色车（rook）。也可能有空方块，白色的象（bishop）和黑色的卒（pawn）。它们分别以字符 “R”，“.”，“B” 和 “p” 给出。大写字符表示白棋，小写字符表示黑棋。

车按国际象棋中的规则移动：它选择四个基本方向中的一个（北，东，西和南），然后朝那个方向移动，直到它选择停止、到达棋盘的边缘或移动到同一方格来捕获该方格上颜色相反的卒。另外，车不能与其他友方（白色）象进入同一个方格。

返回车能够在一次移动中捕获到的卒的数量。

[题目详情](https://leetcode-cn.com/problems/available-captures-for-rook/)

:::

::: slot solution

```javascript
/**
 * @param {character[][]} board
 * @return {number}
 */
var numRookCaptures = function(board) {
  // 定义方向
  const dx = [-1, 1, 0, 0];
  const dy = [0, 0, 1, -1]


  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] !== 'R') continue;
      // 找到R
      let ans = 0;
      // 四个方向依次去走，找到B或p停止，先遇到p结果+1
      for (let k = 0; k < 4; k++) {
        let x = i, y = j;
        while (true) {
          x += dx[k];
          y += dy[k];
          if (x < 0 || x > 7 || y < 0 || y > 7 || board[x][y] === 'B') {
            break;
          }
          if (board[x][y] === 'p') {
            ans += 1;
            break;
          }
        }
      } 
      return ans;
    }
  }
};
```

:::
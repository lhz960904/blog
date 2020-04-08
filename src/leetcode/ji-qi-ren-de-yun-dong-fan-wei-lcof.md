---
layout: LeetCodeContent
title: 面试题13. 机器人的运动范围
difficulty: 1
leetcodeTags:
  - 广度优先搜索
---


::: slot desc

地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问该机器人能够到达多少个格子？

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

**示例1**:

```
输入：m = 2, n = 3, k = 1
输出：3
```

**示例2**:

```
输入：m = 3, n = 1, k = 0
输出：1
```
:::


::: slot solution

## 方法1

广度优先遍历，从0-0点出发，把右下方向的都走一遍，符合条件的插入到入队，当队列为空，代表所有情况都统计完毕

```javascript
var movingCount = function(m, n, k) {
  // 存储走过的格子，防止重新走一遍
  const set = new Set([`0-0`]);
  // 存储要走的符合规则的单元格
  const queue = [`0-0`];
  // 结果 queue里存的都是符合条件的。出列的时候+1即可
  let ans = 1;
  while (queue.length) {
    const current = queue.shift();
    // 走过的格子
    const [i, j] = current.split('-');
    for (let z = 0; z < 2; z++) {
      const x = +i + dx[z];
      const y = +j + dy[z];
      // 计算个位置之和，大于k不能添加到队列中，走过不能添加，超出范围不能添加
      const key = `${x}-${y}`
      // 防止重复
      if (x >= 0 && x < m && y >= 0 && y < n && !set.has(key) && calcTotal(x, y) <= k) {
        queue.push(key);
        ans++;
      }
      set.add(key);
    }
  }

  return ans;
};
// 计算位数之和
function calcTotal(x, y) {
  let res = 0;
  while (x) {
    res += x % 10;
    x = Math.floor(x / 10);
    
  }
  while (y) {
    res += y % 10;
    y = Math.floor(y / 10);
  }
  return res
}
```

## 方法2

因为每个单元格都是向下、向右走。所以可以通过递推来算出当前单元格是否满足要求。
  1. 首先数位和必须小于k
  2. 其次 左、上其中一个是满足要求的（这样才可以到达当前单元格）


```javascript
/**
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var movingCount = function(m, n, k) {
  // 定义方向
  const dx = [0, 1];
  const dy = [1, 0];
  // 定义二位数组
  const visit = [[1]];
  let ans = 1;
  for (let i = 0; i < m; i++) {
    visit[i] = visit[i] || [];
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      if (calcTotal(i, j) > k) continue;
      // 左、上递推
      if (j - 1 >= 0) {
        visit[i][j] = visit[i][j - 1] === 1 ? 1 : visit[i][j];
      }
      if (i - 1 >= 0) {
        visit[i][j] = visit[i - 1][j] === 1 ? 1 : visit[i][j];
      }
      visit[i][j] && ans++;
    }
  }

  return ans;
};

function calcTotal(x, y) {
  let res = 0;
  while (x) {
    res += x % 10;
    x = Math.floor(x / 10);
    
  }
  while (y) {
    res += y % 10;
    y = Math.floor(y / 10);
  }
  return res
}
```
:::
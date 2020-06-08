---
layout: LeetCodeContent
title: 990. 等式方程的可满足性
difficulty: 1
leetcodeTags:
  - 并查集
---


::: slot desc

给定一个由表示变量之间关系的字符串方程组成的数组，每个字符串方程 equations[i] 的长度为 4，并采用两种不同的形式之一："a==b" 或 "a!=b"。在这里，a 和 b 是小写字母（不一定不同），表示单字母变量名。

只有当可以将整数分配给变量名，以便满足所有给定的方程时才返回 true，否则返回 false。 

**示例1**:

```
输入：["a==b","b!=a"]
输出：false
解释：如果我们指定，a = 1 且 b = 1，那么可以满足第一个方程，但无法满足第二个方程。没有办法分配变量同时满足这两个方程。
```

**示例2**:

```
输出：["b==a","a==b"]
输入：true
解释：我们可以指定 a = 1 且 b = 1 以满足满足这两个方程。
```
:::


::: slot solution

```javascript
/**
 * @param {string[]} equations
 * @return {boolean}
 */
var equationsPossible = function(equations) {
  const unionFind = new UnionFind(26);
  for (let i = 0; i < equations.length; i++) {
    if (equations[i][1] === '=') {
      const idx1 = equations[i][0].charCodeAt() - 97;
      const idx2 = equations[i][3].charCodeAt() - 97;
      unionFind.union(idx1, idx2);
    }
  }
  for (let i = 0; i < equations.length; i++) {
    if (equations[i][1] === '!') {
      const idx1 = equations[i][0].charCodeAt() - 97;
      const idx2 = equations[i][3].charCodeAt() - 97;
      // 已经连接，说明是相等的。等式不成立
      if (unionFind.isConnected(idx1, idx2)) {
        return false;
      }
    }
  }
  return true;
};

// 并查集类
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  // 查找根节点
  _find(idx) {
    while (idx !== this.parent[idx]) {
      // 隔代压缩
      this.parent[idx] = this.parent[this.parent[idx]]
      idx = this.parent[idx];
    }
    return idx
  }

  // 连接
  union(x, y) {
    x = this._find(x);
    y = this._find(y);
    this.parent[x] = y;
  }

  // 检查是否已经连接
  isConnected(x, y) {
    return this._find(x) === this._find(y);
  }
}
```

:::
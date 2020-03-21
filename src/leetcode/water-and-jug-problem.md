---
layout: LeetCodeContent
title: 365. 水壶问题
difficulty: 1
leetcodeTags:
  - 数学
---


::: slot desc

有两个容量分别为 x升 和 y升 的水壶以及无限多的水。请判断能否通过使用这两个水壶，从而可以得到恰好 z升 的水？

如果可以，最后请用以上水壶中的一或两个来盛放取得的 z升 水。

你允许：
- 装满任意一个水壶
- 清空任意一个水壶
- 从一个水壶向另外一个水壶倒水，直到装满或者倒空

**示例1**:

```
输入: x = 3, y = 5, z = 4
输出: True
```

**示例2**:

```
输入: x = 2, y = 6, z = 5
输出: False
```
:::


::: slot solution

## 方法一
每次总共有6种不同的操作，维护所有可能发生的情况，对情况进行以上6中不同的操作。直到找到符合结果的。当所有情况都不可以，就返回false
```javascript
var canMeasureWater = function (x, y, z) {
  const stack = ['0,0'];
  // 缓存杯中剩余情况
  const set = new Set();
  while (stack.length) {
    const remains =  stack.pop();
    // 不要重复进行一种情况的后续操作，会死循环
    if (set.has(remains)) {
      continue;
    }
    const [remainX, remainY] = remains.split(',');
    // 满足条件
    if (
      +remainX === z || 
      +remainY === z || 
      (+remainX + +remainY) === z
    ) {
      return true;
    }
    set.add(remains);
    // 1. X水壶清空
    stack.push(`0,${remainY}`);
    // 2. Y水壶清空
    stack.push(`${remainX},0`);
    // 3. X水壶装满
    stack.push(`${x},${remainY}`);
    // 4. Y水壶装满
    stack.push(`${remainX},${y}`);
    // 5. X水壶向Y水壶倒水
    const l1 = Math.min(+remainX, y - remainY);
    stack.push(`${+remainX - l1},${+remainY + l1}`);
    // 6. Y水壶向X水壶倒水
    const l2 = Math.min(+remainY, x - remainX);
    stack.push(`${+remainX + l2},${+remainY - l2}`);
  }
  return false;
};
```

## 方法二
每次操作后只可能出现增加减少想x或y，找出最大公约数，可以被结果整除就可以。
```javascript
var canMeasureWater = function(x, y, z) {
  // 计算最小公约数
  function gcd(a, b) {
    if (a === b) return a;
    if (a > b) {
      a -= b;
    } else {
      b -= a;
    }
    return gcd(a, b);
  }
  if (x + y < z) {
    return false;
  }
  if (x === 0 || y === 0) {
    return z === x || z === y;
  }
  return z % gcd(x, y)  === 0;
};
```

## 参考

- [leetcode官方题解](https://leetcode-cn.com/problems/water-and-jug-problem/solution/shui-hu-wen-ti-by-leetcode-solution/)

:::
---
layout: LeetCodeContent
title: 914. 卡牌分组
difficulty: 0
leetcodeTags:
  - 数组
  - 数学
---


::: slot desc

给定一副牌，每张牌上都写着一个整数。

此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：

每组都有 X 张牌。
组内所有的牌上都写着相同的整数。
仅当你可选的 X >= 2 时返回 true。

**示例1**:

```
输入：[1,2,3,4,4,3,2,1]
输出：true
解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]
```

**示例2**:

```
输入：[1,1,1,2,2,2,3,3]
输出：false
解释：没有满足要求的分组。
```

**示例3**:

```
输入：[1]
输出：false
解释：没有满足要求的分组。
```

**示例4**:

```
输入：[1,1]
输出：true
解释：可行的分组是 [1,1]
```
:::


::: slot solution

```javascript
/**
 * @param {number[]} deck
 * @return {boolean}
 */
var hasGroupsSizeX = function(deck) {
  // 拿到每张牌出现的次数
  const map = deck.reduce((a, c) => {
    a[c] = a[c] ? a[c] + 1 : 1;
    return a;
  }, {})
  // 最大公约数
  let count = -1;
  Object.keys(map).forEach((k) => {
    if (count === -1) {
      count = map[k];
    } else {
      count = gcd(count, map[k]);
    }
  })
  return count >= 2;
};
// 求出俩个值的最大公约数
function gcd(a, b) {
  return a % b === 0 ? b : gcd(b, a % b);
}
```

:::
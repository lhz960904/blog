---
layout: LeetCodeContent
title: 202. 快乐数
difficulty: 0
leetcodeTags:
  - 哈希表
---


::: slot desc

编写一个算法来判断一个数 n 是不是快乐数。

「快乐数」定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。如果 可以变为  1，那么这个数就是快乐数。

如果 n 是快乐数就返回 True ；不是，则返回 False 。

**示例1**:

```
输入：19
输出：true
解释：
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
```
:::


::: slot solution


**1. 用set存储得到的值，一直循环到等于1，或者set中已经存在过(进入死循环)**

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
  const set = new Set([n]);
  let count = n;
  while (count !== 1) {
    const arr = String(count).split('');
    count = arr.reduce((a, c) => a + Math.pow(c, 2), 0);
    if (set.has(count)) return false;
    set.add(count);
  }
  return true;
};
```

**2. 快慢指针**

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
  const getNext = function(count) {
    const arr = String(count).split('');
    return arr.reduce((a, c) => a + Math.pow(c, 2), 0);
  }
  // 快慢指针
  let slow = n;
  let fast = getNext(n);
  // 快指针到达1，或者快指针进入循环追上慢指针
  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }
  return fast === 1;
};
```

:::
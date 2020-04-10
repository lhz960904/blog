---
layout: LeetCodeContent
title: 167. 两数之和 II - 输入有序数组
difficulty: 0
leetcodeTags:
  - 数组
  - 双指针
  - 二分查找法
---


::: slot desc

给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。

函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。

说明:

- 返回的下标值（index1 和 index2）不是从零开始的。
- 你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。


**示例**:

```
输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
```
:::


::: slot solution

## 普通解法

设置map存储之前遍历的值，当差值存在map中就找到对应的俩个索引。跟[第2题](/leetcode/two-sum.html)一样的代码。只不过索引需要 +1;


## 二分查找法

遍历当前元素，在元素后面升序数组中通过二分查找法找差值，找到就返回答案

```javascript
// 二分查找法
var search = function(numbers, target, l, r) {
  if (l > r) {
    return -1;
  }
  const mid = Math.floor((l + r) / 2);
  if (numbers[mid] === target) {
    return mid;
  }
  if (numbers[mid] > target) {
    return search(numbers, target, l, mid - 1);
  } else {
    return search(numbers, target, mid + 1, r);
  }
}

var twoSum = function(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    const idx = search(numbers, target - numbers[i], i + 1, numbers.length - 1);
    if (idx > -1) {
      return [i + 1, idx + 1]
    }
  }
}
```

## 双指针

俩个指针往中间移动，当俩个指针位置对应的值得和大于target，我们就需要值小一点，所以右侧的指针移动一下，反之亦然。

```javascript
var twoSum = function(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) {
      return [l + 1, r + 1];
    }
    if (sum > target) {
      r--;
    } else {
      l++;
    }
  }
};
```

:::
---
layout: LeetCodeContent
title: 84. 柱状图中最大的矩形
difficulty: 2
leetcodeTags:
  - 栈
  - 分治
---


::: slot desc

给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

[题目详情](https://leetcode-cn.com/problems/largest-rectangle-in-histogram/)

:::


::: slot solution

## 方法1

暴力求解，勾勒出来的面积总是收最小的柱子影响，所以遍历数组，把每个元素都当做最小的，然后像俩层遍历，遍历到比它小停止。O(n3)

```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
  let ans = 0;
  for (let i = 0; i < heights.length; i++) {
    let count = 1;
    // 向左
    for (let l = i - 1; l >= 0; l--) {
      if (heights[i] > heights[l]) {
        break;
      }
      count++;
    }
    // 向右
    for (let r = i + 1; r < heights.length; r++) {
      if (heights[i] > heights[r]) {
        break;
      }
      count++;
    }
    ans = Math.max(ans, count * heights[i])
  }

  return ans;
};
```


### 方法2

优化暴力求解，双层循环找到区间最小值，这个最小值可以实时维护，不需要在区间内再次找。O(n2)

```javascript
var largestRectangleArea = function(heights) {
  let ans = 0;
  for (let i = 0; i < heights.length; i++) {
    let minHeight = Number.MAX_VALUE;
    for (let j = i; j < heights.length; j++) {
      minHeight = Math.min(minHeight, heights[j]);
      ans = Math.max(ans, minHeight * (j - i + 1));
    }
  }
  return ans
};

```

### 方法3👍

分治算法，最大面积可能情况：
 1. 找到数组中最小的高度，然后尽可能俩边延伸
 2. 最小的高度左侧(子问题)
 3. 最小的高度右侧(子问题)

```javascript
var largestRectangleArea = function(heights) {
  var calcArea = (l, r) => {
    // 递归终止条件
    if (l > r) {
      return 0;
    }
    // 找到最小值
    let minIdx = l;
    for (let i = l + 1; i <= r; i++) {
      if (heights[i] < heights[minIdx]) {
        minIdx = i;
      }
    }
    // 三种情况中的最大值
    return Math.max(
      heights[minIdx] * (r - l + 1),
      calcArea(l, minIdx - 1),
      calcArea(minIdx + 1, r)
    )
  }
  return calcArea(0, heights.length - 1);
};

```
### 方法4👍👏

始终维持递增栈，当碰到比栈顶还要小的元素，依次出栈，直到栈顶元素小于当前元素。 出栈的这些元素依次以自身为左侧，计算面积(很明显，越靠左的高度越小，所造成的宽度也越大)

```javascript
var largestRectangleArea = function(heights) {
  // 哨兵技巧，前后添加俩个最小高度值，使得真正的柱子都遍历完毕。
  heights = [0, ...heights, 0];
  // 递增栈
  const stack = [];
  // 最大面积
  let ans = 0;
  for (let i = 0; i < heights.length; i++) {
    // 依次找到比当前元素高度都小的，计算面积。
    while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
      const mid = stack.pop();
      ans = Math.max(ans, heights[mid] * (i - stack[stack.length - 1] - 1));
    }
    stack.push(i);
  }
  return ans;
};
```

:::
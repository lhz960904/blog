---
layout: LeetCodeContent
title: 42. 接雨水
difficulty: 2
leetcodeTags:
  - 双指针
  - 栈
---


::: slot desc

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

[题目详情](https://leetcode-cn.com/problems/trapping-rain-water/)

**示例**:

```
输入: [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6
```
:::


::: slot solution

## 方法1

暴力解法，找到左右侧最高的柱子，且必须必当前柱子高。 才会接到雨水，雨水量等于俩边较短的柱子 - 当前柱子高度。

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let ans = 0;
  for (let i = 1; i < height.length - 1; i++) {
    let left = 0, right = 0;
    for (let l = i - 1; l >= 0; l--) {
      left = Math.max(left, height[l]);
    }
    for (let r = i + 1; r < height.length; r++) {
      right = Math.max(right, height[r]);
    }
    const h = Math.min(left, right);
    if (h > height[i]) {
      ans += Math.abs(h - height[i]);
    }
  }
  return ans;
};
```

## 方法2

使用栈求解，如果当前柱子低于栈顶元素，入栈， 如果高于栈顶元素，说明栈顶元素的上一个柱子和当前柱子会形成凹处，可以节水。

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  const stack = [];
  let ans = 0;
  for (let i = 0; i < height.length; i++) {
    // 要继续比较栈顶元素，直到找不到凹处或栈为空
    while (stack.length > 1 && height[i] > height[stack[stack.length - 1]]) {
      console.log(stack)
      // 栈顶较短a出栈
      const mid = stack.pop();
      // 计算左侧到右侧中间的距离
      const dis = i - stack[stack.length - 1] - 1;
      // 计算左右俩侧高度差
      const h = Math.min(height[i], height[stack[stack.length - 1]]);
      // 最短的边都比中间的高，才可以接水
      if (h > height[mid]) {
        ans += dis * (h - height[mid]);
      }
      console.log(mid, dis, h, ans)
      // console.log(ans);
    }
    // 入栈
    stack.push(i);
  }
  return ans;
};
```

## 方法3👍

双指针，每次接水的量都受最端的一侧影响，俩边同时向中间遍历，始终位置leftMax, rightMax, 如果哪侧较短，就走哪一侧，跟max作比较，高于则更新，低于就代表可以接水。

```javascript
var trap = function(height) {
  let left = 0, right = height.length -1;
  let leftMax = 0; rightMax = 0;
  let ans = 0;
  while (left <= right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(height[left], leftMax);
      ans += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(height[right], rightMax);
      ans += rightMax - height[right];
      right--;
    }
  }
  return ans;
};
```

:::
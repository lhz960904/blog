---
layout: LeetCodeContent
title: 11. 盛最多水的容器
difficulty: 1
leetcodeTags:
  - 数组
  - 双指针
---


::: slot desc

给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0)。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

**说明**：你不能倾斜容器，且 n 的值至少为 2。

**示例**:

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
```

[题目地址]()
:::


::: slot solution

双指针方法，优先考虑宽度，持续缩小宽度，移动较短的一侧的指针。

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
  let i = 0, j = height.length - 1;
  let ans = 0;
  while (i < j) {
    const width = j - i;
    const h = Math.min(height[i], height[j]);
    ans = Math.max(ans, width * h);
    height[i] > height[j] ? j-- : i++;
  }
  return ans;
};
```

:::
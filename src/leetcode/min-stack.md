---
layout: LeetCodeContent
title: 155. 最小栈
difficulty: 0
leetcodeTags:
  - 栈
---


::: slot desc

设计一个支持 push ，pop ，top 操作，并能在**常数时间**内检索到最小元素的栈。

- push(x) —— 将元素 x 推入栈中。
- pop() —— 删除栈顶的元素。
- top() —— 获取栈顶元素。
- getMin() —— 检索栈中的最小元素。

[题目详情](https://leetcode-cn.com/problems/min-stack/)
:::


::: slot solution

**每次入栈，除当前元素外，带上当前最小值，最小值取当前元素和栈顶元素的最小值。这样栈顶元素携带的最小值就是当前栈的最小值。**

```javascript
/**
 * initialize your data structure here.
 */
var MinStack = function() {
  this.data = [];
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
  // 栈不存在元素，最小值就是元素本身
  const lastMin = this.data.length 
    ? this.data[this.data.length - 1][1]
    : Number.MAX_SAFE_INTEGER;
  this.data.push([x, Math.min(x, lastMin)])
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  const current = this.data.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  return this.data[this.data.length - 1][0];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
  return this.data[this.data.length - 1][1];
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```

:::
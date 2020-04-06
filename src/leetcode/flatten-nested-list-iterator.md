---
layout: LeetCodeContent
title: 341. 扁平化嵌套列表迭代器
difficulty: 1
leetcodeTags:
  - 栈
  - 数组
---


::: slot desc

给你一个嵌套的整型列表。请你设计一个迭代器，使其能够遍历这个整型列表中的所有整数。

列表中的每一项或者为一个整数，或者是另一个列表。其中列表的元素也可能是整数或是其他列表。

**示例1**:

```
输入: [[1,1],2,[1,1]]
输出: [1,1,2,1,1]
解释: 通过重复调用 next 直到 hasNext 返回 false，next 返回的元素的顺序应该是: [1,1,2,1,1]。
```

**示例2**:

```
输入: [1,[4,[6]]]
输出: [1,4,6]
解释: 通过重复调用 next 直到 hasNext 返回 false，next 返回的元素的顺序应该是: [1,4,6]。
```

[题目详情](https://leetcode-cn.com/problems/flatten-nested-list-iterator/)

:::


::: slot solution

注意审题，不是普通的数组，数组中每个元素都是对象，需要调用它提供的方法才可以。 根据题意，可以暴力的在初始时拍平数组。但每次next都会队首删除，性能不好。所以可以利用栈来实现，反向的入栈，始终保持栈顶元素为Interger，因为每次调用next都会先调用 hasNext, 所以在该函数中做拍平操作。

```javascript
/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function(nestedList) {
  this.stack = [];
  // 反向依次入栈
  for (let i = nestedList.length - 1; i >= 0; i--) {
    this.stack.push(nestedList[i]);
  }
};

/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function() {
  while (this.stack.length && !this.stack[this.stack.length - 1].isInteger()) {
    // 再次反向压入栈
    const list = this.stack.pop().getList();
    for (let i = list.length - 1; i >= 0; i--) {
      this.stack.push(list[i])
    }
  }
  return this.stack.length > 0;
};

/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function() {
  // 经过hasNext处理，栈顶一定是Interger
  return this.stack.pop().getInteger();
};
```

:::
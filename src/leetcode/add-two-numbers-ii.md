---
layout: LeetCodeContent
title: 445. 两数相加 II
difficulty: 1
leetcodeTags:
  - 链表
---


::: slot desc

给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

**示例**:

```
输入：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 8 -> 0 -> 7
```
:::


::: slot solution

**用栈存储链表，依次出栈就相当于反转链表**

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  const stack1 = [];
  const stack2 = [];
  while (l1 !== null) {
    stack1.push(l1.val);
    l1 = l1.next;
  }
  while (l2 !== null) {
    stack2.push(l2.val);
    l2 = l2.next;
  }
  const dummyHead = new ListNode();
  let carry = 0;
  while (stack1.length || stack2.length || carry) {
    const a = stack1.length ? stack1.pop() : 0;
    const b = stack2.length ? stack2.pop() : 0;
    let sum = a + b + carry;
    carry = Math.floor(sum / 10);
    sum = sum % 10;
    const node = new ListNode(sum, dummyHead.next);
    dummyHead.next = node;
  }

  return dummyHead.next;
};
```

:::
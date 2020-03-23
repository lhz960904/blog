---
layout: LeetCodeContent
title: 876. 链表的中间结点
difficulty: 0
leetcodeTags:
  - 数学
  - 链表
---


::: slot desc

给定一个带有头结点 head 的非空单链表，返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

**示例1**:

```
输入：[1,2,3,4,5]
输出：此列表中的结点 3 (序列化形式：[3,4,5])
返回的结点值为 3 。 (测评系统对该结点序列化表述是 [3,4,5])。
注意，我们返回了一个 ListNode 类型的对象 ans，这样：
ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, 以及 ans.next.next.next = NULL.
```

**示例2**:

```
输入：[1,2,3,4,5]
输出：此列表中的结点 3 (序列化形式：[3,4,5])
返回的结点值为 3 。 (测评系统对该结点序列化表述是 [3,4,5])。
注意，我们返回了一个 ListNode 类型的对象 ans，这样：
ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, 以及 ans.next.next.next = NULL.

```
:::


::: slot solution

## 方法一

先遍历取到链表长度，然后折中，再进行遍历。

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {
  // 计算链表长度
  let len = 0;
  let cur = head;
  while (cur !== null) {
    cur = cur.next;
    len++;
  }
  let mid = Math.floor(len / 2);
  let ret = head;

  while (mid > 0 ) {
    ret = ret.next;
    mid--;
  }

  return ret;
};
```

## 方法二

利用快慢指针，快指针走俩次，满指针走一次，遍历结束后，慢指针指向的就是中间节点

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {
  // 快慢指针
  let slow = head;
  let quick = head;
  let times = 1;

  while (quick !== null) {
    quick = quick.next;
    if (times % 2 === 0) {
      slow = slow.next; 
    }
    times++;
  } 
  
  return slow;
};
```

:::
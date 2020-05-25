---
layout: LeetCodeContent
title: 146. LRU缓存机制
difficulty: 1
leetcodeTags:
  - 链表
  - 设计
  - 哈希表
---


::: slot desc

运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 get 和 写入数据 put 。

获取数据 get(key) - 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。
写入数据 put(key, value) - 如果密钥已经存在，则变更其数据值；如果密钥不存在，则插入该组「密钥/数据值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

**你是否可以在 O(1) 时间复杂度内完成这两种操作？**

**示例**:

```
LRUCache cache = new LRUCache( 2 /* 缓存容量 */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得密钥 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得密钥 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4
```
:::


::: slot solution

**利用哈希表+双向链表即可实现O(1)的复杂度。哈希表存储key对应的链表节点，链表尾部放置最新被使用的key，头部为最久未使用的key。在添加、获取操作维护链表的顺序**

```javascript
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.linkedList = new LinkedList();
  this.position = new Map();
  this.capacity = capacity;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  // 不存在返回-1
  if (!this.position.has(key)) return -1;
  // 存在更新链表中节点位置
  const node = this.position.get(key);
  this.linkedList.moveLast(node);
  return node.val;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  // 已经存在，只改表值，并且更新节点位置
  if (this.position.has(key)) {
    const node = this.position.get(key);
    node.val = value;
    this.linkedList.moveLast(node);
    return;
  }
  // 容量满的时候，删除链表头部节点，并删除Map中的key
  if (this.capacity === this.linkedList.size) {
    const node = this.linkedList.removeFirst();
    this.position.delete(node.key);
  }
  // 尾部添加节点，哈希表存储节点
  const node = this.linkedList.addLast(key, value);
  this.position.set(key, node);
};
```

**用于解题的双向链表的实现**

```javascript
class Node {
  constructor(key, val, prev, next) {
    this.key = key;
    this.val = val;
    this.prev = prev || null;
    this.next = next || null;
  }
}

class LinkedList {
  constructor() {
    this.dummyHead = new Node();
    this.dummyTail = new Node();
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
    this.size = 0;
  }

  // 在尾部增加节点，尾部节点是最新使用
  addLast(key, val) {
    const prevNode = this.dummyTail.prev;
    const newNode = new Node(key, val, prevNode, prevNode.next);
    prevNode.next.prev = newNode;
    prevNode.next = newNode;
    this.size++;
    return newNode;
  }
  
  // 删除头部节点，首部节点是最久未使用
  removeFirst() {
    const delNode = this.dummyHead.next;
    this.dummyHead.next = delNode.next;
    delNode.next.prev = this.dummyHead;
    this.size--;
    return delNode;
  }

  // 将节点移到尾部
  moveLast(node) {
    // 节点的前后进行相连
    let prevNode = node.prev;
    prevNode.next = node.next;
    node.next.prev = prevNode;

    // 添加尾部
    prevNode = this.dummyTail.prev;
    node.prev = prevNode;
    node.next = prevNode.next;
    prevNode.next.prev = node;
    prevNode.next = node;

    return node;
  }
}
```

:::
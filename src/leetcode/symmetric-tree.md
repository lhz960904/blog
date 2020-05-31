---
layout: LeetCodeContent
title: 101. 对称二叉树
difficulty: 0
leetcodeTags:
  - 树
---


::: slot desc

给定一个二叉树，检查它是否是镜像对称的。

[题目详情](https://leetcode-cn.com/problems/symmetric-tree/)
:::


::: slot solution

**递归**

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  function isSame(node1, node2) {
    if (!node1 && !node2) return true;
    if (!node1 || !node2) return false;
    return node1.val === node2.val
      && isSame(node1.left, node2.right)
      && isSame(node1.right, node2.left)
  }
  return isSame(root, root);
};
```

**迭代**

```javascript
var isSymmetric = function(root) {
  const queue = [root, root];

  while (queue.length) {
    const a = queue.shift();
    const b = queue.shift();
    if (!a && !b) continue;
    if (!a || !b) return false;
    if (a.val !== b.val) return false;
    queue.push(a.left, b.right, a.right, b.left);
  }

  return true;
};
```
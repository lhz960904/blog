---
layout: LeetCodeContent
title: 572. 另一个树的子树
difficulty: 0
leetcodeTags:
  - 树
---


::: slot desc

给定两个非空二叉树 s 和 t，检验 s 中是否包含和 t 具有相同结构和节点值的子树。s 的一个子树包括 s 的一个节点和这个节点的所有子孙。s 也可以看做它自身的一棵子树。

[题目详情](https://leetcode-cn.com/problems/subtree-of-another-tree/)

:::


::: slot solution

**1.深度优先遍历过程中比较以当前节点为根的树是否与t树相同结构、相同值**

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} s
 * @param {TreeNode} t
 * @return {boolean}
 */
var isSubtree = function(s, t) {
  // 比较俩棵树是否结构、值相等
  function isEqual(node1, node2) {
    if (node1 == null && node2 == null) return true;
    if (node1 == null || node2 == null) return false;
    return (
      node1.val === node2.val &&
      isEqual(node1.left, node2.left) &&
      isEqual(node1.right, node2.right)
    );
  }

  // 深度遍历过程中，以当前节点、左节点、右节点为根和t树进行比较
  function dfs(s) {
    if (s == null) return false;
    return isEqual(s, t) || dfs(s.left, t) || dfs(s.right, t);
  }

  return dfs(s);
};
```

**意想不到解法🤩，直接转成字符进行indexOf查找**

```javascript
var isSubtree = function(s, t) {
  return JSON.stringify(s).indexOf(JSON.stringify(t)) > -1;
};
```
:::
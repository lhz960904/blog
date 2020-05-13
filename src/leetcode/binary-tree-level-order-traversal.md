---
layout: LeetCodeContent
title: 102. 二叉树的层序遍历
difficulty: 0
leetcodeTags:
  - 栈
---


::: slot desc

给你一个二叉树，请你返回其按**层序遍历**得到的节点值。 （即逐层地，从左到右访问所有节点）。

[题目详情](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

:::


::: slot solution

**递归实现**

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
 * @return {number[][]}
 */
var levelOrder = function(root) {
  if (root == null) return [];
  const ans = [];
  function _levelOrder(root, level) {
    if (ans.length === level) {
      ans.push([]); // 为下一级准备的
    }
    ans[level].push(root.val);
    if (root.left) {
      _levelOrder(root.left, level + 1);
    }
    if (root.right) {
      _levelOrder(root.right, level + 1);
    }
  }
  _levelOrder(root, 0);
  return ans;
};
```

**非递归实现**

```javascript
var levelOrder = function(root) {
  if (root == null) return [];
  const ans = [];
  let level = 0;
  const queue = [root];
  while(queue.length) {
    ans.push([]);
    const len = queue.length;
    // 通过遍历，提前执行完下一层的所有元素，层级level就可以+1
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      ans[level].push(node.val);
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    level++;
  }
  return ans;
};
```

:::
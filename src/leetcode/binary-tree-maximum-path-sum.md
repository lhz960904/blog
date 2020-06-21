---
layout: LeetCodeContent
title: 124. 二叉树中的最大路径和
difficulty: 2
leetcodeTags:
  - 树
  - 深度优先遍历
---


::: slot desc

给定一个非空二叉树，返回其最大路径和。

本题中，路径被定义为一条从树中任意节点出发，达到任意节点的序列。该路径至少包含一个节点，且不一定经过根节点。

**示例1**:

```
输入: [1,2,3]

       1
      / \
     2   3

输出: 6
```

[题目详情](https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

:::


::: slot solution

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
 * @return {number}
 */
var maxPathSum = function(root) {
  let ans = -Infinity;

  dfs(root)

  function dfs(node) {
    if (node == null) {
      return 0;
    }
    
    // 计算左右子树最大贡献值
    const leftMax = Math.max(dfs(node.left), 0);
    const rightMax = Math.max(dfs(node.right), 0);

    // 最大路径和是当前节点 + 左右最大贡献值
    ans = Math.max(ans, node.val + leftMax + rightMax);

    // 最大贡献值是左右子树中较大的贡献值 + 当前节点值
    return node.val + Math.max(leftMax, rightMax);;
  }

  return ans;
};
```

:::
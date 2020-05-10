---
layout: LeetCodeContent
title: 236. 二叉树的最近公共祖先
difficulty: 1
leetcodeTags:
  - 树
---


::: slot desc

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[题目详情](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**示例1**:

```
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3
解释: 节点 5 和节点 1 的最近公共祖先是节点 3。
```

**示例2**:

```
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出: 5
解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。
```
:::


::: slot solution

**递归深度遍历，当左右孩子都是true的时候，代表当前节点是最近祖先。**

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  let ans = null;
  function dfs(node) {
    if (!node) return false;
    const left = dfs(node.left);
    const right = dfs(node.right);
    // 注意当前节点也可以为自己祖先
    if ((left && right) || ((left || right) && (node === p || node === q))) {
      ans = node;
    }
    return left || right || node === p || node === q;
  }
  dfs(root);
  return ans;
};
```

:::
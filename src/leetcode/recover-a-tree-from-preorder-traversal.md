---
layout: LeetCodeContent
title: 1028. 从先序遍历还原二叉树
difficulty: 2
leetcodeTags:
  - 树
---


::: slot desc

我们从二叉树的根节点 root 开始进行深度优先搜索。

在遍历中的每个节点处，我们输出 D 条短划线（其中 D 是该节点的深度），然后输出该节点的值。（如果节点的深度为 D，则其直接子节点的深度为 D + 1。根节点的深度为 0）。

如果节点只有一个子节点，那么保证该子节点为左子节点。

给出遍历输出 S，还原树并返回其根节点 root。

**示例1**:

```
输入："1-2--3--4-5--6--7"
输出：[1,2,5,3,4,6,7]
```

[题目详情](https://leetcode-cn.com/problems/recover-a-tree-from-preorder-traversal/)

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
 * @param {string} S
 * @return {TreeNode}
 */
var recoverFromPreorder = function(S) {
  const stack = [];
  let position = 0;
  while (position < S.length) {
    let level = 0;
    while (S[position] == '-') {
      level++;
      position++;
    }
    let val = '';
    while (position < S.length && S[position] !== '-') {
      val += S[position];
      position++;
    }
    // console.log('val', level, val)
    const node = new TreeNode(val);
    const depth = stack.length;
    if (level === depth) {
      if (depth) {
        stack[depth - 1].left = node;
      }
    } else {
      while (level < stack.length) {
        stack.pop();
      }
      stack[stack.length - 1].right = node;
    }
    stack.push(node);
  }
  return stack[0];
};
```

:::
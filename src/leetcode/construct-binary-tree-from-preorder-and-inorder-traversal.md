---
layout: LeetCodeContent
title: 105. 从前序与中序遍历序列构造二叉树
difficulty: 1
leetcodeTags:
  - 树
---


::: slot desc

根据一棵树的前序遍历与中序遍历构造二叉树。

注意:
你可以假设树中没有重复的元素。

例如，给出
  ```
  前序遍历 preorder = [3,9,20,15,7]
  中序遍历 inorder = [9,3,15,20,7]
  ```
返回如下的二叉树：

```
   3
   / \
  9  20
    /  \
   15   7
```

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
  let preIndex = 0;

  function _buildTree(left, right) {
    if (left > right) return null;
    const rooVal = preorder[preIndex];
    const root = new TreeNode(rooVal);
    const mid = inorder.indexOf(rooVal); 
    preIndex++;
    root.left = _buildTree(left, mid - 1);
    root.right = _buildTree(mid + 1, right);
    return root;
  }

  return _buildTree(0, inorder.length - 1);
};
```

:::
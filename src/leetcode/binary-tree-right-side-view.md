---
layout: LeetCodeContent
title: 199. 二叉树的右视图
difficulty: 1
leetcodeTags:
  - 深度优先搜索
  - 广度优先搜索
---


::: slot desc

给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**示例**:

```
输入: [1,2,3,null,5,null,4]
输出: [1, 3, 4]
解释:

   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---

```
:::


::: slot solution

**深度优先搜索，递归优先访问右孩子，当该节点是当前层最先访问到的，插入到结果中**

```javascript
**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
  // 每一层只会看到一个节点，用于去重。
  const set = new Set();
  // 结果
  const ans = [];
  // 深度优先遍历
  function dfs(node, depth) {
    if (node == null) return;
    if (!set.has(depth)) {
      ans.push(node.val);
      set.add(depth);
    }
    // 先右再左
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }

  dfs(root, 0);
  
  return ans;
};
```

**广度优先搜索，层序遍历，每一层的最后一个节点就是被看到的节点**

```javascript
var rightSideView = function(root) {
  if (root == null) return [];
  // 存在当前层的所有节点
  const queue = [root];
  // 存放结果
  const ans = [];
  // 层序遍历
  while (queue.length) {
    const len = queue.length;
    // 每层最后一个节点就是被看到的节点
    ans.push(queue[len - 1].val);
    // 将下一层插入到queue中
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
  }

  return ans;

};
```

:::
---
layout: LeetCodeContent
title: 297. 二叉树的序列化与反序列化
difficulty: 2
leetcodeTags:
  - 树
---


::: slot desc

序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。

请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

**示例1**:

```
你可以将以下二叉树：

    1
   / \
  2   3
     / \
    4   5

序列化为 "[1,2,3,null,null,4,5]"
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
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
  if (root == null) return null;
  const queue = [root];
  let ans = [];
  while(queue.length) {
    const node = queue.shift();
    // ans.push(node.val);
    if (node !== null) {
      ans.push(node.val);
      queue.push(node.left)
      queue.push(node.right)
    } else {
      ans.push(null);
    }
  }
  let R = ans.length - 1;
  while (R >= 0 && ans[R] == null) {
    R--;
  }
  ans = ans.slice(0, R + 1);
  // console.log(ans);
  return JSON.stringify(ans);
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    if (!data) return null;
    const list = JSON.parse(data);
    // console.log(list);
    const rootVal = list.shift();
    const root = new TreeNode(rootVal);
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      const L = list.shift();
      const R = list.shift();
      if (L != null) {
        node.left = new TreeNode(L);
        queue.push(node.left)
      }
      if (R != null) {
        node.right = new TreeNode(R);
        queue.push(node.right)
      }
    }

    return root;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

:::
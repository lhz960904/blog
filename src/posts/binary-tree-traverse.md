---
category: 技术
tags:
  - javascript
  - algorithm
date:  2020-02-13
title: 二叉树的遍历
---

分别使用`递归`和`迭代`实现二叉树的前序、中序、后续、层序遍历。

<!-- more -->

## 前序遍历

[LeetCode地址](https://leetcode-cn.com/problems/binary-tree-preorder-traversal)

### 递归

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const ret = [];
    function _preOrder(root) {
        if (root == null) {
            return;
        }
        ret.push(root.val);
        _preOrder(root.left);
        _preOrder(root.right);  
    }
    _preOrder(root);
    return ret;
};
```

### 迭代

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    if (root == null) {
        return [];
    }
    const stack = [root];
    const ret = [];
    while(stack.length) {
        const cur = stack.pop();
        ret.push(cur.val);
        if (cur.right) {
            stack.push(cur.right);
        }
        if (cur.left) {
            stack.push(cur.left);
        }
    }
    return ret;   
};
```

## 中序遍历

[LeetCode地址](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

### 递归

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const ret = [];
    function _inOrder(root) {
        if (root == null) {
            return;
        }
        _inOrder(root.left);
        ret.push(root.val);
        _inOrder(root.right);  
    }
    _inOrder(root);
    return ret;
};
```

### 迭代

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * 把当前节点的所有左子孙节点压入栈中，依次取出。
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
     if (root == null) {
        return [];
    }
    const stack = [];
    let cur = root;
    const ret = [];
    while (stack.length || cur != null) {
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        const node = stack.pop();
        ret.push(node.val);
        if (node.right != null) {
            cur = node.right;
        }
    }
    return ret;
};
```

## 后序遍历

[LeetCode地址](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

### 递归

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    const ret = [];
    function _postOrder(root) {
        if (root == null) {
            return;
        }
        _postOrder(root.left);
        _postOrder(root.right);
        ret.push(root.val);
    }
    _postOrder(root);
    return ret;
};
```

### 迭代

```javascript
/**
 * 定义二叉树的节点
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    if (root == null) {
        return [];
    }
    const stack1 = [root];
    const ret = [];
    while(stack1.length) {
        const node = stack1.pop();
        ret.unshift(node.val);
        if (node.left) {
            stack1.push(node.left);
        }
        if (node.right) {
            stack1.push(node.right);
        }
    }
    return ret;
};
```

## 层序遍历

[LeetCode地址](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

### 递归

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
    if (root == null) {
        return [];
    }
    const ret = [];
    function _levelOrder(root, level) {
        if (ret.length === level) {
            ret.push([]); // 为下一级准备的
        }
        ret[level].push(root.val);
        if (root.left) {
            _levelOrder(root.left, level + 1);
        }
        if (root.right) {
            _levelOrder(root.right, level + 1);
        }
    }
    _levelOrder(root, 0);
    return ret;
};
```

### 迭代

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
    if (root == null) {
        return [];
    }
    const ret = [];
    let level = 0;
    const queue = [root];
    while(queue.length) {
        ret.push([]);
        const len = queue.length;
        // 通过遍历，提前执行完下一层的所有元素，层级level就可以+1
        for (let i = 0; i < len; i++) {
            const node = queue.shift();
            ret[level].push(node.val);
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            } 
        }
        level++;
    }
    return ret;
};
```

## 总结

关于二叉树的前序、中序、后续遍历，使用递归的方法不用多说，主要是迭代方法，通过对`栈`的应用，先后推入栈中，从而实现不同顺序的遍历。二叉树的层序遍历通过对`队列`的应用实现。

:::tip
本文只包含其中俩种解法，更详细的解答可以点击参考↓的地址(带图解)！
:::

## 参考

- [前中后序遍历-题解](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/solution/leetcodesuan-fa-xiu-lian-dong-hua-yan-shi-xbian-2/)

- [层序遍历-题解](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/solution/er-cha-shu-de-ceng-ci-bian-li-by-leetcode/)
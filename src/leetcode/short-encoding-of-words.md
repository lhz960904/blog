---
layout: LeetCodeContent
title: 820. 单词的压缩编码
difficulty: 1
leetcodeTags:
  - 字典树
---


::: slot desc

给定一个单词列表，我们将这个列表编码成一个索引字符串 S 与一个索引列表 A。

例如，如果这个列表是 ["time", "me", "bell"]，我们就可以将其表示为 S = "time#bell#" 和 indexes = [0, 2, 5]。

对于每一个索引，我们可以通过从字符串 S 中索引的位置开始读取字符串，直到 "#" 结束，来恢复我们之前的单词列表。

那么成功对给定单词列表进行编码的最小字符串长度是多少呢？

**示例**:

```
输入: words = ["time", "me", "bell"]
输出: 10
说明: S = "time#bell#" ， indexes = [0, 2, 5] 。
```
:::


::: slot solution
## 方法一

根据题意，理解了只有满足后缀才可以，例如：time 和 me，me就可以被忽略。但im是不满足忽略条件的。我们可以对每个单词进行遍历，把符合条件的过滤掉就可以。

```javascript
/**
 * @param {string[]} words
 * @return {number}
 */
var minimumLengthEncoding = function(words) {
  const set = new Set(words);
  for (let word of set) {
    for (let i = 1; i < word.length; i++) {
      const str = word.substr(i);
      set.has(str) && set.delete(str);
    }
  }
  let ans = 0;
  // 根据 set 中剩余元素计算最终长度
  set.forEach(word => ans += word.length + 1)
  return ans
};

```

## 方法二

因为是后缀才满足过滤条件，所以可以将单词反转。生成前缀树，我们只要统计叶子节点的数量就可以得到结果

```javascript
var minimumLengthEncoding = function(words) {
  const trie = new Trie();
  let ans = 0;
  // 对每一个单词进行插入操作
  for (let i = 0; i < words.length; i++) {
    trie.insert(words[i]);
  }
  search(trie.root, 0);
  return ans;

  // 获取trie树的叶子节点
   search(node, level) {
    // 到达叶子节点
    if (!Object.keys(node.next).length) {
      ans += level + 1;
      console.log(ans, level)
      return;
    }
    Object.keys(node.next).forEach(
      c => search(node.next[c], level + 1)
    )
  }
}

var Node = function(isWord) {
  this.isWord = isWord || false;
  this.next = {};
}

var Trie = function() {
  this.root = new Node();
  this.size = 0;
};

Trie.prototype.insert = function(word) {
  let cur = this.root;
  // 反转单词，变成“前”缀树
  for (let i = word.length - 1; i >= 0; i--) {
    const char = word.charAt(i);
    if (!cur.next[char]) {
      cur.next[char] = new Node();
    } 
    cur = cur.next[char];
  }
  if (!cur.isWord) {
    cur.isWord = true;
    this.size++;
  }
};
```

:::
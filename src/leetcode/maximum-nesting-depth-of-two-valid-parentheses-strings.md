---
layout: LeetCodeContent
title: 1111. 有效括号的嵌套深度
difficulty: 1
leetcodeTags:
  - 栈
---


::: slot desc

给你一个「有效括号字符串」 seq，将其分成两个不相交的子序列 A 和 B，且 A 和 B 都满足有效括号字符串的定义（注意：A.length + B.length = seq.length）。

现在，你需要从中选出 任意 一组有效括号字符串 A 和 B，使 max(depth(A), depth(B)) 的可能取值最小。

返回长度为 seq.length 答案数组 answer ，选择 A 还是 B 的编码规则是：如果 seq[i] 是 A 的一部分，那么 answer[i] = 0。否则，answer[i] = 1。即便有多个满足要求的答案存在，你也只需返回 一个。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

**示例1**:

```
输入：seq = "(()())"
输出：[0,1,1,1,1,0]
```

**示例2**:

```
输入：seq = "()(())()"
输出：[0,0,0,1,1,0,1,1]
```
:::


::: slot solution

```javascript
/**
 * 题意就是让A,B的俩个有效括号字符串，长度相差越小。
 * @param {string} seq
 * @return {number[]}
 */

var maxDepthAfterSplit = function(seq) {
  // 碰到左括号奇偶性插入A、B4
  let ans = [];
  for (let i = 0; i < seq.length; i++) {
    ans[i] = seq[i] === '(' ?  (i & 1) : (i + 1) & 1;
  }
  return ans;
};
```

:::
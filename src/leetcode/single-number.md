---
layout: LeetCodeContent
title: 136. 只出现一次的数字
difficulty: 0
leetcodeTags:
  - 位运算
  - 哈希表
---


::: slot desc

给定一个**非空**整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

说明：

你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

**示例**：

```
输入: [2,2,1]
输出: 1
```

```
输入: [4,1,2,1,2]
输出: 4
```

:::


::: slot solution

**异或运算**

- 相同值异或等于0
- 与0异或等于本身
- a ⊕ b ⊕ a => a ⊕ a ⊕ b => 0 ⊕ b => b

所以遍历数组，累异或，最终值就是出现过一次的

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  return nums.reduce((a, c) => a^c, 0)
};
```

:::
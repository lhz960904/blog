---
layout: LeetCodeContent
title: 75. 颜色分类
difficulty: 1
leetcodeTags:
  - 排序
  - 双指针
---


::: slot desc

给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

**注意**:
不能使用代码库中的排序函数来解决这道题。

**示例**:

```
输入: [2,0,2,1,1,0]
输出: [0,0,1,1,2,2]
```

**进阶**
- 你能想出一个仅使用常数空间的一趟扫描算法吗？

:::


::: slot solution

## 计数排序解法

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
  let counts = [0, 0, 0];
  // 计数
  for (let i = 0; i < nums.length; i++) {
    counts[nums[i]]++;
  }
  let prevCount = 0;
  const ans = [];

  for (let i = 0; i < counts.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
      nums[prevCount + j] = i;
    }
    prevCount += counts[i];
  }
}
```

## 进阶解法(三路快排)

```javascript
var sortColors = function(nums) {
  let zero = -1;
  let two = nums.length;
  let i = 0;
  while (i < two) {
    if (nums[i] === 1) {
      i++
    } else if (nums[i] === 2) {
      two--;
      const temp = nums[i];
      nums[i] = nums[two];
      nums[two] = temp;
    } else {
      // 0
      zero++;
      const temp = nums[i];
      nums[i] = nums[zero];
      nums[zero] = temp;
      i++;
    }
  }
}
```

:::
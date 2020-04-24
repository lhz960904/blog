---
layout: LeetCodeContent
title: 面试题51. 数组中的逆序对
difficulty: 2
leetcodeTags:
  - 分治
---


::: slot desc

在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。


**示例**:

```
输入: [7,5,6,4]
输出: 5
```
:::


::: slot solution

**使用归并排序，归并过程中，如果左侧的当前元素 > 右侧的当前元素，说明都大与左侧的元素，那可以组成的逆序对就是左侧剩余的元素个数**

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var reversePairs = function(nums) {
  let ans = 0;

  // 从大到小归并排序过程中维护逆序对数量
  mergeSort(nums, 0, nums.length - 1);

  // 对数组arr[l, r]区间内进行排序
  function mergeSort(arr, l, r) {
    if (l >= r) {
      return
    }
    const mid = Math.floor((l + r) / 2);
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    // todo 优化
    _merge(arr, l, mid, r);
  }

  // 归并过程
  function _merge(arr, l, mid, r) {
    // console.log(l, mid, r)
    // i, j代表俩个排好序的数组的索引位置
    let i = l, j = mid + 1;
    // copy数组
    let copyArr = arr.slice(l, r + 1);
    for (let k = l; k <= r; k++) {
      // 1. 左侧数组遍历结束
      if (i > mid) {
        arr[k] = copyArr[j - l];
        j++;
      } else if (j > r) {
        // 2. 右侧数组遍历结束
        arr[k] = copyArr[i - l];
        i++;
      } else if (copyArr[i - l] > copyArr[j - l]) {
         // 3. 左侧当前元素 大于 右侧当前元素 
        arr[k] = copyArr[i - l];
        i++;  
        // 重点！！！！！ 这里说明，右侧剩下没有遍历的元素，都是比当前左侧元素小的。都可以组成逆序对
        ans += r - j + 1;
        // console.log(r - j + 1)
       
      } else {
        arr[k] = copyArr[j - l];
        j++;
      }
    }
  }

  return ans;
};
```

:::
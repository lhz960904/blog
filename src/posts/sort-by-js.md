---
category: 技术
tags:
  - javascript
  - algorithm
date: 2019-06-27
title: JavaScript实现排序算法
---

JS实现排序算法(冒泡排序、选择排序、插入排序、归并排序、快速排序)。

<!-- more -->

## 冒泡排序

> 数组中有 `n` 个数，比较每相邻两个数，如果前者大于后者，就把两个数交换位置；这样一来，第一轮就可以选出一个最大的数放在最后面；那么经过 `n-1`（数组的 length - 1） 轮，就完成了所有数的排序。

```javascript
function bubbleSort(arr) {
  // 循环n-1轮
  for (let i = 0; i < arr.length - 1; i++) {
    // 每轮结束后，最大的数都放在后面，所以长度减去i
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
}
```

## 选择排序

>数组中有 `n` 个数，持续遍历无序部分找到最小的元素的索引，与当前无序的部分开头元素进行交换，这样有序部分`+1`，遍历`n-1`轮后，就完成了所有数的排序。

```javascript
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    // 找到最小的元素索引
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j
      }
    }
    // 交换
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
}
```

## 插入排序

> 数组中有 `n` 个数，持续遍历无序部分，将循环到的元素插入到前面的有序数组中。**优势**是在于：如果当前元素比他前一个元素要大，说明已经排序好，可提前终止条件。

```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // 从后遍历有序部分，将当前元素与外层元素进行比较，移至到正确位置
    for (let j = i - 1; j >= 0 && arr[j + 1] < arr[j]; j--) {
      [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
    }
  }
}
```

## 归并排序

> 数组中有 `n` 个数，递归的将数组拆分俩半，直到拆解成最小级别，将俩个有序的数组再进行排序。然后进行合并。合并到顶就是一个排序完成的数组。

```javascript
function mergeSort(array) {
  __mergeSort(array, 0, array.length - 1)
}

function __mergeSort(array, l, r) {
  if (l >= r) {
    return
  }

  const mid = Math.floor((l + r) / 2)
  __mergeSort(array, l, mid)
  __mergeSort(array, mid + 1, r)
  // 优化点：只有当左侧有序列表最后一位 > 右侧有序列表第一位时，才进行merge
  // 反之，说明左侧有序列表和右侧有序列表已经形成了一个完整的有序列表
  if (array[mid] > array[mid + 1]) {
    __merge(array, l, mid, r)
  }
}

function __merge(array, l, mid, r) {
  const aux = array.slice(l, r + 1)

  // i代表左侧列表当前索引，j代表右侧列表当前索引
  let i = l, j = mid + 1
  for (let k = l; k <= r; k++) {
    // i > mid说明左侧列表遍历结束
    if (i > mid) {
      array[k] = aux[j - l]
      j++
    } else if (j > r) {
      // j > r说 明右侧列表遍历结束
      array[k] = aux[i - l]
      i++
    } else if (aux[i - l] > aux[j - l]) {
      array[k] = aux[j - l]
      j++
    } else {
      array[k] = aux[i - l]
      i++
    }
  }
}
```

## 快速排序
> 从数组中取到一个参考值，通过`partition`操作将使参考值左侧列表元素都**小于**参考值，右侧列表都**大于**参考值。随后对俩侧列表重复上述的过程。

### 普通快速排序

```javascript
function quickSort(array) {
  __quickSort(array, 0, array.length - 1)
}

function __quickSort(array, l, r) {
  if (l >= r) return

  const p = __partition(array, l, r)
  __quickSort(array, l, p - 1)
  __quickSort(array, p + 1, r)
} 
// 返回p, 使得arr[l...p-1] < arr[p] ; arr[p + 1...r] > arr[p]
function __partition(arr, l, r) {
  // 参考标准,随机取
  const radomIndex = Math.round(Math.random() * (r - l) + l);
  [arr[l], arr[radomIndex]] = [arr[radomIndex], arr[l]]
  const v = arr[l]

  // arr[l+1...j] < v ; arr[j+1...i) > v
  let j = l
  for (let i = l + 1; i <= r; i++) {
    if (arr[i] < v) {
      // 交换: 将小于v的放置到小于列表中的后一位，j进行++
      [arr[j + 1], arr[i]] = [arr[i], arr[j + 1]]
      j++
    }
  }
  // 将参考值与j进行交换，使得满足左侧小于参考值，右侧大于参考值
  [arr[l], arr[j]] = [arr[j], arr[l]]
  return j
}
```

### 双路快速排序

> 为了解决数组中存在大量相同元素，导致都在一侧。 使用双路排序，使得相同元素均匀的被分到俩侧。

```javascript
function quickSort(array) {
  __quickSort(array, 0, array.length - 1)
}

function __quickSort(array, l, r) {
  if (l >= r) return

  const p = __partition(array, l, r)
  __quickSort(array, l, p - 1)
  __quickSort(array, p + 1, r)
}
// 返回p, 使得arr[l...p-1] < arr[p] ; arr[p + 1...r] > arr[p]
function __partition(arr, l, r) {
  // 参考标准,随机取
  const radomIndex = Math.round(Math.random() * (r - l) + l);
  [arr[l], arr[radomIndex]] = [arr[radomIndex], arr[l]]
  const v = arr[l]

  let i = l + 1, j = r
  while(true) {
    // 左右一起向中间靠，直到找到不符合的，进行交换
    while(i <= r && arr[i] < v) {
      i++
    }
    while (j >= l + 1 && arr[j] > v) {
      j--
    }
    // i > j代表遍历结束
    if (i > j) break
    [arr[i], arr[j]] = [arr[j], arr[i]]
    i++
    j--
  }
  // 将参考值与j进行交换，使得满足左侧小于参考值，右侧大于参考值
  [arr[l], arr[j]] = [arr[j], arr[l]]
  return j
}
```

### 三路快速排序

> 对数组中存在大量相同元素来说，比双路快速排序性能更好。因为三路快速排序是对相同元素不作处理，而双路快速排序还需要均匀的交换。

```javascript
function quickSort(arr) {
  __quickSort(arr, 0, arr.length - 1)
}

function __quickSort(arr, l, r) {
  if (l >= r) return

  // 随机参考标准
  const radomIndex = Math.round(Math.random() * (r - l) + l);
  [arr[l], arr[radomIndex]] = [arr[radomIndex], arr[l]]
  const v = arr[l]

  let lt = l // [l+1...lt] < v
  let gt = r + 1 // [gt...r] > v
  let i = l + 1 // [lt+1...i) === v

  while(i < gt) {
    if (arr[i] < v) { // 小于
      [arr[i], arr[lt + 1]] = [arr[lt + 1], arr[i]]
      lt++
      i++
    } else if (arr[i] > v) { // 大于
      [arr[i], arr[gt - 1]] = [arr[gt - 1], arr[i]]
      gt--
    } else { // 相等
      i++
    }
  }
  // 参考标准与 小于v的最后一个元素交换
  [arr[l], arr[lt]] = [arr[lt], arr[l]] 
  // 对小于、大于俩部分进行排序，中间相等的不做操作
  __quickSort(arr, l, lt - 1)
  __quickSort(arr, gt, r)
}
```

## 堆排序

> 利用二叉堆的特性(堆中某个节点值都小于父节点的值，完全二叉树)，使用数组生成一个最大堆，依次从堆中取出最大的元素，完成排序。

```javascript
class MaxHeap {
  constructor(arr = []) {
    this.data = [undefined, ...arr]
    this.count = arr.length
    // 非叶子节点，进行_shiftDown操作，可以将数组变成堆
    for (let i = Math.floor(this.count / 2); i >= 1; i--) {
      this._shiftDown(i)
    }
  }
  
  get size() {
    return this.count
  }

  get isEmpty() {
    return this.count === 0
  }

  insert(element) {
    this.count++
    this.data[this.count] = element
    this._shiftUp(this.count)
  }

  extractMax() {
    if (this.count === 0) {
      throw new Error('堆为空')
    }
    const ret = this.data[1]
    this.data[1] = this.data[this.count]
    this.data.length = this.count
    this.count--
    this._shiftDown(1)
    return ret
  }
	// 将k对应的元素与父亲节点进行比较，如果大于父亲节点就交换，一直到合适的位置
  _shiftUp(k) {
    while (k > 1 && this.data[Math.floor(k / 2)] < this.data[k]) {
      const parentIndex = Math.floor(k / 2);
      [this.data[parentIndex], this.data[k]] 
        = [this.data[k], this.data[parentIndex]]
      k = parentIndex
    }
  }
	// 将k对应的元素与孩子进行比较，找到孩子中最大的值，与元素进行比较，大于就进行交换。
  _shiftDown(k) {
    while (2 * k <= this.count) {
      let j = 2 * k
      // 右孩子大于左孩子，把j切换成右孩子索引
      if (j + 1 <= this.count && this.data[j + 1] > this.data[j]) {
        j += 1
      }
      if (this.data[k] >= this.data[j]) {
        break
      }
      [this.data[k], this.data[j]] = [this.data[j], this.data[k]]
      k = j
    }
  }
}

// 例子
const arr = [10, 9, 8, 7, 6, 99, 5, 4, 3, 2, 1]
const heap = new MaxHeap(arr)
while (!heap.isEmpty) {
  console.log(heap.extractMax())
}

```

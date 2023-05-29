---
category: 技术
tags:
  - javascript
date: 2020-07-13
title: 实现Promise，遵循Promise/A+规范
---

Promise 是异步编程的一种解决方案，比传统的解决方案(回调函数和事件)更合理和更强大。现在前端应用中Promise已经得到了广泛使用。本文通过实现符合Promise/A+规范的Promise，对其加深印象。

<!-- more -->


## 构造函数

我们在使用Promise时，通常是使用new操作符进行构造，传入resolver函数，该函数会接受成功(resolve)、失败(reject)的回调函数，当我们确定结果时，需要调用resolve或reject，具体代码如下：

```javascript
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('success'), 1000)
})
// 1s后控制台打印success
p1.then(res => console.log(res))
```

所以我们的Promise也需要是个构造函数，并且执行用户传入的resolver函数，将定义好的回调函数传进去。下面是具体的代码：

**注：本文代码的实现，下划线开头代表私有属性、私有方法。**

```javascript
// 定义Promise的三种状态常量
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function Promise(resolver) {
  // 传入的必须是函数
  if (typeof resolver !== 'function') {
    throw new TypeError('Promise resolver ' + resolver + ' is not a function');
  }
  
  // resolve或reject的结果值
  this._result = undefined;
  // 状态
  this._status = PENDING;

  try {
    // 执行
    resolver(this._resolve.bind(this), this._reject.bind(this));
  } catch (error) {
    // 捕获错误
    this._reject(error);
  }
}
// 私有方法，传给resolver的成功、失败回调
Promise.prototype._resolve = function() {}
Promise.prototype._reject = function() {}
```

接下来我们来实现_resolve、_reject私有方法，其实逻辑很简单，我们只需要改变Promise状态，以及成功的值或者失败的原因。但要注意**Promise一旦状态改变，就不会再变，任何时候都可以得到这个结果**，所以我们只有在状态时PENDING的时才会执行。 

```javascript
Promise.prototype._resolve = function(value) {
  // setTimeout 为了异步执行
  setTimeout(() => {
    if (this._status !== PENDING) return;
    this._status = FULFILLED;
    this._result = value;
  });
}

Promise.prototype._reject = function (reason) {
  // setTimeout 为了异步执行
  setTimeout(() => {
    if (this._status !== PENDING) return;
    this._status = REJECTED;
    this._result = reason;
  });
};
```

## Promise.prototype.then

Promise的核心就是`then`方法，Promise/A+规范大都也是针对then方法进行阐述，实现了`then`方法后，我们再来实现其他API就方便了很多。

Promise的`then`方法的规范有如下几点

1. 接受两个参数，onFulfilled(成功回调)， onRejected(失败回调)，**当回调不是函数时， 其必须被忽略，支持透传**

2. then 方法可以被同一个 Promise 调用多次
    - 当 Promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
    - 当 Promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

3. then 方法必须返回一个 Promise 对象 
    - 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的**Promise解决过程**
    - 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e


**我们针对上述几点分别来实现一下**

关于第一点，可以控制台执行下面代码

```javascript
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('success'), 1000)
})
// 1s后控制台打印success
p1.then(1).then(res => console.log(res))
```

第二个then方法依然可以接受到resolve成功的值，所以当then方法传入的不是函数时，我们要规范使其变成函数支持透传。

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  // 保证是函数，不是函数要实现透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
  onRejected = typeof onRejected === 'function' ? onRejected : (v) => { throw v };
}
```

实现第一点很简单，我们只需要吧把结果/错误 -> 返回/抛出传递给出去就可以啦。

我们再来看第二点，为了可以多次调用并且依次执行，我们需要改下之前写过的代码，我们需要增加俩个回调队列，成功、失败各一个。其实也可以用一个队列来存储，我这里采用的分别存储。

```diff
function Promise(resolver) {
  // 忽略无关代码...

  // resolve的回调队列
+ this._resolveCbs = [];
  // reject的回调队列
+ this._rejectCbs = [];
}

Promise.prototype._resolve = function(value) {
  setTimeout(() => {
    // 忽略无关代码...
+   this._resolveCbs.forEach((callback) => callback(value));
  });
}

Promise.prototype._reject = function(reason) {
  setTimeout(() => {
    // 忽略无关代码...
+   this._rejectCbs.forEach((callback) => callback(reason));
  });
}
```

我们在then方法中，如果状态还处于PENDING，就需要将传入的onFulfilled(成功回调)， onRejected(失败回调)插入对应的队列中，否则直接执行就好。这也就是我们要实现第三点的核心逻辑。

根据第三点所述，我们总是需要执行onFulfilled 或 onRejected，然后传入**Promise解决过程**，此外还需要捕获这个过程，直接reject。具体**核心代码**如下

```javascript
let promise = undefined;
return (promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      var x = onFulfilled(this._result);  // 或者   var x = onRejected(this._result);
      // resolvePromise Promise解决过程 下一段讲
      resolvePromise(promise, x, resolve, reject);
    } catch (e) {
      return reject(e);
    }
  });
}));
```

下面我们就是把这段代码分别用在 PENDING, FULFILLED, REJECTED三种状态，完整代码如下：

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  // 保证是函数，不是函数要实现透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (v) => {
          throw v;
        };

  let promise = undefined;

  // 已经resolve
  if (this._status === FULFILLED) {
    return (promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var x = onFulfilled(this._result);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
  // 已经reject
  if (this._status === REJECTED) {
    return (promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var x = onRejected(this._result);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
  // pending时直接放入回调队列中，放入队列汇总不需要加setTimeout,因为执行时候已经是setTimeout中
  if (this._status === PENDING) {
    return (promise = new Promise((resolve, reject) => {
      this._resolveCbs.push((value) => {
        try {
          var x = onFulfilled(value);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
      this._rejectCbs.push((reason) => {
        try {
          var x = onRejected(reason);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
};
```

上面代码看似很多，很复杂，但其实根据规范来看，其实很简单，而且有大量的重复代码。那我们还有一个`resolvePromise`函数没有完成，接下来我希望读者可以自己去读一下**Promise 解决过程**的逻辑。[点击链接去查看](https://www.ituring.com.cn/article/66566)。因为函数的实现完全照规范的逻辑书写，没有技巧可言。

**这里简单的总结几点**：

1. 为了和其他promise并存，我们不能只判断onFulfilled，onRejected函数返回的是否是promise，我们只需要保证其返回值存在`then`方法就去尝试按promise处理。

2. 如果没有then属性，或者then属性不是函数的话，直接按照resolve(x)处理

3. 如果then存在并且是函数，按照promise处理的同时，需要捕获错误按reject(x)处理

4. 如果传入的回调均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用（只能调用一次，需要有标志位）


按照上述四点，我们可以写出`resolvePromise`函数的代码

```javascript
function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (x === promise) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }
  // 用于 “优先采用首次调用并忽略剩下的调用”的标志位
  let invoked = false;
  // 尝试把 x.then 赋值给 then
  let then = undefined;
  // x 为对象或函数
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      then = x.then;
      if (typeof then === 'function') {
        // 如果 then 是函数，将 x 作为函数的作用域 this 调用之
        then.call(
          x,
          (y) => {
            if (invoked) return;
            invoked = true;
            return resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (invoked) return;
            invoked = true;
            return reject(r);
          }
        );
      } else {
        // 如果 then 不是函数，以 x 为参数执行 promise
        return resolve(x);
      }
    } catch (e) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (invoked) return;
      invoked = true;
      return reject(e);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    return resolve(x);
  }
}
```

## Promise.prototype.catch

.catch()发生错误时的回调函数 相当于使用.then(null, onRejected)，我们实现了then方法，所以catch方法就相当简单

```javascript
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

## Promise.prototype.finally

.finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

```javascript
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

上面代码中，不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。

那我们就可以通过then方法，传入的成功、失败回调函数中都去执行callback

```javascript
Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

注意我们要.then将结果透传，因为finally后面还可以继续调用then方法。

```javascript
// 最后一个then理应接受到2作为参数
Promise.resolve(2).finally(() => { }).then(res => console.log(res))
```

## Promise.resolve

有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。

我们只需要把then方法中的成功逻辑拿出来使用就可以。(其中x不是onFulfilled执行的值，直接是传入的参数)

```javascript
Promise.resolve = function (value) {
  let promise;
  return (promise = new Promise((resolve, reject) => {
    resolvePromise(promise, value, resolve, reject);
  }));
};
```

## Promise.reject

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

```javascript
Promise.reject = function (reason) {
  return new Promise((_, reject) => reject(reason));
};
```

## Promise.all

```javascript
/**
 * Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
 * 只有所有实例的状态都变成fulfilled，新的实例状态才会变成fulfilled，新实例参数
 * 只要其中有一个被rejected，新的实例就变成rejected，此时第一个被reject的实例的返回值，会传递给新实例的回调函数。
 */
Promise.all = function (promises) {
  return new Promise(function (resolve, reject) {
    let resolvedCount = 0;
    let promiseCount = promises.length;
    let resolvedValues = new Array(promiseCount);
    for (let i = 0; i < promiseCount; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          resolvedCount++;
          resolvedValues[i] = value;
          // 数量相同说明promise实例都是成功
          if (resolvedCount == promiseCount) {
            return resolve(resolvedValues);
          }
        },
        (reason) => {
          // 率先reject的直接失败，传入原因
          return reject(reason);
        }
      );
    }
  });
};
```

## Promise.race

```javascript
/**
 * Promise.race()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
 * 只要其中有一个状态变更，新的实例就跟随着变更，参数会传递给新实例的回调函数。
 */
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      // 谁快谁说了算！
      Promise.resolve(promises[i]).then(
        (value) => {
          return resolve(value);
        },
        (reason) => {
          return reject(reason);
        }
      );
    }
  });
};
```

## 总结

Promise的实现难点主要集中在then方法上，其他方法都是基于then方法实现的。实现一个Promise也是笔试的高频题目，希望本文章可以给你带来帮助。

[完整源码传送门](https://github.com/super-wall/Promise)

## 参考

- [Promise/A+规范中文版](https://www.ituring.com.cn/article/66566)

- [阮一峰ES6](https://es6.ruanyifeng.com/#docs/promise)

- [手写Promise最简20行版本，实现异步链式调用](https://mp.weixin.qq.com/s/06Qg9FG4PSzuxdipbDAa6Q)

- [https://github.com/xieranmaya/blog/issues/3](https://github.com/xieranmaya/blog/issues/3)

- [Promise实现原理（附源码）掘进](https://juejin.im/post/5b83cb5ae51d4538cc3ec354)
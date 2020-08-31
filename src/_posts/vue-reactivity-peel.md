---
category: 源码学习
tags:
  - javascript
  - vue
date: 2020-08-31
title: '@vue/reactivity 响应式源码阅读'
---

我们都知道 `Vue3.0` 将响应式部分单独抽离成 `reactivity` npm 包，并且内部用 `proxy` 代替了 `Object.defineProperty`，本文通过对源码来一起学习它是怎么工作的。

<!-- more -->

## reactive

我们先来看 `reactive` 的使用，我们传入对象、数组、Map实例、Set实例任意一种，都可以将其变成响应式，如果属性在 `effect` 函数中被使用，就会被收集依赖，当属性值变更时，就会重新执行 `effect` 函数。

```javascript
const state = reactive({ count: 0 });
effect(() => {
  // 会执行2遍，++前后各执行一遍
  console.log('变更时自动执行', state.count);
})
state.count++;
```

我们直接查来看源码中的实现，具体文件是 `packages/reactivity/src/reactive.ts` 

```javascript
export function reactive(target) {
  // 如果target是只读的，不能再进行响应式，直接返回
  if (target && target['__v_isReadonly']) {
    return target
  }
  // 通过 createReactiveObject 创建响应式对象
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```

我们会先判断传入的 `target` 是否已经是只读状态了，我们通过 `readonly` 可以生成一个只读对象，该 API 会在之后进行分析，调用其方法后会拦截 `__v_isReadonly` 属性返回 `true` 。

其实 `reactive` , `readonly` 都是通过 `createReactiveObject` 来创建，只不过传入的参数不同而已，我们来重点看一下 `createReactiveObject` 的实现：

```javascript
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
  // 不是对象直接返回 （不是对象可以使用 ref 做到响应式，后面会讲到）
  if (!isObject(target)) return target
  // 被代理过会有__v_raw属性，不需要再进行代理，直接返回
  // 特例：如果对一个响应式对象再次进行只读操作，是可以的 readonly(reactive({}))
  if (target['__v_raw'] && !(isReadonly && target['__v_isReactive'])) {
    return target
  }
  // 查看target是否被代理过，Map中存在，说明代理过，可以直接返回结果
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 拿到target具体的类型，进行代理。集合类型会使用collectionHandlers
  const targetType = getTargetType(target)
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  // 代理过存在Map中，用于同target，直接返回
  proxyMap.set(target, proxy)
  return proxy
}
```

`createReactiveObject` 函数主要做三件事情，**1. 首先校验target 是否合法**，**2. 然后尝试从缓存中拿结果**，**3. 进行proxy代理**。


响应式核心是在代理操作中，进行收集依赖或派发更新。 具体逻辑都在传入的 `handlers` 对象里面。我们这里只对对象或数组进行分析，使用的是 `mutableHandlers` 对象。

```javascript
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
```

对于数组和对象，`reactive` 对以上5个操作进行了代理，每个操作中都会调用**收集依赖**或**派发更新** ， 我们先来看 `get` 操作： 

```javascript
const get = createGetter();

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    // 对 `__v_isReactive` `__v_isReadonly` `__v_raw` 进行拦截
    // 省略无关代码...

    // 对数组 'includes', 'indexOf', 'lastIndexOf' API进行拦截，收集依赖
    // 省略无关代码...

    const res = Reflect.get(target, key, receiver)
    // 不是已读，需要收集依赖
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }
    // 如果是浅响应式，直接返回就可以
    if (shallow) return res

    // 如果res是Ref对象，直接返回res.value。通过数组索引获取的值不会自动 "解包"
    // 省略无关代码...

    // 不是浅响应式，返回的还是对象，需要进行响应式代理，一种懒执行优化
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```

上述代码的最关键的是 `track(target, TrackOpTypes.GET, key)`，该方法就是用于收集依赖，方法的实现会再后面进行分析。在 `Vue2.x`中，嵌套对象，会在初始化时就递归进行代理操作，`3.0` 改变了这一点，当访问到时才会进行再次的代理，这也是一种优化性能的手段。

我们再来看下 `set` 代理操作

```javascript
const set = createSetter();
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    // 旧值
    const oldValue = target[key]
    if (!shallow) {
      // 非浅响应时，如果从ref 变成 非ref，不需要派发更新
      value = toRaw(value)
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    }
    const result = Reflect.set(target, key, value, receiver)
    // 如果target是原型链上的对象，不需要派发更新
    if (target === toRaw(receiver)) {
      // hadKey代表自身上存在该属性
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
```

与 `track` 函数相对应的就是 `trigger` 函数，它俩分别是收集依赖，派发更新。具体实现我们放在后面结合 `effect` 函数一起分析。我们可以假想它们的工作方式如下：

```javascript
const effects = [];
// 把函数放到数组中
const track = (fn) => effects.push(fn)
// 遍历数组再次执行这些函数
const tigger = () => effects.forEach(effect => effect())
```

## readonly

上面已经说过 `readonly` 也是调用 `createReactiveObject` 来创建，第二个参数传入true，代表是只读。并且代理操作传入 `readonlyHandlers` 和`readonlyCollectionHandlers`

```javascript
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers
  )
}
```

我们来看下 `shallowReactiveHandlers` 

```javascript
const readonlyHandlers = {
  get: createGetter(true),
  has,
  ownKeys,
  set(target, key) {
    if (__DEV__) {
      console.warn()
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn()
    }
    return true
  }
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {

    // 忽略无关代码..

    const res = Reflect.get(target, key, receiver)

    // 只读时，不进行依赖收集
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    return res
  }
}
```

使用 `createGetter` 传入 `true`，这样在函数内部判断时，不会进行依赖收集，再设置(set)、删除(deleteProperty)时，都不进行操作，非生产环境给出警告即可。


## ref

因为 `reactive` 方法是通过 `proxy` 代理属性相关操作，如果我们只想对基本数据类型进行响应式，`reactive` 就没有办法实现了。`Vue` 提供的 `ref` 帮我们做了这件事情。

```javascript
const number = ref(1);
effect(() => {
  // 会执行2遍，++前后各执行一遍
  console.log('变更时自动执行', number.value);
})
number.value++;
```

我们看一下源码中是如何实现的，文件位置：`packages/reactivity/src/ref.ts`

```javascript
function ref(value) {
  return createRef(value)
}
function createRef(rawValue, shallow = false) {
  // 如果已经是ref对象，直接返回
  if (isRef(rawValue)) {
    return rawValue
  }
  // 通过实例化RefImpl类实现
  return new RefImpl(rawValue, shallow)
}
```

`ref` 最后是返回通过实例化`RefImpl`类的对象，一起来看一下这个类都做了哪些事情

```javascript
const convert = (val) => isObject(val) ? reactive(val) : val

class RefImpl {
  // 具体的值
  _value
  // 标识是ref, isRef函数实现就是监测是否存在该属性
  __v_isRef = true

  constructor(_rawValue) {
    // 如果是对象，要使用 reactive 变成响应式
    this._value = convert(_rawValue)
  }
  
  // 获取值时，进行依赖收集
  get value() {
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  // 值变更时，派发更新
  set value(newVal) {
    // 跟上一次比较，是否有变更，变更就需要通知更新
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = convert(newVal)
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```

`ref` 实现非常简单，跟 `reactive` 大同小异，都是对属性进行拦截，get时收集依赖，set时派发更新。只不过 `reactive` 会对对象所有自身属性(除内置的)进行响应式，但 `ref` 只会对 `value` 属性进行响应式。


## effect

上面分析 `reactive` 和 `ref`实现时，一直在说**收集依赖**和**派发更新**，我们为了使响应式对象值改变时，自动执行一段逻辑，需要用 `effect` 包裹，其实传入`effect`的函数就是依赖函数，**派发更新** 就是能自动执行这个函数。

```javascript
const state = reactive({ count: 0 })
effect(() => {
  // state.countg改变时，这个函数会自动执行。
  console.log(state.count)
})
```

我们只需要收集依赖的时候，知道调用了哪个函数，就可以把函数暂存起来，等着下次更新时，执行函数即可。所以在这里可以使用高阶函数，对原依赖函数进行包裹。

```javascript
function effect(fn) {
  function wrapperFn() {
    // 当执行时，我们就只到此时执行的是wrapperFn
    fn()
  }
  wrapperFn();
}
```

所以我们可以通过全局变量，来控制当前执行的函数是哪个，从而依赖收集的时候，就知道该收集哪个函数。根据这个思路我们来看下 `Vue` 中 `effect` 的实现。

```javascript
function effect(fn, options) {
  // 已经是effect包裹后的函数，需要拿到原始函数
  if (isEffect(fn)) {
    fn = fn.raw
  }
  // 通过createReactiveEffect进行包裹，相当于上面提到的wrapperFn
  const effect = createReactiveEffect(fn, options)
  // lazy代表懒执行，默认情况下会先执行一次
  if (!options.lazy) {
    effect()
  }
  return effect
}
```

`Vue` 中的 `effect` 还提供了一些参数，用于不同场景下的使用，我们可以看下`createReactiveEffect` 是如何维护依赖函数的。

```javascript
function createReactiveEffect(fn, options) {
  // 对原始fn进行包裹，收集依赖就是收集effect
  const effect = function reactiveEffect() {
    // 默认情况是激活状态，可以通过stop函数，effect.active设置成false
    // 如果非激活状态，直接执行，不做任何逻辑
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    // 当前effect调用栈中不存在此effect
    if (!effectStack.includes(effect)) {
      // 清空依赖，重新收集
      cleanup(effect)
      try {
        // 激活收集依赖功能
        enableTracking()
        // 将effect推入栈中
        effectStack.push(effect)
        // 维护当前执行的依赖函数
        activeEffect = effect
        return fn()
      } finally {
        // 将effect推出
        effectStack.pop()
        // 重置收集依赖功能
        resetTracking()
        // 维护当前执行的依赖函数
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++
  effect._isEffect = true
  effect.active = true
  effect.raw = fn
  effect.deps = []
  effect.options = options
  return effect
}
```

通过上面代码，我们知道 `activeEffect` 就是我们说的全局变量，用于维护当前正在执行的effect。那为什么还需要维护effectStack调用栈呢，主要是考虑effect嵌套问题。其中 `enableTracking` 和 `resetTracking` 俩个方法主要是维护全局变量 `shouldTrack` ，通过它来决定是否可以依赖收集，因为有些场景下，比如**生命周期**时。是不能收集依赖的。

```javascript
let shouldTrack = true
// trackStack调用栈跟effectStack同理，为了解决嵌套调用
const trackStack = []

export function pauseTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}
```

我们现在可以知道当前执行的依赖函数了，接下来我们来看一下如果对它进行收集（track）以及派发执行（trigger）。

## Track

上面提到收集依赖是调用 `track` 函数，我们就以拦截 `get` 操作中 `track(target, TrackOpTypes.GET, key)`为例，来分析 `track` 函数的实现。

```javascript
function track(target, type, key) {
  // shouldTrack false 或者 当前维护的effect函数为空，都直接终止
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  // 通过target找到对应依赖Map，没有即创建
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 通过访问到的key找到对应的依赖set，没有即创建
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 如果依赖集合中不存在当前依赖函数，那添加进去
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    // 在依赖函数的deps中维护依赖数组，用于清除依赖时使用。
    activeEffect.deps.push(dep)
  }
}
```

我们通过 `target => depsMap` 和 `key => deps` 找到 `target[key]`对应的依赖函数集合，然后将当前执行的 `effect` 插入进去，代表依赖收集完成

## Trigger

依赖函数都存在一个Set集合中，等到我们改变 `target[key]` 的时候，就需要将集合中的函数都执行一篇。接下来看下 `trigger` 函数的实现。

```javascript
function trigger(
  target,
  type,
  key,
  newValue,
  oldValue,
  oldTarget
) {
  // 通过 target 找到 depsMap, 不存在终止
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 定义要执行的effect集合
  const effects = new Set()

  // 传入集合，将effect依次添加到待执行集合中
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        // 与当前执行的effect相同不添加
        if (effect !== activeEffect) {
          effects.add(effect)
        }
      })
    }
  }

  // 针对集合类型来说，如果清空集合，需要把所有依赖函数都执行
  if (type === TriggerOpTypes.CLEAR) {
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {
    // 如果是数组的长度发生改变，我们只需要派发数组length或者索引大于新值的依赖函数
    // 例如 arr.splice(2, 1) 只对索引2后面的元素产生影响，需要更新
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= newValue) {
        add(dep)
      }
    })
  } else {
    // 如果改变的key不为空，可能是 修改，添加，删除。取出对应的dep集合插入到待执行结合中
    if (key !== void 0) {
      add(depsMap.get(key))
    }
    // 对于枚举属性，进行了添加、删除、map设置新属性，也都需要重新执行依赖函数
    const shouldTriggerIteration =
      (type === TriggerOpTypes.ADD &&
        (!isArray(target) || isIntegerKey(key))) ||
      (type === TriggerOpTypes.DELETE && !isArray(target))
    if (
      shouldTriggerIteration ||
      (type === TriggerOpTypes.SET && target instanceof Map)
    ) {
      add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
    }
    if (shouldTriggerIteration && target instanceof Map) {
      add(depsMap.get(MAP_KEY_ITERATE_KEY))
    }
  }

  const run = (effect: ReactiveEffect) => {
    // 如果使用effect时有传入scheduler调度函数，则执行调度函数
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      // 否则执行函数本身
      effect()
    }
  }
  // 依次执行依赖函数
  effects.forEach(run)
}
```

`trigger` 函数就是通过不同场景，将要执行的effect函数整理出来，然后依次的去执行。参数中 `oldValue` 和 `oldTarget` 主要是用于 `effect` 传入 `onTrigger`调试函数时，作为入参提供出去。

## computed

`Vue` 中的计算属性是通过传入 `get` 函数，依赖于一个值而计算出其他值的一种API，有了前面的学习，我们很容易想到可以通过 `effect` 函数来实现，具体实现如下

```javascript
const count = ref(0);

// 计算属性
let double;
effect(() => {
  double = count.value * 2
})
```

通过 `effect` 副作用函数，我们可以在 `count` 值发生变化时，自动计算double值。但这样实现，我们其他想依赖`double`值的时候做不到响应式，你也可能想到把double也改成 `ref`对象，实时维护。

```javascript
const count = ref(0);

// 计算属性
let double = ref();
effect(() => {
  double.value = count.value * 2
})

// 依赖double
effect(() => {
  console.log(double.value)
})
```

其实这已经离 `Vue` 的计算属性实现很相似了，但如果我们的 `double` 没有被其他地方使用，其实它是可以不计算的，那 `Vue` 中是如何做到的呢，我们一起来学习一下

```javascript
function computed(getterOrOptions) {
  let getter
  let setter

  // 除了传入getter函数，也可以传入配置参数，里面包含get、set
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    // 如果没传入setter，直接赋值空函数，非生产环境，会提示警告
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : () => {}
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  // 返回通过实例化ComputedRefImpl的对象
  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  )
}
```

`computed` 函数主要是针对俩种使用方式做了getter、setter的处理。再来看下 `ComputedRefImpl` 类的实现

```javascript
class ComputedRefImpl {
  // 具体值
  _value
  // 标志位，代表数据是否脏了，脏就代表需要重新计算
  _dirty = true

  // 副作用函数
  effect

  __v_isRef = true;
  __v_isReadonly

  constructor(getter, _setter, isReadonly) {
    // 赋值副作用函数，依赖值改变时通过调度方式再次执行，触发依赖此计算属性的effect更新
    this.effect = effect(getter, {
      // lazy: true 不会立即执行
      lazy: true,
      scheduler: () => {
        // 如果已经需要计算，代表触发更新过，不再一次触发
        if (!this._dirty) {
          this._dirty = true
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })
    // 传入自定义setter,就代表不已读
    this['__v_isReadonly'] = isReadonly
  }

  get value() {
    // 如果数据脏，需要重新执行
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }
    // 收集依赖
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

通过 `effect` 执行来收集依赖，内部我们通过 `_dirty` 来判断是否数据需要重新计算，这样做就可以减少不必要执行计算。


## 简单实现

经过上面的学习，知道其实响应式的原理很巧妙，就是通过对属性值操作拦截，来进行**依赖收集**和**派发更新**。我们来实现一个简单版的`reactive`函数，以此巩固自己学到的知识。这里指超简单的实现，不考虑异常情况，以及集合类型。

```javascript
// target => depsMap
const targetMap = new Map();
// key => deps (Set集合)
const KeyToDepMap = new Map();
// 当前effect
let activeEffect = null;

function reactive(obj) {
  const res = new Proxy(obj, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // ---------------------------------------派发更新
      const depsMap = targetMap.get(target)
      if (!depsMap) return;
      depsMap.get(key).forEach(effect =>  effect())
      // ---------------------------------------
      return result;
    },

    get(target, key, receiver) {
      // ---------------------------------------收集依赖
      let depsMap = targetMap.get(target)
      if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
      }
      let dep = depsMap.get(key)
      if (!dep) {
        depsMap.set(key, (dep = new Set()))
      }
      if (activeEffect && !depsMap.has(activeEffect)) {
        dep.add(activeEffect)
      }
      // ---------------------------------------
      return Reflect.get(target, key, receiver);
    }
  })
  return res;
}

function effect(fn) {
  function wrapperFn() {
    activeEffect = wrapperFn;
    fn()
    activeEffect = null;
  }
  wrapperFn();
}

```

```javascript
// test
const person = reactive({ name: 'lihaoze', age: 18 });
effect(() => {
  // 依次执行 lihaoze cq
  console.log('名字：', person.name);
});
effect(() => {
  // 依次执行 18 24
  console.log('年龄', person.age);
});
person.name = 'cq';
person.age = 24;
```

## 总结

本文的分析只是 `@vue/reactivity` 的冰山一角，其中关于集合类型的操作拦截，`effect` 调度方式执行等都没有说明，感兴趣的伙伴可以自行去学习。`Vue` 也是现在面试中常被问到的一点，对于掌握其中部分知识点也有助于我们更好的展现自己。如果本文对你有帮助，希望给与点赞一下，谢谢。
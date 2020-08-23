---
category: 源码学习
tags:
  - javascript
  - react
date: 2020-08-21
title: SWR React Hooks 库源码阅读
---

`SWR` 库是请求远程数据的 React Hooks ，它可以更好地帮助我们管理请求，它有很多特性，其中包括但不仅限于**页面聚焦重新取数**、**对数据的缓存**、**轮询**、**请求去重**等等。`SWR`开源以来收获大量 star ，本文通过对源码阅读，来一起学习它。

<!-- more -->

--- 

`useSWR` 的源码有710行代码，如果我们从头开始逐行的去阅读，可能会产生很多困扰，很可能导致我们半途而废，这也是读源码的大忌。所以我们将按照 `useSWR` 的功能来分模块儿的去阅读，这样不仅能每次的减少阅读量，还能对每个功能点认知更加清楚。**全部代码解析请前往[GitHub](https://github.com/super-wall/swr)**

## 配置

配置可以通过俩种方式来设置，**1**. 使用 `SWRConfig` 全局配置 **2**. 使用 `useSWR` 时局部配置，使用代码如下：

```jsx
// 1. SWRConfig 全局配置
function App() {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (...args) => fetch(...args).then(res => res.json())
      }}
    >
      <SomeComponent />
    </SWRConfig>
  )
}
// 2. 局部配置 第2或第3个参数，可以省略fetcher函数
const { data } = useSWR('/api/user', fetcher, { refreshInterval: 3000 })
const { data } = useSWR('/api/user', { refreshInterval: 3000 })
```

我们来看一下 `useSWR` 内部的配置合并代码

```javascript
function useSWR(key, fn, config) {
  config = Object.assign({}, defaultConfig, useContext(SWRConfigContext), config)
}
const SWRConfig = SWRConfigContext.Provider
```

上述代码一目了然，可以看到内部是通过 `Object.assign` API 将三个配置合并成一个对象，全局配置就是通过 `React Context` 实现，局部配置就是调用时传入的配置对象。

优先级关系是 **默认配置 < 全局配置 < 局部配置**。

默认配置的解析可以看**文章末尾附录**部分，标注了详细注释。

## 缓存

`useSWR` 会根据传入的第一个参数生成key，来缓存请求后的结果或错误，这样就可以做到请求结果返回前，先使用缓存数据。我们不看源代码也应该可以想到，缓存就是通过 `Map` 来实现。 `SWR` 库实现了一个缓存类，其实现非常简单。这里值得提的就是**序列化key**的方法 `serializeKey` , 其他方法具体实现可以查看[github](https://github.com/super-wall/swr/blob/peel/src/cache.ts)

```javascript
// >> src/cache.ts
export default class Cache {
  constructor(initialData = {}) {
    // 缓存Map，可以传初始缓存对象
    this.__cache = new Map(Object.entries(initialData))
    // 订阅者函数数组
    this.__listeners = []
  }

  // 根据key获取缓存
  get(key) {}
  // 设置对应key的缓存值，并且执行订阅者函数
  set(key, value) {}
  // 获取所有key的数组
  keys() {}
  // 查看是否存在对应key的缓存值
  has(key) {}
  // 清空缓存，并且执行订阅者函数
  clear() {}
  // 删除对应key的缓存，并且执行订阅者函数
  delete(key) {}
  // 添加订阅者函数到数组中，返回取消订阅的函数(从数组中移除)
  subscribe(listener) {}
  // 循环订阅者函数数组，执行函数。
  private notify() {}

  // 对传入的key进行序列化
  serializeKey(key) {
    let args = null
    //  传入函数直接执行拿到key
    if (typeof key === 'function') {
      try {
        key = key()
      } catch (err) {
        // 函数中报错，可能是因为依赖取数还没有准备好导致的
        key = ''
      }
    }
    // 如果是数组，代表都是参数
    if (Array.isArray(key)) {
      args = key
      // 使用 hash 方法根据数组生成字符串
      key = hash(key)
    } else {
      // 转换成字符串，null => ''
      key = String(key || '')
    }

    // 错误的key加上err@前缀
    const errorKey = key ? 'err@' + key : ''

    return [key, args, errorKey]
  }
}
```

其中 `hash` 方法是根据数组的元素，进行拼接得到一个key字符串，具体实现可以看**文章末尾附录**部分

## 基本使用

```jsx
const { data, error, isValidating, mutate } = useSWR('/api/user', fetcher) 
```

如果我们在组件中进行异步数据获取，都是在**挂载阶段**请求，使用 `React Hooks` ，我们可以用 `useEffect` 依赖项传入空数组来模拟 `ComponentDidMount` 阶段。为了使请求提前，我们可以使用 `useLayoutEffect` 代替 `useEffect` ， 但为了兼容 `SSR` 环境，我们可以根据环境使用不同的 `API` 。下面是精简后的代码：

```jsx
// 尽量将请求时机提前，考虑到SSR, 浏览器客户端使用useLayoutEffect，服务端使用useEffect
const useIsomorphicLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect

function useSWR(key, fn, config) {
  // 初始值（可能为空），先通过请求标识符尝试取缓存，不存在使用配置中的初始值
  const initialData = cache.get(key) || config.initialData
  // 初始错误，通过错误标识符取缓存
  const initialError = cache.get(keyErr)

  // 状态值
  const stateRef = useRef({
    data: initialData,
    error: initialError,
    isValidating: false
  })

  // 取数逻辑，会在后面详细分析
  const revalidate = useCallback(() => { /*...*/ }, [])

  // 模拟DidMount，做一次取数（请求）
  useIsomorphicLayoutEffect(() => {
    if (!key) return undefined

    // 请求标识符key有值后，需要标记为组件已挂载
    unmountedRef.current = false

    // 组件挂载后，我们需要更新从缓存更新数据，并且触发重新取数
    const latestKeyedData = cache.get(key) || config.initialData

    // 会清除重复数据的重新取数，一定间隔内，会保存请求，碰到重复的，直接使用之前的。
    const softRevalidate = () => revalidate({ dedupe: true })

    // 触发重新取数，选项挂载请求为true 或者 没设置“初始值”和“挂载请求”
    // 如果显式的设置了“挂载请求”为false，初始值没有也不会触发
    if (
      config.revalidateOnMount ||
      (!config.initialData && config.revalidateOnMount === undefined)
    ) {
      if (typeof latestKeyedData !== 'undefined') {
        // 优化：如果有缓存数据，利用requestIdleCallback API 在浏览器空闲时间重新取数，以免阻塞渲染
        rIC(softRevalidate)
      } else {
        // 没有缓存数据，就必须直接取数
        softRevalidate()
      }
    }

    return () => {
      // 标记为卸载
      unmountedRef.current = true
    }
  }, [key, revalidate])
}
```

上述代码是在挂载阶段，默认会进行一次请求。如果显式的设置了` config.revalidateOnMount` 为 `false` ，挂载阶段是不会执行的。可以看到，开始会尝试从缓存中取值，如果不存在就使用配置中的初始值，如果最后值不为空，那我们不着急请求，所以这里可以进行优化（因为页面不会显示空白），使用 `requestIdleCallback` API 在 浏览器空闲阶段执行。其中 `rIC` 方法如下

```javascript
// 不支持requestIdleCallback，用setTimeout模拟
const rIC = IS_SERVER
  ? null
  : window['requestIdleCallback'] || (f => setTimeout(f, 1))
```

## 取数请求逻辑

我们接下来看 `revalidate`，`softRevalidate` 的具体实现。其实它的作用主要执行传进来的 `fetcher`，然后改变 `stateRef`，最后触发组件渲染。我们来看下精简后的代码


```javascript
// 用于强制渲染
const rerender = useState(null)[1]
// 类似于redux的dispatch 用于更新state(data, error, isValidating)
let dispatch = useCallback(payload => {
  for (let k in payload) {
    stateRef.current[k] = payload[k]
  }
  // 组件已卸载
  if (unmountedRef.current) return
  // 强制渲染
  rerender({})
}, [])

// 重新取数，返回布尔值Promise
const revalidate = (revalidateOpts) => {
  // 请求标识符或请求函数不存在直接返回false
  if (!key || !fn) return false
  // 组件已卸载返回false
  if (unmountedRef.current) return false

  try {
    dispatch({
      isValidating: true
    })
    let newData
    let startAt
    // 执行请求，将Promise存在CONCURRENT_PROMISES对象中
    CONCURRENT_PROMISES[key] = fn(...fnArgs)
    // 将请求结果赋值给newData
    newData = await CONCURRENT_PROMISES[key]
    // 将结果缓存起来
    cache.set(key, newData)
    cache.set(keyErr, undefined)
    // 为dispatch函数创建新的state
    const newState = {
      isValidating: false
    }
    // 此次请求没有发生错误，如果之前是错误，需要修改
    if (typeof stateRef.current.error !== 'undefined') {
      newState.error = undefined
    }
    // 请求结果不相等时(深度比较)，更新
    if (!config.compare(stateRef.current.data, newData)) {
      newState.data = newData
    }
    // 更新state，触发渲染。
    dispatch(newState)
  } catch (err) {
    // 捕获错误
    // 缓存设置错误
    cache.set(keyErr, err)
    // 发生错误不同，更新state
    if (stateRef.current.error !== err) {
      dispatch({
        isValidating: false,
        error: err
      })
    }
  }
  return true
}
```

上述代码是 `revalidate` 方法精简代码，`softRevalidate` 方法只是传入的参数不同， `{ dedupe: true }` 代表去重，每次执行请求都会保存短时间，当这段时间内，相同的请求被触发，会直接使用之前的，而不会重新请求。

```javascript
// 会清除重复数据的重新取数，一定间隔内，会保存请求，碰到重复的，直接使用之前的。
const softRevalidate = () => revalidate({ dedupe: true })
const revalidate = (revalidateOpts) => {
  // 忽略无关代码...
  // 是否可以使用重复请求。我们执行传入的fetcher，会把Promise暂存在CONCURRENT_PROMISES对象上
  let shouldDeduping = typeof CONCURRENT_PROMISES[key] !== 'undefined' && revalidateOpts.dedupe
  // 已经有一个正在进行的请求，需要去重，直接使用之前的就可以。
  if (shouldDeduping) {
    newData = await CONCURRENT_PROMISES[key]
  } else {
    // 执行请求，将Promise存在CONCURRENT_PROMISES对象中
    CONCURRENT_PROMISES[key] = fn(...fnArgs)
  }
  // config.dedupingInterval 时间后，删除此次请求，这段时间内，如果开启了dedupe，都可以直接用
  setTimeout(() => {
    delete CONCURRENT_PROMISES[key]
  }, config.dedupingInterval)
}
```

## 页面可见时重新取数

`useSWR`可以做到在页面**重新可见**时，自动重新取数(请求)，我们也可以传入配置 `config.revalidateOnFocus` 为 `false` 来取消这个特性。 `useSWR`内部是通过监听 `visibilitychange` 和 `focus` 时，重新执行 `softRevalidate` 实现的。具体代码如下：

```javascript
// 存储页面可见时的回调函数  key => callback[]
const FOCUS_REVALIDATORS = {}

// 执行对象上对应key的函数。
const revalidate = revalidators => {}

// 页面可见性(visibilitychange、focus)时，重新取数
window.addEventListener(
  'visibilitychange',
  () => revalidate(FOCUS_REVALIDATORS),
  false
)
window.addEventListener('focus', () => revalidate(FOCUS_REVALIDATORS), false)

function useSWR(key, fn, config) {
  // 忽略无关代码...
  useIsomorphicLayoutEffect(() => {
    // 页面可见时回调，因为focus、visibilitychange可能会同时触发，所以做了节流操作
    let pending = false
    const onFocus = () => {
      if (pending || !configRef.current.revalidateOnFocus) return
      pending = true
      softRevalidate()
      setTimeout(
        () => (pending = false),
        configRef.current.focusThrottleInterval
      )
    }
    // 往FOCUS_REVALIDATORS对象上添加重新取数的回调
    // 具体实现可以看文章末尾附录
    addRevalidator(FOCUS_REVALIDATORS, onFocus)

  }, [key, revalidate])
}
```

我们在挂载阶段，需要往指定对象上添加对应的订阅者(回调函数)，然后监听页面可见的事件后，执行对应的回调。

## 浏览器网络重新连接时重新取数

知道了 `useSWR` 如何做到页面可见时重新取数后，我们也就知道它是如何做到网络重新连接时重新取数的逻辑，其实就是监听的事件不同罢了


```javascript
// 浏览器网络重新连接时的回调函数  key => callback[]
const RECONNECT_REVALIDATORS = {}

// 执行对象上对应key的函数。
const revalidate = revalidators => {}

// 当浏览器能够访问网络, 重新取数
window.addEventListener(
  'online',
  () => revalidate(RECONNECT_REVALIDATORS),
  false
)

function useSWR(key, fn, config) {
  // 忽略无关代码...
  useIsomorphicLayoutEffect(() => {
    // 浏览器可访问网络时回调
    const onReconnect = () => {
      if (configRef.current.revalidateOnReconnect) {
        softRevalidate()
      }
    }

    // 往FOCUS_REVALIDATORS对象上添加重新取数的回调
    // 具体实现可以看文章末尾附录
    addRevalidator(RECONNECT_REVALIDATORS, onReconnect)

  }, [key, revalidate])
}
```

## 轮询

要实现轮询，只要使用setTimeout频繁的触发请求就可以，`useSWR` 默认配置中 `refreshInterval` 为0，代表不会触发请求，当设置大于0，才会按照设置的时间间隔进行请求。默认情况下，如果请求发生错误，或者页面不可见，无网络等情况都不会轮询（通常情况下这些时候是没必要的）。但我们可以通过设置 `refreshWhenHidden` 或 `refreshWhenOffline` 为 `true` 可以继续轮询。

```javascript
// 轮询，依赖项：refreshInterval(轮询间隔)、refreshWhenHidden(页面不可见时是否刷新)、refreshWhenOffline(无网络情况是否刷新)
useIsomorphicLayoutEffect(() => {
  let timer = null
  const tick = async () => {
    // 默认：发生错误 或者 页面不可见 或者 无网络情况 都不会重新取数
    // 设置 refreshWhenHidden、refreshWhenOffline为true，也会触发取数
    if (
      !stateRef.current.error &&
      (config.refreshWhenHidden || isDocumentVisible()) &&
      (config.refreshWhenOffline || isOnline())
    ) {
      // 就是softRevalidate，去重取数
      await revalidate({ dedupe: true })
    }
    // 继续轮询
    if (config.refreshInterval) {
      timer = setTimeout(tick, config.refreshInterval)
    }
  }
  // config.refreshInterval默认是0，所以不会轮询。每次轮询都会执行tick函数
  if (config.refreshInterval) {
    timer = setTimeout(tick, config.refreshInterval)
  }
  // 返回清理函数
  return () => {
    if (timer) clearTimeout(timer)
  }
}, [
  config.refreshInterval,
  config.refreshWhenHidden,
  config.refreshWhenOffline,
  revalidate
])
```

## Suspense模式

实现Suspense模式，我们只需要将请求的Promise当错误抛出，剩下的交给 `React` 处理就好。

```jsx
function useSWR(key, fn, config) {
  // 忽略无关代码...

  // 异步组件 suspense模式，它应该是被暂停等待的
  if (config.suspense) {
    // 尝试从缓存中取值
    let latestData = cache.get(key)
    let latestError = cache.get(keyErr)

    // 缓存不存在时，使用初始值。
    if (typeof latestData === 'undefined') {
      latestData = initialData
    }
    if (typeof latestError === 'undefined') {
      latestError = initialError
    }

    if (
      typeof latestData === 'undefined' &&
      typeof latestError === 'undefined'
    ) {
      // 如果还没有发起请求，需要开始进行请求
      if (!CONCURRENT_PROMISES[key]) {
        revalidate()
      }

      if (
        CONCURRENT_PROMISES[key] &&
        typeof CONCURRENT_PROMISES[key].then === 'function'
      ) {
        // 如果是promise，直接抛出promise错误，实现suspense
        throw CONCURRENT_PROMISES[key]
      }

      // 如果是普通值，直接返回
      latestData = CONCURRENT_PROMISES[key]
    }

    // 在suspense模式下，如果没有内容则抛出错误
    if (typeof latestData === 'undefined' && latestError) {
      throw latestError
    }

    // 从缓存返回最新数据/错误，以防“key”已更改
    return {
      error: latestError,
      data: latestData,
      isValidating: stateRef.current.isValidating
    }
  }
}

```

## 知识点总结

### 利用 `useLayoutEffect` 使时机提前

> 为了将请求时机提前，请求逻辑放在了 UI 渲染前（使用 `useLayoutEffect`），并兼容了服务端场景（使用 `useEffect`）

```javascript
const useIsomorphicLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect
```

### 利用 `requestIdleCallback` 不阻止渲染。

> 当请求存在缓存时，利用 `requestIdleCallback` 使取数发生在浏览器空闲时间，以免阻止渲染。

```javascript
// 不支持requestIdleCallback，用setTimeout模拟
const rIC = IS_SERVER ? null : window['requestIdleCallback'] || (f => setTimeout(f, 1))
if (typeof latestKeyedData !== 'undefined') {
  // 优化：如果有缓存数据，利用requestIdleCallback API 在浏览器空闲时间重新取数，以免阻塞渲染
  rIC(softRevalidate)
} else {
  // 没有缓存数据，就必须直接取数
  softRevalidate()
}
```

### 尽量减少渲染次数

> 通过 `Object.defineProperty` 对属性get进行拦截，修改是否被依赖的标志位 `stateDependencies`。当没被依赖的属性更新时，可以做到不渲染（减少渲染次数）。

```javascript
// 标志位，为true代表被调用者使用
const stateDependencies = useRef({
  data: false,
  error: false,
  isValidating: false
})
```
```javascript
// 请求标识符key可能发生变化，所以key不相等时，返回初始的值
Object.defineProperties(state, {
  error: {
    get: function() {
      stateDependencies.current.error = true
      return keyRef.current === key ? stateRef.current.error : initialError
    },
    enumerable: true
  },
  data: {
    get: function() {
      stateDependencies.current.data = true
      return keyRef.current === key ? stateRef.current.data : initialData
    },
    enumerable: true
  },
  isValidating: {
    get: function() {
      stateDependencies.current.isValidating = true
      return stateRef.current.isValidating
    },
    enumerable: true
  }
})
```
```javascript
// 请求结束后会调用的dispatch函数
let dispatch = payload => {
  let shouldUpdateState = false
  for (let k in payload) {
    stateRef.current[k] = payload[k]
    // 如果调用者被依赖（有使用），则应该触发更新
    if (stateDependencies.current[k]) {
      shouldUpdateState = true
    }
  }
  // 如果改变的属性存在依赖关系 或者是 suspense模式
  if (shouldUpdateState || config.suspense) {
    // 组件已卸载
    if (unmountedRef.current) return
    // 强制渲染
    rerender({})
  }
}
```

**在改变时，需要判断改变的值是否有被使用，没有的话，是不会强制渲染的**


### `useDebugValue`使用

  使用自定义 `Hook` 时，可以使用 `useDebugValue` 在 `React` 开发者工具中进行查看，值取决于你传入什么。

  ```javascript
  // React DevTools debugger 显示state的data
  useDebugValue(stateRef.current.data)
  ```

### 判断页面可见、网络连接、连接速度

```javascript
// 页面是否可见
const isDocumentVisible = document.visibilityState !== 'hidden'
// 浏览器是否有网络
const isOnline = navigator.onLine
// 连接速度
const speed = navigator.connection.effectiveType
```

## 附录

### 默认配置 defaultConfig

```javascript
// 默认配置，其中需要基于浏览器网络状态调整配置，slowConnection代表网络连接慢的情况
const defaultConfig = {
  // 事件回调
  onLoadingSlow: () => {}, // 超时
  onSuccess: () => {}, // 成功
  onError: () => {}, // 发生错误
  onErrorRetry, // 发生错误重试

  // 错误重试间隔
  errorRetryInterval: (slowConnection ? 10 : 5) * 1000,
  // 页面可见时请求节流间隔
  focusThrottleInterval: 5 * 1000,
  // 重复数据存在的间隔，
  dedupingInterval: 2 * 1000,
  // 请求超时时间
  loadingTimeout: (slowConnection ? 5 : 3) * 1000,
  // 刷新数据间隔，0代表不刷新
  refreshInterval: 0,
  // 页面可见时是否需要重新请求
  revalidateOnFocus: true,
  // 浏览器网络重新连接时是否需要重新请求
  revalidateOnReconnect: true,
  // 页面不可见时，是否需要刷新
  refreshWhenHidden: false,
  // 浏览器无网络时，是否需要刷新
  refreshWhenOffline: false,
  // 发生错误后是否进行重试
  shouldRetryOnError: true,
  // 是否是Concurrent模式
  suspense: false,
  // 比较data值函数，默认是深比较
  compare: deepEqual
}
```

### addRevalidator 和 removeRevalidator

```javascript
// 往全局对象上添加重新取数的回调
// 一个key对应多个回调，所以是数组。
const addRevalidator = (revalidators, callback) => {
  if (!callback) return
  if (!revalidators[key]) {
    revalidators[key] = [callback]
  } else {
    revalidators[key].push(callback)
  }
}
// 从全局Map上移除重新取数的回调
const removeRevalidator = (revlidators, callback) => {
  if (revlidators[key]) {
    const revalidators = revlidators[key]
    const index = revalidators.indexOf(callback)
    if (index >= 0) {
      // https://jsperf.com/array-remove-by-index
      // 将最后一个回调移至待删除位置，然后删除最后一位，比splice要快速
      revalidators[index] = revalidators[revalidators.length - 1]
      revalidators.pop()
    }
  }
}
```

## 参考

- [精读《Hooks 取数 - swr 源码》](https://juejin.im/post/6844903991730503687)
---
category: 技术
tags:
  - javascript
  - react
date:  2019-11-20
title: redux和react-redux从实现到理解
---

我们在使用react进行开发时，通常会搭配react-redux进行状态管理。本文通过实现其简易版来理解内部原理

<!-- more -->

## 前言

我们在使用`react`进行开发时，通常会搭配`react-redux`进行状态管理，`react-redux`其实是基于`redux`封装的，使开发者更方便的使用`redux`管理数据，所以要明确`redux`完全可以单独使用。我们要学习`react-redux`首先要先学习`redux`。

[redux简单实现demo](https://codesandbox.io/s/jtyxk)

[react-redux简单实现demo](https://codesandbox.io/s/react-redux-demo-00x44)

## Redux基本使用

我们先来看一下`redux`的基本使用，下面的代码通过`createStore`来创建一个`store`，创建成功后会返回三个API(`subscribe`、`dispatch`、`getState`)。我们通过`subscribe`来订阅store中数据的变化，当有变化时会执行回调函数，通过`getState`获取最新数据输出，最后我们通过`dispatch`传入`action`来触发数据改变。

```javascript
// src/store/index.js
import { createStore } from 'redux'

// 定义reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// 创建store，返回API { subscribe, dispatch, getState }
let store = createStore(counter)

// 订阅store变化试，派发通知
store.subscribe(() => console.log(store.getState()))

// 通过dispatch触发action，做到store中数据变化
store.dispatch({ type: 'INCREMENT' }) // 1
store.dispatch({ type: 'INCREMENT' }) // 2
store.dispatch({ type: 'DECREMENT' }) // 1
```

我们引入这个文件，在控制台中可以看到依次输出1、2、1。可以看出来`redux`用法很简单，其实它只是规定了改变数据的方法，当我们遵循这个规则时，我们的数据源就是唯一的，数据也变得可控起来。接下来我们自己来实现一个简易版的`redux`来满足基本使用。

## 实现简易版Redux

通过上面的例子，我们首先要实现`createStore`，该函数会返回三个常用的API，并且可以操作state。下面是函数的骨架。

```javascript
// src/mock/redux.js
function createStore(reducer) {

  let currentState; // 始终保持最新的state
  const listeners = []; // 用于存储订阅者

  // 订阅store
  function subscribe(fn) {}

  // 获取最新state
  function getState() {}

  // 改变数据的唯一方法（约定）
  function dispatch() {}

  return { subscribe, getState, dispatch };
}

export default createStore;
```

下面我们逐一实现这三个API。

### getState

`getState`实现就超简单了，因为内部变量`currentState`始终保持最新，我们只要将这个变量返回就好了，一行代码搞定

```javascript
// 获取最新state
 function getState() {
   return currentState;
 }
```

### subscribe

我们定义了内部变量`listeners`，所以只要将传入的订阅者存储到`listeners`中就可以。**注意**：订阅者一定是函数，这样`state`变化时，去执行`listeners`中的函数就可以了。我们还要返回一个函数用于取消订阅。

```javascript
// 订阅store
function subscribe(fn) {
  if (typeof fn !== "function") {
  	throw new Error("期待订阅者是个函数类型");
  }
  listeners.push(fn);
  // 用于取消订阅
  return function describe() {
  	const idx = listeners.indexOf(fn);
    listeners.splice(idx, 1);
  };
}
```

### dispatch

`dispatch`接受一个action对象，该action对象会传入到`reducer`中，`reducer`是我们在创建`store`传入的。`reducer`约定会通过`action`的type来返回新的state，那其实`dispatch`的原理也就很简单了。我们只要把传入的action传入到`reducer`函数中，返回新的state赋值给`currentState`就可以了。看代码：

```javascript
// 改变数据的唯一方法（约定）
function dispatch(action) {
  currentState = reducer(currentState, action);
  // 别忘了，数据改变后，要通知所有的订阅者。
  listeners.forEach(fn => fn());
}
```

是不是超Easy？抛去`redux`的概念，其实我们就是通过闭包的概念，来操作内部的数据，从而实现状态管理。

```diff
- import { createStore } from 'redux'
+ import createStore from "../mock/redux";
```

我们将`src/store/index.js`文件中`createStore`替换成我们的，再次执行看下，效果是一致的。[demo源码](https://codesandbox.io/s/jtyxk )

## React-Redux的基本使用

我们定义好`store`，然后通过`react-redux`提供的`Provider`向下注入依赖`store`。

```javascript
import store from "./store/index";
import { Provider } from "react-redux";

// 忽略无关代码

ReactDOM.render(
  <Provider store={store}>
    <APP />
  </Provider>,
  rootElment
);
```

我们在需要依赖state的组件文件中使用`react-redux`提供的`connect`对组件进行高阶包裹。其中我们向传connect函数传入俩个参数，分别是`mapStateToProps`和`mapDispatchToProps`，作用跟名字相同，`react-redux`会把俩个函数执行，将返回值都以`props`的形式传入到组件中。

```javascript
import { connect } from "react-redux";

// 忽略无关代码

function mapStateToProps(state) {
  return {
    count: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    increment() {
      dispatch({
        type: "INCREMENT"
      });
    },
    decrement() {
      dispatch({
        type: "DECREMENT"
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App); // App组件接受到的props中 包括 count、increment、decrement
```

我们只要在App组件从`props`中解构出值`进行使用。

```javascript
function App(props) {
  const { count, increment, decrement } = props;
  return (
    <div className="App">
      <p>当前count: {count}</p>
      <button onClick={increment}>增加1</button>
      <button onClick={decrement}>减少1</button>
    </div>
  );
}
```

乍一看代码量很多，但解决了组件嵌套的问题，当嵌套组件需要依赖state时候，我们只需要用`connect`进行包裹，传入`mapStateToProps`就可以。而且不需要我们手动订阅`store`的变化，从而触发组件的渲染。那它是如何工作的呢？我们接下来分析一波，并动手实现一个简易的`react-redux`。

## 实现简易版React-Redux

首先我们忘记`react-redux`的存在，尝试直接在`react`组件中使用`redux`，我们需要在组件渲染前获取到所需的`state`。并且订阅`store`，当其`state`变化后，我们要重新渲染该组件从而获取到最新的state。代码如下：

```javascript
class App extends React.Component {
  componentDidMount() {
    // 订阅
    this.describe = store.subscribe(() => {
      // 强制渲染
      this.forceUpdate();
    });
  }
  componentWillUnmount() {
    // 取消订阅
    this.describe();
  }

  increment = () => {
    store.dispatch({
      type: "INCREMENT"
    });
  };

  decrement = () => {
    store.dispatch({
      type: "DECREMENT"
    });
  };

  render() {
    // 获取当前状态并赋值
    const count = store.getState();
    return (
      <div className="App">
        <p>当前count: {count}</p>
        <button onClick={this.increment}>增加1</button>
        <button onClick={this.decrement}>减少1</button>
      </div>
    );
  }
}
```

我们可以发现，**获取所需state**和**订阅store重新渲染组件**是每一个需要依赖`redux`组件都需要的，所以我们应该抽离出公共部分。

### connect

在类组件我们想要复用逻辑只能通过`HOC`[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)来实现，`connect`函数其实就是生成高阶组件。下面我们先写个最基本的connect函数：

```javascript
/**
 * 通过传入mapStateToProps/mapDispatchToProps生成高阶组件
 * 并把所需state通过props传入组件
 * @param {function} mapStateToProps
 * @param {function} mapDispatchToProps
 */
function connect(mapStateToProps, mapDispatchToProps) {
  return function wrapWithConnect(WrapperComponent) {
    return function ConnectFunction(props) {
      // 获取到所需state，触发dispatch的函数
      const stateProps = mapStateToProps(store.getState());
      const dispatchProps = mapDispatchToProps(store.dispatch);
      // 执行强制渲染
      const [, forceRender] = useReducer(s => s + 1, 0);
      // 订阅store变化
      useEffect(() => {
        const describe = store.subscribe(forceRender);
        return describe;
      }, []);

      return <WrapperComponent {...props} {...stateProps} {...dispatchProps} />;
    };
  };
}
```

**注**：因为函数组件没有`this.forceUpdate`方法，所以通过`useReducer`自增实现同样的效果。

上述代码把**获取所需state**和**订阅store重新渲染组件**俩部分都抽离了出来，使我们可以在需要使用`store`中数据时，直接通过`connect(mapStateToProps)(Comp)`对组件进行包裹即可。

但现在还有**俩个问题**需要优化。**1**.是我们现在的store是直接引入的，无法支持动态的store ，**2**.是目前为止，我们store变化就会重新渲染，当我们所依赖的值没有改变时，我们无需重新渲染。

### Provider

我们先解决上面的说的第一个问题，想支持动态的store，我们就需要实现`react-redux`中的`Provider`组件，看名字大家应该知道它是基于`react context`实现的，没错，要实现动态store，我们需要使`Provider`向下注入依赖，然后在`connect`包裹组件的时候，通过`context`来获取最新store。

```javascript
import storeContext from "./storeContext";
// storeContext就是通过React.createContext()生成context

const Provider = ({ store, children }) => {
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export default Provider;
```

`Provider`组件就这么简单，接下来我们需要修改`connect`函数

```javascript
import storeContext from "./storeContext";
// 忽略无关代码...
const store = useContext(storeContext);
// 获取到所需state，触发dispatch的函数
const stateProps = mapStateToProps(store.getState());
const dispatchProps = mapDispatchToProps(store.dispatch);
// 订阅store变化
useEffect(() => {
  const describe = store.subscribe(forceRender);
  return describe;
}, [store]);

// 忽略无关代码...
```

通过`react`提供的`useContext()`来获取到当前`store`，`useEffect`第二个参数依赖store，当store本身变化时，也会重新订阅。这样我们第一个问题算是解决了。用法与`react-redux`也大体相同。

**再解决第二个问题**：我们现在订阅store中state变化，还是很暴力的(直接强制重新渲染)。要解决这个问题也很简单，我们只要订阅的回调函数中，加入新老值的比较，当不相同时，我们才执行`forceRender`。

```javascript
// src/react-redux/connect.js
import shallowEqual from "shallowequal";

function connect(mapStateToProps, mapDispatchToProps) {
  return function wrapWithConnect(WrapperComponent) {
    return function ConnectFunction(props) {
      const store = useContext(storeContext);
      const lastStateProps = useRef({}); // 保存最新的state
      const lastDispatchProps = useRef({});

      // 执行强制渲染
      const [, forceRender] = useReducer(s => s + 1, 0);

      // 订阅store变化
      useEffect(() => {
        lastStateProps.current = mapStateToProps(store.getState());
        lastDispatchProps.current = mapDispatchToProps(store.dispatch);
      }, [store]);

      // 订阅store变化
      useEffect(() => {
        forceRender();
        function checkForUpdates() {
          const newStateProps = mapStateToProps(store.getState());
          // 执行浅比较
          if (!shallowEqual(lastStateProps.current, newStateProps)) {
            console.log('render')
            // 赋值最新的state
            lastStateProps.current = newStateProps;
            forceRender();
          }
        }
        const describe = store.subscribe(checkForUpdates);
        return describe;
      }, [store]);

      return (
        <WrapperComponent
          {...props}
          {...lastStateProps.current}
          {...lastDispatchProps.current}
        />
      );
    };
  };
}
```

我们引入`shallowequal`对新老state进行浅比较，当不相等时，才进行`forceRender`。

```diff
- import { Provider } from "react-redux";
+ import { connect, Provider } from "./react-redux";
```

现在，我们将App组件中的`Provider`、`connect`替换掉，代码是可以正常的使用。[完整demo]( https://codesandbox.io/s/react-redux-demo-00x44 )

### useSelector

上面实现了`connect`用于共享逻辑，虽然函数组件也可以通过它进行包裹使用，但`React Hook`的出现让我们对于逻辑复用有了更好的办法，那就是自己写一个`Hook`。`useSelector`是`react-redux`官方已经实现了的。具体的使用如下：

```java
const count = useSelector(state => state.count)
```

通过传入一个`选取函数`返回所需要的state，其实这里的`选取函数`相当于是`mapStateToProps`。我们来动手实现以下。

```javascript
import storeContext from "./storeContext";

export default function useSelector(seletorFn) {
  const store = useContext(storeContext);
  return seletorFn(store.getState());
}
```

现在我们可以执行`useSeletor`获取到所需要的state，接下来我们要做的就是**订阅store重新渲染**，其实就是我们实现connect中函数组件的代码，我们直接copy过来改一下

```javascript
import storeContext from "./storeContext";
import shallowEqual from "shallowequal";

export default function useSelector(selectorFn) {
  const store = useContext(storeContext);

  const lastStateProps = useRef();
  const lastSelectorFn = useRef();

  // 执行强制渲染
  const [, forceRender] = useReducer(s => s + 1, 0);

  // 赋值state
  useEffect(() => {
    lastSelectorFn.current = selectorFn;
    lastStateProps.current = selectorFn(store.getState());
  });
  
  // 订阅store变化
  useEffect(() => {
    function checkForUpdates() {
      const newStateProps = lastSelectorFn.current(store.getState());
      if (!shallowEqual(lastStateProps.current, newStateProps)) {
        console.log("render");
        lastStateProps.current = newStateProps;
        forceRender();
      }
    }
    const describe = store.subscribe(checkForUpdates);
    forceRender();
    return describe;
  }, [store]);

  return lastStateProps.current;
}
```

**注意**：这里需要使用`lastSelectorFn`Ref存储`选择器`，否则useEffect依赖`selectorFn`会造成死循环。

### useDispatch

实现`useDispatch`就超简单了，就是直接返回`store.dispatch`就好

```javascript
import { useContext } from "react";
import storeContext from "./storeContext";

export default function useDispatch(seletorFn) {
  const store = useContext(storeContext);
  return store.dispatch;
}
```

## 总结

本文中实现的`redux`、`react-redux`都只是实现了一小部分API，并且没有处理异常情况。但与源码的核心大体相同。希望阅读完的小伙伴有所收获，如果不过瘾还可以去阅读下源码哦。

##  推荐

[redux好文章]( https://github.com/brickspert/blog/issues/26 )

[ 完美拥抱 React Hooks 的状态管理器hox]( https://github.com/umijs/hox/blob/master/README-cn.md )
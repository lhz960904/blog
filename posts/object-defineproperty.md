---
title: Object.defineProperty的使用
date: 2019-05-25
category: 技术
tags:
  - javascript
---

Object.defineProperty()，它的作用是可以通过该API直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。Vue框架内部大量使用了此API为对象定义属性，其响应式原理也是通过此API自定义setter与getter而完成的。

<!-- more -->

在平时的业务开发中，`Object.defineProperty()`基本上使用不到，因为在对象上定义一个新属性直接通过`.`运算符就可以，例：`obj.a = 123`。但通过该API可以对一个对象属性做更多的事情，比如数据的拦截、自定义setter与getter等。

## 概念
> Object.defineProperty(obj, prop, descriptor)

- **obj**：要在其上定义属性的对象
- **prop**：要定义或修改的属性的名称
- **descriptor**：将被定义或修改的属性描述符

前俩个参数很简单明了，就是指出要在哪个对象上定义或修改哪个属性。重要的是属性的描述符，当我们通过`.`运算符定义或修改属性的时候，其实等同于调用了`Object.defineProperty()`。如下：
```javascript
const man = {}
man.name = 'lihaoze'
Object.getOwnPropertyDescriptor(man, 'name')
// {value: "lihaoze", writable: true, enumerable: true, configurable: true}
```
```javascript
const man = {}
Object.defineProperty(man, 'name', {
  value: 'lihaoze',
  writable: true,
  configurable: true,
  enumerable: true
})
Object.getOwnPropertyDescriptor(man, 'name')
// {value: "lihaoze", writable: true, enumerable: true, configurable: true}
```
`value`顾名思义就是属性对应的值，但其不一定是必须存在的。它与setter、getter互斥。后面我们会讲到。那`writable`,`enumerable`,`configurable`具体是什么用处呢，我们接下来分别介绍。

## writable
> 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。

当我们通过`Object.defineProperty()`定义一个属性不设置`writable`属性，或者设置为false。那么我们将不能通过`.`的方式来修改属性值。

```javascript
const man = { name: 'lihaoze' }
Object.defineProperty(man, 'age', {
  value: 18,
  writable: false,
  configurable: true,
  enumerable: true
})
man.age = 22
alert(man.age) // 18
```
可以看到我永远都是18岁了😜，但总有人想试图揭穿我，所以Ta只要再使用该API重新定义`value`，就可以修改它。如下

```javascript
Object.defineProperty(man, 'age', {
  value: 22,
  writable: false,
  configurable: true,
  enumerable: true
})
alert(man.age) // 22
```
## configurable
> 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。所以，当configurable 为 false的时候，该属性的描述符就不能被修改了，也不能被删除。这是个不可逆的操作。

```javascript
const man = { name: 'lihaoze' }
Object.defineProperty(man, 'age', {
  value: 18,
  writable: true,
  configurable: false,
  enumerable: true
})
man.age = 22
console.log(man.age) // 22
delete man.age
// 无法删除该属性 
console.log(man.age) // 22 
// 尝试修改enumerable，无法再次修改描述符 Cannot redefine property: age
Object.defineProperty(man, 'age', {
  value: 18,
  writable: true,
  configurable: false,
  enumerable: false 
})
```
**但这里有个例外：当writable属性为true的时候，是可以修改成false的。** 看下面代码：
```javascript
// 这时，只有writable可以被修改成false，但false之后，就无法再修改成true
Object.defineProperty(man, 'age', {
  value: 18,
  writable: false,
  configurable: false,
  enumerable: true
})
man.age = 22
console.log(man.age) // 18
```

## enumerable
> 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
可以直到，这个描述符控制的是属性是否会出现在对象的属性枚举中，比如`for..in`循环，如果把`enumerable`设置成false，这个属性不会出现在枚举中，虽然仍然可以访问它。

```javascript
const man = { name: 'lihaoze', age: 18 }
Object.defineProperty(man, 'job', {
  value: 'Web Engineer',
  writable: false,
  configurable: true,
  enumerable: false 
})
console.log(man) // {name: "lihaoze", age: 18, job: "Web Engineer"}
console.log(Object.keys(man)) // ["name", "age"]
for (let key in man) {
  console.log(key) // name age
}
```

## set、get
> set: 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。

> get: 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象

**注意：当定义了一个属性的set、get描述符，则JavaScript会忽略该属性的value、writable属性。也就是说这俩对儿属于互斥的关系**

```javascript
const man = { name: 'lihaoze', birthYear: 1996 }
// 定义setter、getter,
// get、set方法不能使用本身属性，会造成堆栈溢出 Maximum call stack size exceeded
Object.defineProperty(man, 'age', {
  configurable: true,
  enumerable: true,
  get() {
    const date = new Date()
    return date.getFullYear() - this.birthYear
  },
  set(val) {
    // Uncaught Error: 无法修改真实年龄
    throw new Error('无法修改真实年龄')
  }
})
```
上面的例子通过出生年份来推算我的年龄，当设置年龄的时候，我们抛出错误，防止被修改。

```javascript
// 尝试定义value、writable描述符，会抛出错误
// Uncaught TypeError: Invalid property descriptor. 
// Cannot both specify accessors and a value or writable attribute
Object.defineProperty(man, 'age', {
  value: 15,
  configurable: true,
  enumerable: true,
  get() {
    const date = new Date()
    return date.getFullYear() - this.birthYear
  },
  set(val) {
    // Uncaught Error: 无法修改真实年龄
    throw new Error('无法修改真实年龄')
  }
})
```

## 应用

- 通过设置set描述符，来终止其他人修改值，并给出于友好的提示，如上面的代码⇧。其中Vue内部也是使用这个方法，来给出我们开发者友好的提示。举几个列子：
  ```javascript
  // 我们不用去弄懂defineReactive，只要知道该函数的第四个参数是定义的get函数，
  // 可以看到Vue在非生产环境，会为$attrs、props定义get，防止用户修改该属性，给出提示。
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
    !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
  }, true)
  defineReactive(props, key, value, () => {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        `Avoid mutating a prop directly since the value will be ` +
        `overwritten whenever the parent component re-renders. ` +
        `Instead, use a data or computed property based on the prop's ` +
        `value. Prop being mutated: "${key}"`,
        vm
      )
    }
  })
  ```

- 通过设置get描述符，来代理对象上面的值，在Vue中我们之所以可以使用`this.xxx`访问各种数据、方法、props、是因为Vue将这些都设置了set，从而代理到其他私有对象上。看下面代码:

  ```javascript
  const vm = new Vue({
    el: '#app'
    data: {
      msg: 'hello world!'
    }
  })
  vm.msg = vm._data.msg // true
  ```
  其中，Vues是通过`proxy`函数实现数据代理，Vue部分源码如下：
  ```javascript
  // 定义通用描述符
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  }
  // 设置set、get、实现将this[sourceKey]上的值代理到this[key]
  export function proxy (target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }
  // ... 忽略无关代码
  proxy(vm, `_data`, key)
  ```
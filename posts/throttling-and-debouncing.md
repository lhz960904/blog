---
category: 技术
tags:
  - javascript
date: 2019-03-13
title: JavaScript中的防抖函数与节流函数
---

JS中的防抖(debouncing)与节流(throttling)是用来控制一个函数在一定时间内执行的次数(频次)，他俩个用处相近、但又不完全相同。

<!-- more -->

## 出现原因
为什么会出现这俩个技巧呢？换句话说，为什么要控制函数执行的频次？我们看下面的动图，当我们在区域内进行滚动时，如果只是监听scroll事件就去执行函数的时候，函数在1s内被执行的次数要超过30次。

![](http://cdn.ihaoze.cn/QQ20190313-170819.gif)

如果我们在回调函数中做大量运算或Dom操作，函数如此高的执行频次就会造成页面的卡顿。为了避免这种情况，防抖与节流就起到了至关作用

## 防抖函数

> 当在一段时间内事件被连续调用时，防抖函数会控制这段时间内函数只会被执行一次。其基本原理就是当函数被调用时设置一个`setTimout`定时器来延时去执行真正的函数。

### 延时结束后执行(trailing)

![](http://cdn.ihaoze.cn/WechatIMG20703.png)

如上图，延时结束后执行是指在这段延时时间内，不再触发函数。则定时器结束后，真正的函数才会被执行。其原理是在真正函数被执行之前，如果函数再次被调用，则重置这个定时器。这种延时结束后执行是最普通、使用最频繁的一种。例如：
1. 当用户输入内容进行请求时，为避免无用的请求，当输入停止时进行请求。(对请求函数进行防抖控制)
2. 监听窗口改变时，我们只需要计算最终的窗口大小即可。(监听resize时，对回调函数进行防抖控制)

我们也可以点击下方demo，尝试不同频率的点击下方`Click`，观察防抖函数带来的改变。

<iframe height="300" style="width: 100%;" scrolling="no" title="Debounce. Trailing" src="https://codepen.io/lhz960904/embed/YgEvjq?height=252&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lhz960904/pen/YgEvjq'>Debounce. Trailing</a> by lihaoze
  (<a href='https://codepen.io/lhz960904'>@lhz960904</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### 延时开始前执行(leading)

![](https://camo.githubusercontent.com/48f5b715521474ca82958bd34e3e146b5d9b34f2/687474703a2f2f63646e2e6968616f7a652e636e2f5765636861744932303731372e706e67)

如上图，延时开始前执行是指在这段延时时间内，连续的触发函数，只会在最开始执行一次。其原理是设置延时器前执行一次真正的函数，这时定时器作用只是为了标识此次延时时间内不能执行函数。这种延时开始前执行使用场景比较少，例如：

1. 当用户点击刷新按钮时，可以尽早的执行函数。因为前后执行其实是一样的效果。本质上只是为了防止用户疯狂刷新

同样，我们可以点击下方demo，通过不同频率的点击`Click`进行测试。

<iframe height="300" style="width: 100%;" scrolling="no" title="Debounce. Leading" src="https://codepen.io/lhz960904/embed/drZeRg?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lhz960904/pen/drZeRg'>Debounce. Leading</a> by lihaoze
  (<a href='https://codepen.io/lhz960904'>@lhz960904</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 节流函数

> 节流函数的原理其实和防抖函数基本相同，不同的是，节流函数会设置一个最长等待执行时间，也就是说节流函数控制在一定时间内函数一定会执行一次。

像之前的防抖函数(延时结束后执行)，如果我们一直在触发事件，那延时器会一直处于重置状态，真正的函数永远不会被执行，而节流函数会保证在一定时间内，执行一次。想象一下，如果我们要实现触底加载功能，监听scroll事件，在滚动状态下，我们不仅要控制频次，还需要隔一段时间去检查距底部距离。 这时，我们就需要节流函数(throttle)来控制。

同样你可以通过下方demo进行左右侧的滚动测试，左侧因为使用debounce进行控制，只有当滚动停止时才会判断距底部距离，所以会造成卡顿的效果，而右边的通过throttle控制，体验上要好。

<iframe height="300" style="width: 100%;" scrolling="no" title="throttle" src="https://codepen.io/lhz960904/embed/RdjEoE?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lhz960904/pen/RdjEoE'>throttle</a> by lihaoze
  (<a href='https://codepen.io/lhz960904'>@lhz960904</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 参考

- [https://css-tricks.com/debouncing-throttling-explained-examples/](https://css-tricks.com/debouncing-throttling-explained-examples/)

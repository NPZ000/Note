从 vue 源码看 $nextTick 为什么可以获取到最新的 Dom
```js
<template>
    <p id='text'>{{text}}</p>
    <button @click='change'>click</button>
</template>
<script>
    export default {
        data() {
            return {
                text: 'hello world'
            }
        }

        methods: {
            change() {
                this.text = 'hello girl'
                const textElement = document.getElementById('text')
                console.log(textElement.innerHTML)
            }
        }
    }
</script>
```
相信会用 vue 的同学们应该都知道，这里的 change 方法里面打印的 textElement.innerHTML 的值还是 'hello world'，并不是修改之后的 'hello girl'，如果想要输出的是修改后的是 'hello girl'，就需要使用 $nextTick，像这样
```js
this.text = 'hello girl'
await this.$nextTick()
const textElement = document.getElementById('text')
console.log(textElement.innerHTML)
// 或者这样
this.$nextTick(() => {
    const textElement = document.getElementById('text')
    console.log(textElement.innerHTML)
})
```
这样就可以输出‘hello girl’ 了。
那么，为什么用了 $nextTick 就可以了呢，vue 在背后做了哪些处理，接下来本文将从 vue 的源码深入了解 $nextTick 背后的原理。
在看源码之前，先来搞明白一个问题，为什么我们在修改数据之后，并没有拿到最新的 dom 呢
Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
以上是 vue 官网上给出的解释，第一句话是重点，解答了上面提出的那个问题，因为 dom 更新是异步的，但是我们的代码却是同步执行的，也就是说数据改变之后，dom 不是同步改变的，所以我们不能直接拿到最新的 dom。下面就从源码里来看 dom 是何时更新的，以及我们为什么用了 $nextTick 就可以拿到最新的 dom。
首先这个问题的起因是数据改变了，所以我们就直接从数据改变之后的代码看
```js
function defineReactive() {
    // src/core/observer/index.js
    // ...
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        const value = getter ? getter.call(obj) : val
        if (Dep.target) {
          dep.depend()
          if (childOb) {
            childOb.dep.depend()
            if (Array.isArray(value)) {
              dependArray(value)
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        const value = getter ? getter.call(obj) : val
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (process.env.NODE_ENV !== 'production' && customSetter) {
          customSetter()
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) return
        if (setter) {
          setter.call(obj, newVal)
        } else {
          val = newVal
        }
        childOb = !shallow && observe(newVal)
        dep.notify()
      }
    })
    // ...
}
``` 
这个方法就是用来做响应式的，多余的代码删掉了，这里只看这个 Object.defineProperty，数据改变之后会触发 set，然后 set 里面，中间的一大堆都不看，看最后一行 `dep.notify()`，这个就是用来数据改变之后发布通知的，观察者模式嘛，都懂的哈，然后就接着来看这个 `notify` 方法里面做了什么，不用再找这个 `dep` 了，直接快捷键跳转函数定义，嗖一下，很快的
```js
// src/core/observer/dep.js
class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // ...

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```
这个 Dep 类就是用来收集响应式依赖并且发布通知的，看 notify 方法，遍历了所有的依赖，并且挨个触发了他们的 update 方法，接着再看 update 方法
```js
export default class Watcher {
  // src/core/observer/watcher.js
  // ...
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  // ... 
}
```
这个 watcher 类可以理解为就是一个侦听器或者说是观察者，每个响应式数据都会对应的有一个 watcher 实例，当数据改变之后，就会通知到它，上面那个 Dep 收集的就是他，看里面的这个 update 方法，我们没用 lazy 和 sync，所以进来之后执行的是那个 queueWatcher 方法，
```js
function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```
可以看到这个方法接收的是一个 watcher 实例，方法里面首先判断了传进来的 watcher 是否已经传过了，忽略重复触发的 watcher，没有传过就把它 push 到队列中，然后下面看注释也知道是要更新队列，把一个 flushSchedulerQueue 方法传到了 nextTick 方法里面，这个 flushSchedulerQueue 方法里面大概就是更新 dom 的逻辑了，再接着看 nextTick 方法里面是怎么执行传进去的这个更新方法的
```js
// src/core/util/next-tick.js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
我们在外面调用的 $nextTick 方法其实就是这个方法了，方法里面先把传进来的 callback 存起来，然后下面又执行了一个 timerFunc 方法，看下这个 timerFunc 的定义
```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
这一堆代码就是异步处理更新队列的逻辑了，在下一个的事件循环“tick”中，去刷新队列，依次尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果以上执行环境都不支持，则会采用 setTimeout(fn, 0) 代替。
然后再回到最初的问题，为什么用了 $nextTick 就可以获取到最新的 dom 了 ?
我们再来梳理一遍上面 dom 异步更新的整个流程，修改数据之后，发布通知，触发 Watcher 中的 update 方法，然后把 Watcher 缓冲到队列，刷新队列的方法(其实就是更新 dom 的方法)传到 nextTick 方法中，nextTick 方法中把传进来的 callback 都放在一个数组 callbacks 中，然后，然后你调用了 nextTick 方法，传进来一个获取最新 dom 的回调，这个回调也会推到之前那个数组 callbacks 中，然后遍历 callbacks 并执行所有回调的动作放到了微任务或者下一轮的宏任务中，到这（假设你后面没有其他的代码了）所有的同步代码就执行完了，然后开始执行微任务队列中的任务（假设环境支持promise.then)，更新 dom 的方法是最先被推进去的，所以就先执行，你传进来的获取最新 dom 的回调是最后传进来的所以最后执行，显而易见，当执行到你的回调的时候，前面更新 dom 的动作都已经完成了，所以现在你的回调就能获取到最新的 dom 了


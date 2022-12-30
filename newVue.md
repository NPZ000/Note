从 Vue 源码看 new Vue 背后发生了什么
# 前言：当我们看 Vue 源码的时候，应该看些什么
当我还是个小白的时候，在网上看到大家都在说看 Vue 源码，年少无知的我，怀着对技术的一腔热情，把官网上提供的那个 CDN 地址输入到了浏览器的地址栏，那是我第一次见到那么多那么多的代码，天啊，这要怎么看，一行一行看吗，那时的我还以为大家都是这么看的，我看不懂只是因为我菜而已，结果自然是放弃了，我告诉自己，你太菜了，还没有那个看源码的能力，还是以后再说吧。后来我才知道看源码是要去 Github 上把代码 clone 下来看的，然后我去 clone 下来了，打开之后，看着一堆文件夹，我又晕了，还是不知道该从何下手，直到有一次，在一位大佬的文章中看到一句话，看源码要带着问题去看，不能一头扎进去，再后来，跟着前人的脚步，学习了 Vue 中 `nextTick` 以及 `diff` 的源码，然后发现好像也没有那么难嘛。
这一次，我的问题是 `new Vue()` 背后的具体逻辑是怎么样的，弄清楚这个问题，可以说就相当于是推开了 Vue 源码的大门了。
这个问题还是比较复杂的，所以建议把 Vue 源码跑起来，打断点调试，从一个具体的例子来看整个代码逻辑是怎么流转的，如何跑起来 Vue 源码并可以调试的步骤推荐这位大佬的文章 https://juejin.cn/post/6949370458793836580 。
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <div id="app">
    {{ msg }}
  </div>
  <script src="../dist/vue.js"></script>
  <script>
    debugger
    new Vue({
      el: '#app',
      data: {
        msg: 'hello vue'
      }
    });
    
  </script>
</body>
</html>
```
下面就从这个很简单的例子来讲
```js
// src/core/instance/index.js
function Vue (options) {
  this._init(options)
}
```
当代码执行到 `new Vue` 之后就从这里开始了，里面执行了一个 t`his._init` 方法，接着看这个方法
```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    //...

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    // 如果是组件
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    // expose real self
    vm._self = vm
    initLifecycle(vm) 
    initEvents(vm)    
    initRender(vm)    
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    //...

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```
进来之后，首先往 `vm` 上设置了两个属性，`uid` 和 `isVue`，然后判断了是否是组件，这里不是组件，所以走 `else` 分之，合并了传入的 `option` 和 `vue` 自身的 `option`，然后下面调用了一堆初始化的方法，其中还调用了 `beforeCreate` 和 `create` 两个生命周期方法，这里重点看 `initState` 方法
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
判断是否传入了 `props`、`methods`、`data`、`computed`、`watch`，并且分别对他们进行一个初始化的操作，这里咱们只传入了 `data`，就只看 `initData`
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // proxy data on instance
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    proxy(vm, `_data`, key)
  }
  // observe data
  observe(data, true /* asRootData */)
}

function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
取出 `data` 中的数据，遍历，通过这个 `proxy` 方法将其代理到 `vm` 上，然后我们就可以通过 `this` 直接对数据进行读写了，再之后调用了 `observe` 方法
```js
function observe (value: any, asRootData: ?boolean): Observer | void {
  if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 调用 Observe 类
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    
    this.walk(value)
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    // 遍历所有的数据 对其进行响应式的操作
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
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
}
```
这个 `observe` 就是 `Vue` 的响应式系统了，重点是这个 `defineReactive` 方法，在其中可以看到我们常说的 `Object.defineProperty`，`Vue` 用这个方法劫持对 `data` 中所有数据的读写操作，在 `get` 中进行了响应式依赖的收集，在 `set` 方法中发布了数据变更的通知，这就是观察者模式了。
`initState` 方法到这就完了，再回到最刚开始的 `_init` `方法中，initState` 方法下面又调用了 `created` 生命周期方法，到这，整个 `create` 周期就算是完成了，现在应该对 `create` 阶段做的事情有一个大概的了解了。
接着往下看，调用了 `$mount` 方法，这个方法在整个源码中有好几处定义，不知道到底是哪个，所以就跟着断点往下走
```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  // 不能往 body 和 html 上挂载
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

    }
  }
  return mount.call(this, el, hydrating)
}
```
首先保存了原型上已有的 `mount` 方法，这个一会再说，先往下看，重写了原型上的 `mount` 方法，方法内首先判断了不能往 `body` 和 `html` 上挂载，然后判断是否传入了 `render` 方法，接着判断是否有 `template`，在我们的例子中都没有，所以会去获取传入 `el` 的 `outerHTML`，接着传入 `compileToFunctions` 方法中，这个方法里面很复杂，这里就不展开讲了，总之它会返回一个 `render` 函数并设置在 `options` 上，长这个样子
```js
(function anonymous(
) {
    with(this){return _c('div',{attrs:{"id":"app"}},[_v("\n    "+_s(msg)+"\n  ")])}
})
```
方法内最后调用了原来原型上的 `mount` 方法
```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
执行了 `mountComponent` 方法，显而易见，这才要真正的准备挂载了
```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  callHook(vm, 'beforeMount')

  let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
首先调用了 `beforeMount` 这个生命周期方法，然后定义了一个 `updateComponent` 方法，之后，调用了 `Watcher` 类，传入了 `vm` 和  `updateComponent` 方法
```js
export default class Watcher {
  //...

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  //...

}
function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```
首先执行构造函数，传进来的 `updateComponent` 方法赋值给了 `getter`，接着执行了 `get` 方法，在 `get` 方法中首先执行了一个 `pushTarget` 方法并传入了 `this` 也就是当前这个 `watcher`，看这个方法的定义把传入的 `watcher` 设置到了` Dep.target` 上，接着去执行了 `getter` 方法，也就是传进来的 `updateComponent` 方法，再回到原来 `updateComponent` 的定义的地方
```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```
先执行 `_render` 方法
```js
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      //...
    } 
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```
取出 `options` 上的 `render` 方法，也就是刚才生成的那个 `render` 方法，下面这个 `if` 跳过，我们这里没有父节点，再接着，就是去执行了 `render` 方法，执行 `render` 方法的时候，会去读取变量在 `data` 中设置的值，在我们的示例代码中就是 `msg` 的值，读取的时候就会触发之前用 `Object.defineProperty` 设置的 `get`，再回头来看下 `get` 中做了什么
```js
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
```
这里判断了 `Dep.target`，还记得吗，上面是把当前的 `watcher` 赋值给了他，所以进入到这个 `if` 分支，执行 `dep.depend()`,再跳转到 `Dep` 类找到这个方法
```js
depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
}
```
执行 Dep.target.addDep(this)，其实就是执行的 Watcher 类的 addDep 方法
```js
// Watcher
addDep (dep: Dep) {
    dep.addSub(this)
}

// Dep
addSub (sub: Watcher) {
    this.subs.push(sub)
}

notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
}
```
调用 `Dep` 类的 `addSub` 方法，传 `this` 进去，这就算是收集当前这个依赖完成了。之后当数据变更的时候，就会触发 `Dep` 类中的 `notify` 方法，遍历这个 `subs` 数组，挨个触发他们的 `update` 方法，进而触发后面的视图更新逻辑

render 方法之后的逻辑就不细说了，总之它最后会返回一个 `VNode` 节点，长这个样，也就是我们常说的虚拟 `dom` 了，最后把这个 `vnode` 返回，传给外面的 `_update` 方法，执行
```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
  }
```
因为我们是首次创建，所以没有上一个节点，走 `if` 分支，调用 `patch` 方法，
```js
  function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        // 拿到父节点
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // ...

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```
我们上面是把 `el` 当作第一个参数传入的，`patch` 方法中，第一个参数是当作旧节点，第二个参数是新节点，在这个方法里，主要的逻辑就是生成新的元素插入到页面中，然后把旧的节点移除
```html
<!-- 移除 -->
<div id="app">{{msg}}<div> 
<!-- 新增 -->
<div id="app">hello vue<div>
```
走完这个方法之后，就可以看到页面的最终效果了，此时，`new Watcher` 的逻辑也就走完了，再回到之前的 `mountComponent` 方法中，接着执行 `mounted` 回调，此时页面已经是最终态了，所以我们在这个生命周期内可以获取到最新的 `dom`。到这，就已经走完了最开头的那个 `init` 方法，也就是 `new Vue()` 的所有逻辑了。

总结一下，new Vue() 的时候做的所有工作主要分为两个阶段：create 和 mount
1. create 阶段主要做的事情是做一些初始化的操作，最主要的是处理 data 中的数据，将其变为响应式数据
2. mount 阶段做的事情分为两部分，第一部分是将 template 编译成一个 render 函数，第二部分是执行 render 函数，拿到虚拟 dom 节点，之后再渲染到页面上
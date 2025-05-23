** ref 和 reactive 的区别
相同点：都是把数据变成响应式数据
不同点：
1. ref 一般用来处理基本类型的数据，底层还是用的 Object.defineProperty 的 get 和 set 来对数据进行的一个劫持处理，如果要改变值或者读取值的话，需要.value，如果给 ref 一个引用类型的数据，底层会再调用reactive
2. reactive 用来处理引用类型的数据，数组或者对象，使用 proxy 来实现数据的响应式，修改和读取无需.value

*** proxy 实现响应式
用 proxy 进行代理，拦截对象中数据的改变，读取，和删除
拦截到之后，用 reflect 对源对象的数据进行一些操作

*** vue2 对数组的处理
无法监听到通过索引添加的数据，以及直接设置length
重写了数组的七个方法：
    1. 修改 __proto__ 指向重写的方法
    2. 对于 push unshift splice 方法，对于新插进来的数据要进行响应式处理

*** vue2 对于对象的处理
无法监听到对象成员的删除和添加，

** watch 和 watchEffect 的区别
watch的第一个参数：ref，响应式数据，getter 函数（也就是会有一个返回值的函数）
watch需要显示的指定要监听谁，可以访问到变化前后的值，懒执行，数据不变就不执行，除非设置第三个参数imidiate为true
watchEffect 每次加载都会执行，无需显示的指定要监听谁，只能取到最新的值，设置flush：post 可以在组件更新之后再执行，也就是说可以拿到最新的dom
如果需要在页面初始化的时候就执行，就使用 watchEffect
如果需要在组建更新之后再实行就使用 watchPostEffect

** key的作用是为了给元素添加一个唯一标示，加快diff效率，让diff可以精确的知道，改动的地方是哪

## vue2 vs vue3
1. 语法结构
vue2 的 template 必须有一个根元素来包裹所有元素， vue3 不需要
2. 生命周期
vue3 用 setup 代替了 vue2 的 beforeCreate 和 created，然后其他的生命周期都需要写在 setup 里面，然后是名字有点改变，beforeMount 变成了 onBeforeMount，mounted 变成了 onMounted，卸载变成了 onUnMunted,卸载前是 onBeforeUnMount
3. 响应式数据的声明
vue2 中是用 data 方法返回了一个对象，在 vue3 中是用 ref 和 reactive 来声明响应式数据，ref 用来声明基本类型的数据，读取的时候需要 .value, 在 template 中不需要用 .value，reactive 声明复杂类型的数据，最后需要返回将所有声明的响应式数据进行返回，如果不使用 setup 语法糖，一般都不会区分基本类型数据用ref，引用类型数据用reactive，通常会都放在一个对象里用 reactive 来声明，最后返回的时候对整个对象 torefs 一下并解构一下，再返回，这样写起来更方便，因为可以一整个返回，如果说都是基本类型的数据，都用 ref 来声明，那么返回的时候，还得一个个写，就比较繁琐，使用 setup 语法糖的话，就不用最后 return 一下，这样就可以区分使用 ref 和 reactive
4. 方法
在 vue2 中，方法都是放在 methods 中，在 vue3 是直接放在 setup 里面，如果不使用 setup 语法糖的话，最后也需要返回一下
5. setup 方法
第一个参数是 props，不能直接对 props 进行解构，会丢失数据的响应性，如果确实需要解构，就用 torefs 操作一下，再进行解构
第二个参数是一个上下文对象 context，包含了一下可能会用到的属性，比如 attrs，等价于之前的 $attrs, slots 等价于之前的 $slots, emit 等价于之前的 $emit, z这个上下文对象是非响应式的，可以将这些数据直接解构出来使用
如果使用了 setup 语法糖的话，props 需要用 defineProps 定义一下，emit 需要用 defineEmits 
6. computed 
在vue2 中，computed 是一个对象，对象里面放自己自定义的函数，返回计算出来的值，
在 vue3 中，computed 是一个函数，接收一个 get 函数和一个 set 函数，如果只传一个，就默认是 get 函数，那么计算出来的值就是个只读的，如果两个都传，就需要放在一个对象里，分别标明是 get 和 set，函数返回一个 ref 对象，所以读取和写入值的时候还是需要通过value 属性的  
7. watch
在 vue2 中，watch 是一个对象，其中是自定义函数
在 vue3 中，watch 是一个函数，接收三个参数，第一个参数是要监听的值，可以是ref / reactive / 函数返回的值(reactive对象的属性)或者他们组成的数组，第二个参数是回调函数，函数接收的参数是新值和旧值，第三个参数是一些设置选项，侦听的时机等（immediate: true - 立即执行
8. watchEffect
是一个函数，接收两个参数，第一个是要运行的副作用函数，默认会立即执行，第二个参数用来调整副作用的刷新时机和调试，默认副作用是在组件渲染之前执行的，设置为flush：post 可以在组件下渲染之后执行
9. watchPostEffect 
同 watchEffect ，是在组件更新之后执行的，可以拿到更新之后的dom
10. watch vs watchEffect
watch需要显示的指定要监听的数据，并且可以拿到oldvalue，不设置immediate就不会立即执行，watchEffect不需要显示指定要监听的数据，会自动追踪访问到的响应式属性，拿不到oldvalue，会立即执行
11. 使用监听器拿到更新后的dom
设置flush: post, 或者使用watchPostEffect
12. 路由跳转
使用useRouter
13. mixin vs hooks
mixin 容易发生属性冲突，且无法向它传递参数，
hooks
14. v-for & v-if
vue2 中 v-for 优先于 v-if
vue3 中 v-if 优先于 v-for


## vue2 的 diff 流程
主要还是对比新旧节点，
1. 新节点存在，老节点不存在，就创建新节点
2. 新节点不存在，老节点存在，就删除老节点，
3. 新老节点都存在的情况，对比是否是同一节点，
    - 如果是同一节点，就对比节点的文本变化或者子节点的变化
    - 如果不是同一节点，就把新节点替换到老节点的父元素下，相当于直接替换掉老节点
是同一节点的情况，主要看新老节点的子节点
1. 只有新节点有子节点，就创建子节点
2. 只有老节点有子节点，就删除掉他的子节点
3. 如果都有子节点，就更新子节点
再看如何更新子节点，循环遍历两个子节点列表，
1. 新头和老头对比
2. 新尾和老尾对比
3. 新头和老尾比对，相同的话，会直接移动老尾到头部
4. 新尾和老头对比，相同的话，会移动老头到尾部
有相等的就对比两个节点的文本变化或者子节点变化，然后移动对比的下标，继续下一轮循环，如果都没有命中，就拿新节点的key去老的列表里找，没找到就新增，找到了再对比，
如果老的先遍历完，就添加新的还没有遍历到的节点，如果新的先遍历完，就删掉老的还没有遍历到的节点
头尾对比是为了可以快速检测出是否有翻转的操作，加快diff效率

## vue3 的diff
对静态的元素打了个标记，并且保存起来，之后更新的时候直接复用
头头对比，发现不同的就停下
尾尾对比，发现不同的就停下
然后找出剩下的元素的最长递增子序列，最后剩下的元素就是需要变动的元素

## 全局公共组件的实现
首先明确组件要实现的功能，比如说 message 组件就是一个简单的弹出框，显示一个提示内容，然后一小段时间之后消失
然后分析这个组件的设计，什么内容是可以配置的，提示内容肯定是必须配置的，然后就是一些可选的配置，比如显示时间，可以让用户自己传入一个时间，也可以用默认的配置，还有一些样式上的设置，比如文字内容是否居中显示等，再然后就是具体的代码实现了
1. 首先组件文件写好，组件内 props 接收配置
2. 然后再一个js文件，用来编写生成组件的方法，首先生成一个容器，用来放组件内容，根据接收到参数组装组件需要的props，然后把引进来的组件和 props 传入createVNode 方法，生成组件的vnode，然后把这个vnode 调用 render 方法渲染到刚才创建的容器内，然后设置定时器，一段时间之后销毁弹框，再次调用render 方法，传一个 null 进去，这就是生成组件的方法，
3. 然后把这个方法挂在在全局上，app.config.properties，在组件内调用的时候，需要先用 getCurrentInstance 方法获取到当前组件的实力，然后挂载到原型上的方法在 组件实例的 proxy 属性上


## 组件通信
1. props
```js
// parent
<child :a='1' />

// child
const props = defineProps([{a: String}])
// 如果要解构 props 就需要对他toRefs一下
console.log(props.a)
```
2. emit
```js
// parent
<child @myClick='handleClick' />

// child
const emits = defineEmits(['myClick'])

emits('myClick', 'valus')
```

3. expose/ref
```js
//child
defineExpose({
    name: 'a',
    handle: () => {

    }
})

// parent
<child ref='child'>
const child = ref(null)
child.value.name
child.value.handle()
```

4. attrs
接收所有没有被props和emits消费掉的透传下来的属性
中间的组件可以使用v-bind=‘$attrs’ 继续向下透传
```js
// parent
<child :a='1' :b='2'>

// child
defineProps({
    a: String
})

const attrs = useAttrs()
attrs.b

```

5. v-model
```js
// parent
<child v-model:key='key'>

//child
const props = defineProps(['key'])
const emits = defineEmits(['update:key'])

emits('update:key', 'new key')
```

6. provide/inject
```js
//parent
provide(key, value)

//child
inject(key) // value
```

7. vuex
```js
const store = useStore()
const count = computed(() => store.state.count)
```

8. mitt
需要安装引入
```js
// a
mitt.emit('a', 1)

// b
mitt.on('a', a => {
    console.og(a)
})
```

## Vue3的声明周期
OnBeforeMount
OnMounted
OnBeforeUpdate
OnUpdated
OnBeforeUnmount
OnUnmounted
OnActivated
OnDeactivated

## Vue3的性能优化
### 加载优化
- 构建与包体积优化
    1. 现代化的打包工具会对包产物进行 tree shake，如果没有用到的模块不会被打包进来
    2. 引入新的依赖时，尽量使用支持 ES 模块格式的依赖，比如 lodash-es 
- 代码分割
    1. 使用 defineAsyncComponent 对组件进行懒加载处理，这样组件只有在使用时才会被加载，现代的打包工具会对其进行分割，拆成独立的文件，不会在第一次就进行加载
### 更新优化
- props 稳定性
通常情况下，子组件会在至少有一个prop改变的情况下进行更新，可能有的时候组件的props改变了，但其实这个改变和他没有关系，比如一个listItem组件内部接受一个id 和 activeId ，组件内部判断这两个值相等来感知是否是自己被激活了，这样的话，每当activeId变化，每个listItem组件都会更新，但其实应该只有被激活的那个组件需要更新，所以可以把这个判断是否激活的逻辑放在父组件，子组件接受的是active = activeId === id，其实就是尽量保持props的稳定性
- v-once
如果一个元素只依赖组件初始化的一个数据，并且这个数据之后不会再发生变化，可以用v-once进行标记，在之后的更新，vue会将其标记为静态元素，在diff的过程中跳过对这部分的处理
- v-memo
可以传入依赖项数组，如果数组中的值没有发生变化，将不会进行rerender，通常用于长列表场景，可能这个长列表在两次更新之中，并没有发生变化，可以用v-memo，依赖项数组中写入强依赖更新的值
- 计算属性稳定性
如果computed返回的是一个引用类型的值，比如 { flag: true },即使 flag 的值每次都是true，但是因为对象的引用发生了变化，所以依然会触发更新，所以可以在 computed 内部进行手动判断，并返回一个基本类型的 boolean 的值
### 通用优化
- 虚拟列表
处理数据很长的列表
- 减少大型不可变数据的响应式开销
vue默认会对数据进行深度递归的响应式处理，这在大部分场景都没有什么问题，但是在数据的结构复杂或者嵌套层级过深的情况下会带来不小的性能负担，vue对此也提供了解决方案
    1. shallowRef()
    ref的浅层形式，和 ref 不同，浅层ref内部的值回原样保存和暴露，不会被深层递归转为响应式数据，只有对.vue的读写是响应式，如果有一个嵌套层级很深的数据，并且不需要在数据深层的属性发生变化时做一些事情，或者深层的属性不会单独被修改，如果会变只是整个数据一起变，这时候就可以用shallowRef，来减少一些vue对数据的响应式处理工作
    2. shallowReactive
    同上
- 避免不必要的组件抽象
相对于普通的dom节点来说，组件实例会带来更大的开销。所以尽量较少不必要的组件抽象

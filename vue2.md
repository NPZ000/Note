- key 的作用
当v-for在更新已经渲染过的列表时，如果不使用key，vue默认会使用就地复用的策略，如果顺序发生改变，不会移动dom元素去匹配数据的顺序，而是简单复用每个元素，确保他们在每个索引位置正确渲染，如果子节点是组件或者是带有状态的，原来的状态就会保留，就会出现渲染不正确的现象
如果使用了key 就相当于是给每个元素添加了一个唯一标识，然后基于key的变化重新排列元素的顺序，并且会移除key不存在的元素
说白了 key是为了新旧对比时 辨别元素的，最大程度上复用已有的元素，减少dom操作的开销，同时避免子节点状态错误的问题

常用指令

v-text 更新元素的文本

v-html 更新元素的innerHTML

v-on 绑定事件

v-show 控制元素的显示隐藏

v-if  控制元素的渲染

v-else-if  v-else 与上面组成流控制

v-model 在表单控件上创建双向绑定

v-bind  绑定一个或多个特性

v-slot 提供具名插槽或接受prop的插槽

v-once 只渲染元素或组件一次

v-show和v-if的区别 v-show是使用display属性去控制元素的显示 值为true移除display：none，为false是添加display：none；v-if 为true时渲染元素 为false不渲染元素

组件通信
父组件向子组件 通过props
父组件
<template>
   <div>
      <demo :msg='msgData' :math='mathData'></demo>
   </div>
</template>
<script>
import Demo from './Demo.vue'
   export default {
     data () {
       return  {
          msgData:'从父组件接收来的数据',
          mathData : 2
       }
     },
     components : {
       Demo
     }
   }
</script>



子组件
<template>
  <div>
     <p>{{msg}}</p>
     <p>{{math}}</p>
  </div>
</template>

<script>
export default {
  name: 'demo',
  props: [ 'msg' , 'math'],
}
</script>



子组件向父组件传递数据
父组件监听一个方法  子组件$emit 去触发他 传递值 父组件可以接收到

子组件
<template>
  <div>
      <p @click='emit'>{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'demo',
  data () {
      return {
         msg : '点击后改变数据',
      }
  },
  methods : {
      emit () {
         this.$emit('fromDemo')
      },
  }
}
</script>



父组件
<template>
  <div class="hello">
     <p>hello {{msg}}</p>
     <demo v-on:fromDemo='Fdemo'></demo>
  </div>
</template>
<script>
import Demo from './Demo.vue'
export default {
  name: 'hello',
  data () {
    return {
       msg: '数据将在一秒后改变'
    }
    
  },
  methods: {
    waitTime() {
      return new Promise(resolve=>{
        setTimeout(()=> {
            this.msg = '数据一秒后改变了'
            resolve(1)
        },1000)
      })
    },
    async Fdemo () {
        let a = await this.waitTime();
        console.log(a)
    }
  },
  components : {
     Demo
  }
}
</script>



使用v-model进行父子组件的双向数据绑定
<input v-model='a' />
等同于
<input v-bind:value='a' v-on:input='a=$event.target.value' />
意思就是使用了input的input事件 有输入值的时候就把值赋给a  然后再用v-bind绑在value上

思路同样可以使用在组件上  
<demo v-model='a'></demo>
等同于
<demo v-bind:value='a' v-on:input='a=arguments[0]'></demo>
现在v-on：input监听的就不是$event.target.value了  而是回调函数中的第一个参数
此时子组件就用props接收value  只能是value  因为v-model是为input框定制的  而value又是input框内置的

父组件
<template>
  <div class="hello">
    <button @click="show=true">打开model</button>
    <demo v-model="show"></demo>
  </div>
</template>

<script>
import Demo from './Demo.vue'
export default {
  name: 'hello',
  components: {
    Demo
  },
  data () {
    return {
      show: false
    }
  }
}
</script>




子组件
<template>
   <div v-show="value">
      <div>
         <p>这是一个Model框</p>
         <button @click="close">关闭model</button>
      </div>
   </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    close () {
      this.$emit('input',false)
    }
  }
}
</script>


现在子组件props接收的是value， emit监听的是input事件 但是如果子组件正好有一个value值 和input事件的话 就会造成冲突，可以使用model选项配置prop和event ，也就是接收的值和监听的事件，父组件不需要改，只在子组件中配置model就行了

<template>
   <div v-show="show">
      <div>
         <p>这是一个Model框</p>
        <input type="text" v-model="value">
        {{value}}
         <button @click="closeModel">关闭model</button>
      </div>
   </div>
</template>

<script>
export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  props: ['show'],
  data () {
     return {
       value: 10
     }
  },
  methods: {
    closeModel () {
      this.$emit('close',false)
    }
  }
}
</script>


有些时候 我们可能会想对一个prop进行双向绑定 当子组件改变那个值得时候 父组件中也做出相应改变 为了显示的追踪这种变化 可以使用.sync修饰符进行 监听
<demo :show.sync='foo'></show>
相当于
<demo v-bind:foo='show' @update:foo='val => show = val'></demo>
foo是子组件props从父组件接收的数据 ；show是要传下去的值，通过事件显示监听update:foo(foo是props显示监听的数据), 通过箭头函数执行回调 把接收到的参数也就是子组件emit事件传过来的值传给show 就完成了一个循环
当子组件需要改变props接收的值的时候 显示的触发一个事件
this.$emit('update:foo', value)
父组件的@update:foo 需要子组件显示的触发‘’
第一个参数是update显示更新的事件 后面跟着的 :foo  是要改变的props的值
第二个参数则是新的值  希望父组件foo要更新的值

父组件
<template>
  <div class="hello">
    <button @click="show=true">打开model</button>
    <demo :show.sync="show" ></demo>
  </div>
</template>

<script>
  import Demo from './Demo.vue'
  export default {
    name: 'hello',
    components: {
      Demo
    },
    data () {
      return {
        show: false
      }
    }
  }
</script>




子组件
<template>
   <div v-show="show">
      <p>这是一个Model框</p>
      <button @click="closeModel">关闭model</button>
   </div>
</template>
<script>
export default {
  props: ['show'],
  methods: {
    closeModel () {
      this.$emit('update:show',false)
    }
  }
}
</script>


如果要双向绑定多个值 依次写就行了
<demo :show.sync="show" :msg.sync="msg"></demo>

子组件改变父组件传过来的数据时，update冒号后面跟着的和父组件传进来的是同步的，要改变哪个就对应哪个

如果存在多层组件嵌套 最顶层组件想要往最底层组件传递数据的情况下 ，中间的组件不需要一直用props去接收 可以用$attrs一次性接收到 再一次性传下去
<template>
   <div>
      <next-demo v-bind="$attrs"></next-demo>
   </div>
</template>

如果最底层的组件想要和最顶层的组件通信 中间的组件可以使用$listeners将监听的事件传递下去，孙子组件在接收到 之后不需要用emit去触发了 ，直接调用即可
中间组件
<cc1 v-on="$listeners"></cc1>

孙子组件
<p @click="$listeners.change(1)">changeA</p>

### 兄弟组件通信
运用es6 模块的运行机制     当遇到import模块加载命令时，会生成一个只读引用，export的原始值变了，import加载的值也会变，
举个例子 在foo.js中 导出了一个count的值初始化为1 和一个 改变 count的方法，在bar.js中导入foo.js , 先打印count的值是1，再调用改变count的方法，再打印count的值，会发现count的值已经改变了

同理可以运用到兄弟组件中，定义一个额外的实例进行中转，然后需要通信的组件同时引用，一个emit触发 一个on监听就可以实现兄弟组件进行通信
```js
//Bus.js
import Vue form 'vue'
export default new Vue()

// A组件
import Bus form 'Bus.js'

change() {
    Bus.$emit('change', 1)
}

// B组件
import Bus from 'Bus.js'

create() {
    Bus.$on('change', val => console.log(val) )
}
```

还有几个简单粗暴的
this.$parent.x   可以直接获取到父组件的数据进行改变

在调用子组件的时候设置一个ref属性名为child，可以直接
this.$refs.child.method   这样去调用子组件的方法

### 生命周期
beforecreate 实例创建之前 此时没有数据没有dom

created 实例创建之后 可以拿到data数据了 ，但是dom还没生成

beforemount 实例挂载之前 dom有了 但是还没有render 没有解析data里的数据和模板标签 

mounted 实例挂载完毕 一般在这里去请求数据进行数据初始化 

beforeupdate 修改了数据 视图更新之前 

updated 数据修改 视图更新之后

beforedestroy 实例销毁之前

destroyed 实例销毁之后 消除与其他组件所有的关联 事件监听器

### 导航守卫

全局导航守卫 router.beforeEach  一般写在路由配置文件中 三个参数 to 要去的地方 form 要离开的地方 next 最后要调用这个方法来resolve这个钩子  可以在这里配合路由元信息做页面的权限判断

路由独享的守卫 直接在路由配置上定义 beforeEnter守卫
{
    path: '/',
    name: 'a',
    components: a,
        beforeEnter:  (to, from, next) => {
        
        }
}

组件内的守卫 直接在组件内定义
beforeRouterEnter  在渲染该组件的对用路由被confirm时调用 此时不可获取组件实例this
beforeRouterUpdate 当前路由改变 组件被复用时调用，比如在使用带动态参数的路径foo/:id  在foo/ 1 和foo/2 之间跳转 foo组件被复用了 此时就可以调用这个钩子
beforeRouterLeave 在离开当前路由是调用

### vue的数据双向绑定原理  
使用数据劫持结合发布者订阅者的模式，使用object.defineproperty劫持各个属性的geter seter，在数据变动时发布消息给订阅者 触发监听回调去更新对应的dom


### created和mounted中请求数据有什么区别

created的时候 页面视图还没有出现 如果请求信息过多 页面会长时间处于白屏状态 dom节点没出来 无法操作dom节点 在mounted中则不会这样

### keep-alive
会缓存包裹在里面的组件 可以设置include 缓存白名单 和exclude 黑名单 用正则去匹配 还可以设置max最多可以缓存多少组件 如果达到上限 最长时间没使用的那个就会被销毁

### watch和computed的区别
watch： 一个数据影响多个数据 当需要在数据变化时执行异步或者开销很大的操作时使用
computed： 一个数据受多个数据影响，是基于他的响应式依赖进行缓存的，只在相关响应式依赖发生改变时他才会重新求值
还有方法 方法是每当触发重新渲染时，调用方法将总会再次执行函数，如果不希望有缓存，可以使用方法，如果是求值开销较大时，还是建议使用计算属性

### 定义全局方法
挂载到vue的原型prototype上
利用全局混入mixin  this.$root.$on绑定方法  this,$root.$emit调用方法

### 解决动态设置img的src不生效的问题 
因为动态添加的src被当做静态资源处理了，没有进行编译 所以要加上require

### 解决vue项目打包后静态资源图片不生效的问题
通过配置alias路径别名来解决

### 修改vue打包后生成文件路径
vue-cli3设置publicpath

### 删除对象用delete和vue.delete有什么区别
delete 只是被删除对象成员成为空字符串或者undefined
vue.delete 直接删了对象成员 如果对象是响应式 可以确保触发更新视图 这个方法主要是为了避开vue不能检测到属性被删除的限制 

### vue不能监听对象的哪些变化 为什么  怎么解决
对象成员的删除和添加
因为 vue是通过Object.defineProperty为对象的属性添加getter和setter来追踪变化 但是只能监听到数据是否被修改  而不能监听是否被删除或者添加属性
解决办法
用this.$set方法  传入目标对象 键 和 新的值
或者使用object.assign方法

### vue不能监听数组的哪些变化  怎么解决
直接用索引值设置一个数组项
直接修改数组长度
还是用$set 传入原数组  索引  值

### EventBus注册在全局上 切换路由时会重复触发事件 怎么解决
在使用$on的页面中 最后要在组件销毁前使用$off去销毁

### 组件的name的作用
动态切换组件的时候  在is特性上用
引用组件的时候在components里用

### 为什么组件中data必须用函数返回一个对象
因为对象是引用类型 的，当重用组件时，由于数据对象都指向同一个data，不管谁改了里面的内容，都会影响其他的组件，如果使用函数返回一个对象，由于每次返回的都是一个新对象，引用地址不同 ，就不会出现这个问题了

### key除了在v-for中用，还有什么用
可以直接加在元素或组件上，可以强制替换元素或者组件而不是重用他，如果需要完整的触发组件的生命周期钩子或者要触发过渡可以这么来

### vuex
和全局变量的区别
vuex是响应式的，当组件从store中读取状态，store中的状态发生改变时，组件也会跟着更新
store中的状态不可以在直接更改 只能通过commit mutation来改变

### 怎么样批量使用state中的状态
使用mapstate辅助 函数，用对象展开运算符将state混入到computed中

### vue2 是如何重写数组的方法的
将数组的原型 Array.prototype 作为Object.create()的参数创建了一个新对象
实际上重写的是这个新对象的数组方法
在重写之前先保存了数组的原始方法，然后调用 Object.defineProperties 重写新对象的数组方法，在新方法的实现中，首先调用数组的原始方法，拿到正确的值，然后判断如果方法是push unshift splice，因为这几个方法会往数组中塞新元素，然后对新元素进行响应式依赖的收集，接着再发布数据变更的通知
在刚开始收集数据响应式依赖的时候，如果数据类型是个数组，就把它的 __proto__ 指向这个重写了数组方法的新的原型对象

### $nextTick的实现原理
首先明确vue 的dom更新流程，当响应式数据改变之后，并不会立即去更新dom，而是将watcher收集起来，然后传到nexttick里面，然后放在异步队列里，异步队列判断兼容性优先用微任务，promise.then，然后是oberverMutation（监听dom变化），然后是setimidiate，最后是setTimeout，为什么使用 $nexttick 能获取到最新的dom，因为nexttick内部维护了一个数组，用来存放需要异步执行的回调，包括更新dom，你传进来的回调肯定是在更新dom的回调之后的，等更新dom的回调执行完之后才能轮到你传进来的回调，此时也就能拿到最新的dom了

## 为什么 vue 不需要 react 的 fiber
react的fiber的原理是使用了时间分片的技术，主要是将更新虚拟dom的操作分割开，让他不会长时间占据js 的主线程，而导致页面掉帧，或者用户的操作得不到响应，让浏览器只在空闲时间来执行react的dom更新操作，用一会再把线程的使用权交出去，更新的操作可以中断
那么为什么react的更新虚拟dom的时间会很长呢，因为在react的实现中，一个父组件更新了，那么它的子组件会跟着更新，其实子组件的更新是一个无用的操作，如果说这个父组件里面嵌套的子组件非常深，那么当父组件更新时，这个更新的时间就会很长了，这就是react需要时间分片的原因，
vue 不需要，是因为vue 得益于响应式依赖的追踪，可以清楚的判断出到底是哪个组件需要更新，从而只需要去更新这个组件就可以了，只更新单个组件消耗的时间是不需要去做时间分片的

## 全局组件封装
先额外写好组件，在data里写好需要的配置，标题、提示语，显示的时间等，在额外写一个js，要先把vue和刚才写好的弹框组件import进来，然后调用vue的extend方法，把引进来的弹框组件传进去，生成一个子类 ，然后写一个方法，接收一个对象类型参数就是弹框需要的那些配置，方法里面首先new生成一个之前生成子类的实例，把参数传递进去，使用$mount方法挂载，之后$el可以拿到刚才生成实例的根元素也就是弹框了，appendchild到body里面，再之后在vue的nexttick钩子里，把控制弹框显示的值改成true，要记得在限制时间内，把弹框从body里面移除，不然会一直加新的进去，最后把这个方法export导出来，在main.js里引用，直接挂在vue的原型上，就可以全局调用了；或者暴露一个 install 方法。然后在 main js 文件中用 vue use 调用

## static 和 assets 的区别
两者都是存放静态资源文件
assets 文件夹下的内容在打包的时候会被处理，压缩之类的
static 下面的内容不会被处理，会跟着index.html 一起被上传到服务端

## hash 和 history 的区别
hash 路由的地址中会有一个 # 号，每次路由跳转只有 # 号后面的东西，也就是location.hash会变，并且不会向服务端发起请求，就算重新刷新页面也不会发起请求，并且会产生一条记录到浏览器的历史记录中，会监听 onhashchange 事件，不利于 seo
history 路由的地址看起来就是正常的地址，他是调用了 pushState 和 replaceState 方法，调用这个两个方法会改变url但是不会向服务端发起请求，url 改变之后，如果重新刷新页面，会向服务端发起请求，如果服务端没有做相应的处理，就会 404













换个角度来重新学习下事件循环
相信大家肯定在网上看过很多讲解关于浏览器事件循环的文章了，但是大部分文章其实只是讲解了宏任务、微任务的执行顺序（其实我也写过），例如下面这段代码
```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')
```
一个很常见的面试题，考察的知识点就是宏任务和微任务的执行顺序。但其实在浏览器的事件循环系统中会执行的事件远不止这些，还会有用户的交互事件、页面刷新、加载资源等等事件，可能你还写了一个 requestAnimationFrame 用来做动画，那么对于这么多的事件，浏览器是如何利用它的事件循环系统来做调度的呢？下面我会先从浏览器的视角来分析整个事件循环系统。
在分析浏览器的事件循环系统之前，先来简单说一下浏览器的进程结构。为了应对逐渐复杂的需求和安全考虑等多种原因，浏览器从最初的单进程架构逐渐演变成了今天的多进程架构，主要分为如下几个进程。
- 浏览器主进程：负责页面显示，用户交互，其他子进程的管理
- 渲染进程：解析 HTML、CSS、JS并渲染成页面
- GPU进程：用来合成动画
- 网络进程：发起请求加载资源
- 插件进程：运行插件

其中的渲染进程就是浏览器用来渲染页面和执行 JS 代码的地方，还会处理用户的交互事件以及垃圾回收等等，那么浏览器是如何调度这些事件的？
消息队列-所有产生的事件都会按照先进先出的顺序维护在消息队列中，有新的事件产生就加在队尾，然后渲染进程会依次从队列的头部取出一个事件来执行。
按照上述说法，试想一下，当用户点击页面的按钮产生了一个新的点击事件，然后这个事件被加到了消息队列的尾部，此时可能在他前面已经有很多事件在排队了，但是交互事件一定是要及时给到用户一个反馈的，所以此时就存在一个低优先级的任务阻塞高优先级任务的问题。那么浏览器是如何解决这个问题的呢？
在消息队列中，浏览器又维护了多个消息类型不同的队列，比如交互事件放在一个队列中，定时器的回调放在一个队列中，还有一些不重要的比如垃圾回收事件放在一个队列中，浏览器会根据不同的时机来动态调整这几个队列的优先级，然后取高优先级的事件来执行，比如在页面加载阶段，此时要尽可能快的先渲染出页面，那么就要优先解析页面；在交互阶段呢，要尽可能快的给到用户反馈，就得优先执行交互事件。
以上是我们从宏观角度来看的整个事件循环系统，下面我会根据几段示例代码从微观的角度来继续剖析事件循环系统。
```js
const el = document.createElement('div')
document.body.appendChild(el)
el.style.display = 'none'
```
看下这段代码，你可能会以为当元素被添加进去的时候，可以先看到这个元素显示出来，然后元素被设置了隐藏，这个元素又会从你的眼前消失，事实是这样吗？不是的。浏览器当然不会蠢到为你的每一行操作 DOM 的代码都去执行一次页面的刷新操作。然后在这里我们思考一下，当这段代码都执行完之后，会触发页面刷新吗？不会的，这段代码只是修改了 DOM 树，而页面渲染不是照着 DOM 树去渲染的，因为 DOM 树还包括 header 标签，script 标签还有设置为 display: none 的元素，这些是不需要渲染的，在生成 DOM 树以及样式表之后，在布局阶段根据 DOM 树又生成了一颗布局树，这里面才是真正要渲染出来的东西，再来重新看一下这段代码，他确实改变了 DOM 树的结构，但实际上插入的元素设置了 display: none，他是不需要渲染出来的，也就是说原来的布局树并没有变化，所以也就不需要重新刷新页面。
接下来我们来分析一下 SetTimeout 和 requestAnimationFrame 两者在事件循环系统的表现
```css
.main {
    width: 200px;
    height: 150px;
    border: 1px solid red;
    position: relative;
}
.box {
    width: 20px;
    height: 20px;
    background: blue;
    position: absolute;
}
```
```html
<div class='main'>
    <div class='box top' style='left: 0;top: 10px'></div>
    <div class='box bottom' style='left: 0;top: 50px'></div>
</div>
```
```js
    function moveA() {
      let box = document.getElementsByClassName('top')[0]
      let left = box.style.left
      if (left === '180px') {
        box.style.left = '0px'
      } else {
        box.style.left = Number.parseInt(left) + 1 + 'px'
      }
    }
    function callback1() {
      moveA()
      setTimeout(callback1, 0)
    }

    callback1()

    function moveB() {
      let box = document.getElementsByClassName('bottom')[0]
      let left = box.style.left
      if (left === '180px') {
        box.style.left = '0px'
      } else {
        box.style.left = Number.parseInt(left) + 1 + 'px'
      }
    }
    function callback2() {
      moveB()
      requestAnimationFrame(callback2)
    }
    callback2()
```
我用 setTimeout 和 requestAnimationFrame 分别实现了一个盒子移动的动画，你可以在本地运行下这段代码看看效果，可以很明显的观察到一个快一个慢，为什么会这样呢？来分析一下
首先要说一下页面刷新的频率，一般是 60 帧，也就是一秒钟刷新 60 次，大概就是 16 ms，requestAnimationFrame 是在什么时候执行的呢？每一帧绘制之前，也就是说 requestAnimationFrame 的执行频率是大概 16ms 一次，准确点来说是 1000ms/60，再来看 setTimeout，我没传第二个参数，默认就是 0，执行的间隔虽然肯定不会是 0 ，但是在这里是一定比 16ms 快，这意味着什么呢？来结合事件循环系统分析一下
每一轮循环执行一次 setTimeout，但是不一定每轮循环都会去刷新页面，因为页面刷新的频率是 16ms 一次，我们来捋一下，
第一轮执行了 setTimeout，A 盒子的 left 增加了 1px，注意这里只是值增加了，页面没有变化的，因为还不到刷新的时机，
第二轮执行 setTimeout，A 盒子的 left 又增加了 1px，还不到 16ms，页面还不变
第三轮执行 setTimeout，A 盒子的 left 又增加了 1px，此时到了 16ms 了，页面要刷新了，刷新之前执行了 requestAnimationFrame 的回调，B 盒子的 left 增加了 1px，接着就会重新布局，计算样式，生成新的帧，在这里计算样式的时候，A 盒子的 left 值增加了三次，所以 A 盒子要移动 3px，而 B 盒子的 left 值只增加了一次，所以只移动了 1px，这就是为什么一个快一个慢的原因了。
我在 performance 面板中观察到的是每两帧之间会执行三到四次 setTimeout，也就是说每两帧之间，事件循环系统跑了好几轮，每一轮都会执行一次 setTimeout，有什么办法可以让他俩保持一样的速度吗，很简单，给 SetTimeout 设置第二个参数为 1000 / 16,和帧率保持一致即可。
再来看一个关于 setTimeout 和 requestAnimationFrame 的问题
```js
box.style.transform = 'translateX(100px)'
box.style.transform = 'translateX(50px)'
box.style.transition = 'transform 1s ease-in-out'
```
可能你会想让盒子移动到 100px 的位置，然后再返回到 50px 的位置，但这段代码并不能实现这个效果，当 js 代码执行完毕，到了刷新页面的阶段去计算样式的时候，浏览器只会根据 js 修改样式之后的最终结果去计算，和上面那个例子差不多，浏览器不会为你的每一行操作 DOM 或者修改样式的代码都去刷新一次页面，当然也不会去记住你每次的操作，到渲染的时候再给你重复一遍你代码进行的操作。
好，我们下面来修改一下这段代码
```js
box.style.transform = 'translateX(100px)'
requestAnimationFrame(() => {
    box.style.transform = 'translateX(50px)'
    box.style.transition = 'transform 1s ease-in-out'
})
```
这样，把移动到 50px 位置的这个操作放在 requestAnimationFrame 里面，可以吗？还是不行的，因为在本轮循环的页面刷新之前，还是执行到了 box.style.transform = 'translateX(50px)' ，当之后进行样式计算的时候，还是根据这行代码的结果去计算的。
```js
box.style.transform = 'translateX(100px)'
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        box.style.transform = 'translateX(50px)'
        box.style.transition = 'transform 1s ease-in-out'
    })
})
```
这才是最终解决方案，可以看到在第一帧渲染之前执行到了 requestAnimationFrame ，然后在回调里面又重新创建了一个 requestAnimationFrame，里面的这个会在什么时候执行呢，下一帧渲染之前。其实就是把这两个操作分在了两帧，这样就可以实现之前想要的效果了。
其实还有一个办法可以实现
```js
box.style.transform = 'translateX(100px)'
getComputedStyle(box).transform
box.style.transform = 'translateX(50px)'
box.style.transition = 'transform 1s ease-in-out'
```
这个 getComputedStyle 会强迫让浏览器提前计算样式，可以理解为让浏览器记住之前的操作，而不是只按js 改变样式的最终结果去计算样式，听起来就不是什么好办法，所以还是推荐用 requestAnimationFrame。
最后我们来聊聊微任务，可能都知道微任务是在刚开始的同步代码或者之后的每个宏任务之后去执行的（所有的同步代码当成一个宏任务也可以，反正都这么说，你知道这个顺序就行了）。好，来看一下下面的这段代码
```js
    button.addEventListener('click', () => {
      Promise.resolve().then(() => console.log('Microtask1'))
      console.log('Listener1')
    })
    button.addEventListener('click', () => {
      Promise.resolve().then(() => console.log('Microtask2'))
      console.log('Listener2')
    })
```
我为同一个 button 绑定了两个 click 事件，当用户在页面上点击这个按钮的时候，输出结果会是什么呢？Listener1，Listener2，Microtask1，Microtask2，你可能会以为是这样，其实不是的，你可以自己去试验一下，结果其实是 Listener1，Microtask1，Listener2，Microtask2
为什么会是这样呢？来看一下实际的运行过程
首先执行第一个 click 事件的回调，第一个 Promise.then 里面的加入微任务队列，接着下一行的console.log 直接运行输出，接下来为什么会直接执行了微任务呢？注意当那行 console.log 执行完之后，这个 click 事件的回调也就算执行完了，他会被清出 js 的堆栈，我们都知道函数执行的时候会被推到 js 维护的一个调用栈中，现在堆栈是空的了，所以接下来就去执行了微任务。之后接着执行第二个 click 事件，也是同样的道理。我尝试在代码中加入断点，然后去观察 Call Stack，但是好像并不太能直观的体现出我说的这套流程。
```js
    button.addEventListener('click', () => {
      Promise.resolve().then(() => console.log('Microtask1'))
      console.log('Listener1')
    })
    button.addEventListener('click', () => {
      Promise.resolve().then(() => console.log('Microtask2'))
      console.log('Listener2')
    })
    button.click()
```
现在不需要手动点击 button 了，我在代码中直接调用它的 click 事件，输出结果还会和之前的一样吗？你可以去试一下，没错，又不一样了，现在的运行的结果Listener1，Listener2，Microtask1，Microtask2。为什么又成了这个样子呢？我们再来看一下运行的过程
刚开始 button.click() 执行，这时就会有函数入栈了，然后执行它的第一个 click 事件的回调，这个回调入栈，然后里面的 promise.then 入微任务队列，然后执行下面的 console.log，接下来这个回调就出栈了，注意，此时调用栈不是空的，原来的那个 click() 还没有返回，因为还有第二个 click 事件的回调呢，所以现在还不能执行微任务，所以接下来执行的是第二个 click 事件的回调，这个回调也会入栈，里面同样的 promise.then 入微任务队列，然后下面的 console.log 直接执行，然后这个回调出栈，到这，原来的那个 click() 才算是执行完了，他也可以出栈了，现在调用栈是空的了，接下来也就可以执行微任务队列中的事件了。




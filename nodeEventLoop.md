# Node 事件循环
主要是解决事件的执行顺序问题
主要分为以下几个阶段
1. timers 阶段，setTimeout & setInterval 设置一个下限时间，时间到达之后，系统会尽早的去执行回调事件，可能会因为还有其他阶段的事件在执行而导致延迟
2. I/O callback阶段，执行系统操作的一些回调事件，比如 TCP socket连接被拒绝，系统要报告这些错误，这些事件会在这个阶段执行
3. idle & prepare 阶段，闲置 准备，主要是在 node 内部使用
4. poll 阶段，轮询获取新的 I/O事件，比如文件读取，进入 poll 阶段之后分为几种情况
    1. 如果队列不为空，会遍历执行事件，并同步执行回调，直到清空队列或者达到执行的回调数达到上限
    2. 如果为空的情况，如果有代码被设置到了 setImmdiate 回调中，会立即结束 poll 阶段进入 check 阶段；如果没有代码被设定 setImmdiate 回调，会阻塞在该阶段等待有回调加入到 poll 阶段，并立即执行
    PS： 如果进入到 poll 阶段，此时 timers 队列有事件到了该执行的时候了，就会返回到timers阶段，去执行事件
5. check 阶段：执行 setImmdiate 的回调
6. close callback 阶段：比如 socket 的 close 事件的回调会在这里执行

nextTick & promise.then 
这俩都算是微任务，微任务会在一个阶段事件执行完毕，进入到下个阶段之前执行，而且 nextTick 优先于 promise.then 

对于setTimeout和微任务
从node11之后向浏览器看齐：执行了一个 timer 之后会跟着执行它产生的微任务，如果此时还有到期的 timer，就会再拿出来执行，如果又有产生的微任务，那么还会立即都执行完
```js
    new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve('timeout resolved')
        })
    }).then(res => console.log(res));

    setTimeout(() => {
        console.log('timeout2');
    }, 0);
```
对于这段代码，第一个setTimeout执行完之后产生了一个新的微任务，然后立即执行，然后再执行第二个 setTimeout
```js
setTimeout(() => {
    console.log('timeout1')
    Promise.resolve('promise1').then(res => console.log(res))
    Promise.resolve('promise2').then(res => console.log(res))
})
setTimeout(() => {
    console.log('timeout2')
    Promise.resolve('promise3').then(res => console.log(res))
})
```
不管一个SetTimeout会产生几个微任务，都会立即执行
```js
setTimeout(() => {
    console.log('timeout1')
    Promise.resolve('promise1').then(res => console.log(res))
    Promise.resolve('promise2').then(res => console.log(res))
})
setImmediate(() => console.log('setImmediate'))
setTimeout(() => {
    console.log('timeout2')
    Promise.resolve('promise3').then(res => console.log(res))
})
```
对于这种情况setImmediate 可能是第一个执行，也可能在第一个 setTimeout 之后执行，
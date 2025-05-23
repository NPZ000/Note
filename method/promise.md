*** promise ***
## 概念
promise是一种封装异步操作的对象，有三个状态pending 进行中，fulfilled 完成，rejected 拒绝，一旦状态发生改变，就不可逆。promise的回调属于微任务，可以链式调用，因为then返回的还是一个promise

## 解决的问题
回调地狱：层层嵌套的callback，可读性差，不好维护

## 用法
- promise.all: 接收一个promise组成的数组，如果所有promise都完成就返回所有结果组成的数组，如果有一个失败，就返回那个失败的结果；并行处理数据请求
- promise.race: 接收一个promise组成的数组，返回第一个成功或者失败的结果；超时控制
    ```js
    Promise.race([
        fetchData(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000))
    ]).then(handleData);
    ```
- promise.allsettled: 等待所有promise完成
- promise.any: 返回第一个成功的结果, 如果都失败了，就返回所有失败结果组成的数组

## 如何取消一个promise
1. AbortController结合支持signal的异步请求api
```js
const AbortController = new AbortController()
const signal = AbortController.signal

const promise = new Promise(async (resolve, reject) => {
    try {
        const res = await fetch('api/v1', {signal})
        resolve(res)
    } catch(error) {
        // 如果被abort 会抛出一个error
        if (error.name === 'AbortError') {
            reject('abort error')
        }
    }
})

const click = () => {
    AbortController.abort()
}
```
2. 标志位方案：通过外部变量控制，当请求结束的时候根据标志位控制是要resolve数据还是reject错误
```js
let cancel = false
const fetch = new Promise(async (resolve, reject) => {
    const res = await fetch('api')
    if (cancel) {
        reject('canceled')
    }
    resolve(res)
})
// chilk事件改边cancel
```
3. promise.race 通过与其他promise竞争实现取消，利用promise.race的只能返回一个结果的机制，把业务请求与一个超时会直接reject的promise一起传给promise.race，如果在超时时间内，业务请求还未返回数据，这时候另一个promise就会被触发reject, 此时就只能拿到一个失败的结果
```js
const timeutOutPromise = deplay =>  new promise((resolve, reject) => {
    setTimeOut(() => reject('timeout error'), deplay)
})
const fetchData = fetch('api')
const res = Promise.race([
    fetchData,
    timeutOutPromise
])
```
```js
class IPromise {
    constructor(excutor) {
        excutor(this.resolve, this.reject)
    }
    // 状态
    status = 'pending'

    // 成功的值
    value = null

    // 失败的原因
    resaon = null

    // 成功的回调
    onFulfileCallback = []

    // 失败的回调
    onRejectCallback = []


    resolve = (value) => {
        if (this.status === 'pending') {
            this.value = value
            this.status = 'fulfiled'
            while(this.onFulfileCallback.length) {
                this.onFulfileCallback.shift()(value)
            }
        }
    }

    reject = resaon => {
        if (this.status === 'pending') {
            this.resaon = resaon
            this.status = 'rejected'
            while(this.onRejectCallback.length) {
                this.onRejectCallback.shift()(resaon)
            }
        }
    }

    then(onFulfile, onReject) {
        if (this.status === 'fulfiled') {
            // 兼容then里面返回了promise
            return new IPromise((resolve, reject) => {
                const x = onFulfile(this.value)
                if (x instanceof IPromise) {
                    x.then(value => resolve(value), resaon => reject(resaon))
                } else {
                    resolve(x)
                }
            })
        } else if (this.status === 'rejected') {
            onReject(this.resaon)
        } else if (this.status === 'pending') {
            this.onFulfileCallback.push(onFulfile)
            this.onRejectCallback.push(onReject)
        }
    }
}


Promise.resolve = value => {
    if (value && typeof value === 'object' && value instanceof Promise) {
        return value
    }
    return new Promise(resolve => {
        resolve(value)
    })
}

promise.myAll = promiseList => {
    return new Promise((resolve, reject) => {
        let count = 0
        let result = []
        let len = promiseList.length
        if (!len) {
            return resolve(result)
        }
        promise.forEach((item, index) => {
            // 防止有不是promise的混进来
            Promise.resolve(item).then(res => {
                count++
                result[index] = res
                // 都成功之后 返回成功的结果数据
                if (count === len) {
                    resolve(result)
                }
            }).catch(reject) //有一个失败 就返回这个失败
        })
    })
}

promise.IAllSettled = promiseList => {
    return new Promise((resolve, reject) => {
        let count = 0
        let result = []
        let len = promiseList.length
        if (!len) {
            return resolve([])
        }
        promiseList.forEach((p, i) => {
            Promise.resolve(p).then(res => {
                count++
                result[i] = {
                    status: 'fulfiled',
                    value: res
                }
                if (count === len) {
                    resolve(result)
                }
            }).catch(err => {
                count++
                result[i] = {
                    status: 'rejected',
                    resaon: err
                }
                if (count === len) {
                    resolve(result)
                }
            })
        })
    })
}

promise.IRace = promiseList => {
    return new Promise((resolve, reject) => {
        promiseList.forEach((p) => {
            Promise.resolve(p).then(resolve).catch(reject)
        })
    })
}
```

## promise 的链式调用
之所以可以链式调用，是因为 then 方法内部又返回了新的 promise2 ，当前 then 的返回值会传递到下一个 then，如果返回的是一个普通值，就直接 resolve 出去，如果是一个函数，也直接resolve 出去，当作下一个 then 的参数，然后在下一个 then 里面可以直接调用，如果返回的是一个 promise ，这个 promise 的状态就是返回的新 promise2 的状态，返回的结果就是 resolve() / reject()的值

## async await 的原理
主要是基于 promise 和生成器的原理。async 声明的函数会返回一个 promise，当遇到 await 的时候，会开一个协程，拿到主线程的控制权，接着会把后面的代码都封装到 promise 里面，promise 完成之后，会把then 里面的回调放到 微任务队列，接着再把主线程的控制权交还给父协程， 主线程的任务完成之后，会查看微任务队列，发现有完成的promise，会再次拿到主线程的控制权，执行回调，执行完之后，再把控制权交出去

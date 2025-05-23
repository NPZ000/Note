
class IPromise {
    constructor(executor) {
        try {
            // 传入函数立即执行 并接收两个参数 resolve和reject
            executor(this.resolve, this.reject)
        } catch(err) {
            // 发生错误 直接调用reject
            this.reject(err)
        }
    }

    // 当前状态
    status = 'pending'

    // 成功的值
    value = null
    // 失败的值
    reason = null
    
    // 保存成功的回调
    onFulfilledCallback = []
    // 保存失败的回调
    onRejectedCallback = []


    resolve = value => {
        // 只有当此时的状态是 pending 时 才进行状态的转变以及其他逻辑
        if (this.status === 'pending') {
            // 将状态改为成功 
            this.status = 'fulfilled'
            // 保存成功的值
            this.value = value
            // 如果有保存的回调就挨个执行
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(value)
            }
        }
    }

    reject = reason => {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.reason = reason
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }
        }
    }

    // 接收两个参数 一个用来处理成功  另一个用来处理失败
    then = (onFulfilled, onRejected) => {
        // 如果没有传入参数 就设置一个默认值
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}
        // 因为then 是要链式调用的  所以这里要返回一个新的promise
        const promise2 = new IPromise((resolve, reject) => {
            const onFulfilledMicrotask = () => {
                // 生成一个微任务 因为这里会使用到这个新的新的promise，如果直接使用会报错未初始化
                queueMicrotask(() => {
                    try {
                        // 调用传进来的处理回调 拿到结果值
                        const x = realOnFulfilled(this.value)
                        // 不能直接返回 要判断是返回的一个普通值 还是 一个promise 并作出相应的处理
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }
            const onRejectedMicotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }
            if (this.status === 'fulfilled') {
                onFulfilledMicrotask()
            } else if (this.status === 'rejected') {
                onRejectedMicotask()
            } else if (this.status === 'pending') {
                // 如果 promise 里面是异步的逻辑 那么此时状态应该还是 pending，就先把处理回调保存起来，等决议之后再调用
                this.onFulfilledCallback.push(onFulfilledMicrotask)
                this.onRejectedCallback.push(onRejectedMicotask)
            }
        })
        return promise2
    }
    resolvePromise = (promise, x, resolve, reject) => {
        // 如果返回的是自身 就抛错
        if (x === promise) {
            return reject(new TypeError('error'))
        }
        // 如果返回的是一个promise，就调用他的他的 then 方法改变它的状态
        if (x instanceof IPromise) {
            x.then(resolve, reject)
        } else {
            // 如果是一个普通值 就直接resolve出去
            resolve(x)
        }
    }

    static resolve(parameter) {
        if (parameter instanceof IPromise) {
            return parameter
        }
        return new IPromise(resolve => {
            resolve(parameter)
        })
    }

    static reject(parameter) {
        if (parameter instanceof IPromise) {
            return parameter
        }
        return new IPromise((resolve, reject) => {
            reject(parameter)
        })
    }

    static all(arr) {
        return new IPromise((resolve, reject) => {
            const result = []
            if (arr.length === 0) {
                return resolve([])
            }
            let count = 0
            arr.forEach((item, index) => {
                IPromise.resolve(item).then(res => {
                    // 保存成功的返回值 如果全部成功就把结果resolve出去
                    result[index] = res
                    count++
                    if (count === arr.length) {
                        resolve(result)
                    }
                }).catch(reject) // 如果有一个失败 就直接 reject
            })
        })
    }

    static allSettled(promiseList) {
        return new IPromise((resolve, reject) => {
            const result = []
            let count = 0
            const len = promiseList.length
            if (!len) {
                return resolve([])
            }
            promiseList.forEach((item, index) => {
                IPromise.resolve(item).then(res => {
                    result[index] = {
                        value: res,
                        status: 'fulfilled'
                    }
                    count++
                    if (count === len) {
                        resolve(result)
                    }
                }).catch(err => {
                    result[index] = {
                        reason: err,
                        status: 'rejected'
                    }
                    if (++count === len) {
                        resolve(then)
                    }
                })
            })
        })
    }

    static race(promiseList) {
        return new IPromise((resolve, reject) => {
            if (promiseList.length === 0) {
                return resolve()
            }
            promiseList.forEach(item => IPromise.resolve(item).then(resolve, reject))
        })
    }
    static any(promiseList) {
        return new IPromise((resolve, reject) => {
            if (promiseList.length === 0) {
                return reject(new Error('error'))
            }
            const errList = []
            promiseList.forEach(item => IPromise.resolve(item).then(res => {
                // 抛出第一个成功的结果
                return resolve(res)
            }).catch(err => {
                errList.push(err)
                if (errList.length === promiseList.length) {
                    // 如果全部失败 就抛出一个错误
                    return reject(new AggregateError(errList))
                }
            }))
        })
    }
}

Promise.prototype.finally = cb => {
    const p = this.constructor
    return this.then(
        value => p.resolve(cb()).then(() => value),
        reason => p.resolve(cb()).then(() => {throw reason})
    )
}

const p = new IPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 100)
})

p.then(res => {
    console.log(res)
})

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch(e) {
            this.reject
        }
    }

    status = 'pending'

    value = null

    reason = null

    onFulfilledCallback = []

    onRejectedCallback = []

    resolve(value) {
        if (this.status === 'pending') {
            this.status = 'fulfiled'
            this.value = value
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(value)
            }
        }
    }

    reject(reason) {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.reason = reason
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}

        const promise2 = new MyPromise((resolve, reject) => {
            const onFulfiledMicotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value)
                        this.resolvePromise(x, promise2, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            }

            const onRejectedMicotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason)
                        this.resolvePromise(x, promise2, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            }
            if (this.status === 'fulfiled') {
                onFulfiledMicotask()
            } else if (this.status === 'rejected') {
                onRejectedMicotask()
            } else if (this.status === 'pending') {
                this.onFulfilledCallback.push(onFulfiledMicotask)
                this.onRejectedMicotask.push(onRejectedMicotask)
            }
        })
    }

    resolvePromise(x, promise, resolve, reject) {
        if (x === promise) {
            return reject(new Error())
        }
        if (x instanceof promise) {
            return x.then(resolve, reject)
        }
        return resolve(x)
    }

    static resolve(parameter) {
        if (parameter instanceof Promise) {
            return parameter
        }
        return new Promise(resolve => {
            resolve(parameter)
        })
    }

    static reject(parameter) {
        if (parameter instanceof Promise) {
            return parameter
        } 
        return new Promise((resolve, reject) => {
            reject(parameter)
        })
    }

    static all(promiseList) {
        return new Promise((resolve, reject) => {
            if (promiseList.length === 0) {
                return resolve([])
            }
            const res = []
            let count = promiseList.lengt
            promiseList.forEach((promise, index) => {
                promise.then(value => {
                    res[index] = value
                    count--
                    if (count === 0) {
                        resolve(res)
                    }
                }).catch(reject)
            })
        })
    }

    static race(promiseList) {
        return new Promise((resolve, reject) => {
            if (promiseList.length === 0) {
                return resolve([])
            }
            promiseList.forEach(promise => promise.then(resolve).catch(reject))
        })
    }

    static allSettled(promiseList) {
        return new Promise((resolve, reject) => {
            if (promiseList.length === 0) {
                return resolve([])
            }
            const result = []
            let count = promiseList.length
            promiseList.forEach((promise, index) => {
                promise.then(res => {
                    result[index] = {
                        status: 'fullfiled',
                        value: res
                    }
                    if (--count === 0) {
                        resolve(result)
                    }
                }).ctach(err => {
                    result[index] = {
                        status: 'rejected',
                        reason: err
                    }
                    if (--count) {
                        resolve(result)
                    }
                })
            })
        })
    }

    any(promiseList) {
        return new Promise((resolve, reject) => {
            if (promiseList.length === 0) {
                return reject(new Error())
            }
            const errorList = []
            let count = promiseList.length
            promiseList.forEach((promise, index) => {
                promise.then(res => {
                    resolve(res)
                }).catch(err => {
                    errorList[index] = err
                    if (--count) {
                        reject(new AggregateError(errorList))
                    }
                })
            })
        })
    }
}
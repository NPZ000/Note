// sync
// class MyPrmoise {
//     constructor(executor) {
//         executor(this.onResolve, this.onReject)
//     }

//     state = 'pending'

//     value = null

//     reason = null

//     onResolve = (value) => {
//         if (this.state === 'pending') {
//             this.state = 'fulfilled'
//             this.value = value
//         }
//     }

//     onReject = reason => {
//         if (this.state === 'pending') {
//             this.state = 'rejected'
//             this.reason = reason
//         }
//     }

//     then = (onFulfilled, onRejected) => {
//         if (this.state === 'fulfilled') {
//             onFulfilled(this.value)
//         } else if (this.state === 'rejected') {
//             onRejected(this.reason)
//         }
//     }
// }

// const promise = new MyPrmoise((resolve, reject) => {
//     // resolve('success')
//     reject('fail')
// })

// promise.then(res => {
//     console.log('resolve', res)
// }, reason => {
//     console.log('reject', reason)
// })

// async 
class MyPrmoise1 {
    constructor(executor) {
        executor(this.onResolve, this.onReject)
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = null
    onRejectCallback = null

    onResolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            this.onFulfillCallback && this.onFulfillCallback(value)
        }
    }

    onReject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            this.onRejectCallback && this.onRejectCallback(reason)
        }
    }

    then = (onFulfilled, onRejected) => {
        if (this.state === 'fulfilled') {
            onFulfilled(this.value)
        } else if (this.state === 'rejected') {
            onRejected(this.reason)
        } else {
            this.onFulfillCallback = onFulfilled
            this.onRejectCallback = onRejected
        }
    }
}

// const promise1 = new MyPrmoise1((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 100)
// })

// promise1.then(res => {
//     console.log('resolve', res)
// }, reason => {
//     console.log('reject', reason)
// })

// more times call then method
class MyPrmoise2 {
    constructor(executor) {
        executor(this.onResolve, this.onReject)
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = []
    onRejectCallback = []

    onResolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            while(this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    onReject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while(this.onRejectCallback.length) {
                this.onRejectCallback.shift()(value)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        if (this.state === 'fulfilled') {
            onFulfilled(this.value)
        } else if (this.state === 'rejected') {
            onRejected(this.reason)
        } else {
            this.onFulfillCallback.push(onFulfilled)
            this.onRejectCallback.push(onRejected)
        }
    }
}

// const promise2 = new MyPrmoise2((resolve, reject) => {
//     // setTimeout(() => {
//         resolve('success')
//     // }, 100)
// })

// promise2.then(res => {
//     console.log(1, res)
// })

// promise2.then(res => {
//     console.log(2, res)
// })

// promise2.then(res => {
//     console.log(3, res)
// })

// 链式调用
class MyPrmoise3 {
    constructor(executor) {
        executor(this.onResolve, this.onReject)
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = []
    onRejectCallback = []

    onResolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            while(this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    onReject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while(this.onRejectCallback.length) {
                this.onRejectCallback.shift()(value)
            }
        }
    }

    // ①当then中返回的是普通值的时候，要调用一次promise2的resolve方法，从而将promise2的value设置为then中返回的普通值。
    // ②当then中返回的是一个新的promise时，就调用它本身的then方法，根据返回的新的promise的状态来设置promise2的value或者reason的值，如果返回的新的promise状态为fulfilled，也就是说在返回的新的promise中已经调用了resolve方法，那么此时调用promise2中的resolve方法，将返回的新的promise中的value赋值给promise2的value。
    // 从而实现值穿透，个人理解，不知道对不对。

    then = (onFulfilled, onRejected) => {
        return new MyPrmoise3((resolve, reject) => {
            if (this.state === 'fulfilled') {
                const x = onFulfilled(this.value)
                if (x instanceof MyPrmoise3) {
                    x.then(resolve, reject)
                } else {
                    resolve(x)
                }
            } else if (this.state === 'rejected') {
                onRejected(this.reason)
            } else {
                this.onFulfillCallback.push(onFulfilled)
                this.onRejectCallback.push(onRejected)
            }
        })
    }
}

const promise3 = new MyPrmoise3((resolve, reject) => {
    resolve('success')
})

function other() {
    return new MyPrmoise3((resolve) => {
        resolve('other')
    })
}

// promise3.then(res => {
//     console.log(res)
//     return other()
// }).then(res => {
//     console.log(res)
// })

// 循环调用
class MyPrmoise4 {
    constructor(executor) {
        executor(this.onResolve, this.onReject)
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = []
    onRejectCallback = []

    onResolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            while(this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    onReject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while(this.onRejectCallback.length) {
                this.onRejectCallback.shift()(reason)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        const promise2 = new MyPrmoise4((resolve, reject) => {
            if (this.state === 'fulfilled') {
                queueMicrotask(() => {
                    const x = onFulfilled(this.value)
                    if (x === promise2) {
                        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'))
                    }
                    if (x instanceof MyPrmoise4) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                })
            } else if (this.state === 'rejected') {
                onRejected(this.reason)
            } else {
                this.onFulfillCallback.push(onFulfilled)
                this.onRejectCallback.push(onRejected)
            }
        })
        return promise2
    }
}

// const promise4 = new MyPrmoise4((resolve) => {
//     resolve('success')
// })

// const p1 = promise4.then(res => {
//     console.log(res)
//     return p1
// })

// p1.then(res => {
//     console.log(res)
// }, reason => {
//     console.log(reason)
// })

// catch error
class MyPrmoise5 {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch(err) {
            // 捕获错误 并传递给 reject
            this.reject(err)
        }
    }

    state = 'pending'

    value = null

    reason = null

    // store async cb
    onFulfillCallback = []

    onRejectCallback = []

    resolve = (value) => {
        if (this.state === 'pending') {
            // change state
            this.state = 'fulfilled'
            // set value
            this.value = value
            // call async cb
            while (this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    reject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while (this.onRejectCallback.length) {
                this.onRejectCallback.shift()(reason)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        const promise2 = new MyPrmoise5((resolve, reject) => {
            if (this.state === 'fulfilled') {
                queueMicrotask(() => {
                    try {
                        console.log('-----')
                        const x = onFulfilled(this.value)
                        // 如果 then 中返回了自身 就报错
                        if (x === promise2) {
                            return reject(new TypeError('error'))
                        }
                        // 如果 then 里面返回了新的 promise，那么就调用新 promise 的 then 方法
                        // 并且在其中调用 promise2 的 resolve 或者 reject 方法，把新 promise 的结果设置到 promise2 上
                        if (x instanceof MyPrmoise5) {
                            x.then(resolve, reject)
                            // x.then(res => resolve(res), reason => reject(reason))
                        } else {
                            // 如果是一个普通值 就直接调用 promise2 的 resolve 设置到 promise2 的 value 上
                            resolve(x)
                        }
                    } catch (error) {
                        // 捕获 then 中的错误 并 reject 出去
                        reject(error)
                    }
                })
            } else if (this.state === 'rejected') {
                onRejected(this.reason)
            } else {
                // 如果promise中立即执行的代码是异步 那么就得先把 then 的回调存起来
                this.onFulfillCallback.push(onFulfilled)
                this.onRejectCallback.push(onRejected)
            }
        })
        return promise2
    }
}

// const promise5 = new MyPrmoise5((resolve, reject) => {
//     // throw new Error('Error')
//     resolve('success')
// })

// promise5.then(res => {
//     console.log(res)
//     throw new Error('error in then')
// }).then(resolve => ({}), error => {
//     console.log('error----')
//     console.log(error.message)
// })

// promise5.then(res => {
//     console.log(res)
//     return new Promise((resolve, reject) => {
//         reject('error')
//     })
// }).then(res => {
//     console.log(res)
// }, error => {
//     console.log(error)
// })


// promise5.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err.message)
// })

// 根据 fulfilled 的处理 对 rejected 状态 和 pending 状态进行同样的改造
class MyPromise6 {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err)
        }
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = []

    onRejectCallback = []

    resolve = value => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            while (this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    reject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while (this.onRejectCallback.length) {
                this.onRejectCallback.shift()(reason)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}
        const promise2 = new MyPromise6((resolve, reject) => {
            if (this.state === 'fulfilled') {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            } else if (this.state === 'rejected') {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            } else if (this.state === 'pending') {
                this.onFulfillCallback.push(() => {
                    queueMicrotask(() => {
                        try {
                            const x = onFulfilled(this.value)
                            this.resolvePromise(promise2, x, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    })
                })
                this.onRejectCallback.push(() => {
                    queueMicrotask(() => {
                        try {
                            const x = onRejected(this.reason)
                            this.resolvePromise(promise2, x, resolve, reject)
                        } catch(err) {
                            reject(err)
                        }
                    })
                })
            }
        })
        return promise2
    }

    resolvePromise = (promise, x, resolve, reject) => {
        if (promise === x) {
            return reject(new TypeError('same promise error'))
        }
        if (x instanceof MyPromise6) {
            x.then(resolve, reject)
        } else {
            resolve(x)
        }
    }
}

// const promise6 = new MyPromise6((resolve, reject) => {
//     // resolve('success')
//     reject('error-----')
// })

// promise6.then().then().then(value => {
//     console.log('success', value)
// }, reason => {
//     console.log('reject', reason)
// })

// promise6.then(res => {
//     console.log(res)
//     return new MyPromise6((resolve, reject) => {
//         setTimeout(() => {
//             // resolve('promise2')
//             // reject('promise2 error')
//             throw new Error('error')
//         }, 100)
//     })
// }).then(res => {
//     console.log(res)
// }, reason => {
//     console.log(reason)
// })

class MyPromise7 {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err)
        }
    }

    state = 'pending'

    value = null

    reason = null

    onFulfillCallback = []

    onRejectCallback = []

    resolve = value => {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.value = value
            while (this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    reject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.reason = reason
            while (this.onRejectCallback.length) {
                this.onRejectCallback.shift()(reason)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}
        const promise2 = new MyPromise7((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
            if (this.state === 'fulfilled') {
                fulfilledMicrotask()
            } else if (this.state === 'rejected') {
                rejectedMicrotask()
            } else if (this.state === 'pending') {
                this.onFulfillCallback.push(fulfilledMicrotask)
                this.onRejectCallback.push(rejectedMicrotask)
            }
        })
        return promise2
    }

    static resolve(params) {
        if (params instanceof MyPromise7) {
            return params
        }
        return new MyPromise7((resolve) => {
            resolve(params)
        })
    }

    static reject(params) {
        return new MyPromise7((resolve, reject) => {
            reject(params)
        })
    }

    resolvePromise = (promise, x, resolve, reject) => {
        if (promise === x) {
            return reject(new TypeError('same promise error'))
        }
        if (x instanceof MyPromise7) {
            x.then(resolve, reject)
        } else {
            resolve(x)
        }
    }
}

// MyPromise7.resolve().then(() => {
//     console.log(0);
//     return MyPromise7.resolve(4);
// }).then((res) => {
//     console.log(res)
// })

// MyPromise7.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// }).then(() =>{
//     console.log(6);
// })

// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

// MyPromise.resolve().then(res => {
//     // return MyPromise.resolve('promise')
//     console.log(MyPromise.resolve('promise'))
// }).then(res => {
//     console.log(res)
// })

  
class IPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch(err) {
            this.reject(err)
        }
    }

    status = 'pending'

    value = null

    reason = null

    onFulfillCallback = []
    onRejectCallback = []

    resolve = value => {
        if (this.status === 'pending') {
            this.status = 'fulfilled'
            this.value = value
            while (this.onFulfillCallback.length) {
                this.onFulfillCallback.shift()(value)
            }
        }
    }

    reject = reason => {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.reason = reason
            while (this.onRejectCallback.length) {
                this.onRejectCallback.shift()(reason)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw(reason)}
        const promise2 = new IPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
            if (this.status === 'fulfilled') {
                fulfilledMicrotask()
            } else if (this.status === 'rejected') {
                rejectedMicrotask()
            } else {
                this.onFulfillCallback.push(fulfilledMicrotask)
                this.onRejectCallback.push(rejectedMicrotask)
            }
        })
        return promise2
    }

    resolvePromise = (promise, x, resolve, reject) => {
        if (x === promise) {
            return reject(new TypeError('error'))
        }
        if (x instanceof IPromise) {
            x.then(resolve, reject)
        } else {
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
        return new IPromise((resolve, reject) => {
            reject(parameter)
        })
    }
}

IPromise.resolve().then(() => {
    console.log(0);
    return new IPromise(resolve => resolve(4));
}).then((res) => {
    console.log(res)
})

IPromise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() =>{
    console.log(6);
})



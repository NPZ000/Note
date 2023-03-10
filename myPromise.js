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

// ????????????
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

    // ??????then???????????????????????????????????????????????????promise2???resolve??????????????????promise2???value?????????then????????????????????????
    // ??????then???????????????????????????promise???????????????????????????then??????????????????????????????promise??????????????????promise2???value??????reason??????????????????????????????promise?????????fulfilled?????????????????????????????????promise??????????????????resolve???????????????????????????promise2??????resolve???????????????????????????promise??????value?????????promise2???value???
    // ????????????????????????????????????????????????????????????

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

// ????????????
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
            // ???????????? ???????????? reject
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
                        // ?????? then ?????????????????? ?????????
                        if (x === promise2) {
                            return reject(new TypeError('error'))
                        }
                        // ?????? then ????????????????????? promise????????????????????? promise ??? then ??????
                        // ????????????????????? promise2 ??? resolve ?????? reject ??????????????? promise ?????????????????? promise2 ???
                        if (x instanceof MyPrmoise5) {
                            x.then(resolve, reject)
                            // x.then(res => resolve(res), reason => reject(reason))
                        } else {
                            // ???????????????????????? ??????????????? promise2 ??? resolve ????????? promise2 ??? value ???
                            resolve(x)
                        }
                    } catch (error) {
                        // ?????? then ???????????? ??? reject ??????
                        reject(error)
                    }
                })
            } else if (this.state === 'rejected') {
                onRejected(this.reason)
            } else {
                // ??????promise????????????????????????????????? ?????????????????? then ??????????????????
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

// ?????? fulfilled ????????? ??? rejected ?????? ??? pending ???????????????????????????
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

// ?????????????????????????????????
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// ?????? MyPromise ???
class MyPromise {
  constructor(executor){
    // executor ??????????????????????????????????????????
    // ?????????resolve???reject??????
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // ???????????????????????????????????? pending
  status = PENDING;
  // ??????????????????
  value = null;
  // ?????????????????????
  reason = null;

  // ????????????????????????
  onFulfilledCallbacks = [];
  // ????????????????????????
  onRejectedCallbacks = [];

  // ????????????????????????
  resolve = (value) => {
    // ?????????????????????????????????????????????
    if (this.status === PENDING) {
      // ?????????????????????
      this.status = FULFILLED;
      // ????????????????????????
      this.value = value;
      // resolve?????????????????????????????????????????????
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() ???????????????????????????????????????????????????shift???????????????????????????????????????????????????????????????????????????
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // ????????????????????????
  reject = (reason) => {
    // ?????????????????????????????????????????????
    if (this.status === PENDING) {
      // ?????????????????????
      this.status = REJECTED;
      // ????????????????????????
      this.reason = reason;
      // resolve?????????????????????????????????????????????
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // ?????????????????????????????????????????? MyPromise??????????????? return ??????
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // ??????????????????????????? promise2 ???????????????
        queueMicrotask(() => {
          try {
            // ???????????????????????????????????????
            const x = realOnFulfilled(this.value);
            // ?????? resolvePromise ????????????
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // ??????????????????????????? promise2 ???????????????
        queueMicrotask(() => {
          try {
            // ??????????????????????????????????????????
            const x = realOnRejected(this.reason);
            // ?????? resolvePromise ????????????
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // ????????????
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // ??????
        // ?????????????????????????????????????????????????????????????????????????????????????????????
        // ????????????????????????????????????????????????
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve ????????????
  static resolve (parameter) {
    // ???????????? MyPromise ???????????????
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // ??????????????????
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject ????????????
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // ????????????????????????return??????????????????????????????????????????
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // ??????x????????? MyPromise ????????????
  if(x instanceof MyPromise) {
    // ?????? x????????? then ???????????????????????????????????? fulfilled ?????? rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // ????????????
    x.then(resolve, reject)
  } else{
    // ?????????
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



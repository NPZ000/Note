// /**
//  * promise.all
//  * 接收一个数组，数组项为单个promise，返回一个数据，数组项是所有promise返回的结果
//  */

// // const a = new Promise(resolve => {
// //     setTimeout(() => {
// //         resolve('success 1')
// //     }, 2000)
// // })
// // const b = new Promise(resolve => {
// //     setTimeout(() => {
// //         resolve('success 2')
// //     }, 1000)
// // })
// const a = Promise.resolve(1)
// const b = Promise.resolve(2)
// const c = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('fail')
//     }, 3000)
// })
// const d = Promise.reject('error')

// Promise.myAll = promises => {
//     return new Promise((resolve, reject) => {
//         let count = 0
//         let res = []
//         if (!promises.length) {
//             return resolve(res)
//         }
//         promises.forEach((p, i) => {
//             // 防止有不是promise的混进来
//             Promise.resolve(p).then(result => {
//                 count++
//                 // 值放在自己对应的位置
//                 res[i] = result
//                 // 如果都成功了 就reslove出去
//                 if (count === promises.length) {
//                     resolve(res)
//                 }
//             }).catch(error => reject)
//         })
//     })
// }
// Promise.myAll([a, b]).then(console.log).catch(console.log)
// Promise.myAll([a,b,d,c]).then(console.log).catch(console.log)
const reverse = (chars, left, right) => {
    while (left < right) {
        const temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
}
// var compress = function(chars) {
//     const n = chars.length;
//     let write = 0, left = 0;
//     for (let read = 0; read < n; read++) {
//         if (read === n - 1 || chars[read] !== chars[read + 1]) {
//             chars[write++] = chars[read];
//             let num = read - left + 1;
//             if (num > 1) {
//                 const anchor = write;
//                 while (num > 0) {
//                     chars[write++] = '' + num % 10;
//                     num = Math.floor(num / 10);
//                 }
//                 reverse(chars, anchor, write - 1);
//             }
//             left = read + 1;
//         }
//     }
//     console.log(chars)
//     return write;
// };
var compress = function(chars) {
    let write = 0
    let left = 0
    let len = chars.length
    for (let i = 0; i < len; i++) {
        if (i === len - 1 || chars[i] !== chars[i + 1]) {
            chars[write++] = chars[i]
            let num = i - left + 1
            if (num > 1) {
                const s = num.toString()
                for (let index = 0; index < s.length; index++) {
                    chars[write++] = s[index]
                }
            }
            left = i + 1
        }
    }
    console.log(chars)
};
const chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b",'d']
// compress(chars)

function foo(pushList, popList) {
    let stack = [],
    lastIndex = 0
    for (let i = 0; i < pushList.length; i++) {
        stack.push(pushList[i])
        // 循环判断辅助栈的栈尾和poplist的栈首相等 相等的话就出栈
        while(stack.length && popList[lastIndex] === stack[stack.length - 1]) {
            stack.pop()
            lastIndex++
        }
    }
    return !(stack.length)
}


// function ajax(params) { 
//     params = params || {}; 
//     params.data = params.data || {}; 
//     var json = params.jsonp ? jsonp(params) : json(params);   
   
//     // jsonp请求 
//     function jsonp(params) { 
//      //创建script标签并加入到页面中 
//      var callbackName = params.jsonp; 
//      var head = document.getElementsByTagName('head')[0]; 
//      // 设置传递给后台的回调参数名 
//      params.data['callback'] = callbackName; 
//      var data = formatParams(params.data); 
//      var script = document.createElement('script'); 
//      head.appendChild(script);  
     
//      //创建jsonp回调函数 
//      window[callbackName] = function(json) { 
//       head.removeChild(script); 
//       clearTimeout(script.timer); 
//       window[callbackName] = null; 
//       params.success && params.success(json); 
//      };  
   
//      //发送请求 
//      script.src = params.url + '?' + data;  
   
//      //为了得知此次请求是否成功，设置超时处理 
//      if(params.time) { 
//      script.timer = setTimeout(function() { 
//       window[callbackName] = null; 
//       head.removeChild(script); 
//       params.error && params.error({ 
//        message: '超时' 
//       }); 
//      }, time); 
//      } 
//     };  
   
//     //格式化参数 
//     function formatParams(data) { 
//      var arr = []; 
//      for(var name in data) { 
//       arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name])); 
//      }; 
   
//      // 添加一个随机数，防止缓存 
//      arr.push('v=' + random()); 
//      return arr.join('&'); 
//     } 
   
//     // 获取随机数 
//     function random() { 
//      return Math.floor(Math.random() * 10000 + 500); 
//     }
// }

function jsonp(url, data, callback = 'callback') {
    let str = url.includes('?') ? '&' : '?'
    for (let key in data) {
        str += key + '=' + data[key] + '&'
    }
    let urlData = url + str
    let script = document.createElement('script')
    script.src = urlData
    document.body.appendChild(script)

    return new Promise((resolve, reject) => {
        window[callback] = data => {
            try {
                resolve(data)
            } catch (err) {
                reject(err)
            }
        }
    })
}

function stringify(data) {
    const type = typeof data
    // 对基本类型的数据的转换
    if (type !== 'object') {
        let result = data
        // 对于 NaN 和 Infinity 转为 null
        if (Number.isNaN(data) || data === Infinity) {
            return 'null'
        }
        // 对于undefined function symbol 转为 undefined
        if (type === 'undefined' || type === 'function' || type === 'symbol') {
            return 'undefined'
        }
        // 对于字符串 要用双引号包裹
        if (type === 'string') {
            result = `"${data}"`
        }
        // 对于最后返回的结果再转一下String
        return String(result)
    } else if (type === 'object') {
        // 对于 null 转为 null
        if (data === null) {
            return 'null'
        } else if (data.toJSON && typeof data.toJSON === 'function') {
            // 对于有toJSON方法的 调用一下再转string
            return stringify(data.toJSON())
        } else if (Array.isArray(data)) {
            let result = []
            // 对于数组 忽略掉undefined function symbol的元素
            data.forEach((item, index) => {
                const type = typeof item
                if (type === 'undefined' || type === 'function' || type === 'symbol') {
                    result[index] = 'null'
                } else {
                    result[index] = stringify(item)
                }
            })
            return `[${result}]`.replace(/'/g, '"')
        } else {
            let result = []
            // 对于普通对象 忽略掉 key 为 symbol 的属性，忽略掉value为 undefined function symbol的属性 
            Object.keys(data).forEach(key => {
                if (typeof key !== 'symbol') {
                    const type = typeof data[key]
                    if (type !== 'undefined' && type !== 'function' && type !== 'symbol') {
                        result.push(`"${key}":${stringify(data[key])}`)
                    }
                }
            })
            return `{${result}}`.replace(/'/g, '"')
        }
    }
    return ""
}

// 压缩字符串
function foo(list) {
    let write = 0
    let left = 0
    let len = list.length
    for (let index = 0; index < len; index++) {
        if (index === len - 1 || list[index] !== list[index + 1]) {
            list[write++] = list[left]
            let num = index - left + 1
            if (num > 1) {
                const s = num.toString()
                for (let i = 0; i < s.length; i++) {
                    list[write++] = s[i]
                }
            }
            left = index + 1
        }
    }
    return write
}

class MyPromise {
    constructor(excutor) {
        excutor(this.resolve, this.reject)
    }

    status = 'pending'

    value = null

    resaon = null

    onFulfileCallback = []

    onRejectCallback = []

    resolve = value => {
        if (this.status === 'pending') {
            this.status = 'fulfiled'
            this.value = value
            // 有多个then的情况 都取出来执行
            while(this.onFulfileCallback.length) {
                this.onFulfileCallback.shift()(value)
            }
            // this.onFulfileCallback && this.onFulfileCallback(this.value)
        }
    }

    reject = resaon => {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.resaon = resaon
            while(this.onRejectCallback.length) {
                this.onRejectCallback.shift()(resaon)
            }
            // this.onRejectCallback && this.onRejectCallback(this.resaon)
        }
    }

    then(onFulfile, onReject) {
        return new MyPromise((resolve, reject) => {
            if (this.status === 'fulfiled') {
                // 拿到成功决议返回的结果
                const x = onFulfile(this.value)
                // 判断是否是promise 是的话 调用其then方法 
                if (x instanceof MyPromise) {
                    x.then(value => resolve(value), resaon => reject(resaon))
                } else {
                    resolve(x)
                }
            }
            if (this.status === 'rejected') {
                onReject(this.resaon)
            }
            if (this.status === 'pending') {
                this.onFulfileCallback.push(onFulfile)
                this.onRejectCallback.push(onReject)
            }
        })
    }
}

class Sub {
    constructor() {
        this.list = {}
    }

    // 按照key添加订阅的事件列表 
    on(name, id, fn) {
        if (!this.list[name]) {
            this.list[name] = []
        }
        this.list[name].push({id, fn})
    }

    // 按照key 去触发对应的事件列表
    emit(name, msg) {
        if (this.list[name]) {
            this.list[name].forEach(item => {
                item.fn(msg)
            })
        }
    }

    // 按照key和事件的id去取消订阅
    off(name, id) {
        if (this.list[name]) {
            this.list[name].forEach((item, index) => {
                if (item.id === id) {
                    item.splice(index, 1)
                }
            })
        }
    }
}

class observer {
    constructor(name) {
        this.name = name
    }

    updata() {
        //do something
    }
}

class Subject {
    constructor() {
        this.list = []
    }

    add(observer) {
        this.list.push(observer)
    }

    notify() {
        this.list.forEach(item => {
            item.update()
        })
    }
}

function arr2Tree(arr) {
    let result = []
    getChild(arr, result, id)
    return result
}

function getChild(data, res, pid) {
    for (let item of data) {
        if (item.pid === pid) {
            const newItem = {...item, children: []}
            res.push(newItem)
            getChild(data, newItem.children, item.id)
        }
    }
}

function tree(arr) {
    let itemMap = {}
    let res = []
    for (let item of arr) {
        const { id, pid } = item

        // 如果map中还没有当前节点 就加一个 预设children
        if (!itemMap[id]) {
            itemMap[id] = {
                children: []
            }
        }
        // 在 map 中找到该节点的children 加进去
        // 这里有可能子节点先父节点被遍历到 根据下面的逻辑 父节点就会提前一步被加到 map 中 
        // 之后再遍历到这个父节点的时候 就不会走上面那个if 
        itemMap[id] = {
            ...item,
            children: itemMap[id].children
        }

        const newItem = itemMap[id]
        // 如果是根节点 直接加进去
        if (pid === 0) {
            res.push(newItem)
        } else {
            // 不是根节点 就去找他的父节点 没有的话就在 map 中加一个
            if (!itemMap[pid]) {
                itemMap[pid] = {
                    children: []
                }
            }
            // 把当前节点加到对应父节点的children中
            itemMap[pid].children.push(newItem)
        }
    }
    return res
}

let arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 6, name: '部门6', pid: 3},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]
// console.log(stringify(tree(arr)))

const curry = (fn) => (judge = (...args) =>
    args.length === fn.length
    ? fn(...args)
    : (...arg) => judge(...args, ...arg));
const add = (a, b, c) => a + b + c;
const curryAdd = curry(add);
// console.log(curryAdd(1)(2)(3)); // 6
// console.log(curryAdd(1, 2)(3)); // 6
// console.log(curryAdd(1)(2, 3)); // 6

function findMax(str) {
    let arr = []
    let max = 0
    for (let i = 0; i < str.length; i++) {
        const item = str[i]
        const index = str.indexOf(item)
        if (index > -1) {
            arr = arr.slice(index + 1)
        }
        arr.push(item)
        if (arr.length > max) {
            max = arr.length
        }
    }
    return max
}

/*
 *示例：
 *给定数组：[2,6,3,8,10,9]
 *返回数组：[6,8,8,10,-1,-1]
 */

 function change(arr) {
     let i = 0
     while (i < arr.length) {
        let temp = arr[i]
        arr[i] = -1
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] > temp) {
                arr[i] = arr[j]
                break
            }
        }
        i++
     }
 }
//  const a = [2,6,3,8,10,9]
//  change(a)
//  console.log(a)
 
function init(val) {
    const ctor = val.constructor
    return new ctor()
}

function clone(data, map = new Map()) {
    if (typeof data === 'object') {
        if (data === null) {
            return null
        }
        const type = Object.prototype.toString.call(data)
        let res
        // 对于可迭代的对象 根据类型初始化
        if (['[object Map]', '[object Set]', '[object Object]', '[object Array]'].includes(type)) {
            res = init(data)
        }

        // 解决循环引用的问题
        if (map.get(data)) {
            return map.get(data)
        }
        map.set(data, res)

        // 对于 Map 类型 需要用 set 去设置值
        if (type === '[object Map]') {
            // res = new Map()
            data.forEach((value, key) => {
                res.set(key, clone(value, map))
            })
            return res
        }

        // 对于 Set 需要用 add 去处理
        if (type === '[object Set]') {
            data.forEach((value) => {
                res.add(clone(value, map))
            })
            return res
        }
        
        // 最后就是对数组和普通对象的处理
        for (let key in data) {
            res[key] = clone(data[key], map)
        }
        return res
    } else {
        return data
    }
}
const obj = {
    a: 1,
    b: undefined,
    c: null,
    d: [1,2,{x:1}],
    e: {
        c:1
    },
    f: new Map(),
    g: new Set(),
}
obj.f.set('x', 1)
obj.g.add('2')
obj.obj = obj
const res = clone(obj)

res.a = 2
// console.log(res)

function deepClone(data, map = new Map()) {
    if (typeof data === 'object') {
        if (data === null) {
            return null
        }
        const type = Object.prototype.toString.call(data)
        let res
        if (['[object Object]', '[object Array]', '[object Map]', '[object Set]'].includes(type)) {
            res = new (data.constructor)()
        }
        if (map.get(data)) {
            return map.get(data)
        }
        map.set(data, res)
        if (type === '[object Map]') {
            data.forEach((value, key) => {
                res.set(key, deepClone(value, map))
            })
            return res
        }
        if (type === '[object Set]') {
            data.forEach(value => {
                res.add(deepClone(value, map))
            })
            return res
        }
        if (type === '[object Object]' || type === '[object Array]') {
            for (let key in data) {
                res[key] = deepClone(data[key], map)
            }
        }
        return res
    } else {
        return data
    }
}

var isPalindrome = function(x) {
    let list = x.toString().split('')
    let i = 0
    let j = list.length - 1
    while (i < j) {
        console.log(list[i], list[j])
        if (list[i] !== list[j]) {
            return false
        }
        i++
        j++
    }
    return true
};
// isPalindrome(121)
var longestCommonPrefix = function(strs) {
    let index = 0
    // let str = ''
    while (index < strs[0].length) {
        let temp = strs[0][index]
        for (let i = 1; i < strs.length; i++) {
            const cur = strs[i].substr(index, 1)
            console.log(cur)
            if (cur !== temp) {
                temp = ''
                break
            }
        }
        if (temp) {
            index++
        } else {
            break
        }
    }
    return strs[0].substr(0, index)
};
// console.log(longestCommonPrefix(["flower","flow","flight"]))
var generate = function(numRows) {
    const res = []
    for (let i = 0; i < numRows.length; i++) {
        res[i] = []
        res[i][0] = res[i][i] = 1
        console.log(res)
        for (let j = 1; j < i; j++) {
            res[i][j] = res[i - 1][j - 1] + res[i - 1][j]
        }
    }
    return res
};
generate(5)

var getRow = function(rowIndex) {
    const row = new Array(rowIndex + 1).fill(0);
    row[0] = 1;
    for (let i = 1; i <= rowIndex; ++i) {
        for (let j = i; j > 0; --j) {
            i === 3 && console.log(row)
            row[j] += row[j - 1];
        }
    }
    return row;
};
// getRow(3)

function debounce(fn, delay) {
    let timer = null
    return function() {
        clearTimeout(timer)
        timer = setTimeout(fn, delay)
    }
}

function throttle(fn, delay) {
    let pre = Date.now()
    return function() {
        if (Date.now() - pre >= delay) {
            fn()
            pre = Data.now()
        }
    }
}

let arr1 = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 6, name: '部门6', pid: 3},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]

function toTree(arr) {
    let res = []
    let map = {}
    for (let item of arr) {
        let {id, pid} = item

        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            ...item,
            children: map[id].children
        }

        let newItem = map[id]
        if (pid === 0) {
            res.push(newItem)
        } else {
            if (!map[pid]) {
                map[pid] = {
                    children: []
                }
            }
            map[pid].children.push(newItem)
        }
    }
    return res
}

// call的实现
Function.prototype.ICall = function(context) {
    // 判断调用对象
    if (typeof this !== 'function') {
        throw new Error('type error')
    }
    // 获取参数
    const args = [...arguments].slice(1)
    let result = null
    // 如果没有传 就设置为 window
    context = context || window
    // 将调用的方法设置到context上
    context.fn = this
    // 执行
    result = context.fn(...args)
    // 把这个方法再从 context 上删除
    delete context.fn
    return result
}
const dict = {
    name: 'npz',
    age: 25
}

function foo(a, b) {
    return {
        name: this.name,
        age: this.age,
        a: a,
        b: b
    }
}
const result = foo.ICall(dict, 1, 2)
console.log(result)

// apply 的实现
// context 就是要绑定的那个对象
Function.prototype.IApply = function(context) {
    if (typeof this !== 'function') {
        throw new Error('type error')
    }

    let result = null
    context = context || window
    const fnSymbol = Symbol()
    // 防止覆盖context中的同名属性
    context[fnSymbol] = this
    if (arguments[1]) {
        result = context[fnSymbol](...arguments[1])
    } else {
        retult = context[fnSymbol]()
    }
    delete context[fnSymbol]
    return result
}

// instanceof 实现
function myInstanceof(target, origin) {
    if (target === null || typeof target !== 'object') return false
    if (typeof origin !== 'function') {
        throw new Error('origin must be function')
    }
    let proto = Object.getPrototypeOf(target) 
    while (proto) {
        if (proto.constructor === origin) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}

// const list = []
// console.log('instance',myInstanceof(list, Array))

// 数组扁平化实现
function flat(arr, depth = 1) {
    if (depth > 0) {
        return arr.reduce((pre, cur) => {
            return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur)
        }, [])
    }
    return arr.slice()
}

// const list = [[1, 2], [3, 4]]
// console.log(flat(list))

// reduce 实现
// 注意这里不能用箭头函数  否则 this 就指向 window 了
Array.prototype.Ireduce = function(cb, initialvalue) {
    const arr = this
    let total = initialvalue || arr[0]
    for (let i = initialvalue ? 0 : 1; i < arr.length; i++) {
        total = cb(total, arr[i], i, arr)
    }
    return total
}
const list = [1,2,3,4]
const total = list.Ireduce((pre, cur) => pre + cur)
console.log(total)

class Scheduler {
    constructor() {
        this.waitTasks = []  //等待执行的任务队列
        this.excutingTasks = [] // 正在执行的任务队列
        this.maxExcutingNum = 2 // 允许同时运行的任务数量
    }

    add(promiseMaker) {
        if (this.excutingTasks.length < this.maxExcutingNum) {
            this.run(promiseMaker)
        } else {
            this.waitTasks.push(promiseMaker)
        }
    }

    run(promiseMaker) {
        const len = this.excutingTasks.push(promiseMaker)
        const index = len - 1
        promiseMaker().then(res => {
            this.excutingTasks.splice(index, 1)
            if (this.waitTasks.length) {
                this.run(this.waitTasks.shift())
            }
        })
    }
}

const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const scheduler = new Scheduler()
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order, Date.now())))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')





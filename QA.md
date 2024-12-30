# 问题
## 前端基础
- Q：隐式转换（需要复习🚧）
	```js
	if ([] == false) {console.log(1);};
	if ({} == false) {console.log(2);};
	if ([]) {console.log(3);};
	if ([1] == [1]) {console.log(4);};
	```
### == 比较的时候
1. 引用类型和基本类型，先把引用类型转换成基本类型，数组会转成字符串，[1] -> '1'  [] -> '' ,对象也会toString转成字符串,不管是不是空的都会toString成'[object, Object]'
2. 字符串和数字, 会转string为number，‘’会转为0
3. 布尔值和其他 会先把布尔值转为数字
4. NaN 不等于其他
5. undefined == null // true
6. null,undefined与其它任何类型进行比较结果都为false
7. 两个引用类型比较

- Q：变量提升（需要复习🚧）
    函数声明优先于变量声明 
    同名的变量不会覆盖函数，只有同名的函数才会覆盖函数
	```js
	function showName() {

	console.log('Toutiao');

	}

	showName();

	function showName() {

	console.log('OceanEngine');

	}

	showName();

	//--------------

	var myname = "abc"

	function showName2(){

	console.log(myname);

	var myname = "aabbcc"

	console.log(myname);

	}

	showName2();

	//--------------

	let myname3= 'toutiao'

	{

        console.log(myname3)

        let myname3= 'oceanengine'

	}
	```

- Q：浏览器事件循环机制
- A：宏任务&微任务执行顺序需要再复习🚧
  1.	事件循环的核心流程：
	•浏览器的事件循环主要负责协调 同步任务、宏任务 和 微任务。
	•同步任务 会立即执行，运行在主线程上。
	•遇到 异步任务 时，分为两类队列：宏任务队列（setTimeout、setInterval 等）和微任务队列（Promise.then、MutationObserver、queueMicrotask 等）。
2.执行顺序：
	•主线程先执行所有同步任务。
	•然后检查并执行微任务队列中的所有任务，直到清空。
	•微任务队列清空后，从宏任务队列中取出第一个任务并执行。
	•再次检查并执行微任务队列，直到清空。
	•重复以上过程，形成事件循环。
3.宏任务与微任务的区别：
	•宏任务：由浏览器提供的任务类型，如 setTimeout、setInterval、setImmediate、requestAnimationFrame 等。
	•微任务：优先级更高，由 JavaScript 语言本身提供，主要包括 Promise.then、MutationObserver 和 queueMicrotask。
同步代码执行完之后执行的是微任务，微任务执行完之后再执行一个宏任务
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
    
	/*
	script start
	async1 start
	async2
	promise1
	script end
	async1 end
	promise2
	setTimeout
	*/
	```
	- Q：NodeJS事件循环差异？
	- A：需要复习🚧，https://juejin.cn/post/6844903999506923528


- Q：原型链

	```js
	Object.prototype.type = "x";
	Function.prototype.type = "y";

	function A() {};
	const a = new A();

	console.log(A.type);  //构造函数的原型指向的是Function.prototype
	console.log(a.type); // 现在a是个对象了，对象的原型指向的是Object.prototype
	```
 - Q：闭包
 - A：闭包是指 一个函数能够记住它定义时的词法作用域，即使这个函数在其词法作用域之外被调用。
换句话说，闭包可以让内部函数访问到外部函数作用域中的变量，甚至当外部函数已经执行完毕后，这些变量依然存在于内存中。
- 应用场景
 1. 使用闭包实现类似类的私有变量和方法。
```js
function Counter() {
    let count = 0; // 私有变量
    return {
        increment() { count++; },
        getCount() { return count; }
    };
}

const counter = Counter();
counter.increment();
console.log(counter.getCount()); // 输出 1
```

- Q：css盒模型？  标准的盒子模型 宽度=content的width 怪异盒子模型的宽度 = content + paddiing + border
- A：理解OK
	- Q：css画三角形？
	- A：OK

- BFC
块级格式化上下文，是一个独立的渲染区域，内部的元素不会影响到外面的元素，内部box垂直放置，高度计算的时候包含float元素
设置：position: fixed / absolue      overflow的值不为visible
使用场景：去除边界重叠的margin / 清除浮动

- 隐藏元素
opacity： 0  不会影响布局，还会触发事件
visibility： hidden 不会影响布局，也不会触发事件 会触发重绘
display: none 会改变页面布局 引发重排和重绘

- flex: 1
flex-grow: 1  如果有剩余2空间 如何放大 设置为1 所有元素将会等分
flex-shrink: 1 如果有剩余空间 如何缩小 设置为1 空间不足时 会等比例缩小
flex-basis: %0  分配多余空间之前 项目占据的大小 默认为 auto 及项目本身的大小
** 如果设置为 auto 就不是等分了，元素的大小会根据自身内容来计算


- Q：`position` 取值有哪几个？
- A：sticky需要看一下🚧
	- Q：`position` 值与 `z-index`关系？
	- A：需要复习🚧   position可以创建层叠上下文，设置了position之后可以在通过zindex改变元素的层叠等级，也就是在z轴的顺序
    （创建层叠上下文： position的值非static，flex的子元素，grid的子元素，opacity的值小于0）

- Q：重绘、重排、 合成 概念&性能对比？
- A：重绘、重排理解OK，合成 需要复习🚧
重排：元素的尺寸，结构，位置等发生改变，或者页面窗口大小发生变化，浏览器需要重新渲染部分甚至全部的过程
重绘：仅仅是颜色，背景发生改变
合成：浏览器跳过布局和绘制图层，只执行后序的合成操作，是在非主线程执行的
浏览器渲染的阶段：
构建dom树，生成样式表，生成布局，生成图层，图层绘制，这些都是在主线程执行的，重排会重新触发layout，重绘会重新触发图层绘制阶段，再之后就是在非主线程执行的操作，也就是合成操作，使用transform做动画的时候，会直接进入合成阶段，

- vue
	- Q：vue组件的生命周期
	- A：记忆不清晰，需要再看一下 🚧
    beforeCreated：实例创建之前，此时没有数据 没有dom
    created：可以拿到data数据了，还没有dom
    beforemounted：实例挂载之前，
    mounted：实例挂载之后，一般在这里去请求数据
    beforeUpdated：数据修改，视图更新之前
    updated：视图更新之后
    beforeDestoryed：实例销毁之前
    destoryed：实例销毁之后，销毁一下定时器什么的

	- Q：父子生命周期关系？ 
	- A：基本理解，可以再看一下 🚧 https://segmentfault.com/a/1190000015890245
    父组件创建 子组件创建 子组件挂载 父组件挂载

- Q：微前端理解？
- A：基本理解
为了业务解耦，技术栈，部署上线，维护

-  Q： [函数防抖(debounce) & 函数节流(throttle) ](https://juejin.im/post/5a35ed25f265da431d3cc1b1)
- A： 概念/应用场景 OK，防抖的实现原理OK

- Q：TS了解 & js->ts
``` js
let bob = {

    firstName: 'Bob',

    lastName: 'Zhang',

    age: 27

}

function doit(people) {

    return `${people.firstName} ${people.lastName} is ${people.age} years old`;

}

doit(bob);
```

- Q：跨域概念？
- A：OK
	- Q：如何解决跨域问题？
	- A：OK


## Coding
- Q：promise.all / promise.race 实现
```js
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
                    reason: err
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

- Q：实现一个 jsonp 函数
```js
function jsonp(url, data, callback='callback') {
    // 判断url中是否已经有 ？ 有的话就以 & 开头
    let dataStr = url.includes('?') ? '&' : '?'
    // 拼接参数到URL上
    for (let key in data) {
        dataStr += `${key}=${data[key]}&`
    }
    // 拼接callback参数
    dataStr += 'callbacl=' + callback

    // 创建script标签
    const script = document.createElement('script')
    script.src = url + dataStr
    document.body.appendChild(script)

    return new Promise((resolve, reject) => {
        window[callback] = data => {
            try {
                resolve(data)
            } catch (error) {
                reject(error)
            }
        }
    })
}
```

- Q：发布订阅模式实现（https://blog.csdn.net/weixin_35958891/article/details/108436485）
发布订阅模式和观察者模式的关系
发布订阅是有一个事件中心作为媒介，主要强调的是事件的
```js
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
```

- Q：实现JSON.stringify()
```js
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
                    const type = typeof item
                    if (type !== 'undefined' && type !== 'function' && type !== 'symbol') {
                        result.push(`${key}:${stringify(item)}`)
                    }
                }
            })
            return `{${result}}`.replace(/'/g, '"')
        }
    }
    return ""
}
```

- Q：[压缩字符串](https://leetcode-cn.com/problems/string-compression/)

- Q：[出站顺序合法性判断]https://leetcode-cn.com/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof/

## 工程
- Q：拖拽排序的实现思路 https://segmentfault.com/a/1190000018794763
draggable=true 使元素可被拖拽
dragstart 被拖拽元素被开始拖拽
drag 被拖拽时
dragenter 主体时目标元素 进入目标元素时触发
dragover               在目标元素内移动时触发
dragleave 离开目标元素时
drop 目标元素完全可接收被拖拽元素时触发
dragend 结束拖拽时

- Q：前端性能监控思路? https://zhuanlan.zhihu.com/p/82981365
浏览器提供了navigation timing API 用于获取页面的性能指标，通过window.performance.timing获取，根据返回的参数可分为几个阶段：
1. 跳转和重定向阶段
2. fetchStart 浏览器准备好请求页面资源
3. dns 解析阶段
4. tcp连接阶段 从开始连接到完成握手
5. http请求资源阶段
6. 解析渲染dom树阶段
7. 执行onload回调事件阶段
计算这几个阶段的时间点之间的耗时来得出几个重点的指标
首先要确定一个统计的起始时间，一般是从fetchStart开始，
首字节时间：从fetchStart到responseStart的时间，中间经历了dns查询 tcp连接 发送http请求，这个对用户是无感知的
白屏时间：从fetchStart到页面显示第一个元素的时间，也就是dominteractive - fetchStart的时间
首屏时间：页面首屏全部展示出来的时间，这是一个对用户来说非常直观的体验指标，一般是用domContentLoadEventEnd - fetchStart
得到这几个指标之后，需要上报后端，需要注意不能影响页面性能和主流程的逻辑，有两种方案：
1. img标签的src属性，可以跨域
2. navigator.sendBeacon 他是异步执行的，

## 项目难点
可视化编辑页面UI
左侧为UI模块列表，以图片形式展示，中间是预览区域，右侧是UI内容编辑区域
需求为点击左侧的一个UI模块图片，将其顺序添加展示到中间的预览区域，并且在右侧显示此模块可编辑的信息，标题、价格等，编辑这些信息，然后实时显示到预览区域部分，中间预览区域的模块需要可拖拽排序
实现方案
左侧就遍历展示图片，当点击某一模块图片时，将其相关的初始数据push到预览区域绑定的列表中，这些数据不包含ui信息
预览区域遍历要显示的模块数据的列表，每个模块的UI样式都是不同的，如何让其正确的展示出来，将每个模块的UI都写在此处，在循环遍历的内部，通过v-if判断接收到的模块数据的类型，如果是和自己相匹配的就渲染此模块，

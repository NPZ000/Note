## 变量声明
一段 js 代码首先会经过编译，在编译阶段，会把 var 声明进行提升，并且赋值为 undefined，然后还会把函数声明提升，函数声明会覆盖同名的变量
```js
showName()
var showName = function() {
    console.log(1)
}

function showName() {
    console.log(2)
}
// 2
```
以上代码在编译阶段会发生如下操作
```js
showName = undefined
function showName() {...}
```
很明显 showName 函数覆盖了 showName 变量
执行阶段
```js
showName()
showName = function() {
    console.log(1)
}
```
首先执行了 showName 函数，会输出 2，然后对 showName 又重新进行了赋值操作，如果接下来再执行一次 showName 会输出 1

*** var声明的变量在编译阶段被放在变量环境中 初始化值为undefined，let 和 const 声明的变量被放在词法环境中，提前访问会报错 ***

### 块级作用域
let 声明的变量就会形成块级作用域，块就是花括号包裹的区域，块级作用域里面可以访问到外面的变量，但是外面不能访问到块级作用域里面的变量
对于一个变量，通常情况下，在使用它之前会有三步，创建、初始化、赋值
- 对于 var 声明的变量，创建 初始化会被提升，所以在声明之前读取会是undefined，因为被初始化为了undefined
- 对于 let 声明的变量，只有创建会被提升，因此在声明之前读取会报错 未初始化
- 函数声明，创建 初始化，赋值都会被提升

### 词法作用域
是由代码中函数声明的位置决定的，也就是说在声明阶段就形成了，所以如果函数在声明的时候就是嵌套在一起的，那么它们的作用域链就是在一起连着的，相反，如果函数是单独声明的，那么就算是在一个a函数内部调用了另一个函数b，函数b的外层也还是全局作用域

内层函数的 this 是不会继承外层函数的
```js
var name = 'globaName'
const obj = {
    name: 'npz',
    foo: function() {
        const bar = function() {
            console.log(this.name)
        }
        bar()
    }
}
obj.foo() // globaName
```
可以看到 foo 函数内部的 bar 函数中的 this 并没有继承 foo 函数的 this，要想能继承，两种办法
1. 把 foo 函数的 this 保存在变量中，然后在 bar 函数中去引用，这是利用了作用域链的查找机制
```js
var name = 'globaName'
const obj = {
    name: 'npz',
    foo: function() {
        const that = this
        const bar = function() {
            console.log(that.name)
        }
        bar()
    }
}
obj.foo() // npz
```
2. 使用箭头函数, 箭头函数么有自己的执行上下文，他的 this 默认就是继承外层函数的
```js
var name = 'globaName'
const obj = {
    name: 'npz',
    foo: function() {
        const bar = () => {
            console.log(that.name)
        }
        bar()
    }
}
obj.foo() // npz
```

*** 一个函数的执行上下文中包括 变量环境 词法环境 this outer(指向外层作用域) ***

JS 是
弱类型：不需要提前声明变量是什么类型
动态：可以把不同类型的变量相互赋值，也就是可以用同一个变量保存不同类型的数据

## 内存
基本类型的数据放在栈中，引用类型的数据放在堆中，然后在栈中会有一个变量保存着指向堆中的地址

## 垃圾回收 GC
- 栈中的数据是如何回收的
在调用栈中会有一个记录当前执行状态的指针（ESP），指向当前正在执行的函数的执行上下文，当前函数执行完毕，指针下移，这个过程就是销毁上一个执行上下文的过程，其实也并没有被真正的销毁掉，而是被当做无用的，下一个新的函数的执行上下文进来后会覆盖掉它
- 堆中的数据是如何回收的
回收堆中的数据就得使用垃圾回收器了
 - 代际假说
    1. 大部分对象存活时间短，可能只用一下之后就不可用了
    2. 存活时间长的对象
V8 把堆分为新生代和老生代两个区域，新生代存放的是存活时间短的以及小的对象，老生代中放的是生存时间久的对象以及大的对象
新生代通常空间小，而老生代空间大
主垃圾回收器负责老生代的垃圾回收，副垃圾回收器负责新生代的垃圾回收
- 垃圾回收器的流程-标记法
    1. 标记空间中的活动对象和非活动对象，活动对象就是还在使用的对象，非活动对象就是可以回收的垃圾对象
    2. 标记完成后，统一清理被标记为可回收的对象
    3. 内存整理，回收对象后，会出现不连续的空间，就需要整理还在的活动对象
- 副垃圾回收器
负责新生代的垃圾回收，通常情况下，小的对象会被直接放到新生代区域
使用 Scavenge 算法：把新生代区域划分为两块，一半是对象区域，一半是空闲区域。当对象区域快被写满时，就进行一次回收，具体流程：
    首先对对象区域的垃圾进行标记，标记完成后，把还在存活的对象有序的复制到空闲区域，之后再把两者角色互换，对象晋升策略：在两轮垃圾回收后还存活的对象就会移动到老生代区域
- 主垃圾回收器
负责老生代的垃圾回收，使用标记-清除法，标记阶段会遍历堆中的数据，还有人在用的是活动对象，没有人用的标记为垃圾数据，垃圾数据就会被回收，可能会产生大量的不连续的内存碎片，这个问题用标记-整理的算法处理：所有的存活对象都向一端移动，端边界以外的内存都清理掉
- 全停顿
垃圾回收过程中，js 是要暂停执行的
    - 增量标记：把一个完整的垃圾回收任务拆分成很多小的任务，穿插在js 脚本中执行

## V8 的工作原理
编译型语言：代码经过编译之后，成为二进制文件并且保留，下次直接运行二进制文件
源代码 -> AST -> 中间代码 -> 代码优化 -> 二进制文件
解释性语言：每次运行时都要通过解释器对代码进行动态解释和执行
源代码 -> AST -> 字节码 -> 执行

- V8 是如何执行代码的
1. 生成抽象语法树 AST 和执行上下文
    - 分词；词法分析，将每行代码拆解成一个个 token，token 指的是语法上最小的单位，比如
    ```js
    var a = '1'
    ```
    其中关键字 var 、 a 、 = 、 ‘1’ 都是 token
    - 解析：语法分析，将上一步生成的 token 数据，根据语法规则生成 AST
2. 生成字节码
解释器根据 AST 生成字节码，并解释执行字节码
字节码是介于 AST 和机器码之间的一种代码，还是需要解释器将其转换为机器码才能执行
3. 执行代码
生成字节码之后，接下来就要进入执行阶段
如果是第一次执行，解释器会逐条解释执行，在解释器解释执行代码的过程中，如果发现一段代码被重复执行多次，这种就称为热点代码，那么就用编译器把这段热点代码编译为高效的机器码，当再次执行这段代码时，就可以直接执行被编译后的机器码，这种两者配合的技术叫 JIT-即时编译

## 事件循环和消息队列
在事件执行的过程中，总会产生一些新的事件要执行，那么如何知道有新的事件产生并执行他呢
循环监听是否新的任务加入并且执行就是事件循环
因为 js 是单线程执行的，如果有一些事件执行时间很长，那么就会造成卡顿，所以要把这些事件放入消息队列中
消息队列是一种数据结构，存放要执行的任务，队列是先进先出的。消息队列用来存放其他线程产生的任务，比如 IO 线程产生的点击事件等等，渲染主线程会循环的从消息队列读取任务并执行，异步执行的代码也放入消息队列中
消息队列存在效率和实时性的问题，引入了微任务的概念，当一个宏任务执行完之后会去清空他产生的微任务队列，然后再取一个宏任务执行

## 一篇html是如何解析的
浏览器是不认识 html 格式的文档的，要想渲染出页面就需要把 html 转换成 dom 数结构
DOM 树如何生成
渲染引擎里有一个 HTML 解析器负责转换 html 为 dom 树，渲染进程接收到网络进程的 html 数据，是边接收边解析的
- 分词器将字节流转换成 token，token分为tag token和文本 token，tag token又分为start tag和end tag，
- 之后将 token 解析为 dom 节点并添加到 dom 树中
html 解析器维护了一个 token 栈结构，是用来计算节点之间的父子关系的，第一个阶段生成的token会被压入到这个栈中，具体的规则如下：
    1. 如果是一个 startTag token，会入栈并生成一个dom 节点并加入到dom树中
    2. 如果是文本 token，就会生成一个文本节点，直接加入到dom树中，他的父节点就是栈中顶部token对应的节点
    3. 如果是 endTag token，就会查看栈中是否有对应的startTag token，有的话就弹出
如果遇到了内嵌js代码，因为js代码中可能会对之前生成好的dom进行修改，所以这时候需要暂停dom的解析，然后去执行js代码，如果是引入的js文件，就需要等待js文件加载完成然后去解析，如果我们事先知道引入的这个js文件里面没有操作dom，就可以设置让他异步执行，不要阻塞dom 的解析，如果js代码中修改了css，那么就需要等之前的css文件下载解析完，再接着执行js

## 箭头函数的特性
1. 箭头函数没有自己的 this，会捕获他所在的上下文的 this 值，作为自己的 this 值
2. 箭头函数没有 constructor，是匿名函数，不能作为构造函数，不能通过 new 调用
3. 没有 new.target 属性，在通过 new 运算符被初始化的函数或者构造方法中，new.target 指向构造函数的引用，
4. 箭头函数没有 arguments 对象，通过 call 或者 apply 调用时，只能传递参数
5. 箭头函数没有原型属性
6. 不能当作 generator 函数，不能使用 yield 关键字

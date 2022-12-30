#### 浏览器内核
    渲染引擎：负责处理html和css，然后渲染并输出页面
    Js引擎：解析和执行js代码，

#### Html5 新特性
    canvas 
    video
    radio
    local storage 长期存储，网页关闭不丢失
    session Storage 浏览器关闭会丢失
    语义话标签：article footer header nav
    表单控件 calendar date time email url
    新的技术 webworker websocket

#### 对html语义化标签的理解
1. 用正确的标签做正确的事情
2. 让页面的内容结构化，结构更清晰
3. 即使在没有css 的情况下也是以一种文档格式显示，并且是容易阅读的
4. 搜索引擎的爬虫依赖html标记来确定上下文和各个关键字的权重，利于seo
5. 便于阅读 维护和理解

#### html5的离线存储
没有联网时可以访问网页，联网时更新缓存文件
原理：基于一个新建的.appcache文件的缓存机制，通过这个文件的解析清单离线存储资源，没有网络时会读取这些资源
使用：在页面头部加入一个manifest的属性；在cache.manifest文件编写需要存储的资源；在离线状态时，操作window.applicationCache进行需求实现

#### 浏览器对离线储存资源的管理
在线时，发现html头部有manifest属性，会请求manifest文件，如果是第一次，会根据文件内定义的内容下载相应的资源并存储，如果是第二次访问会对比新旧manifest文件，如果有改动就更新并重新进行存储，离线的情况下就直接使用存储的资源

#### cookies sessionStorage localStorage
cookies 是为了标识用户身份存储在本地的数据 一般是加密过的，始终在同源的http请求中携带，后两者不会发送仅仅是在本地存储
cookies大小不能超过4k 后两者可以达到5m甚至更多
cookies在设置的过期时间内一直有效 即使是关闭浏览器 session在关闭浏览器时会没 local会一直在

#### iframe的缺点
会阻塞主页面的onload事件 搜索引擎无法解读 不利于seo
和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载
如果需要使用，可以通过js动态给iframe添加src属性 就可以绕开这两个问题

#### label的作用
定义表单控件之间的关系，当用户选择该标签时，会自动将焦点转到和标签相关的表单控件上

#### form 如何关闭自动完成功能
设置autocomplete为off

#### 实现浏览器多个标签页的通信
websocket
使用localStorage的本地存储方式，localStorage在另一个页面被变更时都会触发一个事件，通过监听这个事件 storage事件 控制他的值来进行通信

#### 实现一个圆的可点击区域
svg border-radius

#### Title 和 h1
前者没有明确意义只表示是个标题 后者表示层次明确的标题，对页面信息的主页有很大的影响


#### 盒子模型
content padding border margin

#### Css选择符 可继承的
相邻选择 h1 + p
子选择器 ul > li
后代选择器 li a
通配符选择器 * 
属性选择器 a[src=‘']
伪类选择器 a:hover   li:nth-child
可继承的： font-size font-family color 
不可继承的 border padding margin width height


#### Css优先级算法
1. 就近原则
2. 内联样式 嵌入式 外部样式
3. !important > id > class > tag

#### css3新增伪类
p:first-of-type 一组兄弟元素中其类型的第一个元素
p:last-of-type 
p:only-of-type 没有相同类型的元素
:only-child 唯一的子元素
nth-child(2) 第几个元素
::after ::before :disabled :checked

#### 水平居中
1. 设置一个宽度 然后margin: 0 auto
2. 设置绝对定位 然后top left bottom right 都为0  再设置margin为auto

#### 水平垂直居中
1. 设置relative top:50% left:50% 然后margin-top、margin-left 设置为自身宽高的一半
2. 设置relative top:50% left:50% transform:translate(-50%,-50%)
3. display：flex; justify-content:center align-items:center

#### display的值
1. block 块类型
2. inline 行类型
3. none 不显示
4. inline-block 可以设置宽高 同行显示
5. list-item 像块类型一样显示 添加样式列表标记
6. table 
7. inherit 继承父元素的display

#### position的relative和absolute的定位原点
absolute是相对于值不为static的第一个父元素 一般是body元素
relative是相对于自身

#### css3的新特性
Border-radius
Shadow
Text-shadow
Text-decoration
Transform

#### css创建一个三角形的原理
宽高设为0 设置border的width 隐藏掉相邻的三条border（border-color设置为transparent

#### css 实现多列等高
1. 利用margin-bottom 和 padding-bottom 正负值相抵
父容器设置overfow:hidden 
2. 父容器设置 display：flex 子元素设置 flex: 1

#### li和li之前的看不见的空白间隔
会受到中间的一些空格或者回车的影响。这些也属于字符。也会被应用于样式，设置字符大小为0 就可以解决

#### 为神马要初始化样式
因为每个浏览器的默认样式i不一样

#### Css里的visibility：collapse 
对于普通元素将会完全隐藏并且不占据页面空间 如果是table元素，会隐藏但是会占据页面空间，仅在Firefox有用 Chrome下会隐藏但是占据空间

#### 对BFC的理解
块级格式化上下文，是一个独立的容器，内部与外部不影响 设置overflow:hidden 可以实现

#### padding合并 
两个padding合并时 会合并为一个。以最大的那个为准

#### 媒体查询
@media

#### css优化 提高性能
1. 关键选择器：选择器最后面的部分
2. 如果有id作为关键选择器 就不要再写其他的了
3. 提取共有样式，增强可复用性，按模块编写组件

#### 浏览器怎么解析css选择器
从关键选择器开始匹配，然后左移动查找选择器的祖先元素
只要选择器的子树在工作，样式系统就会左移，直到和规则匹配 或者找不到就放弃

#### ::before 和 :after 单引号和双引号的区别
单的用于伪类 双的用于伪元素
新引入的伪元素不支持旧的单写法
before在前面插入 after 在后面插入

#### 手写动画最小时间间隔
多数显示器默认频率时60hz 即一秒刷新60次  所以理论上最小间隔为 1/ 60 * 1000ms

#### overfow:scroll 不能平滑滚动
scroll-behavior: smooth;

#### 什么是cookie隔离
如果静态文件都放在主域名下，那么请求的时候都会带上cookie，非常浪费流量
因为cookie有域的限制，因此不能跨域提交请求
js
基本数据类型：undefined null boolean number string symbol

#### 内置对象
object

#### JS原型 原型链 特点
每个对象在其内部都会初始化一个属性 就是原型prototype，当访问一个对象的属性时，首先从自身寻找 如果找不到就去prototype上找 他的prototype还可能会有自己的prototype 这样层层链接
特点：js对象时通过引用传递的，创建的每个新对象实体中都是指向原型的 当原型修改时 会修改所有实例

#### js创建对象的几种方式
1. 对象字面量的方式，就是平时最常用的写法
2. 无参的构造函数
```javascript
function Person() {}
const person = new Person()
person.name = ''
person.age = 11
```
3. 传参的构造函数
```javascript
function Person(name, age) {
  this.name = name
  this.age = age
}

const tom = new Person('tom', 11)
```
4. 工厂模式
```javascript
function createPerson(name, age) {
  const o = new Object()
  o.name = name
  o.age = age
  return o
}

const tom = createPerson('tom', 11)
```
在函数内部创建一个空对象，然后把传进来的参数赋值到新对象对应的属性上，最后返回这个新对象
5. 原型模式
```javascript
function Person() {}
Person.prototype.name == 'tom'
const tom = new Person()
console.log(tom.name)
```
创建一个空的构造函数，把属性直接挂在构造函数的原型上，然后生成构造函数的实例，这样每个实例都会共享父集的原型上的属性和方法

#### 作用域链
外层函数不能访问内层函数的作用域，但是内层函数可以访问外层函数的作用域，并一层层的向外寻找，就形成了作用域链
```javascript
function foo() {
  const color = 'red'
  function bar() {
    console.log(color)
  }
  bar()
}
foo() // 'red'
```
#### this对象
判断 this 指向的四条规则
1. 是否是 new 调用，如果是那么指向的是new 生成的新对象
2. 是否是call apply bind 绑定，如果是的话，那么指向的是绑定的对象
3. 是否被某个方法或者对象所拥有，是的话，就指向那么方法或者对象
4. 都不是的话，就默认指向全局

#### window对象和document对象
window对象是指浏览器打开的窗口
document对象是指Document对象，也就是Html文档对象的一个只读引用，是window对象的一个属性

#### null 和 undefined 的区别
null 是空值，是需要手动设置的，
undefined是声明了变量，但是没有赋值，那么他就是undefined
null是一个有效的json，undefined不是
null 的类型（typeof） 是 object
undefined的类型就是 undefined

#### ['1','2','3'].map(parseInt)
结果是[1,NaN,NaN],why?
parseInt 方法接受两个参数，第一个参数是要转换的值，第二个参数是转换时使用的基数（几进制）-- radix，
map 方法接受一个回调函数用于对数组元素进行处理，这个回调函数接收三个参数，第一个数组的每一项，第二个参数是索引，第三个参数是原数组。
这里直接把parseInt直接丢给 map 方法，会把map的回调函数的那三个参数传给parseInt方法，也就是说这里的parseInt方法接受到两个参数，第一个参数是数组的项，第二个是索引,如下
```javascript
parseInt('1', 0)
parseInt('2', 1)
parseInt('3', 2)
```
第一个：转换'1',radix为0，按照文档的说法，radix 为0，相当于没传或者传了undefined，如果是这种情况，会怎么转换呢，以下摘抄自 MDN
1. 如果输入的 string以 "0x"或 "0x"（一个0，后面是小写或大写的X）开头，那么radix被假定为16，字符串的其余部分被当做十六进制数去解析。
2. 如果输入的 string以 "0"（0）开头， radix被假定为8（八进制）或10（十进制）。具体选择哪一个radix取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。因此，在使用 parseInt 时，一定要指定一个 radix。
3. 如果输入的 string 以任何其他值开头， radix 是 10 (十进制)。
所以这里按照第三条规则进行转换，结果就是1。
第二个：转换'2',radix 为 1，对于 radix 参数，还有一条规则，那就是必须是 2 - 36 中间的数，如果不是，直接返回 NaN，所以这里结果就是 NaN
第三个：转换'3'，radix 为 2, 因为 2 进制的数中只有0 和 1，所以这里没法解析，返回了 NaN

#### 闭包
有权访问另一个函数作用域中的变量的函数，创建闭包最常用的方式就是在一个函数内部创建一个匿名函数，然后返回这个匿名函数
```javascript
function foo() {
  const name = 'tom'
  return function () {
    return name
  }
}
const resName = foo()
console.log(resName())
```
看这段代码，本来我们在外面是没法拿到那个 name 的值，但是里面的匿名函数可以拿到。执行 foo 方法，返回里面的匿名函数，然后再执行这个匿名函数，就拿到了里面这个 name 的值，这就是闭包的机制。
闭包有什么问题呢
先来说一说闭包和 this 的碰撞
```javascript
var name = 'window'
const obj = {
  name: 'Npz',
  getName() {
    return function () {
      return this.name
    }
  }
}
obj.getName()()  // 'window'
```
结果为什么是 window， 为什么里面的匿名函数没有拿到 obj 的 name，这里再提一嘴 this 的指向，他是在运行时决定的，不是声明时决定的，这里的匿名函数被返回之后就和 obj 没关系了（这样说好像不太严谨，暂且这么理解吧），这里和 obj 有关系的是 getName，最后一行代码相当于
```javascript
const func = obj.getName()
func()
```
这样就可以很直观的看出来，这个函数执行的时候是不依赖任何人的，是独立执行的，所以他的 this 指向的就是全局的 window。
那我们怎么可以让里面这个匿名函数拿到 obj 的 name？
按照闭包的原理，匿名函数是可以访问到外层父函数（getName）的变量的，然后 getName 的 this 是指向 obj 的，那我们可以在 getName 函数内部拿到 obj 的 this，并存起来，然后在匿名函数内部拿到这个 this
```javascript
var name = 'window'
const obj = {
  name: 'Npz',
  getName() {
    const that = this // 拿到 obj 的 this 存起来
    return function () {
      return that.name // 这个 that 就是 obj 的 this
    }
  }
}
obj.getName()()  // 'Npz'
```
除了这个还有什么办法呢
```javascript
var name = 'window'
const obj = {
  name: 'Npz',
  getName() {
    return (function () {
      return this.name 
    }).apply(this)
  }
}
const resName = obj.getName()
console.log(resName) // 'Npz'
```
通过 call 或者 apply 显式的绑定 this，或者 bind 硬绑定也可以
还有一种办法，我们都知道，箭头函数的 this 是继承自父函数的，如果返回的匿名函数是个箭头函数就也是可以的
```javascript
var name = 'window'
const obj = {
  name: 'Npz',
  getName() {
    return () => {
      return this.name 
    }
  }
}
const resName = obj.getName()()  
console.log(resName)
```
按照我们刚才说的，返回的这个匿名的箭头函数的 this 就指向 getName，而 getName 的 this 又指向了 obj，所以这里的结果就是 'Npz'
再说回来，闭包存在什么问题呢？
我们都知道，按照内存回收的机制，每个函数在执行完毕之后，都会进行销毁和内存回收，但是闭包不会这样，还看最开始的闭包代码
```javascript
function foo() {
  const name = 'tom'
  return function () {
    return name
  }
}
const resName = foo()
console.log(resName())
```
本来 foo 方法执行完毕之后就会被销毁，里面的变量也都会被销毁，但是这里内部返回的匿名函数引用了 foo 函数内部的变量，所以这里就不能对这个引用的变量进行回收，因为之后还可能会引用他，这样就造成了内存泄漏的问题。如果要解决这个问题，就需要对匿名函数进行手动释放。
闭包可以干什么呢？
1. 创建私有变量
```javascript
function myObj() {
  const name = 'Npz'

  function getName() {
    return name
  }
  return {
    getName
  }
}

console.log(myObj().getName())
```
本来 myObj 里面的 name 我们在外面是访问不到的，但是我们在里面定义了一个函数，函数内部返回了 name，然后我们又把这个方法返回，我们在外面调用这个方法，就可以拿到里面那个 name 的值

#### use strict
严格模式，在严格模式下，js会以更严格的标准执行，比如
1. 不能用 with
2. 全局变量的显示声明
3. 函数必须声明最顶层
4. 不允许在非函数代码块内声明函数

#### 判断一个函数属于一个类
instanceof

#### new操作符做了什么
1. 创建一个空对象，并且 this 变量引用该对象，同时继承了该函数的原型
2. 属性和方法被加入到了 this 引用的对象中
3. 新创建的对象由 this 所引用，并且最后隐式的返回了this
```javascript
var obj = {}
obj.__proto__ = Base.prototype
Base.call(obj)
```

#### hasOwnProperty
Object.hasOwnProperty(propertyName)
查找对象是否拥有这个实例属性，只会查找实例属性，不会去原型上找

#### AMD CMD commonJs ES6的模块化
1. commonJS：使用 module.exports 定义当前模块对外输出的接口，然后用require加载模块
```js
// common.js
const foo = ''
function add(a, b) {
  return a + b
}
module.exports = {
  add, foo
}

const common = require('./common')
console.log(common.foo)
```
commonJS是用同步的方式加载模块，在服务端，模块文件都存在本地磁盘，读取都很快，所以这样是没问题
2. AMD
依赖前置，提前执行
采用异步方式加载模块，模块的加载不会影响后面语句的执行，所有依赖这个模块的语句都定义在一个回调函数中，等加载完成后，才会执行这个回调函数。
require JS的实现：
 (1) 用require.config指定引用路径，
 (2) 用define定义模块，
 (3) 用 require 加载模块
3. CMD
依赖就近 延迟执行
在需要的时候才会去 require
 AMD 和 CMD 的区别
 AMD 在声明依赖的模块时会第一时间加载并解析模块内的代码，无论这个模块是否会被使用都会提前去加载和解析他；而 CMD 是用到的时候才会去才会去 require 加载，然后需要等模块解析后才能继续执行下面的代码，是同步的
4. ES6 module
export 导出 import 导入

ES6的module 和 CommonJS 的区别
commonjs 输出的值是值的拷贝，一旦输出某个值，模块内部的变化就不会再影响到这个值
module 在遇到模块加载命令的时候 会生成一个只读引用，等到脚本真正执行的时候，再根据这个只读引用，到被加载的那个模块里面去取值，如果原始的值变了，import 进来的值也会改变

#### requireJS
如何动态加载的： 使用创建script元素，通过指定script元素的src属性来实现加载模块
如何避免多次加载：模块的定义是一个function，这个function实际是一个factory （工厂模式），这个factory在需要使用的时候也就是require的时候，才有可能会被调用，如果已经检查到调用过了，已经生成了模块实例，就直接返回模块实例，而不会再次调用方法了

#### 如何实现一个模块加载器

#### call 和 apply 的区别
call 的参数是一个一个传入的， apply的参数是一整个放在数组里传入的

#### 数组和对象的方法
数组： slice splice concat includes join push pop shift unshift
对象：hasOwnProperty has instanceof assign delete 

#### js 实现一个类 实例化一个类

#### 作用域 
每个函数都会有一个作用域，里面包含着可以访问的数据，如果函数嵌套了，里面的函数可以访问到外面函数中声明的变量，但是外部函数不可以访问内部函数的变量，向上可以一直查找，就形成了作用域链

#### 变量声明提升
var 声明的变量在编译阶段会会提升到最顶端 还有函数声明也是

#### 如何编写高性能的js
几个常用的手段
1. 数组分块 
如果数组的量级很大，然后还需要循环处理，可能运行的时间就会很长，然后浏览器对运行时间是有一个限制的，然后他就会提示你运行时间过长，这时候我们可以把数组进行分块处理，每次只取出一小块进行处理，
2. 函数节流和防抖
都知道，dom 操作是非常消耗性能的，如果在短时间内进行大量的 dom 操作，就可能使浏览区崩溃，比如在监听页面滚动的时候去执行方法，这种情况就可以使用防抖的办法。大概的思路就是。第一次执行函数的时候。给他设置一个定时器，函数被再次触发的时候，会先清掉上一个定时器，然后重新开一个
3. 避免全局查找
从作用域链的角度来看，全局变量的查找时间肯定是比局部变量耗时的，因为会有一个查作用域链的操作，所以我们要尽量避免去查找全局变量
4. 优化循环
循环的基本优化步骤：减值循环，简化终止条件，简化循环体，使用后测试循环
5. 事件委托

#### 哪些操作会造成内存泄漏
1. 意外的全局变量
2. 闭包
3. 被遗忘的定时器
4. 元素被js变量引用

#### 前端 templating（mustache，underscore，handlebars
web模板引擎是为了使用户界面与业务数据分离而产生的
mustaches 是一个轻逻辑的模板解析引擎，它的优势在于可以应用在多种语言中
underscore 封装了常用的js对象操作方法，用户提高开发效率
handlebars 是 js 一个语义模板库，通过对 view 和 data 的分离来快速构建 web 模板

#### webpack 热更新原理
1. webpack在编译的时候，为需要的entry注入热更新的代码（eventSource通信）
2. 页面首次打开之后，服务端与客户端通过eventSource建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到hash之后，这个hash将作为下一次请求服务器 hot-update.js 和 hot-update.json 的 hash 
4. 修改页面代码后，webpack 监听到文件修改，开始编译，编译完成之后，发送build消息给客户端
5. 客户端获取到 hash 后构造hot-update.js script链接，然后插入主文档
6. hot-update.js 插入成功之后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 vue 组件的 render 方法，重新render组件，从而实现热更新


#### Object.is == ===
==会进行隐式的类型转换，=== 会按照类型严格判断
object.is +0 和 -0 不相等 NaN 和 NaN 相等

clientHeight: 内容可视区域的高度，不包括边框和滚动条的高度
offsetheight：内容可视区域的高度，包括边框和滚动条的高度
scrollTop：视图滚动的距离
scrollHeigh：所有内容的高度
offsetTop 元素距离顶部的距离

### Map 和 Set 的区别
Map 是键值对的集合，Set 只是值的集合，且值是不重复的

### Map 和 Object 的区别
Object 的 key 只能是 symbol 或者字符串，Map 的 key 可以是任何类型

### 箭头函数和普通函数的区别
箭头函数的 this 是继承外层作用域的
不可做构造函数，所以不能被 new 调用

### new 的实现原理
1. 创建一个新对象
2. 新对象的 __proto__ 指向构造函数
3. this 指向新对象
4. 执行构造函数中的代码
5. 返回新对象
```js
function create(fn, ...args) {
    const obj = {}
    Object.setPrototypeOf(obj, fn.prototype)
    const res = fn.apply(obj, args)
    return res instanceof Object ? res : obj
}
```





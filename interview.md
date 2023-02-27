# 网络 
- TCP/IP 四层概念模型
1. 应用层（HTTP、FTP
2. 传输层（TCP、UDP
3. 网络层（IP 
4. 数据链路层

- TCP 和 UDP 的区别
首先这俩都是传输层的协议
1. TCP 是面向连接的，UDP 是面向无连接的。所以 TCP 只支持单播，而 UDP 还支持多播和广播
2. TCP 可以保证连接的可靠性和数据的完整性，具有丢包重发的机制，而 UDP 不会保证数据的完整性
3. UDP 的头部体积小，速度更快实时性更好，所以适用于视频会议和直播之类的场景，而 TCP 基于它的特性适用于文件，邮件之类的数据传输
4. UDP 的发送是面向报文的，所谓的面向报文是指应用层交给他多大的报文，UDP 就原样发送。而 TCP 是面向字节流的，会把报文再拆分成小的数据包进行传输

- TCP 的连接过程
三次握手
第一次：客户端向服务端发送一个 SYN 报文
第二次：服务端接收客户端的 SYN 报文，并且回复客户端一个 SYN + ACK 报文
第三次：客户端收到之后，再回复一个 ACK 报文
*** 为什么是三次不是四次也不是两次 ***
第一次客户端发，服务端收，服务端能判定客户端的发送能力和自己的接收能力是正常的
第二次服务端发，客户端收，客户端能判断服务端的接收和发送能力以及自己的发送能力和接收能力是正常的，此时服务端还不知道客户端的接收能力是正常的
第三次客户端发，服务端收，服务端才知道服务端的接收能力是正常的
三次之后，双方才能判断自己和对方的发送和接收能力都是正常的
四次挥手
1. 客户端发送一个 FIN 报文，报文指定一个序列号的值，停止发送数据，等待服务端的确认
2. 服务端收到之后，把其中序列号值加一，作为 ACK 报文回复给客户端
3. 服务端也想断开的话，给客户端发送一个 FIN 报文，报文中制定一个序列号值
4. 客户端收到之后，把其中序列号值加一作为 ACK 报文回复给服务端，然后需要等一会，确保服务端收到这个 ACK 报文了再断开，如果服务端没有收到客户端的 ACK 报文，会再次向客户端发送 FIN 报文。服务端收到客户端的 ACK 报文之后，就会断开链接

- HTTP1.0 和 HTTP1.1 
1. HTTP1.1 比 HTTP1.0 多了一个长链接，设置 connection: keep-alive 
2. 提供虚拟主机的支持，一个物理主机会绑定多个虚拟主机，每个主机都有独立的域名，增加 host 字段来表示
3. 对动态生成内容的支持，HTTP1.0 中浏览器根据content-length来判断接收数据的大小，但是不适用于动态生成的内容，HTTP1.1 中服务端会把数据拆成小的数据包，每个数据包都会携带上个数据包的大小，最后发送一个大小为0的数据包，作为发送完毕的标志
4. 增加 cookie 机制

- HTTP1.1 存在的问题
1. TCP 的慢启动，每个 TCP 建立连接之后，刚开始都会以一个很慢的速度去传输数据，然后再逐渐增加传输速度
2. 队头阻塞：每个连接中一次只能发送一个请求，后面的请求只能等前面的请求发送完才能继续发送
3. 竞争带宽：多个 TCP 连接会竞争固定的带宽
4. 

- HTTP1.1 和 HTTP2 
1. HTTP1.1 中，每个域名只能开启 6 个 TCP 连接，且在每个连接中一次只能发送一个请求，后面的请求只能等前面的请求发送完才能继续发送，也就是队头阻塞问题，而在 2 中，采用了多路复用的技术，只需要开启一个 TCP 连接，所有的请求都用这一个连接，每个请求都会经过一个二进制分帧层，然后被拆成带有请求 ID 编号的帧，服务端收到之后会根据编号重新组装数据
2. HTTP2 可以设置请求的优先级
3. HTTP2 增加了服务端推送
4. 首部压缩，HTTP2 中对请求中没有变动的请求头字段不会重复发送

- HTTP2 存在的问题
1. 因为是基于 TCP 实现的，TCP 每次只能发送一个数据包，如果发生了丢包，这个包就需要重新发送，后面的包也要等这个包重新发送
2. 连接耗时

- HTTP3
基于 UDP 实现了一个 QUIC 协议，
对于 HTTP2 中的 TCP 的队头阻塞问题，HTTP3 中在一个物理连接中可以有多个独立的逻辑数据流
实现了 TCP 的拥塞控制和丢包重发机制
集成了 TLS 加密功能

- HTTP 缓存 
每个浏览器在请求发送之前会检查浏览器是否有缓存，首先会检查强缓存，如果没有命中，然后检查协商缓存，协商缓存会向服务端发起请求
1. 强缓存
    - HTTP1.0 设置 Expires 字段，其值是一个时间点，如果还没有超过这个时间点，则命中强缓存
    - HTTP1.1 设置 Cache-Control：Max-age= ，Max-age的值是一段时间，比如设置为 10 ，就是 10s 之后缓存失效
        （ Cache-Control 的其他值：no-cache 表示可以在客户端缓存资源，但是每次要去服务端做新鲜度校验；no-store 表示不在客户端缓存资源，每次都去服务端获取）
2. 协商缓存
    服务端响应客户端请求的时候，会返回两个字段，Last-Modified 表示资源最后一次修改的时间，Etag 表示资源的唯一标识，客户端再次请求的时候会携带两个字段，If-Modified-Since 其值为 Last-Modifeid 的值；If-None-Match 其值为 E-tag 的值，服务端收到请求之后，会判断这两个字段的值，做资源的新鲜度校验


- HTTPS
对称加密：使用相同的密钥进行加密和解密，但是密钥在传输的过程中容易被中间人劫持
非对称加密：使用公钥加密，私钥解密，自己保留私钥，公钥可以给任何人，但是这样性能差
两者结合：非对称加密交换协商密钥，之后用协商密钥进行对称加密，如何验证服务器的身份（DNS 劫持）
CA 验证服务器的身份
服务器向 CA 机构申请一个证书，需要向机构提交自己的信息，公钥，然后机构对其认证并颁发一个数字证书，证书内容包括服务器自己的信息，公钥以及一个数字签名，这个数字签名是机构对服务器的信息 hash 之后得到一个摘要然后再用私钥对其加密得到的一个签名。
在和客户端的通信过程中，服务端会把这个证书发送给客户端，客户端用 CA 机构的 hash 算法对服务器信息算出一个摘要，然后用 CA 机构的公钥对证书中的数字签名解密，得到一个摘要，然后对比两个摘要，即可验证证书的真实性。客户端如何知道 CA 机构的身份以及它的 hash 算法和公钥，服务端会给他一个证书链。如果通过这个证书链能找到客户端内置的根证书即可验证中间 CA 的身份。

- HTTPS的握手过程
1. 客户端向服务器发送一个加密套件列表和 client_random
2. 服务端选择一个加密算法和 server_random 以及 CA 证书 发送给客户端
3. 客户端验证 CA 证书，然后生成一个 pre-master 用服务器的公钥加密发送过去
4. 服务端收到用自己的私钥对其解密，然后用之前约定的加密算法对这三个随机数进行计算得到一个协商密钥
5. 客户端也用同样的方法生成一个协商密钥，之后双方就用这个密钥进行对称加密

- 常见的 HTTP 请求头 
请求行：方法名 请求地址 协议 
host
Content-Type 
Cookie 
UA：用户的设备信息 
Connection：是否开启长链接
Accept：期望得到的数据类型，语言、压缩格式等
origin/referer：请求来源 
Cache-Control/Last-Modified-Since/If-None-Match：缓存相关 

- 常见的 HTTP 响应头
状态码
Date 
Cache-Control
Content-Type
Set-Cookie 
E-tag / Last-Modified

- 常见的 HTTP 状态码
200 成功 
301 永久重定向
302 临时重定向 
304 资源未修改 
400 请求体有语法错误 
401 需要用户验证
403 服务端拒绝请求
404 资源未找到 
500 服务器内部错误

# 浏览器
- 浏览器的多进程架构
1. 主进程：负责协调其他进程，页面展示，用户交互
2. 渲染进程：负责页面渲染和 JS 的执行
3. 网络进程：请求网络资源
4. 插件进程：运行插件
5. GPU 进程：渲染动画

- 同源策略 
必须是相同的协议、域名以及端口号
1. DOM 层面
同源的页面可以互相操作 DOM，window.opener 可以获取到父级页面的引用
2. 数据层面
可以借助 opener 来获取父级页面的 Cookie 等数据
3. 网络层面
同源的页面才能互相发送请求

- 跨域 
不是同源的就会发生跨域
    - 设置 CORS 跨域资源共享，服务端设置响应头的Access-Control-Allow-Origin，
    - 使用 jsonp，利用 script 标签的是 src 属性不受同源策略的限制

- cookie 
因为 HTTP 是无状态的协议，服务端不知道两次请求的来源是不是同一个人，所以设置了这个字段，里面存放了用户的唯一标识，让服务端知道是谁在发起请求。不可跨域
服务端在 Response-header 中设置 Set-Cookie ，客户端收到之后会放在浏览器，之后每次请求的时候都会携带上

- session 
服务端生成一个 session-id 放在 Cookie 里发给客户端，然后客户端请求的时候携带上，服务端拿到之后查找对应的session信息，确认用户身份

- cookie 和 session 的区别
cookie 存放在浏览器，session 存放在服务端
cookie 只能存字符串，session 无限制
cookie 有 4k 的大小限制，session 无限制
cookie 可以设置长时间有效，session 在页面关闭或者超时都会失效

- token 
用户在登录之后，服务端会对用户信息加密生成一个 token 令牌，发送给客户端，然后客户端请求的时候将 token 设置在请求头上，服务端在接收到之后，对其解密，判断用户身份，相比 session 是无状态，节省存储空间，只需要进行计算即可

- GET 和 POST 的区别
1. GET 可以缓存，POST 不可以
2. 前者一般用来读，后者用来写
3. 前者可以保存为书签，后者不可以
4. 前者只能使用 ASCII，后者无限制
5. 前者只需要发送一个 TCP 数据包，后者需要发送两个，先发请求头，再发请求体

- 开启 GPU 加速的方法
其实让浏览器将元素提升为一个单独的图层
1. transform: translateZ(0)
2. opcity
3. will-change: opcity,transform

- 重排和重绘
改变元素的大小或者几何位置，改变窗口的大小，都会让浏览器重新进行页面的布局，为重排
只改变的元素的样式，如颜色，不需要重新布局，只需要重新绘制，为重绘

- EventLoop
浏览器使用事件循环来协调事件的执行顺序，将所有的事件分为宏任务和微任务，宏任务包括所有同步执行的代码、setTimeout/setInterval、setImmediate，微任务包括 promies.then、MutationObserver，他们的执行顺序是，先执行一个宏任务，然后执行产生的所有微任务，如果执行微任务的过程中产生了新的微任务，也会都执行完，然后再执行下一个宏任务

# 浏览器安全
- XSS 
跨站脚本攻击，攻击者通过各种手段向页面注入恶意脚本，然后浏览器执行恶意脚本，进行读取用户信息等操作
1. 存储型：比如在评论区提交了一段js代码，然后服务端将其存储在数据库，然后回显的时候，会将这段代码读出来，然后浏览器就会执行这段代码了
2. 反射型：在 URL 上拼接了一段恶意脚本代码，然后服务端读取 URL 上的参数，然后插入到页面的内容，然后将页面返回给客户端，客户端在渲染页面的时候，就会执行脚本代码
防范手段：
服务端对客户端发过来的数据进行过滤和转码
浏览器设置 httponly 就会禁止 js 读取 cookie 
充分利用 CSP，禁止向第三方提交数据，禁止执行内连脚本，限制加载其他域的资源文件

- CSRF 
跨站请求伪造：攻击者引导用户打开第三方网站，然后在第三方网站向目标网站发起请求，会携带原来的 cookie，这时服务端会认为是用户本人
防范手段：
1. 设置 cookie 的 SameSite 属性为 Strict，就会禁止第三方网站携带 cookie
2. 验证请求的来源站点
3. 利用 csrf token，同 token 原理，第三方网站无法拿到这个 token 

# HTML
- meta 标签
1. name
提供的是文档级别的元数据，和 content 一起使用，那么表示元数据的名称，content 表示元数据的内容
 1. author 作者
 2. description 文档的描述
 3. keywords 文档的关键字，提供给搜索引擎做seo
 4. viewport 用于移动端，用来设置视口的初始大小，一般 content 设置为 width=device-width;intial-scale=1.0; 意思是宽度设置为设备的宽度，初始的缩放为1:1
 5. robots 爬虫应该对此页面进行的处理
 6. renderer 指定双核浏览器的渲染方式
2. http-equiv
也是和 content 一起使用，设置的值一般是 http-header 允许的值
 1. X-UA-compatible，做 IE 浏览器适配的，content 的值为 IE=edge; chrome=1; 意思是如果有chrome 插件就用 chrome 内核来渲染，如果没有就以浏览器支持的最新版本来渲染
 2. content-type，用来声明文档类型和字符集
3. charset，告诉浏览器使用哪种字符集编码




# JS 
- 变量提升
var 声明的变量，在代码编译阶段会被提升至作用域的顶部
函数声明优先于变量声明, 同名的函数，后面的会覆盖前面的
```js
function showName() {
	console.log('a');
}

showName(); // 'b'

function showName() {
	console.log('b');
}

showName(); // 'b'

//--------------

var myname = "abc"

function showName2(){
	console.log(myname); // undefined
	var myname = "aabbcc"
	console.log(myname); // "aabbcc"
}

showName2();

```

- let/const 和 var 有什么区别
var 声明的变量因为会发生变量提升，所以在声明之前读取会是undefined，而 let/const 不会发生变量提升，所以在声明之前读取会报错
```js

let myname3= 'toutiao'

{
    console.log(myname3) // error

    let myname3= 'oceanengine'

}
```

- 词法作用域/作用域链
是由代码中函数声明的位置决定的，如果函数声明的时候就是嵌套在一起的，那么他么的作用域链就是连在一起的，如果函数是单独声明的，就算是在在一个 a 函数内部调用了另一个 b 函数，b 函数的外层作用域也还是全局作用域
```js
const name = 'window'
function a() {
    console.log(name)
}

function b() {
    const name = 'b'
    a()
}

b() // window

// --------
const name = 'window'

function b() {
    const name = 'b'
    function a() {
      console.log(name)
    }
    a()
}

b() // b
```

- this
优先级依次为
1. 全局 this
2. 作为对象属性调用
3. this绑定 apply call
4. new 调用

函数嵌套的情况， 内层函数的this不会继承外层函数
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
1. 使用箭头函数，内层函数就会继承外层函数的this
2. 将 this 保存在一个变量里，然后内层函数通过这个变量调用，这个是利用了作用域链的特性
3. 内层函数执行的时候用 apply 或者 call 硬绑定 this

- 判断类型
typeof：无法区分null，array，object，值均为 object
instanceof：原理是判断在其原型链上是否能找到该类型的原型，只能判断引用数据类型，无法判断基本数据类型
Object.prototype.toString.call(): 之所以要这么写，是因为其他的数据类型都重写了 toString 方法，如果直接调用的话，就是调用的重写后的方法，那样的话返回的就不是表示类型的值了

- 箭头函数的特性
1. 没有自己的this，会捕获上下文的this，作为自己的 this
2. 没有 arguments 对象
3. 不能作为构造函数 通过 new 调用
4. 没有原型属性 prototype

- new 操作符做了什么
生成一个新的对象
将新对象的 proto 指向构造函数的原型对象
执行构造函数的代码，将 this 指向新对象，也就是为新对象添加属性和方法
返回新对象
（如果 new 一个箭头函数，因为没有this 和 prototype ，所以第二步和第三步都没办法执行

- 内存
基本类型的数据放在栈中，引用类型的数据放在堆中，然后在栈中有一个指针指向堆中的地址

- 垃圾回收 GC
1. 栈中的数据
在调用栈中有一个指针，指向当前正在执行的函数的上下文，当函数执行完毕，上下文销毁，指针下移
2. 堆中的数据
v8 将堆分为新生代和老生代两个区域，存活时间短以及小的数据放在新生代里，存活时间长以及大数据放在老生代
主垃圾回收器负责老生代，副垃圾回收器负责新生代
垃圾回收器主要使用标记法：标记空间中的活动对象和非活动对象，标记完成后，统一处理被标记为可被回收的对象，
副垃圾回收器：将空间分为两半，一般是对象区域，一般是空闲区域，首先对对象区域内的对象进行标记，将还在使用的对象放在空闲区域，然后将两者角色互换，
主垃圾回收器：使用标记清除法，对空间内的数据进行遍历，还有人在使用的就是活动对象，没人使用的就是垃圾数据，对垃圾数据进行回收之后，会出现内存碎片，然后将剩下的对象统一移动到空间的一侧


- 类型的隐式转换
使用 == 比较两个不同类型的数据
1. 引用类型和基本类型的数据比较，会先把引用类型的数据转成基本类型，如果是数组，会转成字符串， [] -> '', [1,2,3] -> '1,2,3'，对象也会转成字符串，不管是空的还是有东西的，都会转成'[object Object]', 其实都是调用了 toString 方法
```js
[] == '' // true
```
2. 字符串和数字比较，会先把字符串转成数字，空字符串会转成 0
```js
'' == 0 // true
'1' == 1 // true
```
3. 布尔值和其他比较，会先把布尔值转为数字，false 转为 0，true 转为 1
```js
false == 0 // true
true == 1 // true
true == 2 // false
```
4. NaN 不等于其他
5. undefined == null 的结果是 true
6. null和undefined 和其他比较都会是 false
```js
null == 1 // false
undefined == false // false
```
7. 两个引用类型比较，会比较他俩是否是同一个变量引用，是的话，就是 true ，反之则是 false
```js
const a = {}
const b = a
const c = b
a == c // true

{} == {} // false
```
再来一套组合拳
```js
'0' == false // true 首先布尔值先转换，false 转成 0，然后字符串在转变，'0' 转成 0
'' == false // true 先布尔值 false 变 0，然后空字符串也变 0
[] == false // true 先 [] 变 '' , 然后 false 变 0，然后 '' 再变 0
```

- 原型链
每个构造函数在生成的时候都会有一个 prototype 属性指向他的原型对象，然后他的原型对象有一个 constructor 属性指向构造函数，通过new 调用构造函数生成的实例，有一个 __proto__ 指针指向原型对象，如果我们把一个函数的原型对象赋值给另一个构造函数的实例对象，那么这个函数的实例对象的 __proto__ 就指向了另一个函数的原型对象，这样就形成了一条原型链，通过 __proto__ 进行连接，在一个对象中查找一个属性时，首先会在对象本身查找，如果没有找到就会顺着原型链往上找

- 继承
1. 基于原型链的继承，生成超类型的实例直接赋值给子类型的原型对象，没法向超类型传递参数以及继承实例属性
2. 借用构造函数继承，直接在子类型的构造函数内部调用超类型的构造函数，没法继承原型上的属性
3. 组合式继承，借用构造函数继承实例属性，然后基于原型链继承原型上的属性
4. 原型式继承，借用object.create ，这个方法接收两个参数，第一个参数是要继承的对象，第二个参数是额外的属性
5. 寄生式继承，在原型式继承的基础上又做了一层封装
6. 寄生组合式继承，封装一个继承方法，方法内用Object.create 方法传入超类型的原型生成一个新的原型对象，然后再赋值给子类型的原型对象

- ES6的module 和 CommonJS 的区别
commonjs 输出的值是值的拷贝，一旦输出某个值，模块内部的变化就不会再影响到这个值。可以动态导入
import 在遇到模块加载命令的时候 会生成一个只读引用，等到脚本真正执行的时候，再根据这个只读引用，到被加载的那个模块里面去取值，如果原始的值变了，import 进来的值也会改变。不可以动态导入

- 手写代码
1. 防抖 debounce
在一段时间之后再执行函数，如果这段时间之内又重新触发了，就重置定时器
输入框的联想功能
```js
function debounce(fn, delay) {
    let timer
    return function() {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, delay)
    }
}
```

2. throttle 节流
函数按设置的固定时间频率执行，也就是说固定的时间内只执行一次
监听滚动条滑动触发事件
```js
function throllte(fn, delay) {
    let prev = Date.now()
    return funtion() {
        const context = this
        const args = arguments
        const current = Date.now()
        if (current - prev >= delay) {
            fn.apply(context, args)
            prev = Date.now()
        }
    }
}
```

3. 手写 JSON.stringify
对于基本类型的数据的处理：NaN 和 infinity 转成 null，undefined 和 function 和 symbol 转成 undefined，字符串要重新用双引号包裹
对于复杂类型数据的处理：null 就直接返回 null，有 toJSON 方法的先调用 toJSON 方法，数组中把类型是 undefined 和 function 和symbol 忽略，对象中把 key 类型是 symbol 的忽略，把 value 类型是 undefined 和 function 和 symbol 的忽略
```js
/**
 * 首先 typeof 判断类型
 * if 基本类型的数据
 *      if NaN or infinity
 *          return null
 *      if undefined or null or symbol
 *          return undefined
 *      if string
 *          "string"
 *      return String(res)
 * if 复杂类型的数据
 *  if null
 *      return 'null'
 *  if call toJson
 *      return stringify(res.toJson)
 *  if array
 *      res = []
 *      data.forEach => 
 *          if item is undefined or function or symbol
 *              res[index] = 'null'
 *          else
 *              res[index] = stringify(item)
 *      return `[${res}]`.replace(/'/g, '"')
 *  if object
 *      res = []
 *      if key's type not symbol
 *            if value`s type not undefined function symbol
 *              res.push(`"${key}":${stringify(value)}`)
 *            return `[${res}]`.replace(/'/g, '"')
 */
```


4. 手写深拷贝
要注意对复杂类型的处理包括 map、set、array 和 object，还要注意循环引用的问题
```js
function cloneDeep(data, map = new Map()) {
    if (typeof data !== 'object') {
        return data
    } else {
        if (data === null) {
            return null
        }
        if (map.get(data)) {
            return map.get(data)
        }
        const type = Object.prototype.toString.call(data)
        const list = ['[object Map]', '[object Set]', '[object Array]', '[object Object]']
        let res = 
        if (list.includes(type)) {
            res = new (data.constructor)()
        }
        map.set(data, res)
        if (type === '[object Map]') {
            for (const [key, value] of data) {
                res.set(key, cloneDeep(value, map))
            }
            return res
        }
        if (type === '[object Set]') {
            data.forEach((item) => {
                res.add(cloneDeep(item), map)
            })
            return res
        }
        if (type === '[object Array]' || type === '[object Object]') {
            for (const key in data) {
                res[key] = cloneDeep(data[key], map)
            }
            return res
        }
    }
}
```


5. 发布订阅
发布者 订阅者 事件管理中心
事件管理中心提供发布功能给发布者用，提供订阅和取消订阅功能给订阅者用
```js
class EventBus {
    constructor() {
        this.list = {}
    }

    add(name, id, fn) {
        if (!this.list[name]) {
            this.list[name] = []
        }
        this.list[name].push({
            id,
            fn
        })
    }

    emit(name, id, params) {
        if (this.list[name]) {
            if (id) {
                this.list[name].forEach(item => {
                    if (item.id === id) {
                        item.fn(params)
                    }
                })
            } else {
                this.list[name].forEach(item => {
                    item.fn(params)
                })
            }
        }
    }

    off(name, id) {
        if (this.list[name]) {
            if (id) {
                this.list[name].forEach((item, index) => {
                    if (item.id === id) {
                        this.list[name].splice(index, 1)
                    }
                })
            } else {
                delete this.list[name]
            }
        }
    }
}
```

6. 观察者模式
只有观察者和被观察者
```js
class Observer {
    constructor() {

    }

    update() {

    }
}
class Subject {
    constructor() {
        this.list = []
    }

    add(ob) {
        this.list.push(ob)
    }

    notify() {
        this.list.foreach(item => {
            item.update()
        })
    }
}
```

7. 数组转对象
```js
function listToMap(list) {
    let res
    const map = {}
    for (const item of list) {
        const { id, pid } = item
        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            children: map[id].children,
            ...item
        }
        const newItem = map[id]
        if (pid === 0) {
            res = newItem
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
```

8. jsonp
```js
function jsonp(url, data, callback='callback') {
    const urlStr = url.includes('?') ? '&' : '?'
    for (consy key in data) {
        urlStr += `${key}=${data[key]}&`
    }
    urlStr += `callbacl=${callback}`

    const script = document.createElement('script')
    script = url + urlStr
    document.body.append(script)

    return new Promise((resolve, reject) => {
        window[callback] = res => {
            try {
                resolve(res)
            } catch(err) {
                reject(err)
            }
        }
    })
}
```

9. 快排
```js
function quickSort(arr, begin, end) {
    if (begin < end) {
        const p = arr[begin]
        let i = begin, j = end
        while (i < j) {
            // 从后往前找比哨兵值小的 交换到 i 的位置
            while (i < j && arr[j] > p) j--
            arr[i] = arr[j]
            // 从前往后找比哨兵值大的 交换到 j 的位置
            while (i < j && arr[i] <= p) i++
            arr[j] = arr[i]
        }
        // 把 哨兵值 方法放到此时 i 的位置上，此时 i 左边的就是比哨兵值小的 右边就是比哨兵值大的
        arr[i] = p
        quickSort(arr, begin, i - 1)
        quickSort(arr, i + 1, end)
    } else {
        return 
    }
}
```

10. promise
```js
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

    onFullfilledCallbacks = []

    onRejectedCallbacks = []

    resolve(value) {
        if (this.status === 'pending') {
            this.status = 'fullfiled'
            this.value = value
            while (this.onFullfilledCallbacks.length) {
                this.onFullfilledCallbacks.length.shift()(value)
            }
        }
    }

    reject(reason) {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.reason = resaon
            while (this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.length.shift()(reason)
            }
        }
    }

    then(resolve, reject) {
        const realOnResolve = typeof resolve === 'function' ? resolve : value => value
        const realOnReject = typeof reject === 'function' ? reject : {throw(reason)}

        const newPromise = new IPromise((resolve, reject) => {
            const onFullfillMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnResolve(this.value)
                        this.reolvePromise(newPromise, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }
            const onRejectMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnReject(this.reason)
                        this.resolvePromise(newPromise, x, resolve, reject)
                    } catch(err) {
                        reject(err)
                    }
                })
            }

            if (this.status === 'fullfiled') {
                onFullFillMicrotask(resolve, reject)
            } else if (this.status === 'rejected') {
                onRejectMicrotask(resolve, reject)
            } else if (this.status === 'pending') {
                this.onFullfilledCallbacks.push(onFullFillMicrotask)
                this.onRejectedCallbacks.push(onRejectMicrotask)
            }
        })
        return newPromise
    }

    resolvepromise(promise, x, resolve, reject) {
        if (promise === x) {
            return new TypeError('error')
        }
        if (x instanceof IPromise) {
            x.then(resolve, reject)
        } else {
            resolve(x)
        }
    }

    static resolve(params) {
        if (params instanceof IPromise) {
            return params
        } else {
            return new IPromise(resolve => {
                resolve(params)
            })
        }
    }

    static reject(params) {
        if (params instanceof IPromise) {
            return params
        } else {
            return new IPromise((resolve, reject) => {
                reject(params)
            })
        }
    }

    all(promiseList) {
        return new Promise((resolve, reject) => {
            if (this.promiseList.length === 0) {
                return resolve([])
            }
            const res = []
            let count
            promiseList.forEach((item, index) => {
                IPromise.resolve(item).then(res => {
                    res[index] = res
                    count++
                    if (count === promiseList.length) {
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                }) 
            })
        })
    }

    race(promiseList) {
        return new Promise((resolve, reject) => {
            if (!promiseList.length) resolve()
            promiseList.forEach(item => promise.resolve(item).then(resolve).catch(reject))
        })
    }

    allSettled(promiseList) {
        return new Promise((resolve, reject) => {
            if (!promiseList.length) {
                resolve([])
            }
            let count = 0
            const res = []
            promiseList.forEach((item, index) => {
                promise.resolve(item).then(res => {
                    res[index] = {
                        status = 'fullfilled',
                        value = res
                    }
                    count++
                    if (count === promiseList.length) {
                        resolve(res)
                    }
                }).catch(err => {
                    res[index] = {
                        status = 'rejeced'
                        reason = err
                    }
                    count++
                    if (count === promiselist.length) {
                        resolve(res)
                    }
                }) 
            })
        })
    }

    //返回第一个成功的 如果没有成功的 就返回所有失败的
    any(promiseList) {
        return new Promise((resolve, reject) => {
            if (!promiseList.length) {
                reject(new Error('error'))
            }
            const errList = []
            promiseList.forEach((item, index) => {
                promise.resolve(item).then(res => {
                    return resolve(res)
                }).ctach(err => {
                    errList.push(err)
                    if (errList.length === promiselist.length) {
                        reject(errList)
                    }
                })
            })
        })
    }
}
```

11. 并发控制
```js
// 为了演示方便，我们在此用fetchImage函数来模拟异步请求图片，返回成功提示
function fetchImage(url) {
  // 模拟请求的响应时间在0 - 1s之间随机
  const timeCost = Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, timeCost, "get: " + url));
}

// 待请求的图片
const imageUrls = [
  "pic_1.png",
  "pic_2.png",
  "pic_3.png",
  "pic_4.png",
  "pic_5.png",
  "pic_6.png",
];

function limitFetch(urls, max) {
    const list = [...urls]
    const res = new Map()

    function run() {
        if (list.length) {
            const url = list.shift()
            return fetchImage(url).then(response => {
                res.set(url, response)
                return run()
            })
        }
    }

    const promiseList = Array(Math.min(list.length, max))
        .fill(Promise.resolve())
        .map(item => item.then(run))
    return Promise.all(promiseList).then(() => {
        return urls.map(url => res.get(url))
    })
}

limitFetch(imageUrls, 3).then(res => {
    console.log(res)
})
```

12. 图片懒加载
图片要露出来了就去加载它，判断它到文档顶部的距离offsetTop 小于 视口区域的高度innerHeight + 滚动的距离 scrollTop

- Vue2
1. key 的作用
v-for在二次渲染列表时，如果没有 key，vue 会默认使用就地复用的策略，如果顺序发生改变，vue无法准确的知道到底是哪个元素的位置变了，所以不会去移动元素的位置，而是简单的复用每个元素，确保他们在每个索引位置上正确渲染。如果使用了 key，就是给元素增加了一个唯一标识，vue 就可以基于 key 做对比，准确的知道是哪个元素的位置变了或者是被删了，然后是应该移动或者是删除

2. 组件通信
*** 父子组件通信 ***
父向子，props
子向父，emit
v-model 实现父子组件的双向绑定，props 接收的是 value， emit 触发的是 input 事件
$parent 获取父组件实例，$refs.child. 获取子组件的实例
*** 爷孙组件 ***
$attrs 一次性向下传递属性
$listeners 一次性向下传递监听的事件
provide 向下传递，inject 接收
*** 兄弟组件 ***
额外定义一个 vue 实例进行中转，需要通信的两个组件都进行引入，然后一个用 on 监听事件，一个用 emit 触发事件
用 vuex

3. 生命周期
beforeCreate 实例创建之前
created：实例创建之后，可以获取到data里面的数据
beforeMount：实例挂载之前
mounted：实例挂载之后，可以操作dom
beforeUpdate：数据改变，视图更新之前
updated： 数据改变，视图更新之后
beforeDestroy：实例销毁之前
destoryed： 实例销毁之后

4. 在created 和 mounted 中请求数据有什么区别
created 阶段还没有生成dom，如果此时请求数据的时间过长，会使页面长时间处于白屏状态

5. watch 和 computed 
watch 是一个数据影响多个数据，当数据发生改变时有开销较大的操作时进行使用，
computed 是一个数据受多个数据影响，是基于数据的响应式进行计算，只有当依赖的数据发生改变时，才会重新进行计算

6. vue2 是如何重写数组方法的
首先将Array.prototype 作为 Object.create 的参数创建出一个新的对象，重写的实际上是这个新对象里的方法，重写之前首先调用了原来的方法拿到正确的值，然后使用Object.defineProperties 重写方法，判断如果是使用的push，unshift，splice，因为这几个方法会增加新的元素，对新元素进行响应式依赖的收集，然后发布数据变更的通知。
在刚开始对数据进行响应式依赖收集的时候，就把数组类型的数据的__proto__ 指向重写之后的新方法

7. nexttick
首先明确一下 vue 更新dom的流程，当数据改变之后，并不会同步的去执行更新dom的操作，所以在更改了数据之后，同步的去获取dom，会发现还是没有修改的，vue 利用事件循环的机制将更新dom的操作放在了当前轮的微任务里或者下一轮的宏任务里，数据改变之后，将watcher都收集起来，然后调用nexttick 方法，这是vue本身就实现的一个方法，方法里面会判断浏览器的兼容性，支持promise 就用promise.then，将watcher都扔进去，在then方法里面挨个调用watcher的update方法，如果不支持就再判断ObserverMutation，这个是监听dom变化的，也是微任务，再就是判断setImidiate，setTimeout，我们自己调用nexttick方法传进来的回调一定会排在那些watcher之后，所以当执行我们的回调的时候dom已经更新完了，就可以拿到最新的dom了

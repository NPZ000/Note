**本文尽我所能，详细讲述了从输入 URL 到页面展示的整个过程**

*废话不多说直接开始*
## 1. 准备 URL 
    
   当用户在地址栏中输入 URL 之后，地址栏会根据规则，把输入的 URL 合成为完整的 URL，比如，如果输入的是 www.baidu.com, 那么就会在前面拼接 https://

## 2. 存在旧页面的情况
完整的 URL 准备好之后，意味着就要马上导航到的新页面了，此时浏览器还会给旧页面一个执行 beforeunload 事件的机会，在这个阶段可以清除数据，释放内存，或者询问用户是否真的要离开，可以在这里取消导航，浏览器就不会进行后续的操作了。
## 3. 建立连接
   浏览器进程拿到 URL 之后，通过进程间通信(IPC)把 URL 交给网络进程，然后由网络进程发起请求  
### 1. 检查缓存
   缓存分为强缓存和协商缓存，首先会去检查强缓存，没有命中的话再去检查协商缓存，如果没有命中强缓存，就要向浏览器发起请求了，接着下一步的 DNS 解析。
   
   强缓存：
        
-  Expires：http1.0 的设置，为服务端返回的数据到期时间，如果当前请求的时间小于这个值，就判断没有过期，但是服务器的时间和客户端的时间不一定一致，所以这个不太靠谱
-  Cache-Control：http1.1的设置，如果设置的值是 no-cache，那么就直接去检查协商缓存，如果设置的是 max-age，则表示数据将在这个时间之后失效

  协商缓存：
   
  - Last-Modified：数据最后一次修改的时间，服务端会在响应头中返回这个值给客户端
  - If-Modified-Since：就是服务端返回给客户端的Last-Modified 的值，客户端再次请求时会发送给服务端
  - E-tag：资源的唯一标识，资源发生改变，这个值就会重新生成
  - If-None-Match：E-tag的值，客户端再次请求的时候携带，服务端接收到之后会进行对比，如果没变就返回304，反之返回 200 和新的数据
  
  缓存过程：
  
   1. 第一次请求时，把返回的数据，返回的时间一并缓存，再次请求时，如果 Cache-Control 设置了max-age，那么就对比当前时间和上一次返回 200 时的时间差，是否超过了 max-age 的值，如果没有超过则命中强缓存（http1.0 检查Expires)；
   
   2. 如果没有命中强缓存，接着检查协商缓存，这时客户端就要发请求了，请求头中会携带 If-None-Match 和 If-Modified-Since,服务器首先会根据 E-tag 的值判断资源是否被修改，如果一致则命中协商缓存，返回 304
   3. 如果请求头中没有 If-None-Match,那么就检查 If-Modified-Since 的值，与资源最后修改的时间做比较，如果一致则命中协商缓存，返回 304
       
>     不同的刷新: 
>      1. 直接在地址栏中输入 URL，会默认去检查强缓存和协商缓存
>      2. f5 刷新，会跳过强缓存，检查协商缓存
>      3. ctrl-f5，会删除之前缓存的数据，重新请求
### 2. DNS 解析
    
   DNS 解析就是把域名替换成 IP 地址的过程，首先会去查看之前是否有缓存，浏览器缓存 -> 本机系统的缓存 -> 路由器缓存 -> 本地域名服务器缓存，如果没有查询到，本地域名服务器会向根域名服务器发起请求，然后根域名服务器会返回他一个顶级域名服务器的地址，然后本地域名服务器去请求顶级域名服务器，同样的，顶级域名服务器会给他返回下一级域名服务器的地址，重复这个动作，直至找到正确的 IP 地址
    （要请求，光有 IP 地址还不够，还得有端口号，比如 HTTP 默认是80）
### 3. 等待 TCP 队列（扩展）
   拿到 IP 地址之后是否可以马上进行 TCP 连接，不一定。浏览器限制同一个域名最多只能开 6 个 TCP 连接，如果此时已经有 6 个正在发送的请求，那么之后的请求就会暂时进入等待的状态。这里还涉及到一个 TCP 连接复用的问题，我们都知道现在可以设置长连接了，也就是一次 TCP 连接，请求完成之后不会立马断开，可以让之后的请求复用这个连接
   
       HTTP2采用了多路复用的技术，不存在限制连接个数的问题了
### 4. TCP 连接
#### 三次握手：
   - 第一次：客户端会向服务端发送一个 SYN 报文，并指定一个序列号（动态生成的）
   - 第二次： 服务端收到之后，会回复客户端一个自己的 SYN 报文，也指定一个序列号，还有一个 ACK 报文，ACK 报文的值为客户端的那个序列号值加一
   - 第三次： 客户端收到之后，会再回复服务端一个 ACK 报文，ACK 报文的值为服务器的那个序列号值加一
   - 最后服务端收到客户端的 ACK 报文之后，就可以建立连接了
> 为什么是三次，两次不行吗？
>1. 第一次握手：客户端发，服务端接，服务端可以判定客户端的发送能力和自己的接收能力是正常的
> 2. 第二次握手：服务端发，客户端接，客户端可以知道服务端的发送能力和接收能力是正常的，也知道自己的发送能力和接收能力是正常的，注意，此时服务端还不知道客户端的接收能力是正常的
> 3. 最后一次客户端回复服务端，现在服务端才知道客户端的接收能力是正常的

#### 四次挥手：
   假设是客户端先发起关闭的请求
-   第一次：客户端给服务端发送一个 FIN 报文，报文中指定一个序列号的值，停止发送数据，进入 FIN_WAIT1 状态，等待服务端的确认
-   第二次：服务端接收到 FIN 报文后，把其中的序列号值加一，作为 ACK 报文的值，然后发给客户端，此时服务端处于 CLOSE_WAIT1 状态
-   第三次：如果服务端也想断开了，就给客户端发送一个 FIN 报文，同样指定一个序列号值，此时服务端处于 LAST_ACK 状态
-   第四次：客户端收到 FIN 之后，同样把其中的序列号值加一，作为 ACK 报文的值，发回给服务端，此时客户端处于 TIME_WAIT 状态，需要等一会确保服务端接收到自己的 ACK 报文了再进入 CLOSED 状态，如果这个 ACK 报文丢了，服务端没收到，那么服务端会再次向客户端发送一个 FIN 报文，等待客户端回复 ACK，服务端收到 ACK 之后，就会关闭连接，进入 CLOSED 状态
## 5. HTTP 请求
   TCP 连接成功之后，就要发送 HTTP 请求了， 构建请求行，请求头，请求体，向请求头中添加 cookie 等信息
   
  
## 6. 服务端处理请求并返回数据
  
- 重定向：
    如果返回的状态码是 301 或者 302，就会去读取 location 参数的地址，
    重新对这个地址发起新的请求，比如有的网站会设置把 http 的请求都定向到 https
- 响应数据的处理：
   如果响应头中的 Content-type 的值是 text/html，那么浏览器就知道返回的数据是 HTML 格式的，如果是字节流类型的（application/octet-stream），那么浏览器就会去下载这个资源
## 7. 准备渲染进程
   默认情况下浏览器会为每一个 tab 标签页开一个渲染进程，如果是同站点（根域名和协议相同）下又新开的页面，那么就会复用父页面的渲染进程
## 8. 提交文档
   浏览器进程让网络进程把接收到的数据交给渲染进程
1. 网络进程接收到数据之后会通知浏览器进程，然后浏览器进程会向渲染进程发送一个提交文档的消息
2. 渲染进程接收到浏览器进程的消息之后，会和网络进程建立传输数据的通道
3. 数据传输完成之后，渲染进程会返回确认提交的消息给浏览器进程
4. 浏览器进程收到确认的信息之后，会更新界面的状态（前进后退等）
## 9. 渲染阶段
   渲染进程拿到数据之后开始渲染页面
   
**1. 构建 DOM 树：将 HTML 转换为浏览器可以理解的树结构**

> DOM 树是如何生成的呢
 渲染引擎里有一个 HTML 解析器负责转换 HTML 为 DOM 树，上面我们讲到网络进程接收到数据之后会交给渲染进程，渲染进程接收网络进程的 html 数据然后进行解析，注意它是边接收边解析的，解析流程如下：
  - 分词器将字节流转换成 Token，Token 分为 Tag Token 和文本 Token，Tag Token又分为startTag Token 和 endTag Token，其实就是开始标签和结束标签
  - 之后将 Token 解析为 DOM 节点并添加到 DOM 树中。HTML 解析器维护了一个 Token 栈结构，是用来计算节点之间的父子关系的，第一个阶段生成的 Token 会被压入到这个栈中，具体的规则如下：
      1. 如果是一个 startTag Token，会入栈并生成一个 DOM 节点加入到 DOM 树中
      2. 如果是文本 Token，就会生成一个文本节点，直接加入到 DOM 树中，他的父节点就是栈中顶部 Token 对应的节点
      3. 如果是 endTag Token，就会查看栈中是否有对应的 startTag Token，有的话就弹出
  当遇到了 JS 代码会怎么样呢
  
  如果遇到了内嵌 js 代码，因为 js 代码中可能会对之前生成好的 dom 进行修改，所以这时候需要暂停dom 的解析，然后去执行 js 代码，如果是引入的 js 文件，就需要等待 js 文件加载完成并且执行完之后再接着去解析，如果我们事先知道引入的这个 js 文件里面没有操作 dom，就可以设置让他异步加载，不要阻塞 dom 的解析，如果 js 代码中修改了 css 呢，那么就需要等之前的 css 文件下载解析完，再接着执行 js。综上所述，这就是我们为什么要把 css 文件在最上面引入，js 文件在最下面引入的原因。
    
**2. 样式计算**

   1. 计算每个节点的样式，将 CSS 转换为 stylesheet
   2. 转换样式表中的属性值，使其标准化，比如将 red 转为 rgba 格式
   3. 计算每个节点的具体样式，涉及到继承规则和层叠规则
       - 继承规则：子节点会继承父节点的一些可继承的样式，比如 font-size，color 等         
       - 层叠规则：就是权重计算的那套规则
          
**3. 布局阶段：计算 DOM 树中可见元素的几何位置**

**4. 创建布局树**

在原来的 DOM 树的基础上，再额外构建一颗只包含可见元素的布局树，忽略掉比如 header 之类的元素还有设置了 display: none 属性的元素；计算每个元素的具体位置，保存在布局树中

**5. 分层**

因为页面中经常会有很多复杂的情况，比如页面滚动，设置了z-inidex等，渲染引擎会为这些特殊的节点生成图层，并不是每一个节点都会有对应的图层，如果没有就从属于父节点的图层
   > 什么情况下会为节点生成新的图层呢？
   > 1. 拥有层叠上下文属性的元素，比如设置了z-index/opacity/css滤镜等属性的元素
   > 2. 需要裁剪的情况，比如 div 里的内容溢出了
    
**6. 图层绘制**

把一个图层的绘制拆分成很多小的绘制指令，然后按顺序组成一个待绘制的列表

**7. 栅格化**

图层绘制以及之前的操作都是渲染进程的主线程完成的，当图层的绘制列表准备好之后，主线程就会把绘制列表交给合成线程。

通常一个页面很大，但是用户只能看到可视区域的那一部分，所以没必要绘制出所有的图层，所以合成线程会把图层划分为图块，然后合成线程会优先把视口附近的图块生成位图，将图块转为位图的操作就是栅格化。

我们经常会使用 GPU 来加速生成，如果使用 GPU，那么生成位图的操作就是在 GPU 进程内完成的。
        
**8. 合成和显示**

栅格化完成之后，合成线程会通知到浏览器进程，然后浏览器进程将其内容绘制到内存中，最后显示到屏幕上

到这整个流程就结束了，其实最后应该是断开连接，我把那段四次挥手写在上面和三次握手一起了。

我试了一下，我这个流程完整的说完大概需要将近 25 分钟，如果面试被问到了这个问题，面试官会不会嫌我说的太多了（doge）

声明：文中有部分内容借鉴了李兵老师的 *浏览器工作原理与实践* 课程中的部分知识点

*最后，欢迎大佬们的意见和建议，抬杠的我也接受。*
## webpack 的打包流程
1. 从配置文件和shell 命令中得到配置参数
2. 根据配置参数初始化 compile 对象，加载所有配置的插件，开始编译
3. 从入口文件开始，调用所有loader 对文件进行编译，再找出文件依赖的文件，重复这个动作，得到所有编译后的文件和他们的依赖关系
4. 根据依赖关系将所有文件打包成一个个 chuck，接着就加到输出列表中
5. 根据配置中的output 确定输出的位置和文件名，最后将要输出的内容写入进去

## rollup 的编译
rollup 基于浏览器原生支持的 esm ，不同于 webpack 不需要提前进行打包，而是先把开发服务器启动起来，然后加载入口文件，遇到 type 为 module 的 script 标签，再去加载模块，实现了按需加载，利用 http 缓存对依赖模块进行强缓存，进一步加快页面的加载速度

#### webpack 热更新原理
1. webpack在编译的时候，为需要的entry注入热更新的代码（eventSource通信）
2. 页面首次打开之后，服务端与客户端通过eventSource建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到hash之后，这个hash将作为下一次请求服务器 hot-update.js 和 hot-update.json 的 hash 
4. 修改页面代码后，webpack 监听到文件修改，开始编译，编译完成之后，发送build消息给客户端
5. 客户端获取到 hash 后构造hot-update.js script链接，然后插入主文档
6. hot-update.js 插入成功之后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 vue 组件的 render 方法，重新render组件，从而实现热更新

### tree shaking
因为 esm 的导入都是静态的，所有的export 和import 都是在顶级声明的，且不允许写在比如 if 语句里面，所以依赖关系在编译阶段就可以确定了，从而可以判断出哪些export 出来的模块并没有 import ，然后被 import 的模块，再通过分析 AST 语法树，判断是否被用到了


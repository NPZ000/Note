# 文件指纹
app.as123.js
- 用处：
1. 版本管理：区分修改过的文件和没有修改过的文件
2. 使用缓存，未修改的文件，文件指纹不变，浏览器继续使用缓存
- 常见的文件指纹
hash
整个项目的指纹
chunkhash 
模块指纹，每一个 entry 作为一个模块，不同的模块互相不影响
contenthash
文件指纹，依赖于文件内容的变化
- 使用
使用占位符
js 文件一般使用 chunkhash '[name][chunkhash:8].js'
css 文件或者图片等静态资源文件使用 contenthash，[name][contenthash:8]

# 如何打包一个 js 库
1. 需要打包出两个文件，一个压缩版给生产环境用，一个未压缩版给开发环境用（方便调试
2. 因为要打出两个文件，所以 entry 里要设置两个 chunk，一个是压缩版，一个是未压缩版
3. output 要设置 library 相关参数
 - library: 导出的变量的名字
 - libraryTarget：引入方式，一般设置为 umd，表示可以用任何方式引入
 - libraryExport：默认导出  default，如果不设置为export，调用的时候还需要导出一下default
4. 设置 mode 为 none，如果设置的是production，会默认对打包出来的文件都进行压缩
5. 设置 optimization 进行自定义压缩
    设置 minimize: true,表明要进行自定义压缩
    设置 minimizer,通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer),传入 include 参数，限制打出一个压缩版

# 如何使用 ssr 渲染组件
1. 单独设置一个对应的 webpack 设置文件，webpack.ssr.js，在配置文件中需要设置两个必须的参数
    - target: 'node', // 保证打包出的文件在 node 端是可运行的
    - externals: nodeExternals() // 忽略掉node 自身的模块，不将其打包到 bundle
2. 在对应的模块中要有对应的入口文件，并且将组件用 module.exports 抛出
3. 在对应模块的 html 文件中，要设置对应的占位符，用注释的形式，用来之后放打包后的组件
4. 在服务端的 server.js 文件中，读取打包出来的组件文件，用 react/dome-server 的renderToString 方法将其转成字符串，再读取打包出来的 html 模板文件，将之前设置好的占位符，替换为已经转成字符串的组件

# stats
设置构建时要输出的命令信息

# 构建速度优化
- 速度分析
使用speed-measure-webpack-plugin
- 优化方法
1. 开启多进程/多实例构建：thread-loader
2. 分包：使用 dll 预编译（过时）
3. 开启缓存：babel-loader的缓存，代码压缩的缓存
4. 缩小构建目标：
    resolve：
        alias 字段，告诉webpack 需要查找文件的具体位置。
        extensions：告诉 webpack 没有写后缀的文件的类型。
        mainFileds： 告诉 webpack 要引入包的入口文件
        modules： 要解析模块时应该搜索的目录

# 构建体积的优化
- 分析
使用 插件分析
- 优化方法
1. 压缩代码
2. tree shaking
3. 压缩图片等静态资源文件
4. 使用动态 polyfill 服务



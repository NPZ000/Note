## path
1. path.resolve 将路径或路径的片段解析为绝对路径，从右向左解析，直至解析出绝对路径，如果最后还没有解析出绝对路径，就在最前面加上当前目录
```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
2. path.dirname 传入一个 path ，返回 path 的目录名
```js
path.dirname(__filename)
// 返回当前目录 /Users/niupengzhen/Desktop/Note
```
3. path.join() 知识单纯的拼接
```js
path.join('/a', '/b')
// /a/b
```

## fs 文件读取

## url 
1. url.parse 将一个 url 字符串解析为一个 url 对象
2. url.format 将传入的 URL 对象变成一个 url 字符串

## express / koa
1. app.use & app.all
```js
app.use('/home', async (req, res, next) => {
    console.log('app use')
    await next()
})
app.all('/home/index', async (req, res) => {
    res.send('hello world')
})
```
如果请求地址是 /home/index ，那么两个都会走进去，如果是 /home 那么只会走进去第一个，因为 use 是用来调用中间件的，只需要匹配路由的前缀，而app.all 是指代所有的请求方式，包括 post 和 get，他是完整匹配的

## npm 安装机制
1. 首先看 node_modules 是否已经安装过此模块，
2. 如果存在，不再重新安装
3. 如果不存在
4. 向 registry 查询模块安装包的地址
5. 下载压缩包，存放在.npm 下
6. 解压安装包，存放在 node_modules里

npm run build
找到package.json 中 script 中的build 命令，webpack --config webpack.prod.js，然后查找 webpack 命令，去node_module下的.bin目录下，查找webpack 文件，这里和webpack包建立了一个软连接，其实执行的/node_modules/webpack/bin/webpack.js文件，其中判断了是否安装了webpack-cli，然后执行 runCli 方法，执行的是webpack-cli/bin/cli.js, 
然后到 node_modules/webpack-cli/lib/bootstrap.js 文件下，执行 new webpaclCli，然后执行它的 run 方法
node_modules/webpack-cli/lib/webpack-cli.js， webpackCLI 这个类引入了一个 program ，在 run 方法中执行了这个 program 的一些方法，主要是 action 方法，这个传进去一个函数，在 action 方法中，生命了一个 listener，挂在了 program 上的 _actionHandle 上, 再回到 run 方法，再接着往下，执行了 program 的 parseAsync 方法，传进去了args，这个 args 就是
[
  '/usr/local/bin/node',
  '/Users/niupengzhen/repo/my-project/node_modules/.bin/webpack',
  '--config',
  'webpack.prod.js'
]
传进去的另一个参数是空的，然后 program 的 parseAsync 方法执行了 parse 方法，
这个方法前面，会把我们执行之后传进去的connfig以及他的值截取出来，然后执行  _parseCommand 方法，进来之后会解析一波参数，然后中间一堆判断逻辑，不看，到 if (this._actionHandler) ，刚才给这个玩意赋值了一个函数，所以会走进来这个if，然后 this._actionHandler(args);，再回到刚才那个 action 方法，看这个 listener 方法，const actionResult = fn.apply(this, actionArgs);执行了传进来的的 fn，不过这个fn 是个异步的，然后把 actionResult push 到了 _actionResults 里面，再回到 parseAsync 方法，会看到把 _actionResults 放进了Promise.all 里面，
再说刚才 _actionResults 里面放进去的那个 fn ，他此时正在执行，这个 fn 就是刚才在 run 方法中，还是解析参数，还是得到传进来的 config，然后取出一个默认的操作 build，执行  loadCommandByName 方法，执行 makeCommond，构造命令，根据传进来的commondOption 构造一个 commond，然后执行传进来的第二个参数，option 是个函数，在这个函数加载了webpack，然后返回 build 命令的 option，然后传进来的 第三个参数action 也是个函数，传给commond.action，还是刚才同样的逻辑，声明了一个 listener 赋值给 _actionHandler，到这 loadCommandByName 方法就算执行完了，再往下又去执行了 program.parseAsync 方法，把buid 命令和config参数以及值传进去，进到 parseAsync 方法，又去执行了 parse 方法，然后还是和刚才进去之后逻辑差不多，最后会执行 _actionHandler 方法，接着就会执行，刚才传给 action 那个函数，也就是 
async (entries, options) => {
                        if (entries.length > 0) {
                            options.entry = [...entries, ...(options.entry || [])];
                        }
                        await this.runWebpack(options, isWatchCommandUsed);
                    });
执行 runWebpack 方法，然后执行 createCompiler 方法，createCompiler 方法中 根据config参数的值，找到我们定义的config文件，把内容都取出来，再build一下，往里面塞一些内置的参数，接着执行了 webpack 方法，webpack 方法就是加载进来的 webpack，接着就跳转到 webpack 目录下，找到入口文件，看 package.json 文件的 main 字段，是 lib/index, 看到
get webpack() {
		return require("./webpack");
	},
再找到 webpack 文件，找到 webpack 方法，执行 create 方法， create 方法中执行 createCompiler，createCompiler 方法中调用了方法，又往 option 中设置了一些默认参数和一些参数的默认值，然后把 option 传给  compiler 类，Compiler 这个类声明很多的 hooks，new 完之后就调用了一些 hooks，
还调用了传进来的所有plugin
if (Array.isArray(options.plugins)) {
        // debugger
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
然后看这个 new WebpackOptionsApply().process(options, compiler);
这个 process 方法中调用了很多内置的plugin，有一个 EntryOptionPlugin ，看下这个plugin 干了什么
监听了一个 entryOption 的hook，再回到刚才那，可以看到立即就触发了这个hook，然后会去调用 EntryOptionPlugin.applyEntryOption，这个方法中遍历了传进来的 entry，给每一个 entry 都调用了一个 EntryPlugin 插件
然后返回了 compiler 实例，
再回到 webpack 方法，往下执行，调用 compiler 的 run 方法，
在 run 方法中，触发了 beforeRun 这个 hook，接着触发了 run 的 hook，接着执行 readRecords 方法，传进去了 compile 方法，在 readRecords 方法中执行了 compile 方法，
在 compile 方法中，相继触发了 beforeCompile，compile 的hook，然后触发了 make 的hook，然后找到 EntryPlugin 注册了这个 hook，然后会执行 compilation的addRntry方法，如果有多个 entry，就会执行多次这个方法
执行 _addEntryItem 方法
 执行 addModuleTree 方法，
    handleModuleCreation 方法
        factorizeModule 
            this.factorizeQueue.add
                // node_modules/webpack/lib/util/AsyncQueue.js add 方法，触发beforeAdd的hook，执行它的callback，
                    去 _entries 里面找，没找到，就把它放进 _entries 里面去
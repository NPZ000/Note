// koa 的洋葱模型 每次执行会先按照调用中间件的顺序正着执行 中间件函数中 next 之前的代码
// 到最后执行完要退出的时候 会倒着执行中间件函数中 next 之后的代码
const middleware = []
const m1 = async (ctx, next) => {
    console.log('m1 next before')
    await next()
    console.log('m1 next after')
}
const m2 = async (ctx, next) => {
    console.log('m2 next before')
    await next()
    console.log('m2 next after')
}
const m3 = async (ctx) => {
    console.log('last m')
}

const use = (m) => {
    middleware.push(m)
}

use(m1)
use(m2)
use(m3)

const conponse = middleware => {
    return function(ctx) {
        return dispatch(0)
        function dispatch(i) {
            const fn = middleware[i]
            if (!fn) return 
            // dispatch.bind(null, i + 1) 即为下一个中间件 也就是 next 参数
            // 这里使用 bind 是因为这里要传的是一个函数，并不是一个函数的执行，使用 bind 可以不执行函数，又可以提前传递参数进去
            return fn(ctx, dispatch.bind(null, i + 1))
        }
    }
}
conponse(middleware)()
// m1 next before
// m2 next before
// last m
// m2 next after
// m1 next after


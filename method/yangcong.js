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
    return function(ctx, next) {
        return dispatch(0)
        function dispatch(i) {
            const fn = middleware[i]
            if (!fn) return 
            return fn(ctx, dispatch.bind(null, i + 1))
        }
    }
}
conponse(middleware)()
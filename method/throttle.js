// 节流
// 在规定时间内 函数只会执行一次，就算被多次触发也只会执行一次
// 应用场景：监听 dom 元素拖拽，滚动条的拉动
function throttle(fn, delay) {
    let pre = Date.now()
    return function() {
        const now = Date.now()
        const context = this
        const args = arguments
        if (now - pre >= delay) {
            fn.apply(context, args)
            pre = now
        }
    }
}

function foo(fn, delay) {
    let pre = Date.now()
    return function(...args) {
        const now = Date.now()
        if (now - pre >= delay) {
            fn.apply(this, args)
            pre = now
        }
    }
}
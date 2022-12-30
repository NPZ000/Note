// 防抖
// 在事件触发 n 秒后再执行，如果再这 n 秒内再次触发，则刷新定时器，重新计时
// 应用场景 输入框的联想功能
function debounce(fn, delay) {
    let timer = null
    return function() {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}
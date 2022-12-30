// https://leetcode.cn/problems/exclusive-time-of-functions/

/**
 * 利用栈解
 * 遇到 start 就入栈 遇到 end 就出栈，保存的是函数的id 和 执行时间
 * 需要注意的是被中断的函数的执行时间
 * 如果第一个 start 了然后还没 end 又进来一个 start
 * 此时就需要先计算一下第一个函数的执行时间，用当前这个函数的开始时间减去上一个函数也就是栈顶函数的开始时间，就是上一个函数已经执行的时间
 * 这个时间需要累加到保存结果的数组中 因为是累加 所以要用 +=
 * 如果当前函数 end 了，就把栈顶函数出栈，这个栈顶函数一定是 end 的这个函数
 * 如果此时栈中还有函数，就需要把栈顶函数的开始时间改成，当前函数的结束时间 + 1，为什么要 + 1呢，如果当前函数是在时间点 3 结束的，假设之后栈顶函数恢复执行了，那么重新开始执行的时间肯定是 4
 * 最后计算当前函数的时间，用 end 的日志的时间减去 start 日志的时间 + 1，3 开始 5 结束，是执行了 3 个时间
 */
 var exclusiveTime = function(n, logs) {
    const res = Array(n).fill(0)
    const stack = []
    for (const log of logs) {
        const cur = log.split(':')
        const id = +cur[0]
        const type = cur[1]
        const timeTemp = +cur[2]
        if (type === 'start') {
            if (stack.length) {
                // 更新栈顶函数的执行时间
                res[stack[stack.length - 1][0]] += timeTemp - +stack[stack.length - 1][1]
            }
            // 入栈
            stack.push([id, timeTemp])
        } else {
            // 出栈
            const start = stack.pop()
            if (stack.length) {
                // 更新栈顶函数的开始执行时间
                stack[stack.length - 1][1] = timeTemp + 1
            } 
            // 计算当前函数的执行时间
            res[cur[0]] += timeTemp - start[1] + 1
        }
        
    }
    return res
};
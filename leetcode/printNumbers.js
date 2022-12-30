// 输入数字 n，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。
/**
 * 解法 1
 * 直接遍历 1 到 10^n - 1
 * 但是这种情况没有考虑大数越界的情况
 */
function print1(n) {
    const res = []
    const end = Math.pow(10, n) - 1
    for (let i = 1; i <= end; i++) {
        res.push(i)
    }
    return res
}
/**
 * 解法 2
 * 递归 + 回溯
 * 从左往右将每一位按字符串固定 递归固定下一位 递归边界条件是固定到了最后一位 并且把固定好的转成数字添加到结果中
 */
function print2(n) {
    const res = []
    let cur = ''
    // 生成长度为 len 的数字 正在确定第 x 位
    const dfs = (x, len) => {
        if (x === len) {
            res.push(+cur)
            return
        }
        // 如果当前是要固定第一位 就直接从 1 开始
        let start = x === 0 ? 1 : 0
        for (let i = start; i < 10; i++) {
            cur += String(i) // 固定本位数字
            dfs(x + 1, len) // 递归去固定下一位数字
            cur = cur.slice(0, -1) // 删除本位数字 这是个全局变量 下一轮循环别人还要用呢
        }
    }

    // 生成长度 1 ～ n 位的数字 这里是把 n 给分解了 从 1 位开始直至到 n 位
    // 假设 n = 3  从 1 开始 先生成 1 位的数字， 1 2 3...; 再生成 2 位的数字 10 11 12...; 最后是 3 位的数字 100 101 102
    for (let i = 1; i <= n; i++) {
        dfs(0, i)
    }
    return res
}
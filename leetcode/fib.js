/**
 * 
 * @param {第 n 项} n 
 * @returns 第 n 项的值
 * 0 1 1 2 3 5
 */
/**
 * 
 * 滚动数组解法
 * 第 n 项只和第 n - 1 项有关
 * 所以可以初始化两个变量交替相加前进
 * 这里要记住
 * 返回的是 a， 且循环终止条件是 小于 n
 */
function fib(n) {
    let a = 0
    let b = 1
    for (let i = 0; i < n; i++) {
        let temp = a
        a = b
        b = temp + b
    }
    return a
}
/**
 * 动态规划
 * 初始化 DP数组的前两项
 * 遍历从 2 开始 因为前两项已经知道了，终止条件是 小于等于 n，因为就是求第 n 项的值， 所以要算到第 n 项
 */
function fibo(n) {
    const dp = []
    dp[0] = 0
    dp[1] = 1
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}
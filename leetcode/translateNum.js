// 给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

/**
 * 动态规划解法
 * 分两种情况讨论
 *  1. 0-9的数字
 *  2. 10-25的数字
 * 
 */

function translateNum(num) {
    const str = String(num)
    const dp = [1,1]
    for (let i = 2; i <= str.length; i++) {
        const temp = str.substring(i - 2, i)
        if (temp >= 10 && temp <= 25) {
            dp[i] = dp[i - 1] + dp[i - 2]
        } else {
            dp[i] = dp[i - 1]
        }
    }
    return dp[str.length]
}

// 实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，xn）
/**
 * 快速幂解法
 * 分解 x^n -> x^n/2 * x^n/2 -> (x*x)^n/2 
 * 循环 直至 n 为 0，每次循环求一次 x * x,并乘入结果中，
 * 如果当前循环n是奇数，就需要结果值多乘一次x (x^5 = x * x^5/2 * x^5/2 = x * x^2 * x^2)
 * 如果是偶数的话 就累计x的值 
 * 如果 n 是负数的话 转化为 x^-n = 1/x^n
 */
function myPow(x, n) {
    if (x === 0) return 0
    if (n < 0) {
        x = 1 / x
        n = -n 
    }
    let res = 1
    while(n > 0) {
        // 最后一定会走到这个if里面，把之前累积的x的值乘入结果值里面
        if (n & 1) {
            res *= x
        }
        x *= x
        n = Math.floor(n / 2)
    }
    return res
}
// 一共n 个元素，每次数 m 个元素之后删除一个元素，最后剩下的那个元素的下标 -- 约瑟夫环问题

/**
 * 首先考虑第一轮, 数 m 个元素之后，要删除的元素的下标是多少，从 index 为 0 开始，删除元素的下标就是 m - 1，因为 m 可能大于 n
 * 所以应该是 (m - 1) % n，因为要逢 n 归零重新数，比如一共 3 个元素，数 4 个元素之后删除一个，(4 - 1) % 3 = 0，也就是删除的是第 0 个元素
 * 再考虑第二轮，第一轮删除之后，应该是从删除元素的下一个元素重新开始数，删除元素的索引是 (m - 1) % n,那么重新开始的索引就是 m % n,
 * 所以下一个要删除元素的索引就是 (m % n + m - 1) % n, 假设一共只有 3 个数字，那么留下的那个元素的索引其实就是 (m % n + m) % n
 * 如果有 4 个元素，那么当只有 3 个元素的时候最后留下的那个元素的索引其实就是现在重新开始数的位置
 * 这就很明显可以用动态规划解法，用已知解求未知解，这里的第一轮的 m % n,其实就可以当作已知解，也可以看做是只有一个元素的时候的结果
 * 已知只有一个元素的时候，留下的就是他本身，索引为 0，那么最开始的解可以设为 dp[1] = 0
 * 结合上述思路，动态转移方程就是 dp[i] = (dp[i - 1] + m) % i
 */

function lastRemaining(n, m) {
    const dp = []
    dp[1] = 0
    for (let i = 2; i <= n; i++) {
        dp[i] = (dp[i - 1] + m) % i
    }
    return dp[n]
}

/**
 * 元素个数为 n 的解，依赖的只有个数为 n - 1 的时候解，所以可以用常规的动态规划优化写法
 */
function foo(n, m) {
    let res = 0
    for (let i = 2; i <= n; i++) {
        res = (res + m) % i
    }
    return res
}
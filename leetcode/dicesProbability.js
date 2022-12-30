// 把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s的所有可能的值出现的概率。

// 你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

/**
 * 
 * @param {骰子的个数} n 
 * @returns 
 * 
 * 单单看第 n 枚骰子，它的点数可能为 1 , 2, 3, ... , 6，因此投掷完 n 枚骰子后点数 j 出现的次数，可以由投掷完 n-1 枚骰子后，对应点数 j-1, j-2, j-3, ... , j-6出现的次数之和转化过来。
 * 以上是这个问题的关键思路，举个例子，两个骰子，求点数和为 4 出现的概率，因为和为 4 的情况可以由 1 3， 2 2， 3，1 这这种情况组成，
 * 用公式表示也就是 getCount(2, 4) = getCount(1, 1) + getCount(1, 2) + getCount(1, 3)
 * 意思也就是将 1 个骰子的时候(n - 1)，1 出现的次数 + 2 出现的次数 + 3 出现的次数 都加起来 就是两个骰子时，点数和为 4 出现的次数
 * 状态转移公式为
 * 用一个二维数组
 * 第一维表示 第几个骰子 1 - n
 * 第二维表示 点数和出现的次数
 * for (cur = 1; cur <= 6; cur++) {
 *      dp[i][j] += dp[i - 1][j - cur]
 * }
 */

function dicesProbability(n) {
    // 这里初始化 dp 数组为啥都加了 1 因为下面的循环都要从 1 开始数
    const dp = Array(n + 1).fill([]).map(() => Array(6 * n + 1).fill(0))
    for (let i = 1; i <= 6; i++) {
        dp[1][i] = 1
    }

    // 有几个骰子
    for (let i = 2; i <= n; i++) {
        // 有 i 个骰子时会掷出的所有点数
        for (j = i; j <= 6 * i; j++) {
            // 假设是求点数和 4 出现的次数，4 可以由 13 22 31 组合而成，也就是比4小的所有点数都可以拼出4 
            // 所以这里遍历点数 1 - 6 
            for (let cur = 1; cur <= 6; cur++) {
                // 如果是小于1话就直接跳出循环
                if (j - cur <= 0) {
                    break
                }
                dp[i][j] += dp[i - 1][j - cur]
            }
        }
    }
    const total = Math.pow(6, n)
    const res = []
    console.log(dp[n])
    for (let i = n; i <= n * 6; i++) {
        res.push(dp[n][i] / total)
    }
    return res
}

/**
 * 其实我们只需要二维数组的最后一项
 * 而第 n 项都是可以由第 n - 1 项推出来的，所以用一维数组就够了
 */

function foo(n) {
    let dp = Array(6 * n + 1).fill(0)
    for (let i = 1; i <= 6; i++) {
        dp[i] = 1
    }
    for (let i = 2; i <= n; i++) {
        for (let j = 6 * i; j >= i; j--) {
            dp[j] = 0 // 每一轮都要重新计算 所以要重置为 0
            for (let cur = 1; cur <= 6; cur++) {
                // 假设 j 为 4， i 为 2， 当 cur 为 4 的时候，j - cur 为 0，是不存在点数为 0 的情况的
                if (j - cur <= i - 1) {  
                    break
                }
                dp[j] += dp[j - cur]
            }
        }
    }
    const total = Math.pow(6, n)
    const res = []
    console.log(dp[n])
    for (let i = n; i <= n * 6; i++) {
        res.push(dp[i] / total)
    }
    return res
}
console.log(foo(2))

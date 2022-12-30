// 假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

/**
 * 动态规划解法
 * dp[i]表示第 i 天的时候，的最大利润是多少
 * 维护一个最低价
 * 遍历循环每一天的价格
 * 每天都去更新最低价，然后用当天的价格减去最低价，算出如果以当天的价格卖出的话，利润是多少
 * 然后和上一天的结果做比较，然后去一个最大值，存入 dp 数组中
 */

function maxProfit(nums) {
    let len = nums.length
    if (!len) return 0

    let min = nums[0]
    const dp = [0]
    for (let i = 1; i < len; i++) {
        min = Math.min(min, nums[i])
        dp[i] = Math.max(dp[i - 1], nums[i] - min)
    }
    return dp[len - 1]
}
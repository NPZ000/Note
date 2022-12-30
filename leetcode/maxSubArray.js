// 输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。
// 要求时间复杂度为O(n)。

/**
 * 动态规划
 * dp[i] 表示0 - i 区间的和的最大值
 * dp[i] = Max(dp[i - 1] + nums[i], nums[i])
 */

function maxSubArray(nums) {
    const dp = [nums[0]]
    let max = 0
    for (let i = 0; i < nums.length; i++) {
        // 要不要把当前值加入到之前的结果中 加的结果 和 单独的当前值 去最大
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
        // 更新最大值
        max = Math.max(dp[i], max)
    }
    return max
}

// 滚动数组解法
function maxSubArray1(nums) {
    let temp = 0
    let max = nums[0]
    for (let i = 0; i < nums.length; i++) {
        temp = Math.max(temp + nums[i], nums[i])
        max = Math.max(res, max)
    }
    return max
}

//顺便求出那个最大的连续子数组
function maxSubArray2(nums) {
    // dp 保存的是和不为负数的子数组的和 index 保存的是结果数组的开始下标 res 保存的是
    let dp = Number.MIN_SAFE_INTEGER, index = 0, res = Number.MIN_SAFE_INTEGER
    // 结果数组的开始和结束下标
    const mem = [0, 0]
    for (let i = 0; i < nums.length; i++) {
        // 如果 dp 值小于 0 了 之前的也就没意义了 就更新 index 
        if (dp <= 0) index = i
        // 更新 dp 值 如果之前的 dp 值是负数 就重置为 0 重新开始累加
        dp = Math.max(dp, 0) + nums[i]
        // 如果 dp 值 大于全局的 res 了 就该更新结果值 以及结果数组的开始和结束下标了
        if (dp > res) {
            mem[0] = index
            mem[1] = i
            res = dp
        }
    }
    return res
    // let count = 0
    // for (let i = mem[0]; i <= mem[1]; i++) {
    //     count += nums[i]
    // }
    // return count
}
/**
 * 最长递增子序列的长度
 */

function lengthOfLst(nums) {
    const dp = Array(nums.length).fill(1)
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1)
            }
        }
    }
    console.log(dp)
    return Math.max(...dp)
}

console.log(lengthOfLst([10,9,2,5,3,7,21]))
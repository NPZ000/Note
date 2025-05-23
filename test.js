function foo(nums) {
    if (!nums.length) return 0
    let total = nums[0]
    let max = 0
    for (const num of nums) {
        max = Math.max(max, total + num)
        total = Math.max(0, total + num)
    }
    return max
}
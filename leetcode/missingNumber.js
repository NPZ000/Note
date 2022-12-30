// 一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

/**
 * 二分查找法
 * 判断中位数是否是对应的那个数字 如果是 说明缺失的在中位数的右边
 * 如果不是 说明缺失的在中位数的左边
 * 最后左边界对应的数字就是缺失的数字
 */

function missingNumber(nums) {
    let low = 0, high = nums.length - 1
    // 这里考虑 low 等于 high 的情况 比如给到的数组是 [0]，缺失的是 1
    while (low <= high) {
        let mid = low + Math.floor((high - low) / 2)
        if (mid === nums[mid]) {
            low = mid + 1 
        } else {
            high = mid - 1
        }
    }

    return low
}

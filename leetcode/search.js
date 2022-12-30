// 在一个排序数组中统计某个数字出现的次数

/**
 * 二分查找法
 * 首先利用二分查找法找到目标值
 * 然后再看左边界和右边界的值
 * 如果左边界的值小于目标值那么左边界再接着向右移
 * 如果右边界的值大于目标值那么右边界再接着向左移
 * 直至左右边界的值都等于目标值 就计算他们之间的数字的个数
 */

function search(nums, target) {
    let low = 0, high = nums.length - 1
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2)
        if (nums[mid] < target) {
            low = mid + 1
        } else if (nums[mid] > target) {
            high = mid - 1
        } else {
            // if (nums[low] === nums[high]) {
            //     return high - low + 1
            // } else if (nums[low] < target) {
            //     low++
            // } else if (nums[high] > target) {
            //     high--
            // }
            while(nums[low] !== target) low++
            while(nums[high] !== target) high--
            return high - low + 1
        }
    }
    return 0
}
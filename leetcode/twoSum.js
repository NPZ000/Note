// 输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。
/**
 * 双指针解法
 * 两个指针分别指向头尾
 * 判读指针指向的数字的和
 * 如果大于目标值 右指针向左移
 * 小于的话 左指针向左右移
 * 等于的话就输出
 */

function twoSum(nums, target) {
    if (!nums.length) return []
    let left = 0, right = nums.length - 1
    let sum
    while (left < right) {
        sum = nums[left] + nums[right]
        if (sum === target) {
            return [nums[left], nums[right]]
        } else if (sum > target) {
            right--
        } else {
            left++
        }
    }
    return []
}
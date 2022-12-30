// 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

function findNumberIn2DArray(nums, target) {
    if (!nums.length) return false
    let i = nums.length - 1, j = 0
    while (i >= 0 && j < nums[0].length) {
        if (nums[i][j] === target) {
            return true
        }
        // 如果当前数字小于目标值，那么列数往右移 因为横向的数字是从左往右递增的 小了就肯定在右边
        else if (nums[i][j] < target) {
            j++
        }
        // 如果当前数字大于目标值了 那么行数往上移 因为纵向的数字是从上到下递增的 大了就肯定在上面
        else if (nums[i][j] > target) {
            i--
        }
    } 
    return false
}
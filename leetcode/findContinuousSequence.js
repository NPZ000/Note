// 输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。
// 序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

/**
 * 滑动窗口
 * 结果值不会包含 0，所以左边界从 1 开始，滑动窗口的区间初始化为空，所以右边界也为 1，
 * 之后开启 while 循环，跳出的条件为 左边界的值为目标值的一半，因为 target / 2 + target / 2 + 1 > target
 * 当窗口中的值小于目标值时 右边界向右移动 同时窗口内的值的和要加上右边界的值，
 * 当窗口中的值大于目标值时，左边界向右移动，同时窗口内的值的和要减去左边界的值
 * 等等于目标值的值的时候，就把窗口中的值加入到结果中，同时左边界向右移动
 */

function findContinuousSequence(target) {
    let i = 1, j = 1, sum = 0, res = []
    while (i < target / 2) {
        if (sum < target) {
            sum += j
            j++
        } else if (sum > target) {
            sum -= i
            i++
        } else {
            let temp = []
            for (let init = i; init < j; init++) {
                temp.push(init)
            }
            res.push(temp)
            sum -= i
            i++
        }
    }
    return res
}

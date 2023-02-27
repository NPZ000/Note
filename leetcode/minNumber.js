// 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
/**
 * 
 * @param {原数组} nums 
 * @returns 排列出的字符串
 * 
 * 改写sort的排序逻辑 
 * 把要排序的两个数字拼接起来
 * 对于 a 和 b，如果 ‘ab' < 'ba' 那么 a 就在 b 的前面
 * 比如 1，2  12 < 21 所以结果就是‘12’
 * 最后需要用 join 拼接出最后的结果 是个字符串
 */

function minNumber(nums) {
    const compare = (a, b) => {
        const x = `${a}${b}`
        const y = `${b}${a}`
        return x - y
    }

    return nums.sort((a, b) => compare(a, b)).join('')
}
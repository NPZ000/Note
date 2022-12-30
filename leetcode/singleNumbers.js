// 一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

/**
 * 对所有数字进行异或运算 得到那两个目标数字异或的结果
 * 在这个异或的值的二进制表示中 找到第一个 1 出现的位置，这个 1 就是那俩数字出现分歧的地方 因为异或的性质 两方不同 异或的结果才是 1
 * 再根据这个 1 对原数组进行分组 那两个数字肯定会被分开 
 * 分在两组后 再进行异或 就可以找到那两个只出现一次的值
 */

function singleNumber(nums) {
    let x = 0, y = 0, n = 0, m = 1
    for (let num of nums) {
        n ^= num
    }

    // 找到 1 出现的位置  那俩数字在这个位置上肯定不相等  因为异或运算 不相等才返回 1
    while ((m & n) === 0) m <<= 1 

    // 根据 m 对数组进行分组
    for (let num of nums) {
        if (num & m) {
            x ^=num
        } else {
            y ^= m
        }
    }

    return [x, y]
}
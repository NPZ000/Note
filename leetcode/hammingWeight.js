// 二进制中1的个数
// 逐位判断 循环32次 每次将1向左移 与n的每一位比较 &操作符 两边都为1 结果才是1
function count(n) {
    let count = 0
    for (let i = 0; i < 32; i++) {
        if (n & 1 << i) {
            count++
        }
    }
    return count
}
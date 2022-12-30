// 数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

// 你可以假设数组是非空的，并且给定的数组总是存在多数元素。

/**
 * 摩尔投票法
 * 选第一个位候补众数
 * 声明一个计数器
 * 之后遍历数组 遇到一样的计数器就加一 不一样的就减一 如果计数器归零 就换一个候补众数
 * 最后活下来的那个就是众数
 */

function majorityElement(list) {
    let count = 0
    let res
    for (let num of list) {
        if (!count) {
            res = num
            count = 1
        } else {
            if (num === res) {
                count++
            } else {
                count--
            }
        }
    }
    return res
}

 
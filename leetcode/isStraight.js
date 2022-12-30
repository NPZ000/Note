// 从若干副扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

/**
 * 首先排序
 * 遍历统计大小王joker 也就是 0 的数量
 * 如果在遍历的过程中出现重复的 直接返回false
 * 然后用最后一张牌减去除去0之外的最小的那张牌，如果小于 5 就说明是顺子
 */

function sort(nums, begin, end) {
    if (begin < end) {
        let i = begin, j = end
        let temp = nums[begin]
        while (i < j) {
            // 这里先让 j 移动，找到小于基准的值之后可以去覆盖到 i 指针的位置，因为 i 指针的值已经提前保存过了
            // 如果先让 i 移动的话，去覆盖 j 指针的值，因为 j 指针的值没有保存过，覆盖之后，就丢失原来的值了
            while (i < j && nums[j] > temp) j--
            nums[i] = nums[j]
            // 这里判断 nums[i] <= temp 是因为可能回出现相等的情况 如果不处理相等的情况就回死循环了
            while (i < j && nums[i] <= temp) i++
            nums[j] = nums[i]
        }
        // 基准数字放在此时 i 和 j 重合的位置 ，因为现在经过交换左边的都是比基准数字小的数字 右边的都是大的
        nums[i] = temp
        sort(nums, begin, i - 1)
        sort(nums, i + 1, end)
    } else {    
        return
    }
}
// const nums = [5,4,3,2,1]
// debugger
// sort(nums, 0, nums.length - 1)
// console.log(nums)

function isStraight(nums) {
    sort(nums, 0, nums.length - 1)
    let joker = 0
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0) {
            joker++
            continue
        }
        if (nums[i] === nums[i + 1]) {
            return false
        }
    }
    return nums[4] - nums[joker] < 5
}
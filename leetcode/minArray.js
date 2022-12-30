/**
 * 把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
    给你一个可能存在 重复 元素值的数组 numbers ，它原来是一个升序排列的数组，并按上述情形进行了一次旋转。请返回旋转数组的最小元素。例如，数组 [3,4,5,1,2] 为 [1,2,3,4,5] 的一次旋转，该数组的最小值为1。  
 */
/**
 * 思路：
 * 使用二分查找法
 * 找到 mid 同 right 做比较，有三种情况
 *  1. mid 小于 right：说明最小值在 mid 的左边 比如 40123，mid 是 1 ，小于 3，最小值是 0 在 mid 的左边，就可以忽略掉右边的部分 right = mid
 *  2. mid 大于 right：说明最小值在 mid 的右边 比如 23401，mid 是 4 ，大于 right = 1， 最小值是 0 在 mid 的右边，就可以忽略掉左边的部分 left = mid + 1
 *  3. mid 等于 right：比如 11112011，最小值是 0，mid 是 1 ， right 也是 1，这种情况的话就不知道最小值在哪边了，所以就不能贸然的忽略掉左边或者右边，因为 right 和 mid 相等，所以可以把 right 去掉，以此来缩小范围 right--
 * -- 注意 这里只能和 right 比较，不能和 left 比较，考虑没有翻转的情况，12345，mid 是 3，如果和 left 比较，大于 1，如果是翻转过的情况就应该是舍弃左边，但是现在这种情况就不能舍弃左边，因为最小的是在左边，如果是和 right 比较，不论是不是翻转过的，这种小于 right 的情况都应该舍弃掉右边的部分
 */

function minArray(arr) {
    let left = 0, right = arr.length - 1
    while (left < right) {
        let mid = left + Math.floor((right - left) / 2)
        if (arr[mid] > arr[right]) {
            left = mid + 1
        } else if (arr[mid] < arr[right]) {
            // 这里为什么不是 mid - 1，因为此时的中位数很可能就是要找的那个数字，比如 4 5 1 2 3，mid 是 1，如果 mid - 1，就会把 1 给略过去
            // 上面的当中位数大于右边界数的时候，他肯定不是要找的那个数字，所以可以直接把它忽略掉
            right = mid
        } else {
            right--
        }
    }
    return arr[left]
}
console.log(minArray([2,3,4,0,1]))
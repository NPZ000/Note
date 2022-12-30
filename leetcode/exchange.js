// 输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

/**
 * 快慢指针解法
 * 快指针先走找奇数 找到的话 就和慢指针位置的数进行交换 直至快指针走到尾
 */
function exchange(arr) {
    let slow = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2) {
            let temp = arr[slow]
            arr[slow] = arr[i]
            arr[i] = temp
            slow++
        }
    }
    return arr
}

/**
 * 首尾指针解法
 * 初始化两个指针分别指向数组的左右两端
 * 左指针向右移动寻找偶数
 * 右指针向左移动寻找奇数
 * 都找到之后进行交换 然后再接着找 直至两个指针相遇 跳出循环
 */
function exchange1(arr) {
    let left = 0, right = arr.length - 1
    while (left < right) {
        while (left < right && arr[left] % 2) left++
        while (left < right && arr[right] % 2 === 0) right--
        let temp = arr[left]
        arr[left] = arr[right]
        arr[right] = temp 
    }
    return arr
}
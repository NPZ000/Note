// 快速排序

function quickSort(arr, begin, end) {
    if (begin > end) return
    // 左边界  右边界 哨兵值
    let i = begin, j = end, temp = arr[begin]
    while (i < j) {
        // 右指针往前找 找一个比哨兵值小的值 交换到左指针的位置
        while (i < j && arr[j] > temp) j--
        arr[i] = arr[j]
        console.log(arr)
        // 左指针往右找 找一个大于等于哨兵的值 交换到右指针的位置
        while (i < j && arr[i] <= temp) i++
        arr[j] = arr[i]
        console.log(arr)
    }
    // 哨兵值交换到左指针现在的位置
    arr[i] = temp
    quickSort(arr, begin, i - 1)
    quickSort(arr, i + 1, end)
}
const arr = [5,4,3,2,1]
quickSort(arr, 0, 4)
function quickSort(arr, begin, end) {
    if (begin < end) {
        // 取第一个做哨兵值
        let p = arr[begin]
        let i = begin, j = end
        while (i < j) {
            // 从后往前找比哨兵值小的 交换到 i 的位置
            while (i < j && arr[j] > p) j--
            arr[i] = arr[j]
            // 从前往后找比哨兵值大的 交换到 j 的位置
            while (i < j && arr[i] <= p) i++
            arr[j] = arr[i]
        }
        // 哨兵值交换到 i 现在的位置
        arr[i] = p
        // 然后递归处理 i 左边 和 右边的
        quickSort(arr, begin, i - 1)
        quickSort(arr, i + 1, end)
    } else {
        return
    }
}

function sort(arr, begin, end) {
    if (begin < end) {
        const p = arr[begin]
        let i = begin, j = end
        while (i < j) {
            while(i < j && arr[j] > p) j--
            arr[i] = arr[j]
            while(i < j && arr[i] <= p) i++
            arr[j] = arr[i]
        }
        arr[i] = p
        sort(arr, begin, i - 1)
        sort(arr, i + 1, end)
    } else {
        return
    }
}
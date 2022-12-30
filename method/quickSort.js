function quickSort(arr, begin, end) {
    if (begin < end) {
        let p = arr[begin]
        let i = begin, j = end
        while (i < j) {
            while (i < j && arr[j] > p) j--
            arr[i] = arr[j]
            while (i < j && arr[i] <= p) i++
            arr[j] = arr[i]
        }
        arr[i] = p
        quickSort(arr, begin, i - 1)
        quickSort(arr, i + 1, end)
    } else {
        return
    }
}
// 输入整数数组 arr ，找出其中最小的 k 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

/**
 * 
 * @param {*} arr 
 * @param {*} k 
 * @returns 
 * 因为只需要找到最小的 k 个数，所以不需要对这 k 个数再进行排序
 * 利用快排划分出两半 一半大的一半小的 哨兵左边的就是比哨兵小的 右边的就是比哨兵大的
 * 快排方法返回哨兵的位置
 * 如果哨兵的位置 小于 k 说明 k 左边的数还不够 k 个 需要对右边的数再次进行划分 反之就对左边的继续进行划分
 * 如果哨兵的位置正好等于 k 那么就说明哨兵左边的数 就是最小的 k 个数
 */


function getLeastNumber(arr, k) {
    
    const quickSort = (begin, end) => {
        if (begin < end) {
            let i = begin, j = end, temp = arr[begin]
            // 快排划分
            while (i < j) {
                while (i < j && arr[j] > temp) j--
                arr[i] = arr[j]
                while (i < j && arr[i] <= temp) i++
                arr[j] = arr[i]
            }
            arr[i] = temp
            // 返回哨兵的位置
            return i
        } else {
            return begin
        }
    }

    const recur = (begin, end) => {
        const index = quickSort(begin, end)
        // 判断哨兵的位置
        if (index === k) {
            return arr.slice(0, k)
        }
        if (index < k) {
            recur(index + 1, end)
        } else {
            recur(begin, index - 1)
        }
    }
    recur(0, arr.length - 1)
    return arr.slice(0, k)
}
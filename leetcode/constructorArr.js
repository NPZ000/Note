// 给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B[i] 的值是数组 A 中除了下标 i 以外的元素的积, 即 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。
// 题目的意思其实就是 b[i] = 数组 a 中除了第 i 项其他所有数字的乘积

/**
 * 用两轮循环
 * 第一轮求 i 之前的乘积
 * 第二轮求 i 之后的乘积
 */
function constructorArr(arr) {
    if (!arr.length) return []
    const res = []
    // p保存 i 之前的乘积结果
    for (let i = 0, p = 1; i < arr.length; i++) {
        res[i] = p
        p *= arr[i]
    }
    for(let i = arr.length - 1, p = 1; i >= 0; i--) {
        res[i] *= p
        p *= arr[i]
    }
    return res
}
constructorArr([1,2,3,4,5])
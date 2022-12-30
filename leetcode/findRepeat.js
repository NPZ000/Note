// 找出数组中重复的数字。
// 在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

function findRepeat(nums) {
    const swap = (arr, a, b) => {
        let temp = arr[a]
        arr[a] = arr[b]
        arr[b] = temp
    }
    let i = 0
    while (i < nums.length) {
        // 如果当前位置上就是索引对应的数字 比如 索引 3 的位置就是 3 就跳过本轮循环
        if (nums[i] === i) {
            i++
            continue
        } else if (nums[nums[i]] === nums[i]) {
            // 如果以当前数字为索引的位置已经有对应的数字了 那么这个数字就是重复的那个
            // 比如 0 1 2 3 3  
            // 遍历到第二个 3 的时候，此时索引为 3 的位置已经有一个 3 了，那么这第二个 3 就是重复的 就直接返回这个数字
            return nums[i]
        }
        // 不符合以上两种情况的，就把当前数字交换到他应该在的位置上
        // 比如 0 2 1，遍历到 2 的时候，不符合以上两种情况 就交换他到该在的位置上 交换结束后 0 1 2
        swap(nums, nums[i], i)
    }
}

function findRepeat1(nums) {
    let i = 0
    while (i < nums.length) {
        if (nums[i] === i) {
            i++
            continue
        } else if (nums[i] === nums[nums[i]]) {
            return nums[i]
        }
        // 这里的顺序不能反， 必须是nums[i] 在后面，如果在前面的话就会先去改变它，如果它先变了的话，再去改变nums[nums[i]] 就不对了，因为里面的nums[i] 已经变了
        [nums[nums[i]], nums[i]] = [nums[i], nums[nums[i]]]
    }
}

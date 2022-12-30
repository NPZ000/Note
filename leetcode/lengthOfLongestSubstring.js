// 最长不含重复字符的子字符串

// 滑动窗口解法
/**
 * 两个指针
 * 如果两个指针之间没有重复的字符 右指针就向右移 同时计算长度更新结果值
 * 如果两个指针之间有重复的字符 左指针就向右移
 */

// function lengthofLongestSub(s) {
//     if (!s.length) return 0
//     if (s.length === 1) return 1
//     let len = s.length
//     let max = 0
//     let start = 0, end = 1
//     while (end < len) {
//         const tempStr = s.substring(start, end)
//         console.log(tempStr)
//         const cur = s.charAt(end)
//         if (tempStr.includes(cur)) {
//             start++
//         } else {
//             max = Math.max(max, end - start + 1)
//             end++
//         }
//     }
//     console.log(max)
//     return max
// }
// const str = 'abcacb'
// debugger
// lengthofLongestSub(str)

/**
 * 
 * @param {*} s 
 * @returns 
 * 每次遇到已经出现过的元素就更新一下左指针的位置
 * 计算所有重复元素之间的长度
 */
function lengthofLongestSub(s) {
    let max = 0, start = -1
    const map = new Map()
    for (let i = 0; i < s.length; i++) {
        // 这里要显示的判断不等于 undefined 因为索引 0 也应该走进来
        if (map.get(s[i]) !== undefined) {
            // 更新 左指针的位置 确保左指针到当前位中间没有重复
            // 这里为什么要取一个最大值，而不是直接取 map.get(s[i])
            // 考虑这个 case ‘abba’ 第二次遇到 b 然后更新 start 为第一个 b 的索引为 1
            // 然后第二次遇到 a 此时如果直接取 map.get(a[i]) 那么 start 的值就会被更新成 0 
            // 很显然 start 是不能往后退的 如果此时 start 的值往后退了那么 start 到 i 的位置就会有重复的两个 b 了
            start = Math.max(start, map.get(s[i]))
        }
        map.set(s[i], i)
        // 更新结果
        max = Math.max(i - start, max)
    }
    return max
}
const s = "abccdefg"
debugger
const res = lengthofLongestSub(s)
console.log(res)

// 动态规划解法
// dp[j] 表示以索引 j 结尾的不包含重复字符的子串的长度， s[i] 表示在索引 j 的左边与索引 j 位置上 字符相同的字符 也就是 s[i] = s[j]
// 如果 i < 0 表示 j 左边没有相同的字符 则 dp[j] = dp[j - 1] + 1
// 如果 dp[j - 1] < j - i, 则说明 s[i] 不在 dp[j - 1] 的范围内，则 dp[j] = dp[j - 1] + 1, 意思也就是与当前索引 j 的字符相等的那个字符不在以 j - i 结尾的不包含重复字符的子串里，那么就可以继续加上位置 j 上的字符
// 如果 dp[j - 1] >= j - i, 则说明 s[i] 在 dp[j - 1] 的范围内，意思就是以位置 j - 1 结尾的不包含重复字符的子串中有一个与位置 j 上的字符相同的字符，我们要求的是以位置 j 结尾的不包含重复字符的子串，所以现在就得更新重新计算这个长度为 j - i
function maxSubLen(str) {
    const map = new Map()
    map.set(str[0], 0)
    const dp = [1]
    for (let i = 1; i < str.length; i++) {
        // 在 map 中查找当前字符是否出现过
        const temp = map.get(s[i])
        // 这必须显示判断是否是undefined
        // 更新 left 的位置
        const left = temp !== undefined ? temp : -1
        if (i - left > dp[i - 1]) {
            dp[i] = dp[i - 1] + 1
        } else {
            dp[i] = i = left
        }
        map.set(str[i], i)
    }
    return Math.max(...dp)
}

function maxSunLength(s) {
    if (!s) return 0
    const map = new Map()
    let res = 0, max = 0
    for (let i = 0; i < s.length; i++) {
        const temp = map.get(s[i])
        const left = temp !== undefined ? temp : -1
        map.set(s[i], i)
        if (i - left > max) {
            max = max + 1
        } else {
            max = i - left
        }
        res = Math.max(res, max)
    }
    return res
}
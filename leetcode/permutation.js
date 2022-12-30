// 输入一个字符串，打印出该字符串中字符的所有排列。 会有重复的元素

/**
 * 回溯法
 * 因为会出现重复的结果 所以先将字符串进行排序 将相同的字符串放在一起 之后在选择字符的时候保证相同的字符是按顺序加入的
 * 比如 a b1 b2 c, 只有 b1 被选择的时候 b2 才会被选择 所以就只会出现 a b1 b2 c 或者 c b1 b2 a的情况 而不会出现 a b2 b1 c的情况
 * 边界条件为 排列的字符长度 等于 基准字符串的长度
 * 循环选择字符
 *     跳过已经选择的字符 或者 和前一位相同时 前一位还没被选择
 * 递归进行下一位置的排列
 * 取消标记的字符 和 字符的选择
 */

function permutation(s) {
    const res = []
    let trace = ''
    // 重新排列字符串 让相同的字符都排在一起
    const newStr = Array.from(s).sort()
    const len = s.length
    const visible = Array(len).fill(false)
    // k 当前固定第几位
    const dfs = (k) => {
        if (k === len) {
            res.push(trace)
            return
        }
        for (let i = 0; i < len; i++) {
            // 如果当前位已经选择过 or
            // 当前位和前一位相同 但是前一位还没有被选择过 就跳过 保证了相同的字符是按顺序加入的 前提是当前位不是第一位 
            if (visible[i] || (i > 0 && !visible[i - 1] && newStr[i - 1] === newStr[i])) {
                continue
            }
            // 标记当前位
            visible[i] = true
            // 选择当前位
            trace += newStr[i]
            dfs(k + 1)
            // 撤销对当前位的选择
            trace = trace.slice(0, -1)
            visible[i] = false
        }
    }
    dfs(0)

    return res
}
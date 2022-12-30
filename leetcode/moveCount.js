// 机器人运动的范围
// 地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问该机器人能够到达多少个格子？
/**
 * 深度优先搜索
 * 终止条件 越界 或者 已经访问过
 * 记录当前访问的格子 并进行标注 下次不再访问
 * 计算当前格子是否合法 合法就加一 不合法就返回
 * 递归访问上下左右四个方向
 */

function movCount(m, n, k) {
    // 保存访问的记录
    const visible = Array(m).fill([]).map(v => Array(n).fill(false))
    // 计数器
    let count = 0
    // i 外层索引 j 内层索引 
    const dfs = (i, j) => {
        // 越界或者已经访问过 直接返回
        if (i < 0 || i === m || j < 0 || j === n || visible[i][j]) {
            return
        }
        // 计算当前格子左边的位数的和
        let a = i, b = j, sum = 0
        while (a) {
            sum += a % 10
            a = Math.floor(a / 10)
        }
        while (b) {
            sum += b % 10
            b = Math.floor(b / 10)
        }
        // 标记当前访问的位置
        visible[i][j] = true
        // 如果和小于 k 计数器加一 否则 直接返回
        if (sum <= k) {
            count++
        } else {
            // 这为什么直接返回 如果当前格子不能访问的话 还向其他方向走的话 路线就断了
            return
        }
        // 对上下左右下个方向递归进行访问
        dfs(i + 1, j)
        dfs(i - 1, j)
        dfs(i, j - 1)
        dfs(i, j + 1)
    }
    dfs(0, 0)
    return count
}
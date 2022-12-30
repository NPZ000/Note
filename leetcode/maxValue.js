// 在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

/**
 * 动态规划解法
 * dp[i][j] 表示到达第 i 行，第 j 列的格子时，礼物的最大价值
 * 在移动的过程中要考虑以下几种情况
 *  第一行第一列时，也就是第一个格子，直接填入 dp 数组中
 *  在第一行的时候，只能是从左边的格子移动过来的，所以只能左边的格子时的总价值加上当前格子的价值
 *  在每行的第一列时，只能是从上边移动过来的，所以只能上面的格子时的总价值加上当前格子的价值
 *  其他情况就要判断是从上面格子过来的总价值大 还是从左边的格子过来的总价值大，取他们之间的最大值 加上当前格子的价值
 */

function maxValue(grid) {
    let rows = grid.length, columns = grid[0].length
    const dp = Array(rows).fill(0).map(() => Array(columns).fill(0))
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (!i && !j) {
                dp[i][j] = grid[i][j]
            } else if (!i) {
                dp[i][j] = dp[i][j - 1] + grid[i][j]
            } else if (!j) {
                dp[i][j] = dp[i - 1][j] + grid[i][j]
            } else {
                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]) + grid[i][j]
            }
        }
    }
    console.log(dp)
    return dp[rows - 1][columns - 1]
}
const grid = [[1,3,1],[1,5,1],[4,2,1]]
maxValue(grid)

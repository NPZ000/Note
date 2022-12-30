/**
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。    
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
 */
/**
 * 回溯法
 * 模板
 * 1. 终止条件： i 或者 j 越界，或者当前访问的元素不是要目标值
 * 2. 路径记录： 把当前访问过的元素置空  防止再次访问
 * 3. 递归： 递归查询上下左右四个方向 
 * 3. 撤销选择的路径： 把之前置空的元素还原
 */

function exits(board, word) {
    // i 是外层的索引 j 是内层的索引 k 是 word 字符的索引 -> 查找到第几个元素了
    const dfs = (i, j, k) => {
        // 越界或者不是要找的字符 就直接返回 false
        if (i < 0 || i > board.length - 1 || j < 0 || j > board[0].length - 1 || board[i][j] !== word[k]) {
            return false
        }
        // 如果已经找到 word 最后一个字符了 就返回 true
        if (k === word.length - 1) return true
        // 暂时置空 防止再次访问
        board[i][j] = ''
        // 递归进行四个方向的查找 有一个能返回 true 就行，所以这里用了 或
        const res = dfs(i - 1, j, k + 1) || dfs(i + 1, j, k + 1) || dfs(i, j - 1, k + 1) || dfs(i, j + 1, k + 1)
        // 还原置空的字符 还要进行下一轮的访问
        board[i][j] = word[k]
        return res
    }

    // 这个双层循环是为了找到那个入口 就是要找的第一个字符
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            // 这里可能会在矩形中找到多个 首字符，有可能第一个进去找不到返回false，第二个进去就能找到返回 true
            // 所以这里并不能直接返回 dfs(i, j, 0)，要找到能返回 true 那个，再返回 true
            if (dfs(i, j, 0)) return true
        }
    }
    return false
}
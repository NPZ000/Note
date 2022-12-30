// 顺时针打印矩阵

/**
 * 模拟法
 * 顺时针走一遍矩阵的路线，当越界的时候，就顺时针改变方向，已经访问过的点进行标记 所以还需要一个同样的矩阵
 */

function spiralOrder(matrix) {
    if (!matrix.length || !matrix[0].length) {
        return []
    }
    // row 是行数 columns 是列数
    const rows = matrix.length, columns = matrix[0].length
    // 用来记录已经访问过的点
    let visible = Array(rows).fill(0).map(item => Array(columns).fill(false))
    // 总数
    const total = rows * columns
    // 记录结果的
    const order = Array(total).fill(0)
    // 方向键
    const directionIndex = 0
    // 这个二维数组的每一项表示 行 和 列要变的值 如果是 1 就是 加 1，如果是 0 就是不变 -1 就是减 1
    const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    let row = 0, column = 0
    for (let i = 0; i < total; i++) {
        // 标注当前点为true
        visible[row][column] = true
        // 记录当前点的值
        order[i] = matrix[row][column]
        // 计算下一行 和 下一列
        const nextRow = row + direction[directionIndex][0]
        const nextColumn = column + direction[directionIndex][1]
        // 如果下一行或者下一列越界 ｜｜ 下一个访问的点已经访问过了 就改变方向
        if (!(nextRow >= 0 && nextRow < rows && nextColumn >= 0 && nextColumn < columns && !visible[nextRow][nextColumn])) {
            directionIndex = (directionIndex + 1) % 4
        }
        // 行 和 列沿着方向变化 这不能直接使用 nextRow 和 nextColumn 因为他们可能会是越界的错误的
        row = row + direction[directionIndex][0]
        column = column + direction[directionIndex][1]
    }

    return order
}

var spiralOrder = function(matrix) {
    const res = []
    // 当前行 当前列 行要走的步数 列要走的步数
    let row = 0, column = 0, rowStep = 0, columnStep = 1
    if (matrix.length) {
        const total = matrix.length * matrix[0].length
        for (let i = 0; i < total; i++) {
            res.push(matrix[row][column])
            // 访问过的置空
            matrix[row][column] = ' '
            // 计算下一行 和下一列
            const nextRow = row + rowStep
            const nextColumn = column + columnStep
            // 判断下个访问的位置是否越界或者已经访问过
            // 如果越界或者已经访问过 就需要改变行步数和列步数
            // 四个方向的行步数和列步数 依次为 0 1  1 0  0 -1  -1 0
            // 其实就是什么时候行动 什么列动
            if (nextRow < 0 || nextRow === matrix.length || nextColumn < 0 || nextColumn === matrix[0].length || matrix[nextRow][nextColumn] === ' ') {
                const temp = rowStep
                rowStep = columnStep
                columnStep = -temp
            }
            // 这里再计算下一行和下一列的位置
            row += rowStep
            column += columnStep
        }
    }
    return res
};
//请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

/**
 * 还是层序遍历的思路
 * 额外加一个变量 标记当前行是奇数行还是偶数行
 * 如果是奇数行就用push 如果是偶数行就用unshift
 */

function levelOrder(root) {
    if (!root) return []

    let res = []
    let stack = [root]
    let index = 1
    while(stack.length) {
        let temp = []
        for (let i = stack.length; i > 0; i--) {
            let node = stack.shift()
            index % 2 ? temp.push(node.val) : temp.unshift(node.val)
            node.left && stack.push(node.left)
            node.right && stack.push(node.right)
        }
        index++
        res.push(temp)
    }
    return res
}
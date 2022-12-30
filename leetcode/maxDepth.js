// 输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树的深度。

/**
 * 层序遍历法
 */

function maxDeoth(root) {
    if (!root) return 0
    let res = 0
    let stack = [root]
    while (stack.length) {
        for (let i = stack.length; i > 0; i--) {
            let node = stack.shift()
            node.left && stack.push(node.left)
            node.right && stack.push(node.right)
        }
        res++
    }
    return res
}

/**
 * 递归解法
 */

function maxDepth1(root) {
    if (!root) return 0

    return Math.max(maxDepth1(root.left), maxDepth1(root.right)) + 1
}
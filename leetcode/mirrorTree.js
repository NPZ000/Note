/**
 * 二叉树的镜像 就是把二叉树的左右子树互换
 * 
 * 递归
 * 边界条件为向下搜索越界 即为 null
 * 
 */
function mirrorTree(root) {
    if (root === null) {
        return null
    }
    let left = mirrorTree(root.left)
    let right = mirrorTree(root.right)
    root.left = right
    root.right = left
    return root
}
/**
 * 层序遍历解法
 * 自上而下
 * 利用辅助栈
 * 每一轮循环都从栈中取出一个节点 如果它的左右节点不为空则继续放入栈中
 * 然后再交换当前节点的left和right
 * 下一轮循环往复
 */

function mirror(root) {
    if (root === null) {
        return null
    }
    const stack = [root]
    while (stack.length) {
        let node = stack.pop()
        if (node.left) stack.push(node.left)
        if (node.right) stack.push(node.right)
        let temp = node.left
        node.left = node.right
        node.right = temp
    }
    return root
}

// dfs解法
function mirrorTree(root) {
    const dfs = root => {
        if (!root) return null
        const left = dfs(root.left)
        const right = dfs(root.right)
        root.left = right
        root.right = left
        return root
    }
    return dfs(root)
}
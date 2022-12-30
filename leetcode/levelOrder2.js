// 从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

/**
 * 还是层序遍历的解法 但是这里是要输出一个二维数组 数组的每一项就是二叉树的每一层
 * 在while循环中 需要把遍历当前栈的元素先放在一个辅助栈中 然后遍历结束之后 把这个辅助栈放入结果的数组中
 */

function levelOrder(root) {
    if (!root) return []
    const res = []
    const stack = [root]
    while (stack.length) {
        let temp = []
        for(let i = stack.length; i > 0; i--) {
            let node = stack.shift()
            temp.push(node.val)
            node.left && stack.push(node.left)
            node.right && stack.push(node.right)
        }
        res.push(temp)
    }

    return res
}
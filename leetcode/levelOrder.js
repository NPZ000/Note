// 从上到下打印二叉树

/**
 * 层序遍历
 * 利用辅助栈 初始化的时候根节点放进去
 * 然后while循环这个栈
 * 在每层循环中 要for循环遍历栈中的元素 都打印出来 这里要弹出栈首的元素 因为元素如果还有左右子节点 还会继续加入栈中
 * 但是这里用的倒序的遍历 i的初始者设置的是栈的原始长度，所以当前轮的循环不会遍历到新入栈的元素
 */

function levelOrder(root) {
    let res = []
    let stack = [root]
    while(stack.length) {
        // 这用倒序的遍历 是因为后面还有新元素加进来，i的初始值设置为数组原来的长度，倒序遍历，这样就会只遍历到数组的旧元素，遍历完就退出循环
        for (let i = stack.length; i > 0; i--) {
            let node = stack.shift()
            res.push(node.val)
            node.left && stack.push(node.left)
            node.right && stack.push(node.right)
        }
    }

    return res
}
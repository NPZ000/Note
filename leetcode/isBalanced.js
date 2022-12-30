// 输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。

/**
 * 如果一棵树是平衡的，那么他的所有子节点也都是平衡的，平衡的条件是左右子树的深度不超过1
 */

/**
 * 自顶向下 在向下搜索的过程中就进行了计算
 * 每当遍历到一个节点就计算一下以当前节点的左右子树高度是否不超过 1，是的话再分别递归判断左右子树
 * 因为是向下递归的 所以不可避免的会对节点的高度进行重复计算
 */

function isBalanced(root) {
    const height = root => {
        if (!root) return 0
        return Math.max(height(root.left), height(root.right)) + 1
    }

    if (!root) {
        return true
    } else {
        return Math.abs(height(root.left) - height(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right)
    }
}

/**
 * 自底向上 当搜索到底 往回溯的时候才进行计算
 * 如果以当前节点为根节点的树是平衡的 也就是左右子树高度差不超过 1 那么就返回这个树的高度，否则就返回 -1
 * 如果左子树或者右子树返回了-1 说明不是平衡的 就直接返回 -1
 * 
 * 计算树的高度就是回溯的时候每层加 1 上去的，这里相等于是回溯到某个节点的时候就已经知道左右子树的高度了 我们对其进行计算 
 * 如果不超过1 就是平衡的 正常返回其高度 让上一层 继续计算，如果不是平衡的就返回个 -1 ，此时就可知整颗树都不是平衡的 再上层的时候判断如果下面的是 -1  也直接返回 -1
 * 最后判断是否是 -1 
 */

function isBalanced1(root) {
    const height = root => {
        if (!root) return 0
        const left = height(root.left)
        if (left === -1) return -1
        const right = height(root.right)
        if (right === -1) return -1
        return Math.abs(left - right) <= 1 ? Math.max(left - right) + 1 : -1
    }

    return height(root) !== -1
}
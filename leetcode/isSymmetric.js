// 请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

/**
 * 需要辅助函数用来判断左右子树
 * 边界条件
 *  左子树或者右子树同时搜索越界 则直接返回true
 *  若左子树或者右子树其一先行搜索越界 或者当前比较节点的值不相等 则直接返回false
 * 再递归判断左子树的左子树和右子树的右子树 && 左子树的右子树和右子树的左子树
 * 
 */

function isSymmetric(root) {
    if (!root) return true

    const dfs = (left, right) => {
        if (!left && !right) return true

        if (!left || !right || left.val !== right.val) return false

        return dfs(left.left, right.right) && dfs(right.left, left.right)
    }

    return dfs(root.left, root.right)
}
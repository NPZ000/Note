//给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

// 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

/**
 * 搜索树的性质，根节点的左边都比根节点小 右边都比根节点大
 * 根据此性质可以拿 a b 两个节点的值和当前根节点的值做比较
 * 如果都小于根节点，那么就在当前根节点的左子树中找
 * 如果都大于根节点，那么就在当前节点的右子树中找
 * 如果一个大于根节点一个小于根节点，那么这个根节点的值就是他们公共祖先节点了
 * 或者等于其中的一个节点了，那么这个节点也算是他们的公共祖先
 */

function lowestCommonAncestor(root, a, b) {
    if (root.val < a.val && root.val < b.val) {
        return lowestCommonAncestor(root.right, a, b)
    }
    if (root.val > a.val && root.val > b.val) {
        return lowestCommonAncestor(root.left, a, b)
    }
    return root
}

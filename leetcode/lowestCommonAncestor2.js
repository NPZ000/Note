// 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

// 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

/**
 * 用先序遍历，如果当前节点为空返回null
 * 如果当前节点等于 a b 两个其中的一个 就返回那个
 * 然后递归搜索左右子树，
 * 如果左子树中没找到，就返回右子树
 * 反之返回左子树
 * 如果左子树找到了右子树也找到了 就说明当前的根节点是公共节点，就返回他
 */

function lowestCommonAncestor(root, a, b) {
    if (!root || root.val === a.val || root.val === b.val) return root
    const left = lowestCommonAncestor(root.left, a, b)
    const right = lowestCommonAncestor(root.right, a, b)
    if (!left) return right
    if (!right) return left
    return root
}

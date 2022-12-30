// 找出二叉搜索树中第 k 大的值
/**
 * 二叉搜索树的特性是从左节点比根节点小 右节点比根节点大
 * 中序遍历的结果就是排序的结果 左根右的顺序
 * 但是这里是第 k 大 所以要从后往前 也就是右根左的搜索顺序
 */
function kthLangest(root, k) {
    let count = k
    let res
    const dfs = (root) => {
        if (!root) {
            return 
        }
        dfs(root.right)
        if (--count === 0) {
            res = root.val
            return 
        }
        dfs(root.left)
    }
    dfs(root)
    return res
}

//给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

// 叶子节点 是指没有子节点的节点。

/**
 * 回溯法
 * 边界条件判断 - 搜索越界
 * 记录路径
 * 判断路径是否满足
 * 递归进行
 * 撤销路径选择
 */

function psthSum(root, target) {
    const res = []
    const trace = []
    const dfs = (root, target) => {
        if (!root) return
        // 每搜索一个节点 目标值就减去该节点的值
        target -= root.val
        // 记录该节点的值
        trace.push(root.val)
        // 如果到了叶子节点 目标值正好减没了 就说明这条路径是要找的
        if (!target && !root.left && !root.right) {
            // 这里为什么要复制一份trace 因为之后还要修改这个trace 如果直接把trace给res的话  那么之后修改trace 也会影响到给到res的那个值
            res.push(trace.slice())
        }
        // 分别递归左右子树
        dfs(root.left, target)
        dfs(root.right, target)
        // 撤销路径的选择
        trace.pop()
    }
    dfs(root, target)
    return res
}
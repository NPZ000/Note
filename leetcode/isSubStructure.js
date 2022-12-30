/**
 * 输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)
 * B是A的子结构， 即 A中有出现和B相同的结构和节点值。
 */
/**
 * 如果是的条件
 * 1. 先从两颗树的根节点开始递归遍历 
 * 2. 如果根节点不同 就拿A的left子树的根节点或者right子树的根节点和B的根节点比较 此时就又回到了条件1 的判断逻辑
 * 
 * 这里需要用两层递归 
 * 外层递归用来在 A 里面找出和 B 的根节点相同的那个节点
 *  每层递归进来后都会从当前树的根节点开始和B进行比较 如果不行则用左子树比较或者右子树比较
 * 找到之后就用内层的递归从A中找到的那个节点和 B 的根节点开始同时向下搜索
 * 内层递归的边界条件为
 *  首先判断 如果搜索 B 越界 说明在 A 中找到了和他同样的结构 则直接返回true
 *  然后判断搜索 A 是否越界 如果越界说明没有在 A 中找到和 B 相同的结构 则返回false
 *  再判断当前比较的两颗树中对应的节点的值如果不同 则返回false
 * 如果要完全相等则需要左子树和右子树都相等 所以要分别递归判断两颗树的左右子树 并且用 & 连接
 */

function isSubStructure(A, B) {
    // 首先边界条件 如果 A 或者 B 有一个是空的 都可以直接返回 false
    if (A === null) return false
    if (B === null) return false
    const recur = (A, B) => {
        if (!B) return true

        if (!A || A.val !== B.val) return false

        return recur(A.left, B.left) && recur(A.right, B.right)
    }

    // 在  A 和 B 都不为空的情况下（这就相当于是外层递归的边界条件）必须得显示的判断 ！== null
    // 首先从 A 的根节点开始和 B 的根节点判断 这里是调用了内层的递归方法
    // 如果返回了 false，再继续用 A 的 left 和 Right 和 B 做比较，这样就相当于又回到了最开始的时候，所以还是要先调用最外层的递归先来判断 两个根节点是否都存在
    return recur(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
}
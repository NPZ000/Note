// 输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

/**
 * 要求是一个排序的列表 所以需要对二叉树进行中序遍历 因为中序遍历（左 根 右）的结果就是递增的
 *        4
 *      /  \
 *     2    5
 *    / \
 *  1    3
 * 对于此树 中序遍历的结果是 1 2 3 4 5
 * 要生成的双向链表为 各个树相互用left和right连接  最后 1 的 left 是 5， 5 的 right 是 1
 */

function treeToDoublyList(root) {
    if (!root) return null
    // 初始化一个头节点  这个头节点要指向树中最小的元素
    let head = new Node()
    // 这个用来保存上一个节点
    let pre = null
    const dfs = root => {
        if (!root) return
        // 递归左子树
        dfs(root.left)
        if (pre) {
            // 如果当前节点的上一个节点存在 那么上一个节点和当前节点需要互相用 left 和 right 指一下
            pre.right = root
            root.left = pre
        } else {
            // 如果当前节点不存在上一个节点  说明这就是第一个节点 直接保存在头节点中 最后要返回这个
            head = root
        }
        // 当前节点设置为上一个节点
        pre = root
        // 递归右子树
        dfs(root.right)
    }
    dfs(root)
    // 递归结束之后 pre 指向的就是最后一个节点了
    //  然后需要和头节点 head 互相指向一下
    head.left = pre
    pre.right = head
    return head
}
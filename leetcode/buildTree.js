/**
 * 重建二叉树
 * 输入某二叉树的前序遍历和中序遍历的结果，请构建该二叉树并返回其根节点。
 * 假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
 * Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * Output: [3,9,20,null,null,15,7]
 */

/**
 * 
 * @param {前序遍历的数组} preorder 
 * @param {中序遍历的数组} inorder 
 * 解题思路：
 * 前序遍历的数组中，第一项就是树的根节点
 * 中序遍历的数组中，根节点的左边是左子树，右边是右子树
 * 所以我们可以在前序遍历的数组中拿到已知的根节点，然后在中序遍历的数组中找到他，
 * 然后就可以在中序遍历的数组中划分出左右子树，现在就可以得到左子树的节点的个数，
 * 然后根据左子树节点的个数就可以在前序遍历的数组中划分出左右子树
 * 两个数组互相配合就可以拿到左右子树，然后拼接到根节点的 left 和 right 上
 * 递归执行这个过程
 * 在中序遍历的数组中找根节点的位置时，可以事先使用一次遍历，把数组的每一项的值和对应的索引映射到一个 map 上，
 * 之后就可以直接根据值拿到索引，就不用每次都去遍历了
 */

function buildTree(preorder, inorder) {
    const nodeMap = new Map()
    for (let i = 0; i < inorder.length; i++) {
        nodeMap.set(inorder[i], i)
    }

    /**
     * 
     * @param {前序遍历的左边界} preorderLeft 
     * @param {前序遍历的右边界} preorderRight 
     * @param {中序遍历的左边界} inorderLeft 
     * @param {中序遍历的右边界} inorderRight 
     * 递归函数
     * 需要这四个参数来确定前序遍历和中序遍历的数组
     */
    const myBuild = (preorderLeft, preorderRight, inorderLeft, inorderRight) => {
        // 递归函数一定要有终止条件 要不然就会死循环
        // 这里的终止条件是 前序遍历的数组左边界越过了右边界
        if (preorderLeft > preorderRight) {
            return null
        }
        // 确定根节点 就是前序遍历的第一项
        const root = preorder[preorderLeft]

        // 在中序遍历的数组中找到根节点的位置
        const rootInorder = nodeMap.get(root)

        // 根据根节点在中序遍历数组中的位置确定左子树的节点的个数
        const leftTreeLen = rootInorder - inorderLeft

        // 生成根节点
        const rootNode = new TreeNode(root)

        // 递归的构造左子树
        // 前序遍历中：左边界 + 1 到左边界加上左子树节点的个数就是前序遍历中的左子树也是新的前序遍历的数组
        // 中序遍历中： 左边界到根节点的位置 - 1就是中序遍历中的左子树，也是新的中序遍历的数组
        rootNode.left = myBuild(preorderLeft + 1, preorderLeft + leftTreeLen, inorderLeft, rootInorder - 1)
        // 构造右子树同理
        rootNode.right = myBuild(preorderLeft + leftTreeLen + 1, preorderRight, rootInorder + 1, inorderRight)
        return rootNode
    }

    let len = preorder.length
    return myBuild(0, len - 1, 0, len - 1)
}

function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}
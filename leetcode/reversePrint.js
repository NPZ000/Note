// 从头到尾打印链表
console.time('time')
function reverseList(head) {
    if (!head) return []
    // 这里concat传入数组的执行用时比传入值的用时快
    return reverseList(head.next).concat(head.val)
}
reverseList([1,2,3,4,5])
console.timeEnd('time')

// console.time('time')
// let arr = []
// arr = arr.concat(1)
// arr = arr.concat(1)
// arr = arr.concat(1)
// arr = arr.concat(1)
// arr = arr.concat(1)
// arr = arr.concat(1)
// console.timeEnd('time')

Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

//前序遍历是根左右 中序遍历是左根右
// 先建立一个中序遍历数组的哈希表  方便之后可以直接根据值找到索引
// 然后前序遍历
function buildTree(preorder, inorder) {
    if (!preorder.length) return
    const inorderMap = {}
    inorder.forEach((item, index) => {
        inorderMap[item] = index
    })
    const fn = (preLeft, preRight, inLeft, inRight) => {
        if (preLeft > preRight) return null
        const root = preorder[preLeft]
        const rootNode = new TreeNode(root)
        const rootIndex = inorderMap[root]
        const leftTreeLen = rootIndex - inLeft
        rootNode.left = fn(preLeft + 1, preLeft + leftTreeLen, inLeft, rootIndex - 1)
        rootIndex.right = fn(preLeft+ leftTreeLen + 1, preRight, rootIndex + 1, inRight)
        return rootNode
    }
    return fn(0, preorder.length - 1, 0, inorder.length - 1)
}
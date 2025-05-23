*** 二叉树 ***
## 二叉树的遍历方式
### 深度优先遍历
- 前序遍历： 中左右
- 中序遍历： 左中右
- 后序遍历： 左右中
中间节点在哪个位置就是什么序
```js
// 树节点实例
function TreeNode (val, left, right) {
    this.val = val !== undefined ? val : 0
    this.left = left !== undefined ? left : null
    this.right = right !== undefined ? right : null
}
```
#### 前序遍历-递归法
```js
var preorderTraversal = function(root) {
    const res = []
    function dfs(node, res) {
        // 终止条件
        if (node === null) return
        res.push(node.val)   // 中
        dfs(node.left, res)  // 左
        dfs(node.right, res) // 右
    }
    dfs(root, res)
    return res
};
```
#### 中序遍历
```js
var inorderTraversal = function(root) {
    const res = []
    function dfs(node, res) {
        if (node === null) return
        dfs(node.left, res)
        res.push(node.val)
        dfs(node.right, res)
    }
    dfs(root, res)
    return res
};
```
#### 后序遍历
```js
var postorderTraversal = function(root) {
    const res = []
    function dfs(node, res) {
        if (node === null) return
        dfs(node.left, res)
        dfs(node.right, res)
        res.push(node.val)
    }
    dfs(root, res)
    return res
};
```
#### 前序遍历-迭代法
            1
          /   \
        2       3
      /   \   /   \
     4     5 6     7 
```js
var preorderTraversal = function(root) {
    const res = []
    if (root === null) return res
    const stack = [root]
    while (stack.length) {
        const node = stack.pop()   // -> 1
        res.push(node.val)         // res = [1]
        // 先进后出 所以先进右
        node.right && stack.push(node.right) // stack = [3]
        node.left && stack.push(node.left)   // stack = [3, 2]
    }
    return res
};
```
#### 中序遍历-迭代法
            1
          /   \
        2       3
      /   \   /   \
     4     5 6     7 
不能用前序遍历的写法，因为前序遍历，处理节点的顺序和代码逻辑是一样的，先中后左右，而中序遍历，第一个要处理的节点是最左边的节点，所以需要用先走到最左边，用一个指针往左走
先走到最左边，只有还有左节点就会一直进去第一个if语句，直到没有左节点，此时stack中的元素为[1, 2, 4], 然后下一轮循环进到else中，先把4弹出来，push到res中，然后指针指向4的右节点，因为4其实也是个中间节点，他没有左节点了，但是可能还有右节点，这里4没有右节点了，所以下一轮循环，还是走到else中，现在栈中为[1, 2],现在把 2 弹出来，加到res中，然后指针指向2的right->5, 
```js
var inorderTraversal = function(root) {
    const res = []
    if (root === null) return res
    const stack = []
    let cur = root
    while (cur !== null || stack.length) {
        if (cur !== null) {
            // 一直往左走 走到头
            stack.push(cur)
            cur = cur.left
        } else {
            // 然后是中和右
            cur = stack.pop() // 中
            res.push(cur.val)
            cur = cur.right // 右
        }
    }
    return res
};
```
#### 后序遍历-迭代法
            1
          /   \
        2       3
1先入res,然后是 2入栈 3入栈，然后3出栈入res，然后2出栈入res， res = [1,3,2], 最后反转一下，[2,3,1]
```js
var postorderTraversal = function(root) {
    const res = []
    if (root === null) return []
    const stack = [root]
    while (stack.length) {
        const node = stack.pop()
        res.push(node.val)
        node.left && stack.push(node.left)
        node.right && stack.push(node.right)
    }
    return res.reverse()
};
```
### 广度优先遍历
            1
          /   \
        2       3
      /   \   /   \
     4     5 6     7 
#### 二叉树的层序遍历
```js
var levelOrder = function(root) {
    const res = []
    if (!root) return res
    const stack = [root]
    while (stack.length) {
        const temp = []
        for (let i = stack.length - 1; i >= 0; i--) {
            const node = stack.pop()
            temp.push(node.val)
            node.left && stack.unshift(node.left)
            node.right && stack.unshift(node.right)
        }
        res.push(temp)
    }
    return res
};
```
#### 二叉树的右视图
            1
          /   \
        2       3
      /   \   /   \
     4     5 6     7 
只返回 1 3 7
```js
var rightSideView = function(root) {
    if (!root) return []
    const res = []
    const stack = [root]
    while(stack.length) {
        const temp = []
        for (let i = stack.length - 1; i >= 0; i--) {
            const node = stack.pop()
            temp.push(node)
            node.left && stack.unshift(node.left)
            node.right && stack.unshift(node.right)
        }
        // 每次只收集最右边的即可
        res.push(temp.at(-1).val)
    }
    return res
};
```
#### 二叉树的层平均值
```js
var averageOfLevels = function(root) {
    if (!root) return []
    const res = []
    const st = [root]
    while (st.length) {
        let sum = 0
        const len = st.length
        for (let i = len - 1; i >= 0; i--) {
            const node = st.pop()
            sum += node.val
            node.left && st.unshift(node.left)
            node.right && st.unshift(node.right)
        }
        // 求平均值
        res.push(sum / len)
    }
    return res
};
```
#### N叉树的层序遍历
            1
        /  ｜  \
       2   4   3
```js
var levelOrder = function(root) {
    if (!root) return []
    const res = []
    const st = [root]
    while (st.length) {
        const temp = []
        for (let i = st.length - 1; i >= 0; i--) {
            const node = st.pop()
            temp.push(node.val)
            // 遍历每个节点的子节点
            if (Array.isArray(node.children)) {
                node.children.forEach(child => st.unshift(child))
            }
        }
        res.push(temp)
    }
    return res
};
```
#### 填充每一个节点的右侧节点指针
            1 --> null
          /   \
        2 ---> 3 --> null
      /   \   /   \
     4---> 5->6-->7 --> null
```js
function connect(root: _Node | null): _Node | null {
    if (!root) return null
    const res = []
    let st = [root]
    while (st.length) {
        let preNode
        const len = st.length
        const temp = []
        // 这里需要正着遍历 保证next的指向  但是正着遍历如果对数组中的元素进行增删操作 索引会错乱
        // 所以把每个节点的左右节点收集在一个临时数组中 最后更新到st中
        for (let i = 0; i < len; i++) {
            if (i === 0) {
                // 记录每层的头节点/上一个节点
                preNode = st[i]
            } else {
                // 上一个节点的next指向当前节点
                preNode.next = st[i]
                // 更新上一个节点的指针为当前节点
                preNode = st[i]
            }
            st[i]?.left && temp.push(st[i].left)
            st[i]?.right && temp.push(st[i].right)
        }
        st = temp
        preNode.next = null
    }
    return root
};

// 更简单的写法 直接操作队列 不操作索引 就不用操心索引会错乱的问题了 注意要固定循环次数
function connect(root: _Node | null): _Node | null {
    if (!root) return null
    const res = []
    let st = [root]
    while (st.length) {
        let preNode
        const len = st.length
        for (let i = 0; i < len; i++) {
            const node = st.shift()
            if (preNode) preNode.next = node
            preNode = node 
            node.left && st.push(node.left)
            node.right && st.push(node.right)
        }
        preNode.next = null
    }
    return root
};
```
#### 二叉树的最大深度
```js
function maxDepth(root: TreeNode | null): number {
    if (!root) return 0
    const st = [root]
    let count = 0
    while (st.length) {
        count++
        const len = st.length
        for (let i = 0; i < len; i++) {
            const node = st.shift()
            node.left && st.push(node.left)
            node.right && st.push(node.right)
        }
    }
    return count
};
```
#### 二叉树的最小深度
当叶子结点没有左右节点的时候就是到底了
```js
function minDepth(root: TreeNode | null): number {
    if (!root) return 0
    let count = 0
    const st = [root]
    while (st.length) {
        const len = st.length
        count++
        for (let i = 0; i < len; i++) {
            const node = st.shift()
            if (!node.left && !node.right) {
                return count
            }
            node.left && st.push(node.left)
            node.right && st.push(node.right)
        }
    }
    return count
};
```
#### 翻转二叉树
在遍历过程中 交换节点的left和right 即可
```js
function flipTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null
    const st = [root]
    while (st.length) {
        const len = st.length
        for (let i = 0; i < len; i++) {
            const node = st.shift()
            const temp = node.left
            node.left = node.right
            node.right = temp
            node.left && st.push(node.left)
            node.right && st.push(node.right)
        }
    }
    return root
};
```
#### 判断是否是对称二叉树
            1
          /   \
        2       2
      /   \   /   \
     4     5 5     4
思路： 需要分别对比内层的两个节点和外层的两个节点，比如这里的两个5和两个4，内外层均相等才表示是对称的
递归过程中，跳出的条件有三种情况
    - 比较的两个节点均为null 表示到了最底层，就返回true
    - 一个节点有值 一个节点没值 直接返回false
    - 两个节点的值不相等 直接返回false
如果在向下过程中命中第二三种情况，就会返回false，如果命中了第一种情况，说明中间都是对称的，就可以返回false了
要分别拿两个节点的内层比较结果和外层比较结果  都为true 最后结果才为true
```js
// 递归解法
function checkSymmetricTree(root: TreeNode | null): boolean {
    if (!root) return true
    const compare = (left, right) => {
        // 都为空就返回true
        if (!left && !right) {
            return true
        } else if (left && !right) {
            // 只有一边有值 返回false
            return false
        } else if (!left && right) {
            return false
        } else if (left.val !== right.val ) { 
            // 值不相等  返回false
            return false
        }
        // 分别比较内层和外层
        const out = compare(left.left, right.right)
        const inside = compare(left.right, right.left)
        return out && inside
    }
    return compare(root.left, root.right)
};

// 迭代栈解法
function foo(root) {
    if (!root) return true
    const st = [root.left, root.right]
    while (st.length) {
        // 成对取出判断
        const left = st.shift()
        const right = st.shift()
        if (!left && !right) continue // 这里注意continue  要不然会死循环
        if (left?.val !== right?.val || !left && right || left && !right) {
            return false
        }
        // 成对放入 注意顺序
        st.push(left?.left)
        st.push(right?.right)
        st.push(left?.right)
        st.push(right?.left)
    }
    return true
}
```
#### 二叉树的节点个数
```js
// 递归解法
function countNodes(root: TreeNode | null): number {
    if (!root) return 0
    const getNum = (root) => {
        if (!root) return 0
        const left = getNum(root.left)

        const right = getNum(root.right)
        return left + right + 1
    }
    return getNum(root)
};
```
#### 判断是否是平衡二叉树
左右子树高度的值相减，绝对值不大于1，就是平衡二叉树
在计算左右子树的高度时，如果其中某一个子树确定不是平衡二叉树了 就直接返回-1标识一下，之后判断是-1就直接返回，不再计算高度
```js
function isBalanced(root: TreeNode | null): boolean {
    if (!root) return true
    const getHeight = (root) => {
        if (!root) return 0
        // 左边的高度
        const leftHeight = getHeight(root.left)
        // 不是平衡树 直接返回-1标识
        if (leftHeight === -1) return -1
        // 右边的高度
        const rightHeight = getHeight(root.right)
        // 不是平衡二叉树 直接返回-1 不再计算左右的高度差
        if (rightHeight === -1) return -1
        // 先判断高度差是否大于1  为true直接返回0-1 否则就返回直接高度
        return Math.abs(leftHeight - rightHeight) > 1 ? -1 : (1 + Math.max(leftHeight, rightHeight))
    }
    return getHeight(root) !== -1
};
```

### 二叉树的所有路径
回溯法 前序遍历
```js
var binaryTreePaths = function(root) {
    if (!root) return []
    const getPath = (root, path, res) => {
        // 中 添加当前节点到路径
        path.push(root.val);
        // 如果到了叶子结点 就把当前路径push到结果中
        if (!root.left && !root.right) {
            const sPath = path.join('->')
            res.push(sPath)
        }
        // 往左边走
        if (root.left) {
            getPath(root.left, path, res)
            // 出来之后要删除添加过的路径
            path.pop()
        }
        // 同理
        if (root.right) {
            getPath(root.right, path, res)
            path.pop()
        }
    }
    const res = []
    const path = []
    getPath(root, path, res)
    return res
};
// 遍历栈写法
//     1
//   /   \
// 2      3
function foo(root) {
    const res = []
    const treeSt = [root] // [1]
    const pathSt = [root.val.toString()] // [1]
    while (treeSt.length) {
        const node = treeSt.pop() // 1
        const path = pathSt.pop() // 1
        if (!node.left && !node.right) {
            res.push(path)
        }
        if (node.left) {
            treeSt.push(node.left) // [2]
            pathSt.push(`${path}->${node.left.val}`) // ['1->2']
        }
        if (node.right) {
            treeSt.push(node.right) // [2, 3]
            pathSt.push(`${path}->${node.right.val}`) // ['1->3']
        }
    }
    return res
}
```
### 二叉树的左叶子之和
当a节点的左节点b不为空，且左节点b的左节点和右节点为空，那么左节点b就是左叶子
这个b节点是不是左页面必须由他的父节点来判断，因为只有他的父节点知道他是一个左节点
            1
          /   \
        2       2
      /   \   /   \
     4     5 6     7
4 和 6 是左叶子
```js
var sumOfLeftLeaves = function(root) {
    if (!root) return 0
    // 如果已经走到叶子节点了 就直接返回0 这个时候已经不可能再有左叶子了
    if (!root.left && !root.right) return 0
    let leftVal = sumOfLeftLeaves(root.left) // 左
    // 如果左子树就是左叶子就直接取值
    if (root.left && !root.left.left && !root.left.right) {
        leftVal = root.left.val
    }
    const rightVal = sumOfLeftLeaves(root.right) // 右
    return leftVal + rightVal // 中
};
// 迭代法 更简单
function foo() {
    if (!root) return 0
    let res = 0
    const st = [root]
    while (st.length) {
        const node = st.pop()
        if (node.left && !node.left.left && !node.left.right) {
            res += node.left.val
        }
        node.left && st.push(node.left)
        node.right && st.push(node.right)
    }
    return res
}
```
### 二叉树的路径总和
给定⼀个⼆叉树和⼀个⽬标和，判断该树中是否存在根节点到叶⼦节点的路径，这条路径上所有节点值相加等于⽬
标和。
目标和从上往下递减
```js
var hasPathSum = function(root, targetSum) {
    const count = (root, target) => {
        if (!root.left && !root.right) {
            // 到叶子节点判断 target是不是递减完了 
            return target === 0
        } 
        // 不判断空节点
        if (root.left) {
            // 递减
            target -= root.left.val
            // 左边 到头了 就直接返回true
            if (count(root.left, target)) return true
            target += root.left.val // 回溯
        }
        if (root.right) {
            target -= root.right.val
            if (count(root.right, target)) return true
            target += root.right.val
        }
        // 左右都没有到头 就返回 false
        return false
    }
    if (!root) return false
    return count(root, targetSum - root.val)
};
// 换个写法 不用手动回溯
// 手动回溯的代码 增加复杂度 也增加理解成本
var hasPathSum = function(root, targetSum) {
    const count = (root, target) => {
        if (!root) return 
        target -= root.val // 直接在这减 剪完判断到当前节点是不是已经到底了
        if (!root.left && !root.right) {
            // 到叶子节点判断 target是不是递减完了 
            return target === 0
        } 
        // 不判断空节点
        // 左右用的target 互不影响  也不会影响上层的
        if (root.left) {
            // 左边 到头了 就直接返回true
            if (count(root.left, target)) return true
        }
        if (root.right) {
            if (count(root.right, target)) return true
        }
        // 左右都没有到头 就返回 false
        return false
    }
    if (!root) return false
    return count(root, targetSum)
};
```
### 求二叉树中所有节点和等于指定总和的路径
            1
          /   \
        2       1
      /   \   /   \
     4     5 6     7
节点和等于8的路径
1-2-5  1-1-6
```js
var pathSum = function(root, targetSum) {
    if (!root) return []
    const res = []
    const dfs = (root, target) => {
        // 边界条件 到了叶子节点
        if (!root.left && !root.right) {
            // target减完了 这条路径就加入到结果中去
            if (target === 0) {
                // 注意这里要复制一份path 不能直接把path放进去，因为后面还会修改path的值
                res.push(path.slice(0))
            }
            // 到了叶子节点 这里要返回
            return
        }
        // 只处理非空节点
        if (root.left) {
            // 减一下当前节点的值
            target -= root.left.val
            // 加一下当前节点到path
            path.push(root.left.val)
            dfs(root.left, target)
            target += root.left.val // 回溯
            path.pop() // 回溯
        }
        if (root.right) {
            target -= root.right.val
            path.push(root.right.val)
            dfs(root.right, target)
            target += root.right.val
            path.pop()
        }
        return
    }
    const path = [root.val]
    dfs(root, targetSum - root.val)
    return res
};
// 换一种写法
/**
 * target 还是一进来就减 分别传给左右，就无需再手动回溯，
 * 其实path也可以这样，如果不想手动回溯，就得每次传递新的数组给下一层，因为数组是按引用传递的，所以还传旧的就会导致当层修改影响上一层
 * 但是每次传递新的数组会增加内存消耗 所以path还是手动回溯一下，不过这里我是在dfs的最上面就更新了path，所以回溯的代码是应该在左右都处理完之后
 * 这样的代码 还是比上面的简单点
 */
function pathTarget(root: TreeNode | null, target: number): number[][] {
    const res = []
    const dfs = (node, target, path) => {
        if (!node) return
        path.push(node.val)
        target -= node.val
        if (!node.left && !node.right && target === 0) {
            res.push(path.slice(0))
        }
        if (node.left) {
            dfs(node.left, target, path)
        }
        if (node.right) {
            dfs(node.right, target, path)
        }
        path.pop()
    }
    dfs(root, target, [])
    return res
};
```
### 根据中序遍历和后序遍历重建二叉树
后序遍历的最后一个值是根节点，
用这个节点值生成根节点
找到这个根节点在中序的位置，他的左边就是左子树，右边就是右子树
再根据左子树的长度，找到后序中的左子树，同理找到右子树
将划分好的左右子树 再次递归
根节点的左子树就是中序和后序里的左子树再次递归的结果
右子树同理
*核心思想*就是先找到根节点，然后根据中序和后序的排序特性利用根节点互相划分出左右子树
dfs的参数直接传递中序和后序的新数组，这样好理解，代码看起来也简单，但是因为每次都生成新数组，会增加内存的消耗，
如果不想每次传递新数组，就需要传递新的中序数组在原始中序数组中的开始和结束索引，后序也是同理，每次用索引去原始数组中截取
但是这样就增加了代码复杂度和理解成本 以及边界条件要改为前后索引相撞
**所有的构造二叉树都是这个思路**
```js
var buildTree = function(inorder, postorder) {
    const dfs = (inorderList, postorderList) => {
        // 边界条件 中序和后序的数组为空 直接返回null
        if (!inorderList.length && !postorderList.length) return null
        // 后序遍历的最后一个是根节点
        const rootVal = postorderList.at(-1)
        const rootNode = new TreeNode(rootVal)
        // 如果当前中序和后序的数组只有一个元素  那么这个元素就是叶子结点  直接返回
        if (inorderList.length === 1 && postorderList.length === 1) return rootNode
        // 根节点在中序的位置
        const rootInInOrder = inorderList.findIndex(v => v === rootVal)
        // 中序里的左子树
        const leftByInorder = inorderList.slice(0, rootInInOrder)
        // 中序里的右子树
        const rightByInorder = inorderList.slice(rootInInOrder + 1)
        // 后序里的左子树
        const leftByPostorder = postorderList.slice(0, left.length)
        // 后序里的右子树
        const rightByPostorder = postorderList.slice(left.length, -1)
        rootNode.left = dfs(leftByInorder, leftByPostorder)
        rootNode.right = dfs(rightByInorder, rightByPostorder)
        return rootNode
    }
    if (!inorder.length) return null
    return dfs(inorder, postorder)
};
```
### 根据前序和中序构建二叉树
前序的第一个就是根节点
生成根节点
如果当前前序和中序只有一个值，那么这个节点就是叶子节点  直接返回
找出根节点在中序的位置，划分出左右子树
再根据左右子树的长度在前序里划分出左右子树
再递归处理划分出来的左右子树
```js
var buildTree = function(preorder, inorder) {
    const dfs = (preorderList, inorderList) => {
        if (!preorderList.length && !inorderList.length) return null
        const rootVal = preorderList[0]
        const rootNode = new TreeNode(rootVal)
        if (preorderList.length === 1 && inorderList.length === 1) return rootNode
        const rootIndexInInorder = inorderList.findIndex(v => v === rootVal)
        const leftByInOrder = inorderList.slice(0, rootIndexInInorder)
        const rightByInOrder = inorderList.slice(rootIndexInInorder + 1)
        const leftByPreorder = preorderList.slice(1, leftByInOrder.length + 1)
        const rightByPreorder = preorderList.slice(leftByInOrder.length + 1)
        rootNode.left = dfs(leftByPreorder, leftByInOrder)
        rootNode.right = dfs(rightByPreorder, rightByInOrder)
        return rootNode
    }
    if (!preorder.length) return null
    return dfs(preorder, inorder)
};
```
### 构建最大二叉树
给定一个不重复的整数数组 nums 。 最大二叉树 可以用下面的算法从 nums 递归地构建:

创建一个根节点，其值为 nums 中的最大值。
递归地在最大值 左边 的 子数组前缀上 构建左子树。
递归地在最大值 右边 的 子数组后缀上 构建右子树。
返回 nums 构建的 最大二叉树 。

和上面两个构建的思路差不多，不过这次简单点，可以直接找最大节点，左边是左子树，右边是右子树，然后再递归处理就行了
```js
var constructMaximumBinaryTree = function(nums) {
    if (!nums.length) return null
    // 找最大值和对应索引
    const findMax = list => {
        let maxVal = 0
        let maxIndex
        list.forEach((item, index) => {
            if (item > maxVal) {
                maxVal = item
                maxIndex = index
            }
        })
        return [maxVal, maxIndex]
    }
    const dfs = list => {
        if (!list.length) return null
        if (list.length === 1) {
            const node = new TreeNode(list[0])
            return node
        }
        const [maxVal, maxIndex] = findMax(list)
        // 最大值生成根节点
        const rootNode = new TreeNode(maxVal)
        // 用根节点索引划分左右子树
        rootNode.left = dfs(list.slice(0, maxIndex))
        rootNode.right = dfs(list.slice(maxIndex + 1))
        return rootNode
    }
    return dfs(nums)
};
```
### 根据前序构造二叉搜索树
前序的第一个节点的是根节点，然后在后面找比他大的都是他的右子树 反之都是左子树
要注意的是 可能后面根本没有比他大的
```js
var bstFromPreorder = function(preorder) {
    const dfs = list => {
        if (!list.length) return null
        const root = new TreeNode(list[0])
        if (list.length === 1) return root
        const rightFirst = list.findIndex(v => v > list[0])
        root.left = dfs(list.slice(1, rightFirst > 0 ? rightFirst : undefined))
        rightFirst > 0 && (root.right = dfs(list.slice(rightFirst)))
        return root
    }
    return dfs(preorder)
};
```
### 将有序数组转换为二叉搜索树
将⼀个按照升序排列的有序数组，转换为⼀棵⾼度平衡⼆叉搜索树。
还是和上面的一样的思路，找到根节点的位置，然后划分左右子树
这里说了要高度平衡，也就是说左边的和右边的高度要一样，也就是说节点数要一致，从而保持平衡，这样的话，根节点值就只能最中间的了，如果数量是奇数，就直接取最中间的，如果是偶数，中间的两个都可以是根节点，然后根节点左边的就是左子树，右边的就是右子树
```js
var sortedArrayToBST = function(nums) {
    if (!nums.length) return null
    const middleIndex = Math.floor(nums.length/2)
    const rootVal = nums[middleIndex]
    const rootNode = new TreeNode(rootVal)
    if (nums.length === 1) return rootNode
    rootNode.left = sortedArrayToBST(nums.slice(0, middleIndex))
    rootNode.right = sortedArrayToBST(nums.slice(middleIndex + 1))
    return rootNode
};
```
### 合并两个二叉树
想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

注意: 合并过程必须从两个树的根节点开始。

- 思路
用前序遍历，边界条件是当其中一方为null，就返回另一方
都不为空就把值相加 累加到第一棵树的节点上
然后递归处理左右子树
```js
var mergeTrees = function(root1, root2) {
    if (!root1) return root2
    if (!root2) return root1
    root1.val += root2.val
    root1.left = mergeTrees(root1.left, root2.left)
    root1.right = mergeTrees(root1.right, root2.right)
    return root1
};
```
### 二叉搜索树中的搜索
搜索树，左边的节点都比根节点小，右边的节点都比根节点大
```js
var searchBST = function(root, val) {
    // 找到目标节点了 就直接返回
    if (!root || root.val === val) return root
    // 如果当前节点的值比目标值大 那么目标节点一定在左边
    if (val < root.val) return searchBST(root.left, val)
    // 反之在右边
    if (val > root.val) return searchBST(root.right, val)
    // 最后记得找不到要返回null
    return null
};

// 迭代法
function foo(root, val) {
    while (root) {
        if (root.val === val) return root
        if (val < root.val) {
            root = root.left
        } else if (val > root.val) {
            root = root.right
        } else {
            // 这里必须返回  是找不到节点的情况
            return null
        }
    }
}
```
### 验证是否是二叉搜索树
中序遍历的结构是有序的！
用中序遍历 先走到最左边的节点，然后左中右的顺序往右走，一定是从小到大的
定义一个pre节点 然后用当前节点的值和pre的值比较，如果pre的值大于等于当前节点的值了 就直接返回false
这里可能一开始的思路是直接比较左右两个节点，但是这样是不对的，因为二叉搜索树的要求是左子树所有的节点都要比根节点小，所以这个错误思路有可能误判，比如左子树中有一个左节点比他的父节点小 但是却比根节点的值大，这个错误思路是判断不出来的
```js
var isValidBST = function(root) {
    let pre = null
    const dfs = node => {
        if (node === null) return true
        const left = dfs(node.left) // 左
        // 如果左子树返回false了 就直接返回false
        if (!left) return false
        if (pre && pre.val >= node.val) return false // 中
        pre = node 
        const right = dfs(node.right)  // 右
        return right // 左右都是搜索树 这个树才是搜索树
    }
    return dfs(root)
};
```
### 二叉搜索树的最小绝对差
二叉搜索树按照左中右的顺序就是一个从小到大的有序数组
求一个有序数组中任意两个数的最小差，相邻的两个数差值最小，所以直接遍历，每次只计算相邻两个值的差，取最小值即可
```js
var getMinimumDifference = function(root) {
    let res = Number.MAX_VALUE
    let pre // 记录上一个节点
    const dfs = node => {
        if (!node) return 
        dfs(node.left) // 左
        if (pre) {
            // 更新最小值
            res = Math.min(res, node.val - pre.val) // 中
        }
        pre = node // 更新上一个节点
        dfs(node.right) // 右
    }
    dfs(root)
    return res
};
```
### 二叉搜索树中的众数
出现次数最多的节点
因为二叉搜索树的节点值按中序排列是有序的，所以相同的值肯定都是挨着的
就可以按照中序遍历的顺序 用前一个节点的值和当前值比较
```js
var findMode = function(root) {
    const res = []
    let maxCount = 0 // 记录最大次数
    let count = 0 // 记录相同节点出现的次数
    let pre  // 上一个节点
    const dfs = node => {
        if (!node) return
        dfs(node.left)
        if (!pre) {
            // 第一个节点 次数+1
            count++
        } else if (pre.val === node.val) {
            // 和上一个相同 次数+1
            count++
        } else {
            // 和上一个不同了 次数重制为1
            count = 1
        }
        // count 判断要放在外面，不要只在pre存在的时候判断 因为会有只有一个节点的情况
        if (count === maxCount) {
            // 出现次数和最大次数相同 加入到结果数组中
            res.push(node.val)
        }
            // 出现次数大于已知的最大次数
        if (count > maxCount) {
            // 更新最大次数
            maxCount = count
            // 清空结果数组
            res.length = 0
            // 放入
            res.push(node.val)
        }
        pre = node
        dfs(node.right)
    }
    dfs(root)
    return res
};
```
### 二叉搜索树的最近公共祖先
用后序遍历，左右中。
            1
          /   \
        2       1
      /   \   /   \
     4     5 6     7
找4和5的祖先，当走到2的时候，分别找他的左右，分别找到4和5之后 就向上返回，

```js
var lowestCommonAncestor = function(root, p, q) {
    const dfs = node => {
        // 边界条件一定要写
        if (!node) return 
        // 如果当前节点 的值是p或者q  就返回这个节点表示找到了
        if (node.val === p.val || node.val === q.val) {
            return node
        }
        const left = dfs(node.left) // 左
        const right = dfs(node.right) // 右
        // 如果在左右子树分别都找到了，这个节点就是他俩的最近公共祖先
        if (left && right) {
            return node
        }
        // 向上返回的情况 比如 在最后一层找到的 现在返回到了倒数第二层
        // 现在是在右边的子树，左边的子树返回了空，
        // 现在就是结果在哪边 就把哪边继续往上返回
        return left || right
    }
    return dfs(root)
};
```
### 在二叉搜索树中找两个节点的公共祖先
            4
          /   \
        2       6
      /   \   /   \
     1     3 5     7
如果要找1和3的祖先，当找到2的时候，判断2是在1和3中间的，那么2一定就是他俩的公共祖先
然后按照左小右大的前提，可以只查一边，比如查到6的时候，判断6比1 3都大，那么肯定是在左边，所以直接去左边查
如果哪边查到了，就可以直接返回了
```js
var lowestCommonAncestor = function(root, p, q) {
    const dfs = node => {
        if (!node) return 
        if (node.val > p.val && node.val < q.val) {
            return node
        }
        if (node.val > p.val && node.val > q.val) {
            const left = dfs(node.left)
            if (left) return left
        }
        if (node.val < p.val && node.val < q.val) {
            const right = dfs(node.right)
            if (right) return right
        }
        // 可能有当前节点就是p或者q之一的情况，此时这个节点就是最后的结果，且无法满足上面的条件 所以需要在这里返回
        return node
    }
    return dfs(root)
};
// 迭代法 还是上面的思路
var lowestCommonAncestor = function(root, p, q) {
    while (root) {
        if (root.val > p.val && root.val > q.val) {
            root = root.left
        } else if (root.val < p.val && root.val < q.val) {
            root = root.right
        } else {
            return root
        }
    }
    return null
};
```
### 二叉搜索树中的插入操作
            4
          /   \
        2       
      /   \   
     1     3     
插入6到4的右边
还是根据搜索树的特性 当前节点比插入的值大 就往左边走，反之去右边
```js
var insertIntoBST = function(root, val) {
    if (!root) return new TreeNode(val);
    if (root.val > val) {
        // 这里要注意 返回的节点要挂在left上
        root.left = insertIntoBST(root.left, val)
    }
    if (root.val < val) {
        root.right = insertIntoBST(root.right, val)
    }
    return root

};
```
### 删除二叉搜索树中的节点
 
这里要考虑不同的情况
          4
         /
        2       
          \   
           3  
删除节点2，当找到2的时候，判断他的left为空，right不为空，就把right3递补上来，直接返回3
          4
         /
        2       
      / 
    1
还是删除2，判断他的left不为空，right为空，就把left1递补上来，返回1
            2
          /   \
        1       7
              /   \
             5     9
            /  \  /  \
           4   6 8   10
删除7，现在7的左右都不为空，先看删除7之后，应该是什么样子
            2
          /   \
        1       9
              /   \
             8     10
            /    
           5  
         /   \
        4     6
如果要保持搜索树的要求，就应该是这个样子，把原来7的左子树挂在他的右子树的最左边的节点8的left下面，然后7的右子树递补到原来7的位置上
```js
var deleteNode = function(root, key) {
    if (!root) return null
    if (root.val === key) {
        // 左右都为空 
        if (!root.left && !root.right) return null
        // 右不为空
        if (!root.left && root.right) {
            return root.right
        } 
        // 左不为空
        if (root.left && !root.right) {
            return root.left
        }
        // 左右都不为空
        if (root.left && root.right) {
            let cur = root.right
            // 先找到右子树最左边的节点
            while (cur.left) {
                cur = cur.left
            }
            // 把原来的左子树挂在右子树最左边的节点下面
            cur.left  = root.left
            return root.right
        }
    }
    // 要删除的节点大于根节点就往左边找
    if (root.val > key) {
        // 一定要接住返回出来的节点 才能和外面串起来
        root.left = deleteNode(root.left, key)
    }
    if (root.val < key) {
        root.right = deleteNode(root.right, key)
    }
    return root
};
```
### 修剪二叉搜索树
给定一个范围，将树中不属于这个范围内的节点都去掉
            4
          /   \
        2       5
      /   \   
     1     3 
限定3-5，需要把1 2去掉
```js
var trimBST = function(root, low, high) {
    if (!root) return null
    // 如果当前节点小于最小边界的话 
    if (root.val < low) {
        // 这样可以返回右子树给外面对应的根节点接住
        return trimBST(root.right, low, high)
    }
    if (root.val > high) {
        return trimBST(root.left, low, high)
    }
    root.left = trimBST(root.left, low, high)
    root.right = trimBST(root.right, low, high)
    return root
};
```
### 把二叉搜索树转换为累加树
给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。
看似不简单，实际不太难
根据二叉搜索树的特点，左中右是升序的，反之是降序的，所以我们就按照右中左的顺序，逐个往前累加，并且更新节点的值
```js
var convertBST = function(root) {
    let pre = 0 // 用于累加
    const dfs = root => {
        if (!root) return 
        dfs(root.right) // 右
        root.val += pre // 累加值更新到当前节点上
        pre = root.val // 当前节点的值更新到累加值上
        dfs(root.left) // 左
    }
    dfs(root)
    return root
};
```

### 二叉树的直径
给你一棵二叉树的根节点，返回该树的 直径 。

二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。

两节点之间路径的 长度 由它们之间边数表示。
            4
          /   \
        2       5
      /   \   
     1     3 
直径为3，[1-2-4-5] [3-2-4-5]
思路：求两个节点的路径，只能通过他们的父节点来算，比如求1和3的路径，先求2-1，再求2-3，这样看的话，其实每个节点都对应着一条路径，题目是要求最长路径，那我们就算一下每个节点对应的那条路径，然后找一个最大值，然后求每个节点对应的那条路径，其实就是求左子树和右子树的深度和，然后当前节点作为上一级节点的左子树的时候，他的深度应该是max(left, right) + 1,因为这里要求最长的，所以肯定是要取最深的那一边
```js
function diameterOfBinaryTree(root: TreeNode | null): number {
    if (!root) return 0
    let max = 0
    const dfs = (root) => {
        if (!root) return 0
        const left = dfs(root.left)
        const right = dfs(root.right)
        // 当前节点对应的路径的长度
        const len = left + right + 1
        // 更新最大值
        max = Math.max(max, len)
        // 返回当前节点的深度 给上一级计算用
        return Math.max(left, right) + 1
    }
    dfs(root)
    return max - 1  // 为什么要减1，因为max算的是节点树，最后的结果是要边数，如果有三个节点，1-2-3，边数就是2
};
```

### 二叉树展开为链表
给你二叉树的根结点 root ，请你将它展开为一个单链表：

展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
展开后的单链表应该与二叉树 先序遍历 顺序相同。
            4
          /   \
        2       5
结果是
            4
              \
                2
                  \
                   5
用后序遍历的解法，但是顺序为右左中，相当于是倒着来，自底向上，看最后的结果也是这个顺序，从下到上就是右左中的顺序，从下往上的话，就需要记录一个pre节点，然后当前当前节点的right指向pre节点，然后记得要清空root节点的left
```js
function flatten(root: TreeNode | null): void {
    let pre
    const dfs = root => {
        if (!root) return null
        dfs(root.right) // 右
        dfs(root.left)  // 左
        if (pre) {
            root.right = pre // 中
        }
        pre = root
        root.left = null
    }
    dfs(root)
};
```
### 路径总和 III
给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。

路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
            4
          /   \
        2       5
      /   \   
     1     3 
targetNum为5，这里有两条 2-3， 5
因为路径可能不经过根节点，也可能不到叶子节点，所以不能直接从根节点向下，深度搜一遍完事，路径的起点可能是树中的每一个节点，所以我们要以每一个节点为路径的开始节点向下递归，计算最后的和
需要一个额外的递归方法计算每个节点的路径和，
```js
function pathSum(root, target) {
    const getSum = (root, num) => {
        if (!root) return 0
        let count = 0
        // 这里root等于target，已经算一条有效路径，为什么还要继续向下递归，因为下面的节点可能为负数或者0，可能父子孙也能形成有效路径
        if (root.val === num) count++ 
        const left = getSum(root.left, num - root.val)
        const right = getSum(root.right, num - root.val)
        return count + left + right
    }
    const dfs = root => {
        if (!root) return 0
        // 递归每个节点，将结果都加起来
        return getSum(root, target) + dfs(left, target) + dfs(right, target)
    }
    return dfs(root)
}
```
// 请实现 copyRandomList 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 next 指针指向下一个节点，还有一个 random 指针指向链表中的任意节点或者 null。

/**
 * 哈希表解法
 * 遍历旧链表
 * 按照旧链表中节点的值 生成新链表的节点
 * 并存在哈希表中 旧节点为key 新节点为value
 * 重新遍历旧链表 在哈希表中根据旧节点取出新节点 并取出旧节点的next和random设置到新节点上
 */

function copyRandomList(head) {
    const nodeMap = new Map()
    let cur = head
    // 生成新节点 并和旧节点一一对应放在map中
    while (cur) {
        const node = new Node(cur.val)
        nodeMap.set(cur, node)
        cur = cur.next
    }

    cur = head
    // 取出旧节点的 next 和 random 设置到对应的新节点上
    while(cur) {
        const newNode = nodeMap.get(cur)
        // 最后一个节点没有next 所以这里要判断一下是否有next
        newNode.next = cur.next ? nodeMap.get(cur.next) : null
        // 有的节点的random可能指向 null 所以这里要判断一下 random
        newNode.random = cur.random ? nodeMap.get(cur.random) : null
        cur = cur.next
    }

    return nodeMap.get(head)
}
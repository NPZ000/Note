/**
 * 反转链表
 * 递归解法
 * 因为要返回最后一个节点 所以要递归到最后一个节点 边界条件判断下一个节点是否为null 如果为null 就是最后一个节点 直接返回即可
 * 在回溯的过程中 反转节点的指向
 * 这里可以假设只有两层 1 - 2 
 * 我们要做的就是将 2 指向 1，1 指向 null，用代码表示就是 node1.next.next = node1, node1.next = null
 */
function revserseList(head) {
    // !head 是为了判断空链表的情况 
    // 如果是一个正常的链表 边界条件为 head.next 为 null 也就是说 head 为最后一个节点
    if (!head || !head.next) {
        return head
    }
    const node = revserseList(head.next)
    head.next.next = head
    head.next = null
    return node
}

/**
 * 双指针解法
 * 两个指针分别指向上一个节点和当前节点，然后进行反转
 * 反转完成之后 两个节点各自都向前走一步
 * 当下一个节点为null的时候 返回当前节点
 */

function revserse(head) {
    let pre = null, cur = head
    while (cur) {
        // 暂存下当前节点的下一个节点
        let temp = cur.next
        cur.next = pre
        pre = cur
        cur = temp
    }
    return pre
}
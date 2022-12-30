/**
 * 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。
 * 返回删除后的链表的头节点。
 */
/**
 * 
 * @param {head node} head 
 * @param {the value of the node to delete} val 
 * @returns head node
 * 定义两个变量 分别保存当前节点和下一个节点
 * 开启 while 循环 进入循环的条件为下一个节点还存在 
 * 循环体内判断下一个节点的值是否是要删除的节点的 
 * 如果是的话 当前节点的下一个节点指向下一个节点的下一个节点 然后就可以 break 了
 * 如果不是的话 分别都向前走一步 当前节点指向下一个节点 下一个节点指向他的下一个节点
 * 最后返回 head
 */
function delNode(head, val) {
    // 边界条件 如果头节点就是要删除的节点  那么直接返回头节点的下一个节点
    if (head.val === val) return head.next

    let cur = head, next = head.next
    while(next) {
        if (next.val === val) {
            cur.next = next.next
            break
        } else {
            cur = next
            next = next.next
        }
    }
    return head
}
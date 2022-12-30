/**
 * 合并两个排序的列表
 * 输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。
 * 返回的是新链表的头节点
 * 思路
 * 同时迭代两个链表
 * 每次循环比较两个链表中的当前节点 把小的那个挂在新链表上，然后选取了哪个链表的节点  哪个链表就往前走一步
 * 最后剩下的不管是哪个链表 都直接挂在新链表的尾部
 */

function mergeTwoList(headA, headB) {
    let head = new ListNode(-1)
    let cur = head
    while (headA && headB) {
        if (headA.val < headB.val) {
            cur.next = headA
            headA = headA.next
        } else {
            cur.next = headB
            headB = headB.next
        }
        cur = cur.next
    }
    cur.next = headA || headB
    return head.next
}
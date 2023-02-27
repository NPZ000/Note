// 两个链表的第一个公共节点
/**
 * 两个头节点同时走, A 走完就接着走 B，B 走完接着 A ，当两者相遇的时候，那个节点就是他们的公共节点
 * 设 A 链表的长度为 Al，公共节点为 O，
 * 设 B 链表的长度为 Bl，公共节点为 O，
 * 按照上述说法，A 走完再接着走 B，走到 O 的长度一共是 Al + Bl - OB，B 走到 O 的长度是 Bl + Al - OA，OB 等于 OA，所以可得他们走的距离是相等的
 */

function getIntersectionNode(A, B) {
    let headA = A, headB = B
    while (headA !== headB) {
        // 这里的判断条件必须是当前节点，而不能是next，这样会都一遍null，如果没有相交的节点，最后都是null，就返回了null，如果判断的是next，就会跳过null，在没有相交的case中，就会死循环
        headA = headA ? headA.next : B
        headB = headB ? headB.next : A
    }
    return headA
}
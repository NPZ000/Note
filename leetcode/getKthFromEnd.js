/**
 * 链表中倒数第 k 个节点
 * 输入一个链表，输出该链表中倒数第k个节点
 * 快慢指针解法
 * 快指针先走 k 步
 * 然后慢指针再和快指针一起走 当快指针走到尾的时候 慢指针指向的节点就是倒数第 k 个节点
 * 解析：
 * 倒数第 k 个节点，也就是说要走的步数是 n - k 步，所以让快指针先走 k 步，快指针此时到尾就只剩下了 n - k 步，
 * 慢指针也一起走，当快指针走了 n - k 步到尾的时候，慢指针也同样走了 n - k 步，指向的就是倒数第 k 个节点
 */
function getKthFromEnd(head, k) {
    let slow = head // 慢指针

    // 快指针先走 k 步
    while (k) {
        head = head.next
        k--
    }

    // 一起走 快指针走完 就返回慢指针
    while (head) {
        slow = slow.next
        head = head.next
    }

    return slow
}
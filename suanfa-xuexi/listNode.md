# 链表
## 定义
```js
function ListNode(val, next) {
    this.val = (val !== undefined) ? val : 0
    this.next = (next !== undefined) ? next : null // 指向下一个节点
    this.prev = (prev !== undefined) ? prev : null // 指向上一个节点
}
```

## 移除链表元素
给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点 。

### 思路
一般来说头节点需要特殊处理，所以先定义一个虚拟头节点，next指向实际的头节点，这样就可以不单独处理头节点, 最后返回虚拟头节点的next

```js
var removeElements = function(head, val) {
    const myHead = new ListNode()
    myHead.next = head
    let cur = myHead
    while (cur.next) {
        // 如果下一个节点就是要删除的节点
        if (cur.next.val === val) {
            // 就把当前节点的next 直接链接到要删除节点的下一个节点
            cur.next = cur.next.next
        } else {
            cur = cur.next
        }
    }
    return myHead.next
};
```
## 设计链表
单链表中的节点应该具备两个属性：val 和 next 。val 是当前节点的值，next 是指向下一个节点的指针/引用。

如果是双向链表，则还需要属性 prev 以指示链表中的上一个节点。假设链表中的所有节点下标从 0 开始。

实现 MyLinkedList 类：

MyLinkedList() 初始化 MyLinkedList 对象。
int get(int index) 获取链表中下标为 index 的节点的值。如果下标无效，则返回 -1 。
void addAtHead(int val) 将一个值为 val 的节点插入到链表中第一个元素之前。在插入完成后，新节点会成为链表的第一个节点。
void addAtTail(int val) 将一个值为 val 的节点追加到链表中作为链表的最后一个元素。
void addAtIndex(int index, int val) 将一个值为 val 的节点插入到链表中下标为 index 的节点之前。如果 index 等于链表的长度，那么该节点会被追加到链表的末尾。如果 index 比长度更大，该节点将 不会插入 到链表中。
void deleteAtIndex(int index) 如果下标有效，则删除链表中下标为 index 的节点。
```js
var MyLinkedList = function(v) {
    this.size = 0
};

/** 
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function(index) {
    if (index > this.size - 1 ) return -1
    let i = 0
    let cur = this.head
    while (cur) {
        if (i === index) {
            return cur.val
        }
        cur = cur.next
        i++
    }
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function(val) {
    const node = new ListNode(val)
    // 可能还一个节点都没有
    node.next = this.head ? this.head : null
    // 设置为头节点
    this.head = node
    this.size += 1
};

/** 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function(val) {
    // 可能还没有节点  这个节点就是头节点了
    if (!this.head) {
        this.head = new ListNode(val)
        this.size++
        return
    }
    let cur = this.head
    // 找到最后一个节点
    while (cur.next) {
        cur = cur.next
    }
    cur.next = new ListNode(val)
    this.size += 1
};


/** 
 * @param {number} index 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function(index, val) {
    if (index > this.size) return
    if (index === 0) {
        this.addAtHead(val)
    } else if (index === this.size) {
        this.addAtTail(val)
    } else {
        const node = new ListNode(val)
        let pre = this.head
        let i = 0
        // 找到要插入的位置的前一个节点
        while (i < index - 1) {
            i++
            pre = pre.next
        }
        node.next = pre.next
        pre.next = node
        this.size++
    }
};

/** 
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function(index) {
    if (index < 0 || index > this.size - 1) return
    // 单独处理头节点
    if (index === 0) {
        this.head = this.head.next
        this.size -= 1
        return
    }
    let i = 0
    let pre = this.head
    while (i < this.size) {
        // 找到要删除节点的上一个节点
        if (i + 1 === index) {
            pre.next = pre.next.next
            this.size -= 1
            break
        }
        i++
        pre = pre.next
    }
};
```

## 翻转链表
```js
var reverseList = function(head) {
    if (!head) return null
    let pre = null // 保存上一个节点
    let cur = head
    while (cur) {
        const temp = cur.next
        cur.next = pre
        pre = cur
        cur = temp
    }
    return pre
};
```

## 两两交换链表中的节点
给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
### 思路
定义一个虚拟头节点
```js
var swapPairs = function(head) {
    const temp = new ListNode(-1)
    temp.next = head
    let cur = temp
    while (cur.next && cur.next.next) {
        const first = cur.next
        const second = first.next
        // 先处理当前节点的next
        cur.next = second
        // 再处理第一个节点的next
        first.next = second.next
        // 再处理第二个节点的next
        second.next = first
        cur = first
    }
    return temp.next
};
```

## 删除链表的倒数第n个节点
### 思路
使用快慢指针，快指针先走n步，然后两个指针一起走，当快指针走到最后一个节点的时候，慢指针指向的节点就是要删除节点的前一个节点，这里还是用一个虚拟头节点
```js
var removeNthFromEnd = function(head, n) {
    const temp = new ListNode(-1)
    temp.next = head
    let cur = temp
    let i = 0
    let slow = temp
    // 跳出条件是走到最后一个节点
    while (cur.next) {
        // 快指针先走
        if (i < n) {
            i++
            cur = cur.next
            continue
        }
        // 然后一起走
        slow = slow.next
        cur = cur.next
    }
    // 慢指针的 next 指向下一个的下一个
    slow.next = slow.next.next
    return temp.next
};
```
## 链表中的相交点
### 思路
两个头节点同时走, A 走完就接着走 B，B 走完接着 A ，当两者相遇的时候，那个节点就是他们的公共节点
 设 A 链表的长度为 Al，公共节点为 O，
 设 B 链表的长度为 Bl，公共节点为 O，
按照上述说法，A 走完再接着走 B，走到 O 的长度一共是 Al + Bl - OB，B 走到 O 的长度是 Bl + Al - OA，OB 等于 OA，所以可得他们走的距离是相等的
这题的难点其实在于，循环的跳出条件是什么
这里应该就是两个节点相等的时候跳出，如果有相交节点，就是到相交节点的时候出来的，如果没有相交节点，最后会一起走到null，然后结束
```js
function getIntersectionNode(A, B) {
    let headA = A, headB = B
    while (headA !== headB) {
        // 这里的判断条件必须是当前节点，而不能是next，这样会都走一遍null，如果没有相交的节点，最后都是null，就返回了null，如果判断的是next，最后就不能一起走到null，在没有相交的case中，就会死循环
        headA = headA ? headA.next : B
        headB = headB ? headB.next : A
    }
    return headA
}
```

## 环形链表2
给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
### 思路
首先证明链表有环的方案是用快慢指针，慢指针一次走一步，快指针一次走两步，如果链表有环，快指针一定能追上慢指针。
现在的问题是要找到环的入口，设从头节点到环入口的距离为 a，现在就是要求 a 的这段距离是多少。当快指针追到慢指针的时候，设慢指针走的距离是 s，因为快指针的速度是慢指针的两倍，所以快指针走的距离就是 2s，设快指针走的距离是 f，可得
    f = 2s
再设环一圈的距离是 b，快指针肯定是把慢指针套圈了才追上慢指针的，设想小明和小红在操场跑圈，小明比小红快，小明再次追上了小红，说明小明比小红多跑了一圈，所以快指针比慢指针多走了 n * b 的距离，n 为快指针在第几圈的时候追上了慢指针，现在就可得
  2s - s = n * b --> s = n * b
s 是慢指针走的距离，也就是慢指针走了 n * b 的距离，可以先假设一下，慢指针就是从环的入口开始走的，走完 n * b的距离停下肯定又回到入口处了，实际慢指针是从头节点，走了 a 的距离才到入口处的，然后走完停下来后，离入口的距离肯定就是 a 了
然后再搞一个指针从头节点开始和慢指针一起走，当它俩相遇的位置，就是入口处了
```js
var detectCycle = function(head) {
    if (!head) return null
    let slow = head
    let fast = head
    let temp
    while (fast.next && fast.next.next) {
        slow = slow.next
        fast = fast.next.next
        if (slow === fast) {
            temp = head
            break
        }
    }
    
    if (temp) {
        while (temp !== slow) {
            temp = temp.next
            slow = slow.next
        }
        return temp
    }
    return null
};
```

## 回文链表
### 思路
先用快慢指针找到链表的中间节点：慢指针一次走一步，快指针一次走两步，快指针走到尾的时候，慢指针应该只走了一半的距离，就是中间节点了。假设链表是回文的，那么从两端同时向中间走，节点的值应该都是一样的， 1 2 3 2 1，但是现在没法从尾节点向中间走，所以需要从中间节点开始，把后半段链表翻转一下，然后就可以从尾节点向中间走了，
or 直接把链表变成双向的
```js
var isPalindrome = function(head) {
    if (!head.next) return true
    let s = head
    let f = head
    // 找到中间节点
    while (f) {
        s = s.next
        f = f.next ? f.next.next : f.next
    }
    // 翻转后半段
    let pre = null
    while (s) {
        const temp = s.next
        s.next = pre
        pre = s
        s = temp
    }
    // 从两端向中间走
    while (head && pre) {
        // 遇到不相等的就直接返回false
        if (head.val !== pre.val) {
            return false
        }
        head = head.next
        pre = pre.next
    }
    return true
};
// 解法2 单向变双向
var isPalindrome = function(head) {
    if (!head.next) return true
    let pre = null
    let cur = head
    while (cur) {
        cur.prev = pre
        pre = cur
        cur = cur.next
    }
    cur = head
    while (cur && pre) {
        if (cur.val !== pre.val) {
            return false
        }
        cur = cur.next
        pre = pre.prev
    }
    return true

};
```
## 合并两个有序链表
### 思路
依次从两个链表各取出一个节点，哪个更小就挂到新的链表上
```js
var mergeTwoLists = function(list1, list2) {
    const temp = new ListNode(-1)
    let cur = temp
    let cur1 = list1
    let cur2 = list2
    while (cur1 && cur2) {
        // 各取出一个比较大小
        if (cur1.val < cur2.val) {
            cur.next = cur1
            cur1 = cur1.next
        } else {
            cur.next = cur2
            cur2 = cur2.next
        }
        cur = cur.next
    }
    // 处理剩下的
    let other = cur1 || cur2
    while (other) {
        cur.next = other
        other = other.next
        cur = cur.next
    }
    return temp.next
};
```
## 两数相加
给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
### 思路
从两个链表中各取一个节点，然后相加，% 10 取余的值构建新的节点挂在新列表上，然后 /10 取整也就是进位的值额外保存在一个变量上，每次两个节点的值相加还要与进位的值相加
```js
var addTwoNumbers = function(l1, l2) {
    const temp = new ListNode(-1)
    let c1 = l1
    let c2 = l2
    let num = 0
    let cur = temp
    function createNode (sum) {
        const val = sum % 10 // 取余的值放在新节点上
        num = Math.floor(sum / 10) // 进位的值保存起来
        const node = new ListNode(val)
        cur.next = node
        cur = cur.next
    }
    while (c1 && c2) {
        const sum = c1.val + c2.val + num // 两个节点的值以及进位的值相加
        createNode(sum)
        c1 = c1.next
        c2 = c2.next
    }
    let c3 = c1 || c2
    // 处理剩余的部分
    while (c3) {
        const sum = c3.val + num
        createNode(sum)
        c3 = c3.next
    }
    // 进位的值可能还有
    while (num) {
        createNode(num)
    }
    return temp.next
};
```
## 随机链表的复制
给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。

构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。

例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --> y 。

返回复制链表的头节点。

### 思路
这道题的难点在于处理随机节点，这里可以使用额外的map，以旧节点为 key，新节点为 value，然后遍历旧的链表，先从map中把旧节点对应的新节点拿出来，如果旧节点上有随机节点，再把那个随机节点对应的新节点拿出来，把两个新节点连起来即可
```js
var copyRandomList = function(head) {
    const map = new Map()
    let cur = head
    const temp = new ListNode(-1)
    let c = temp
    while (cur) {
        const newNode = new ListNode(cur.val)
        // 把新旧节点保存起来
        map.set(cur, newNode)
        c.next = newNode
        cur = cur.next
        c = c.next
    }
    cur = head
    while (cur) {
        // 取出当前旧节点的新节点
        const newNode = map.get(cur)
        // 取出当前旧节点的随机节点对应的新节点
        const randomNode = cur.random ? map.get(cur.random) : null
        // 链接起来
        newNode.random = randomNode
        cur = cur.next
    }
    return temp.next
};
```
## LRU缓存
请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
实现 LRUCache 类：
LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
### 思路
使用双向链表+哈希表，哈希表是为了用O(1)的速度找到节点，并且删除，删除的动作通过修改前后节点prev和next完成，所以需要是双向链表
为了用O(1)的速度删除尾节点，需要维护一个尾节点的指针
头节点和尾节点都用虚拟头节点，更好处理
```js
/**
 * @param {number} capacity 最大size
 */
var LRUCache = function(capacity) {
    this.max = capacity
    this.size = 0
    this.map = new Map()
    // 虚拟头节点
    this.head = new ListNode(-1)
    // 虚拟尾节点
    this.end = new ListNode(-1)
    // 互相指一下
    this.head.next = this.end
    this.end.prev = this.head
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    // 从map中取出节点
    const node = this.map.get(key)
    if (!node) return -1
    // 先删除
    this.delNode(node)
    // 再添加到头节点
    this.addHead(node)
    return node.val
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    const node = this.map.get(key)
    if (node) {
        // 如果已经存在 就先删除再放到头部 并且更新值
        this.delNode(node)
        node.val = value
        this.addHead(node)
    } else {
        // 需要新增
        // 先判断size
        if (this.size === this.max) {
            // 删除尾节点
            this.delEnd()
        }
        const newNode = new ListNode(value)
        newNode.key = key
        // 存到map
        this.map.set(key, newNode)
        // 添加到头部
        this.addHead(newNode)
    }
};

LRUCache.prototype.addHead = function(node) {
    const temp = this.head.next
    this.head.next = node
    node.prev = this.head
    node.next = temp
    temp.prev = node
    this.size += 1
}
LRUCache.prototype.delEnd = function() {
    this.map.delete(this.end.prev.key)
    this.end.prev = this.end.prev.prev
    this.end.prev.next = this.end 
    this.size -= 1
}
LRUCache.prototype.delNode = function(node) {
    const prev = node.prev
    const next = node.next
    prev !== null && (prev.next = next)
    next !== null && (next.prev = prev)
    this.size -= 1
}
```


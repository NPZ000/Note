// 用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

/**
 * 入栈的时候直接入栈 A
 * 出栈的时候首先判断 栈B 中是否还有倒装的元素，有的话直接pop出来一个返回
 * 栈 B 为空的话，判断栈 A 为空的直接返回 -1
 * 不为空的话 循环将 栈 A 的元素倒装入 栈 B
 * 再从 栈 B 中 pop 出来一个返回
 */

class CQueue {
    constructor() {
        this.a = []
        this.b = []
    }

    append(value) {
        this.a.push(value)
    }

    del() {
        if (this.b.length) return this.b.pop()
        if (!this.a.length) return -1
        while (this.a.length) {
            this.b.push(this.a.pop())
        }
        return this.b.pop()
    }
}
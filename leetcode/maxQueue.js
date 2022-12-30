// 请定义一个队列并实现函数 max_value 得到队列里的最大值，要求函数max_value、push_back 和 pop_front 的均摊时间复杂度都是O(1)。
// 若队列为空，pop_front 和 max_value 需要返回 -1

/**
 * 利用辅助栈
 * 为了在 O(1) 的时间内得到最大的值
 * 需要在辅助栈内保持递减的顺序，为什么必须是递减的呢 
 * 考虑以下这种情况
 * 入 3 入 6 入 5 
 * 原始栈为 [3, 6, 5]
 * 如果是保持递减的逻辑
 * 辅助栈里就是 [6, 5] 移除 6 之后 下一个最大的就是 5 没问题
 * 如果是保持递增的逻辑的
 * 辅助栈里就是 [3, 6], 移除 6 之后，下一个最大的应该是 5 ，但是这里以为要保持递增 辅助栈里就没有把 5 入栈
 */

class MaxQueue {
    constructor() {
        this.a = []
        this.b = []
    }

    pushBack(value) {
        this.a.push(value) 
        while(this.b[this.b.length - 1] < value) {
            this.b.pop()
        }
        this.b.push(value)
    }

    popFront() {
        if (!this.a.length) return -1
        const front = this.a.shift()
        if (front === this.b[0]) {
            this.b.shift()
        }
        return front
    }

    maxValue() {
        return this.b.length ? this.b[0] : -1
    }
}

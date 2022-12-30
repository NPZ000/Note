//定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

/**
 * 思路
 * 使用辅助栈，新元素按照递减的顺序加入到辅助栈中，也就是说如果新元素比辅助栈的元素都小 就加进去
 * pop的时候 判断原始栈的栈尾元素 是否 与辅助栈中栈尾元素相等  如果相等 就都pop出来
 */

class MinStack {
    constructor() {
        this.a = []
        this.b = []
    }

    push(x) {
        this.a.push(x)
        if (!this.b.length || this.b[this.b.length - 1] >= x) {
            this.b.push(x)
        }
    }

    pop() {
        if (this.a.pop() === this.b[this.b.length - 1]) {
            this.b.pop()
        }
    }

    top() {
        return this.a[this.a.length - 1]
    }

    min() {
        // 最小元素就是辅助栈中的的栈尾元素 因为它里面是递减排列的
        return this.b[this.b.length - 1]
    }
}
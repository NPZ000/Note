# 栈/队列
栈： 先进后出 push pop
队列： 先进先出 push shift
## 用队列实现栈
请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（push、top、pop 和 empty）。

实现 MyStack 类：

void push(int x) 将元素 x 压入栈顶。
int pop() 移除并返回栈顶元素。
int top() 返回栈顶元素。
boolean empty() 如果栈是空的，返回 true ；否则，返回 false 。
### 思路
只能用队列的push 和 shift 方法，如果pop的时候要返回栈顶元素，也就是说，要返回最后进来的元素，可以想办法在进来的时候就让他在队伍的最前面，可以用两个队列相互辅助来实现，一个空队列b用来处理push的新元素，一个队列a存放已经进来的元素，先把新元素放在空队列b里，然后再把另一个队列a里的元素都 shift 出来 push 到 b 中，这样就可以实现最后进来的元素在最前面的效果，然后两个队列交换元素，保持b还是空的
```js
var MyStack = function() {
    this.a = []
    this.b = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.b.push(x)
    while (this.a.length) {
        this.b.push(this.a.shift())
    }
    [this.a, this.b] = [this.b, this.a]
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function() {
    return this.a.shift()
};

/**
 * @return {number}
 */
MyStack.prototype.top = function() {
    return this.a[0]
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.a.length === 0
};
```
## 用栈实现队列
用栈的pop和push方法
实现 MyQueue 类：
void push(int x) 将元素 x 推到队列的末尾
int pop() 从队列的开头移除并返回元素
int peek() 返回队列开头的元素
boolean empty() 如果队列为空，返回 true ；否则，返回 false
### 思路
pop方法需要返回最先进去的元素，可以借助辅助栈，将主栈的元素，都倒进辅助栈中，然后最先进去的元素就跑到辅助栈的最上面了，
```js
var MyQueue = function() {
    this.a = []
    this.b = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
    this.a.push(x)
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function() {
    if (!this.a.length && !this.b.length) return
    if (!this.b.length) {
        while(this.a.length) {
            this.b.push(this.a.pop())
        }
    }
    return this.b.pop()
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function() {
    if (this.b.length) return this.b.at(-1)
    if (this.a.length) return this.a[0]
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
    return this.a.length === 0 && this.b.length === 0
};
```
## 有效的括号
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。
### 思路
如果是左括号就放在栈中，如果是右括号就和当前栈顶的左括号匹配，匹配不上就直接返回false，匹配的上就把栈顶元素弹出，最后如果栈是空的，表示是有效
```js
var isValid = function(s) {
    if (s.length % 2) return false
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    }
    const stack = []
    for (const i of s) {
        if (map[i]) {
            stack.push(i)
        } else {
            if (map[stack.at(-1)] !== i) return false
            stack.pop()
        }
    }
    return !stack.length
};
```
## 逆波兰表达式求值
根据 逆波兰表示法，求该后缀表达式的计算结果。
有效的算符包括 +、-、*、/ 。每个运算对象可以是整数，也可以是另一个逆波兰表达式。
说明：
整数除法只保留整数部分。
给定逆波兰表达式总是有效的。换句话说，表达式总会得出有效数值且不存在除数为 0 的情况。

示例 1：

输入：tokens = ["2","1","+","3","*"]
输出：9
解释：该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9
### 思路
遇到数字就放进栈中，遇到运算符就取出来两个数字处理，处理完再放回去
```js
var evalRPN = function(tokens) {
    const stack = []
    for (const i of tokens) {
        if (Number.isNaN(+i)) {
            const b = stack.pop()
            const a = stack.pop()
            let res
            switch (i) {
                case '+':
                    res = a + b
                    break
                case '-':
                    res = a - b
                    break
                case '/':
                    res = parseInt(a / b)
                    break
                case '*':
                    res = a * b
            }
            stack.push(res)
        } else {
            stack.push(+i)
        }
    }
    return +stack[0]
};
```
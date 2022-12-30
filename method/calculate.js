//实现一个函数 计算 ‘11+1-22+33’
function calculate(str) {
    const tool = (a, b, type) => {
        if (type === '+') {
            return a + b
        } else if (type === '-') {
            return a - b
        }
    }
    let a = '', b = '', type = null
    for (let i = 0; i < str.length; i++) {
        if (/\d/.test(str[i])) {
            if (!type) {
                a += str[i]
            } else {
                b += str[i]
            }
        } else {
            if (a && b) {
                a = tool(+a, +b, type)
                b = ''
            }
            type = str[i]
        }
    }
    return tool(+a, +b, type)
}
console.log(calculate('11+1-22+33'))

function foo(str) {
    let num = 0, sign = 1, result = 0
    for (const char of str) {
        if (char === '+') {
            result += num * sign
            num = 0
            sign = 1
        } else if (char === '-') {
            result += num * sign
            num = 0
            sign = -1
        } else if (!isNaN(parseInt(char))) {
            num = num * 10 + parseInt(char)
        }
    }
    result += sign * num
    return result
}
console.log(foo('11+22-12'))
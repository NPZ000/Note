// 输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

/**
 * 首先去除首尾的空格
 * 然后倒序遍历 遇到非空字符就加入临时的变量中 遇到空格 就把已经储存的字符串加入到结果中 因为可能会有连续的空格 所以要判断临时变量存储的字符串是否是非空的
 * 最后用空格拼接
 */

function reverseWords(words) {
    let str = words.trim()
    let res = []
    let temp = ''
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] !== ' ') {
            temp = str[i] + temp
            if (i === 0) {
                res.push(temp)
                return res.join(' ')
            }
        } else {
            if (temp.length) {
                res.push(temp)
                temp = ''
            }
        }
    }
    return ''
}
// 在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

/**
 * 哈希表
 * 遍历字符串
 * 如果没有在map中保存 就存一下 值为true
 * 如果存过了就把值改为false
 * 
 * 再遍历一遍哈希表
 * 找到那个值为true的值
 */

function firstUniqChar(s) {
    if (!s) return ''
    let map = {}
    for (let i = 0; i < s.length; i++) {
        if (map[s[i]] === undefined) {
            map[s[i]] = true
        } else {
            map[s[i]] = false
        }
    }

    for (let key in map) {
        if (map[key]) {
            return key
        }
    }

    return ''
}
# 字符串
## 反转字符串 II
给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符。

如果剩余字符少于 k 个，则将剩余字符全部反转。
如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。

其实就是每隔k个反转k个
### 思路
问题的关键在于怎么分块处理，其实就是怎么写for循环的递增条件，处理 k 个，隔 k 个再处理，那么第一次处理完，下次应该直接到 2 * k了，所以递增的i 是 i += 2 * k
这里先把字符串分割成数组，方便处理
```js
var reverseStr = function(s, k) {
    let list = s.split('')
    for (let i = 0; i < s.length; i += (2 * k)) {
        // 用一下splice 方法 原地修改，第二个参数之后不能直接传一个数组，要解构
        list.splice(i, k, ...list.slice(i, i + k).reverse())
    }
    return list.join('')
};
```
## 找出字符串中第一个匹配项的下标
给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。
### 思路
KMP 算法
可以高效解决字符串匹配的算法，在传统的暴力解法中，当模式串与主串匹配不上的时候，会从头开始后移一位重新匹配，而kmp 算法可以跳过一部分字串，具体如何跳过，怎么跳过呢
首先先构建一个模式串的next数组，也就是部分匹配表，定义为：字符串第 i 项的前缀和后缀的最长公共长度
前缀：以第一个字符为头并且不包含最后一个字符的子串。abc的前缀有 a ab
后缀：以最后一个字符结尾并且不包含第一个字符的子串。abc的后缀有 b bc
部分匹配表是找最长的公共前后缀的长度
 aabaa 的前缀子串：a aa aab aaba
 aabaa 的后缀字串：a aa baa abaa
所以他的最长公共前后缀是aa 
为什么需要统计这个最长公共前后缀的长度呢。看一个例子
主串为 ABABABC 模式串为ABABC
先构建一个模式串的next数组为 [0, 0, 1, 2, 0]
当匹配到第五个字符时，匹配不上了，模式串肯定是要前移的，但是迁移到哪里呢，看前面已经匹配上的 ABAB，看他的最长公共前后缀是 AB，长度是2，正好对应next数组中第四项的值，这意味着现在模式串可以不用前移到最开头了，既然这里的前缀AB和后缀AB相同，那我们就可以跳过前缀了，
匹配不上的时候
    A B A B A B C
    A B A B C
模式串前移两位后
    A B A B A B C
        A B A B C
此时的主串的第五项和模式串的第三项匹配，匹配完成之后，是符合预期的
然后看next数组具体是如何计算的，对于字符串 ababc 来看，
    a 没有前缀后缀所以对应 next[0] = 0, 
    ab 的前缀是 a，后缀是 b，next[1] = 0
    aba 的前缀是a ab，后缀是 a ba，公共的是 a，next[2] = 1
    abab next[3] = 2
具体用代码怎么写呢，首先初始化最长公共前后缀长度为len = 0，
- 从第二个字符开始看，和s[len]相比，相等则 len++，next[i] = len，看如下例子
        aa, 因为前一个a和后一个a相等，所以，len = 1
- 如果不相等，就后退到next[len - 1]再看，看如下例子
    aabaaac，前面的aabaa 对应的next数组应该是[0, 1, 0, 1, 2],然后到s[5] = a时，此时len=2，s[len]=b，不相等，回退,len = next[len - 1] = 1, 对应是a，判断相等，len++ = 2, 此时的next[5] = 2, 也就是aabaaa的最长公共前后缀长度是2，可以明显看到前两个和后两个a相等，就是2
然后得到next数组之后，应该怎么用，首先遍历模式串和主串，碰到不匹配的时候停下来，此时就需要查next数组，还是用A B A B A B C和A B A B C举例来看，当第5项 A 和 C 不匹配的时候，查到next[3] = 2, 此时只需要将模式串后移两位，然后重新进行匹配即可，这里为什么只需要后移两位就行了，其实这里的next[3] = 2，证明的是前两个AB和后两个AB是相等的，所以我们只需要从后两个AB重新匹配就行了，
```js
var strStr = function(haystack, needle) {
    // 构建next数组的方法
    const buildNext = s => {
        const next = Array(s.length).fill(0)
        let len = 0
        let i = 1
        while (i < needle.length) {
            if (s[i] === s[len]) {
                len++
                next[i] = len
                i++
            } else {
                if (len > 0) {
                    len = next[len - 1]
                } else {
                    next[i] = 0
                    i++
                }
            }

        }

        return next
    }
    const next = buildNext(needle)
    console.log(next)
    let i = 0
    let j = 0
    while (i < haystack.length) {
        if (haystack[i] === needle[j]) {
            i++
            j++
        } else {
            if (j > 0) {
                j = next[j - 1]
            } else {
                i++
            }
        }
        if (j === needle.length) {
            return i - j
        }
    }
    return -1
};
```
## 重复的子字符串
给定一个非空的字符串 s ，检查是否可以通过由它的一个子串重复多次构成。
### 思路
如果 s 是一个周期串，那么如果将两个 s 拼在一起，然后掐头去尾，新字符串中仍然包含有一个原始的 s，所以可以用 kmp 算法，查询两个 s 拼在一起然后切头去尾之后是否还存在一个s
```js
function repeatStr(s) {
    const buildNext(str) {
        const next = [0]
        let i = 1
        let len = 0
        while (i < str.length) {
            if (str[i] === str[len]) {
                len++
                next[i] = len
                i++
            } else {
                if (len > 0) {
                    len = next[len - 1]
                } else {
                    next[i] = 0
                    i++
                }
            }
        }
        return next
    }
    const next = buildNext(s)
    let i = 1
    let j = 0
    const newS = s + s
    while (i < newS.lengh - 1) {
        if (newS[i] === s[j]) {
            i++
            j++
        } else {
            if (j > 0) {
                j = next[j - 1]
            } else {
                i++
            }
        }
        if (j === s.length) return true
    }
    return false 
}
```
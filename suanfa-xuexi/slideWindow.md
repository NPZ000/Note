# 滑动窗口
## 无重复字符的最长字串
给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。
### 思路
滑动窗口的问题关键在于什么时候移动左指针，在这题中因为窗口中的元素不能重复，所以应该在有重复元素加进来的时候移动左指针，应该移动到哪个位置呢，比如现在已经有abcd，然后又进来一个b，abcdb，为了保持窗口中没有重复的，左指针应该移动到c的位置，现在窗口中的元素为cdb，为了快速找到重复元素的索引，用一个map存下每个元素的索引
```js
var lengthOfLongestSubstring = function(s) {
    const map = {}
    let max = 0
    let l = 0
    let r = 0
    for (let i = 0; i < s.length; i++) {
        // 如果有是已有元素 需要移动左指针
        if (map[s[i]] !== undefined) {
            /**
             * 为什么这里要这么写
             * 考虑 abba 这个case
             * 当遍历到第二个b的时候，l会更新到第二个b的位置
             * 然后遍历到第二个a的时候，如果直接更新 l 为 map[s[i]] + 1，会发现 l 的位置倒退了
             * 所以这里判断一下，取个最大值  防止 l 发生倒退
             */
            l = Math.max(l, map[s[i]] + 1)
        }
        r++
        map[s[i]] = i
        max = Math.max(r - l, max)
    }
    return max
};
```
## 找到字符串中所有字母异位词
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
示例 1:

输入: s = "cbaebabacd", p = "abc"
输出: [0,6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。

### 思路
使用滑动窗口，考虑窗口中的词是不是目标词的异位词，abc 是不是 bac 的异味词，排序会超时，排除排序方法。
可借助一个长度为26的数组来存放每个字母出现的次数，比如b出现一次，就在索引1的位置上+1，如何使b对应到索引1的位置上呢，使用charCodeAt，该方法返回一个字符的UTF-16码元，26个字母对应的码元是连在一起的，a对应的是97，b对应的是98，所以可以用b的码元减去a的码元得到1，就可以对应到b在26个字母中对应的索引1，如果窗口中的词是异味词，那么得到的统计次数的数组和目标词的数组应该是相同的，可以转化为字符串比较,比如abc和bac得到的数组应该都是[1,1,1....]
```js
var findAnagrams = function(s, p) {
    // 特殊case处理
    const sLen = s.length
    const pLen = p.length
    if (sLen < pLen) return []

    const res = []
    const sCount = new Array(26).fill(0)
    const pCount = new Array(26).fill(0)
    // 先统计一下目标词的统计数组，顺便也统计一下s的前pLen位的统计数组
    for (let i = 0; i < p.length; i++) {
        ++sCount[s[i].charCodeAt() - 'a'.charCodeAt()]
        ++pCount[p[i].charCodeAt() - 'a'.charCodeAt()]
    }
    // 如果前pLen位相等 就把 0 push到结果中
    if (sCount.toString() === pCount.toString()) {
        res.push(0)
    }
    // 这里的循环跳出条件为什么是i < sLen - pLen
    // 因为循环内部会统计s[i + pLen],也就是右指针移动之后的指向 所以这里其实判断跳出的窗口左边的指针，当左指针到达sLen - pLen，右指针就到尾了
    for (let i = 0; i < sLen - pLen; i++) {
        // 第i位出现的次数减1，相当于左指针向后移动
        --sCount[s[i].charCodeAt() - 'a'.charCodeAt()]
        // 把第 i + pLen位统计进来，相当于右指针向后移动
        ++sCount[s[i + pLen].charCodeAt() - 'a'.charCodeAt()]
        // 判断是否相等 
        if (sCount.toString() === pCount.toString()) {
            // 因为这里判断的是窗口移动之后的 所以push的是 i + 1
            res.push(i + 1)
        }
    }
    return res
};
```
## 前缀和
求一个数组中，从i到j，中间所有数字的和，用O(1)的时间复杂度
### 使用前缀和的思路
前缀和是使用一个额外的数据保存当前元素前面所有数字的和
    s[i + 1] = nums[0] + nums[1] + ... nums[i]
可以转化为
    s[i + 1] = s[i] + nums[i]
对于数组[1,2,3,4,5], 他的前缀和数组为
    [0, 1, 3, 6, 10]
通过前缀和可以把子数组的和转换为两个前缀和的差，对于数组[1,2,3,4,5]，如果我们要求2(i)到4(j)之间的子数组和，可以先转换为
    (1+2+3+4) - (1)
第一个小括号的其实就是元素5的前缀和，也就是s[j + 1], 第二个小括号里的就是2的前缀和，也就是s[i], 所以求i到j的子数组的和，就可以
    s[j + 1] - s[i]
得出来
```js
var NumArray = function(nums) {
    // 先算出前缀和数组
    this.s = Array(nums.length).fill(0)
    for (let i = 0; i < nums.length; i++) {
        this.s[i + 1] = this.s[i] + nums[i]
    }
};
// 可以用O(1)的时间复杂度算出来
NumArray.prototype.sumRange = function(left, right) {
    return this.s[right + 1] - this.s[left]
};

```



## 和为 k 的子数组
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。

示例 1：
输入：nums = [1,1,1], k = 2
输出：2

### 思路
第一想法是用滑动窗口，但是滑动窗口必须满足单调性，也就是说右侧窗口移动时，窗口内的值必须是增加的，但是因为这里会有负数，右侧窗口移动了，值不一定增加，所以不能用滑动窗口
这里考虑使用前缀和
当i < j 时，如果nums[i] 到 nums[j - 1] 的和等于 k，那么
    s[j] - s[i] = k  -> s[i] = s[j] - k
现在问题就变成了遍历前缀和数组，从 0 到 j，存在几个s[i]
用一个map来保存s[i]的个数，key为s[i],value为个数
```js
function subArrNum(nums, k) {
    const len = nums.length
    const s = Array(len + 1).fill(0)
    for (let i = 0; i < len; i++) {
        s[i + 1] = s[i] + nums[i]
    }
    console.log(s)

    const map = new Map()
    let res = 0
    for (const sum of s) {
        // sum 就是s[j]
        res += map.get(sum - k) ?? 0
        // 这里就是保存s[i]的个数
        map.set(sum, (map.get(sum) ?? 0) + 1)
    }
    return res
}
```
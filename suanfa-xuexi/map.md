# 哈希
## 两数之和
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
### 思路
定义一个额外的map
在遍历过程中，查找map中是否存在map[target - cur], 如果不存在就将当前项作为key，索引作为value存入map中，如果存在，就把对应的value和当前的i，返回
```js
function twoSum(nums: number[], target: number): number[] {
    const map = {}
    for (let i = 0; i < nums.length; i++) {
        if (map[target - nums[i]] !== undefined) {
            return [map[target - nums[i]], i]
        }
        map[nums[i]] = i
    }
    return []
};
```
## 三数之和
给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。
### 思路
常规思路是两层循环，外层循环固定第一位数，然后内层循环按照两数之和的思路做，但是这个思路不好做去重，尝试过将结果排序拼成string来判断，但是会超时
先把数组进行排序，还是两层循环，外层固定第一位，然后如果不是第一位就判断是否和前一个相等，如果相等就continue，用来去重，因为已经是排序过的，所以判断当前位如果已经超过0了，那么后面的已经不可能再有相加结果是0的了，就直接返回结果
然后声明两个指针，左指针从i+ 1开始，右指针从n-1开始，向中间靠拢，
判断如果三个位置的数的和大于0，则右指针向左移动，
如果小于0，左指针向右移动
判断如果三个位置的数加起来是0 就放进res中，然后移动左指针到下一个不等于当前位数字的位置，右指针也是
```js
function threeSum(nums: number[]): number[][] {
    if (nums.length < 3) return []
    const res = []
    const n = nums.length
    nums.sort((a, b) => a - b)
    for (let i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i - 1] === nums[i]) continue // 去重
        if (nums[i] > 0) return res // 剪枝
        let left = i + 1
        let right = n - 1
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right]
            if (sum === 0) {
                if (i !== left && i !== right && left !== right) {
                    res.push([nums[i], nums[left], nums[right]])
                    while (left < right && nums[left + 1] === nums[left]) left++    // 去重
                    while (left < right && nums[right - 1] === nums[right]) right-- // 去重
                    left++
                    right--
                }
            } else if (sum < 0) {
                left++
            } else {
                right--
            }
            
        }
    }
    return res
};
```
## 四数之和
给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]] （若两个四元组元素一一对应，则认为两个四元组重复）：

0 <= a, b, c, d < n
a、b、c 和 d 互不相同
nums[a] + nums[b] + nums[c] + nums[d] == target
### 思路
还是用三数之和之和思路，在三数之和的基础上再加一层for循环
```js
var fourSum = function(nums, target) {
    nums.sort((a,b) => a - b)
    const res = []
    const len = nums.length
    for (let i = 0; i < len; i++) {
        // 同样的减枝思路
        if (i > 0 && nums[i] === nums[i - 1]) continue
        // 只有在正数的情况下才能这么减
        if (nums[i] > target && i > 0 && target > 0) continue
        for (let j = i + 1; j < len; j++) {  
            if (j > i + 1 && nums[j] === nums[j - 1]) continue
            let l = j + 1
            let r = len - 1
            while (l < r) {
                const sum = nums[i] + nums[j] + nums[l] + nums[r]
                if (sum === target) {
                    res.push([nums[i], nums[j], nums[l], nums[r]])
                    // 同样的去重
                    while (l < r && nums[l] === nums[l + 1]) l++
                    while (l < r && nums[r] === nums[r - 1]) r--
                    l++
                    r--
                } else if (sum < target) {
                    l++
                } else {
                    r--
                }
            }
        }
    }
    return res
};
```
## 最长连续序列
给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
### 思路
需要用O(n)的时间复杂度，就不能排序了，排序的目的是让连续的元素在物理层面挨住，不能排序的话，可以使用哈希，让连续的元素在逻辑层面挨住
以元素为key，连续序列长度为value，怎么计算这个长度呢
当遍历到一个元素num时，此时可能
- 哈希中存在map[num - 1] 也存在 map[num + 1]
那么当前这个元素的value怎么计算，用map[num - 1]的value + map[num + 1]的value + 1，1是自己加进来，长度就+1，
然后还需要更新一下这个序列起始位置元素的长度，这一步是必须的
```js
var longestConsecutive = function(nums) {
    if (!nums.length) return 0
    const map = {}
    for (const num of nums) {
        if (map[num]) continue
        const prev = map[num - 1] ? map[num - 1] : 0 // 不存在就记为0
        const next = map[num + 1] ? map[num + 1] : 0
        map[num] = prev + next + 1
        // 更新序列首尾元素的值 
        map[num - prev] = map[num] 
        map[num + next] = map[num]
    }
    const res = Math.max(...Object.values(map))
    return res
};
```
## 有效的字母异位词
给定两个字符串 s 和 t ，编写一个函数来判断它们是不是一组变位词（字母异位词）。
注意：若 s 和 t 中每个字符出现的次数都相同且字符顺序不完全相同，则称 s 和 t 互为变位词（字母异位词）。
### 思路
初始化一个长度为26的数组，将每个字母转为AscII编码减去a的编码，就能映射到数组对应的位置上，比如 b 的位置应该是 1, 先遍历第一个字符串，统计每个字符出现的次数，然后再遍历第二个字符串，将字符出现次数减去，如果最后数组中都是0，返回true，否则返回false
```js
var isAnagram = function(s, t) {
    if ( s === t) return false
    const sList = Array(26).fill(0)
    const a = 'a'.charCodeAt()
    for (const str of s) {
        sList[str.charCodeAt() - a] += 1
    }
    for (const str of t){
        sList[str.charCodeAt() - a] -= 1
    }
    for (const num of sList) {
        if (num !== 0) return false
    }
    return true
};
```
## 两个数组的交集2
给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。
### 思路
初始化一个长度为1000的数组 list（题目限定长度最大1000），然后遍历 nums1 ，统计每个数字出现的次数，然后遍历nums2，如果数字在list中对应的索引位置出现过，就放在结果中，因为要考虑出现次数不一致，则考虑取较小值的情况，所以每次判断完，都把list中对应次数-1，
```js
var intersect = function(nums1, nums2) {
    const res = []
    const list = Array(1001).fill(0)
    for (const num of nums1) {
        list[num] += 1
    } 
    for (const num of nums2) {
        if (list[num]) {
            res.push(num)
            list[num] -= 1
        }
    }
    return res
};
```
## 快乐数
编写一个算法来判断一个数 n 是不是快乐数。
「快乐数」 定义为：
对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
如果这个过程 结果为 1，那么这个数就是快乐数。
如果 n 是 快乐数 就返回 true ；不是，则返回 false 。
### 思路
这道题的关键在于，如何跳出循环，怎么判断是无限循环了，造成无限循环的原因其实是和一直不变，也就是说有重复的和出现了，所以可以借助哈希表，保存已经出现的和，判断有重复的就直接返回false
```js
var isHappy = function(n) {
    const getSum = n => {
        let sum = 0
        while (n) {
            sum += (n % 10) * (n % 10)
            n = Math.floor(n / 10)
        }
        return sum
    }
    const map = {}
    while (n !== 1) {
        const sum = getSum(n)
        if (map[sum]) return false
        map[sum] = 1
        n = sum
    }
    return true
};
```

## 四数相加2
给你四个整数数组 nums1、nums2、nums3 和 nums4 ，数组长度都是 n ，请你计算有多少个元组 (i, j, k, l) 能满足：

0 <= i, j, k, l < n
nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
### 思路
先遍历前两个数组，把两个数的和以及他们出现的次数存在map中，再遍历后两个数组，用0 减去两个数的和的值作为key去map中查找，将找的值累加到结果中
```js
var fourSumCount = function(nums1, nums2, nums3, nums4) {
    const map = {}
    for (const i of nums1) {
        for (const j of nums2) {
            // 统计前两个数和的出现次数
            map[i + j] = (map[i + j] || 0) + 1
        }
    }
    let res = 0
    for (const i of nums3) {
        for (const j of nums4) {
            res += (map[0 - (i + j)] || 0)
        }
    }
    return res
};
```

## 赎金信
给你两个字符串：ransomNote 和 magazine ，判断 ransomNote 能不能由 magazine 里面的字符构成。

如果可以，返回 true ；否则返回 false 。

magazine 中的每个字符只能在 ransomNote 中使用一次。
## 思路
还是用ASCII的方法，先统计magazine中每个字符出现的次数，存在数组中，再遍历ransomNote，去map中查找每个字符，如果对应的次数是0，就直接返回false，找到了就把次数 -1 ，因为每个字符只能用一次
```js
var canConstruct = function(ransomNote, magazine) {
    if (ransomNote.length > magazine.length) return false
    const list = Array(26).fill(0)
    const a = 'a'.charCodeAt()
    for (const s of magazine) {
        list[s.charCodeAt() - a] += 1
    }
    for (const s of ransomNote) {
        const index = s.charCodeAt() - a
        if (!list[index]) return false
        list[index] -= 1
    }
    return true
};
```


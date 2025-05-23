# 数组
## 二分法
注意区间定义，是左闭右闭还是左闭右开，相对应的循环跳出条件是什么，while (left < right) 还是 while (left <= right)，right的更新应该是middle还是middle - 1，
左闭右闭的写法，循环的跳出条件应该是 while (left <= right)，因为当left等于right的时候，[left, right]还是一个有效的区间
然后当nums[middle] > target的时候，right应该更新为 middle - 1，因为middle的值肯定不是target
```js
function find(nums, target) {
    let left = 0; // 左闭
    let right = nums.length - 1 // 右闭
    while (left <= right) {
        const middle = Math.floor(left + ((right - left) / 2)) // 如果用left+ right 可能会越界，所以用这种写法
        if (nums[middle] > target) {
            right = middle - 1     // 目标在[left, middle - 1]
        } else if (nums[middle] < target) {
            left = middle + 1
        } else {
            return target
        }
    }
    return -1
}
```
## 移除数组中的元素
https://leetcode.cn/problems/remove-element/description/
给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素。元素的顺序可能发生改变。然后返回 nums 中与 val 不同的元素的数量。
假设 nums 中不等于 val 的元素数量为 k，要通过此题，您需要执行以下操作：
更改 nums 数组，使 nums 的前 k 个元素包含不等于 val 的元素。nums 的其余元素和 nums 的大小并不重要。
返回 k。
### 思路
用双指针解法，快指针在前面找不等于val的元素，找到一个就复制到slow的位置，然后slow向前走一步
```js
function removeElement(nums: number[], val: number): number {
    let slow = 0
    let fast = 0
    while (fast < nums.length) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast]
            slow++
        } 
        fast++
    }
    return slow 
};
```
## 有序数组的平方
给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

示例 1：

输入：nums = [-4,-1,0,3,10]
输出：[0,1,9,16,100]
解释：平方后，数组变为 [16,1,0,9,100]
排序后，数组变为 [0,1,9,16,100]
### 思路
因为数组本身就是有序的，所以平方之后最大的值要么是最左边，考虑最左边是负数的情况，比如[-4, 2, 3]，这种情况下，平方之后，16就是最大的，要放在最后面；要么是最右边，考虑都是正数的情况，所以定义两个指针分别指向首尾，每次只判断首尾平方之后的值，取出最大的值按倒序放在新数组里面，然后移动首指针或者尾指针
```js
function sortedSquares(nums: number[]): number[] {
    const res = Array(nums.length)
    let k = nums.length - 1
    let i = 0
    let j = nums.length - 1
    while (i <= j) {
        const newI = Math.pow(nums[i], 2)
        const newJ = Math.pow(nums[j], 2)
        // 最左边的平方之后大，就把他更新到新数组的非空末尾，同时首指针往前走
        if (newI > newJ) {
            res[k] = newI
            i++
        } else {
            // 反之 同理
            res[k] = newJ
            j--
        }
        k--
    }
    return res
};
```
## 长度最小的子数组
给定一个含有 n 个正整数的数组和一个正整数 target 。
找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

示例 1：

输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
### 思路
用滑动窗口，想象一下，用一个窗口框住若干个数字，判断里面的和是否是大于等于target，这个思路的关键是如何确定窗口的开始和结束索引，
然后开始和结束索引应该怎么移动，想象一下，如果窗口里的和小于target，应该左指针（开始索引）向前走，还是右指针（结束索引）向前走，如果左指针走，那么窗口变小，和也变小，这肯定是不对的，所以应该是右指针往前走，扩大窗口，反之，如果窗口内的和大于target了，此时左指针就往前走，缩小窗口。
按照以上思路，
1. 首先还是确定窗口的区间定义是左闭右闭还是左闭右开，这次使用左闭右开，然后再思考循环的跳出条件，因为这里大于等于target的子序列可能有多个，所以需要右指针走到最后，才能找出所有的子序列，因为是右开，所以跳出条件应该是 j >= len,
2. 然后循环内部应该先计算窗口内序列的和，因为右开，所以窗口内的序列应该是slice(i, j)，不包含j
3. 再判断当前窗口内序列的和是否大于等于target，还是小于target
    - 如果是小于target，就把右指针的值加到窗口和里，然后往前走一步
    - 如果是大于等于，就计算序列长度，更新最小序列长度的值，然后把窗口最左边的值去掉，左指针走一步，继续往前找
```js
function minSubArrayLen(target: number, nums: number[]): number {
    let i = 0
    let j = 0
    let total = 0 // 记录窗口内的和
    let min // 记录最小序列的长度
    while (j <= nums.length) {
        total += nums[j]
        if (total >= target) {
            if (min) {
                min = Math.min(min, j - i + 1)
            } else {
                min = j - i + 1
            }
            total -= nums[i]
            i++
        }
    }
    return min !== undefined ? min : 0
};
```
## 顺时针打印矩阵
```js
var spiralOrder = function(matrix) {
    const res = []
    // 当前行 当前列 行要走的步数 列要走的步数
    let row = 0, column = 0, rowStep = 0, columnStep = 1
    if (matrix.length) {
        const total = matrix.length * matrix[0].length
        for (let i = 0; i < total; i++) {
            res.push(matrix[row][column])
            // 访问过的置空
            matrix[row][column] = ' '
            // 计算下一行 和下一列
            const nextRow = row + rowStep
            const nextColumn = column + columnStep
            // 判断下个访问的位置是否越界或者已经访问过
            // 如果越界或者已经访问过 就需要改变行步数和列步数
            // 四个方向的行步数和列步数 依次为 
            // 0 1  行不动 列+1
            // 1 0  行+1 列不动
            // 0 -1  行不动 列-1
            // -1 0 行-1 列不动
            // 其实就是什么时候行动 什么列动
            if (nextRow < 0 || nextRow === matrix.length || nextColumn < 0 || nextColumn === matrix[0].length || matrix[nextRow][nextColumn] === ' ') {
                const temp = rowStep
                rowStep = columnStep
                columnStep = -temp
            }
            // 这里再计算下一行和下一列的位置
            row += rowStep
            column += columnStep
        }
    }
    return res
};
```
## 螺旋矩阵2
上面题的变种
```js
function generateMatrix(n: number): number[][] {
    const res = Array(n)
    for (let i = 0; i < res.length; i++) {
        res[i] = Array(n)
    }
    const total = n * n
    let count = 1
    let row = 0, column = 0, rowStep = 0, columnStep = 1
    while (count <= total) {
        res[row][column] = count
        count++
        const nextRow = row + rowStep
        const nextColumn = column + columnStep
        if (nextRow < 0 || nextRow === n || nextColumn < 0 || nextColumn === n || res[nextRow][nextColumn]) {
            const temp = rowStep
            rowStep = columnStep
            columnStep = -temp
        }
        row += rowStep
        column += columnStep
    }
    return res
};
```
## 移动0
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
### 思路
用快慢指针，两个指针同时从头出发，必须都从头开始，快指针找到非0的数字，就交换到慢指针的位置，慢指针向前走
循环结束条件是快指针走到终点
```js
function moveZeroes(nums: number[]): void {
    let slow = 0
    let fast = 0
    while (fast < nums.length) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]]
            slow++
        }
        fast++
    }
};
```
## 盛最多水的容器
给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
返回容器可以储存的最大水量。
### 思路
两条垂线之间的容量 = 短垂线的高度 * 两条垂线之间的距离
考虑用暴力解法，只能是嵌套的两层for循环，把所有的排列组合列出来，然后取最大值，时间复杂度就是O(n^2)
如果想只用O(n)的时间，就只能用双指针的思路
定义两个指向首尾的指针，双指针的关键在于什么条件下移动哪个指针能得到更优解，
假设现在两个指针分别指向首尾，首位置的垂线长度是2，尾位置的垂线的长度是3，他们现在之间的距离是3，
- 考虑先移动尾指针，首位置不动，距离减1是2，不管现在首位置的垂线是不是最短的，根据容量的计算方法，最大容量都不会超过 1 * 2
- 考虑先移动首指针，同理得出，最大容量都不会超过3 * 2，
- 两者对比，可以得出，应该移动最短的那边，才有可能得出更优解，最短的那一边就直接被抛弃了
- 再考虑一下如果直接抛弃短的那一边会不会有遗漏的情况，容易想到如果中间还有比尾垂线还长的垂线呢，
    - 初始情况的容量为2 * 3，因为现在距离最远，这个容量已经是固定垂线2能得到的最大容量了，就算中间还有比尾垂线更长的，前面的计算式子变化的也只是距离变量，得到的最大容量不会超过2 * 3，由此可以得出垂线2可以直接被抛弃
```js
function maxArea(height: number[]): number {
    let start = 0
    let end = height.length - 1
    let total = 0
    const getTotal = (start, end) => {
        const min = Math.min(height[start], height[end])
        return min * (end - start)
    }
    while (start < end) {
        console.log(start, end)
        const curTotal = getTotal(start, end)
        total = Math.max(total, curTotal)
        if (height[start] > height[end]) {
            end--
        } else {
            start++
        }

    }
    return total
};
```

## 最大子数组的和
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
### 思路
问题的关键在于，和在累加的过程中是不是要继续加上下一个元素，如果都是正数，那就是一直加就可以，但是这里会有负数，考虑加一个负数进来会有什么情况，
 - 和变小了但还是正数，4 + -1 = 3，这种情况还要继续加，再加还能继续变大
 - 和变为负数了，4 + -5 = -1，这种情况就可以把累加和归零了，因为这个-1，给后面只能使和变小，所以索性归零，后面的重新开始累加
```js
var maxSubArray = function(nums) {
    if (nums.length === 0) return 0
    let max = nums[0]
    let sum = 0
    for (const num of nums) {
        // 更新最大和 
        max = Math.max(max, sum + num)
        // 如果累加当前元素成了负数就直接归 0
        sum = Math.max(sum + num, 0) 
    }
    return max
};
```
## 合并区间
以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
示例 1：

输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
### 思路
首先先按照左端点排序，这样就可以挨个处理，不用处理前面还要去后面找了
然后考虑什么时候能合并，什么时候不能合并
[1, 3] [2, 4]
这个时候是可以合并的，因为第一个区间的右端点比第二个区间的左端点大
1 2 3
  2 3 4
可以看出是有重叠的，可以合并为 1 2 3 4
前后区间的右左端点相等也算是有重叠，比如
1 2 3
    3 4
也可以合并为 1 2 3 4
如果前区间的右端点比后区间的左端点小呢
1 2 3
      4 5
这个时候就不能合并了
所以只能两种情况能合并，前区间的右端点大于等于后区间的左端点
```js
var merge = function(intervals) {
    const list = intervals.sort((a, b) => a[0] - b[0])
    const res = [list[0]] // 存放结果
    for (let i = 1; i < list.length; i++) {
        const last = res.at(-1)  // 结果数组中的最后一个是正在合并的 拿出来
        const cur = list[i]
        // 前区间的右端点大于等于后区间的左端点
        if (cur[0] <= last[1]) {
            // 合并之后的右端点 取两个右端点的最大值
            last[1] = Math.max(last[1], cur[1])
        } else {
            res.push(cur)
        }
    }
    return res
};
```
## 轮转数组
给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

示例 1:

输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]
### 思路
这道题的难点在于如何原地处理，轮转其实就是把最后面的k个元素移到前面来。如果不考虑顺序问题，怎么能先把最后的k个元素放到前面来，可以将整个数组进行翻转。对于示例数组，可得到
    [7,6,5,4,3,2,1]
再看现在的数组和答案的区别，首先看跑到前面来的这k个元素，是
 [7,6,5]
结果数组中是 
 [5,6,7]
很明显，把这k个元素再反转就可以了，对于后面一截也是一样的道理
[4,3,2,1] -> [1,2,3,4]
细节：可能会存在 k 大于数组长度的情况，考虑
[1,2,3] k = 4
数组轮转nums.length次，还是原样，所以这个case，最后相当于是轮转了一次，也就是k % nums.length 次
```js
var rotate = function(nums, k) {
    if (nums.length === 1) return
    nums.reverse()
    if (k > nums.length) k = k % nums.length
    const leftMid = Math.floor(k / 2)
    // 反转数组只需要遍历长度/2次就行了
    for (let i = 0, j = k - 1; i < leftMid; i++, j--) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
    }
    const rightMid = Math.floor((nums.length - k) / 2)
    for (let i = k, j = nums.length - 1; i < k + rightMid; i++, j--) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
    }
};
```
## 除自身以外数组的乘积
给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

请 不要使用除法，且在 O(n) 时间复杂度内完成此题。

示例 1:

输入: nums = [1,2,3,4]
输出: [24,12,8,6]
### 思路
需要计算除自己以外所有元素的乘积，可以分为当前元素的前缀积和后缀积，可以使用两轮循环来分别计算
第一轮循环从前往后计算前缀积 第二轮循环计算后缀积
用一个额外的变量来保存前缀积和后缀积，每轮循环中，把前缀积或者后缀积放到当前位置，然后把当前元素乘到前缀积或者后缀积中
注意，不能原地修改数组，因为第二轮循环的时候，还是需要用到数组中的原始元素的，如果第一轮原地修改了，就拿不到原来的原始元素了
```js
var productExceptSelf = function(nums) {
    let pre = 1
    const res = []
    for (let i = 0; i < nums.length; i++) {
        // 把前缀积放到当前位置上
        res[i] = pre
        // 当前元素乘到前缀积上 给后面的用
        pre *= nums[i]
    }
    pre = 1
    for (let i = nums.length - 1; i >= 0; i--) {
        // 此时的res[i] 是前缀积  再乘后缀积 就是当前位置的结果了
        res[i] *= pre
        pre *= nums[i]
    }
    return res
};
```
## 矩阵置0
给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
### 思路
用两遍循环，第一遍循环用两个额外的map保存哪一行哪一列有0，第二遍循环根据map中的记录判断当前位置是否要置为0
```js
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
    const x = {}
    const y = {}
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j]) === 0 {
                x[i] = 1
                y[j] = 1
            }
        }
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (x[i] || y[i]) matrix[i][j] = 0
        }
    }
};
```
## 螺旋矩阵
给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
### 思路
用两个变量表示下一步，行要走的步数 列要走的步数，最开始row = 0, column = 1
然后考虑什么时候要换方向，
    行下一步走出了头或者尾
    列下一步走出了头或者尾
    下一步是已经走过的
然后考虑怎么换 按顺时针的方向，应该是 
0 1 行不动 列+1
1 0 行+1 列不动
0 -1 行不懂 列-1
-1 0 行-1 列不动
换方向的规律是 下一个方向的行步数是上一个方向的列步数 下一个方向的列步数是上一个方向的行步数的负数
```js
// 上面有
```
## 旋转图像
给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。
### 思路
先上下翻转 再对角翻转
1 2 3     7 8 9      7 4 1
4 5 6  -> 4 5 6  ->  8 5 2
7 8 9     1 2 3      9 6 3
上下翻转可以直接reverse，对角翻转怎么操作， 看坐标
00 01 02 
10 11 12
20 21 22
其实就是 x 坐标值和 y 坐标值互换
```js
var rotate = function(matrix) {
    if (matrix.length === 0) return []
    matrix.reverse()
    for (let i = 0; i < matrix.length; i++) {
        // 为什么要从 i + 1 开始 
        // 看上面的例子 当遍历到 i = 1 时，也就是第二行时，第二行第一个已经被处理过了（和第一行第二个换过了），所以直接从第二个开始
        for (let j = i + 1; j < matrix[0].length; j++) {
            const temp = matrix[i][j]
            matrix[i][j] = matrix[j][i]
            matrix[j][i] = temp
        }
    }
};
```



# 双指针
## 移除元素
给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素。元素的顺序可能发生改变。然后返回 nums 中与 val 不同的元素的数量。

假设 nums 中不等于 val 的元素数量为 k，要通过此题，您需要执行以下操作：

更改 nums 数组，使 nums 的前 k 个元素包含不等于 val 的元素。nums 的其余元素和 nums 的大小并不重要。
返回 k。
### 思路
用双指针，i, j, j在前面找不等于 val 的元素，找到后就赋值到 i 的位置上，同时 i 也向前走一步，最后前 i 个元素都是不等于 val 的元素，结果返回 i 即可
```js
var removeElement = function(nums, val) {
    let i = 0
    let j = 0
    while (j < nums.length) {
        if (nums[j] !== val) {
            nums[i] = nums[j]
            j++
            i++
        } else {
            j++
        }
    }
    return i
};
```

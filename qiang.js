// 聚集相同的元素
const list = ['a', 'c',]
function foo(arr) {
  let res = []
  let start = 0
  while (start < arr.length) { 
    let index = start + 1
    for (let i = index; i < arr.length; i++) {
      if (arr[i] === arr[start]) {
        let temp = arr[index]
        arr[index] = arr[i]
        arr[i] = temp
        index++
      }
    }
    res.push(arr.slice(start, index))
    start = index
  }
  return res.sort((a, b) => a.length - b.length).reduce((pre, cur) => pre.concat(cur), [])
}
console.log(foo(list))

// M 个数字找出两两相加等于 N 的集合
// const arr = [2,5,3,4,6,1,8]
// function foo(arr, target) {
//     const map = {}
//     for (let num of arr) {
//         map[num] = target - num
//     }
//     const res = []
//     for (let key in map) {
//         if (arr.includes(map[key])) {
//             res.push([Number(key), map[key]])
//         }
//         if (res.length === Math.floor(arr.length / 2)) break
//     }
//     return res
// }
// console.log(foo(arr, 7))
const arr = [2,5,3,4,6,1,8]
function foo(arr, target) {
    const res = []
    arr.sort((a, b) => a - b)
    let i = 0
    let j = arr.length - 1
    while (i < j) {
        if (arr[i] + arr[j] > target) {
            j-- 
        } else if (arr[i] + arr[j] < target) {
            i++
        } else {
            res.push([arr[i], arr[j]])
            i++
            j--
        }
    }
    return res
}
console.log(foo(arr, 7))

// {
//     a: {
//         b: {
//             null
//         }
//     }
// }
const str = 'a.b.c.d....'
// function foo(str) {
//     const list = str.split('.').filter(Boolean)
//     console.log(list)
//     const result = {}
//     list.reduce((pre, cur, index) => {
//         console.log(index)
//         pre[cur] = index === list.length - 1 ? null : {}
//         return pre[cur]
//     }, result)
//     return result
// }
function foo(str) {
    const list = str.split('.').filter(Boolean)
    let res = {}
    let index = list.length - 1 
    while (index > -1) {
        const temp = {}
        temp[list[index]] = index === list.length - 1 ? null : res
        res = temp
        index--
    }
    return res

}
console.log(foo(str))

// 深度优先遍历
function dfs(root) {
    const stack = []
    stack.push(root) 
    const res = []
    while (stack.length) {
        const node = stack.pop()
        res.push(node.val)
        if (node.right) {
            stack.push(node.right)
        }
        if (node.left) {
            stack.push(node.left)
        }
    }
}

function dfs1(root) {
    if (!root) return 
    console.log(root.val)
    dfs1(root.left)
    dfs1(root.right)
}


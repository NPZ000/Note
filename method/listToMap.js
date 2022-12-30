function listToMap(arr) {
    let res = null
    const map = {}
    for (const item of arr) {
        const { id, pid } = item
        // 有可能它的下级元素已经出现过了，这步操作已经替他做过了
        if (!map[id]) {
            map[id] = {
                children: []
            }
        }
        map[id] = {
            ...item,
            children: map[id].children
        }
        const newItem = map[id]
        if (pid === 0) {
            res = newItem
        } else {
            if (!map[pid]) {
                // 如果它的上级还没出现，就替他先在map里占个位置 顺便开个children
                map[pid] = {
                    children: []
                }
            }
            map[pid].children.push(newItem)
        }
    }
    return res
}

const arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 6, name: '部门6', pid: 3},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]
console.log(JSON.stringify(listToMap(arr)))
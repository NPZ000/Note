// 手撕：写一个函数将一个对象里面类似'a.b.c': 2的key-value转换成嵌套的对象{a:{b:{c:2}}}
function trans(obj) {
    const res = {}
    for (const key in obj) {
        // 把'a.b.c' 分割成数组
        const keyList = key.split('.')
        // 拿到结果的引用
        let temp = res
        for (let i = 0; i < keyList.length; i++) {
            // 如果是叶子节点 就直接用 key 取值
            if (i === keyList.length - 1) {
                temp[keyList[i]] = obj[key]
            } else {
                // temp 指针向更深一层 比如从 a 到 b
                if (temp[keyList[i]]) {
                    temp = temp[keyList[i]]
                } else {
                    temp[keyList[i]] = {}
                    temp = temp[keyList[i]]
                }
            }
        }
    }
    return res
}

console.log(trans({'a.b.c': 2, 'a.b.d': 2}))
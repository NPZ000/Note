// 手撕：写一个函数将一个对象里面类似'a.b.c': 2的key-value转换成嵌套的对象{a:{b:{c:2}}}
function trans(obj) {
    const res = {}
    for (const key in obj) {
        const keyList = key.split('.')
        let temp = res
        for (let i = 0; i < keyList.length; i++) {
            if (i === keyList.length - 1) {
                temp[keyList[i]] = obj[key]
            } else {
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
/**
 * 
 * @param {*} data 
 * @param {为了解决循环引用的问题} map 
 * @returns 
 */
function cloneDeep(data, map = new Map()) {
    if (typeof data !== 'object') {
        return data
    } else {
        if (data === null) {
            return null
        }
        let res = null
        const type = Object.prototype.toString.call(data)
        const typeList = ['[object Object]', '[object Array]', '[object Map]', '[object Set]']
        if (typeList.includes(type)) {
            // 假如data是个数组，那么它的constror就是数组的构造函数，调用数组的构造函数就会生成新的数组
            res = new (data.constructor)()
        }
        
        // 解决循环引用的问题
        if (map.get(data)) {
            return map.get(data)
        }

        map.set(data, res)
        
        if (type === '[object Map]') {
            for (const [key, value] of data) {
                res.set(key, cloneDeep(value, map))
            }
            return res
        }
        if (type === '[object Set]') {
            data.forEach(item => {
                res.add(cloneDeep(item, map))
            })
            return res
        }
        if (type === '[object Object]' || type === '[object Array]') {
            for (const key in data) {
                res[key] = cloneDeep(data[key], map)
            }
            return res
        }
    }
}
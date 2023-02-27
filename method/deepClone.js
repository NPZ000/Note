/**
 * 
 * @param {*} data 
 * @param {为了解决循环引用的问题} map 
 * @returns 
 */
function cloneDeep(data, map = new Map()) {
    // 如果是基本类型的数据 就直接返回
    if (typeof data !== 'object') {
        return data
    } else {
        // typeof null 也是 object
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

        // 这里可以先直接把空的res给set进去 是因为他此时已经是个引用类型的值了
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

function clone(data, map = new Map()) {
    if (typeof data !== 'object') {
        return data
    } else {
        if (data === null) {
            return data
        }
        let res = null
        const type = Object.prototype.toString.call(data)
        const typeList = ['[object Object]', '[object Array]', '[object Map]', '[object Set]']
        if (typeList.includes(type)) {
            res = new (data.constructor)()
        }
        if (map.get(data)) {
            return map.get(data)
        }
        map.set(data, res)
        if (type === '[object Map]') {
            for(const [key, value] of data) {
                res.set(key, clone(value, map))
            }

        }
        if (type === '[object Set]') {
            for (const item of data) {
                res.add(clone(item, map))
            }
        }
        if (type === '[object Object]') {
            for(const key in data) {
                res[key] = clone(data[key], map)
            }
        }
        if (type === '[object Array]') {
            for (const item of data) {
                res.push(clone(item, map))
            }
        }
        return res
    }
}
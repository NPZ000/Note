function stringify(data) {
    const type = typeof data
    if (type !== 'object') {
        let res = data
        // 对于 NaN 和 infinity 都返回 null
        if (Number.isNaN(data) || data === Infinity) {
            return 'null'
        }
        // 对于 undefined function symbol 都返回 undefined
        if (['undefined', 'function', 'symbol'].includes(type)) {
            return 'undefined'
        }
        // 字符串还需要用双引号包裹一下
        if (type === 'string') {
            res = `"${data}"`
        }
        return String(res)
    } else {
        // typeof null 也是 'object'
        if (data === null) {
            return 'null'
        }
        // 有 toJSON 方法的 先调用一下 再递归调用stringify
        if (data.toJSON && typeof data.toJSON === 'function') {
            return stringify(data.toJSON())
        } else if (Array.isArray(data)) {
            const res = []
            data.forEach((item, index) => {
                const type = typeof item
                // 数组中元素是这三种类型的 都统一转成 null
                if (['undefined', 'function', 'symbol'].includes(type)) {
                    res[index] = 'null'
                } else {
                    // 其他的递归掉用stringify方法
                    res[index] = stringify(item)
                }
            })
            // 这里为什么又用中括号包裹，原来的中括号呢，因为这里其实调用了一下toString方法，数组调用这个方法会把中括号去掉
            return `[${res}]`.replace(/'/g, '"')
        } else {
            const res = []
            // 对于是普通的对象这种
            for (const key in data) {
                // 忽略掉key类型是symbol的
                if (typeof key !== 'symbol') {
                    const type = typeof data[key]
                    // 忽略掉值类型是这三种的
                    if (!['undefined', 'function', 'symbol'].includes(type)) {
                        res.push(`"${key}":${stringify(data[key])}`)
                    }        
                }
            }
            return `{${res}}`.replace(/'/g, '"')
        }
        
    }
}

function IStringify(data) {
    const type = typeof data
    if (type !== 'object') {
        let res = data
        if (Number.isNaN(res) || res === Infinity) {
            return 'null'
        }
        if (['undefined', 'function', 'symbol'].includes(type)) {
            return 'undefined'
        }
        if (type === 'string') {
            res = `"${data}"`
        }
        return String(res)
    } else {
        if (data === null) {
            return 'null'
        }
        if (data.toJSON && typeof data.toJSON === 'function') {
            return IStringify(data.toJSON())
        }
        if (Array.isArray(data)) {
            const res = []
            data.forEach((item, index) => {
                const type = typeof item
                if (['undefined', 'function', 'symbol'].includes(type)) {
                    res[index] = 'null'
                } else {
                    res[index] = IStringify(item)
                }
            })
            return `[${res}]`.replace(/'/, '"')
        } else {
            const res = []
            for(const key in data) {
                const type = typeof data[key]
                if (typeof key !== 'symbol') {
                    if (!['undefined', 'function', 'symbol'].includes(type)) {
                        res.push(`"${key}":${IStringify(data[key])}`)
                    }
                }
            }

            return `{${res}}`.replace(/'/, '"')
        }
    }
}
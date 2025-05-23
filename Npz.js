function promiseAll(list) {
    return new Promise((resolve, reject) => {
        const res = []
        if (list.length === 0) resolve([])
        let count = 0
        list.forEach((item, index) => {
            Promise.resolve(item).then(value => {
                res[index] = value
                count++
                if (count === list.length) resolve(res)
            }).catch(reject)
        })
    })
}

function allSettled(list) {
    return new Promise((reslove, reject) => {
        if (list.length === 0) resolve([])
        const res = []
        let count = 0
        list.forEach((item, index) => {
            Promise.resolve(item).then(value => {
                res[index] = {
                    value,
                    status: 'fulfilled'
                }
                count++
                if (count === list.length) resolve(res)
            }).catch(err => {
                res[index] = {
                    status: 'rejected',
                    reason: res
                }
                if (count === list.length) resolve(res)
            })
        })

    })
}
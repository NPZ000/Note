class Url {
    constructor(url) {
        this.url = url
    }

    //提取url中的参数
    parseParams() {
        if (!this.url.includes('?')) return {}
        const paramsStr = this.url.split('?')[1]
        const res = {}
        const paramsList = paramsStr.split('&').filter(Boolean)
        for (const item of paramsList) {
            const [key, value] = item.split('=')
            // url 上有可能有被编码过的特殊字符 所以这里需要 decode
            const decodeKey = decodeURIComponent(key)
            const decodeValue = decodeURIComponent(value)
            res[decodeKey] = decodeValue
        }
        return res
    }

    setParams(data) {
        let paramsStr = this.url.includes('?') ? '&' : '?'
        for (const key in data) {
            // 不管 key 和 value 是什么类型，统统转码
            // 不用 encodeURI 的原因是 它不会对一些特殊字符进行编码 例如 & + = 这些对于 URL 都是特殊字符
            paramsStr += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`
        }
        return this.url + paramsStr.slice(0, -1)
    }

    delParam(key) {
        if (!this.url.includes(key)) return this.url
        const [urlStr, paramStr] = this.url.split('?')
        const paramsList = paramStr.split('&')
        const filterList = paramsList.filter(item => {
            const paramKey = item.split('=')[0]
            return key !== paramKey
        })
        if (filterList.length === 0) {
            return urlStr
        } else {
            return urlStr + '?' + (filterList.length > 1 ? filterList.join('&') : filterList)
        }
    }
}

const url = 'www.baidu.com?a=1&b=2&b=4'
// console.log(new Url().parseParams(url))
console.log(new Url(url).delParam('b'))
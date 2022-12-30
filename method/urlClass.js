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
            res[key] = value
        }
        return res
    }

    setParams(data) {
        let paramsStr = this.url.includes('?') ? '&' : '?'
        for (const key in data) {
            paramsStr += `${key}=${data[key]}&`
        }
        return this.url + paramsStr.slice(0, -1)
    }

    delParams(key) {
        if (!this.url.includes(key)) return this.url
        const [urlStr, paramStr] = this.url.split('?')
        const paramsList = paramStr.split('&')
        const filterList = paramsList.filter(item => !item.includes(key))
        if (filterList.length === 1) {
            return urlStr + '?' + filterList
        } else {
            return urlStr + '?' + filterList.join('&')
        }
    }
}

const url = 'www.baidu.com?a=1&b=2'
// console.log(new Url().parseParams(url))
console.log(new Url(url).delParams('b'))
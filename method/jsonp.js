

function jsonp(url, data, callback='callback') {
    const dataStr = url.includes('?') ? '&' : '?'
    for (let key in data) {
        dataStr += `${key}=${data[key]}&`
    }
    dataStr += `callback=${callback}`

    const script = document.createElement('script')
    script.src = url + dataStr
    document.body.appendChild(script)

    return new Promise((resolve, reject) => {
        window[callback] = data => {
            try {
                resolve(data)
            } catch(err) {
                reject(err)
            }
        }
    })
}

function jsonP(url, data, callback='callback') {
    let dataUrl = url.includes('?') ? '?' : '&'
    for (const key in data) {
        dataUrl += `${key}=${data[key]}&`
    }
    dataUrl += `callback=${callback}`
    const script = document.createElement['script']
    script.src = url + dataUrl
    document.body.appendChild(script)
    return new Promise((resolve, reject) => {
        window[callback] = data => {
            try {
                resolve(data)
            } catch(e) {
                reject(e)
            }
        }
    })
}
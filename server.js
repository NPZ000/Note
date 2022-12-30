const http = require('http')
http.createServer((req, res) => {
    console.log(req.url)
    res.writeHead('200', {'Content-type' : 'text/json'})
    res.end(`callback(${JSON.stringify({b: 1})})`)
}).listen(3000)

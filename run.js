// 为了演示方便，我们在此用fetchImage函数来模拟异步请求图片，返回成功提示
function fetchImage(url) {
  // 模拟请求的响应时间在0 - 1s之间随机
  const timeCost = Math.random() * 1000;
  return new Promise((resolve) => setTimeout((url) => {
    resolve(url)
  }, timeCost, "get: " + url));
}

// 待请求的图片
const imageUrls = [
  "pic_1.png",
  "pic_2.png",
  "pic_3.png",
  "pic_4.png",
  "pic_5.png",
  "pic_6.png",
];

function limitFetch(urls, max) {
    const list = [...urls]
    const res = new Map()

    // 取出一个 URL 发起请求  递归进行这个动作
    function run() {
        if (list.length) {
            const url = list.shift()
            return fetchImage(url).then(response => {
                res.set(url, response)
                return run()
            })
        }
    }

    const promiseList = Array(Math.min(list.length, max))
        .fill(Promise.resolve())
        .map(item => item.then(res => {
            return run()
        }))
    return Promise.all(promiseList).then((result) => {
        console.log(res)
        return urls.map(url => res.get(url))
    })
}

limitFetch(imageUrls, 3).then(res => {
    console.log(res)
})

// function limitFetch(urls, max) {
//     const resp = new Map()
//     const list = [...urls]
//     function run() {
//         if (list.length) {
//             const url = list.shift()
//             return fetchImage(url).then(res => {
//                 resp.set(url, res)
//                 return run()
//             })
//         }
//     }

//     const limitPromise = Array(Math.min(max, list.length))
//         .fill(Promise.resolve())
//         .map(item => item.then(run))

//     return Promise.all(limitPromise).then(() => urls.map(url => resp.get(url)))
// }


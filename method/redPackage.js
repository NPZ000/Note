// 两倍均值 每个包的的金额范围是 0.01 到 剩余金额除以剩余个数的值再乘以2 从这个范围内随机出一个数
function redPackage(num, money) {
    const res = []
    while (num > 1) {
        const random = Math.random()
        let randomMoney = random * (money/num*2)
        if (randomMoney < 0.01) {
            randomMoney = 0.01
        } else {
            randomMoney = Math.round(randomMoney * 100) / 100
        }
        res.push(randomMoney)
        money -= randomMoney
        num--
    }
    res.push(Math.round(money * 100) / 100)
    return res
}
// for (let i = 0; i < 100; i++) {
    console.log(redPackage(3, 10))
// }
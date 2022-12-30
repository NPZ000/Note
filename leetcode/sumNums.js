// 求 1+2+...+n ，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。

function sumNum(n) {
    let res = 0
    const sum = n => {
        // 这里用 && 代替 if ，如果前面的表达式为 false 则后面的表达式不会执行，这个叫做逻辑短路
        n > 1 && sum(n - 1)
        res += n
    }
    sum(n)
    return res
}
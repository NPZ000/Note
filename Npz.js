function foo(list) {
    const dfs = (i, j) => {
        if (i <= j) return true
        let p = i
        while (list[p] < list[j]) p++
        const m = p
        while (list[p] > list[j]) p++
        return p === j && dfs(i, m - 1) && (m, j - 1)
    }
    return dfs(0, list.length - 1)
}
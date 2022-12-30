class ITaskPoll {
    constructor(max) {
        this.taskList = []
        this.max = max
    }

    addTask(task, args) {
        // 返回一个 promise 给 promise.all 接收
        return new Promise(resolve => {
            // 如果当前未达到限制数量 就直接执行任务 并把返回值 resolve 出去
            if (this.max) {
                this.max--
                resolve(this.runTask(task, args))
            } else {
                // 否则 就先把任务缓存到队列中
                // 注意这里把当前的 resolve 也存进去，是因为之后只有使用这个resolve才能和外面的promiseAll 建立联系，并且把返回值 resolve 出去
                this.taskList.push({
                    task,
                    args,
                    resolve
                })
            }
        })
    }

    poolTask() {
        // 拉取新任务并执行 并且resolve任务的返回值
        if (this.taskList.length && this.max) {
            this.max++
            const {
                task: fn,
                args: arg,
                resolve: taskAResolve
            } = this.taskList.shift()
            taskAResolve(this.runTask(fn, arg))
        }
    }

    runTask(task, args) {
        // 执行任务 返回任务结果
        // 这里需要在任务的finally的回调中去拉取新任务，也就是说当一个任务执行完毕之后就去再拉一个新任务来
        const res = task(args)
        res.finally(() => {
            this.max--
            this.poolTask()
        })
        return res
    }
}

const taskArr = [1000, 3000, 200, 1300, 800, 2000];
const asyncTask = timeout => new Promise(resolve => setTimeout(() => {
    console.log(timeout)
    resolve(timeout)
}, timeout))

const newTask = new ITaskPoll(2)
async function runTask() {
    console.time('time')
    await Promise.all(taskArr.map(item => newTask.addTask(asyncTask, item)))
    console.timeEnd('time')
}
runTask()

  
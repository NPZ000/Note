class TaskPoll {
    constructor(max) {
        this.max = max
        this.queue = []
    }

    addTask(task) {
        return new Promise(resolve => {
            this.queue.push(task)
            if (this.max) {
                this.max--
                resolve(this.runTask(this.queue.shift()))
            }
        })
    }

    poolTask() {
        if (this.queue.length && this.max) {
            this.max--
            this.runTask(this.queue.shift())
        }
    }

    runTask(task) {
        const res = Promise.resolve(task)
        res.finally(() => {
            this.max++
            this.poolTask()
        })
        return res
    }
}

  const task = timeout => new Promise((resolve) => setTimeout(() => {
    resolve(timeout);
  }, timeout))

  const taskList = [1000, 3000, 200, 1300, 800, 2000];

const taskPoll = new TaskPoll(2)

  async function startNoConcurrentControl() {
    console.time('NO_CONCURRENT_CONTROL_LOG');
    const res = await Promise.all(taskList.map(item => taskPoll.addTask(task(item))));
    console.log(res)
    console.timeEnd('NO_CONCURRENT_CONTROL_LOG');
  }

  startNoConcurrentControl();
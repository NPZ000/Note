async function parallelPool(tasks, poolLimit) {
    const ret = [];        // 存储任务结果
    const executing = [];  // 当前执行中的任务队列
    let index = 0;         // 任务指针
  
    // 创建包装任务以保持原始顺序
    const wrappedTasks = tasks.map((task, i) => ({
      index: i,
      task: () => Promise.resolve().then(task)
    }));
  
    // 执行一批任务的函数
    async function runPool() {
      while (index < wrappedTasks.length) {
        if (executing.length >= poolLimit) {
          // 等待最快完成的任务
          await Promise.race(executing).catch(e => e);
          continue;
        }
  
        // 获取当前任务并移动指针
        const { index: taskIndex, task } = wrappedTasks[index++];
        
        // 创建包含清理逻辑的Promise
        const promise = task()
          .finally(() => {
            // 任务完成后从执行队列中移除
            executing.splice(executing.indexOf(promise), 1);
          });
  
        // 记录结果并保持执行队列
        ret[taskIndex] = promise;
        executing.push(promise);
      }
    }
  
    // 启动任务池并等待全部完成
    await runPool();
    await Promise.allSettled(executing);
    
    // 等待所有结果解析后返回
    return Promise.allSettled(ret);
}
  
  // 示例用法
const tasks = [
    () => new Promise(resolve => setTimeout(() => resolve(1), 1000)),
    () => new Promise((_, reject) => setTimeout(() => reject(new Error(2)), 500)),
    () => new Promise(resolve => setTimeout(() => resolve(3), 800)),
    () => new Promise(resolve => setTimeout(() => resolve(4), 200)),
];

parallelPool(tasks, 2)
    .then(results => {
        console.log('Final results:');
        results.forEach((result, i) => {
        console.log(`Task ${i}:`, result.status, 
            result.status === 'fulfilled' ? result.value : result.reason.message);
        });
    });
//发布订阅实现 发布者 订阅者 事件管理中心

// 事件管理中心 提供发布功能给发布者用 提供订阅和取消订阅功能给订阅者用
class EventBus {
    constructor() {
        this.list = {}
    }

    // 订阅功能
    add(name, id, fn) {
        if (!this.list[name]) {
            this.list[name] = []
        } 
        this.list[name].push({
            id, fn
        })
    }

    // 发布功能
    emit(id, name, params) {
        if (name) {
            if (id) {
                this.list[name].forEach(item => {
                    if (item.id === id) {
                        item.fn(params)
                    }
                }) 
            } else {
                this.list[name].forEach(item => {
                    item.fn(params)
                })
            }
        }
    }

    // 取消订阅功能
    off(id, name) {
        if (name) {
            if (id) {
                this.list[name].forEach((item, index) => {
                    if (item.id === id) {
                        this.list[name].splice(index, 1)
                    }
                }) 
            } else {
                delete this.list[name]
            }
        }
    }
}

class EventEmiter {
    constructor() {
        this.handlers = {}
    }

    on(name, cb) {
        if (!this.handlers[name]) {
            this.handlers[name] = []
        }
        this.handlers[name].push(cb)
    }

    emit(name, ...args) {
        if (this.handlers[name]) {
            const handleList = this.handlers[name].slice()
            // 这里复制一份是因为 once 绑定的函数执行完之后会进行移除，
            // 比如 1 2 3 ，2 是 once 绑定的，他执行完之后被移除，forEach 是按索引进行遍历的，原来的 2 索引是 1，他被移除后
            // 后面的 3 上来顶替了它，此时 3 的索引变成了 1，此时 forEach 认为已经对索引 1 遍历过了，所以就会略过 3
            // 所以不要在 forEach 中对源数组进行删除元素的操作
            handleList.forEach(cb => {
                cb(...args)
            })
        }
    }

    off(name, cb) {
        if (this.handlers[name]) {
            const index = this.handlers[name].indexOf(cb)
            this.handlers[name].splice(index, 1)
        }
    }

    once(name, cb) {
        const wrap = (...args) => {
            cb(...args)
            this.off(name, wrap)
        }
        this.on(name, wrap)
    }
}

class Event {
    constructor() {
        this.map = {}
    }
    add(name, cb) {
        if (!this.map[name]) {
            this.map[name] = []
        }
        this.map[name].push(cb)
    }
    off(name, cb) {
        if (this.map[name]) {
            const index = this.map[name].indexOf(cb)
            index > -1 && this.map[name].splice(index, 1)
        }
    }
    emit(name, ...args) {
        if (this.map[name]) {
            const handleList = this.map[name].slice()
            handleList.forEach(item => {
                item(args)
            })
        }
    }
    once(name, cb) {
        const wrap = (...args) => {
            cb(args)
            this.off(name, wrap)
        }
        this.add(name, wrap)
    }
}

// 观察者实现
// 对象之间存在一对多的依赖关系 当一个对象的状态发生改变时 会通知所有依赖它的对象

// 客体
class Observe {
    constructor() {

    }
    update() {

    }
}

// 主体
class Subject {
    constructor() {
        // 客体列表
        this.list = []
    }

    // 添加客体
    add(observer) {
        this.list.push(observer)
    }

    // 通知客体触发update方法
    notify() {
        this.list.forEach(item => {
            item.update()
        })
    }
}
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
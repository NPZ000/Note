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

const a = new EventEmiter()
a.on('a', () => {console.log(1)})
a.on('a', () => {console.log(2)})
a.once('a', () => {console.log(3)})
a.on('a', () => {console.log(4)})
a.emit('a')
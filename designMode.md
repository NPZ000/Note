# 设计模式
核心思想：封装变化
将变与不变进行分离，确保变化的部分灵活，不变的部分稳定
# 工厂模式-简单工厂
- 构造器模式
```js
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
}
const user = new User(name, age, career)
```
不变的是 user 的属性，变的是属性的值，所以属性在构造器内部是固定的，但是属性的值是根据调用构造器传入的参数进行设置的
- 简单工厂模式
构造器是对一个实例的具体实现，而工厂模式是对构造器的再次包装，比如说这里的 user 再加一个字段 work，表示的不同 career 的职能，
他对于某一个 career 的 user 来说是不变的，所以刚开始考虑这样实现, 实现不同的工种的类继承 user 类，并设置不同的 work
```js
class User {
  constructor(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
  }
}
class Coder extends User {
    constructor(name , age, career) {
      super(name, age, career)
      this.work = ['写代码','写系分', '修Bug']
    }
}
class ProductManager extends User {
    constructor(name , age, career) {
      super(name, age, career)
      this.work = ['订会议室', '写PRD', '催更']
    }
}
```
但是如果有很多个工种，就得实现很多个不同的工种的类，其实这个 work 的值是根据 career 来设置的，所以我们可以把这个逻辑写在一个工厂函数或者类里面，
```js
class FactoryUser extends User {
  constructor(name, age, carrer) {
    super(name, age, career)
    switch(career) {
      case 'coder':
        this.work = ['写代码','写系分', '修Bug']
        break
      case 'product manager':
        this.work = ['订会议室', '写PRD', '催更']
        break
      default:
        this.work = []
    }
  }
} 
```
这样就可以用一个工厂类来代替不同的具体类的实现，其实就是用工厂模式来实现重复的逻辑，使我们的代码更加简短

# 工厂模式 - 方法模式
对方法模式的进一步总结，核心的工厂类不再负责所有产品的创建，而是将具体的创建工作交给具体的类去实现，对比上面的例子，用方法模式的话，就是单独实现每个工种的类
优点就是扩展性高，增加工种的话只需要再扩展类就可以了。缺点也很明显，工种过多的话，类的个数就会很多

# 工厂模式- 抽象工厂
为一组相关或相互依赖的对象提供一个接口，用来创建一个一组相关或者相互依赖的对象，与方法模式不同的是方法模式创建的是一个产品等级结构，而抽象模式针对的是多个产品等级结构，也就是说是相互依赖的并且具有多个等级的，比如一个手机，最顶端的就是手机这个类，然后手机是有操作系统和硬件组成的，所以手机就依赖这两个类，然后在下面，硬件又是有 cpu 和其他不同的零件组成的，所以又依赖这些零件类，
在抽象工厂模式中，有一个产品族的概念，是指位于不同等级结构中功能相关的产品组成的家族，比如这里的手机和组成手机的一堆东西
在抽象工程的每一个等级的产品类的实现中，都分为一个抽象类和具体类，抽象类用来声明生成具体产品的方法，具体类实现抽象类中定义的方法
在抽象工厂中有四个角色
抽象工厂：用于声明生成抽象产品的方法，不能直接调用
具体工厂：继承并实现抽象工厂定义的方法，具体一系列产品的创建
抽象产品：定义一类产品对象的接口，不能直接调用
具体产品：继承抽象产品类，通常在具体工厂里会选择具体的产品实现，来创建符合抽象工厂定义的方法返回的产品类型的对象
```js
// 抽象工厂
class MobilePhoneFactory {
  createOS() {
    throw new Error('不允许直接调用')
  }

  createHardWare() {
    throw new Error('不允许直接调用')
  }
}

// 具体工厂
class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
    return new AndroidOS()
  }

  createHardWare() {
    return new QualcommHardWare()
  }
}

// 抽象产品类
class OS {
  controlHardWare() {
    throw new Error('不能直接调用')
  }
}

// 具体产品类
class AndroidOS extends OS {
  controlHardWare() {
    
  }
}

class AppleOS extends OS {
  controlHardWare() {

  }
}
```
# 单例模式
保证一个类只有一个实例，并提供一个全局访问的方法
```js
class Store {
  constructor() {
    if (!Store.instance) {
      Store.instance = this
    }
    return Store.instance
  }
  // static getInstance() {
  //   if (!this.instance) {
  //     this.instance = new Store()
  //   }
  //   return this.instance
  // }
}
// const instance1 = Store.getInstance()
// const instance2 = Store.getInstance()
const instance1 = new Store()
const instance2 = new Store()
console.log(instance1 === instance2) // true

// 闭包写法
function StoreBase() {

}
const store = (function() {
  let instance
  return function() {
    if (!instance) {
      instance = new StoreBase()
    }
    return instance
  }
})()
const instance1 = store()
const instance2 = store()
console.log(instance1 === instance2) // true
```
实现一个全局的modal
```js
const modal = (function() {
  let modal = null
  return function() {
    if (!modal) {
      modal = document.createElement('div')
      modal.innerHTML = 'i am only'
      modal.id = 'modal'
      modal.style.display = 'none'
      document.body.append(modal)
    }
    return modal
  }
})()

document.getElementById('on').addEventListener('click', () => {
  const modalEl = modal()
  modalEl.style.display = 'block'
})

document.getElementById('close').addEventListener('click', () => {
  const modalEl = document.getElementById('modal')
  if (modalEl) {
    modalEl.style.display = 'none'
  }
})
```

# 原型模式
由于创建新对象的成本可能会很高，所以可以只创建一个实例对象，然后通过复制这个实例对象，来生成新的对象，在 java 的实现中，原型对象中
会实现一个 copy 方法，然后复制实例对象的时候会调用这个 copy 方法，为了使创建的多个新对象之前互相不影响，copy 方法的实现应该是
深拷贝的实现
在 js 中，原型式继承就是原型模式的实现，Object.create 接收一个对象作为原型，创建出一个以传入对象为原型的新对象，这就是原型模式
的目的，java 中实现深拷贝的 copy 方法只是原型模式的实现方法，并不是目的
所以原型模式的本质就是以一个对象为原型，生成一个新的对象

# 装饰器模式
如何在不修改已有逻辑的前提下，添加新的功能
借用上面 modal 的例子，如果要在弹框被关闭后，将打开按钮的文案改为快去登录，并且置灰
```js
class CloseButton {
    onClick() {
        const modal = document.getElementById('modal')
        if (modal) {
            modal.style.display = 'none'
        }
    }
}

class Decorator {
    constructor(closeButton) {
        this.closeButton = closeButton
    }

    onClick() {
        this.closeButton.onClick()
        this.changeStatus()
    }

    changeStatus() {
        this.changeText()
        this.disableButton()
    }

    changeText() {
        const openButton = document.getElementById('open')
        openButton.innerText = '快去登录'
    }

    disableButton() {
        const openButton = document.getElementById('open')
        openButton.setAttribute('disabled', true)
    }
}
const closeButton = new CloseButton()
const decorator = new Decorator(closeButton)

document.getElementById('close').addEventListener('click', () => {
    decorator.onClick() 
})
```

ES7 的装饰器写法
```js
function classDecorator(target) {
    target.hasDecorator = true
    return target
}

@classDecorator
class Button {

}

console.log(Button.hasDecorator) // true

function funcDecorator(target, name, descriptor) {
    const originMethod = descriptor.value
    descriptor.value = function() {
        console.log('我是装饰器的逻辑')
        originMethod.apply(this, arguments)
    }
    return descriptor
}

class Foo() {
    @funcDecorator
    click() {
        console.log('我是原有的逻辑')
    }
}

const a = new Foo()
a.click() 
// 我是装饰器的逻辑
// 我是原有的逻辑
```

react 的装饰器模式 - 高阶组件 HOC
```js
const BorderHoc = WrappedComponent => class extends Component {
    render() {
        return <div style={{border: 'solid 1pc red'}}>
            <WrappedComponent />
        </div>
    }
}

@BorderHoc
class TargetComponent extends Component {
    render() {

    }
}
```

# 适配器模式
把变化留给自己 把不变留给用户，比如做接口迁移，需要保持入参，出参前后都保持一致，如果新接口的入参和老接口的入参不一样，就需要在内部做适配，这就是适配器

# 代理模式
类似于拦截器，比如在对一个实体对象进行读写操作的时候，加一层校验拦截的逻辑，如果校验未通过，就拒绝其读写操作
使用 proxy
```js
const girl = {
    name: 'Amy',
    age: 20,
    avatar: '',
    phone: 1234,
    bottomValue: 50,
    lastGift: null
}

const boy = {
    isValidate: true,
    isVip: false
}

const baseInfo = ['name', 'age']
const privateInfo = ['avatar', 'phone']

const lover = new Proxy(girl, {
    get: function(girl, key) {
        if (baseInfo.includes(key) && !boy.isValidate) {
            console.log('is not validate')
            return
        }

        if (privateInfo.includes(key) && !boy.isVip) {
            console.log('is not vip')
            return
        }
        return girl[key]
    },

    set: function(girl, key, val) {
        if (key === 'lastGift') {
            if (val.value < girl.bottomValue) {
                console.log('you are not rich')
                return
            }
            girl.lastGift = val
        }
    }
})


// console.log(lover.age)

lover.lastGift = {
    value: 10
}
```

## 代理模式的应用
- 事件代理
事件冒泡：当点击一个 dom 元素时，事件会冒泡它的父级元素，所以可以把事件绑定在父级元素上

```html
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```
```js
document.getElementByTag('ul').addEvenetlistener('click', (e) => {
    if (e.target.tagName === 'li') {
        console.log(e.target.innerText)
    }
})
```

- 虚拟代理
图片预加载：当要显示的图片非常大的时候，可以先设置一个小的占位图，然后创建 image 实例，将其 src 指向真实图片地址，然后监听其加载事件，当加载完毕的时候，就有了这个图片的缓存，然后再将页面上的 image 元素的地址指向已经缓存了的真实图片的地址
```js
class PreLoadImage {
    constructor(image) {
        this.imageNode = image
    }

    setSrc(url) {
        this.imageNode.src = url
    }
}

class ProxyImage {
    static DEFAULT_URL = 'xxxxx.url'

    constructor(targetImage) {
        // 目标image 即PreloadImage实例
        this.targetImage = targetImage
    }

    setSrc(url) {
        // 先展示占位图
        this.targetImage.setSrc(DEFAULT_URL)
        // 创建虚拟 image 
        const image = new Image()
        // 虚拟图片加载完成后 将实际的图片元素的src指向真实地址
        image.onload = () => {
            this.targetImage.setSrc(targetUrl)
        }
        // 要写在 onload 事件下面
        image.src = targetUrl
    }
}
```

- 缓存代理
用空间换时间，比如在大量计算的场景下，将已经计算好的结果进行缓存，当再次需要通知的结果时，直接读取缓存的值，省去了再次计算的时间
```js
const addAll = function() {
    console.log('进行了一次计算')
    return [...arguments].reduce((total, cur) => {
        return total + cur
    }, 0)
}

const proxyAdd = (function() {
    const result = {}
    return function() {
        const key = [...arguments].toString()
        if (key in result) {
            return result[key]
        }
        const res = addAll(...arguments)
        result[key] = res
        return res
    }
})()
```

- 保护代理
就是上面的婚介所的运作模式

# 策略模式
定义一系列的算法，将他们封装起来，并且相互可替换。封装算法就是将单独一个功能的逻辑进行抽离，一个函数只负责单一功能的逻辑，可替换的意思是将if else 的逻辑替换为对象映射的写法
```js
function process(type, value) {
    if (type === 'a') {
        handleA(value)
    }
    if (type === 'b') {
        handleB(value)
    }
}
// 以上逻辑可重构为
const funcMap = {
    a(value) {

    },
    b(value) {

    }
}
function process(type, value) {
    funcMap[type](value)
}
```

# 状态模式
允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎改变了它的类
当一个对象主体有多种状态，并且每一种状态对应一种行为，可以将每一种状态以及行为抽离出去，
与策略模式的区别，策略模式中封装出去的每一个算法都是相互独立，可替换性高，用来委托分发行为的对象主体只是对他们进行单纯的调用，状态模式下，突出一个状态，不同状态下，对象的行为不同，对象主体与每一个状态行为都有着关联，因为他们可能需要相互感知，每一个状态行为都可能会去改变对象主体的当前状态

# 观察者模式
定义了一种一对多的依赖关系，让多个观察者对象同时监听一个目标对象，当目标对象的状态发生改变时，会通知到所有的观察者对象，是他们能够调用自身的更新方法
```js
class Publisher {
    constructor() {
        this.oberverList = []
    }

    addObserver(observer) {
        this.observer.push(observer)
    }

    removeObserver(observer) {
        this.observerList.forEach((item, index) => {
            if (item === observer) {
                this.observerList.splice(index, 1)
            }
        })
    }

    notify() {
        this.observerList.forEach(item => {
            item.update()
        })
    }
}

class Observer {
    constructor() {

    }

    update() {
        console.log('invoke update')
    }
}

class PrdPublisher extends Publisher {
    constructor() {
        super()
        this.oberverList = []
        this.prdState = null
    }

    getState() {
        return this.prdState
    }

    setState(state) {
        this.prdState = state
        this.notify()
    }
}

class rdObserver extends Observer {
    constructor() {
        super()
        this.prd = {}
    }

    update() {
        this.word()
    }

    word() {
        console.log('word start')
    }
}

const lilei = new rdObserver()
const liming = new rdObserver()
const pm = new PrdPublisher()
pm.addObserver(lilei)
pm.addObserver(liming)

const prd = {}
pm.setState(prd)
```

## 发布订阅实现
```js
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
```

## 观察者和发布订阅的区别
观察者中，观察者和被观察者是一对多的关系，且是耦合的，观察者需要维护被观察者的集合，而发布订阅模式，
发布者和订阅者是相互解耦的，他们互相不感知对方的存在，两者都需要依赖事件中心进行发布订阅操作
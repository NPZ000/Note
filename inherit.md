# 说一说JS的那些继承

#### 基于原型链的继承
```javascript
function SupType() {
  this.property = 'sup'
}

SupType.prototype.say = () => {
  console.log('hi')
}

function SubType() {
  this.property = 'sub'
}

SubType.prototype = new SupType()

const subInstance = new SubType()

subInstance.say() // 'hi'
console.log(subInstance.supProperty) // 'sup'
```
这种继承方式的原理其实就是创建超类型的实例，然后直接赋值给子类型的原型，这样子类型就可以继承到超类型的实例属性和原型上的方法。
但是这种继承方式存在一个问题，我们都知道 js 中对象是按引用传递的，如果说我们在超类型的实例属性中有一个引用类型的值，然后有人继承之后又去修改了这个引用类型的值，会怎么样呢？
```javascript
function SupType() {
  this.colors = ['red']
}

function SubType() {}

SubType.prototype = new SupType()

const instance1 = new SubType()
const instance2 = new SubType()

console.log(instance1.colors) // ['red']
console.log(instance2.colors) // ['red']

instance1.colors.push('blue')

console.log(instance1.colors) // ['red', 'blue']
console.log(instance2.colors) // ['red', 'blue']
```
可以看到，只要有一个人改了继承到的这个引用类型的值，就会影响到所有人，在某些时候我们并不会想得到这样的结果。通过原型继承还有一个问题是：在创建子类型的实例的时候，没法在不影响所有对象实例的前提下，向超类型的构造函数传递参数。

#### 借用构造函数继承
```javascript
function SupType(name) {
  this.colors = ['red']
  this.name = name
}

function SubType(name) {
  SupType.call(this, name)
}

const instance1 = new SubType()
const instance2 = new SubType('tom')

instance1.colors.push('blue')
console.log(instance1.colors) // ['red', 'blue']
console.log(instance2.colors) // ['red']
console.log(instance2.name)   // 'tom'
```
顾名思义，借用构造函数继承就是在子类型的构造函数内部直接调用超类型构造函数。可以看到这种方式解决了原型式继承遗留的两个问题。
虽然，他解决了基于原型链继承的问题，但是，还是有存在自己的问题的，这种继承方式只能继承实例属性，不能继承原型上的方法。

#### 组合式继承
```javascript
function SupType(name) {
  this.name = name
  this.friends = ['tom']
}

SupType.prototype.sayName = function() {
  console.log(this)
  console.log(this.name)
}

function SubType(name) {
  SupType.call(this, name)
}

SubType.prototype = new SupType()

const instance1 = new SubType('Npz')

instance1.sayName() // 'Npz'
console.log(instance1.friends) // 'tom'
```
组合式继承就是把原型式继承和借用构造函数继承结合起来，取长补短，用基于原型链的继承去继承超类型原型上的方法，用借用构造函数继承去继承超类型的实例属性。

#### 原型式继承
```javascript
function Object(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

const person = {
  name: 'tom',
  friends: ['Amy']
}

const otherPerson = Object(person)

otherPerson.age = 12

console.log(otherPerson.name) // 'tom'
```
Object 函数接收一个对象作为参数，在函数内部首先创建一个新的构造函数，然后把传进来的对象赋值给新构造函数的原型，最后返回这个新构造函数的实例。这种继承方式需要一个基础对象，传给 Object 函数生成一个新对象，然后对新对象做一些额外的增强。
在 ES5 中新增了 Object.create() 方法规范了这种继承方式，这个方法接收两个参数，一个是用作新对象原型的对象也就是要继承的那个对象，另一个是要为新对象定义额外属性的新对象
```javascript
const person = {
  age: 12
}

const Tom = Object.create(person, {
  name: {
    value: 'Tom'
  }
})

console.log(Tom.name) // 12
console.log(Tom.age)  // 'Tom'
```
这里需要注意的是第二个参数，是和 Object.defineProperties() 方法的第二个参数一样是需要通过描述符去定义的，而不是简单的 name: '' 这样。
####寄生式继承
```javascript
function Object(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

function otherObj(obj) {
  const newObj = Object(obj)
  newObj.say = function() {
    console.log('hi')
  }
  return newObj
}

const person = {
  name: 'tom',
  friends: ['Amy']
}

const res = otherObj(person)

res.say() // 'hi'
```
这种继承方式也很简单，就是把之前原型式继承的那个方法又封装了一下，在方法内部对返回的新对象又进行了一些增强。
#### 寄生组合式继承
```javascript
function SupType(name) {
  this.name = name
  this.friends = ['tom']
}

SupType.prototype.sayName = function() {
  console.log(this)
  console.log(this.name)
}

function SubType(name) {
  SupType.call(this, name)
}

SubType.prototype = new SupType()

const instance1 = new SubType('Npz')

instance1.sayName() // 'Npz'
console.log(instance1.friends) // 'tom'
```
这里我们先回头来看一下原来那个组合式继承，他其实还是有问题的，他其实在其中调用了两次超类型的构造函数，第一次是生成超类型的实例并赋值给子类型原型的时候，第二次是在子类型的构造函数内部再一次调用了超类型的构造函数，这样会有什么问题呢，首先，第一次调用的时候，子类型的原型上会得到两个属性也就是超类型的 name 和 friends，现在他俩存在于子类型的原型上，第二次调用的时候，因为是在子类型的构造函数内部调用的超类型的构造函数，所以现在 name 和 friends 又成了子类型的两个实例属性，同时他俩会屏蔽掉原来在原型上的那两个同名的属性。
其实在第一次调用的时候，我们只是想拿到一份超类型原型的副本而已。
```javascript
function inherit(sub, sup) {
  const prototype = Object.create(sup.prototype)
  sub.prototype = prototype
}

function SupType() {
  this.name = 'Npz'
}

SupType.prototype.say = function () {
  console.log(this.name)
}

function SubType() {
  SupType.call(this)
}

// SubType.prototype = new SupType()
inherit(SubType, SupType)

const instance = new SubType()

instance.say() // 'Npz'
console.log(instance.name) // 'Npz'
```
代码中的这个 inherit 方法就是寄生组合式继承的实现，他接收两个参数，子类型和超类型，在函数内部，首先创建了一个超类型原型的副本，然后将这个副本赋值给子类型的原型。
在原来的的组合式继承实现中，我们调用这个方法替换掉原来的那个生成超类型实例再赋值给子类型原型的那行代码，这样就可以解决组合式继承的那个问题了。





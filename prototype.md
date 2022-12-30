# 你真的理解原型和原型链了吗
```js
	Object.prototype.type = "x";
	Function.prototype.type = "y";

	function A() {};
	const a = new A();

	console.log(A.type);  
	console.log(a.type); 
```
一道很常见的原型链的面试题，如果你知其然并且知其所以然，那我想你可以不用往下看了，如果你只是知其然却不知其所以然，或者其然都不知，那你就继续往下看，也许看完之后，你可以知其然并且知其所以然。

## 理解原型对象
首先我们来了解一下原型对象到底是什么？有什么用？
我们创建的每个构造函数都有一个 prototype 属性，这个属性是一个指针，指向一个对象，这个对象就是原型对象，原型对象中包含所有通过调用构造函数生成的实例对象所共享的属性和方法。很明显，使用原型对象的好处就是可以让所有实例对象共享他所包含的属性和方法。
```js
function Person(name) {
    this.name = name
}
Person.prototype.sayName = function() {
    console.log(this.name)
}
const person1 = new Person('Npz')
person1.sayName() // Npz
```
这里面主要有三个主体，构造函数，原型对象，实例对象。实例对象是通过调用构造函数生成的，然后实例对象调用了原型对象中的方法。那么这三者具体的关系是什么呢？
## 构造函数、原型对象、实例对象之间的关系
构造函数的 prototype 属性指向他的原型对象，然后原型对象有一个 constructor 属性，指向其构造函数，当调用构造函数生成一个实例对象之后，该实例的内部包含一个指针，指向其构造函数的原型对象，这个指针在 Safari、Chrome、Firefox 中的实现叫 __proto__。
```js
Person.prototype.constructor === Person // true
person1.__proto__ === Person.prototype // true
```
当我们梳理清楚这些之后，再来看原型链是什么
## 原型链是什么
```js
function Person(name) {
    this.name = name
}
Person.prototype.sayName = function() {
    console.log(this.name)
}
const person1 = new Person('Npz')
person1.sayName() // Npz
```
还是这段代码，想一下，person1 为什么可以调用 sayName 方法，其实，当读取一个对象的属性时，会首先从这个对象本身查找该属性，如果没有找到就会去他的原型对象上查找，也就是这个对象的 __proto__ 属性指向的那个对象，所以，person1 调用的其实是 Person.prototype 上的 sayName 方法，那么如何判断这个属性是存在于实例本身还是原型对象中呢，可以使用 hasOwnProperty 方法
```js
person1.hasOwnProperty('sayName') // false
```
如果这个属性不存在于实例对象本身，就会返回 false，反之返回 true。咦？这个 hasOwnProperty 方法又是哪来的呢？在 Person.prototype 上也并没有这个方法啊，其实这个方法是来自于 Object.prototype ，那又是怎么找到 Object.prototype 上的呢，其实就是通过原型链查找的，在这里我们要明确一个事情，原型对象本质上还是一个对象，而对象其实都是 new Object() 出来的，所以在这里，Person.prototype.__proto__ === Object.prototype，没错，如你所见，所有的原型对象其实也可以说是调用 Object 构造函数生成的实例对象，所以这里的原型对象的 __proto__ 指向的就是 Object 构造函数的 prototype 属性指向的对象，也就是 Object.prototype。
我们再来看一下 hasOwnProperty 这个方法的查找过程，首先实例对象本身没有，然后再往上他的原型对象中也没有，再接着就找到了 Object.prototype 上，这就是原型链了，通过 __proto__ 一层一层的向上查找，如果找到 Object.prototype 还没有找到的话，再往上就是 null 了
```js
Object.prototype.__proto__ === null // true
```
刚才我们有提到所有的原型对象其实就是是调用 Object 构造函数生成的实例对象，那么 Object 构造函数又是怎么来的呢？
## 再看 Object 构造函数
构造函数也是函数，每个函数都是调用 Function 构造函数生成的实例，所以函数的声明还可以这么写
```js
const Object = new Function()
// 等价于
// function Object() {}
```
但是我们一般不会这么写，也不推荐这么写，但是从这个表达式，我们可以推断出 Object 构造函数其实就是调用 Function 构造函数生成的一个实例，所以 Object 构造函数的 __proto__ 指向的就是 Function.prototype，那我们再往上推， Function 构造函数又是哪来的呢，没了，Function 构造函数就是最顶级的构造器了，就好比 Object.prototype 是最顶级的原型对象一样。但是在 js 的实现中，我们会发现，Function 构造函数的 __proto__ 指向的是 Function.prototype, 而 Function.prototype.contructor 指向的还是 Function 构造函数，看起来像是 Function 构造函数又当🐔又当🥚一样，要我说，不用纠结这个，没有意义。
这里再放一下这张经典的原型链的图，我上面的分析其实已经 cover 了这张图的大部分了，还没有提到的就是 Foo 构造函数的 __proto__ 指向的是 Function.prototype 对象，这也很好理解，因为每个函数都是通过调用 Function 构造函数生成的实例嘛。
现在再来看下文章开头的面试题
```js
	Object.prototype.type = "x";
	Function.prototype.type = "y";

	function A() {};
	const a = new A();

	console.log(A.type);  
	console.log(a.type); 
```
A.type，查找 type 属性，首先 A 本身没有，然后顺着他的 __proto__ 属性往上找，这里 A 是一个函数，所以他的 __proto__ 指向的就是 Function.prototype 了，接着就找到了 type 属性，值为 y
a.type，查找 type 属性，同样的 a 自身没有，然后 a.__proto__ 指向的应该是 A.prototype, 因为 a 是调用 A 构造函数生成的实例对象，然后也没有，再往上就是 Object.prototype了，找到了属性 type，值为 x
## 基于原型链的继承
在我们了解了原型链之后，再来看一下如何基于原型链实现继承。其基本思想就是利用原型让一个引用类型继承另一个引用类型的属性和方法。
再来简单回顾一下构造函数、原型以及实例之间的关系，每个构造函数都有一个原型对象，原型对象包含一个指向构造函数的指针(constructor)，而实例对象又包含一个指向原型对象的内部指针（__proto__）,那么，假如我们让原型对象等于另一个构造函数的实例，结果会怎么样呢，根据我们上述分析，这个原型对象将会包含一个指向另一个原型对象的指针，相应的，另一个原型对象也有一个指向其构造函数的指针。可能这么说有点绕，还是来看一下代码会清晰一点
```js
function SuperType() {
    this.property = true
}

SuperType.prototype.getSuperTypeValue = function() {
    return this.property
}

function SubType() {
    this.subproperty = false
}

SubType.prototype = new SuperType()

SubType.prototype.getSubproperty = function() {
    return this.subproperty
}

const instance = new SubType()
console.log(instance.getSuperTypeValue())
```
实现继承的关键是这一行代码
```js
SubType.prototype = new SuperType()
```
调用 SuperType 构造函数，把生成的实例直接赋值给 SubType 的原型对象，按照我们上面的分析，这行代码实现的就是让原型对象等于另一个构造函数的实例，现在 SubType.prototype 的 __proto__ 指向的就是 SuperType.prototype，换言之，SuperType.prototype 就是 SubType.prototype 在原型链上的上一层。
好，让我们再来看一下上面这段代码，当我们在 instance 实例上调用 getSuperTypeValue 方法，首先会在自身查找，没有，然后再去 SubType.prototype 里面查找，也没有，接着再去 SuperType.prototype 里面查找，好，在这就找到了。
这里有一个小问题需要注意一下，当我们重写了 SubType 的原型对象之后，现在 SubType.prototype.constructor 指向的就不是构造函数 SubType 了，因为 SubType.prototype 现在已经是构造函数 SuperType 的实例了，所以他的 constructor 指向的是 SuperType，通常情况下，这不会有什么问题，除非你刻意的去使用 constructor，比如像下面这样
```js
function Parent() {};
function CreatedConstructor() {}

CreatedConstructor.prototype = Object.create(Parent.prototype);

CreatedConstructor.prototype.create = function create() {
  return new this.constructor();
}

new CreatedConstructor().create().create(); 
```
这段代码会报错，create 不是一个 function，其实就是没找到这个方法，注意，没找到的是第二个 create，来分析一下为什么没找到，new CreatedConstructor().create() ，这行代码执行的其实就是 CreatedConstructor.prototype 上的 create 方法，然后这个方法内部，new this.constructor()，因为这段代码中重写了 CreatedConstructor.prototype，所以这里的 constructor 指向的其实是构造函数 Parent，所以这里返回的是 Parent 构造函数的实例，返回之后，接着去调用了它的 create 方法，但是在 Parent 构造函数的实例中根本找不到这个方法，所以就报错了。其实这段代码的本意是想去调用 CreatedConstructor.prototype 的 create 方法，所以这里只需要把 constructor 重新指回 CreatedConstructor 就好了
```js
// 重写原型对象之后
CreatedConstructor.prototype.constructor = CreatedConstructor
```
OK，到这基本上就讲完了，希望本文能让你对原型和原型链有一个更加深刻的理解。






Ramda 源码解析（一）
如果你使用过或者学习过函数式编程，那么你大概率知道 Ramda 这个库，这是一个很优秀的函数式编程库。
关于函数式编程在这里就不做过多介绍了，本文主要是对 Ramda 源码中部分 API 实现的一个简要分析，其实我本人并没有使用过这个库，只是在接触函数式编程的过程中了解到的，大概了解了一下基本用法之后，发现确实有点意思的，尤其是这段代码
```js
const sum = (a, b, c) => a + b + c
const curried = R.curry(sum)
const res = curried(1, 2, 3)
const res2 = curried(1)(2)(3)
const res3 = curried(1, 2)(3)
const res4 = curried(1)(2, 3)
// 以上写法都是等价的，也就是说他们的结果都是一样的
// 还可以多次调用
const f = curried(1)
const g = f(2)
const res5 = g(3)
// 甚至还可以传入占位符
const res6 = curried(_, 1)(2)(3)

// 以上写法都可以得到同样的结果
```
相信看完这段代码之后，你会和我一样对它背后的实现原理产生极大的好奇心。
本文作为 Ramda 源码解析系列的第一篇，我会先挑其中的几个 API 来看，之后会继续更新。
# 占位符
R.__, 可以对任何位置的参数进行占位。
```js
// 假设 g 代表柯里化的三元函数，_ 代表 R.__，则下面几种写法是等价的：

g(1, 2, 3)
g(_, 2, 3)(1)
g(_, _, 3)(1)(2)
```
这里先提一嘴，下面会说源码对这个占位符是怎么判断的。
# add
add 方法是文档中第一个 API，也是比较简单的，就先从这个入手。先来看下这个函数的用法
```js
R.add(2, 3);       //=>  5
R.add(7)(10);      //=> 17

const f = R.add(1)
f(2)    //=> 3

const f = R.add(R.__, 3);       
f(2)    //=>  5
```
显而易见，这就是个用来做两数相加的方法，两个参数可以一次性传入，也可以分开传入，来看下源码
```js
// source/add.js
var add = _curry2(function add(a, b) {
  return Number(a) + Number(b);
});
```
调用了一个 _curry2 函数，又传入了一个两数相加的函数进去，接着再看 _curry2 函数里面干了什么
```js
// source/internal/_curry2.js
export default function _curry2(fn) {
  return function f2(a, b) {
    // 判断传入参数的个数
    switch (arguments.length) {
      // 如果没有传入参数，就原样返回这个函数
      case 0:
        return f2;
      case 1:
        // 如果只传入一个参数，判断这个参数是不是占位符
        return _isPlaceholder(a)
          ? f2
          : _curry1(function(_b) { return fn(a, _b); });
      default:
        // 如果两个参数都传入的话，首先判断这俩参数是否都是占位符
        return _isPlaceholder(a) && _isPlaceholder(b)
          ? f2
          // 或者其中之一是
          : _isPlaceholder(a)
            ? _curry1(function(_a) { return fn(_a, b); })
            : _isPlaceholder(b)
              ? _curry1(function(_b) { return fn(a, _b); })
              : fn(a, b);
    }
  };
}
```
这个方法里直接返回了一个函数 f2，调用 add 方法具体执行的就是这个函数，这个函数判断了传入参数的个数，对不同情况做了不同处理
1. 如果没有传入参数，就原样返回这个函数
2. 如果只传入了一个参数，这里先表示为 a，判断 a 是否是占位符，_isPlaceholder 这个函数就是用来判断是否是占位符，如果是占位符的话，相当于还是没传，还是原样返回这个函数，如果不是占位符的话，调用了 _curry1 方法，给他传入了一个接收一个参数 _b 的函数，这个函数中返回的是最开始那个两数相加方法 add 的执行，并且把已经传进来的参数 a 和之后要传进来的参数 _b 传了进去，
再来看下 _curry1 方法中干了什么
```js
export default function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
```
接收一个函数作为参数，实际会传进来的其实就是上面的这个 function(_b) { return fn(a, _b); }，然后也是直接返回了一个函数 f1，f1 接收一个参数，这个参数就对应上面那个参数 _b，然后方法中判断是否传入了参数或者传入的参数是否是占位符，是的话，就还是原样返回这个函数；不是的话，就说明现在也拿到了另一个参数，就可以直接执行 function(_b) { return fn(a, _b); } 这个方法，把另一个参数也传进去，然后这个方法里面返回的 fn 的执行，其实就是最开始的那个两数相加的函数 add，此时他已经拿到了所需的两个参数，就可以计算出最后的结果了
3. 如果两个参数都传入的话，首先判断这两个参数是否都是占位符，都是的话，就还是原样返回 f2 函数，如果只有其中之一是的话，就还是 step2 的逻辑，最后如果两个参数都是实际所需的参数，就直接调用两数相加的方法 add，并返回其执行结果，就是最终的值了。
# curryN
还是先看下用法
```js
// 计算传入所有参数的和
const sumArgs = (...args) => R.sum(args);

const curriedAddFourNumbers = R.curryN(4, sumArgs);
const f = curriedAddFourNumbers(1, 2);
const g = f(3);
g(4); //=> 10
```
对函数进行柯里化，并限制柯里化函数的元数。柯里化函数有两个很好的特性：
1. 参数不需要一次只传入一个。假设 g 由 R.curryN(3, f) 生成，则下列写法是等价的：
g(1)(2)(3)
g(1)(2, 3)
g(1, 2)(3)
g(1, 2, 3)
2. 占位符值 R.__ 可用于标记暂未传入参数的位置，允许部分应用于任何参数组合，而无需关心它们的位置和顺序。 假设 g 定义如前所示，_ 代表 R.__ ，则下列写法是等价的：
g(1, 2, 3)
g(_, 2, 3)(1)
g(_, _, 3)(1)(2)
g(_, _, 3)(1, 2)
以上是官网的说明，这里我说一下我的理解：
这个方法接收两个参数，第一个是要限制参数的个数，第二个是一个函数，这里我们传入了 4 和 sumArgs 函数，也就是说，我之后传入四个参数之后，就会返回这四个参数的结果了，这四个参数可以一次性传入，也可以一次只传一个，传四次，也可以在其中传入占位符，下面看源码中是如何实现的
```js
// source/curryN.js
var curryN = _curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
```
可以看到这里又调用了 _curry2 方法，也就是说 curryN 方法最开始传入的两个参数也是可以分开传入的，像这样
```js
const sumArgs = (...args) => R.sum(args);

const curriedAddFourNumbers = R.curryN(4);
const curriedAddFourNumbers2 = curriedAddFourNumbers(sumArgs)
const f = curriedAddFourNumbers2(1, 2);
const g = f(3);
g(4); //=> 10

// 以上等价于

const sumArgs = (...args) => R.sum(args);

const curriedAddFourNumbers = R.curryN(4, sumArgs);
const f = curriedAddFourNumbers(1, 2);
const g = f(3);
g(4); //=> 10
```
这里就不再说这个 _curry2 方法了，我们就先假设会一次性传入那两个所需的参数，直接看里面的逻辑，首先判断了如果限制的参数个数传入的值是 1，就没啥好处理的，直接返回 _curry1 的执行结果，_curry1 上面也说过了；如果参数个数大于 1 的话，会调用这个 _arity 方法，传入了限制参数的个数以及调用这个 _curryN 方法的结果，先来看 _arity 的代码
```js
// source/internal/_arity.js
export default function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

```
其实就是返回一个接收 n 个参数的函数，n 的范围是 0 - 10，先大概知道这些，稍后回来再讨论他，接着再看那个 _curryN 函数
```js
// source/internal/_curryN.js
export default function _curryN(length, received, fn) {
  return function() {
    // 存放过程中传入的参数和之前已经传入的参数
    var combined = [];
    // 当前在处理参数的索引
    var argsIdx = 0;
    // 限制参数的个数
    var left = length;
    // 当前在处理已传入参数的索引
    var combinedIdx = 0;
    // 遍历已传入参数和当前调用时传入的参数
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        // 取已传入的参数
        result = received[combinedIdx];
      } else {
        // 取当前传入的参数
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      // 都放在这个数组中
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0
      // 如果传入参数够了就返回执行结果
      ? fn.apply(this, combined)
      // 如果还不够就返回函数 接着接收其他的参数 
      : _arity(left, _curryN(length, combined, fn));
  };
}
```
这个方法接收三个参数
1. length：要限制参数的个数
2. received： 已经接收到的参数
3. fn：最开始要执行的那个函数
方法内部直接返回了一个匿名函数，当我们调用 R.curryN 返回的其实就是这个匿名函数了。如果直接看里面的代码逻辑可能不太好理解，所以我们这里可以代入参数，然后再看他的逻辑是怎么流转的
```js
const sumArgs = (...args) => R.sum(args);

const curriedAddFourNumbers = R.curryN(4, sumArgs);
const f = curriedAddFourNumbers(1, 2);
const g = f(3, 4); //=> 10
```
还是以上面这个代码来看，限制四个参数，然后我们把这四个参数分两次传入
1. 第一次传入两个参数，走过 while 循环，combined 这个变量会存放当前传入的两个参数 [1, 2]，然后又调用了 _arity，也就是说会返回一个接收两个参数的函数，这里会把已经接收到的的 [1, 2] 传进去
2. 第二次传入剩下的两个参数，注意此时的 received 参数是有值的，就是上次传入的那两个参数，然后走 while 循环，会先把上次已经传入的参数拿出来，也就是 received 中的值，然后会再把当前传入的参数也都拿出来，都放到 combined 中，循环完事之后，会判断已经接收到了所有的参数，所以就直接调用了 fn 方法，在这里就是刚开始传入的 sumArgs 方法，并且把接收的参数都传进去，然后就可以直接返回结果了。
# curry
看下用法
```js
const addFourNumbers = (a, b, c, d) => a + b + c + d;

const curriedAddFourNumbers = R.curry(addFourNumbers);
const f = curriedAddFourNumbers(1, 2);
const g = f(3);
g(4); //=> 10
```
依旧是对函数进行柯里化，和上面的 curryN 不同的是，这里不限制传入参数的个数，而是由传入的函数所需要的参数的个数决定的，比如说这个例子，传入 addFourNumbers 函数需要四个参数，所以后面在传入四个参数之后，就返回了结果。还是继续看源码
```js
var curry = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});
```
最外层调用了 _curry1 方法，是为了判断你传入的参数是否是有效的参数，然后返回的是 curryN 方法的调用，curryN 方法就是上面那个 curryN 方法，传入的 fn.length, 也就是传入函数所需要的参数个数，为啥这样写，就显而易见了嘛，接着 curryN 方法里面的逻辑就不再说了。
*** _arity ***
上面还留了一个坑啊，就是这个 _arity 方法，这个方法里面那一堆相似的代码
```js
case 0: return function() { return fn.apply(this, arguments); };
case 1: return function(a0) { return fn.apply(this, arguments); };
case 2: return function(a0, a1) { return fn.apply(this, arguments); };
//.....
```
可以看到那些形参 a0、a1... 在函数体内并没有用到，然后函数体内只是返回了传入的 fn 的调用，除此之外就没有其他逻辑，看起来这堆代码就是毫无用处的，而且我尝试把这个方法去掉，发现对函数的运行结果并没有影响，然后我去 github 上找到 Ramda，去 issuse 下面搜了一下，发现有人和我提出了同样的疑问，看了下问题下的讨论
大概意思就是说，如果不用 _arity 包一层，返回的函数的 length 的值就会是错误的，
```js
// 这里说一下，函数有一个 length 属性，他的值是函数需要的参数的个数，
function foo(a, b) {
    return a + b
}
foo.length // 2
```
说回源码中的实现
```js
var curryN = _curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
//   return _arity(length, _curryN(length, [], fn));
  return _curryN(length, [], fn)
});
```
如果我们直接把 _curryN(length, [], fn) 返回，其实它里面返回的是一个没有形参的匿名函数，所以返回函数的 length 的值就会一直是 0，如果用 _arity 包一层，根据 _arity 的实现，返回函数的 length 属性的值就是正确的，是我们期望传入的参数个数。虽然但是，我还是觉得这个没有什么实质性的意义，js 本来也不关心实参和形参的个数是否对的上，而我们在平常的开发中，也几乎不会用到函数的这个 length 属性。
OK，本文就先说这三个方法的源码的实现，之后可能会继续更新其他方法，欢迎大佬们的建议和意见。



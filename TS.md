- type & interface 的区别
相同点
1. 都可以描述对象或者函数
2. 都允许扩展
不同点
1. type 可以为任何类型引入名称，例如基本类型，联合类型
2. type 不支持继承
3. type 不会创建一个类型的名字
4. type 无法被实现 implements，interface 可以被派生类实现
5. type 重名会抛出错误，interface 重名是会产生合并

- const 和 readonly 的区别
const 可以防止值被修改
readonly 可以防止属性被修改

- 枚举和常量枚举的区别
常量枚举在编译阶段会被删除，并且不能包含计算成员

### 约束函数的两个参数都为 number 或者 String
```ts
function add(x: number, y: number): number {}
function add(x: string, y: string): string {}
function add(x: any, y: any): any {
    return x + y
}
////////////
interface Add {
    (a: string, b: string): string;
    (a: number, b: number): number;
}
```

## import type 和 import 的区别
import 进来的可以是值也可以是类型，并且可以被一起import 进来，这样的话，单看 import 的地方，是看不出来到底是值还是个类型，当 ts 被编译成 js 的时候，关于类型的代码，都会被删掉，但是如果不知道是不是类型的话，就不会被删掉，而 import type 就是标明这个东西是个类型，告诉编译器，你可以删

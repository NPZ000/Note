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
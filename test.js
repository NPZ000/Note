function foo() {

}

const bar = new foo()

console.log(bar.__proto__)
console.log(bar.__proto__.__proto__)
console.log(bar.__proto__.__proto__.__proto__)
// console.log(bar.__proto__.__proto__.__proto__.__proto__)
console.log(foo.prototype)
console.log(foo.prototype.prototype)
console.log(foo.prototype.prototype.prototype)
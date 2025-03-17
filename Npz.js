const obj = {
    name: 'Alice',
    greet: function() {
      console.log(this.name);
    }
  };
  const greetFn = obj.greet;
  greetFn(); // 输出？


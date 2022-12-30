### key 的作用
每当一个列表重新渲染时，react 会根据每一项列表元素的 key 来检索上一次渲染时与每个 key 所匹配的元素，如果发现当前的列表有一个之前不存在的 key，那么就会创建出一个新组件，如果 react 发现和之前对比少了一个 key，那么就会销毁之前对应的组件，如果一个组件的 key 发生了变化，那么这个元素就会被销毁，然后是用新的数据重新创建一份

### vue 和 react 的区别
1. 都推崇组件化的开发理念
2. 写法上的不同，vue 是html 和 js 分离，也就是结构和行为分离，对html提供一些扩展的属性 比如 v-if v-model；react 则是使用了 jsx 的写法，在一个函数返回一个元素，看起来就是把html和js混在了一起
3. 内部数据管理，vue使用data 方法返回了一个对象，对象中的数据可以直接改变，改变后会引起view 的变化，也就是vue 的数据双向绑定，在vue2的实现中是通过，object。defineProperty对对象属性的set进行劫持，以此来监听数据的变化，在vue3 的实现中是通过proxy代理来实现这里效果。react的数据，在class组件中，是在构造函数中放在了state里面，数据的改变只能通过setState来操作。setState才会引起view 的变化，在function组件中，通过使用hook ，useState对数据进行给管理，他返回一个value和设置value的方法，改变value之后view会更新
4. 父子组件通信，都是单向数据流，通过props向下传递，子于父的通信略有不同，vue是通过父组件监听子组件的自定义方法，子组件去emit这个方法，并传入数据，父组件可以接收到这个数据。react 是通过props传递一个回调，子组件去调用这个回调并传入数据这样。
5. 关于diff，整体的思路差不多，都是通过diff一个dom树，只进行同级的diff，如果不同则直接销毁，然后创建新的组件，在具体的diff算法上略有不同，vue会进行一个双向的遍历，会取新列表的头和尾和旧列表的头和尾，进行俩俩对比，然后判断是否要移动，diff完之后，新列表多出来的元素会找到对应的位置插进去，旧列表多出来的会删除。而react是直接遍历新列表，然后去old list中查找，没找到就新增，找到了再判断要怎么移动，最后旧列表中多出来的删除

### useCallback & useMemo 区别
都是用来缓存的
前者缓存的是一个回调函数，使用场景：父组件更新时通过props传给子组件的函数也会重新创建，使用useCallback缓存的话，就不用每次都重新创建
后者缓存的是一个值，也可以是一个回函数计算之后返回的值，当依赖项发生改变时才会重新计算值这个值

### react 的fiber
把原来的树结构换成了链表的结构，因为新的架构使用了时间分片，对更新dom的操作进行了分割，那么就需要这个操作能中断，然后再继续的时候还能接上，更新dom 的操作是一个深度优先遍历的操作，如果不使用链表，当中断再继续的时候，是可以继续更新中断节点的子节点的，但是没法更新更新中断节点的兄弟节点了，因为中断节点不知道它的父节点是谁，也就没法找到他的兄弟节点，而使用链表，每个节点都保存了它的父节点，往上找到父节点，再接着也就能找到兄弟节点然后继续更新了
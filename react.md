### 虚拟dom
react和vue都采用了这样的机制，其实现原理是将真实dom映射成为一个js对象，当页面上的元素发生变化，先不去直接操作dom，而是创建一个新的js对象，也就是一个新的虚拟dom树，对新旧两个树进行diff，明确需要进行更新的元素，将更新的范围尽量缩小，然后再去映射到真实的dom，这样可以减少操作dom的次数，从而来提高性能，同时，因为开发者只需要关心如何去更新虚拟dom树的js对象，可以使用相关的API，相比较最原始的直接操作dom的开发方式大大提高了开发效率。
关于优化策略，在上述流程中，最复杂的点是新旧dom树的diff过程，所以可以从这个点来考虑，如何尽可能的加快或者简化diff流程，比如改进diff算法，对静态节点进行标记从而在diff过程中跳过等
### diff
1. 同层级比较，不同的话直接销毁，不再进行下一层级的比较
2. 元素类型不同直接销毁
3. 用key作为唯一标识标记元素，复用相同key的节点，
    - 对比流程：
        旧列表和新列表通过key建立映射。
        遍历新列表，查找旧列表中是否存在相同key的节点：
        存在且可复用 → 保留节点，可能移动位置。
        不存在 → 新建节点。
        旧列表中未被复用的节点 → 被销毁。
### key 的作用
每当一个列表重新渲染时，react 会根据每一项列表元素的 key 来检索上一次渲染时与每个 key 所匹配的元素，如果发现当前的列表有一个之前不存在的 key，那么就会创建出一个新组件，如果 react 发现和之前对比少了一个 key，那么就会销毁之前对应的组件，如果一个组件的 key 发生了变化，那么这个元素就会被销毁，然后是用新的数据重新创建一份

### vue 和 react 的区别
1. 都推崇组件化的开发理念
2. 写法上的不同，vue 是html 和 js 分离，也就是结构和行为分离，对html提供一些扩展的属性 比如 v-if v-model；react 则是使用了 jsx 的写法，在一个函数返回一个元素，看起来就是把html和js混在了一起
3. 内部数据管理，vue使用data 方法返回了一个对象，对象中的数据可以直接改变，改变后会引起view 的变化，也就是vue 的数据双向绑定，在vue2的实现中是通过，object。defineProperty对对象属性的set进行劫持，以此来监听数据的变化，在vue3 的实现中是通过proxy代理来实现这里效果。react的数据，在class组件中，是在构造函数中放在了state里面，数据的改变只能通过setState来操作。setState才会引起view 的变化，在function组件中，通过使用hook ，useState对数据进行给管理，他返回一个value和设置value的方法，改变value之后view会更新
4. 父子组件通信，都是单向数据流，通过props向下传递，子于父的通信略有不同，vue是通过父组件监听子组件的自定义方法，子组件去emit这个方法，并传入数据，父组件可以接收到这个数据。react 是通过props传递一个回调，子组件去调用这个回调并传入数据这样。
5. 关于diff，整体的思路差不多，都是通过diff一个dom树，只进行同级的diff，如果不同则直接销毁，然后创建新的组件，在具体的diff算法上略有不同，vue会进行一个双向的遍历，会取新列表的头和尾和旧列表的头和尾，进行俩俩对比，然后判断是否要移动，diff完之后，新列表多出来的元素会找到对应的位置插进去，旧列表多出来的会删除。而react是直接遍历新列表，然后去old list中查找，没找到就新增，找到了再判断要怎么移动，最后旧列表中多出来的删除
6. 数据可变性：react 推崇数据不可变，只能通过setState来触发视图的更新，而 vue 的数据是可变的，可直接改变数据，通过它的响应式系统来触发视图的更新

### useCallback & useMemo 区别
都是用来缓存的
前者缓存的是一个回调函数，使用场景：父组件更新时通过props传给子组件的函数也会重新创建，使用useCallback缓存的话，就不用每次都重新创建
后者缓存的是一个值，也可以是一个回函数计算之后返回的值，当依赖项发生改变时才会重新计算值这个值

### react 的fiber
首先说一下，为什么引入fiber架构，因为之前的架构在渲染dom的时候，是一气呵成的，一旦开始不能中断，如果dom很多的话，就会造成长时间占用主线程，导致帧率下降，页面卡顿等问题，所以引入了新的fiber架构，旧的架构不能中断是因为是一个递归栈结构，而fiber改成了链表栈构，就解决了不可中断的问题，通过利用requestidlecallback只在浏览器空余的时间执行任务，也就是常说的时间分片，同时还对不同的任务标注了不同的优先级，低优先级的任务可以被高优先级的任务打断，用户输入的优先级大于渲染的优先级

### memo 的第二个参数
memo 允许组件在props不改变的情况下不更新组件，默认会对props进行浅比较，也可以传入一个自定义比较函数作为第二个参数，比较函数返回true不更新组件，返回false则更新组件
## 使用场景
某个组件内容单一，明确不需要跟着父组件更新，可以固定的第二个参数返回true

### useEffect 模拟生命周期
第二个参数传入[], 只会在挂载的时候执行一次
第二个参数传入[dependency], 会在挂载和依赖项更新的时候执行
第二个参数不传，则每次组件更新都会执行，容易造成死循环，比如在其中执行了setState

### 受控组件和非受控组件
受控组件：组件的状态通过react的state来控制，并通过props传给组件，数据流是单向的，数据的改变必须通过onchange事件来触发
```js
function InputComponent() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```
非受控组件：组件的状态完全由自己控制，不受react的管理，通过ref获取到dom的值
```js
function InputComponent() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input defaultValue="" ref={inputRef} />;
}
```

---

## 性能优化

### 1. **`React.memo`（函数组件） / `PureComponent`（类组件）**  
- **原理**：通过浅比较（Shallow Compare）props是否变化，决定是否跳过重新渲染。  
- **示例**：  
  ```jsx
  const MemoizedComponent = React.memo(MyComponent, (prevProps, nextProps) => {
    // 自定义比较逻辑（非必需，默认浅比较）
    return prevProps.id === nextProps.id;
  });
  ```  
- **适用场景**：父组件频繁渲染，但子组件的props未变化。  
- **注意**：  
  - 对对象或函数类型的props无效（需配合`useMemo`/`useCallback`）。  
  - 过度使用可能导致比较逻辑的开销超过渲染本身。

---

### 2. **`useCallback`**  
- **原理**：缓存函数引用，避免因父组件渲染导致函数重新创建，从而触发子组件的不必要渲染。  
- **示例**：  
  ```jsx
  const handleClick = useCallback(() => {
    console.log("Clicked:", value);
  }, [value]); // 依赖项变化时函数才会更新
  ```  
- **适用场景**：将函数作为props传递给被`React.memo`优化的子组件。

---

### 3. **`useMemo`**  
- **原理**：缓存计算结果，避免重复计算。  
- **示例**：  
  ```jsx
  const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(a, b);
  }, [a, b]); // 依赖项变化时才重新计算
  ```  
- **适用场景**：计算成本高的数据（如大型数组处理、复杂数学运算）。

---

### 4. **其他优化方法**  
#### **状态分割（State Colocation）**  
- **原理**：将状态移动到离使用它的组件最近的位置，减少无关组件的渲染。  
- **示例**：  
  ```jsx
  // 错误：父组件状态变化导致所有子组件渲染
  // 正确：将状态下放到实际需要它的子组件中
  ```

#### **使用不可变数据结构（Immutable Data）**  
- **原理**：通过不可变数据（如`immer`库），减少深度比较的复杂度。  
- **示例**：  
  ```jsx
  const newState = produce(state, (draft) => {
    draft.items.push(newItem);
  });
  ```

#### **避免内联对象/函数作为props**  
- **原理**：内联对象或函数每次渲染都会生成新引用，破坏`React.memo`优化。  
- **错误示例**：  
  ```jsx
  <ChildComponent style={{ color: "red" }} onClick={() => {}} />
  ```

#### **使用`key`属性优化列表渲染**  
- **原理**：通过唯一`key`帮助React识别元素变化，减少DOM操作。  
- **示例**：  
  ```jsx
  {items.map((item) => (
    <li key={item.id}>{item.text}</li>
  ))}
  ```

---

### 5. **避免过度优化**  
- **原则**：优先解决实际性能问题（通过React DevTools Profiler检测），而非盲目优化。  
- **反例**：  
  ```jsx
  // 不必要的useMemo（计算成本极低）
  const value = useMemo(() => 1 + 1, []); // 无意义！
  ```


## React中，如何实现组件间的逻辑复用（如共享行为）

### 1. **自定义Hook（Custom Hooks）**  
- **机制**：将可复用的逻辑封装为函数，使用React Hook（如`useState`、`useEffect`）管理状态和副作用。  
- **示例**：  
  ```jsx
  // 自定义Hook：跟踪窗口滚动位置
  function useWindowScroll() {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollY;
  }

  // 组件A和组件B独立使用该Hook
  function ComponentA() {
    const scrollY = useWindowScroll(); // 独立状态
    return <div>Scroll A: {scrollY}</div>;
  }
  ```  
- **优点**：  
  - **逻辑隔离**：每个组件调用Hook时，状态独立，避免相互影响。  
  - **组合性**：多个Hook可以组合使用（如`useState` + `useEffect`）。  
- **缺点**：  
  - **适用场景限制**：仅适用于函数组件，无法直接复用JSX结构。  

---

### 2. **状态提升（State Lifting）**  
- **机制**：将共享状态提升到最近的公共父组件，通过props向下传递数据和回调函数。  
- **示例**：  
  ```jsx
  function Parent() {
    const [count, setCount] = useState(0);
    return (
      <>
        <ChildA count={count} onUpdate={() => setCount(c => c + 1)} />
        <ChildB count={count} onUpdate={() => setCount(c => c - 1)} />
      </>
    );
  }
  ```  
- **优点**：  
  - **数据同步**：子组件共享同一状态，适合需要联动的场景（如多个表单控件）。  
- **缺点**：  
  - **层级过深**：若组件层级较深，会导致“prop drilling”（逐层传递props）。  
  - **耦合性高**：父组件需管理所有子组件的状态，可能变得臃肿。  

---

### 3. **Render Props**  
- **机制**：通过props传递一个函数（通常命名为`render`），在组件内部调用该函数并传入状态或方法。  
- **示例**：  
  ```jsx
  // 提供鼠标位置的逻辑
  class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };
    handleMouseMove = (e) => this.setState({ x: e.clientX, y: e.clientY });
    render() {
      return <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>;
    }
  }

  // 使用Render Props复用逻辑
  <MouseTracker render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )} />
  ```  
- **优点**：  
  - **灵活复用**：可复用逻辑同时自定义UI结构。  
- **缺点**：  
  - **嵌套问题**：多层Render Props会导致“回调地狱”。  
  - **性能开销**：每次渲染可能创建新的函数引用，需配合`React.memo`优化。  

---

### 4. **高阶组件（HOC, Higher-Order Component）**  
- **机制**：接受一个组件，返回一个增强功能的新组件。  
- **示例**：  
  ```jsx
  // HOC：提供用户认证状态
  function withAuth(WrappedComponent) {
    return function AuthComponent(props) {
      const [user, setUser] = useState(null);
      return <WrappedComponent user={user} {...props} />;
    };
  }

  // 使用HOC
  const ProfilePage = withAuth(function Profile({ user }) {
    return <div>{user ? user.name : "未登录"}</div>;
  });
  ```  
- **优点**：  
  - **逻辑复用**：适合跨组件共享通用逻辑（如鉴权、埋点）。  
- **缺点**：  
  - **命名冲突**：若HOC和原组件props命名重复，可能导致覆盖。  
  - **调试困难**：组件层级嵌套增加，React DevTools中组件名称可能难以追踪。  

---

### 5. **Context API**  
- **机制**：通过`createContext`创建上下文，`Provider`提供数据，`Consumer`或`useContext`消费数据。  
- **示例**：  
  ```jsx
  const ThemeContext = React.createContext("light");

  function App() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }

  function Toolbar() {
    const theme = useContext(ThemeContext);
    return <div>当前主题：{theme}</div>;
  }
  ```  
- **优点**：  
  - **跨层级传递**：避免逐层传递props，适合全局状态（如主题、用户信息）。  
- **缺点**：  
  - **过度渲染**：若Context值频繁变化，可能导致大量组件重新渲染。  

---

### **方法对比**  
| 方法          | 适用场景                         | 优点                      | 缺点                          |
|---------------|--------------------------------|--------------------------|-----------------------------|
| 自定义Hook     | 复用状态逻辑（如表单验证、API请求）  | 逻辑隔离，组合性强          | 无法直接复用UI结构             |
| 状态提升       | 兄弟组件联动（如计数器、表单同步）    | 数据同步简单                | Prop drilling，父组件臃肿      |
| Render Props  | 动态组合UI与逻辑（如鼠标跟踪）       | 灵活，UI可定制             | 嵌套问题，性能开销             |
| HOC           | 横切关注点（如鉴权、日志记录）       | 集中管理逻辑                | 命名冲突，调试困难             |
| Context API   | 全局状态共享（如主题、用户信息）      | 跨层级传递数据              | 频繁更新导致性能问题            |

---

**问题6：React 18中引入了并发模式（Concurrent Mode），它的核心优势是什么？请举例说明`useTransition`或`startTransition`的用途。**
---

### **React 18并发模式的核心优势**  
React 18的并发模式（Concurrent Features）通过引入**可中断渲染**和**优先级调度**，解决了传统同步渲染阻塞主线程导致的页面卡顿问题。其核心改进包括：  
1. **可中断的渲染过程**：  
   - 使用Fiber架构将渲染拆分为多个可中断的“工作单元”，允许React根据用户交互优先级（如点击事件）暂停或放弃低优先级的渲染任务。  
   - 例如：当用户快速切换标签页时，React可以中止未完成的旧内容渲染，优先处理最新请求，避免界面冻结。  

2. **自动批处理（Automatic Batching）**：  
   - 将多个状态更新合并为单一渲染流程，减少不必要的渲染次数。  
   - 在React 17及之前，仅在事件处理函数中批处理；React 18扩展至Promise、setTimeout等异步操作。 
   ```js
   // 以前: 只有 React 事件会被批处理。
    setTimeout(() => {
        setCount(c => c + 1);
        setFlag(f => !f);
        // React 会渲染两次，每次更新一个状态（没有批处理）
    }, 1000);

    // 现在: 超时，promise，本机事件处理程序
    // 原生应用时间处理程序或者任何其他时间都被批处理了
    setTimeout(() => {
        setCount(c => c + 1);
        setFlag(f => !f);
        // 最终，React 将仅会重新渲染一次（这就是批处理！）
    }, 1000);
   ``` 

3. **过渡更新（Transition）**：  
   - 区分**紧急更新**（如用户输入）和**非紧急更新**（如数据加载），优先响应用户交互。  
   - 通过`startTransition`或`useTransition`标记非紧急更新，避免阻塞UI。  

---

### **`useTransition`的用途与示例**  
`useTransition`用于管理非紧急的状态更新，返回`isPending`标志和`startTransition`函数：  
- **`isPending`**：指示是否存在未完成的过渡更新，可用于展示加载状态。  
- **`startTransition`**：将内部的更新逻辑标记为“过渡”，使其可被高优先级任务中断。  

#### **场景示例：搜索输入防抖优化**  
假设一个搜索框需要在输入时实时请求数据，传统防抖方案通过延迟请求减少负载，但无法解决渲染阻塞问题。使用`useTransition`可在保持即时响应的同时优化性能：  
```jsx
import { useState, useTransition } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setQuery(value); // 紧急更新：立即显示用户输入
    startTransition(() => { // 非紧急更新：数据请求
      fetchResults(value).then(data => setResults(data));
    });
  };

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => handleSearch(e.target.value)} 
      />
      {isPending && <div>加载中...</div>}
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
```  
**效果对比**：  
- **无`useTransition`**：快速输入时，每次按键触发渲染和请求，可能导致输入卡顿。  
- **使用`useTransition`**：用户输入（紧急更新）立即响应，搜索请求（过渡更新）可被中断，保证输入流畅。  

---

### **`startTransition`与普通更新的区别**  
| **特性**               | **普通更新**                | **`startTransition`更新**      |  
|-------------------------|----------------------------|--------------------------------|  
| **优先级**              | 高（阻塞性）                | 低（可中断）                   |  
| **适用场景**            | 用户直接交互（如输入、点击）   | 后台任务（如数据加载、Tab切换） |  
| **对`isPending`的影响** | 无                          | 触发`isPending`为true直至完成  |  

---

### **与其他方法的对比**  
1. **防抖/节流**：  
   - 仅延迟执行，无法解决渲染阻塞问题。  
   - `useTransition`在延迟的同时允许高优先级任务插队。  

2. **`useDeferredValue`**：  
   - 用于延迟派生值的更新，如根据输入生成复杂计算结果。  
   - 与`useTransition`互补，前者处理值，后者处理更新逻辑。  

---

### **最佳实践**  
1. **识别关键交互**：将直接影响用户体验的操作（如动画、输入）标记为紧急更新。  
2. **避免滥用过渡**：过渡更新仍会消耗资源，需合理控制并发任务数量。  
3. **结合Suspense**：在数据加载时显示后备UI，提升用户体验。  

```jsx
// 结合Suspense的过渡更新
function TabSwitcher() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();
  
  return (
    <>
      <button onClick={() => startTransition(() => setTab('home'))}>
        Home {tab === 'home' && '✨'}
      </button>
      <button onClick={() => startTransition(() => setTab('about'))}>
        About {tab === 'about' && '✨'}
      </button>
      <Suspense fallback={<div>Loading...</div>}>
        <div hidden={isPending}>
          {tab === 'home' ? <HomeTab /> : <AboutTab />}
        </div>
      </Suspense>
    </>
  );
}
```  

通过并发模式，React 18让开发者能够更精细地控制渲染优先级，从而在复杂应用中实现**更流畅的用户体验**和**更高效的资源利用**。

## useEffect和useLayoutEffect有什么区别
两者主要是执行时机的不同，
- useEffect是在页面渲染完成之后异步执行，如果其中又触发了状态更新，会再次触发重新渲染。异步执行，不会阻塞渲染
- useLayoutEffect是在dom更新完，在页面重新绘制之前同步执行，如果有状态更新，会在本轮渲染周期内同步执行，所以可能会造成页面卡顿。同步执行，会阻塞渲染
- useLayoutEffect会在useEffect之前执行
​使用场景：
​**useLayoutEffect：需要同步获取布局信息**​（如元素尺寸、位置）并立即更新UI的场景。
例如：调整元素位置避免闪烁、动态计算Tooltip位置。
​**useEffect**：大多数副作用场景（数据请求、订阅等）。

## 双缓冲机制
双缓冲是图形学中的经典技术，是为了避免屏幕闪烁，维护了两块buffer，一块用来当前展示，一块用来后台计算，当后台计算完成后，交换两块buffer区域的饮用，实现无缝切换
### 双缓冲在react的应用
在react中，每个组件对应一个fiber节点，当组件更新时，不去修改旧的fiber节点，而是生成一个新的fiber节点
#### 具体流程
1. 初始化
    为组件生成一个fiber节点
2. 更新
    - 当状态发生变化触发重新渲染时，react会基于当前的fiber生成一个新的fiber节点，
    - 边生成边中断，如果有高优先级任务插进来就中断去执行高优先级的任务
3. 提交
    当新的fiber节点生成之后，交换新旧节点的引用，
#### 如何实现可中断渲染
1. 构建新的workInprogresss tree 时，react会将任务尽可能的分成小的fiber单元
2. 每当完成一个单元之后，就会检查当前剩余时间片，决定继续执行还是让出主线程
3. 如果有新的高优先级任务插进来，就会中断当前tree的构建，优先去执行新的tree的构建
4. 未完成的tree会丢弃，避免无效计算
5. 只会提交一个构建完成的完整的tree

---

## useDeferredValue的实现原理以及应用

### **核心机制修正与补充**
#### **1. 不是严格“双缓冲”，而是优先级调度**
- `useDeferredValue` 的核心是 **并发模式下的优先级调度**，而非直接复用 Fiber 树的双缓冲机制。它通过以下步骤工作：
  1. **跟踪最新值**：当输入值（如搜索关键词）变化时，React 会立即记录最新值（高优先级更新）。
  2. **生成延迟值**：同时生成一个延迟版本的值（低优先级更新），该值可能落后于最新值。
  3. **优先级竞争**：高优先级任务（如用户继续输入）可打断低优先级任务（延迟值的渲染），确保交互流畅。

#### **2. 值的维护方式**
- 内部维护 **两个版本的值**：
  - **当前值（Current Value）**：已渲染到页面的值。
  - **延迟值（Deferred Value）**：后台计算的目标值，可能未提交。
- 当延迟值的计算完成且未被中断时，React 会提交它并替换当前值。

#### **3. 中断处理**
- 如果低优先级任务被打断，React 会 **丢弃未完成的延迟值**，重新基于最新值启动新的延迟更新，避免渲染过时状态。

---

### **底层原理细节**
#### **1. 时间切片（Time Slicing）**
- React 将延迟值的更新拆分为多个小任务（时间切片），在浏览器的空闲时段（`requestIdleCallback`）执行，避免阻塞主线程。

#### **2. 优先级标记**
- 延迟更新被标记为 **低优先级（如 `Transition` 优先级）**，而用户交互（如输入、点击）为高优先级。React 的调度器会优先处理高优先级任务。

#### **3. 值更新逻辑**
```javascript
function updateDeferredValue(value) {
  const [currentValue, setCurrentValue] = useState(value);
  const [deferredValue, setDeferredValue] = useState(value);

  // 高优先级：立即更新当前值（如用户输入）
  useLayoutEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // 低优先级：延迟更新 deferredValue
  useEffect(() => {
    startTransition(() => {
      setDeferredValue(value);
    });
  }, [value]);

  return isHighPriorityUpdate ? currentValue : deferredValue;
}
```

---

### **使用场景扩展**
#### **1. 输入防抖（Debounce）的高级替代**
- **传统防抖**：通过定时器延迟更新，可能导致响应延迟且无法保证最终一致性。
- **`useDeferredValue`**：在用户连续输入时，保持输入框高优先级响应，同时延迟渲染结果列表，兼顾流畅性和最终准确性。

#### **2. 复杂计算分离**
- 当某个状态变化触发复杂计算（如大数据量筛选）时，使用延迟值避免阻塞主线程：
  ```jsx
  const deferredFilter = useDeferredValue(filter);
  const filteredList = useMemo(() => {
    return hugeList.filter(item => item.includes(deferredFilter));
  }, [deferredFilter]); // 低优先级计算
  ```

#### **3. 动画与数据更新共存**
- 在动画运行期间延迟非关键数据渲染，避免帧率下降。

---

### **注意事项**
1. **依赖并发模式**：需通过 `ReactDOM.createRoot` 启用并发模式，否则退化为同步更新。
2. **避免滥用**：非密集型场景无需使用，过度拆分优先级可能增加复杂度。
3. **与 `useTransition` 对比**：
   - `useDeferredValue`：**延迟某个值**，适用于派生状态（如筛选列表）。
   - `useTransition`：**延迟某个状态更新**，适用于手动标记低优先级操作（如路由切换）。

---

### **示例代码**
```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    // 模拟大数据量筛选
    return filterLargeDataSet(deferredQuery);
  }, [deferredQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)} // 高优先级：立即更新输入框
      />
      {/* 低优先级：延迟渲染结果 */}
      <List items={results} />
    </div>
  );
}
```

---

### **总结**
- **核心目的**：在高优先级交互（如输入）期间，保持页面响应，延迟非关键渲染。
- **底层依赖**：React 调度器（Scheduler）、时间切片、优先级标记。
- **适用边界**：数据量大或计算耗时的场景，需权衡延迟带来的视觉滞后（如占位符设计）。

## useTransition / useDeferredvalue / 防抖节流 的区别
useTransition以及useDeferredvalue本质上都是降低优先级来延迟更新，使得不阻塞页面渲染，同时可被高优先级任务插队，前者是标记处理逻辑，后者是标记一个值；防抖节流也是延迟，但是当延迟结束执行的时候还是会一直占用主线程直至任务执行完，还是会造成阻塞

```js
//child
const child = React.Memo((props) => {
    return <div></div>
})

// parent
const parent = () => {
    const data = useMemo(() => a + b + c)
    return (
        <Child :data="data" />
    )
}
```

## useState 和 useRef的区别
useState的数据必须用setState修改，是异步的，修改之后会触发页面更新，每次渲染都是独立的，需要触发视图更新的时候使用
useRef的数据在current中，可以直接修改，是同步的，跨渲染周期保持引用，适合保存与渲染无关的数据

## 父子组件的方法相互调用
1. 父组件向子组件通过props传递方法，子组件就可以调用父组件的方法
子组件用forwardRef包裹，然后使用useimperativehandle暴露自己的方法，父组件可以通过ref调用子组件的方法
```js
// parent
function parent () {
    const ref = useRef(null)
    const change = val => {
        console.log(val)
    }
    const call = () => {
        ref.current.do()
    }
    return (
        <Child onChange={change} ref={ref} />
    )
}

// child
function Child forwardRef({change, ref}) {
    useImperativeHandle(ref, () => {
        return {
            function do() {
                console.log('1')
            }
        };
    }, []);

    useEffect(() => {
        change(1)
    }, [])
}
```
2. 通过EventEmitter实现跨组件事件通信

## hoc 和自定义hook的区别
hoc组件接受一个组件，返回一个被包装过的组件，数据通过props传递，所有被包装过的组件共享hoc组件内部的状态，可能会造成props命名冲突，组件嵌套层级过深的问题，适用于鉴权，埋点的场景
hook返回的是数据，调用hook的组件接受到的数据都是相互独立的，

## React组件重新渲染的触发条件：
​内部状态变化：组件自身通过useState/useReducer更新的状态。
​父组件渲染：父组件重新渲染时，默认会递归渲染所有子组件。
​Context变化：组件消费的Context Provider的值发生变更。
​Props变化：父组件传递的props引用或值变化（即使内容相同，新对象也会触发渲染）。

## 动态路由参数以及懒加载
​动态路由：通过path="/:param"配置，useParams()获取参数，适用于详情页、个性化页面。
​懒加载：利用React.lazy+Suspense分割代码包，提升首屏加载速度，注意加载状态和错误处理。

## 渲染劫持（Render Hijacking）​：
定义：通过高阶组件（HOC）或组件继承的方式，控制或修改目标组件的渲染输出，从而在不修改原组件代码的情况下干预其渲染行为。

## Fiber架构的核心设计思想：

​可中断的异步渲染：将虚拟DOM的协调（Reconciliation）过程拆解为可暂停/恢复的增量式任务单元​（Fiber节点），避免长时间占用主线程。
​优先级调度：根据任务类型（如用户交互、动画、数据加载）动态分配优先级，高优先级任务可抢占执行。
​双缓冲机制：维护两棵Fiber树（Current树和WorkInProgress树），交替更新保证渲染连续性。

在fiber之前，react是用树结构实现的虚拟dom对象，用树结构实现的问题是一旦开始渲染就不能中断，因为受限于树结构本身的构造，中断之后无法再接续上，因此当dom树过大，渲染进程就会长时间占用主线程，造成页面卡顿，之后为了解决这个问题，改用了fiber架构，他是用链表结构的，因为链表本身的特殊机制，每个节点都有指向其父节点和兄弟节点的指针，所以即使中断，也可以在中断之后还能接续上，同时为了不长时间占用主线程，还采用了时间分片的技术，将渲染任务分成一个个小的切片也就是fiber节点，react会在每个渲染周期的空隙时间去执行渲染任务，通过requestIdleCallback去获取空隙时间，每次执行完一个切片任务都去判断一下是否还有空余时间，如果有高优先级任务插进去，会主动让出主线程，react利用了双缓冲的机制，维护了两个fiber树，一个current树用于当前展示，还有一个在构建的workInprogress树，最后会确保提交的是一个完成的workInprogress树替换掉之前的current树
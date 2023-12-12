### zustand

- `useSyncExternalStore`: 让你订阅外部 store 的 React Hook

```js
// subscribe 函数应当订阅该 store 并返回一个取消订阅的函数。
// getSnapshot 函数应当从该 store 读取数据的快照
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)


const listeners = new Set()
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
```

#### 订阅外部 store

有时一个组件需要从一些 React 之外的 store 读取一些随时间变化的数据

- 在 React 之外持有状态的第三方状态管理库
- 暴露出一个可变值及订阅其改变事件的浏览器 API

```js
import { useSyncExternalStore } from "react"
import { todosStore } from "./todoStore.js"

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getState)
  // ...
}
```

#### 订阅浏览器 API

你想订阅一些由浏览器暴露的并随时间变化的值时。例如，假设你想要组件展示网络连接是否正常。浏览器通过一个叫做 `navigator.onLine` 的属性暴露出这一信息

```js
import { useSyncExternalStore } from "react"

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)
  // ...
}

function getSnapshot() {
  return navigator.onLine
}

function subscribe(callback) {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)
  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}
```

#### 把逻辑抽取到自定义 Hook

通常不会在组件里直接用 useSyncExternalStore，而是在自定义 Hook 里调用它。这使得你可以在不同组件里使用相同的外部 store。

```js
import { useSyncExternalStore } from "react"

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)
  return isOnline
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

#### “The result of getSnapshot should be cached”

错误意味着你的 getSnapshot 函数每次调用都返回了一个新对象

```js
function getSnapshot() {
  // 🔴 getSnapshot 不要总是返回不同的对象
  return {
    todos: myStore.todos,
  }
}
```

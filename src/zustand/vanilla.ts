export interface StoreApi<T> {
  setState: (
    partial: T | Partial<T> | { _(state: T): T | Partial<T> }["_"],
    replace?: boolean
  ) => void
  getState: () => T
  subscribe: (listener: (state: T, prevState: T) => void) => () => void
  destroy: () => void
}

export type StateCreator<T> = {
  getState: StoreApi<T>["getState"]
  setState: StoreApi<T>["setState"]
}

export const createStore = (createState: any) => {
  type TState = ReturnType<typeof createState> // 状态值
  type Listener = (state: TState, prevState: TState) => void

  let state: TState
  const listeners: Set<Listener> = new Set()

  const setState: StoreApi<TState>["setState"] = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial

    if (!Object.is(nextState, state)) {
      const previousState = state
      state =
        replace ?? typeof nextState !== "object"
          ? nextState
          : Object.assign({}, state, nextState)

      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState: StoreApi<TState>["getState"] = () => state

  // 订阅
  const subscribe: StoreApi<TState>["subscribe"] = (listener: Listener) => {
    listeners.add(listener)

    // 销毁订阅
    return () => listeners.delete(listener)
  }

  // 清除
  const destroy: StoreApi<TState>["destroy"] = () => listeners.clear()

  const api = {
    getState,
    setState,
    destroy,
    subscribe,
  }

  state = createState(setState, getState, api)

  return api
}

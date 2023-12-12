import { useSyncExternalStore } from "react"
import { StoreApi, createStore } from "./vanilla"

type ExtractState<S> = S extends { getState: () => infer T } ? T : never
type ReadonlyStoreApi<T> = Pick<StoreApi<T>, "getState" | "subscribe">
type WithReact<S extends ReadonlyStoreApi<unknown>> = S & {
  getServerState?: () => ExtractState<S>
}

export function create<T>(createState: any) {
  return createStateImpl(createState)
}

function createStateImpl(createState: any) {
  const api = createStore(createState)
  const useBoundStore = () => useStore(api)
  return useBoundStore
}

export function useStore<TState>(api: WithReact<StoreApi<TState>>) {
  // useSyncExternalStore 订阅外部 store 的 React Hook
  const slice = useSyncExternalStore(api.subscribe, api.getState)
  return slice
}

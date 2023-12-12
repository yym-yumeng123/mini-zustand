import { create } from "./zustand/"

interface BearState {
  bears: number
  increse: (by?: number) => void
  decrese: (by?: number) => void
  reset: () => void
}

const useBearStore = create<BearState>((set: any) => ({
  bears: 0,
  increse: (by = 1) => set((state: any) => ({ bears: state.bears + by })),
  decrese: (by = 1) => set((state: any) => ({ bears: state.bears - by })),
  reset: () => set({ bears: 0 }),
}))

export default useBearStore

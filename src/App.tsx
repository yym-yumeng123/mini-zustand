import useBearStore from "./useBearStore"

function App() {
  const { bears, increse, decrese, reset } = useBearStore()
  return (
    <>
      <button onClick={() => increse()}>increse {bears}</button>
      <button onClick={() => decrese()}>decrese {bears}</button>
      <button onClick={() => reset()}>reset {bears}</button>
    </>
  )
}

export default App

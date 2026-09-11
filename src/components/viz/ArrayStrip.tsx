type Props = {
  arr: number[]
  focus?: number[]
  compact?: boolean
}

export function ArrayStrip({ arr, focus = [], compact }: Props) {
  if (!arr.length) {
    return <div className="heap-empty">Array is empty — the tree is empty. They are the same object.</div>
  }
  return (
    <div className={`heap-strip${compact ? ' compact' : ''}`} aria-label="Heap array">
      {arr.map((v, i) => {
        const on = focus.includes(i)
        const p = i === 0 ? 'root' : `p=${Math.floor((i - 1) / 2)}`
        return (
          <div key={`${i}-${v}`} className={`heap-cell${on ? ' on' : ''}`}>
            <div className="heap-idx">[{i}]</div>
            <div className="heap-val">{v}</div>
            <div className="heap-parent">{p}</div>
          </div>
        )
      })}
    </div>
  )
}

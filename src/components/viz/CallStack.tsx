type Props = {
  frames?: string[]
  queue?: string[]
  title?: string
}

export function CallStack({ frames, queue, title }: Props) {
  if (queue) {
    return (
      <div className="stack-viz">
        <div className="pq-array-label">{title ?? 'Queue (front → rear)'}</div>
        <div className="stack-row">
          {queue.length ? (
            queue.map((q, i) => (
              <span key={`${q}-${i}`} className={`chip${i === 0 ? ' on' : ''}`}>
                {q}
              </span>
            ))
          ) : (
            <span className="muted">empty</span>
          )}
        </div>
      </div>
    )
  }
  const list = frames ?? []
  return (
    <div className="stack-viz">
      <div className="pq-array-label">{title ?? 'Recursion call stack (top = current frame)'}</div>
      <div className="stack-col">
        {!list.length ? <span className="muted">stack empty — no live call</span> : null}
        {[...list].reverse().map((f, i) => (
          <div key={`${f}-${i}`} className={`stack-frame${i === 0 ? ' top' : ''}`}>
            <span className="stack-fn">pre/in/post({f})</span>
            {i === 0 ? <span className="stack-tag">TOP</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

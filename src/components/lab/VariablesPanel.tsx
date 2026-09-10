type Props = {
  variables: Record<string, string | number | boolean>
}

export function VariablesPanel({ variables }: Props) {
  const entries = Object.entries(variables)
  return (
    <div className="card">
      <h3>Variables</h3>
      <div className="var-grid">
        {entries.length === 0 && <div className="muted">No variables yet.</div>}
        {entries.map(([k, v]) => (
          <div className="var-item" key={k}>
            <div className="k">{k}</div>
            <div className="v">{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

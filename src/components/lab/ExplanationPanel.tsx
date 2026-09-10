import type { Explanation } from '../../types/lab'

type Props = {
  explanation: Explanation | null
  message?: string
  tone?: 'info' | 'success' | 'warn' | 'error'
}

export function ExplanationPanel({ explanation, message, tone }: Props) {
  return (
    <div className="card">
      <h3>Explanation</h3>
      {message && <div className={`msg ${tone ?? 'info'}`}>{message}</div>}
      {!explanation ? (
        <p className="muted">Run an operation to see what happens, why, and what changed.</p>
      ) : (
        <div className="expl-grid" style={{ marginTop: message ? 10 : 0 }}>
          <div className="expl-box">
            <b>What is happening?</b>
            {explanation.happening}
          </div>
          <div className="expl-box" style={{ borderColor: 'var(--teal)' }}>
            <b>Why?</b>
            {explanation.why}
          </div>
          <div className="expl-box" style={{ borderColor: 'var(--amber)' }}>
            <b>What changed?</b>
            {explanation.changed}
          </div>
        </div>
      )}
    </div>
  )
}

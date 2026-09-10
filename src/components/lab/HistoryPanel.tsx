import type { HistoryEntry } from '../../types/lab'

type Props = { entries: HistoryEntry[] }

export function HistoryPanel({ entries }: Props) {
  return (
    <div className="card">
      <h3>Operation History</h3>
      <div className="history" aria-live="polite">
        {entries.length === 0 && <div className="muted">No operations yet.</div>}
        {[...entries].reverse().map((e, i) => (
          <div key={e.id}>
            {entries.length - i}. {e.text}
          </div>
        ))}
      </div>
    </div>
  )
}

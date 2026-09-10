import type { ComplexityRow } from '../../types/lab'

type Props = { rows: ComplexityRow[]; note?: string }

export function ComplexityPanel({ rows, note }: Props) {
  return (
    <div className="card">
      <h3>Complexity</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Time</th>
            <th>Space</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.op}>
              <td>
                {r.op}
                {r.note ? (
                  <div className="muted" style={{ fontSize: '0.8rem' }}>
                    {r.note}
                  </div>
                ) : null}
              </td>
              <td>
                <b>{r.time}</b>
              </td>
              <td>{r.space}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="muted">{note}</p>}
    </div>
  )
}

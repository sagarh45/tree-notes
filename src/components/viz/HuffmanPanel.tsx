import { BinaryTreeSvg } from './BinaryTreeSvg'
import type { BinNode } from '../../lib/binaryTree'

type Props = {
  forest?: BinNode[]
  marks?: Record<string, string>
  codes?: { ch: string; freq: number; code: string }[]
  compact?: boolean
}

export function HuffmanPanel({ forest = [], marks, codes = [], compact }: Props) {
  return (
    <div className="huff-panel">
      <div className="huff-forest">
        {forest.length ? (
          forest.map((t, i) => (
            <div key={t.id + i} className="huff-tree">
              <BinaryTreeSvg root={t} marks={marks} compact={compact} edgeLabels={forest.length === 1} />
            </div>
          ))
        ) : (
          <div className="viz-frame viz-empty">Load a frequency pack or type a:5,b:2,c:1 and Build.</div>
        )}
      </div>
      {codes.length ? (
        <table className="table huff-codes">
          <thead>
            <tr>
              <th>Letter</th>
              <th>Freq</th>
              <th>Code (left=0, right=1)</th>
              <th>Bits</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.ch}>
                <td>
                  <b>{c.ch}</b>
                </td>
                <td>{c.freq}</td>
                <td>
                  <code>{c.code || '—'}</code>
                </td>
                <td>{c.code ? c.code.length : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

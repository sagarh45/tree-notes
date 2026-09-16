import { useId } from 'react'
import { layoutTrie, type TrieNode } from '../../lib/trie'

type Props = {
  root: TrieNode | null
  highlight?: string[]
  compact?: boolean
}

export function TrieSvg({ root, highlight = [], compact = false }: Props) {
  const arrowId = useId()
  if (!root) {
    return <div className="viz-frame viz-empty">Trie is empty. Type a word and Insert.</div>
  }
  const laid = layoutTrie(root, compact)
  const r = compact ? 14 : 18
  const hi = new Set(highlight)
  return (
    <div className={`viz-frame${compact ? ' compact' : ''}`}>
      <svg
        className="tree-svg"
        viewBox={`0 0 ${laid.width} ${laid.height}`}
        width="100%"
        role="img"
        aria-label="Trie diagram"
      >
        <defs><marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="context-stroke" /></marker></defs>
        {laid.edges.map((e, i) => {
          const midX = (e.from.x + e.to.x) / 2
          const midY = (e.from.y + e.to.y) / 2
          const on = hi.has(e.toId)
          return (
            <g key={i}>
              <line
                className={`tn-edge${on ? ' hot' : ''}`}
                x1={e.from.x}
                y1={e.from.y + r}
                x2={e.to.x}
                y2={e.to.y - r - 2}
                markerEnd={`url(#${arrowId})`}
              />
              <text className={`trie-elabel${on ? ' on' : ''}`} x={midX + 8} y={midY} textAnchor="start">
                {e.ch}
              </text>
            </g>
          )
        })}
        {laid.nodes.map(({ node, x, y }) => {
          const on = hi.has(node.id)
          return (
            <g key={node.id} transform={`translate(${x} ${y})`}>
              <circle className={`tn trie-n${on ? ' on' : ''}${node.end ? ' end' : ''}`} r={r} />
              <text className="tn-text" textAnchor="middle" dominantBaseline="central">
                {node.ch === '∅' ? '•' : node.ch}
              </text>
              {node.end ? (
                <text className="tn-end" textAnchor="middle" y={r + 12}>
                  END
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

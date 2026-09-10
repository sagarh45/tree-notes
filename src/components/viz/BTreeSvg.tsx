import { layoutBTree, type BTreeNode } from '../../lib/btree'

type Props = {
  root: BTreeNode
  highlightId?: string
  highlightKey?: number
  compact?: boolean
}

export function BTreeSvg({ root, highlightId, highlightKey, compact = false }: Props) {
  const laid = layoutBTree(root)
  return (
    <div className={`viz-frame${compact ? ' compact' : ''}`}>
      <svg
        className="tree-svg"
        viewBox={`0 0 ${Math.max(laid.width, 320)} ${Math.max(laid.height, 160)}`}
        width="100%"
        role="img"
        aria-label="B-tree diagram"
      >
        {laid.edges.map((e, i) => (
          <line key={i} className="tn-edge" x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
        {laid.nodes.map((n) => {
          const on = n.id === highlightId
          const keys = n.keys.length ? n.keys : ['·']
          const cell = n.width / keys.length
          return (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <rect className={`bn${on ? ' on' : ''}`} width={n.width} height={n.height} rx="8" />
              {keys.map((k, i) => (
                <g key={i}>
                  {i > 0 ? <line className="bn-div" x1={i * cell} y1="0" x2={i * cell} y2={n.height} /> : null}
                  <text
                    className={`bn-text${k === highlightKey ? ' hot' : ''}`}
                    x={i * cell + cell / 2}
                    y={n.height / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {k}
                  </text>
                </g>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

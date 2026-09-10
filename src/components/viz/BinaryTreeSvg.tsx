import { layoutTree, type BinNode } from '../../lib/binaryTree'

export type TreeMarks = Record<string, string>

type Props = {
  root: BinNode | null
  marks?: TreeMarks
  visitOrder?: Record<string, number>
  tags?: Record<string, string>
  showBf?: boolean
  emptyText?: string
  compact?: boolean
  dimUnmarked?: boolean
}

export function BinaryTreeSvg({
  root,
  marks = {},
  visitOrder,
  tags,
  showBf,
  emptyText = 'Tree is empty. Insert a value to begin.',
  compact = false,
  dimUnmarked = false,
}: Props) {
  if (!root) {
    return <div className={`viz-frame viz-empty${compact ? ' compact' : ''}`}>{emptyText}</div>
  }

  const hasTags = Boolean(tags && Object.keys(tags).length)
  const laid = layoutTree(
    root,
    compact
      ? { hGap: 48, vGap: 58, padX: 28, padY: showBf || hasTags ? 36 : 24 }
      : showBf || hasTags
        ? { padY: 58 }
        : undefined,
  )
  const r = compact ? 14 : 22

  return (
    <div className={`viz-frame${compact ? ' compact' : ''}`}>
      <svg
        className="tree-svg"
        viewBox={`0 0 ${laid.width} ${laid.height}`}
        width="100%"
        role="img"
        aria-label="Binary tree diagram"
      >
        {laid.edges.map((e) => (
          <line
            key={`${e.fromId}-${e.toId}`}
            className="tn-edge"
            x1={e.from.x}
            y1={e.from.y + r - 2}
            x2={e.to.x}
            y2={e.to.y - r + 2}
          />
        ))}
        {laid.nodes.map(({ node, x, y }) => {
          const mark = marks[node.id] ?? (dimUnmarked && Object.keys(marks).length ? 'dim' : '')
          const order = visitOrder?.[node.id]
          const tag = tags?.[node.id]
          return (
            <g key={node.id} className={`tn-g ${mark}`} transform={`translate(${x} ${y})`}>
              <circle className="tn" r={r} />
              <text className="tn-text" textAnchor="middle" dominantBaseline="central">
                {node.value}
              </text>
              {tag ? (
                <text className="tn-bf" textAnchor="middle" y={-r - 8}>
                  {tag}
                </text>
              ) : showBf && node.bf !== undefined ? (
                <text className="tn-bf" textAnchor="middle" y={-r - 10}>
                  BF {node.bf > 0 ? `+${node.bf}` : node.bf}
                </text>
              ) : null}
              {order !== undefined ? (
                <g transform={`translate(${r - 4}, ${-r + 2})`}>
                  <circle className="tn-badge" r="9" />
                  <text className="tn-badge-text" textAnchor="middle" dominantBaseline="central">
                    {order}
                  </text>
                </g>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function Legend() {
  return (
    <div className="legend">
      <span>
        <i style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)' }} /> path
      </span>
      <span>
        <i style={{ background: 'var(--teal)', borderColor: 'var(--teal)' }} /> current
      </span>
      <span>
        <i style={{ background: 'var(--green-soft)', borderColor: 'var(--green)' }} /> found
      </span>
      <span>
        <i style={{ background: 'var(--amber-soft)', borderColor: 'var(--amber)' }} /> new
      </span>
      <span>
        <i style={{ background: 'var(--rose-soft)', borderColor: 'var(--rose)' }} /> unbalanced
      </span>
    </div>
  )
}

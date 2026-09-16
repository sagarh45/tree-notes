import { useId } from 'react'
import { layoutTree, type BinNode, type ThreadEdge } from '../../lib/binaryTree'

export type TreeMarks = Record<string, string>

type Props = {
  root: BinNode | null
  marks?: TreeMarks
  visitOrder?: Record<string, number>
  tags?: Record<string, string>
  showBf?: boolean
  showColor?: boolean
  showIndex?: boolean
  showNulls?: boolean
  edgeLabels?: boolean
  threads?: ThreadEdge[]
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
  showColor,
  showIndex,
  showNulls,
  edgeLabels,
  threads,
  emptyText = 'Tree is empty. Insert a value to begin.',
  compact = false,
  dimUnmarked = false,
}: Props) {
  const arrowId = useId()
  if (!root) {
    return <div className={`viz-frame viz-empty${compact ? ' compact' : ''}`}>{emptyText}</div>
  }

  const hasTags = Boolean(tags && Object.keys(tags).length)
  const labelLength = (n: BinNode | null): number => n ? Math.max(String(n.value).length, labelLength(n.left), labelLength(n.right)) : 0
  const labelWidth = labelLength(root) * (compact ? 7 : 9) + 16
  const extraTop = showBf || hasTags || showColor || showIndex
  const laid = layoutTree(
    root,
    compact
      ? { hGap: Math.max(52, labelWidth + 12), vGap: 64, padX: Math.max(32, labelWidth / 2 + 10), padY: extraTop ? 40 : 28 }
      : extraTop
        ? { padY: 58, padX: Math.max(44, labelWidth / 2 + 12), hGap: Math.max(76, labelWidth + 12), vGap: 92 }
        : { padX: Math.max(44, labelWidth / 2 + 12), hGap: Math.max(76, labelWidth + 12), vGap: 90 },
  )
  const r = compact ? 15 : 24
  const pos = new Map(laid.nodes.map((n) => [n.node.id, n]))

  return (
    <div className={`viz-frame${compact ? ' compact' : ''}`}>
      <svg
        className="tree-svg"
        viewBox={`0 0 ${laid.width} ${laid.height + (showNulls ? 16 : 0)}`}
        width="100%"
        style={{ minWidth: Math.min(laid.width, compact ? 600 : 900) }}
        role="img"
        aria-label="Binary tree diagram"
      >
        <defs><marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="context-stroke" /></marker></defs>
        {laid.edges.map((e) => {
          const midX = (e.from.x + e.to.x) / 2
          const midY = (e.from.y + e.to.y) / 2 - 10
          const isLeft = pos.get(e.fromId)?.node.left?.id === e.toId
          return (
            <g key={`${e.fromId}-${e.toId}`}>
              <line
                className="tn-edge"
                x1={e.from.x} y1={e.from.y + r}
                x2={e.to.x} y2={e.to.y - r - 2}
                markerEnd={`url(#${arrowId})`}
              />
              {edgeLabels ? (
                <text className="tn-elabel" x={midX + (isLeft ? -10 : 10)} y={midY + 6}>
                  {isLeft ? 'L' : 'R'}
                </text>
              ) : null}
            </g>
          )
        })}
        {showNulls
          ? laid.nodes.map(({ node, x, y }) => {
              const stubs: { dx: number; label: string }[] = []
              if (!node.left) stubs.push({ dx: -28, label: '∅' })
              if (!node.right) stubs.push({ dx: 28, label: '∅' })
              return stubs.map((s) => (
                <g key={`${node.id}-${s.label}-${s.dx}`} opacity="0.55">
                  <line className="tn-null" x1={x} y1={y + r - 2} x2={x + s.dx} y2={y + r + 18} />
                  <circle className="tn-null-dot" cx={x + s.dx} cy={y + r + 22} r="6" />
                  <text className="tn-null-text" x={x + s.dx} y={y + r + 23} textAnchor="middle" dominantBaseline="central">
                    {s.label}
                  </text>
                </g>
              ))
            })
          : null}
        {threads?.map((th) => {
          const a = pos.get(th.fromId)
          const b = pos.get(th.toId)
          if (!a || !b) return null
          return (
            <g key={`th-${th.fromId}-${th.side}`}>
              <line
                className="tn-thread"
                x1={a.x + (th.side === 'L' ? -r : r)} y1={a.y}
                x2={b.x} y2={b.y + r + 2}
                markerEnd={`url(#${arrowId})`}
              />
            </g>
          )
        })}
        {laid.nodes.map(({ node, x, y }) => {
          const mark = marks[node.id] ?? (dimUnmarked && Object.keys(marks).length ? 'dim' : '')
          const order = visitOrder?.[node.id]
          const tag = tags?.[node.id]
          const color = showColor ? node.color : undefined
          const colorCls = color === 'R' ? 'red' : color === 'B' ? 'black' : ''
          return (
            <g key={node.id} className={`tn-g ${mark} ${colorCls}`} transform={`translate(${x} ${y})`}>
              {String(node.value).length > 3 ? <rect className="tn" x={-(String(node.value).length * (compact ? 7 : 9) + 16) / 2} y={-r} width={String(node.value).length * (compact ? 7 : 9) + 16} height={r * 2} rx={r} /> : <circle className="tn" r={r} />}
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
              ) : color ? (
                <text className="tn-bf" textAnchor="middle" y={-r - 10}>
                  {color === 'R' ? 'RED' : 'BLK'}
                </text>
              ) : node.freq !== undefined ? (
                <text className="tn-bf" textAnchor="middle" y={-r - 10}>
                  f={node.freq}
                </text>
              ) : null}
              {node.code ? (
                <text className="tn-code" textAnchor="middle" y={r + 14}>
                  {node.code}
                </text>
              ) : null}
              {showIndex && node.heapIndex !== undefined ? (
                <text className="tn-idx" textAnchor="middle" y={r + 14}>
                  [{node.heapIndex}]
                </text>
              ) : null}
              {order !== undefined ? (
                <g transform={`translate(${r - 2}, ${-r + 2})`}>
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

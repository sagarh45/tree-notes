import { heapToTree } from '../../lib/heap'
import { BinaryTreeSvg } from './BinaryTreeSvg'
import { ArrayStrip } from './ArrayStrip'

type Props = {
  arr: number[]
  focus?: number[]
  marks?: Record<string, string>
  compact?: boolean
}

export function HeapDualViz({ arr, focus = [], marks, compact }: Props) {
  const root = heapToTree(arr)
  const treeMarks: Record<string, string> = { ...marks }
  for (const i of focus) treeMarks[`h${i}`] = treeMarks[`h${i}`] ?? 'current'
  return (
    <div className="heap-dual">
      <BinaryTreeSvg
        root={root}
        marks={treeMarks}
        showIndex
        compact={compact}
        emptyText="Max-heap is empty. Insert a key — it is appended to the array, then it swims up."
      />
      <div className="pq-array-label">The SAME heap as an array (index i → left 2i+1, right 2i+2)</div>
      <ArrayStrip arr={arr} focus={focus} compact={compact} />
    </div>
  )
}

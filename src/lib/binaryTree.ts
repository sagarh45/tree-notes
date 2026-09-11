export type NodeValue = number | string

export type BinNode = {
  id: string
  value: NodeValue
  left: BinNode | null
  right: BinNode | null
  bf?: number
  color?: 'R' | 'B'
  heapIndex?: number
  freq?: number
  code?: string
}

export type Point = { x: number; y: number }

export type LaidOutNode = {
  node: BinNode
  x: number
  y: number
}

export type LaidOutEdge = {
  fromId: string
  toId: string
  from: Point
  to: Point
}

let nextId = 1

export function resetIds(start = 1) {
  nextId = start
}

export function makeNode(value: NodeValue, id?: string): BinNode {
  return { id: id ?? `n${nextId++}`, value, left: null, right: null }
}

export function cloneTree(node: BinNode | null): BinNode | null {
  if (!node) return null
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    bf: node.bf,
    color: node.color,
    heapIndex: node.heapIndex,
    freq: node.freq,
    code: node.code,
  }
}

export function findNode(root: BinNode | null, id: string): BinNode | null {
  if (!root) return null
  if (root.id === id) return root
  return findNode(root.left, id) ?? findNode(root.right, id)
}

export function heightOf(node: BinNode | null): number {
  if (!node) return -1
  return 1 + Math.max(heightOf(node.left), heightOf(node.right))
}

export function sizeOf(node: BinNode | null): number {
  if (!node) return 0
  return 1 + sizeOf(node.left) + sizeOf(node.right)
}

export function withBalanceFactors(node: BinNode | null): BinNode | null {
  if (!node) return null
  const left = withBalanceFactors(node.left)
  const right = withBalanceFactors(node.right)
  return {
    ...node,
    left,
    right,
    bf: heightOf(left) - heightOf(right),
  }
}

export function layoutTree(
  root: BinNode | null,
  opts?: { hGap?: number; vGap?: number; padX?: number; padY?: number },
): {
  nodes: LaidOutNode[]
  edges: LaidOutEdge[]
  width: number
  height: number
} {
  const hGap = opts?.hGap ?? 70
  const vGap = opts?.vGap ?? 86
  const padX = opts?.padX ?? 44
  const padY = opts?.padY ?? 40
  const nodes: LaidOutNode[] = []
  let i = 0
  let maxDepth = 0

  function walk(n: BinNode | null, depth: number) {
    if (!n) return
    walk(n.left, depth + 1)
    nodes.push({ node: n, x: padX + i * hGap, y: padY + depth * vGap })
    i += 1
    maxDepth = Math.max(maxDepth, depth)
    walk(n.right, depth + 1)
  }

  walk(root, 0)
  const pos = new Map(nodes.map((n) => [n.node.id, n]))
  const edges: LaidOutEdge[] = []
  for (const n of nodes) {
    if (n.node.left) {
      const c = pos.get(n.node.left.id)
      if (c) {
        edges.push({
          fromId: n.node.id,
          toId: c.node.id,
          from: { x: n.x, y: n.y },
          to: { x: c.x, y: c.y },
        })
      }
    }
    if (n.node.right) {
      const c = pos.get(n.node.right.id)
      if (c) {
        edges.push({
          fromId: n.node.id,
          toId: c.node.id,
          from: { x: n.x, y: n.y },
          to: { x: c.x, y: c.y },
        })
      }
    }
  }

  return {
    nodes,
    edges,
    width: Math.max(i * hGap + padX * 2, 280),
    height: padY * 2 + maxDepth * vGap + 24,
  }
}

export function buildLetterTree(): BinNode {
  resetIds(1)
  const a = makeNode('A')
  const b = makeNode('B')
  const c = makeNode('C')
  const d = makeNode('D')
  const e = makeNode('E')
  const f = makeNode('F')
  const g = makeNode('G')
  a.left = b
  a.right = c
  b.left = d
  b.right = e
  c.left = f
  c.right = g
  return a
}

export function buildSampleNumbers(): BinNode {
  resetIds(1)
  const n8 = makeNode(8)
  const n3 = makeNode(3)
  const n10 = makeNode(10)
  const n1 = makeNode(1)
  const n6 = makeNode(6)
  const n14 = makeNode(14)
  const n4 = makeNode(4)
  const n7 = makeNode(7)
  const n13 = makeNode(13)
  n8.left = n3
  n8.right = n10
  n3.left = n1
  n3.right = n6
  n6.left = n4
  n6.right = n7
  n10.right = n14
  n14.left = n13
  return n8
}

export type VisitKind = 'preorder' | 'inorder' | 'postorder' | 'levelorder'

export type VisitStep = {
  id: string
  value: NodeValue
  action: 'enter' | 'visit' | 'go-left' | 'go-right' | 'leave' | 'enqueue' | 'dequeue'
  note: string
  stack: string[]
  queue?: string[]
}

export function traversalTrace(root: BinNode | null, kind: VisitKind): VisitStep[] {
  const steps: VisitStep[] = []
  if (!root) return steps
  const stack: string[] = []

  if (kind === 'levelorder') {
    const q: BinNode[] = [root]
    steps.push({
      id: root.id,
      value: root.value,
      action: 'enqueue',
      note: `Enqueue root ${root.value}`,
      stack: [],
      queue: q.map((n) => String(n.value)),
    })
    while (q.length) {
      const n = q.shift()!
      steps.push({
        id: n.id,
        value: n.value,
        action: 'dequeue',
        note: `Dequeue ${n.value} and visit (front of queue)`,
        stack: [],
        queue: q.map((x) => String(x.value)),
      })
      steps.push({
        id: n.id,
        value: n.value,
        action: 'visit',
        note: `Visit ${n.value} (level-order)`,
        stack: [],
        queue: q.map((x) => String(x.value)),
      })
      if (n.left) {
        q.push(n.left)
        steps.push({
          id: n.left.id,
          value: n.left.value,
          action: 'enqueue',
          note: `Enqueue left child ${n.left.value}`,
          stack: [],
          queue: q.map((x) => String(x.value)),
        })
      }
      if (n.right) {
        q.push(n.right)
        steps.push({
          id: n.right.id,
          value: n.right.value,
          action: 'enqueue',
          note: `Enqueue right child ${n.right.value}`,
          stack: [],
          queue: q.map((x) => String(x.value)),
        })
      }
    }
    return steps
  }

  function walk(n: BinNode | null, parent: string | null) {
    if (!n) return
    stack.push(String(n.value))
    steps.push({
      id: n.id,
      value: n.value,
      action: 'enter',
      note: `Call ${kind}(${n.value}) — push frame`,
      stack: [...stack],
    })

    const visitNow = () => {
      steps.push({
        id: n.id,
        value: n.value,
        action: 'visit',
        note:
          kind === 'preorder'
            ? `Print ${n.value} first (NLR)`
            : kind === 'inorder'
              ? `Left of ${n.value} is done — print node (LNR)`
              : `Both children of ${n.value} done — print last (LRN)`,
        stack: [...stack],
      })
    }

    if (kind === 'preorder') visitNow()
    if (n.left) {
      steps.push({
        id: n.left.id,
        value: n.left.value,
        action: 'go-left',
        note: `Go left of ${n.value} → ${n.left.value}`,
        stack: [...stack],
      })
    }
    walk(n.left, String(n.value))
    if (kind === 'inorder') visitNow()
    if (n.right) {
      steps.push({
        id: n.right.id,
        value: n.right.value,
        action: 'go-right',
        note: `Go right of ${n.value} → ${n.right.value}`,
        stack: [...stack],
      })
    }
    walk(n.right, String(n.value))
    if (kind === 'postorder') visitNow()

    steps.push({
      id: n.id,
      value: n.value,
      action: 'leave',
      note: `Return from ${kind}(${n.value})${parent ? ` back to ${parent}` : ' — tree done'}`,
      stack: [...stack],
    })
    stack.pop()
  }

  walk(root, null)
  return steps
}

export function traversalSteps(root: BinNode | null, kind: VisitKind): VisitStep[] {
  return traversalTrace(root, kind).filter((s) => s.action === 'visit')
}

export function visitValues(root: BinNode | null, kind: VisitKind): NodeValue[] {
  return traversalSteps(root, kind).map((s) => s.value)
}

export function inorderNodes(root: BinNode | null): BinNode[] {
  const out: BinNode[] = []
  function walk(n: BinNode | null) {
    if (!n) return
    walk(n.left)
    out.push(n)
    walk(n.right)
  }
  walk(root)
  return out
}

export type ThreadEdge = { fromId: string; toId: string; side: 'L' | 'R' }

/** Inorder threads: empty left points to predecessor, empty right to successor. */
export function inorderThreads(root: BinNode | null): ThreadEdge[] {
  const seq = inorderNodes(root)
  const edges: ThreadEdge[] = []
  for (let i = 0; i < seq.length; i++) {
    const n = seq[i]
    if (!n.left && i > 0) edges.push({ fromId: n.id, toId: seq[i - 1].id, side: 'L' })
    if (!n.right && i < seq.length - 1) edges.push({ fromId: n.id, toId: seq[i + 1].id, side: 'R' })
  }
  return edges
}

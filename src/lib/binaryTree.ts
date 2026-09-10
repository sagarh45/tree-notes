export type NodeValue = number | string

export type BinNode = {
  id: string
  value: NodeValue
  left: BinNode | null
  right: BinNode | null
  bf?: number
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
  action: 'visit' | 'go-left' | 'go-right' | 'go-up' | 'enqueue'
  note: string
}

export function traversalSteps(root: BinNode | null, kind: VisitKind): VisitStep[] {
  const steps: VisitStep[] = []
  if (!root) return steps

  if (kind === 'preorder') {
    function walk(n: BinNode | null) {
      if (!n) return
      steps.push({ id: n.id, value: n.value, action: 'visit', note: `Visit ${n.value} (Node first)` })
      if (n.left) {
        steps.push({ id: n.left.id, value: n.left.value, action: 'go-left', note: `Go left of ${n.value}` })
      }
      walk(n.left)
      if (n.right) {
        steps.push({ id: n.right.id, value: n.right.value, action: 'go-right', note: `Go right of ${n.value}` })
      }
      walk(n.right)
    }
    walk(root)
    return steps.filter((s) => s.action === 'visit')
  }

  if (kind === 'inorder') {
    function walk(n: BinNode | null) {
      if (!n) return
      walk(n.left)
      steps.push({ id: n.id, value: n.value, action: 'visit', note: `Visit ${n.value} (Left done, Node next)` })
      walk(n.right)
    }
    walk(root)
    return steps
  }

  if (kind === 'postorder') {
    function walk(n: BinNode | null) {
      if (!n) return
      walk(n.left)
      walk(n.right)
      steps.push({ id: n.id, value: n.value, action: 'visit', note: `Visit ${n.value} (both children done)` })
    }
    walk(root)
    return steps
  }

  const q: BinNode[] = [root]
  while (q.length) {
    const n = q.shift()!
    steps.push({ id: n.id, value: n.value, action: 'visit', note: `Visit ${n.value} (front of queue)` })
    if (n.left) q.push(n.left)
    if (n.right) q.push(n.right)
  }
  return steps
}

export function visitValues(root: BinNode | null, kind: VisitKind): NodeValue[] {
  return traversalSteps(root, kind).map((s) => s.value)
}

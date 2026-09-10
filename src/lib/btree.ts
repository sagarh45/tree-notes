export type BTreeNode = {
  id: string
  keys: number[]
  children: BTreeNode[]
}

export type BTreeStep = {
  kind: 'start' | 'descend' | 'insert-leaf' | 'split' | 'new-root'
  message: string
  tree: BTreeNode
  highlightId?: string
  highlightKey?: number
}

let bId = 1

function nid() {
  return `b${bId++}`
}

export function cloneB(node: BTreeNode): BTreeNode {
  return {
    id: node.id,
    keys: [...node.keys],
    children: node.children.map(cloneB),
  }
}

function leaf(keys: number[], id?: string): BTreeNode {
  return { id: id ?? nid(), keys: [...keys], children: [] }
}

export function emptyBTree(): BTreeNode {
  bId = 1
  return leaf([])
}

function isLeaf(n: BTreeNode) {
  return n.children.length === 0
}

function findChildIndex(n: BTreeNode, key: number): number {
  let i = 0
  while (i < n.keys.length && key > n.keys[i]!) i += 1
  return i
}

export type Split = { median: number; left: BTreeNode; right: BTreeNode }

export function splitNode(node: BTreeNode): Split {
  const mid = Math.floor(node.keys.length / 2)
  const median = node.keys[mid]!
  const left = {
    id: nid(),
    keys: node.keys.slice(0, mid),
    children: node.children.length ? node.children.slice(0, mid + 1) : [],
  }
  const right = {
    id: nid(),
    keys: node.keys.slice(mid + 1),
    children: node.children.length ? node.children.slice(mid + 1) : [],
  }
  return { median, left, right }
}

export function bTreeInsert(root: BTreeNode, key: number, order: number): {
  root: BTreeNode
  steps: BTreeStep[]
} {
  const maxKeys = order - 1
  const steps: BTreeStep[] = []
  const snapshot = () => cloneB(working)
  let working = cloneB(root)

  steps.push({
    kind: 'start',
    message: `Insert ${key}. Walk down to a leaf, then insert in sorted order.`,
    tree: snapshot(),
    highlightKey: key,
  })

  if (working.keys.length === 0 && working.children.length === 0) {
    working.keys = [key]
    steps.push({
      kind: 'insert-leaf',
      message: `Tree was empty. ${key} becomes the first key in the root.`,
      tree: snapshot(),
      highlightId: working.id,
      highlightKey: key,
    })
    return { root: working, steps }
  }

  const trail: BTreeNode[] = []

  function descend(n: BTreeNode) {
    trail.push(n)
    steps.push({
      kind: 'descend',
      message: isLeaf(n)
        ? `Reached leaf [${n.keys.join(', ')}].`
        : `At [${n.keys.join(', ')}], choose the child that can hold ${key}.`,
      tree: snapshot(),
      highlightId: n.id,
      highlightKey: key,
    })
    if (isLeaf(n)) return n
    const i = findChildIndex(n, key)
    return descend(n.children[i]!)
  }

  const target = descend(working)
  if (target.keys.includes(key)) {
    steps.push({
      kind: 'insert-leaf',
      message: `${key} is already in the tree. B-Trees usually store unique keys, so we stop.`,
      tree: snapshot(),
      highlightId: target.id,
      highlightKey: key,
    })
    return { root: working, steps }
  }

  const idx = findChildIndex(target, key)
  target.keys.splice(idx, 0, key)
  steps.push({
    kind: 'insert-leaf',
    message: `Insert ${key} into the leaf. Keys are now [${target.keys.join(', ')}].`,
    tree: snapshot(),
    highlightId: target.id,
    highlightKey: key,
  })

  function overflow(n: BTreeNode) {
    return n.keys.length > maxKeys
  }

  while (trail.length && overflow(trail[trail.length - 1]!)) {
    const node = trail.pop()!
    const { median, left, right } = splitNode(node)
    if (trail.length === 0) {
      working = {
        id: nid(),
        keys: [median],
        children: [left, right],
      }
      steps.push({
        kind: 'new-root',
        message: `Root overflowed. Median ${median} becomes a new root. Left [${left.keys.join(', ')}], right [${right.keys.join(', ')}]. Height grows by 1.`,
        tree: snapshot(),
        highlightId: working.id,
        highlightKey: median,
      })
      break
    }
    const parent = trail[trail.length - 1]!
    const pos = findChildIndex(parent, median)
    parent.keys.splice(pos, 0, median)
    parent.children.splice(pos, 1, left, right)
    steps.push({
      kind: 'split',
      message: `Node was full. Split at median ${median} and promote it to the parent. Parent keys: [${parent.keys.join(', ')}].`,
      tree: snapshot(),
      highlightId: parent.id,
      highlightKey: median,
    })
  }

  return { root: working, steps }
}

export function bTreeFromSequence(seq: number[], order: number): {
  root: BTreeNode
  allSteps: { key: number; steps: BTreeStep[] }[]
} {
  let root = emptyBTree()
  const allSteps: { key: number; steps: BTreeStep[] }[] = []
  for (const key of seq) {
    const r = bTreeInsert(root, key, order)
    root = r.root
    allSteps.push({ key, steps: r.steps })
  }
  return { root, allSteps }
}

export type BLaidOut = {
  id: string
  keys: number[]
  x: number
  y: number
  width: number
  height: number
}

export type BEdge = { x1: number; y1: number; x2: number; y2: number }

export function layoutBTree(
  root: BTreeNode,
  opts?: { keyW?: number; nodeH?: number; vGap?: number; hGap?: number },
): { nodes: BLaidOut[]; edges: BEdge[]; width: number; height: number } {
  const keyW = opts?.keyW ?? 42
  const nodeH = opts?.nodeH ?? 40
  const vGap = opts?.vGap ?? 88
  const hGap = opts?.hGap ?? 18
  const padX = 24
  const padY = 28

  function selfWidth(n: BTreeNode) {
    return Math.max(n.keys.length, 1) * keyW + 10
  }

  function measure(n: BTreeNode): number {
    const sw = selfWidth(n)
    if (!n.children.length) return sw
    const cw =
      n.children.map(measure).reduce((a, b) => a + b, 0) + hGap * (n.children.length - 1)
    return Math.max(sw, cw)
  }

  const nodes: BLaidOut[] = []
  const edges: BEdge[] = []
  let maxY = 0

  function place(n: BTreeNode, x: number, y: number, w: number) {
    const sw = selfWidth(n)
    const nx = x + (w - sw) / 2
    nodes.push({ id: n.id, keys: n.keys, x: nx, y, width: sw, height: nodeH })
    maxY = Math.max(maxY, y + nodeH)
    if (!n.children.length) return
    const widths = n.children.map(measure)
    const total = widths.reduce((a, b) => a + b, 0) + hGap * (n.children.length - 1)
    let cx = x + (w - total) / 2
    n.children.forEach((ch, i) => {
      const cw = widths[i]!
      const childX = cx + cw / 2
      const parentX =
        n.keys.length <= 1
          ? nx + (i === 0 ? 8 : sw - 8)
          : nx + ((i + 0.5) * sw) / n.children.length
      edges.push({
        x1: parentX,
        y1: y + nodeH,
        x2: childX,
        y2: y + vGap,
      })
      place(ch, cx, y + vGap, cw)
      cx += cw + hGap
    })
  }

  const totalW = measure(root)
  place(root, padX, padY, totalW)
  return {
    nodes,
    edges,
    width: totalW + padX * 2,
    height: maxY + padY,
  }
}

export const BTREE_DEMO_KEYS = [10, 20, 5, 6, 12, 30, 7, 17]

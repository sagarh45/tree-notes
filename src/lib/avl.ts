import { findNode, heightOf, makeNode, withBalanceFactors, type BinNode } from './binaryTree'
import { bstInsert } from './bst'

export type RotKind = 'LL' | 'RR' | 'LR' | 'RL'

export function balanceFactor(node: BinNode | null): number {
  if (!node) return 0
  return heightOf(node.left) - heightOf(node.right)
}

export function rotateRight(z: BinNode): BinNode {
  const y = z.left
  if (!y) return z
  const t2 = y.right
  return { ...y, right: { ...z, left: t2 } }
}

export function rotateLeft(z: BinNode): BinNode {
  const y = z.right
  if (!y) return z
  const t2 = y.left
  return { ...y, left: { ...z, right: t2 } }
}

export function avlInsert(root: BinNode | null, value: number): BinNode {
  if (!root) return makeNode(value)
  if (typeof root.value !== 'number') return root
  if (value === root.value) return root

  let next: BinNode
  if (value < root.value) next = { ...root, left: avlInsert(root.left, value) }
  else next = { ...root, right: avlInsert(root.right, value) }

  return rebalance(next, value)
}

function rebalance(node: BinNode, inserted: number): BinNode {
  const bf = balanceFactor(node)
  const leftVal = node.left && typeof node.left.value === 'number' ? node.left.value : null
  const rightVal = node.right && typeof node.right.value === 'number' ? node.right.value : null

  if (bf > 1 && leftVal !== null && inserted < leftVal) return rotateRight(node)
  if (bf < -1 && rightVal !== null && inserted > rightVal) return rotateLeft(node)
  if (bf > 1 && leftVal !== null && inserted > leftVal) {
    return rotateRight({ ...node, left: rotateLeft(node.left!) })
  }
  if (bf < -1 && rightVal !== null && inserted < rightVal) {
    return rotateLeft({ ...node, right: rotateRight(node.right!) })
  }
  return node
}

export type AvlStep = {
  title: string
  detail: string
  tree: BinNode
  marks: Record<string, string>
  rotation?: RotKind | 'left' | 'right'
}

function annotate(n: BinNode): BinNode {
  return withBalanceFactors(n) as BinNode
}

export function unbalancedMarks(root: BinNode | null): Record<string, string> {
  if (!root) return {}
  return { ...unbalancedMarks(root.left), ...unbalancedMarks(root.right),
    ...(Math.abs(balanceFactor(root)) > 1 ? { [root.id]: 'unbalanced' } : {}) }
}

export function rotationScenario(kind: RotKind): AvlStep[] {
  if (kind === 'LL') {
    const z = makeNode(30)
    const y = makeNode(20)
    const x = makeNode(10)
    x.left = makeNode(5)
    const t3 = makeNode(35)
    const t2 = makeNode(25)
    z.left = y
    z.right = t3
    y.left = x
    y.right = t2
    const before = annotate(z)
    const after = annotate(rotateRight(z))
    return [
      {
        title: 'Unbalanced (Left-Left)',
        detail:
          'Node 30 has BF = +2. The extra height is on its left child’s left side. That is an LL case, so we do one right rotation on 30.',
        tree: before,
        marks: { [z.id]: 'unbalanced', [y.id]: 'pivot', [x.id]: 'path' },
        rotation: 'LL',
      },
      {
        title: 'Right rotation on 30',
        detail:
          '20 rises to replace 30. 30 becomes the right child of 20. The old right subtree of 20 (25) becomes the left subtree of 30.',
        tree: after,
        marks: { [y.id]: 'found', [z.id]: 'path', [x.id]: 'path' },
        rotation: 'right',
      },
    ]
  }

  if (kind === 'RR') {
    const z = makeNode(10)
    const y = makeNode(20)
    const x = makeNode(30)
    x.right = makeNode(40)
    const t1 = makeNode(5)
    const t2 = makeNode(15)
    z.right = y
    z.left = t1
    y.left = t2
    y.right = x
    const before = annotate(z)
    const after = annotate(rotateLeft(z))
    return [
      {
        title: 'Unbalanced (Right-Right)',
        detail:
          'Node 10 has BF = −2. The extra height is on its right child’s right side. That is an RR case, so we do one left rotation on 10.',
        tree: before,
        marks: { [z.id]: 'unbalanced', [y.id]: 'pivot', [x.id]: 'path' },
        rotation: 'RR',
      },
      {
        title: 'Left rotation on 10',
        detail:
          '20 rises to replace 10. 10 becomes the left child of 20. The old left subtree of 20 (15) becomes the right subtree of 10.',
        tree: after,
        marks: { [y.id]: 'found', [z.id]: 'path', [x.id]: 'path' },
        rotation: 'left',
      },
    ]
  }

  if (kind === 'LR') {
    const z = makeNode(30)
    const y = makeNode(10)
    const x = makeNode(20)
    x.left = makeNode(15)
    const t4 = makeNode(35)
    const t1 = makeNode(5)
    z.left = y
    z.right = t4
    y.left = t1
    y.right = x
    const midNode = { ...z, left: rotateLeft(y) }
    const before = annotate(z)
    const mid = annotate(midNode)
    const after = annotate(rotateRight(midNode))
    return [
      {
        title: 'Unbalanced (Left-Right)',
        detail:
          'Node 30 has BF = +2, but the extra node (20) sits on the right of the left child. A single right rotation would not fix it. We need a double rotation: left, then right.',
        tree: before,
        marks: { [z.id]: 'unbalanced', [y.id]: 'pivot', [x.id]: 'path' },
        rotation: 'LR',
      },
      {
        title: 'Step 1 — Left rotation on 10',
        detail:
          'First straighten the left side: rotate left at 10 so that 20 sits between 10 and 30. The shape is now Left-Left.',
        tree: mid,
        marks: { [x.id]: 'pivot', [z.id]: 'unbalanced', [y.id]: 'path' },
        rotation: 'left',
      },
      {
        title: 'Step 2 — Right rotation on 30',
        detail: 'Now it is an LL case. Rotate right at 30. 20 becomes the new subtree root and every BF is back in range.',
        tree: after,
        marks: { [x.id]: 'found', [y.id]: 'path', [z.id]: 'path' },
        rotation: 'right',
      },
    ]
  }

  const z = makeNode(10)
  const y = makeNode(30)
  const x = makeNode(20)
  x.right = makeNode(25)
  const t1 = makeNode(5)
  const t4 = makeNode(35)
  z.right = y
  z.left = t1
  y.left = x
  y.right = t4
  const midNode = { ...z, right: rotateRight(y) }
  const before = annotate(z)
  const mid = annotate(midNode)
  const after = annotate(rotateLeft(midNode))
  return [
    {
      title: 'Unbalanced (Right-Left)',
      detail:
        'Node 10 has BF = −2, but the extra node (20) sits on the left of the right child. Mirror of LR: rotate right, then left.',
      tree: before,
      marks: { [z.id]: 'unbalanced', [y.id]: 'pivot', [x.id]: 'path' },
      rotation: 'RL',
    },
    {
      title: 'Step 1 — Right rotation on 30',
      detail: 'Straighten the right side first. After rotating right at 30, the shape becomes Right-Right.',
      tree: mid,
      marks: { [x.id]: 'pivot', [z.id]: 'unbalanced', [y.id]: 'path' },
      rotation: 'right',
    },
    {
      title: 'Step 2 — Left rotation on 10',
      detail: 'Now it is an RR case. Rotate left at 10. 20 rises to the middle and the tree is balanced.',
      tree: after,
      marks: { [x.id]: 'found', [y.id]: 'path', [z.id]: 'path' },
      rotation: 'left',
    },
  ]
}

export type LiveAvlStep = {
  kind: 'insert' | 'unbalanced' | 'rotated'
  value: number
  tree: BinNode
  marks: Record<string, string>
  note: string
  rot?: RotKind
}

export function replaceSubtree(root: BinNode, id: string, subtree: BinNode): BinNode {
  if (root.id === id) return subtree
  return { ...root, left: root.left ? replaceSubtree(root.left, id, subtree) : null,
    right: root.right ? replaceSubtree(root.right, id, subtree) : null }
}

/** Each elementary rotation is a full-tree snapshot, including unchanged ancestors. */
export function rotationStages(root: BinNode, pivotId: string) {
  const pivot = findNode(root, pivotId)!
  const bf = balanceFactor(pivot)
  const kind: RotKind = bf > 1
    ? balanceFactor(pivot.left) >= 0 ? 'LL' : 'LR'
    : balanceFactor(pivot.right) <= 0 ? 'RR' : 'RL'
  const stages: { tree: BinNode; note: string; kind: RotKind; pivot: string }[] = []
  let tree = root
  const apply = (at: BinNode, direction: 'left' | 'right') => {
    const child = (direction === 'left' ? at.right : at.left)!
    const middle = direction === 'left' ? child.left : child.right
    const rotated = direction === 'left' ? rotateLeft(at) : rotateRight(at)
    tree = replaceSubtree(tree, at.id, rotated)
    stages.push({ tree: annotate(tree), kind, pivot: rotated.id,
      note: `${direction === 'left' ? 'Left' : 'Right'} rotate ${at.value}: ${child.value} becomes this subtree's root. ${at.value} moves ${direction === 'left' ? 'left' : 'right'}. ${middle ? `Middle subtree ${middle.value} moves to ${at.value}.` : 'Middle subtree is NULL.'}` })
  }
  if (kind === 'LR') apply(pivot.left!, 'left')
  if (kind === 'RL') apply(pivot.right!, 'right')
  apply(findNode(tree, pivotId)!, bf > 1 ? 'right' : 'left')
  return stages
}

export function avlInsertObserved(root: BinNode | null, value: number): {
  root: BinNode
  steps: LiveAvlStep[]
} {
  const inserted = bstInsert(root, value)
  if (inserted.duplicate) return { root: inserted.root, steps: [] }
  let tree = inserted.root
  const steps: LiveAvlStep[] = [{ kind: 'insert', value, tree: annotate(tree),
    marks: { [inserted.createdId]: 'new' }, note: `Place ${value} as a BST leaf. Check ancestors from bottom to top.` }]
  for (const id of inserted.path.slice(0, -1).reverse()) {
    const node = findNode(tree, id)!
    const bf = balanceFactor(node)
    if (Math.abs(bf) <= 1) continue
    const stages = rotationStages(tree, id)
    steps.push({ kind: 'unbalanced', value, tree: annotate(tree), marks: { [id]: 'unbalanced' },
      note: `First unbalanced ancestor ${node.value}: BF = ${bf}. Case ${stages[0].kind}.`, rot: stages[0].kind })
    for (const stage of stages) steps.push({ kind: 'rotated', value, tree: stage.tree,
      marks: { [stage.pivot]: 'found', ...unbalancedMarks(stage.tree) }, note: stage.note, rot: stage.kind })
    tree = stages[stages.length - 1].tree
    break
  }
  return { root: annotate(tree), steps }
}

export function avlFromSequence(seq: number[]): BinNode | null {
  let root: BinNode | null = null
  for (const v of seq) root = avlInsert(root, v)
  return withBalanceFactors(root)
}

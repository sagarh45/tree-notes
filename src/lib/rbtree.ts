import { type BinNode } from './binaryTree'

export type Color = 'R' | 'B'

type RB = {
  id: string
  key: number
  color: Color
  left: RB | null
  right: RB | null
  parent: RB | null
}

export type RbEvent = {
  kind: 'insert' | 'recolor' | 'rotate-left' | 'rotate-right' | 'root-black' | 'done'
  note: string
  tree: BinNode | null
  marks: Record<string, string>
  current?: string
}

let rbSeq = 1

function nid() {
  return `rb${rbSeq++}`
}

function toBin(n: RB | null): BinNode | null {
  if (!n) return null
  return {
    id: n.id,
    value: n.key,
    color: n.color,
    left: toBin(n.left),
    right: toBin(n.right),
  }
}

function uncle(n: RB): RB | null {
  const g = n.parent?.parent
  if (!g || !n.parent) return null
  return n.parent === g.left ? g.right : g.left
}

function rotateLeft(rootRef: { root: RB | null }, x: RB) {
  const y = x.right
  if (!y) return
  x.right = y.left
  if (y.left) y.left.parent = x
  y.parent = x.parent
  if (!x.parent) rootRef.root = y
  else if (x === x.parent.left) x.parent.left = y
  else x.parent.right = y
  y.left = x
  x.parent = y
}

function rotateRight(rootRef: { root: RB | null }, x: RB) {
  const y = x.left
  if (!y) return
  x.left = y.right
  if (y.right) y.right.parent = x
  y.parent = x.parent
  if (!x.parent) rootRef.root = y
  else if (x === x.parent.left) x.parent.left = y
  else x.parent.right = y
  y.right = x
  x.parent = y
}

function marksOf(_n: RB | null, extra: Record<string, string> = {}): Record<string, string> {
  return { ...extra }
}

function snap(root: RB | null, extra: Record<string, string> = {}): { tree: BinNode | null; marks: Record<string, string> } {
  return { tree: toBin(root), marks: marksOf(root, extra) }
}

/** Classic red-black insert (CLRS) with a snapshot after every fix. */
export function rbInsertSteps(prevKeys: number[], key: number): { events: RbEvent[]; keys: number[] } {
  const keys = [...prevKeys]
  if (keys.includes(key)) {
    const built = rbFromSequence(keys)
    return {
      keys,
      events: [
        {
          kind: 'done',
          note: `${key} already in the tree (unique keys).`,
          tree: built,
          marks: {},
        },
      ],
    }
  }

  rbSeq = 1
  const ref: { root: RB | null } = { root: null }
  const events: RbEvent[] = []

  function bstPlace(k: number): RB {
    const node: RB = { id: nid(), key: k, color: 'R', left: null, right: null, parent: null }
    if (!ref.root) {
      ref.root = node
      return node
    }
    let cur = ref.root
    for (;;) {
      if (k < cur.key) {
        if (!cur.left) {
          cur.left = node
          node.parent = cur
          return node
        }
        cur = cur.left
      } else {
        if (!cur.right) {
          cur.right = node
          node.parent = cur
          return node
        }
        cur = cur.right
      }
    }
  }

  for (const k of keys) {
    const n = bstPlace(k)
    fixInsert(ref, n, [])
    if (ref.root) ref.root.color = 'B'
  }

  keys.push(key)
  const z = bstPlace(key)
  const placed = snap(ref.root, { [z.id]: 'new' })
  events.push({
    kind: 'insert',
    note: `Hang ${key} as a RED leaf (like BST insert). Red keeps black-height unchanged.`,
    tree: placed.tree,
    marks: { ...placed.marks, [z.id]: 'new' },
    current: z.id,
  })

  fixInsert(ref, z, events)
  if (ref.root) {
    ref.root.color = 'B'
    const s = snap(ref.root, { [ref.root.id]: 'found' })
    events.push({
      kind: 'root-black',
      note: 'Property: the root is always BLACK.',
      tree: s.tree,
      marks: s.marks,
      current: ref.root.id,
    })
  }

  events.push({
    kind: 'done',
    note: `Insert of ${key} finished. No two reds in a row. All root-to-leaf black counts match.`,
    ...snap(ref.root),
  })

  return { events, keys }
}

function fixInsert(ref: { root: RB | null }, z: RB, events: RbEvent[]) {
  while (z.parent && z.parent.color === 'R') {
    const p = z.parent
    const g = p.parent
    if (!g) break
    const u = uncle(z)
    if (u && u.color === 'R') {
      p.color = 'B'
      u.color = 'B'
      g.color = 'R'
      const s = snap(ref.root, { [p.id]: 'current', [u.id]: 'current', [g.id]: 'unbalanced' })
      events.push({
        kind: 'recolor',
        note: `Uncle of ${z.key} is RED → recolor: parent & uncle BLACK, grandparent ${g.key} RED. Climb to grandparent.`,
        tree: s.tree,
        marks: s.marks,
        current: g.id,
      })
      z = g
      continue
    }

    const pLeft = p === g.left
    const zLeft = z === p.left
    if (pLeft && !zLeft) {
      events.push({
        kind: 'rotate-left',
        note: `Triangle (LR): ${z.key} is right of left-child ${p.key}. Left-rotate at parent, then it becomes a line.`,
        ...snap(ref.root, { [z.id]: 'new', [p.id]: 'current' }),
        current: p.id,
      })
      rotateLeft(ref, p)
      z = p
      const s = snap(ref.root, { [z.id]: 'current' })
      events.push({ kind: 'rotate-left', note: `After left rotate at old parent.`, tree: s.tree, marks: s.marks, current: z.id })
      continue
    }
    if (!pLeft && zLeft) {
      events.push({
        kind: 'rotate-right',
        note: `Triangle (RL): ${z.key} is left of right-child ${p.key}. Right-rotate at parent first.`,
        ...snap(ref.root, { [z.id]: 'new', [p.id]: 'current' }),
        current: p.id,
      })
      rotateRight(ref, p)
      z = p
      const s = snap(ref.root, { [z.id]: 'current' })
      events.push({ kind: 'rotate-right', note: `After right rotate at old parent.`, tree: s.tree, marks: s.marks, current: z.id })
      continue
    }

    if (pLeft && zLeft) {
      p.color = 'B'
      g.color = 'R'
      rotateRight(ref, g)
      const s = snap(ref.root, { [p.id]: 'found' })
      events.push({
        kind: 'rotate-right',
        note: `Line (LL): right-rotate at grandparent ${g.key}. Parent becomes local root, painted BLACK; grandparent RED.`,
        tree: s.tree,
        marks: s.marks,
        current: p.id,
      })
    } else {
      p.color = 'B'
      g.color = 'R'
      rotateLeft(ref, g)
      const s = snap(ref.root, { [p.id]: 'found' })
      events.push({
        kind: 'rotate-left',
        note: `Line (RR): left-rotate at grandparent ${g.key}. Parent becomes local root, painted BLACK; grandparent RED.`,
        tree: s.tree,
        marks: s.marks,
        current: p.id,
      })
    }
  }
}

export function rbFromSequence(seq: number[]): BinNode | null {
  if (!seq.length) return null
  rbSeq = 1
  const ref: { root: RB | null } = { root: null }
  for (const k of seq) {
    const node: RB = { id: nid(), key: k, color: 'R', left: null, right: null, parent: null }
    if (!ref.root) {
      ref.root = node
    } else {
      let cur = ref.root
      for (;;) {
        if (k === cur.key) break
        if (k < cur.key) {
          if (!cur.left) {
            cur.left = node
            node.parent = cur
            break
          }
          cur = cur.left
        } else {
          if (!cur.right) {
            cur.right = node
            node.parent = cur
            break
          }
          cur = cur.right
        }
      }
    }
    fixInsert(ref, node, [])
    if (ref.root) ref.root.color = 'B'
  }
  return toBin(ref.root)
}

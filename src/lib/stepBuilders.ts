/**
 * Small, self-contained step generators used ONLY by the syllabus theory
 * diagrams. They accept letters as well as numbers so the class-notes
 * examples (H, I, J, B, A, E, …) can be drawn exactly as written.
 */
import { heightOf, makeNode, resetIds, withBalanceFactors, type BinNode, type NodeValue } from './binaryTree'
import type { BTreeNode } from './btree'
import { rotationStages } from './avl'

/* ------------------------------------------------------------------ */
/*  Ordering helper — numbers by value, strings alphabetically          */
/* ------------------------------------------------------------------ */
function less(a: NodeValue, b: NodeValue): boolean {
  if (typeof a === 'number' && typeof b === 'number') return a < b
  return String(a) < String(b)
}

/* ------------------------------------------------------------------ */
/*  Plain BST build (any value type) — one snapshot per key             */
/* ------------------------------------------------------------------ */
export type BuildFrame = {
  key: NodeValue
  root: BinNode
  /** ids of the nodes compared on the way down */
  path: string[]
  /** id of the node that was created */
  newId: string
  note: string
}

function insertPlain(root: BinNode | null, key: NodeValue, path: string[]): { root: BinNode; newId: string } {
  if (!root) {
    const n = makeNode(key)
    return { root: n, newId: n.id }
  }
  path.push(root.id)
  if (key === root.value) return { root, newId: root.id }
  if (less(key, root.value)) {
    const r = insertPlain(root.left, key, path)
    return { root: { ...root, left: r.root }, newId: r.newId }
  }
  const r = insertPlain(root.right, key, path)
  return { root: { ...root, right: r.root }, newId: r.newId }
}

export function bstBuildFrames(seq: NodeValue[]): BuildFrame[] {
  resetIds(1)
  const out: BuildFrame[] = []
  let root: BinNode | null = null
  for (const key of seq) {
    const path: string[] = []
    const r = insertPlain(root, key, path)
    root = r.root
    const words: string[] = []
    let cur: BinNode | null = root
    for (let i = 0; i < path.length; i += 1) {
      const node = cur!
      const goLeft = less(key, node.value)
      words.push(`${key} ${goLeft ? '<' : '>'} ${node.value} → ${goLeft ? 'left' : 'right'}`)
      cur = goLeft ? node.left : node.right
    }
    out.push({
      key,
      root,
      path,
      newId: r.newId,
      note: words.length ? words.join(', ') : `${key} is the first key, so it becomes the root.`,
    })
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  AVL build (any value type) — snapshot per key + rotation report     */
/* ------------------------------------------------------------------ */
export type Rotation = 'LL' | 'RR' | 'LR' | 'RL'

export type AvlFrame = {
  key: NodeValue
  /** tree right after the plain BST insert, BEFORE any rotation (with BF) */
  before: BinNode
  /** tree after rebalancing (with BF) */
  after: BinNode
  middle?: BinNode
  rotation?: Rotation
  /** value of the first unbalanced node found from the inserted node upward */
  pivot?: NodeValue
  note: string
}

function bf(n: BinNode | null) {
  return heightOf(n?.left ?? null) - heightOf(n?.right ?? null)
}

function rotR(z: BinNode): BinNode {
  const y = z.left!
  return { ...y, right: { ...z, left: y.right } }
}
function rotL(z: BinNode): BinNode {
  const y = z.right!
  return { ...y, left: { ...z, right: y.left } }
}

type Report = { rotation?: Rotation; pivot?: NodeValue }

function avlIns(root: BinNode | null, key: NodeValue, rep: Report): BinNode {
  if (!root) return makeNode(key)
  if (key === root.value) return root
  let node: BinNode
  if (less(key, root.value)) node = { ...root, left: avlIns(root.left, key, rep) }
  else node = { ...root, right: avlIns(root.right, key, rep) }

  const b = bf(node)
  if (b > 1 && node.left && less(key, node.left.value)) {
    if (!rep.rotation) Object.assign(rep, { rotation: 'LL', pivot: node.value })
    return rotR(node)
  }
  if (b < -1 && node.right && !less(key, node.right.value)) {
    if (!rep.rotation) Object.assign(rep, { rotation: 'RR', pivot: node.value })
    return rotL(node)
  }
  if (b > 1 && node.left && !less(key, node.left.value)) {
    if (!rep.rotation) Object.assign(rep, { rotation: 'LR', pivot: node.value })
    return rotR({ ...node, left: rotL(node.left) })
  }
  if (b < -1 && node.right && less(key, node.right.value)) {
    if (!rep.rotation) Object.assign(rep, { rotation: 'RL', pivot: node.value })
    return rotL({ ...node, right: rotR(node.right) })
  }
  return node
}

export function avlBuildFrames(seq: NodeValue[]): AvlFrame[] {
  resetIds(1)
  const out: AvlFrame[] = []
  let root: BinNode | null = null
  for (const key of seq) {
    const rep: Report = {}
    const before = insertPlain(root, key, []).root
    const after = avlIns(root, key, rep)
    root = after
    const beforeBf = withBalanceFactors(before)!
    const afterBf = withBalanceFactors(after)!
    let note: string
    if (rep.rotation) {
      const why: Record<Rotation, string> = {
        LL: 'new key went to the LEFT of the LEFT child → one right (clockwise) rotation',
        RR: 'new key went to the RIGHT of the RIGHT child → one left (anti-clockwise) rotation',
        LR: 'new key went to the RIGHT of the LEFT child → first left-rotate the child, then right-rotate the pivot',
        RL: 'new key went to the LEFT of the RIGHT child → first right-rotate the child, then left-rotate the pivot',
      }
      note = `Insert ${key}. Node ${rep.pivot} gets BF = ${bfOfValue(beforeBf, rep.pivot!)} (unbalanced). ${rep.rotation} rotation at ${rep.pivot}: ${why[rep.rotation]}.`
    } else {
      note = `Insert ${key} like a normal BST. Every BF is still −1, 0 or +1, so no rotation.`
    }
    const pivotId = rep.pivot === undefined ? undefined : idOfValue(beforeBf, rep.pivot)
    const stages = pivotId ? rotationStages(beforeBf, pivotId) : []
    const middle = stages.length === 2 ? stages[0].tree : undefined
    out.push({ key, before: beforeBf, after: afterBf, middle, rotation: rep.rotation, pivot: rep.pivot, note })
  }
  return out
}

function bfOfValue(root: BinNode | null, v: NodeValue): string {
  if (!root) return '?'
  if (root.value === v) return root.bf! > 0 ? `+${root.bf}` : String(root.bf)
  return less(v, root.value) ? bfOfValue(root.left, v) : bfOfValue(root.right, v)
}

/** Final AVL tree for a sequence (with balance factors filled in). */
export function avlFinal(seq: NodeValue[]): BinNode | null {
  const frames = avlBuildFrames(seq)
  return frames.length ? frames[frames.length - 1]!.after : null
}

/** Plain BST (no balancing) for any value type. */
export function bstFinal(seq: NodeValue[]): BinNode | null {
  const frames = bstBuildFrames(seq)
  return frames.length ? frames[frames.length - 1]!.root : null
}

/* ------------------------------------------------------------------ */
/*  B-Tree, "split a full node on the way down" (CLRS / class notes)   */
/*  order m  →  max m−1 keys per node                                   */
/* ------------------------------------------------------------------ */
let bid = 1
function bnode(keys: number[], children: BTreeNode[] = []): BTreeNode {
  return { id: `p${bid++}`, keys, children }
}
function cloneB(n: BTreeNode): BTreeNode {
  return { id: n.id, keys: [...n.keys], children: n.children.map(cloneB) }
}

export type BTreeFrame = {
  key: number
  tree: BTreeNode
  split: boolean
  note: string
}

function splitChild(parent: BTreeNode, i: number, notes: string[]) {
  const full = parent.children[i]!
  const mid = Math.floor((full.keys.length - 1) / 2) // lower median for even counts (order 4 → index 1)
  const median = full.keys[mid]!
  const left = bnode(full.keys.slice(0, mid), full.children.slice(0, mid + 1))
  const right = bnode(full.keys.slice(mid + 1), full.children.slice(mid + 1))
  parent.keys.splice(i, 0, median)
  parent.children.splice(i, 1, left, right)
  notes.push(`[${full.keys.join(', ')}] is full → split, median ${median} moves up`)
}

function insertNonFull(n: BTreeNode, key: number, maxKeys: number, notes: string[]) {
  let i = n.keys.length - 1
  if (n.children.length === 0) {
    n.keys.push(key)
    n.keys.sort((a, b) => a - b)
    notes.push(`${key} goes into leaf → [${n.keys.join(', ')}]`)
    return
  }
  while (i >= 0 && key < n.keys[i]!) i -= 1
  i += 1
  if (n.children[i]!.keys.length === maxKeys) {
    splitChild(n, i, notes)
    if (key > n.keys[i]!) i += 1
  }
  insertNonFull(n.children[i]!, key, maxKeys, notes)
}

export function bTreeProactiveFrames(seq: number[], order: number): BTreeFrame[] {
  bid = 1
  const maxKeys = order - 1
  let root = bnode([])
  const out: BTreeFrame[] = []
  for (const key of seq) {
    const notes: string[] = []
    if (root.keys.length === maxKeys) {
      const old = root
      root = bnode([], [old])
      splitChild(root, 0, notes)
      notes[notes.length - 1] = `root [${old.keys.join(', ')}] is full → split it first, median ${root.keys[0]} becomes the NEW root (height +1)`
    }
    insertNonFull(root, key, maxKeys, notes)
    out.push({
      key,
      tree: cloneB(root),
      split: notes.some((s) => s.includes('split')),
      note: `Insert ${key}: ${notes.join('; ')}.`,
    })
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  B-Tree, "insert then split on overflow" (Thareja / exam standard)   */
/* ------------------------------------------------------------------ */
function splitOverflow(n: BTreeNode): { median: number; left: BTreeNode; right: BTreeNode } {
  const mid = Math.floor(n.keys.length / 2)
  return {
    median: n.keys[mid]!,
    left: bnode(n.keys.slice(0, mid), n.children.slice(0, mid + 1)),
    right: bnode(n.keys.slice(mid + 1), n.children.slice(mid + 1)),
  }
}

function insertReactive(n: BTreeNode, key: number, maxKeys: number, notes: string[]): { median: number; left: BTreeNode; right: BTreeNode } | null {
  if (n.children.length === 0) {
    n.keys.push(key)
    n.keys.sort((a, b) => a - b)
    notes.push(`${key} goes into leaf → [${n.keys.join(', ')}]`)
  } else {
    let i = 0
    while (i < n.keys.length && key > n.keys[i]!) i += 1
    const up = insertReactive(n.children[i]!, key, maxKeys, notes)
    if (up) {
      n.keys.splice(i, 0, up.median)
      n.children.splice(i, 1, up.left, up.right)
      notes.push(`${up.median} is pushed up into [${n.keys.join(', ')}]`)
    }
  }
  if (n.keys.length > maxKeys) {
    const s = splitOverflow(n)
    notes.push(`[${n.keys.join(', ')}] has ${n.keys.length} keys (max ${maxKeys}) → split at median ${s.median}`)
    return s
  }
  return null
}

export function bTreeReactiveFrames(seq: number[], order: number): BTreeFrame[] {
  bid = 1
  const maxKeys = order - 1
  let root = bnode([])
  const out: BTreeFrame[] = []
  for (const key of seq) {
    const notes: string[] = []
    const up = insertReactive(root, key, maxKeys, notes)
    if (up) {
      root = bnode([up.median], [up.left, up.right])
      notes.push(`${up.median} becomes the NEW root (height +1)`)
    }
    out.push({
      key,
      tree: cloneB(root),
      split: notes.some((s) => s.includes('split')),
      note: `Insert ${key}: ${notes.join('; ')}.`,
    })
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Hand-built trees used by several diagrams                          */
/* ------------------------------------------------------------------ */
export function treeFromSpec(spec: string): BinNode | null {
  /* Tiny parser: "A(B(D,E),C(,F))" — empty side written as nothing. */
  resetIds(1)
  let i = 0
  function parse(): BinNode | null {
    let label = ''
    while (i < spec.length && !'(),'.includes(spec[i]!)) label += spec[i++]
    label = label.trim()
    if (!label) return null
    const asNum = Number(label)
    const node = makeNode(Number.isFinite(asNum) && label !== '' ? asNum : label)
    if (spec[i] === '(') {
      i += 1
      node.left = parse()
      if (spec[i] === ',') i += 1
      node.right = parse()
      if (spec[i] === ')') i += 1
    }
    return node
  }
  return parse()
}

/** Map "value → mark" onto node ids (first match wins). */
export function marksByValue(root: BinNode | null, wanted: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  const walk = (n: BinNode | null) => {
    if (!n) return
    const m = wanted[String(n.value)]
    if (m !== undefined) out[n.id] = m
    walk(n.left)
    walk(n.right)
  }
  walk(root)
  return out
}

export function idOfValue(root: BinNode | null, v: NodeValue): string | undefined {
  if (!root) return undefined
  if (root.value === v) return root.id
  return idOfValue(root.left, v) ?? idOfValue(root.right, v)
}

/** Array (sequential) representation, 1-based like the class notes. */
export function arrayRepresentation(root: BinNode | null, size?: number): (NodeValue | null)[] {
  const h = heightOf(root)
  const n = size ?? Math.pow(2, h + 1) - 1
  const arr = Array.from<NodeValue | null>({ length: n }).fill(null)
  const walk = (node: BinNode | null, i: number) => {
    if (!node || i > n) return
    arr[i - 1] = node.value
    walk(node.left, 2 * i)
    walk(node.right, 2 * i + 1)
  }
  walk(root, 1)
  return arr
}

import { cloneTree, makeNode, type BinNode } from './binaryTree'

export const BUILD_SEQUENCE = [45, 15, 79, 90, 10, 55, 12, 20, 50]

export type SearchResult = {
  path: string[]
  found: boolean
  comparisons: number
}

export function bstSearch(root: BinNode | null, value: number): SearchResult {
  const path: string[] = []
  let cur = root
  let comparisons = 0
  while (cur) {
    path.push(cur.id)
    comparisons += 1
    if (cur.value === value) return { path, found: true, comparisons }
    if (typeof cur.value !== 'number') break
    cur = value < cur.value ? cur.left : cur.right
  }
  return { path, found: false, comparisons }
}

export type InsertResult = {
  root: BinNode
  path: string[]
  createdId: string
  duplicate: boolean
}

export function bstInsert(root: BinNode | null, value: number): InsertResult {
  const created = makeNode(value)
  const path: string[] = []
  let duplicate = false

  function ins(n: BinNode | null): BinNode {
    if (!n) return created
    path.push(n.id)
    if (n.value === value) {
      duplicate = true
      return n
    }
    if (typeof n.value !== 'number') return n
    if (value < n.value) return { ...n, left: ins(n.left) }
    return { ...n, right: ins(n.right) }
  }

  const next = ins(root)
  if (!duplicate) path.push(created.id)
  return { root: next, path, createdId: created.id, duplicate }
}

export type DeleteCase = 'missing' | 'leaf' | 'one-child' | 'two-children'

export type DeleteResult = {
  root: BinNode | null
  case: DeleteCase
  path: string[]
  successorValue?: number
}

function minNode(n: BinNode): BinNode {
  let cur = n
  while (cur.left) cur = cur.left
  return cur
}

function removeMin(n: BinNode): BinNode | null {
  if (!n.left) return n.right
  return { ...n, left: removeMin(n.left) }
}

export function bstDelete(root: BinNode | null, value: number): DeleteResult {
  const path: string[] = []
  let delCase: DeleteCase = 'missing'
  let successorValue: number | undefined

  function del(n: BinNode | null): BinNode | null {
    if (!n) return null
    path.push(n.id)
    if (typeof n.value !== 'number') return n
    if (value < n.value) return { ...n, left: del(n.left) }
    if (value > n.value) return { ...n, right: del(n.right) }

    if (!n.left && !n.right) {
      delCase = 'leaf'
      return null
    }
    if (!n.left || !n.right) {
      delCase = 'one-child'
      return n.left ?? n.right
    }
    delCase = 'two-children'
    const succ = minNode(n.right)
    successorValue = typeof succ.value === 'number' ? succ.value : undefined
    return { ...n, value: succ.value, right: removeMin(n.right) }
  }

  return { root: del(root), case: delCase, path, successorValue }
}

export function bstFromSequence(seq: number[]): BinNode | null {
  let root: BinNode | null = null
  for (const v of seq) {
    root = bstInsert(root, v).root
  }
  return root
}

export function bstInsertSteps(seq: number[]): { value: number; root: BinNode; path: string[] }[] {
  const steps: { value: number; root: BinNode; path: string[] }[] = []
  let root: BinNode | null = null
  for (const v of seq) {
    const r = bstInsert(root, v)
    root = r.root
    steps.push({ value: v, root: cloneTree(root)!, path: r.path })
  }
  return steps
}

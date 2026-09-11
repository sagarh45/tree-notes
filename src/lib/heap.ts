import { makeNode, resetIds, type BinNode } from './binaryTree'

/** 0-based complete binary heap. Parent ⌊(i−1)/2⌋, left 2i+1, right 2i+2. */
export function parentIndex(i: number) {
  return i <= 0 ? -1 : Math.floor((i - 1) / 2)
}

export function heapToTree(arr: number[]): BinNode | null {
  if (!arr.length) return null
  resetIds(1)
  const nodes = arr.map((v, i) => {
    const n = makeNode(v, `h${i}`)
    n.heapIndex = i
    return n
  })
  for (let i = 0; i < arr.length; i++) {
    const L = 2 * i + 1
    const R = 2 * i + 2
    if (L < arr.length) nodes[i].left = nodes[L]
    if (R < arr.length) nodes[i].right = nodes[R]
  }
  return nodes[0]
}

export function heapFromSequence(seq: number[], max = true): number[] {
  const a: number[] = []
  for (const x of seq) {
    a.push(x)
    swim(a, a.length - 1, max)
  }
  return a
}

function better(a: number[], i: number, j: number, max: boolean) {
  return max ? a[i] > a[j] : a[i] < a[j]
}

export function swim(a: number[], i: number, max = true): number[] {
  while (i > 0) {
    const p = parentIndex(i)
    if (!better(a, i, p, max)) break
    ;[a[i], a[p]] = [a[p], a[i]]
    i = p
  }
  return a
}

export function sink(a: number[], i: number, max = true, n = a.length): number[] {
  while (true) {
    const L = 2 * i + 1
    const R = 2 * i + 2
    let pick = i
    if (L < n && better(a, L, pick, max)) pick = L
    if (R < n && better(a, R, pick, max)) pick = R
    if (pick === i) break
    ;[a[i], a[pick]] = [a[pick], a[i]]
    i = pick
  }
  return a
}

export type HeapSwap = { from: number; to: number; arr: number[] }

export function swimSteps(start: number[], i: number, max = true): HeapSwap[] {
  const a = start.slice()
  const steps: HeapSwap[] = []
  while (i > 0) {
    const p = parentIndex(i)
    if (!better(a, i, p, max)) break
    ;[a[i], a[p]] = [a[p], a[i]]
    steps.push({ from: i, to: p, arr: a.slice() })
    i = p
  }
  return steps
}

export function sinkSteps(start: number[], i: number, max = true): HeapSwap[] {
  const a = start.slice()
  const n = a.length
  const steps: HeapSwap[] = []
  while (true) {
    const L = 2 * i + 1
    const R = 2 * i + 2
    let pick = i
    if (L < n && better(a, L, pick, max)) pick = L
    if (R < n && better(a, R, pick, max)) pick = R
    if (pick === i) break
    ;[a[i], a[pick]] = [a[pick], a[i]]
    steps.push({ from: i, to: pick, arr: a.slice() })
    i = pick
  }
  return steps
}

import { makeNode, resetIds, type BinNode } from './binaryTree'

export type HuffItem = { ch: string; freq: number }

export type HuffSnap = {
  forest: BinNode[]
  note: string
  marks: Record<string, string>
  codes: { ch: string; freq: number; code: string }[]
}

function toBin(n: HNode): BinNode {
  const b = makeNode(n.ch ?? n.freq, n.id)
  b.freq = n.freq
  b.code = n.code
  b.left = n.left ? toBin(n.left) : null
  b.right = n.right ? toBin(n.right) : null
  return b
}

type HNode = {
  id: string
  ch?: string
  freq: number
  left: HNode | null
  right: HNode | null
  code?: string
}

function assignCodes(n: HNode | null, prefix: string) {
  if (!n) return
  n.code = prefix
  if (!n.left && !n.right) return
  assignCodes(n.left, prefix + '0')
  assignCodes(n.right, prefix + '1')
}

function leafCodes(n: HNode | null, out: { ch: string; freq: number; code: string }[]) {
  if (!n) return
  if (!n.left && !n.right && n.ch) out.push({ ch: n.ch, freq: n.freq, code: n.code ?? '' })
  leafCodes(n.left, out)
  leafCodes(n.right, out)
}

export function parseFreqs(text: string): HuffItem[] {
  const items: HuffItem[] = []
  const parts = text.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
  for (const p of parts) {
    const m = p.match(/^(.+?)\s*[:=]\s*(\d+)$/)
    if (m) items.push({ ch: m[1].trim(), freq: Number(m[2]) })
  }
  return items
}

export function huffmanBuild(items: HuffItem[]): { snaps: HuffSnap[]; root: BinNode | null; codes: HuffSnap['codes'] } {
  resetIds(1)
  if (!items.length) return { snaps: [], root: null, codes: [] }

  let hid = 1
  let forest: HNode[] = items.map((it) => ({
    id: `hf${hid++}`,
    ch: it.ch,
    freq: it.freq,
    left: null,
    right: null,
  }))

  const snaps: HuffSnap[] = [
    {
      forest: forest.map(toBin),
      note: 'Start: every letter is its own tree. Smallest frequencies will merge first.',
      marks: {},
      codes: items.map((it) => ({ ...it, code: '' })),
    },
  ]

  while (forest.length > 1) {
    forest = [...forest].sort((a, b) => a.freq - b.freq || (a.ch ?? '').localeCompare(b.ch ?? ''))
    const a = forest.shift()!
    const b = forest.shift()!
    const parent: HNode = {
      id: `hf${hid++}`,
      freq: a.freq + b.freq,
      left: a,
      right: b,
    }
    forest.push(parent)
    assignCodes(parent, '')
    const codes: HuffSnap['codes'] = []
    for (const t of forest) leafCodes(t, codes)
    snaps.push({
      forest: forest.map(toBin),
      note: `Merge ${a.ch ?? a.freq} (${a.freq}) with ${b.ch ?? b.freq} (${b.freq}) → new root ${parent.freq}. Left edge = 0, right edge = 1.`,
      marks: { [a.id]: 'found', [b.id]: 'found', [parent.id]: 'new' },
      codes: codes.sort((x, y) => x.ch.localeCompare(y.ch)),
    })
  }

  const rootH = forest[0]
  assignCodes(rootH, '')
  const codes: HuffSnap['codes'] = []
  leafCodes(rootH, codes)
  snaps.push({
    forest: [toBin(rootH)],
    note: 'One tree left. Walk root→leaf: left = 0, right = 1. Frequent letters sit high → short codes.',
    marks: {},
    codes: codes.sort((x, y) => x.ch.localeCompare(y.ch)),
  })

  return { snaps, root: toBin(rootH), codes: codes.sort((x, y) => x.ch.localeCompare(y.ch)) }
}

export const HUFF_CLASSIC: HuffItem[] = [
  { ch: 'A', freq: 5 },
  { ch: 'B', freq: 9 },
  { ch: 'C', freq: 12 },
  { ch: 'D', freq: 13 },
  { ch: 'E', freq: 16 },
  { ch: 'F', freq: 45 },
]

export const HUFF_TINY: HuffItem[] = [
  { ch: 'A', freq: 4 },
  { ch: 'B', freq: 2 },
  { ch: 'C', freq: 1 },
  { ch: 'D', freq: 1 },
]

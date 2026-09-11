export type TrieNode = {
  id: string
  ch: string
  end: boolean
  children: TrieNode[]
}

let trieSeq = 1

function tid() {
  return `tr${trieSeq++}`
}

export function emptyTrie(): TrieNode {
  trieSeq = 1
  return { id: tid(), ch: '∅', end: false, children: [] }
}

export function cloneTrie(n: TrieNode): TrieNode {
  return { id: n.id, ch: n.ch, end: n.end, children: n.children.map(cloneTrie) }
}

export type TrieStep = {
  root: TrieNode
  note: string
  highlight: string[]
  word: string
  matched: string
}

export function trieInsertSteps(root: TrieNode, word: string): TrieStep[] {
  const w = word.trim().toLowerCase().replace(/[^a-z]/g, '')
  if (!w) {
    return [{ root: cloneTrie(root), note: 'Type letters a–z.', highlight: [root.id], word: '', matched: '' }]
  }
  const steps: TrieStep[] = []
  const tree = cloneTrie(root)
  steps.push({
    root: cloneTrie(tree),
    note: `Insert "${w}". Start at the dummy root. Each letter is an EDGE, not a node value.`,
    highlight: [tree.id],
    word: w,
    matched: '',
  })

  let cur = tree
  let matched = ''
  const path = [cur.id]
  for (const ch of w) {
    let next = cur.children.find((c) => c.ch === ch)
    if (!next) {
      next = { id: tid(), ch, end: false, children: [] }
      cur.children.push(next)
      cur.children.sort((a, b) => a.ch.localeCompare(b.ch))
      path.push(next.id)
      matched += ch
      steps.push({
        root: cloneTrie(tree),
        note: `No child '${ch}' yet → create it. Shared prefixes are reused (that is the whole point of a trie).`,
        highlight: [...path],
        word: w,
        matched,
      })
    } else {
      path.push(next.id)
      matched += ch
      steps.push({
        root: cloneTrie(tree),
        note: `Reuse existing edge '${ch}'. "${matched}" is already a prefix in the trie.`,
        highlight: [...path],
        word: w,
        matched,
      })
    }
    cur = next
  }
  cur.end = true
  steps.push({
    root: cloneTrie(tree),
    note: `Mark '${w}' as an end-of-word. A node can be both a word AND a prefix of a longer word (car / cart).`,
    highlight: path,
    word: w,
    matched,
  })
  return steps
}

export function trieFromWords(words: string[]): TrieNode {
  let t = emptyTrie()
  for (const w of words) {
    const steps = trieInsertSteps(t, w)
    t = steps[steps.length - 1]?.root ?? t
  }
  return t
}

export type LaidTrie = {
  nodes: { node: TrieNode; x: number; y: number }[]
  edges: { from: { x: number; y: number }; to: { x: number; y: number }; ch: string; fromId: string; toId: string }[]
  width: number
  height: number
}

export function layoutTrie(root: TrieNode, compact = false): LaidTrie {
  const hGap = compact ? 42 : 56
  const vGap = compact ? 62 : 78
  const padX = compact ? 24 : 40
  const padY = compact ? 28 : 40
  const nodes: LaidTrie['nodes'] = []
  let i = 0
  let maxD = 0

  function walk(n: TrieNode, depth: number) {
    if (!n.children.length) {
      nodes.push({ node: n, x: padX + i * hGap, y: padY + depth * vGap })
      i += 1
      maxD = Math.max(maxD, depth)
      return
    }
    for (const c of n.children) walk(c, depth + 1)
    const kids = n.children.map((c) => nodes.find((x) => x.node.id === c.id)!).filter(Boolean)
    const x = kids.length ? (kids[0].x + kids[kids.length - 1].x) / 2 : padX + i * hGap
    nodes.push({ node: n, x, y: padY + depth * vGap })
    maxD = Math.max(maxD, depth)
  }

  walk(root, 0)
  const pos = new Map(nodes.map((n) => [n.node.id, n]))
  const edges: LaidTrie['edges'] = []
  for (const n of nodes) {
    for (const c of n.node.children) {
      const t = pos.get(c.id)
      if (t) {
        edges.push({
          from: { x: n.x, y: n.y },
          to: { x: t.x, y: t.y },
          ch: c.ch,
          fromId: n.node.id,
          toId: c.id,
        })
      }
    }
  }
  return {
    nodes,
    edges,
    width: Math.max(i * hGap + padX * 2, 280),
    height: padY * 2 + maxD * vGap + 28,
  }
}

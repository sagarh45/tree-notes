import { huffmanBuild, parseFreqs, type HuffItem } from '../lib/huffman'
import type { TreeStep } from '../types/lab'

export function idleHuffman(items: HuffItem[]): TreeStep {
  const built = items.length ? huffmanBuild(items) : { snaps: [], root: null, codes: [] }
  const last = built.snaps[built.snaps.length - 1]
  return {
    id: 'idle-huff',
    label: 'Ready',
    tree: built.root,
    marks: {},
    forest: last?.forest ?? [],
    codes: built.codes,
    edgeLabels: true,
    codeLine: null,
    codeSnippetId: 'huffman',
    variables: { letters: items.length, trees: last?.forest.length ?? 0 },
    explanation: {
      happening: 'Huffman: greedy merge of the two lightest trees. Left edge = 0, right = 1.',
      why: 'Frequent letters stay near the root → short codes. No code is a prefix of another (prefix-free).',
      changed: 'Load a frequency pack, or type a:5,b:2,c:1 and press Build.',
    },
    message: 'The forest shrinks until one tree remains. That tree IS the code.',
    messageTone: 'info',
  }
}

export function buildHuffman(textOrItems: string | HuffItem[]): TreeStep[] {
  const items = typeof textOrItems === 'string' ? parseFreqs(textOrItems) : textOrItems
  if (!items.length) {
    return [
      {
        id: 'huff-bad',
        label: 'Need frequencies',
        tree: null,
        marks: {},
        forest: [],
        codeLine: 1,
        codeSnippetId: 'huffman',
        variables: {},
        explanation: {
          happening: 'Could not parse letters. Type like a:5,b:9,c:12',
          why: 'Each letter needs a positive frequency.',
          changed: 'Nothing built.',
        },
        message: 'Format: a:5,b:2,c:1',
        messageTone: 'warn',
      },
    ]
  }
  const { snaps, root } = huffmanBuild(items)
  return snaps.map((s, i) => ({
    id: `huff-${i}`,
    label: i === 0 ? 'Forest of letters' : i === snaps.length - 1 ? 'Final code tree' : `Merge #${i}`,
    tree: s.forest.length === 1 ? s.forest[0] : root,
    marks: s.marks,
    forest: s.forest,
    codes: s.codes,
    edgeLabels: s.forest.length === 1,
    codeLine: i === 0 ? 2 : i === snaps.length - 1 ? 16 : 8,
    codeSnippetId: 'huffman',
    variables: {
      remaining_trees: s.forest.length,
      letters: items.length,
      step: i,
    },
    explanation: {
      happening: s.note,
      why: 'Always merge the two smallest frequencies (greedy). Optimal prefix code for these frequencies.',
      changed: s.codes.length
        ? s.codes.map((c) => `${c.ch}=${c.code || '?'}`).join('  ')
        : 'Codes appear after a letter has a unique path to the root.',
    },
    message: s.note,
    messageTone: i === snaps.length - 1 ? 'success' : 'info',
  }))
}

import { emptyTrie, trieInsertSteps, type TrieNode } from '../lib/trie'
import type { TreeStep } from '../types/lab'

export function idleTrie(root: TrieNode): TreeStep {
  return {
    id: 'idle-trie',
    label: 'Ready',
    tree: null,
    marks: {},
    trieRoot: root,
    trieHi: [root.id],
    codeLine: null,
    codeSnippetId: 'trie',
    variables: { words: countEnds(root), nodes: countNodes(root) },
    explanation: {
      happening: 'A trie stores strings by sharing prefixes. The letter lives on the EDGE. The dummy root holds nothing.',
      why: 'Search “cat” walks c → a → t. Time = length of the word, not the number of words stored.',
      changed: 'Type a word (cat, car, cart, dog) and Insert. Watch existing prefixes get reused.',
    },
    message: 'END under a node means a complete word ends there (car and cart can both exist).',
    messageTone: 'info',
  }
}

export function buildTrieInsert(root: TrieNode, word: string): { steps: TreeStep[]; root: TrieNode } {
  const raw = trieInsertSteps(root, word)
  const steps: TreeStep[] = raw.map((s, i) => ({
    id: `tr-${i}`,
    label: s.matched ? `…${s.matched}` : 'start',
    tree: null,
    marks: {},
    trieRoot: s.root,
    trieHi: s.highlight,
    codeLine: i === 0 ? 2 : i === raw.length - 1 ? 12 : 6,
    codeSnippetId: 'trie',
    variables: {
      word: s.word,
      matched: s.matched || '(root)',
      nodes: countNodes(s.root),
    },
    explanation: {
      happening: s.note,
      why: 'Children of one node are different next letters. No two siblings share the same letter.',
      changed: s.matched ? `Walked prefix "${s.matched}".` : 'At dummy root.',
    },
    message: s.note,
    messageTone: i === raw.length - 1 ? 'success' : 'info',
  }))
  return { steps, root: raw[raw.length - 1]?.root ?? root }
}

function countEnds(n: TrieNode): number {
  return (n.end ? 1 : 0) + n.children.reduce((a, c) => a + countEnds(c), 0)
}
function countNodes(n: TrieNode): number {
  return 1 + n.children.reduce((a, c) => a + countNodes(c), 0)
}

export { emptyTrie }

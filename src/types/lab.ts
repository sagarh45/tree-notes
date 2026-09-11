import type { BinNode, ThreadEdge } from '../lib/binaryTree'
import type { BTreeNode } from '../lib/btree'
import type { TrieNode } from '../lib/trie'

export type TreeKind = 'traversal' | 'bst' | 'avl' | 'btree' | 'heap' | 'rbtree' | 'huffman' | 'trie'

export type Explanation = {
  happening: string
  why: string
  changed: string
}

export type TreeStep = {
  id: string
  label: string
  tree: BinNode | null
  btree?: BTreeNode
  marks: Record<string, string>
  visitOrder?: Record<string, number>
  highlightBId?: string
  highlightKey?: number
  showBf?: boolean
  showColor?: boolean
  showIndex?: boolean
  showNulls?: boolean
  edgeLabels?: boolean
  threads?: ThreadEdge[]
  codeLine: number | null
  codeSnippetId: string
  variables: Record<string, string | number | boolean>
  explanation: Explanation
  message?: string
  messageTone?: 'info' | 'success' | 'warn' | 'error'
  visitList?: Array<string | number>
  callStack?: string[]
  queue?: string[]
  heap?: number[]
  heapFocus?: number[]
  forest?: BinNode[]
  codes?: { ch: string; freq: number; code: string }[]
  trieRoot?: TrieNode
  trieHi?: string[]
}

export type HistoryEntry = {
  id: string
  text: string
  at: number
}

export type ComplexityRow = {
  op: string
  time: string
  space: string
  note?: string
}

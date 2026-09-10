import type { BinNode } from '../lib/binaryTree'
import type { BTreeNode } from '../lib/btree'

export type TreeKind = 'traversal' | 'bst' | 'avl' | 'btree'

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
  codeLine: number | null
  codeSnippetId: string
  variables: Record<string, string | number | boolean>
  explanation: Explanation
  message?: string
  messageTone?: 'info' | 'success' | 'warn' | 'error'
  visitList?: Array<string | number>
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

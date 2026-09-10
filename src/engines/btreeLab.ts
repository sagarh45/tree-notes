import { bTreeInsert, type BTreeNode } from '../lib/btree'
import type { TreeStep } from '../types/lab'

export function idleBTree(root: BTreeNode, order: number): TreeStep {
  return {
    id: 'idle-bt',
    label: 'Ready',
    tree: null,
    btree: root,
    marks: {},
    codeLine: null,
    codeSnippetId: 'btree',
    variables: {
      order,
      maxKeys: order - 1,
      maxChildren: order,
      rootKeys: root.keys.join(', ') || '(empty)',
    },
    explanation: {
      happening: `Order-${order} B-Tree is ready.`,
      why: 'A node may hold up to m−1 keys and m children. Leaves stay at one level.',
      changed: 'Insert keys. A full node splits at the median and promotes that key.',
    },
    message: `Order m = ${order}: at most ${order} children and ${order - 1} keys. Demo: 10, 20, 5, 6, 12, 30, 7, 17.`,
    messageTone: 'info',
  }
}

export function buildBTreeInsert(root: BTreeNode, key: number, order: number): { steps: TreeStep[]; root: BTreeNode } {
  const r = bTreeInsert(root, key, order)
  const steps: TreeStep[] = r.steps.map((s, i) => ({
    id: `bt-${i}`,
    label: s.kind,
    tree: null,
    btree: s.tree,
    marks: {},
    highlightBId: s.highlightId,
    highlightKey: s.highlightKey,
    codeLine: s.kind === 'descend' ? 2 : s.kind === 'insert-leaf' ? 4 : s.kind === 'split' ? 6 : s.kind === 'new-root' ? 8 : 1,
    codeSnippetId: 'btree',
    variables: {
      key,
      phase: s.kind,
      order,
      rootKeys: s.tree.keys.join(', ') || '(empty)',
    },
    explanation: {
      happening: s.message,
      why:
        s.kind === 'split' || s.kind === 'new-root'
          ? 'Overflow: more than m−1 keys. Median goes up, left/right stay as siblings. Height grows only when the root splits.'
          : 'Search still goes down one path, like a BST, but each node holds several keys.',
      changed: s.message,
    },
    message: s.message,
    messageTone: s.kind === 'new-root' ? 'warn' : 'info',
  }))
  return { steps, root: r.root }
}

import { rbFromSequence, rbInsertSteps } from '../lib/rbtree'
import { heightOf, sizeOf } from '../lib/binaryTree'
import type { TreeStep } from '../types/lab'

export function idleRb(keys: number[]): TreeStep {
  const tree = rbFromSequence(keys)
  return {
    id: 'idle-rb',
    label: 'Ready',
    tree,
    marks: {},
    showColor: true,
    codeLine: null,
    codeSnippetId: 'rbtree',
    variables: {
      n: sizeOf(tree),
      height: heightOf(tree),
      root: tree ? String(tree.value) : 'NULL',
    },
    explanation: {
      happening: 'Red-Black tree = BST + 5 colour laws. New keys start RED.',
      why: 'RED insert does not change black-height. Fix only if two reds sit in a row (parent is red).',
      changed: 'Watch recolor (cheap) vs rotate (same pictures as AVL).',
    },
    message: 'Black nodes = 2-nodes of a 2-3-4 tree. Red nodes = extra keys glued onto a black parent.',
    messageTone: 'info',
  }
}

export function buildRbInsert(keys: number[], key: number): { steps: TreeStep[]; keys: number[] } {
  const { events, keys: next } = rbInsertSteps(keys, key)
  const steps: TreeStep[] = events.map((e, i) => {
    const tree = e.tree
    return {
      id: `rb-${i}`,
      label: e.kind,
      tree,
      marks: e.marks,
      showColor: true,
      codeLine: e.kind === 'insert' ? 2 : e.kind === 'recolor' ? 8 : e.kind.startsWith('rotate') ? 14 : 20,
      codeSnippetId: 'rbtree',
      variables: {
        n: sizeOf(tree),
        height: heightOf(tree),
        key,
        event: e.kind,
        current: e.current ?? '—',
      },
      explanation: {
        happening: e.note,
        why: 'Laws: root black · no red-red · every path has the same number of black nodes · NIL leaves are black.',
        changed: e.kind === 'recolor' ? 'Colours flipped — structure (in-order) unchanged.' : e.kind.startsWith('rotate') ? 'Local rotation. In-order stays sorted.' : 'Inserted as a red leaf, then fix-up walked toward the root.',
      },
      message: e.note,
      messageTone: e.kind === 'done' ? 'success' : 'info',
    }
  })
  return { steps, keys: next }
}

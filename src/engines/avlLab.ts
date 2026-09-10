import { withBalanceFactors, type BinNode } from '../lib/binaryTree'
import { avlInsertObserved, rotationScenario, type RotKind } from '../lib/avl'
import type { TreeStep } from '../types/lab'

export function idleAvl(root: BinNode | null): TreeStep {
  const tree = withBalanceFactors(root)
  return {
    id: 'idle-avl',
    label: 'Ready',
    tree,
    marks: {},
    showBf: true,
    codeLine: null,
    codeSnippetId: 'avl',
    variables: {
      n: tree ? 'see tree' : 0,
      BF: 'height(L) − height(R)',
      legal: '{−1, 0, +1}',
    },
    explanation: {
      happening: 'AVL tree is a BST with |BF| ≤ 1 at every node.',
      why: 'That keeps height O(log n), so search/insert/delete stay O(log n) even in the worst case.',
      changed: 'Insert 10, 20, 30 to force an RR rotation. Or play an LL / LR / RL demo.',
    },
    message: 'Balance factor is printed above each node. Out of range → rotate.',
    messageTone: 'info',
  }
}

export function buildAvlInsert(root: BinNode | null, key: number): { steps: TreeStep[]; root: BinNode } {
  const r = avlInsertObserved(root, key)
  const rotated = r.steps.some((s) => s.kind === 'unbalanced')
  if (r.steps[0]?.kind === 'insert' && !rotated) {
    r.steps[0] = { ...r.steps[0], tree: withBalanceFactors(r.root) as BinNode }
  }
  const steps: TreeStep[] = r.steps.map((s, i) => ({
    id: `avl-${i}`,
    label: s.kind === 'insert' ? `Place ${key}` : s.kind === 'unbalanced' ? `BF out of range (${s.rot})` : `Rotate ${s.rot}`,
    tree: s.tree,
    marks: s.marks,
    showBf: true,
    codeLine: s.kind === 'insert' ? 1 : s.rot === 'LL' ? 6 : s.rot === 'RR' ? 7 : s.rot === 'LR' ? 8 : 11,
    codeSnippetId: 'avl',
    variables: {
      key,
      phase: s.kind,
      rotation: s.rot ?? 'none',
      localRoot: String(s.tree.value),
    },
    explanation: {
      happening: s.note,
      why:
        s.kind === 'insert'
          ? 'AVL insert starts as a normal BST insert — new key is a leaf.'
          : s.kind === 'unbalanced'
            ? 'Walking back up, a node has |BF| = 2. The two-letter case is the path from that node toward the new key.'
            : 'A rotation (or double rotation) restores BF and keeps in-order (still a BST).',
      changed: s.kind === 'rotated' ? `Local root is now ${s.tree.value}.` : s.note,
    },
    message: s.note,
    messageTone: s.kind === 'unbalanced' ? 'warn' : 'success',
  }))
  if (!steps.length) {
    steps.push({
      id: 'avl-dup',
      label: 'Duplicate',
      tree: withBalanceFactors(root),
      marks: {},
      showBf: true,
      codeLine: 4,
      codeSnippetId: 'avl',
      variables: { key, result: 'ignored' },
      explanation: {
        happening: `${key} is already present.`,
        why: 'Lecture AVL trees ignore equal keys.',
        changed: 'Tree unchanged.',
      },
      message: `${key} already exists.`,
      messageTone: 'warn',
    })
  }
  return { steps, root: r.root }
}

export function buildRotationDemo(kind: RotKind): TreeStep[] {
  return rotationScenario(kind).map((s, i) => ({
    id: `rot-${kind}-${i}`,
    label: s.title,
    tree: s.tree,
    marks: s.marks,
    showBf: true,
    codeLine: kind === 'LL' ? 6 : kind === 'RR' ? 7 : kind === 'LR' ? 8 : 11,
    codeSnippetId: 'avl',
    variables: { case: kind, step: i + 1, rotation: s.rotation ?? kind },
    explanation: {
      happening: s.title,
      why: s.detail,
      changed: i === 0 ? 'Unbalanced shape.' : 'After rotation, BF is legal again.',
    },
    message: s.detail,
    messageTone: i === 0 ? 'warn' : 'success',
  }))
}

import { heightOf, sizeOf, traversalSteps, type BinNode, type VisitKind } from '../lib/binaryTree'
import type { TreeStep } from '../types/lab'

function vars(root: BinNode | null, extra: Record<string, string | number | boolean> = {}) {
  return {
    n: sizeOf(root),
    height: heightOf(root),
    root: root ? String(root.value) : 'NULL',
    ...extra,
  }
}

export function idleTraversal(root: BinNode | null): TreeStep {
  return {
    id: 'idle-t',
    label: 'Ready',
    tree: root,
    marks: {},
    codeLine: null,
    codeSnippetId: 'pre',
    variables: vars(root, { visit: '(none)' }),
    explanation: {
      happening: root ? 'Binary tree is ready for a traversal.' : 'Tree is empty. Type a key and press Insert (same as BST insert).',
      why: 'Visit order is the only difference: when you print the node vs its children.',
      changed: root ? 'Pick Pre / In / Post / Level, then Play. Or load an example pack.' : 'Insert keys yourself, or tap an Ex button.',
    },
    message: root
      ? 'Pre = NLR, In = LNR, Post = LRN, Level = BFS. Tree was built from keys you typed (or an example sequence).'
      : 'Empty tree. Insert keys from the box — no node is created by hand in code.',
    messageTone: 'info',
  }
}

export function buildTraversalSteps(root: BinNode | null, kind: VisitKind): TreeStep[] {
  if (!root) {
    return [
      {
        id: 't-empty',
        label: 'Empty',
        tree: null,
        marks: {},
        codeLine: 1,
        codeSnippetId: kind === 'inorder' ? 'in' : kind === 'postorder' ? 'post' : kind === 'levelorder' ? 'level' : 'pre',
        variables: vars(null),
        explanation: {
          happening: 'Root is NULL, so the traversal returns immediately.',
          why: 'Every recursive walk starts with if (root == NULL) return;',
          changed: 'Output is empty.',
        },
        message: 'Empty tree — insert keys first.',
        messageTone: 'warn',
      },
    ]
  }
  const visits = traversalSteps(root, kind)
  const list: Array<string | number> = []
  const order: Record<string, number> = {}
  const why: Record<VisitKind, string> = {
    preorder: 'Node first, then left, then right (NLR). Copies a tree easily.',
    inorder: 'Left, node, right (LNR). On a BST this prints sorted keys.',
    postorder: 'Left, right, node (LRN). Safe to delete children before parent.',
    levelorder: 'Floor by floor using a queue (BFS).',
  }
  const codeLine: Record<VisitKind, number> = {
    preorder: 2,
    inorder: 3,
    postorder: 4,
    levelorder: 7,
  }
  const snippet: Record<VisitKind, string> = {
    preorder: 'pre',
    inorder: 'in',
    postorder: 'post',
    levelorder: 'level',
  }

  return visits.map((v, i) => {
    list.push(v.value)
    order[v.id] = i + 1
    const marks: Record<string, string> = {}
    for (const id of Object.keys(order)) marks[id] = 'path'
    marks[v.id] = 'current'
    return {
      id: `t-${kind}-${i}`,
      label: `Visit ${v.value}`,
      tree: root,
      marks,
      visitOrder: { ...order },
      visitList: [...list],
      codeLine: codeLine[kind],
      codeSnippetId: snippet[kind],
      variables: vars(root, {
        visit: String(v.value),
        index: i + 1,
        output: list.join(' '),
      }),
      explanation: {
        happening: `Visit node ${v.value}. ${v.note}`,
        why: why[kind],
        changed: `Output so far: ${list.join(' ')}`,
      },
      message: `${kind}: ${list.join(' ')}`,
      messageTone: 'success',
    }
  })
}


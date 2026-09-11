import { heightOf, sizeOf, traversalTrace, type BinNode, type VisitKind } from '../lib/binaryTree'
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
    edgeLabels: true,
    codeLine: null,
    codeSnippetId: 'pre',
    variables: vars(root, { visit: '(none)', stack: '[]' }),
    callStack: [],
    explanation: {
      happening: root
        ? 'Binary tree is ready. Play a traversal to see the REAL call stack, not only the print order.'
        : 'Tree is empty. Type a key and press Insert (same as BST insert).',
      why: 'Each recursive call is a frame. Enter = push, return = pop. Visit is when we print.',
      changed: root
        ? 'Pick Pre / In / Post / Level. Watch the stack (or queue) change on every step.'
        : 'Insert keys yourself, or tap an Ex button.',
    },
    message: root
      ? 'Pre = NLR, In = LNR, Post = LRN, Level = BFS + queue. Threads button draws inorder threads on NULL pointers.'
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
          changed: 'Output is empty. Stack never grows.',
        },
        message: 'Empty tree — insert keys first.',
        messageTone: 'warn',
      },
    ]
  }

  const trace = traversalTrace(root, kind)
  const list: Array<string | number> = []
  const order: Record<string, number> = {}
  const why: Record<VisitKind, string> = {
    preorder: 'Print on ENTER (NLR). The stack holds ancestors that still have a right subtree to do.',
    inorder: 'Print AFTER left returns (LNR). On a BST this is sorted order.',
    postorder: 'Print on LEAVE (LRN). Children are finished — safe to free this node.',
    levelorder: 'No recursion. A queue holds the next floor. Front is visited, children join the rear.',
  }
  const snippet: Record<VisitKind, string> = {
    preorder: 'pre',
    inorder: 'in',
    postorder: 'post',
    levelorder: 'level',
  }
  const codeLine: Record<string, number> = {
    enter: 1,
    visit: kind === 'preorder' ? 2 : kind === 'inorder' ? 3 : kind === 'postorder' ? 4 : 7,
    'go-left': 3,
    'go-right': 4,
    leave: 5,
    enqueue: 5,
    dequeue: 7,
  }

  return trace.map((v, i) => {
    if (v.action === 'visit') {
      list.push(v.value)
      order[v.id] = list.length
    }
    const marks: Record<string, string> = {}
    for (const id of Object.keys(order)) marks[id] = 'path'
    marks[v.id] = v.action === 'visit' ? 'current' : v.action === 'leave' ? 'found' : 'path'
    const isLevel = kind === 'levelorder'
    return {
      id: `t-${kind}-${i}`,
      label:
        v.action === 'visit'
          ? `Visit ${v.value}`
          : v.action === 'enter'
            ? `Call(${v.value})`
            : v.action === 'leave'
              ? `Return ${v.value}`
              : v.action === 'enqueue'
                ? `Enqueue ${v.value}`
                : v.action === 'dequeue'
                  ? `Dequeue ${v.value}`
                  : v.note,
      tree: root,
      marks,
      visitOrder: { ...order },
      visitList: [...list],
      callStack: isLevel ? undefined : v.stack,
      queue: isLevel ? v.queue : undefined,
      edgeLabels: true,
      codeLine: codeLine[v.action] ?? 2,
      codeSnippetId: snippet[kind],
      variables: vars(root, {
        action: v.action,
        node: String(v.value),
        output: list.join(' ') || '(none)',
        stack: isLevel ? (v.queue ?? []).join(',') : v.stack.join(','),
      }),
      explanation: {
        happening: v.note,
        why: why[kind],
        changed:
          v.action === 'visit'
            ? `Printed so far: ${list.join(' ')}`
            : v.action === 'enter'
              ? `Pushed ${v.value}. Depth = ${v.stack.length}.`
              : v.action === 'leave'
                ? `Popped ${v.value}.`
                : isLevel
                  ? `Queue: [${(v.queue ?? []).join(', ')}]`
                  : 'Walking.',
      },
      message: `${kind}: ${list.join(' ') || '(nothing printed yet)'}`,
      messageTone: v.action === 'visit' ? 'success' : 'info',
    }
  })
}

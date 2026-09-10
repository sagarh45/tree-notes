import { findNode, heightOf, sizeOf, type BinNode } from '../lib/binaryTree'
import { bstDelete, bstInsert, bstSearch } from '../lib/bst'
import type { TreeStep } from '../types/lab'

function vars(root: BinNode | null, extra: Record<string, string | number | boolean> = {}) {
  return {
    n: sizeOf(root),
    height: heightOf(root),
    root: root ? String(root.value) : 'NULL',
    ...extra,
  }
}

export function idleBst(root: BinNode | null): TreeStep {
  return {
    id: 'idle-bst',
    label: 'Ready',
    tree: root,
    marks: {},
    codeLine: null,
    codeSnippetId: 'insert',
    variables: vars(root, { key: '—' }),
    explanation: {
      happening: 'BST is ready. Left subtree < node < right subtree.',
      why: 'Search, insert, and delete all walk one path from the root.',
      changed: 'Try the lecture sequence 45, 15, 79, 90, 10, 55, 12, 20, 50.',
    },
    message: 'Insert hangs a new leaf. Delete has three cases: leaf, one child, two children.',
    messageTone: 'info',
  }
}

function pathMarks(path: string[], current?: string, extra?: Record<string, string>) {
  const marks: Record<string, string> = { ...(extra ?? {}) }
  for (const id of path) marks[id] = 'path'
  if (current) marks[current] = 'current'
  return marks
}

export function buildBstSearch(root: BinNode | null, key: number): TreeStep[] {
  const r = bstSearch(root, key)
  if (!r.path.length) {
    return [
      {
        id: 's-empty',
        label: 'Empty',
        tree: root,
        marks: {},
        codeLine: 6,
        codeSnippetId: 'search',
        variables: vars(root, { key, found: false }),
        explanation: {
          happening: 'Root is NULL, so the key cannot be here.',
          why: 'An empty tree has no nodes to compare.',
          changed: 'Return NULL (not found).',
        },
        message: `${key} not found — tree is empty.`,
        messageTone: 'warn',
      },
    ]
  }
  return r.path.map((id, i) => {
    const last = i === r.path.length - 1
    const node = findNode(root, id)
    const val = node?.value
    const going = last ? (r.found ? 'match' : 'stop') : typeof val === 'number' && key < val ? 'left' : 'right'
    const line = last && r.found ? 2 : last && !r.found ? 6 : going === 'left' ? 3 : 4
    return {
      id: `s-${i}`,
      label: last ? (r.found ? `Found ${key}` : `${key} missing`) : `Compare ${val}`,
      tree: root,
      marks: pathMarks(r.path.slice(0, i + 1), id, last && r.found ? { [id]: 'found' } : undefined),
      codeLine: line,
      codeSnippetId: 'search',
      variables: vars(root, { key, current: String(val), comparisons: i + 1, found: last ? r.found : '…' }),
      explanation: {
        happening: last
          ? r.found
            ? `${key} equals node ${val}. Search succeeds.`
            : `Walked off the tree after ${val}. ${key} is not present.`
          : `Compare ${key} with ${val} → go ${going}.`,
        why: 'BST rule: smaller keys left, larger keys right.',
        changed: last ? (r.found ? `Found after ${r.comparisons} comparison(s).` : 'Return NULL.') : `Move to the ${going} child.`,
      },
      message: last ? (r.found ? `Found ${key}` : `${key} not found`) : `At ${val}`,
      messageTone: last ? (r.found ? 'success' : 'warn') : 'info',
    }
  })
}

export function buildBstInsert(root: BinNode | null, key: number): { steps: TreeStep[]; root: BinNode } {
  const r = bstInsert(root, key)
  const before = root
  const steps: TreeStep[] = []
  const walk = r.duplicate ? r.path : r.path.slice(0, -1)

  if (!before) {
    steps.push({
      id: 'i-empty',
      label: `Insert ${key} as root`,
      tree: r.root,
      marks: { [r.createdId]: 'new' },
      codeLine: 1,
      codeSnippetId: 'insert',
      variables: vars(r.root, { key }),
      explanation: {
        happening: `Tree was empty. ${key} becomes the root.`,
        why: 'A null root means create a new node and return it.',
        changed: `${key} is the only node.`,
      },
      message: `Inserted ${key} as root.`,
      messageTone: 'success',
    })
    return { steps, root: r.root }
  }

  walk.forEach((id, i) => {
    const node = findNode(before, id)
    const val = node?.value
    const going = typeof val === 'number' && key < val ? 'left' : 'right'
    steps.push({
      id: `i-w-${i}`,
      label: `Compare ${val}`,
      tree: before,
      marks: pathMarks(walk.slice(0, i + 1), id),
      codeLine: going === 'left' ? 2 : 4,
      codeSnippetId: 'insert',
      variables: vars(before, { key, current: String(val) }),
      explanation: {
        happening: r.duplicate && i === walk.length - 1 && val === key
          ? `${key} already exists. Duplicate keys are ignored.`
          : `Compare ${key} with ${val} → go ${going}.`,
        why: 'Insert is a search that hangs a leaf in the first empty slot.',
        changed: r.duplicate && val === key ? 'Tree unchanged.' : `Follow ${going} pointer.`,
      },
      messageTone: r.duplicate && val === key ? 'warn' : 'info',
    })
  })

  if (!r.duplicate) {
    steps.push({
      id: 'i-new',
      label: `Hang ${key}`,
      tree: r.root,
      marks: { [r.createdId]: 'new', ...pathMarks(walk) },
      codeLine: 1,
      codeSnippetId: 'insert',
      variables: vars(r.root, { key, created: key }),
      explanation: {
        happening: `Create a new leaf ${key} and link it.`,
        why: 'New BST keys are always born as leaves. Existing nodes do not move.',
        changed: `${key} is now in the tree. Height may grow by 1.`,
      },
      message: `Inserted ${key}.`,
      messageTone: 'success',
    })
  }

  return { steps, root: r.root }
}

export function buildBstDelete(root: BinNode | null, key: number): { steps: TreeStep[]; root: BinNode | null } {
  const r = bstDelete(root, key)
  const steps: TreeStep[] = []
  const walk = r.path

  if (!walk.length) {
    steps.push({
      id: 'd-empty',
      label: 'Empty',
      tree: root,
      marks: {},
      codeLine: 1,
      codeSnippetId: 'delete',
      variables: vars(root, { key }),
      explanation: {
        happening: 'Nothing to delete.',
        why: 'Empty tree.',
        changed: 'Return NULL.',
      },
      message: 'Tree is empty.',
      messageTone: 'warn',
    })
    return { steps, root }
  }

  walk.forEach((id, i) => {
    const last = i === walk.length - 1
    const node = findNode(root, id)
    const val = node?.value
    steps.push({
      id: `d-w-${i}`,
      label: last ? `Delete ${key}` : `Compare ${val}`,
      tree: last && r.case !== 'missing' ? r.root : root,
      marks: pathMarks(walk.slice(0, i + 1), id, last && r.case !== 'missing' ? { [id]: 'found' } : undefined),
      codeLine: last
        ? r.case === 'leaf'
          ? 7
          : r.case === 'one-child'
            ? 8
            : r.case === 'two-children'
              ? 10
              : 1
        : typeof val === 'number' && key < val
          ? 2
          : 4,
      codeSnippetId: 'delete',
      variables: vars(last && r.case !== 'missing' ? r.root : root, {
        key,
        current: String(val),
        case: last ? r.case : '…',
        successor: r.successorValue ?? '—',
      }),
      explanation: {
        happening: last
          ? r.case === 'missing'
            ? `${key} is not in the tree.`
            : r.case === 'leaf'
              ? `${key} is a leaf — unlink it.`
              : r.case === 'one-child'
                ? `${key} has one child — replace the node by that child.`
                : `${key} has two children — copy inorder successor ${r.successorValue}, then delete that successor.`
          : `Compare ${key} with ${val}.`,
        why: 'Three exam cases: leaf / one child / two children (successor).',
        changed: last
          ? r.case === 'missing'
            ? 'Tree unchanged.'
            : `Deleted ${key}.`
          : 'Keep walking.',
      },
      message: last ? (r.case === 'missing' ? `${key} not found` : `Deleted ${key} (${r.case})`) : `At ${val}`,
      messageTone: last ? (r.case === 'missing' ? 'warn' : 'success') : 'info',
    })
  })

  return { steps, root: r.root }
}

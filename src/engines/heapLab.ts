import { heapFromSequence, heapToTree, sinkSteps, swimSteps } from '../lib/heap'
import type { TreeStep } from '../types/lab'

function vars(arr: number[], extra: Record<string, string | number | boolean> = {}) {
  return {
    n: arr.length,
    root: arr.length ? arr[0] : '∅',
    height: arr.length ? Math.floor(Math.log2(arr.length)) : -1,
    ...extra,
  }
}

export function idleHeap(arr: number[]): TreeStep {
  return {
    id: 'idle-heap',
    label: 'Ready',
    tree: heapToTree(arr),
    marks: {},
    showIndex: true,
    heap: arr,
    heapFocus: [],
    codeLine: null,
    codeSnippetId: 'heap',
    variables: vars(arr),
    explanation: {
      happening: 'A max-heap is a COMPLETE binary tree stored as an ARRAY. Parent ≥ both children.',
      why: 'Index formulas: parent ⌊(i−1)/2⌋, left 2i+1, right 2i+2. No pointers needed.',
      changed: 'Insert appends then SWIMS. Extract-max swaps root with last, pops, then SINKS.',
    },
    message: 'The picture and the array are the same heap. Watch a key swim toward the root.',
    messageTone: 'info',
  }
}

export function buildHeapInsert(arr: number[], key: number): { steps: TreeStep[]; arr: number[] } {
  const appended = [...arr, key]
  const i0 = appended.length - 1
  const swim = swimSteps(appended, i0, true)
  const steps: TreeStep[] = [
    {
      id: 'h-app',
      label: `Append ${key}`,
      tree: heapToTree(appended),
      marks: { [`h${i0}`]: 'new' },
      showIndex: true,
      heap: appended,
      heapFocus: [i0],
      codeLine: 2,
      codeSnippetId: 'heap',
      variables: vars(appended, { key, i: i0, parent: i0 ? Math.floor((i0 - 1) / 2) : '—' }),
      explanation: {
        happening: `${key} is placed at the NEXT empty index [${i0}] (end of the array). The tree stays complete.`,
        why: 'Heaps fill left-to-right. Completeness is free if you only append.',
        changed: `Array is now [${appended.join(', ')}]. It may violate parent ≥ child — swim next.`,
      },
      message: `Appended ${key} at index ${i0}.`,
      messageTone: 'info',
    },
  ]
  let cur = appended
  if (!swim.length) {
    steps.push({
      id: 'h-ok',
      label: 'Already heap',
      tree: heapToTree(cur),
      marks: { [`h${i0}`]: 'found' },
      showIndex: true,
      heap: cur,
      heapFocus: [i0],
      codeLine: 6,
      codeSnippetId: 'heap',
      variables: vars(cur, { key, swaps: 0 }),
      explanation: {
        happening: `${key} is already ≤ its parent (or it is the root). Heap property holds.`,
        why: 'Swim stops when parent ≥ child.',
        changed: 'No swap.',
      },
      message: `${key} did not need to swim.`,
      messageTone: 'success',
    })
  }
  swim.forEach((s, k) => {
    cur = s.arr
    steps.push({
      id: `h-sw-${k}`,
      label: `Swim ${cur[s.to]} ↔ ${cur[s.from]}`,
      tree: heapToTree(cur),
      marks: { [`h${s.to}`]: 'current', [`h${s.from}`]: 'path' },
      showIndex: true,
      heap: cur,
      heapFocus: [s.from, s.to],
      codeLine: 8,
      codeSnippetId: 'heap',
      variables: vars(cur, { key, from: s.from, to: s.to, swaps: k + 1 }),
      explanation: {
        happening: `Child at [${s.from}] was larger than parent at [${s.to}] — SWAP. This is swim / sift-up.`,
        why: 'Max-heap law: every parent ≥ children. One swap may not be enough, so we keep climbing.',
        changed: `Array: [${cur.join(', ')}]`,
      },
      message: `Swap indexes ${s.from} and ${s.to}.`,
      messageTone: 'success',
    })
  })
  return { steps, arr: cur }
}

export function buildHeapExtract(arr: number[]): { steps: TreeStep[]; arr: number[] } {
  if (!arr.length) {
    return {
      arr,
      steps: [
        {
          id: 'h-empty',
          label: 'Empty',
          tree: null,
          marks: {},
          showIndex: true,
          heap: [],
          codeLine: 1,
          codeSnippetId: 'heap',
          variables: vars([]),
          explanation: {
            happening: 'Cannot extract — heap is empty.',
            why: 'Root lives at index 0.',
            changed: 'Nothing.',
          },
          message: 'Heap is empty.',
          messageTone: 'warn',
        },
      ],
    }
  }
  const max = arr[0]
  const steps: TreeStep[] = [
    {
      id: 'h-max',
      label: `Max = ${max}`,
      tree: heapToTree(arr),
      marks: { h0: 'current' },
      showIndex: true,
      heap: arr,
      heapFocus: [0],
      codeLine: 12,
      codeSnippetId: 'heap',
      variables: vars(arr, { max }),
      explanation: {
        happening: `The maximum is ALWAYS the root (index 0) = ${max}.`,
        why: 'That is the max-heap guarantee. Peek is O(1).',
        changed: 'Next: swap with the last leaf so we can delete the hole at the end.',
      },
      message: `Extract-max starts. Root is ${max}.`,
      messageTone: 'info',
    },
  ]
  const swapped = arr.slice()
  swapped[0] = swapped[swapped.length - 1]
  swapped[swapped.length - 1] = max
  steps.push({
    id: 'h-swaplast',
    label: `Swap root with last`,
    tree: heapToTree(swapped),
    marks: { h0: 'new', [`h${swapped.length - 1}`]: 'current' },
    showIndex: true,
    heap: swapped,
    heapFocus: [0, swapped.length - 1],
    codeLine: 13,
    codeSnippetId: 'heap',
    variables: vars(swapped, { max }),
    explanation: {
      happening: `Swap [${0}]=${swapped[0]} with last [${swapped.length - 1}]=${max}.`,
      why: 'Removing from the end keeps the array compact (complete tree).',
      changed: 'Pop the last cell next (the old max leaves).',
    },
    message: `Swap root and last, then pop.`,
    messageTone: 'info',
  })
  const popped = swapped.slice(0, -1)
  steps.push({
    id: 'h-pop',
    label: `Pop ${max}`,
    tree: heapToTree(popped),
    marks: { h0: 'unbalanced' },
    showIndex: true,
    heap: popped,
    heapFocus: [0],
    codeLine: 14,
    codeSnippetId: 'heap',
    variables: vars(popped, { max, hole: popped[0] ?? '∅' }),
    explanation: {
      happening: `${max} is gone. The new root ${popped[0] ?? '∅'} may be smaller than its children — SINK / sift-down.`,
      why: 'A leaf that jumped to the root is usually too small.',
      changed: popped.length ? 'Compare with the larger child and swap down.' : 'Heap empty.',
    },
    message: popped.length ? 'Sink the new root.' : `${max} extracted. Heap empty.`,
    messageTone: 'info',
  })
  const sinks = popped.length ? sinkSteps(popped, 0, true) : []
  let cur = popped
  sinks.forEach((s, k) => {
    cur = s.arr
    steps.push({
      id: `h-sink-${k}`,
      label: `Sink swap`,
      tree: heapToTree(cur),
      marks: { [`h${s.to}`]: 'current', [`h${s.from}`]: 'path' },
      showIndex: true,
      heap: cur,
      heapFocus: [s.from, s.to],
      codeLine: 18,
      codeSnippetId: 'heap',
      variables: vars(cur, { from: s.from, to: s.to }),
      explanation: {
        happening: `Parent at [${s.from}] was smaller than child at [${s.to}] — swap down.`,
        why: 'Always swap with the LARGER child (max-heap), otherwise the other child would break the law.',
        changed: `Array: [${cur.join(', ')}]`,
      },
      message: `Sink swap ${s.from} ↔ ${s.to}.`,
      messageTone: 'success',
    })
  })
  steps.push({
    id: 'h-done',
    label: `Extracted ${max}`,
    tree: heapToTree(cur),
    marks: {},
    showIndex: true,
    heap: cur,
    heapFocus: [],
    codeLine: 22,
    codeSnippetId: 'heap',
    variables: vars(cur, { extracted: max }),
    explanation: {
      happening: `Done. Returned ${max}. Heap property restored. Size decreased by 1.`,
      why: 'Insert and extract are O(log n) because the tree is complete — height is ⌊log₂ n⌋.',
      changed: `Heap: [${cur.join(', ')}]`,
    },
    message: `Extracted ${max}.`,
    messageTone: 'success',
  })
  return { steps, arr: cur }
}

export function heapLoad(seq: number[]): number[] {
  return heapFromSequence(seq, true)
}

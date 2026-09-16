import { findNode, visitValues, withBalanceFactors, type BinNode } from '../lib/binaryTree'
import { bstDelete } from '../lib/bst'
import { balanceFactor, rotationStages, unbalancedMarks, type RotKind } from '../lib/avl'
import { buildAvlInsert, buildRotationDemo } from '../engines/avlLab'
import { buildBstInsert, buildBstSearch } from '../engines/bstLab'
import { buildTraversalSteps } from '../engines/traversalLab'
import { marksByValue, treeFromSpec } from '../lib/stepBuilders'
import { bTreeFromSequence, type BTreeNode } from '../lib/btree'
import type { BTreePicture } from './syllabus/types'
import type { TreeStep } from '../types/lab'

export type LessonCase = { id: string; title: string; steps: TreeStep[] }

function frame(tree: BinNode | null, label: string, note: string, marks: Record<string, string> = {}, showBf = false): TreeStep {
  return { id: label, label, tree: showBf ? withBalanceFactors(tree) : tree, marks: showBf ? { ...marks, ...unbalancedMarks(tree) } : marks, showBf,
    codeLine: null, codeSnippetId: '', variables: {},
    explanation: { happening: note, why: '', changed: '' } }
}

type Picture = [string | null, string, string, Record<string, string>?]
function pictures(id: string, title: string, specs: Picture[], showBf = false): LessonCase {
  return { id, title, steps: specs.map(([spec, label, note, marks]) => {
    const tree = spec ? treeFromSpec(spec) : null
    return frame(tree, label, note, marksByValue(tree, marks ?? {}), showBf)
  }) }
}

export function avlConstruction(seq: number[]): TreeStep[] {
  let tree: BinNode | null = null
  const steps = [frame(null, 'Empty AVL tree', 'root = NULL. Insert keys using the BST rule.', {}, true)]
  for (const key of seq) {
    const result = buildAvlInsert(tree, key)
    steps.push(...result.steps)
    tree = result.root
  }
  steps.push(frame(tree, 'Balanced result', `In-order: ${visitValues(tree, 'inorder').join(' ')}. Every balance factor is -1, 0 or +1.`, {}, true))
  return steps
}

export function avlDeletion(root: BinNode | null, key: number): TreeStep[] {
  const result = bstDelete(root, key)
  let tree = result.root
  const steps = [frame(root, `Before deleting ${key}`, 'First remove the key using the BST deletion rules.', {}, true),
    frame(tree, result.case === 'missing' ? 'Key not found' : `BST deletion: ${result.case}`,
      result.case === 'missing' ? 'Tree unchanged.' : `Remove ${key}${result.successorValue === undefined ? '' : ` using successor ${result.successorValue}`}. Now check every ancestor from bottom to top.`, {}, true)]
  if (result.case === 'missing') return steps
  const ids: string[] = []
  const collect = (node: BinNode | null) => { if (node) { collect(node.left); collect(node.right); ids.push(node.id) } }
  collect(tree)
  for (const id of ids) {
    const node = findNode(tree, id)
    if (!node || Math.abs(balanceFactor(node)) <= 1 || !tree) continue
    const stages = rotationStages(tree, id)
    const child = balanceFactor(node) > 1 ? node.left : node.right
    steps.push(frame(tree, `${stages[0].kind} at ${node.value}`,
      `BF(${node.value}) = ${balanceFactor(node)}; taller child's BF = ${balanceFactor(child)}. Choose by the child's BF, not by the deleted key.`, { [id]: 'unbalanced' }, true))
    for (const stage of stages) steps.push(frame(stage.tree, stage.note.split(':')[0], stage.note, { [stage.pivot]: 'found' }, true))
    tree = stages[stages.length - 1].tree
  }
  steps.push(frame(tree, 'Deletion complete', `In-order: ${visitValues(tree, 'inorder').join(' ') || '(empty)'}. All remaining nodes are balanced.`, {}, true))
  return steps
}

const ROTATION_INPUTS: Record<RotKind, number[]> = { LL: [30, 20, 10], RR: [10, 20, 30], LR: [30, 10, 20], RL: [10, 30, 20] }
export function rotationCases(kinds: RotKind[]): LessonCase[] {
  return kinds.flatMap(kind => [
    { id: kind.toLowerCase(), title: `${kind}: insert ${ROTATION_INPUTS[kind].join(', ')}`, steps: avlConstruction(ROTATION_INPUTS[kind]).slice(4) },
    { id: `${kind.toLowerCase()}-subtree`, title: `${kind}: non-empty middle subtree`, steps: buildRotationDemo(kind) },
  ])
}

export const AVL_DELETE_CASES = [
  { id: 'r1', title: 'R1 / LL: left child BF +1', spec: '30(20(10,),40)', key: 40 },
  { id: 'r0', title: 'R0 / LL: left child BF 0', spec: '30(20(10,25),40)', key: 40 },
  { id: 'r-1', title: 'R-1 / LR: left child BF -1', spec: '50(40(,45),60)', key: 60 },
  { id: 'l-1', title: 'L-1 / RR: right child BF -1', spec: '20(10,30(,40))', key: 10 },
  { id: 'l0', title: 'L0 / RR: right child BF 0', spec: '20(10,30(25,40))', key: 10 },
  { id: 'l1', title: 'L1 / RL: right child BF +1', spec: '20(10,40(30,))', key: 10 },
  { id: 'no-rotation', title: 'Delete without a rotation', spec: '20(10,30)', key: 10 },
  { id: 'two-children', title: 'Delete root with two children', spec: '20(10,30(25,40))', key: 20 },
  { id: 'one-child', title: 'Delete a node with one child', spec: '20(10,30(25,))', key: 30 },
  { id: 'missing', title: 'Missing key', spec: '20(10,30)', key: 99 },
  { id: 'last-node', title: 'Delete the last node', spec: '20', key: 20 },
  { id: 'cascade', title: 'Cascading repair: RL below, then LL above', spec: '12(6(2(1,4(3,5)),10(8(7,9),11)),14(13,16(15,)))', key: 13 },
]

function binaryCases(): LessonCase[] {
  const base = '10(30(40,20),5)'
  const found = treeFromSpec(base)
  const search = (key: number) => {
    const order = visitValues(found, 'preorder')
    const limit = order.includes(key) ? order.indexOf(key) + 1 : order.length
    const steps = order.slice(0, limit).map(value => frame(found, `Compare ${value} with ${key}`,
      value === key ? 'Found. Stop searching.' : 'Not equal. Search left, then right; there is no BST ordering rule.', marksByValue(found, { [String(value)]: value === key ? 'found' : 'current' })))
    if (!order.includes(key)) steps.push(frame(found, 'Not found', 'Both subtrees are exhausted. Return NULL.'))
    return steps
  }
  return [
    pictures('insert', 'Insert: empty root, left slot, right slot, next level', [
      [null, 'Empty tree', 'root = NULL.'], ['10', 'Insert 10', 'The first node becomes root.', { 10: 'new' }],
      ['10(30,)', 'Insert 30', 'First empty slot: left pointer of 10.', { 30: 'new' }],
      ['10(30,5)', 'Insert 5', 'First empty slot: right pointer of 10.', { 5: 'new' }],
      ['10(30(40,),5)', 'Insert 40', 'Root is full. The queue next checks 30; attach to its left.', { 40: 'new' }],
      [base, 'Insert 20', '30 has a left child. Attach to its empty right pointer.', { 20: 'new' }],
    ]),
    { id: 'search-found', title: 'Search: key on the right', steps: search(5) },
    { id: 'search-missing', title: 'Search: missing key', steps: search(99) },
    pictures('delete-internal', 'Delete: node with two children', [
      [base, 'Find target 30', 'Level-order scan finds target 30 and deepest-rightmost node 20.', { 30: 'current', 20: 'new' }],
      ['10(20(40,20),5)', 'Copy last value', 'Copy 20 into target 30. There are temporarily two 20s; no pointer has been removed.'],
      ['10(20(40,),5)', 'Remove the old last node', 'Disconnect the old leaf 20 from its parent and free it.'],
    ]),
    pictures('delete-leaf', 'Delete: leaf which is not last', [
      [base, 'Delete leaf 40', 'The last leaf is 20, not 40.', { 40: 'current', 20: 'new' }],
      ['10(30(20,20),5)', 'Copy 20 into 40', 'Keep the target node; replace only its value.'],
      ['10(30(20,),5)', 'Unlink the last leaf', 'Remove the original right child of 30.'],
    ]),
    pictures('delete-one-child', 'Delete: node with one child', [
      ['10(30(40,),5)', 'Delete 30', 'Last node is 40.', { 30: 'current', 40: 'new' }],
      ['10(40(40,),5)', 'Copy 40', 'Copy the last value into target 30.'],
      ['10(40,5)', 'Remove old 40', 'Unlink the deepest leaf. The target is now a leaf.'],
    ]),
    pictures('delete-root', 'Delete: root', [[base, 'Delete 10', 'Last value is 20.'], ['20(30(40,20),5)', 'Copy last value to root', 'The root pointer stays; its data becomes 20.'], ['20(30(40,),5)', 'Unlink the old last node', 'The tree remains complete.']]),
    pictures('delete-last', 'Delete: target is already the last node', [[base, 'Delete 20', 'Target and deepest-rightmost are the same node.'], ['10(30(40,),5)', 'Unlink 20', 'No value copy is needed.']]),
    pictures('delete-single', 'Delete: only node', [['10', 'Delete 10', 'Target is the only root.'], [null, 'Empty tree', 'Free the node and set root = NULL.']]),
    pictures('delete-missing', 'Delete: missing key', [[base, 'Find 99', 'Check every node.'], [base, 'No match', 'Return the original tree unchanged.']]),
    pictures('empty', 'Search / delete in an empty tree', [[null, 'root = NULL', 'No node can match.'], [null, 'Return not found', 'Do not dereference a NULL pointer.']]),
    pictures('duplicates', 'Duplicate values: remove the first level-order match', [['10(10,5)', 'Delete one occurrence of 10', 'The first match is the root. The last node is 5.'], ['5(10,)', 'Copy 5 and unlink the old last node', 'The second 10 stays. An unordered binary tree can store duplicate values.']]),
  ]
}

function bstDeletion(spec: string, key: number): TreeStep[] {
  const tree = treeFromSpec(spec)
  const result = bstDelete(tree, key)
  const steps = buildBstSearch(tree, key)
  const targetId = result.path[result.path.length - 1]
  if (result.case === 'two-children') {
    const target = findNode(tree, targetId)!
    let successor = target.right!
    while (successor.left) {
      steps.push(frame(tree, `Successor search: ${successor.value}`, 'Start in the right subtree and keep going left.', { [successor.id]: 'current' }))
      successor = successor.left
    }
    steps.push(frame(tree, `Successor = ${successor.value}`, 'Copy this value to the target, then remove the old successor node.', { [successor.id]: 'found', [targetId]: 'current' }))
  }
  steps.push(frame(result.root, `Result: ${result.case}`, result.case === 'missing' ? 'Tree unchanged.' : `Deleted ${key}. In-order: ${visitValues(result.root, 'inorder').join(' ') || '(empty)'}.`))
  return steps
}

function bframe(tree: BTreePicture, label: string, note: string): TreeStep {
  const convert = (p: BTreePicture, id = 'b'): BTreeNode => ({ id, keys: p.keys, children: (p.children ?? []).map((n, i) => convert(n, `${id}-${i}`)) })
  return { ...frame(null, label, note), btree: convert(tree) }
}

function btreeDeleteCases(): LessonCase[] {
  return [
    { id: 'leaf', title: 'Order 3: leaf deletion without underflow', steps: [
      bframe({ keys: [20], children: [{ keys: [5, 10] }, { keys: [30] }] }, 'Delete 5', 'The leaf has two keys.'),
      bframe({ keys: [20], children: [{ keys: [10] }, { keys: [30] }] }, 'Remove 5', 'One key remains: minimum occupancy is satisfied.'),
    ] },
    { id: 'borrow-left', title: 'Order 3: borrow from left sibling', steps: [
      bframe({ keys: [10, 20], children: [{ keys: [5, 6] }, { keys: [12] }, { keys: [30] }] }, 'Delete 12', 'Middle leaf will underflow.'),
      bframe({ keys: [10, 20], children: [{ keys: [5, 6] }, { keys: [] }, { keys: [30] }] }, 'Underflow', 'Left sibling has two keys, so it can lend.'),
      bframe({ keys: [6, 20], children: [{ keys: [5] }, { keys: [10] }, { keys: [30] }] }, 'Borrow through parent', 'Parent separator 10 moves down; sibling key 6 moves up.'),
    ] },
    { id: 'borrow-right', title: 'Order 3: borrow from right sibling', steps: [
      bframe({ keys: [10, 20], children: [{ keys: [5] }, { keys: [12] }, { keys: [25, 30] }] }, 'Delete 12', 'Middle leaf will underflow.'),
      bframe({ keys: [10, 20], children: [{ keys: [5] }, { keys: [] }, { keys: [25, 30] }] }, 'Underflow', 'Right sibling can lend one key.'),
      bframe({ keys: [10, 25], children: [{ keys: [5] }, { keys: [20] }, { keys: [30] }] }, 'Borrow through parent', 'Separator 20 moves down; sibling key 25 moves up.'),
    ] },
    { id: 'merge', title: 'Order 3: merge when neither sibling can lend', steps: [
      bframe({ keys: [10, 20], children: [{ keys: [5] }, { keys: [12] }, { keys: [30] }] }, 'Delete 12', 'Both siblings have only the minimum one key.'),
      bframe({ keys: [10, 20], children: [{ keys: [5] }, { keys: [] }, { keys: [30] }] }, 'Underflow', 'Cannot borrow. Merge with sibling and separator 10.'),
      bframe({ keys: [20], children: [{ keys: [5, 10] }, { keys: [30] }] }, 'Merge complete', 'Parent loses one separator and one child pointer.'),
    ] },
    { id: 'internal', title: 'Order 3: internal key replacement', steps: [
      bframe({ keys: [20], children: [{ keys: [5, 10] }, { keys: [30] }] }, 'Delete internal 20', 'Predecessor is 10: the largest key in the left subtree.'),
      bframe({ keys: [10], children: [{ keys: [5, 10] }, { keys: [30] }] }, 'Copy predecessor', '10 appears twice temporarily. Remove the old leaf copy next.'),
      bframe({ keys: [10], children: [{ keys: [5] }, { keys: [30] }] }, 'Remove old 10', 'All ranges and occupancies are valid again.'),
    ] },
    { id: 'shrink', title: 'Order 3: merge and shrink the root', steps: [
      bframe({ keys: [10], children: [{ keys: [5] }, { keys: [30] }] }, 'Delete 5', 'The left leaf underflows; right sibling cannot lend.'),
      bframe({ keys: [], children: [{ keys: [10, 30] }] }, 'Merge through the root', 'Old root has zero keys and one child.'),
      bframe({ keys: [10, 30] }, 'Promote the only child', 'The tree height decreases by one.'),
    ] },
  ]
}

export function topicCases(id: string): LessonCase[] {
  if (id === 'binary-create') return [
    pictures('create-three', 'Create: 10, 30, 5', [[null, 'Empty tree', 'root = NULL.'], ['10', 'Insert 10', 'Allocate the root with two NULL pointers.'], ['10(30,)', 'Insert 30', 'First free slot is root.left.'], ['10(30,5)', 'Insert 5', 'Next free slot is root.right. Values do not choose the side.']]),
    pictures('create-six', 'Create: 8, 2, 7, 9, 4, 1', [[null, 'Empty tree', 'Start with no nodes.'], ['8', 'Insert 8', '8 becomes root.'], ['8(2,)', 'Insert 2', 'Fill root.left.'], ['8(2,7)', 'Insert 7', 'Fill root.right.'], ['8(2(9,),7)', 'Insert 9', 'Root is full. The queue reaches 2 next: fill its left slot.'], ['8(2(9,4),7)', 'Insert 4', 'Fill the right slot of 2.'], ['8(2(9,4),7(1,))', 'Insert 1', 'Move to 7 and fill its left slot.']]),
  ]
  if (id === 'general-create') return [{ id: 'hierarchy', title: 'Create a hierarchy, then delete a subtree', steps: [
    bframe({ keys: [] }, 'Empty tree', 'root = NULL.'),
    bframe({ keys: [1] }, 'Create root 1', 'No parent; first child and next sibling are NULL.'),
    bframe({ keys: [1], children: [{ keys: [2] }] }, 'Add child 2', 'Set root.child to node 2.'),
    bframe({ keys: [1], children: [{ keys: [2] }, { keys: [3] }, { keys: [4] }] }, 'Add siblings 3 and 4', 'All three are children of 1. The sibling chain is 2 -> 3 -> 4.'),
    bframe({ keys: [1], children: [{ keys: [2], children: [{ keys: [5] }, { keys: [6] }] }, { keys: [3] }, { keys: [4] }] }, 'Add children 5 and 6 to 2', 'Preorder: 1, 2, 5, 6, 3, 4. Height is 2 edges.'),
    bframe({ keys: [1], children: [{ keys: [3] }, { keys: [4] }] }, 'Delete subtree 2', 'Free 5 and 6, then 2. Reconnect root.child to 3. Nodes 3 and 4 stay.'),
  ] }]
  if (id === 'multiway-operations') return [
    { id: 'create', title: 'Create: 20, 50, 10, 30, 40, 60', steps: [
      bframe({ keys: [] }, 'Empty tree', 'root = NULL.'),
      bframe({ keys: [20] }, 'Insert 20', 'Allocate a node with one key.'),
      bframe({ keys: [20, 50] }, 'Insert 50', 'The leaf has space. Insert in sorted order.'),
      bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [] }, { keys: [] }] }, 'Insert 10', 'The root is full. 10 < 20, so create child[0]. Empty boxes are NULL ranges.'),
      bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Insert 30, 40, 60', '30 and 40 fill child[1]. 60 creates child[2]. Inorder: 10, 20, 30, 40, 50, 60.'),
    ] },
    { id: 'full', title: 'Insert into a full leaf: no split', steps: [
      bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Insert 35', 'Select the middle range at the root.'),
      bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40], children: [{ keys: [] }, { keys: [35] }, { keys: [] }] }, { keys: [60] }] }, 'Create range child for 35', '30 < 35 < 40. A new child grows below the full node. This is not a B-Tree split.'),
    ] },
    { id: 'leaf', title: 'Delete from a multi-key leaf', steps: [bframe({ keys: [30, 40] }, 'Delete 30', 'Both adjacent child ranges are empty.'), bframe({ keys: [40] }, 'Shift remaining keys', 'One key remains. No minimum-occupancy repair is required.')] },
    { id: 'internal', title: 'Delete an internal key using predecessor', steps: [
      bframe({ keys: [20, 50], children: [{ keys: [5, 10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Delete 20', 'Its left range exists. Predecessor is maximum(left) = 10.'),
      bframe({ keys: [10, 50], children: [{ keys: [5] }, { keys: [30, 40] }, { keys: [60] }] }, 'Replace 20, then remove old 10', 'All keys in child[0] remain smaller than 10; middle keys remain between 10 and 50.'),
    ] },
    { id: 'last', title: 'Delete last key / missing key / empty tree', steps: [bframe({ keys: [10] }, 'Delete missing 99', 'Range search reaches NULL; keep 10.'), bframe({ keys: [10] }, 'Delete 10', 'The leaf becomes empty.'), bframe({ keys: [] }, 'Free the leaf', 'root = NULL. Search returns not found; deletion stays empty.')] },
  ]
  if (id === 'tree-destroy') return [pictures('free', 'Free children before parent', [['10(30,5)', 'Original tree', 'Postorder cleanup starts at left child 30.'], ['10(,5)', 'Free 30', 'Return to 10 and continue with the right child.'], ['10', 'Free 5', 'Both subtrees are freed.'], [null, 'Free 10; root = NULL', 'All three allocations have been released.']])]
  if (id === 'bt-construct') return [[50, 30, 70, 20, 40, 60, 80], [10, 20, 30, 40], [30, 10, 20, 30]].map((keys, i) => {
    let tree: BinNode | null = null
    const steps = [frame(null, 'Empty BST', 'root = NULL. The first insertion becomes the root.')]
    for (const key of keys) { const result = buildBstInsert(tree, key); steps.push(...result.steps); tree = result.root }
    return { id: `construction-${i}`, title: `Create: ${keys.join(', ')}`, steps }
  })
  if (id === 'bt-operations') return binaryCases()
  if (id === 'avl-single') return rotationCases(['LL', 'RR'])
  if (id === 'avl-double' || id === 'avl-rot') return rotationCases(id === 'avl-rot' ? ['LL', 'RR', 'LR', 'RL'] : ['LR', 'RL'])
  if (id === 'avl-delete') return AVL_DELETE_CASES.map(c => ({ ...c, steps: avlDeletion(treeFromSpec(c.spec), c.key) }))
  if (id === 'avl-insert') return [
    { id: 'construction', title: 'Construct: 63, 9, 19, 27, 18, 108, 99, 81', steps: avlConstruction([63, 9, 19, 27, 18, 108, 99, 81]) },
    { id: 'duplicate', title: 'Duplicate key: no change', steps: avlConstruction([20, 10, 30, 20]) },
    { id: 'non-root', title: 'Rotation below the root', steps: avlConstruction([50, 30, 70, 20, 40, 60, 80, 10, 5]) },
  ]
  if (['trav-intro', 'trav-pre', 'trav-in', 'trav-post', 'trav-level', 'trav-nonrec', 'trav-program'].includes(id)) {
    const order = id === 'trav-pre' ? ['preorder'] : id === 'trav-in' || id === 'trav-nonrec' ? ['inorder'] : id === 'trav-post' ? ['postorder'] : id === 'trav-level' ? ['levelorder'] : ['preorder', 'inorder', 'postorder']
    const examples = [{ title: 'Branching tree', spec: 'A(B(D,E),C(,F))' }, { title: 'Complete tree', spec: '40(20(10,30),60(50,70))' }, { title: 'Skewed tree', spec: '10(,20(,30))' }, { title: 'Single node', spec: '10' }]
    return examples.flatMap((example, i) => order.map(kind => ({ id: `${kind}-${i}`, title: `${example.title}: ${kind}`, steps: buildTraversalSteps(treeFromSpec(example.spec), kind as 'preorder') })))
  }
  if (id === 'bst-search' || id === 'avl-search') return [25, 99].map(key => ({ id: `search-${key}`, title: key === 25 ? 'Search: found' : 'Search: missing', steps: buildBstSearch(treeFromSpec('30(20(10,25),40)'), key) }))
  if (id === 'bst-insert') return [
    { id: 'left', title: 'Insert in left subtree', steps: buildBstInsert(treeFromSpec('30(20,40)'), 10).steps },
    { id: 'right', title: 'Insert in right subtree', steps: buildBstInsert(treeFromSpec('30(20,40)'), 35).steps },
    { id: 'empty', title: 'Insert in empty tree', steps: buildBstInsert(null, 30).steps },
    { id: 'duplicate', title: 'Duplicate key', steps: buildBstInsert(treeFromSpec('30(20,40)'), 20).steps },
  ]
  if (id === 'bst-delete') return [
    { id: 'leaf', title: 'Case 1: leaf', spec: '30(20(10,25),40)', key: 10 },
    { id: 'one-left', title: 'Case 2: only left child', spec: '30(20(10,),40)', key: 20 },
    { id: 'one-right', title: 'Case 2: only right child', spec: '30(20(,25),40)', key: 20 },
    { id: 'two', title: 'Case 3: two children', spec: '30(20(10,25),50(40(35,),60))', key: 30 },
    { id: 'successor-child', title: 'Successor has a right child', spec: '30(20,50(40(,45),60))', key: 30 },
    { id: 'single', title: 'Only root', spec: '30', key: 30 },
    { id: 'missing', title: 'Missing key', spec: '30(20,40)', key: 99 },
  ].map(c => ({ id: c.id, title: c.title, steps: bstDeletion(c.spec, c.key) }))
  if (id === 'bt-ins') return [3, 4, 5].map(order => ({ id: `order-${order}`, title: `Order ${order}: leaf, root and cascading splits`, steps: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17, 40, 50, 60, 70], order).allSteps.flatMap(item => item.steps.map(f => ({ ...frame(null, `Insert ${item.key}: ${f.kind}`, f.message), btree: f.tree, highlightBId: f.highlightId, highlightKey: f.highlightKey }))) }))
  if (id === 'bt-find') {
    const root = bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root
    return [17, 8].map(key => {
      const steps: TreeStep[] = []
      let node: BTreeNode | undefined = root
      while (node) {
        let i = 0
        while (i < node.keys.length && key > node.keys[i]) i++
        const found = node.keys[i] === key
        steps.push({ ...frame(null, found ? `Found ${key}` : `Compare in [${node.keys.join(', ')}]`, found ? 'Exact match: return found.' : node.children.length ? `${key} belongs to range ${i}. Follow child[${i}].` : 'Leaf reached without a match: return not found.'), btree: root, highlightBId: node.id, highlightKey: key })
        node = found ? undefined : node.children[i]
      }
      return { id: `search-${key}`, title: key === 17 ? 'Search 17: found' : 'Search 8: missing', steps }
    })
  }
  if (id === 'bt-del') return btreeDeleteCases()
  if (id === 'bt-linked') return [pictures('pointers', 'Allocate nodes and connect pointers', [
    [null, 'Declare root', 'struct Node *root = NULL;'],
    ['10', 'Allocate root', 'root = newNode(10); left = right = NULL;'],
    ['10(30,)', 'Connect left pointer', 'root->left = newNode(30);'],
    ['10(30,5)', 'Connect right pointer', 'root->right = newNode(5); Each arrow represents one pointer.'],
  ])]
  if (id === 'tree-def') return [pictures('build', 'Root, edges and subtrees', [
    ['A', 'Root', 'A is the only node without a parent.'],
    ['A(B,C)', 'Parent and children', 'A is parent of B and C. B and C are siblings.'],
    ['A(B(D,E),C(,F))', 'Subtrees and leaves', 'B, D, E form the left subtree. D, E and F are leaves.'],
  ])]
  if (id === 'bt-multi' || id === 'multiway-definition') return [{ id: 'ranges', title: 'Multiway search: choose a child by range', steps: [
    bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Three ranges', 'Less than 20 | between 20 and 50 | greater than 50.'),
    bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Search 40: choose child[1]', '40 > 20 and 40 < 50, so enter the middle child.'),
    { ...bframe({ keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, 'Found 40', 'Compare 40 with 30, then 40. Match.'), highlightBId: 'b-1', highlightKey: 40 },
  ] }]
  return []
}

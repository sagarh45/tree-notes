import { ALL_TOPICS } from './syllabus'
import { CH6_AVL } from './syllabus/ch6-avl'
import type { Topic } from './syllabus/types'
import { LINKED_PROGRAM, MULTIWAY_PROGRAM, BTREE_PROGRAM } from './coursePrograms'

export const COURSE = [
  { id: 'definition', title: 'Definition', description: 'Trees, binary trees, terminology and properties.', topics: ['tree-def', 'tree-terms', 'bt-def', 'bt-types', 'bt-props', 'tree-why'] },
  { id: 'traversal', title: 'Traversal', description: 'Pre-order, in-order and post-order; recursive calls and output.', topics: ['trav-intro', 'trav-pre', 'trav-in', 'trav-post', 'trav-program'] },
  { id: 'linked', title: 'Linked implementation', description: 'Node structure, memory allocation, left and right pointers.', topics: ['bt-linked'] },
  { id: 'binary-ops', title: 'Binary tree operations', description: 'Insertion, searching and deletion in an unordered binary tree.', topics: ['bt-operations'] },
  { id: 'bst-ops', title: 'BST operations', description: 'The ordering rule; insertion, searching and all deletion cases.', topics: ['bst-def', 'bst-search', 'bst-insert', 'bst-minmax', 'bst-delete', 'bst-complexity'] },
  { id: 'multiway', title: 'Multiway trees', description: 'Multiple keys, child pointers and search ranges.', topics: ['multiway-definition'] },
  { id: 'btree', title: 'B-Trees', description: 'Order, occupancy, search, splits, borrowing and merging.', topics: ['bt-multi', 'bt-ins', 'bt-find', 'bt-del'] },
  { id: 'avl', title: 'AVL tree', description: 'Balance factors, construction, searching and deletion rebalancing.', topics: ['avl-def', 'avl-insert', 'avl-search', 'avl-delete'] },
  { id: 'single-rotation', title: 'Single rotations', description: 'LL and RR cases, pointer changes and middle-subtree transfer.', topics: ['avl-single'] },
  { id: 'double-rotation', title: 'Double rotations', description: 'LR and RL cases, with both elementary rotations shown.', topics: ['avl-double'] },
] as const

const rotation = ALL_TOPICS.find(t => t.id === 'avl-rot')!
const insertionProgram = CH6_AVL.topics.find(t => t.id === 'avl-insert')!.program!
const multiway: Topic = {
  id: 'multiway-definition', title: 'Multiway search tree',
  definition: 'An <b>m-way search tree</b> stores up to <b>m - 1 sorted keys</b> in each node and has up to <b>m child pointers</b>. Each pointer represents a range between consecutive keys. A general multiway search tree does not have to be balanced.',
  simple: '<p>Ek node mein kai sorted keys ho sakti hain. Keys 20 aur 50 ho, toh teen raaste milte hain: 20 se chhota, 20 aur 50 ke beech, aur 50 se bada.</p><p>A B-Tree adds minimum occupancy and equal leaf-depth rules. Every B-Tree is a multiway search tree, but not every multiway search tree is a B-Tree.</p>',
  points: ['Internal node with k keys uses k + 1 child pointers.', 'A leaf has no non-NULL children.', 'All keys in a child subtree must stay inside that pointer\'s range.'],
  diagrams: [{ kind: 'btree-shape', title: 'Two keys divide three ranges', tree: { keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] }, caption: 'child[0]: < 20; child[1]: 20 < key < 50; child[2]: > 50.' }],
  algorithm: [{ title: 'Search a multiway node', steps: ['Scan sorted keys until the first key greater than or equal to the target.', 'If equal, return found.', 'If the node is a leaf, return not found.', 'Otherwise follow the child pointer for the selected range and repeat.'] }],
  syntax: [{ title: 'Node representation', code: '#define M 4\nstruct Node {\n    int count;\n    int keys[M - 1];\n    struct Node *child[M];\n};' }],
  program: MULTIWAY_PROGRAM,
}

const derived: Topic[] = [multiway, ...(['single', 'double'] as const).map(kind => ({
  ...rotation, id: `avl-${kind}`, title: kind === 'single' ? 'LL and RR: single rotations' : 'LR and RL: double rotations',
  definition: kind === 'single'
    ? '<b>LL</b>: BF(z) = +2 and BF(z.left) >= 0. Fix with one <b>right rotation</b> at z. <b>RR</b>: BF(z) = -2 and BF(z.right) <= 0. Fix with one <b>left rotation</b> at z. The zero-child-BF cases occur after deletion.'
    : '<b>LR</b>: BF(z) = +2 and BF(z.left) < 0. First rotate the left child <b>left</b>, then z <b>right</b>. <b>RL</b>: BF(z) = -2 and BF(z.right) > 0. First rotate the right child <b>right</b>, then z <b>left</b>.',
  simple: kind === 'single'
    ? '<p>LL mein left child upar aata hai. RR mein right child upar aata hai. Beech ka subtree purane root ko milta hai. Keys ka in-order sequence nahi badalta.</p>'
    : '<p>Zig-zag shape ko pehle seedha karo, phir main pivot ko rotate karo. Pehle rotation ke baad original pivot abhi bhi unbalanced hota hai. Dono steps complete hone ke baad hi tree balanced hota hai.</p>',
  diagrams: rotation.diagrams?.filter(d => d.kind === 'avl-steps' && (kind === 'single' ? /^(LL|RR)/ : /^(LR|RL)/).test(d.title)),
  algorithm: kind === 'single' ? [
    { title: 'LL: right rotation at z', steps: ['Let y = z.left and T2 = y.right.', 'Set y.right = z and z.left = T2.', 'Update the height of z, then y. Return y to the parent.'] },
    { title: 'RR: left rotation at z', steps: ['Let y = z.right and T2 = y.left.', 'Set y.left = z and z.right = T2.', 'Update the height of z, then y. Return y to the parent.'] },
  ] : [
    { title: 'LR: left, then right', steps: ['Rotate left at z.left; reconnect the returned subtree to z.left.', 'Now rotate right at z.', 'Return the new subtree root to the parent; recompute heights bottom-up.'] },
    { title: 'RL: right, then left', steps: ['Rotate right at z.right; reconnect the returned subtree to z.right.', 'Now rotate left at z.', 'Return the new subtree root to the parent; recompute heights bottom-up.'] },
  ],
  syntax: [...(rotation.syntax ?? []), ...(kind === 'double' ? [{ title: 'Compose the two rotations', code: '/* LR */\nz->left = leftRotate(z->left);\nz = rightRotate(z);\n\n/* RL */\nz->right = rightRotate(z->right);\nz = leftRotate(z);' }] : [])],
  example: { title: kind === 'single' ? 'LL versus RR' : 'LR versus RL', html: kind === 'single'
    ? '<p><b>30, 20, 10:</b> LL at 30, right rotate 30. <b>10, 20, 30:</b> RR at 10, left rotate 10. Both finish as 20(10, 30).</p>'
    : '<p><b>30, 10, 20:</b> left rotate 10, then right rotate 30. <b>10, 30, 20:</b> right rotate 30, then left rotate 10. Both finish as 20(10, 30). In-order stays 10, 20, 30 at every rotation step.</p>' },
  program: { ...insertionProgram, title: kind === 'single' ? 'C program: LL and RR insertion cases' : 'C program: LR and RL insertion cases',
    input: kind === 'single' ? '3\n30 20 10' : '3\n30 10 20', output: undefined },
}))]

export const COURSE_TOPICS = new Map([...ALL_TOPICS, ...derived].map(t => [t.id, t.id === 'tree-def' || t.id === 'bt-linked'
  ? { ...t, program: LINKED_PROGRAM }
  : t.id === 'bt-del' ? { ...t, program: BTREE_PROGRAM, points: [...(t.points ?? []), 'The diagrams use order 3 and bottom-up underflow repair. The C program uses order 4 (minimum degree 2) and repairs before descending. Both obey their stated occupancy rules.'] } : t]))
export function lessonForTopic(topic: string) {
  if (topic === 'avl-rot') return 'double-rotation'
  return COURSE.find(l => (l.topics as readonly string[]).includes(topic))?.id
}

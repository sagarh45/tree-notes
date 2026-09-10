import { makeNode, type BinNode } from '../lib/binaryTree'

/** Same company sample used for every terminology drawing. IDs are the letters. */
export function termTree(): BinNode {
  const A = makeNode('A', 'A')
  const B = makeNode('B', 'B')
  const C = makeNode('C', 'C')
  const D = makeNode('D', 'D')
  const E = makeNode('E', 'E')
  const F = makeNode('F', 'F')
  A.left = B
  A.right = C
  B.left = D
  B.right = E
  C.right = F
  return A
}

function subB(): BinNode {
  const B = makeNode('B', 'B')
  B.left = makeNode('D', 'D')
  B.right = makeNode('E', 'E')
  return B
}

function subC(): BinNode {
  const C = makeNode('C', 'C')
  C.right = makeNode('F', 'F')
  return C
}

function loneD(): BinNode {
  return makeNode('D', 'D')
}

export type TermCard = {
  id: string
  title: string
  meaning: string
  example: string
  exam: string
  caption: string
  root?: BinNode | null
  roots?: { title: string; root: BinNode; marks?: Record<string, string>; tags?: Record<string, string> }[]
  marks?: Record<string, string>
  tags?: Record<string, string>
  visitOrder?: Record<string, number>
}

const T = () => termTree()

export const TERM_CARDS: TermCard[] = [
  {
    id: 'node',
    title: '1. Node',
    meaning: 'One box of data. In memory it is a struct with DATA plus pointers to children.',
    example: 'This tree has six nodes: A, B, C, D, E, F. Each circle is one node. Node B stores the letter B (or an employee id).',
    exam: 'A node is the basic unit that stores data and links to children.',
    caption: 'Every coloured circle is a node. n = 6.',
    root: T(),
    marks: { A: 'found', B: 'found', C: 'found', D: 'found', E: 'found', F: 'found' },
    tags: { A: 'node', B: 'node', C: 'node', D: 'node', E: 'node', F: 'node' },
  },
  {
    id: 'root',
    title: '2. Root',
    meaning: 'The top node. It has no parent. The whole tree is known by a pointer to the root.',
    example: 'A is the only root. Nobody sits above A. If we say “the tree”, we mean “start from A”.',
    exam: 'Root is the unique node with no parent.',
    caption: 'Teal = root A. The faded nodes hang under A.',
    root: T(),
    marks: { A: 'current' },
    tags: { A: 'ROOT' },
  },
  {
    id: 'parent-child',
    title: '3. Parent and child',
    meaning: 'If there is an edge from X down to Y, X is the parent and Y is the child. Only the immediate neighbour counts.',
    example: 'Look at B: teal parent. Green children are D and E. A is NOT the parent of D — A is the grandparent.',
    exam: 'Parent is the immediate node above; child is the immediate node below.',
    caption: 'Teal B = parent. Green D, E = children of B. C and F are a different parent–child pair.',
    root: T(),
    marks: { B: 'current', D: 'found', E: 'found' },
    tags: { B: 'parent', D: 'child', E: 'child' },
  },
  {
    id: 'edge',
    title: '4. Edge / branch',
    meaning: 'The link between a parent and a child. One “reports-to” line.',
    example: 'The line A—B is one edge. This tree has 5 edges. Check: n nodes always give n − 1 edges (6 − 1 = 5).',
    exam: 'A tree with n nodes has exactly n − 1 edges.',
    caption: 'Blue A and teal B mark the edge A—B. There are four more edges: A—C, B—D, B—E, C—F.',
    root: T(),
    marks: { A: 'path', B: 'current' },
    tags: { A: 'end', B: 'end' },
  },
  {
    id: 'siblings',
    title: '5. Siblings',
    meaning: 'Nodes that share the same parent.',
    example: 'D and E are siblings (both children of B). B and C are siblings (both children of A). D and F are NOT siblings — different parents (B vs C).',
    exam: 'Siblings have the same parent.',
    caption: 'Green D & E = one sibling pair (parent B in teal). F is faded because it is not their sibling.',
    root: T(),
    marks: { B: 'path', D: 'found', E: 'found' },
    tags: { B: 'parent', D: 'sibling', E: 'sibling' },
  },
  {
    id: 'leaf',
    title: '6. Leaf / terminal node',
    meaning: 'A node with no children. Both left and right pointers are NULL.',
    example: 'D, E, F are leaves (green). B is not a leaf — it has D and E. C is not a leaf — it has F. A is not a leaf.',
    exam: 'A leaf has degree 0.',
    caption: 'Green = leaves (no child under them). Faded A, B, C still have children.',
    root: T(),
    marks: { D: 'found', E: 'found', F: 'found' },
    tags: { D: 'leaf', E: 'leaf', F: 'leaf' },
  },
  {
    id: 'internal',
    title: '7. Internal node (non-leaf)',
    meaning: 'A node that has at least one child. In the exam you may say “non-leaf”. Some books exclude the root; we keep A as internal too.',
    example: 'A, B, C are internal (teal/green). D, E, F are leaves, so they are not internal.',
    exam: 'Internal nodes have one or more children.',
    caption: 'Highlighted A, B, C = internal. Leaves are faded.',
    root: T(),
    marks: { A: 'current', B: 'found', C: 'found' },
    tags: { A: 'internal', B: 'internal', C: 'internal' },
  },
  {
    id: 'subtree',
    title: '8. Subtree',
    meaning: 'A node plus everything hanging under it. That smaller picture is itself a tree.',
    example: 'Subtree of B is the second drawing: only B, D, E. Subtree of C is C with F. Subtree of D is a single node D.',
    exam: 'Left / right subtree of a node = the tree rooted at its left / right child.',
    caption: 'Same sample, then the three subtrees drawn as their own trees.',
    root: T(),
    marks: { B: 'current', D: 'found', E: 'found' },
    tags: { B: 'subtree root' },
    roots: [
      { title: 'Subtree of B', root: subB(), marks: { B: 'current', D: 'found', E: 'found' }, tags: { B: 'root of subtree' } },
      { title: 'Subtree of C', root: subC(), marks: { C: 'current', F: 'found' }, tags: { C: 'root of subtree' } },
      { title: 'Subtree of D (just a leaf)', root: loneD(), marks: { D: 'found' }, tags: { D: 'one-node tree' } },
    ],
  },
  {
    id: 'deg-node',
    title: '9. Degree of a node',
    meaning: 'How many children that one node has. (Not how many grandchildren.)',
    example: 'deg(A)=2, deg(B)=2, deg(C)=1, deg(D)=0, deg(E)=0, deg(F)=0. C is the interesting one: only a right child, degree still 1.',
    exam: 'Degree of a node = number of children.',
    caption: 'Badge on each circle = that node’s degree. Teal C has degree 1 (only F).',
    root: T(),
    marks: { C: 'current' },
    tags: { A: 'deg 2', B: 'deg 2', C: 'deg 1', D: 'deg 0', E: 'deg 0', F: 'deg 0' },
    visitOrder: { A: 2, B: 2, C: 1, D: 0, E: 0, F: 0 },
  },
  {
    id: 'deg-tree',
    title: '10. Degree of a tree',
    meaning: 'The maximum degree of any node in the whole tree.',
    example: 'The node-degrees are 2, 2, 1, 0, 0, 0. Maximum is 2. So this is a tree of degree 2 (a binary tree).',
    exam: 'Degree of the tree = max node-degree.',
    caption: 'A and B both have two children — they set the tree’s degree to 2.',
    root: T(),
    marks: { A: 'current', B: 'found' },
    tags: { A: 'max deg 2', B: 'max deg 2' },
  },
  {
    id: 'level',
    title: '11. Level',
    meaning: 'How far the node is from the root, counting edges. In these notes the root is level 0. (Some books start at 1 — write your convention in the exam.)',
    example: 'Level 0: A. Level 1: B and C (same floor). Level 2: D, E, F. So F is on the same floor as D and E even though C has no left child.',
    exam: 'Level of root = 0; child level = parent level + 1.',
    caption: 'Badge = level. Same number = same floor.',
    root: T(),
    marks: { A: 'current', B: 'path', C: 'path', D: 'found', E: 'found', F: 'found' },
    tags: { A: 'L0', B: 'L1', C: 'L1', D: 'L2', E: 'L2', F: 'L2' },
    visitOrder: { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2 },
  },
  {
    id: 'depth',
    title: '12. Depth of a node',
    meaning: 'Number of edges from the root down to that node. Same number as level when root = 0.',
    example: 'Depth(A)=0, depth(B)=1, depth(D)=2. Walk A → B → D: two edges, so depth of D is 2.',
    exam: 'Depth is measured from the root downward.',
    caption: 'Blue path A → B → D. Teal D has depth 2.',
    root: T(),
    marks: { A: 'path', B: 'path', D: 'current' },
    tags: { A: 'depth 0', B: 'depth 1', D: 'depth 2' },
  },
  {
    id: 'height-node',
    title: '13. Height of a node',
    meaning: 'Longest path downward from that node to a leaf. Count edges. A leaf has height 0. Empty (NULL) has height −1.',
    example: 'Height(D)=0 (leaf). Height(B)=1 (B to D or E). Height(C)=1 (C to F). Height(A)=2 (longest: A → B → D).',
    exam: 'height(n) = 1 + max(height(left), height(right)), with height(NULL) = −1.',
    caption: 'Badge = height of that node. Leaves show 0. Root A shows 2.',
    root: T(),
    marks: { A: 'path', B: 'path', D: 'current' },
    tags: { A: 'h=2', B: 'h=1', C: 'h=1', D: 'h=0', E: 'h=0', F: 'h=0' },
    visitOrder: { A: 2, B: 1, C: 1, D: 0, E: 0, F: 0 },
  },
  {
    id: 'height-tree',
    title: '14. Height of a tree',
    meaning: 'Height of the root. How tall the whole tree is.',
    example: 'Height of this tree = height(A) = 2. Longest root-to-leaf path has 2 edges (A–B–D or A–B–E or A–C–F).',
    exam: 'Height of the tree = height of the root.',
    caption: 'The longest root-to-leaf path is highlighted. That length is the tree height = 2.',
    root: T(),
    marks: { A: 'current', B: 'path', D: 'found' },
    tags: { A: 'tree height 2' },
  },
  {
    id: 'path',
    title: '15. Path',
    meaning: 'The sequence of nodes you walk from one node to another, following edges. A tree has no extra routes.',
    example: 'The only path from A to E is A → B → E. You cannot go A → C → … to reach E.',
    exam: 'In a tree there is exactly one simple path from the root to any node.',
    caption: 'Blue A, B and teal E = the unique path A → B → E.',
    root: T(),
    marks: { A: 'path', B: 'path', E: 'current' },
    tags: { A: 'start', B: 'via', E: 'end' },
  },
  {
    id: 'ancestor',
    title: '16. Ancestor and descendant',
    meaning: 'If you can walk down from X to Y, X is an ancestor of Y, and Y is a descendant of X. Parent is the immediate ancestor.',
    example: 'For teal E: ancestors are B and A (blue). Descendants of B are D and E. F is NOT a descendant of B — it hangs under C.',
    exam: 'Parent is the immediate ancestor; child is the immediate descendant.',
    caption: 'Teal E = the node. Blue A, B = ancestors of E. Faded F is not in E’s family under B.',
    root: T(),
    marks: { A: 'path', B: 'path', E: 'current' },
    tags: { A: 'ancestor', B: 'ancestor', E: 'node' },
  },
  {
    id: 'forest',
    title: '17. Forest',
    meaning: 'A set of disjoint trees (many trees, not joined by a common root).',
    example: 'Delete the root A. What remains is two separate trees: one rooted at B (B, D, E) and one rooted at C (C, F). That pair is a forest.',
    exam: 'A forest is a collection of trees.',
    caption: 'Left: tree rooted at B. Right: tree rooted at C. Together they are a forest — no single root joins them.',
    roots: [
      { title: 'Tree 1 after deleting A', root: subB(), marks: { B: 'current', D: 'found', E: 'found' }, tags: { B: 'root' } },
      { title: 'Tree 2 after deleting A', root: subC(), marks: { C: 'current', F: 'found' }, tags: { C: 'root' } },
    ],
  },
]

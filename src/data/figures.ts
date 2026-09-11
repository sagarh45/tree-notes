import { bstDelete, bstFromSequence } from '../lib/bst'
import { avlFromSequence } from '../lib/avl'
import { bTreeFromSequence } from '../lib/btree'
import { buildLetterTree, inorderThreads, makeNode, resetIds, type BinNode, type ThreadEdge } from '../lib/binaryTree'
import type { BTreeNode } from '../lib/btree'
import { heapFromSequence } from '../lib/heap'
import { rbFromSequence } from '../lib/rbtree'
import { huffmanBuild, HUFF_CLASSIC, HUFF_TINY } from '../lib/huffman'
import { trieFromWords, type TrieNode } from '../lib/trie'

export type Fig = {
  title: string
  caption: string
  root?: BinNode | null
  btree?: BTreeNode
  showBf?: boolean
  showColor?: boolean
  showIndex?: boolean
  showNulls?: boolean
  edgeLabels?: boolean
  threads?: ThreadEdge[]
  heap?: number[]
  trie?: TrieNode
  forest?: BinNode[]
  codes?: { ch: string; freq: number; code: string }[]
  marks?: Record<string, string>
  tags?: Record<string, string>
}

/** Map "value → mark/tag" onto the generated node ids of a freshly built tree. */
function byValue(root: BinNode | null, wanted: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  function walk(n: BinNode | null) {
    if (!n) return
    const hit = wanted[String(n.value)]
    if (hit !== undefined) out[n.id] = hit
    walk(n.left)
    walk(n.right)
  }
  walk(root)
  return out
}

/** Number the nodes level by level so the array-representation figure can show [i]. */
function withLevelIndexes(root: BinNode | null): BinNode | null {
  if (!root) return null
  function walk(n: BinNode | null, i: number) {
    if (!n) return
    n.heapIndex = i
    walk(n.left, 2 * i + 1)
    walk(n.right, 2 * i + 2)
  }
  walk(root, 0)
  return root
}

function mirrored(root: BinNode | null): BinNode | null {
  if (!root) return null
  const t = root.left
  root.left = mirrored(root.right)
  root.right = mirrored(t)
  return root
}

/** General tree A(B(E,F), C, D(G)) stored as left-child / right-sibling. */
function lcrs(): BinNode {
  resetIds(1)
  const A = makeNode('A')
  const B = makeNode('B')
  const C = makeNode('C')
  const D = makeNode('D')
  const E = makeNode('E')
  const F = makeNode('F')
  const G = makeNode('G')
  A.left = B // first child
  B.right = C // sibling chain
  C.right = D
  B.left = E
  E.right = F
  D.left = G
  return A
}

/* Marks and tags are keyed by node id, so the SAME tree object must be reused
   for the drawing and for the mark map — bstFromSequence generates fresh ids. */
const OPS_LCA = bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13])
const OPS_DIA = bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13])
const OPS_LVL = bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13])

/** The same three children hung the naive (wrong) way, for the contrast figure. */
function subForest(): BinNode[] {
  resetIds(50)
  const B = makeNode('B')
  B.left = makeNode('D')
  B.right = makeNode('E')
  const C = makeNode('C')
  C.right = makeNode('F')
  return [B, C]
}

function company(): BinNode {
  resetIds(1)
  const A = makeNode('A')
  const B = makeNode('B')
  const C = makeNode('C')
  const D = makeNode('D')
  const E = makeNode('E')
  const F = makeNode('F')
  A.left = B
  A.right = C
  B.left = D
  B.right = E
  C.right = F
  return A
}

function expr(): BinNode {
  resetIds(1)
  const mul = makeNode('*')
  const plus = makeNode('+')
  mul.left = plus
  mul.right = makeNode(3)
  plus.left = makeNode(1)
  plus.right = makeNode(2)
  return mul
}

function exprPlusTimes(): BinNode {
  resetIds(1)
  const plus = makeNode('+')
  const mul = makeNode('*')
  plus.left = makeNode(1)
  plus.right = mul
  mul.left = makeNode(2)
  mul.right = makeNode(3)
  return plus
}

function huffFig(items: { ch: string; freq: number }[]) {
  const b = huffmanBuild(items)
  return { root: b.root, forest: b.snaps[b.snaps.length - 1]?.forest, codes: b.codes, edgeLabels: true as const }
}

function folders(): BinNode {
  resetIds(1)
  const notes = makeNode('Notes')
  const ds = makeNode('DS')
  const os = makeNode('OS')
  notes.left = ds
  notes.right = os
  ds.left = makeNode('Trees')
  return notes
}

function lone(n: number) {
  resetIds(1)
  return makeNode(n)
}

export const THEORY_FIGURES: Record<string, Fig[]> = {
  intro: [
    {
      title: 'Drawn tree: company chart (n = 6, edges = 5)',
      caption: 'Unique root A. Every other node has one parent. No cycle. n − 1 = 5 edges.',
      root: company(),
    },
    {
      title: 'Tiny tree: insert 2, then 1, then 3',
      caption: 'Same rules at small size. Root 2, left 1, right 3.',
      root: bstFromSequence([2, 1, 3]),
    },
  ],
  sample: [
    {
      title: 'Sample company tree (used in terminology)',
      caption: 'A is root. B,C managers. D,E,F staff. n = 6, edges = 5.',
      root: company(),
    },
    {
      title: 'Perfect A–G tree (traversals)',
      caption: 'Every level full. Height 2. Pre = A B D E C F G.',
      root: buildLetterTree(),
    },
    {
      title: 'Numeric twin of A–G: insert 4,2,6,1,3,5,7',
      caption: 'Same shape, numbers instead of letters. In-order = 1 2 3 4 5 6 7.',
      root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]),
    },
  ],
  terms: [],
  why: [
    { title: 'Folders: Notes → DS / OS', caption: 'Hierarchy. Trees hangs under DS. No folder inside itself.', root: folders() },
    { title: 'Expression (1+2)*3', caption: '* is root. Left child is +. Leaves 1, 2, 3. Post-order evaluates it.', root: expr() },
    { title: 'Bushy search tree: 4,2,6,1,3,5,7', caption: 'About log n comparisons. This is why BST/AVL/B-Tree exist.', root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]) },
    { title: 'Stick (slow): 10,20,30,40', caption: 'Same 4 keys as a list. Search 40 needs 4 steps. Trees need balance.', root: bstFromSequence([10, 20, 30, 40]) },
  ],
  binary: [
    { title: 'After new_node(45) only', caption: 'Empty tree was NULL. Now 45 is the root. Both children NULL.', root: lone(45) },
    { title: 'After user inserts 45, then 15, then 79', caption: '15 < 45 left. 79 > 45 right. Built only with insert().', root: bstFromSequence([45, 15, 79]) },
    { title: 'Another insert sequence: 50, 30, 70, 20, 40', caption: 'Bushy BST. In-order: 20 30 40 50 70.', root: bstFromSequence([50, 30, 70, 20, 40]) },
    { title: 'Only-right child: 10, 20', caption: '20 is the RIGHT child. Left of 10 is still NULL — different from only-left.', root: bstFromSequence([10, 20]) },
    { title: 'Only-left child: 10, 5', caption: '5 is the LEFT child. Same two keys, different binary tree.', root: bstFromSequence([10, 5]) },
  ],
  shapes: [
    { title: 'Full (0 or 2 children): 2,1,3', caption: 'Every node has 0 or 2 children.', root: bstFromSequence([2, 1, 3]) },
    { title: 'Complete-looking: 4,2,6,1,3,5,7', caption: 'Filled left to right.', root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]) },
    { title: 'Perfect A–G', caption: 'All levels full.', root: buildLetterTree() },
    { title: 'Skewed: 10,20,30,40', caption: 'Sorted inserts → stick. Height = n−1.', root: bstFromSequence([10, 20, 30, 40]) },
    { title: 'Not full: company sample', caption: 'C has only one child F, so not a full binary tree.', root: company() },
  ],
  trav: [
    { title: 'Tree for Ex1 (insert 4,2,6,1,3,5,7)', caption: 'Pre 4 2 1 3 6 5 7. In 1 2 3 4 5 6 7. Post 1 3 2 5 7 6 4. Level 4 2 6 1 3 5 7.', root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]) },
    { title: 'Tree for Ex2 (insert 8,3,10,1,6,14,4,7,13)', caption: 'Classic numbers tree. In-order is sorted: 1 3 4 6 7 8 10 13 14.', root: bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13]) },
    { title: 'Tree for Ex3 skewed (1,2,3,4)', caption: 'Pre = 1 2 3 4. In = 1 2 3 4. Post = 4 3 2 1. Level = 1 2 3 4.', root: bstFromSequence([1, 2, 3, 4]) },
    { title: 'Tree for Ex4 letters A–G', caption: 'Pre A B D E C F G. In D B E A F C G. Post D E B F G C A. Level A B C D E F G.', root: buildLetterTree() },
    { title: 'Tree for Ex5 (50,30,70,20,40)', caption: 'Pre 50 30 20 40 70. In 20 30 40 50 70. Post 20 40 30 70 50.', root: bstFromSequence([50, 30, 70, 20, 40]) },
  ],
  bst: [
    { title: 'Lecture sequence 45,15,79,90,10,55,12,20,50', caption: 'In-order: 10 12 15 20 45 50 55 79 90.', root: bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50]) },
    { title: 'Second example 50,30,70,20,40,60,80', caption: 'Nice balanced shape.', root: bstFromSequence([50, 30, 70, 20, 40, 60, 80]) },
    { title: 'Third example 25,15,50,10,22,35,70', caption: 'Use this for search 22 and delete 15.', root: bstFromSequence([25, 15, 50, 10, 22, 35, 70]) },
    { title: 'Fourth example 100,50,150,25,75', caption: 'Root 100. Left family all < 100.', root: bstFromSequence([100, 50, 150, 25, 75]) },
    { title: 'Fifth — sorted disaster 5,10,15,20', caption: 'Still a legal BST, but a stick. That is why AVL exists.', root: bstFromSequence([5, 10, 15, 20]) },
  ],
  'bst-ops': [
    { title: 'Search 20 lives on this tree', caption: 'Path 45 → 15 → 20.', root: bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50]) },
    { title: 'After inserting 18 (user typed 18)', caption: '18 hangs left of 20.', root: bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50, 18]) },
    { title: 'Delete-leaf 12', caption: '12 was a leaf under 10.', root: bstFromSequence([45, 15, 79, 90, 10, 55, 20, 50]) },
    { title: 'One-child delete of 10 (12 rises)', caption: '10 had only right child 12. 15.left now points to 12.', root: bstDelete(bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50]), 10).root },
    { title: 'Two-child delete of 15 (successor 20)', caption: '15-box now holds 20. Shape changes only at that node.', root: bstDelete(bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50]), 15).root },
    { title: 'Search 22 on 25,15,50,10,22,35,70', caption: 'Path 25 → 15 → 22. Found.', root: bstFromSequence([25, 15, 50, 10, 22, 35, 70]) },
  ],
  avl: [
    { title: 'Plain BST after 10,20,30 (stick)', caption: 'BF of 10 is −2. Not AVL yet.', root: bstFromSequence([10, 20, 30]), showBf: true },
    { title: 'AVL after same 10,20,30', caption: 'One left rotation. Root is 20. All |BF| ≤ 1.', root: avlFromSequence([10, 20, 30]), showBf: true },
    { title: 'AVL after 30,20,10 (LL)', caption: 'One right rotation. Root is 20.', root: avlFromSequence([30, 20, 10]), showBf: true },
    { title: 'Leaf BF is always 0', caption: 'height(NULL)=−1, so leaf BF = (−1)−(−1)=0.', root: avlFromSequence([20, 10, 30]), showBf: true },
  ],
  rot: [
    { title: 'RR result: insert 10,20,30', caption: 'Left rotation at 10.', root: avlFromSequence([10, 20, 30]), showBf: true },
    { title: 'LL result: insert 30,20,10', caption: 'Right rotation at 30.', root: avlFromSequence([30, 20, 10]), showBf: true },
    { title: 'LR result: insert 30,10,20', caption: 'Left at 10, then right at 30. Root 20.', root: avlFromSequence([30, 10, 20]), showBf: true },
    { title: 'RL result: insert 10,30,20', caption: 'Right at 30, then left at 10. Root 20.', root: avlFromSequence([10, 30, 20]), showBf: true },
  ],
  'avl-ops': [
    { title: 'After 10,20,30,40,25', caption: 'Several rotations on the way. Still balanced.', root: avlFromSequence([10, 20, 30, 40, 25]), showBf: true },
    { title: 'After 50,20,70,10,30,60,80', caption: 'Already bushy — few or no rotations.', root: avlFromSequence([50, 20, 70, 10, 30, 60, 80]), showBf: true },
    { title: 'After 40,20,10,30,50,60', caption: 'Mix of LL and RR on one sequence.', root: avlFromSequence([40, 20, 10, 30, 50, 60]), showBf: true },
  ],
  multi: [
    { title: 'Order-3 B-Tree after 10,20,5', caption: 'Root split. Median 10 promoted.', btree: bTreeFromSequence([10, 20, 5], 3).root },
    { title: 'Same tree after 6,12,30,7,17', caption: 'More splits. All leaves on one level.', btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root },
    { title: 'Multiway idea as BST 20, then 50', caption: 'Binary: one key, two children. B-Tree node can hold both 20 and 50.', root: bstFromSequence([20, 50]) },
  ],
  bsplit: [
    { title: 'Ex1 order-3: 10,20,5,6,12,30,7,17', caption: 'Visualizer B-Tree tab can replay this.', btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root },
    { title: 'Ex2 order-3: 1,2,3,4,5,6,7', caption: 'Repeated overflow on the right.', btree: bTreeFromSequence([1, 2, 3, 4, 5, 6, 7], 3).root },
    { title: 'Ex3 order-3: 50,25,75,10,30', caption: 'More even fill.', btree: bTreeFromSequence([50, 25, 75, 10, 30], 3).root },
    { title: 'Ex4 order-3: 9,8,7,6,5', caption: 'Keys arriving reverse-sorted still stay a short B-Tree.', btree: bTreeFromSequence([9, 8, 7, 6, 5], 3).root },
  ],
  cx: [
    { title: 'BST stick: O(n) search — 10,20,30,40,50', caption: 'h = n−1. Worst case.', root: bstFromSequence([10, 20, 30, 40, 50]) },
    { title: 'AVL same keys: O(log n)', caption: 'Rotations keep it bushy.', root: avlFromSequence([10, 20, 30, 40, 50]), showBf: true },
    { title: 'B-Tree same 1..7', caption: 'Few fat nodes instead of a tall binary stick.', btree: bTreeFromSequence([1, 2, 3, 4, 5, 6, 7], 3).root },
  ],
  exam: [
    { title: 'Draw this BST in the answer book', caption: 'Lecture keys 45,15,79,90,10,55,12,20,50. Check: in-order is sorted.', root: bstFromSequence([45, 15, 79, 90, 10, 55, 12, 20, 50]) },
    { title: 'Draw this A–G for traversals', caption: 'Write NLR / LNR / LRN next to the figure.', root: buildLetterTree() },
    { title: 'Draw RR: before was 10-20-30 stick', caption: 'After rotation root is 20.', root: avlFromSequence([10, 20, 30]), showBf: true },
  ],
  stack: [
    {
      title: 'A–G — the tree the stack walks',
      caption: 'Preorder stack peaks at depth 3 (A-B-D). Visualizer shows every push/pop, not only A B D E C F G.',
      root: buildLetterTree(),
      edgeLabels: true,
    },
    {
      title: 'Skew 1-2-3-4 — stack becomes a stick',
      caption: 'Preorder stack depth = n. This is why “traversal is O(1) extra space” is false for recursion.',
      root: bstFromSequence([1, 2, 3, 4]),
      edgeLabels: true,
    },
  ],
  expr: [
    {
      title: '(1+2)*3 — * above +',
      caption: 'Post-order 1 2 + 3 * = postfix. Inorder without parens looks like 1+2*3, which is a DIFFERENT tree.',
      root: expr(),
      edgeLabels: true,
    },
    {
      title: '1+(2*3) — + above *',
      caption: 'Same letters, different tree, different value. Precedence lives in the shape.',
      root: exprPlusTimes(),
      edgeLabels: true,
    },
  ],
  huffman: [
    {
      title: 'Tiny Huffman A:4 B:2 C:1 D:1',
      caption: 'A is most frequent → shortest code. Leaves are letters. Internal nodes are frequency sums.',
      ...huffFig(HUFF_TINY),
    },
    {
      title: 'CLRS classic F is huge',
      caption: 'F:45 is so common it sits next to the root (often code 0). That is the whole point of Huffman.',
      ...huffFig(HUFF_CLASSIC),
    },
  ],
  heap: [
    {
      title: 'Max-heap after inserts 10,20,5,30',
      caption: 'Look at indexes on the nodes AND on the array. They are the same object. Parent of [4] is [1].',
      heap: heapFromSequence([10, 20, 5, 30], true),
    },
    {
      title: 'Sorted inserts 1..7 still complete',
      caption: 'A BST would become a stick. A heap refuses that shape — completeness is the law. 7 swims toward the root.',
      heap: heapFromSequence([1, 2, 3, 4, 5, 6, 7], true),
    },
    {
      title: 'NOT a BST: 50,30,40,10,20,35',
      caption: '40 is left of 30? Fine in a heap. In-order is not sorted. Do not search here.',
      heap: heapFromSequence([50, 30, 40, 10, 20, 35], true),
    },
  ],
  thread: [
    {
      title: 'Company tree with inorder threads',
      caption: 'Dashed curves = recycled NULLs. D→B, E→B and E→A, F→A and F→C. Solid lines stay real children.',
      root: company(),
      threads: inorderThreads(company()),
      edgeLabels: true,
    },
    {
      title: 'A–G threads (perfect tree has fewer NULLs)',
      caption: 'Only the leftmost D has a left-NULL (no predecessor). Only G has a right-NULL (no successor).',
      root: buildLetterTree(),
      threads: inorderThreads(buildLetterTree()),
    },
  ],
  rbtree: [
    {
      title: 'RB after 10,20,30',
      caption: 'Same shape as AVL RR, but the reason was red-red, not BF=−2. Root is black.',
      root: rbFromSequence([10, 20, 30]),
      showColor: true,
    },
    {
      title: 'RB after 30,20,10',
      caption: 'LL line. Recolor + rotate. Compare with AVL LL demo — pictures match, laws differ.',
      root: rbFromSequence([30, 20, 10]),
      showColor: true,
    },
    {
      title: 'RB after 10,30,20 (triangle)',
      caption: 'Uncle black + zig-zag → rotate parent first, then grandparent.',
      root: rbFromSequence([10, 30, 20]),
      showColor: true,
    },
    {
      title: 'Bigger RB: 7,3,18,10,22,8,11,26',
      caption: 'No two reds in a row. Count black nodes on any root-to-leaf path — they match.',
      root: rbFromSequence([7, 3, 18, 10, 22, 8, 11, 26]),
      showColor: true,
    },
  ],
  trie: [
    {
      title: 'cat / car / cart / dog',
      caption: 'c–a is shared. car is END and also a prefix of cart. dog is a separate branch. Dummy root holds no letter.',
      trie: trieFromWords(['cat', 'car', 'cart', 'dog']),
    },
    {
      title: 'to, tea, ted, ten, a, i, in, inn',
      caption: 'Classic exam trie. Node n of “in” is END and has child n for “inn”.',
      trie: trieFromWords(['to', 'tea', 'ted', 'ten', 'a', 'i', 'in', 'inn']),
    },
  ],
  bplus: [
    {
      title: 'B-Tree (keys live in every node)',
      caption: 'Internal node [10] really stores 10. Range scan must inorder-walk the whole tree.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root,
    },
    {
      title: 'Same keys, think B+ mentally',
      caption: 'In a B+ the real 5,6,7,10,12,17,20,30 sit only in linked leaves. The upstairs 10 is a copy/signpost.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root,
    },
  ],
  rebuild: [
    {
      title: 'Unique tree from Pre A B D E C F G + In D B E A F C G',
      caption: 'Root = first of pre = A. Inorder split at A. This is the only binary tree that fits both lists.',
      root: buildLetterTree(),
      edgeLabels: true,
    },
    {
      title: 'Numbers twin: Pre 4,2,1,3,6,5,7  In 1,2,3,4,5,6,7',
      caption: 'Same reconstruction algorithm. Check: preorder of the drawing must match the given preorder.',
      root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]),
      edgeLabels: true,
    },
  ],
  master: [
    { title: 'BST stick — search tree gone wrong', caption: 'Job was search. Shape law missing. O(n).', root: bstFromSequence([10, 20, 30, 40]) },
    { title: 'AVL same keys — search tree with shape law', caption: 'Job still search. |BF|≤1.', root: avlFromSequence([10, 20, 30, 40]), showBf: true },
    { title: 'Heap same keys — NOT for search', caption: 'Job is “best first”. Complete array. Root is max.', heap: heapFromSequence([10, 20, 30, 40], true) },
    { title: 'RB same keys — industry search tree', caption: 'Colour law instead of BF. Maps use this.', root: rbFromSequence([10, 20, 30, 40]), showColor: true },
  ],
  props: [
    {
      title: 'Fattest shape of height 2 — perfect tree',
      caption: 'Max nodes = 2^(h+1) − 1 = 7. Level 0 has 2^0 = 1, level 1 has 2, level 2 has 4.',
      root: buildLetterTree(),
    },
    {
      title: 'Thinnest shape of height 3 — the stick',
      caption: 'Min nodes for height h = h + 1 = 4. Same 4 keys, maximum possible height n − 1 = 3.',
      root: bstFromSequence([10, 20, 30, 40]),
    },
    {
      title: 'n + 1 NULL pointers (the ∅ stubs)',
      caption: '7 nodes → 14 pointer slots → 6 used for children → 8 = n + 1 are NULL. Threaded trees recycle exactly these.',
      root: buildLetterTree(),
      showNulls: true,
    },
    {
      title: 'Full tree: L = I + 1',
      caption: 'Internal = {2} so I = 1. Leaves = {1, 3} so L = 2. L = I + 1 ✓ and n = 2I + 1 = 3 is odd.',
      root: bstFromSequence([2, 1, 3]),
    },
    { title: 'Catalan C₃ = 5 · shape 1 of 5', caption: 'Root 1, right chain 2 → 3.', root: bstFromSequence([1, 2, 3]) },
    { title: 'Catalan · shape 2 of 5', caption: 'Root 1, then 3, then 2 as the left child of 3.', root: bstFromSequence([1, 3, 2]) },
    { title: 'Catalan · shape 3 of 5', caption: 'Root 2 — the only balanced one. This is the minimum height.', root: bstFromSequence([2, 1, 3]) },
    { title: 'Catalan · shape 4 of 5', caption: 'Root 3, then 1, then 2 as the right child of 1.', root: bstFromSequence([3, 1, 2]) },
    { title: 'Catalan · shape 5 of 5', caption: 'Root 3, left chain 2 → 1. Five shapes total for 3 keys.', root: bstFromSequence([3, 2, 1]) },
  ],
  repr: [
    {
      title: 'Array representation — index printed under each node',
      caption: 'Fill level by level. Left of [1] is [3], right of [2] is [6], parent of [5] is [2]. No pointers stored at all.',
      root: withLevelIndexes(buildLetterTree()),
      showIndex: true,
    },
    {
      title: 'Why arrays fail for skewed trees',
      caption: '4 real nodes, but 40 lands at index 14 — you must allocate 15 slots. Waste grows as 2^(h+1) − 1.',
      root: withLevelIndexes(bstFromSequence([10, 20, 30, 40])),
      showIndex: true,
    },
    {
      title: 'Linked representation — see the NULL sides',
      caption: 'Every ∅ is an unused pointer. Any shape fits, and insert/delete only repoint — no shifting.',
      root: bstFromSequence([8, 3, 10, 1, 6, 14]),
      showNulls: true,
    },
  ],
  general: [
    {
      title: 'LCRS binary form of A(B(E,F), C, D(G))',
      caption: 'Left = first child (A→B, B→E, D→G). Right = next sibling (B→C→D, E→F). Right-heavy is CORRECT here.',
      root: lcrs(),
      edgeLabels: true,
    },
    {
      title: 'Forest of two trees: B(D,E) and C(F)',
      caption: 'Before joining. Convert each tree, then chain the roots with right pointers.',
      forest: subForest(),
    },
    {
      title: 'After joining the forest: B→right = C',
      caption: 'That is exactly the company sample tree. Deleting root A of a tree always leaves a forest.',
      root: company(),
      edgeLabels: true,
    },
  ],
  nonrec: [
    {
      title: 'Dry-run tree: 4,2,6,1,3,5,7',
      caption: 'Iterative inorder pushes 4,2,1 then pops-and-prints. Max stack depth 3 = height + 1. Output 1..7.',
      root: bstFromSequence([4, 2, 6, 1, 3, 5, 7]),
      edgeLabels: true,
    },
    {
      title: 'Iterative preorder on A–G',
      caption: 'Push RIGHT before LEFT so the left pops first: A B D E C F G.',
      root: buildLetterTree(),
      edgeLabels: true,
    },
    {
      title: 'Worst case for any iterative walk',
      caption: 'A stick makes the explicit stack hold all n nodes. Iteration removes recursion, not the O(h) space.',
      root: bstFromSequence([1, 2, 3, 4, 5]),
    },
  ],
  ops: [
    {
      title: 'Working tree: 8,3,10,1,6,14,4,7,13',
      caption: 'height = 3, count = 9, leaves = 4 (1,4,7,13), internal = 5. Every example in this section uses it.',
      root: bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13]),
    },
    {
      title: 'LCA(1, 7) = 3 — the split node',
      caption: 'At 8 both keys are smaller → left. At 3 one is smaller and one bigger → they split → 3 is the LCA.',
      root: OPS_LCA,
      marks: byValue(OPS_LCA, {
        '8': 'path',
        '3': 'current',
        '1': 'found',
        '7': 'found',
      }),
    },
    {
      title: 'Diameter = 6 edges (7 nodes)',
      caption: 'Path 4 – 6 – 3 – 8 – 10 – 14 – 13. Through the root: height(3) + height(10) + 2 = 2 + 2 + 2.',
      root: OPS_DIA,
      marks: byValue(OPS_DIA, {
        '4': 'found',
        '6': 'path',
        '3': 'path',
        '8': 'current',
        '10': 'path',
        '14': 'path',
        '13': 'found',
      }),
    },
    {
      title: 'Before mirror: 2,1,3',
      caption: 'Inorder = 1 2 3.',
      root: bstFromSequence([2, 1, 3]),
    },
    {
      title: 'After mirror: every left ↔ right swapped',
      caption: 'Inorder = 3 2 1 — reverse sorted. A mirrored BST is no longer a BST under the normal rule.',
      root: mirrored(bstFromSequence([2, 1, 3])),
    },
    {
      title: 'Level of each node (badge = level)',
      caption: 'level_of(7) = 3 via 8 → 3 → 6 → 7. Root is level 0.',
      root: OPS_LVL,
      tags: byValue(OPS_LVL, {
        '8': 'L0',
        '3': 'L1',
        '10': 'L1',
        '1': 'L2',
        '6': 'L2',
        '14': 'L2',
        '4': 'L3',
        '7': 'L3',
        '13': 'L3',
      }),
    },
  ],
  'avl-del': [
    {
      title: 'Before: AVL of 20,10,30,25,40,35',
      caption: 'Every |BF| ≤ 1. We will delete 10 from here.',
      root: avlFromSequence([20, 10, 30, 25, 40, 35]),
      showBf: true,
    },
    {
      title: 'After deleting 10 — no rotation needed',
      caption: 'Same keys minus 10. BF(20) = −1, BF(30) = 0. Always COMPUTE the BF instead of assuming a rotation.',
      root: avlFromSequence([30, 20, 40, 25, 35]),
      showBf: true,
    },
    {
      title: 'Before: AVL of 2,1,4,3 — now delete 1',
      caption: 'Node 2 currently has BF 0. Removing the left leaf makes it right-heavy.',
      root: avlFromSequence([2, 1, 4, 3]),
      showBf: true,
    },
    {
      title: 'After deleting 1 → case R1 → double rotation',
      caption: 'BF(2) = −2 and BF(4) = +1 (opposite lean) → right at 4, then left at 2. Result root 3, all BF = 0.',
      root: avlFromSequence([3, 2, 4]),
      showBf: true,
    },
  ],
  bsearch: [
    {
      title: 'Order-3 tree for the search dry run',
      caption: 'Search 17: root [10 20] → i = 1 → descend the middle child → found inside [12 17]. Two node visits.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root,
    },
    {
      title: 'A node with 2 keys has 3 children',
      caption: 'The root holds 20 and 40, so it has three ranges: < 20, between 20 and 40, > 40. Never “left or right” — find the GAP.',
      btree: bTreeFromSequence([10, 30, 20, 40, 50], 3).root,
    },
  ],
  bdel: [
    {
      title: 'Start state (inserted 10,20,5,6,12,30)',
      caption: 'Root [10 20] with leaves [5 6], [12], [30]. All leaves on one level.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30], 3).root,
    },
    {
      title: 'After delete 6 — Case 1, leaf had a spare',
      caption: 'Leaf [5 6] → [5]. Still ≥ 1 key for order 3. Nothing moves.',
      btree: bTreeFromSequence([10, 20, 5, 12, 30], 3).root,
    },
    {
      title: 'After delete 12 — merge pulled 10 down',
      caption: 'Neither sibling could spare a key, so separator 10 came down and joined [5] → [5 10]. Root became [20].',
      btree: bTreeFromSequence([10, 30, 20, 5], 3).root,
    },
    {
      title: 'End state — root emptied, height shrank',
      caption: 'The final merge left the root with no keys, so the root is dropped. Single node [10 30], height 0.',
      btree: bTreeFromSequence([10, 30], 3).root,
    },
  ],
  sorting: [
    {
      title: 'Tree sort: BST of 5,3,8,1,4 → inorder',
      caption: 'Inorder reads 1 3 4 5 8. Sorting is a free side effect of the BST rule.',
      root: bstFromSequence([5, 3, 8, 1, 4]),
    },
    {
      title: 'Tree sort worst case: already sorted input',
      caption: '1,2,3,4,5 builds a stick → n inserts × O(n) = O(n²). Use an AVL and it is O(n log n) again.',
      root: bstFromSequence([1, 2, 3, 4, 5]),
    },
    {
      title: 'Heap sort step 0 — after build_heap on 4,10,3,5,1',
      caption: 'Started at index n/2 − 1 = 1 and heapified backwards. Array and tree are the same object.',
      heap: heapFromSequence([4, 10, 3, 5, 1], true),
    },
    {
      title: 'Heap sort: the max is always index 0',
      caption: 'Swap a[0] with the last slot, shrink by one, heapify the root. Repeat n − 1 times, in place.',
      heap: heapFromSequence([10, 5, 3, 4, 1], true),
    },
  ],
  apps: [
    {
      title: 'Compiler: expression tree for (1+2)*3',
      caption: 'Parse trees and code generation. Post-order = the stack machine that evaluates it.',
      root: expr(),
      edgeLabels: true,
    },
    {
      title: 'File system: Notes → DS / OS',
      caption: 'Hierarchy, one parent per folder. Directories are indexed with B+ Trees underneath.',
      root: folders(),
    },
    {
      title: 'Autocomplete: trie of cat / car / cart / dog',
      caption: 'Typing “ca” walks two edges and the rest of the words hang below. Cost = word length.',
      trie: trieFromWords(['cat', 'car', 'cart', 'dog']),
    },
    {
      title: 'Database index: B+ style fat nodes',
      caption: 'One node = one disk page. Millions of keys in 3–4 page reads.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root,
    },
    {
      title: 'Scheduler / Dijkstra: max-heap priority queue',
      caption: '“Give me the best pending item” is O(1) at index 0, then O(log n) to repair.',
      heap: heapFromSequence([10, 20, 5, 30], true),
    },
    {
      title: 'Compression: Huffman codes',
      caption: 'F:45 is the most frequent letter so it gets the shortest code. ZIP and JPEG headers use this.',
      ...huffFig(HUFF_CLASSIC),
    },
  ],
  solved: [
    {
      title: 'Q1 — BST of 50,30,70,20,40,60,80',
      caption: 'In-order 20 30 40 50 60 70 80 confirms the drawing before you write the traversals.',
      root: bstFromSequence([50, 30, 70, 20, 40, 60, 80]),
    },
    {
      title: 'Q1 — after deleting 30 (successor 40)',
      caption: 'Two-child case: 40 moved into the 30-box, the old leaf 40 was removed.',
      root: bstDelete(bstFromSequence([50, 30, 70, 20, 40, 60, 80]), 30).root,
    },
    {
      title: 'Q2 — final AVL of 10,20,30,40,50,25',
      caption: 'Three rotations: RR at 10, RR at 30, then an RL double at 20. Root ends at 30, every |BF| ≤ 1.',
      root: avlFromSequence([10, 20, 30, 40, 50, 25]),
      showBf: true,
    },
    {
      title: 'Q3 — reconstructed from Pre + In',
      caption: 'Pre A B D E C F G with In D B E A F C G gives exactly one tree. Verify by re-reading the preorder.',
      root: buildLetterTree(),
      edgeLabels: true,
    },
    {
      title: 'Q4 — order-3 B-Tree after all 8 keys',
      caption: 'Root split twice, so the height reached 2. All leaves on one level, ≤ 2 keys per node.',
      btree: bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root,
    },
    {
      title: 'Q5 — Huffman tree for A5 B9 C12 D13 E16 F45',
      caption: 'Average code length 2.24 bits versus 3 bits fixed-length — about 25 % smaller.',
      ...huffFig(HUFF_CLASSIC),
    },
    {
      title: 'Q6 — max-heap after 10,20,5,30',
      caption: 'Array [30, 20, 5, 10]. 30 swam from index 3 → 1 → 0. Extract-max then leaves [20, 10, 5].',
      heap: heapFromSequence([10, 20, 5, 30], true),
    },
    {
      title: 'Q9 — general tree converted with LCRS',
      caption: 'A(B(E,F), C, D(G)) stored in binary form. Left = first child, right = next sibling.',
      root: lcrs(),
      edgeLabels: true,
    },
  ],
}

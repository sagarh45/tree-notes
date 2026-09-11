import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { bstFromSequence } from '../lib/bst'
import { avlFromSequence } from '../lib/avl'
import { bTreeFromSequence } from '../lib/btree'
import { heapFromSequence } from '../lib/heap'
import { buildLetterTree, withBalanceFactors } from '../lib/binaryTree'

type Viva = { q: string; a: string }

const VIVA: Viva[] = [
  {
    q: 'Define a tree in one sentence.',
    a: 'A tree is a non-linear hierarchical data structure with one unique root, in which every other node has exactly one parent and there are no cycles — so exactly one path exists from the root to any node.',
  },
  {
    q: 'How many edges does a tree with n nodes have, and why?',
    a: 'Exactly n − 1. Every node except the root contributes exactly one edge, the one joining it to its parent.',
  },
  {
    q: 'What is the difference between height and depth?',
    a: 'Depth of a node is the number of edges from the root down to it (root has depth 0). Height of a node is the number of edges on the longest path from it down to a leaf (a leaf has height 0). Height of the tree = height of the root = maximum depth.',
  },
  {
    q: 'Why is the in-order traversal of a BST sorted?',
    a: 'In-order visits the entire left subtree, then the node, then the entire right subtree. The BST rule says the whole left subtree is smaller and the whole right subtree is larger, so keys come out in increasing order. This is the standard correctness check after drawing any BST.',
  },
  {
    q: 'Which two traversals uniquely determine a binary tree?',
    a: 'Inorder plus preorder, or inorder plus postorder. Inorder gives the left/right split and the other gives the root. Preorder plus postorder is NOT enough unless the tree is full.',
  },
  {
    q: 'Why is copy a pre-order job and delete a post-order job?',
    a: 'To copy, you must create the parent before you can attach children to it, so the node is processed first (pre-order). To delete, you must free the children before freeing the parent, otherwise you lose the pointers to them, so the node is processed last (post-order).',
  },
  {
    q: 'Define balance factor and state its legal values.',
    a: 'BF(node) = height(left subtree) − height(right subtree), with height(NULL) = −1. Legal values in an AVL tree are −1, 0 and +1. A value of +2 or −2 means the node is unbalanced and a rotation is required.',
  },
  {
    q: 'How do you decide between a single and a double rotation?',
    a: 'If the two steps go the same way (left-left or right-right) it is a single rotation. If they zig-zag (left-right or right-left) it is a double rotation: fix the child first, then the unbalanced node.',
  },
  {
    q: 'How many rotations can an AVL insert and an AVL delete need?',
    a: 'An insert needs at most one rotation (single or double), because that rotation restores the original subtree height. A delete can need a rotation at every ancestor, so up to O(log n) rotations, because a rotation after a delete can shrink the subtree height.',
  },
  {
    q: 'Is a heap a binary search tree?',
    a: 'No. A heap only relates a parent to its children (parent ≥ both children in a max-heap); it says nothing about left versus right. The in-order traversal of a heap is not sorted and searching for an arbitrary key is O(n).',
  },
  {
    q: 'Why can a heap be stored in a plain array with no pointers?',
    a: 'Because a heap is always a complete binary tree, so there are no holes. Position encodes the structure: for index i (0-based) the left child is 2i+1, the right child is 2i+2 and the parent is ⌊(i−1)/2⌋.',
  },
  {
    q: 'Why is build-heap O(n) and not O(n log n)?',
    a: 'It starts at the last internal node and heapifies upward. Half the nodes are leaves and do no work, a quarter sink at most one level, an eighth at most two, and so on. The sum converges to about 2n. Building by n repeated insertions would be O(n log n).',
  },
  {
    q: 'In a B-Tree of order m, how many keys and children can a node hold?',
    a: 'At most m − 1 keys and m children. Every node except the root and the leaves must have at least ⌈m/2⌉ children, so at least ⌈m/2⌉ − 1 keys. A non-leaf root needs at least 2 children. All leaves lie on the same level.',
  },
  {
    q: 'When does a B-Tree grow taller, and when does it get shorter?',
    a: 'It grows only when the root splits, because the median is pushed into a brand-new root. It shrinks only when a merge empties the root and the root is dropped. Both happen at the top, which is exactly why all leaves always stay on one level.',
  },
  {
    q: 'Deletion in a B-Tree: what is the correct order of attempts?',
    a: 'First borrow from an immediate sibling that has a spare key, moving the sibling key up through the parent and the parent separator down. Only if no sibling can spare a key do you merge, pulling the separator down and joining the two nodes — and then re-check the parent for underflow.',
  },
  {
    q: 'What is the main difference between a B-Tree and a B+ Tree?',
    a: 'In a B+ Tree all records live in the leaves, internal nodes only hold copies of keys as signposts, and the leaves are linked left to right. That makes range queries a sequential walk of leaf pages instead of a tree traversal, and it increases fanout. Databases and filesystems use B+.',
  },
  {
    q: 'Why does industry prefer Red-Black trees over AVL trees?',
    a: 'AVL is more strictly balanced (|BF| ≤ 1) so lookups are marginally faster, but updates need more rotations. Red-Black guarantees height ≤ 2 log₂(n+1) with at most two rotations per insert, so insert-heavy workloads are cheaper. C++ std::map, Java TreeMap and the Linux CFS scheduler use Red-Black.',
  },
  {
    q: 'What problem does a threaded binary tree solve?',
    a: 'A binary tree with n nodes wastes n + 1 NULL pointers. A threaded tree reuses an empty left pointer as a link to the in-order predecessor and an empty right pointer as a link to the in-order successor, with a tag bit to tell a thread from a real child. In-order traversal then needs no recursion and no stack.',
  },
  {
    q: 'What makes a Huffman code decodable without separators?',
    a: 'It is prefix-free: no code word is a prefix of another, because every letter sits at a leaf. While reading bits you can only be inside one code at a time, so the moment you hit a leaf you have a unique letter.',
  },
  {
    q: 'What is the advantage of a trie over a BST of strings?',
    a: 'A trie compares one character per edge, so search and insert cost O(L) where L is the length of the query word, independent of how many words are stored. A BST compares whole strings, giving O(L log n). Tries also answer prefix questions, which is what autocomplete needs.',
  },
  {
    q: 'How do you convert a general tree to a binary tree?',
    a: 'Left-child right-sibling: the left pointer of a node points to its first child, and the right pointer points to its next sibling. A forest is converted by chaining the converted roots with right pointers. Pre-order is preserved and the general-tree post-order becomes the binary tree in-order.',
  },
  {
    q: 'How many distinct binary search trees can be made from n distinct keys?',
    a: 'The nth Catalan number, C(n) = (2n)! / ((n+1)! · n!). For n = 3 it is 5, for n = 4 it is 14, for n = 5 it is 42.',
  },
]

const FORMULAS: { q: string; f: string; ex: string }[] = [
  { q: 'Edges in a tree of n nodes', f: 'n − 1', ex: 'n = 6 → 5 edges' },
  { q: 'NULL child pointers', f: 'n + 1', ex: 'n = 7 → 8 NULL slots' },
  { q: 'Max nodes at level l', f: '2ˡ', ex: 'level 3 → 8 nodes' },
  { q: 'Max nodes in a tree of height h', f: '2ʰ⁺¹ − 1', ex: 'h = 3 → 15 nodes' },
  { q: 'Min nodes for height h', f: 'h + 1', ex: 'h = 4 → 5 nodes (a stick)' },
  { q: 'Min height for n nodes', f: '⌈log₂(n+1)⌉ − 1', ex: 'n = 15 → height 3' },
  { q: 'Max height for n nodes', f: 'n − 1', ex: 'n = 15 → height 14' },
  { q: 'Full binary tree: leaves vs internal', f: 'L = I + 1, n = 2I + 1', ex: 'I = 7 → L = 8, n = 15' },
  { q: 'Complete tree height', f: '⌊log₂ n⌋', ex: 'n = 10 → height 3' },
  { q: 'Complete tree leaves', f: '⌈n/2⌉', ex: 'n = 10 → 5 leaves' },
  { q: 'Distinct binary trees / BSTs with n nodes', f: 'Cₙ = (2n)! / ((n+1)! n!)', ex: 'n = 4 → 14' },
  { q: 'Heap array: children of index i', f: '2i + 1 and 2i + 2', ex: 'i = 3 → 7 and 8' },
  { q: 'Heap array: parent of index i', f: '⌊(i − 1) / 2⌋', ex: 'i = 9 → 4' },
  { q: 'Build-heap starting index', f: '⌊n/2⌋ − 1', ex: 'n = 10 → start at 4' },
  { q: 'B-Tree of order m: keys per node', f: '⌈m/2⌉ − 1 … m − 1', ex: 'm = 3 → 1 to 2 keys' },
  { q: 'B-Tree of order m: children per node', f: '⌈m/2⌉ … m', ex: 'm = 5 → 3 to 5 children' },
  { q: 'B-Tree height bound', f: 'O(log⌈m/2⌉ n)', ex: 'm = 100, n = 10⁶ → ~3 levels' },
  { q: 'Red-Black height bound', f: '≤ 2 log₂(n + 1)', ex: 'n = 1023 → height ≤ 20' },
  { q: 'Huffman average code length', f: 'Σ freq(c) × depth(c) / Σ freq(c)', ex: 'CLRS set → 2.24 bits' },
  { q: 'Trie search cost', f: 'O(L), L = word length', ex: '“cart” → 4 steps' },
]

const CX: { model: string; search: string; insert: string; del: string; space: string; note: string }[] = [
  { model: 'Binary tree (any traversal)', search: 'Θ(n)', insert: '—', del: '—', space: 'O(h) stack', note: 'Must touch every node' },
  { model: 'BST (bushy)', search: 'O(log n)', insert: 'O(log n)', del: 'O(log n)', space: 'O(n)', note: 'Average case' },
  { model: 'BST (skewed)', search: 'O(n)', insert: 'O(n)', del: 'O(n)', space: 'O(n)', note: 'Sorted input is the killer' },
  { model: 'AVL', search: 'O(log n)', insert: 'O(log n)', del: 'O(log n)', space: 'O(n)', note: 'Insert ≤ 1 rotation, delete ≤ O(log n)' },
  { model: 'Red-Black', search: 'O(log n)', insert: 'O(log n)', del: 'O(log n)', space: 'O(n)', note: '≤ 2 rotations per insert' },
  { model: 'Heap', search: 'O(n)', insert: 'O(log n)', del: 'O(log n)', space: 'O(n) array', note: 'peek-max is O(1); not a search tree' },
  { model: 'B-Tree / B+ Tree', search: 'O(log⌈m/2⌉ n)', insert: 'O(log n)', del: 'O(log n)', space: 'O(n)', note: 'Node visits = disk reads' },
  { model: 'Trie', search: 'O(L)', insert: 'O(L)', del: 'O(L)', space: 'O(alphabet × nodes)', note: 'Independent of dictionary size' },
  { model: 'Heap sort', search: '—', insert: '—', del: '—', space: 'O(1)', note: 'Always Θ(n log n), in place, not stable' },
  { model: 'Tree sort', search: '—', insert: '—', del: '—', space: 'O(n)', note: 'O(n log n) average, O(n²) on sorted input' },
]

const TRAVERSALS: { name: string; order: string; ag: string; use: string }[] = [
  { name: 'Pre-order', order: 'Node → Left → Right', ag: 'A B D E C F G', use: 'Copy a tree, prefix notation, save/serialize' },
  { name: 'In-order', order: 'Left → Node → Right', ag: 'D B E A F C G', use: 'Sorted output of a BST, infix notation' },
  { name: 'Post-order', order: 'Left → Right → Node', ag: 'D E B F G C A', use: 'Free a tree, evaluate an expression, postfix' },
  { name: 'Level-order', order: 'Floor by floor (queue)', ag: 'A B C D E F G', use: 'BFS, print by level, find the width' },
]

const CHECKLIST = [
  'Write your convention first: root at level 0, height in edges, height(leaf) = 0, height(NULL) = −1.',
  'After drawing any BST, read the in-order out loud. If it is not sorted, the drawing is wrong.',
  'In BST delete, name the case out loud: leaf / one child / two children with the in-order successor.',
  'In AVL, write the balance factor next to every node on the insertion path before choosing a rotation.',
  'Same direction twice → single rotation. Zig-zag → double rotation: child first, then the unbalanced node.',
  'After an AVL delete-rotation, keep walking up. More ancestors may still be unbalanced.',
  'In a B-Tree, circle the median before you split, and try borrow before merge when you delete.',
  'A heap is not a search tree. Its in-order is not sorted, and extract-max steals the last leaf.',
  'Huffman: internal nodes are frequency sums, only leaves are letters, and the code is the root-to-leaf path.',
  'A trie marks the end of a word with a flag, not by being a leaf (car is a prefix of cart).',
  'For the reconstruction question you always need in-order as one of the two traversals.',
  'Label every diagram: root, leaves, the node you are operating on, and the final answer.',
]

export function RevisionPage() {
  const [open, setOpen] = useState<string | null>(VIVA[0].q)

  return (
    <div>
      <div className="card hero-band">
        <div className="hero-kicker">LAST-NIGHT REVISION</div>
        <h2>One page that holds the whole unit</h2>
        <p className="muted">
          Every formula, every complexity, every traversal, the four rotations, the model-picking table, {VIVA.length}{' '}
          viva questions with full answers, and a pre-submission checklist. If you only have an hour left, read this
          page and replay four visualizer packs.
        </p>
        <div className="stat-strip">
          <div className="stat">
            <b>{FORMULAS.length}</b>
            <span>formulas</span>
          </div>
          <div className="stat">
            <b>{CX.length}</b>
            <span>complexity rows</span>
          </div>
          <div className="stat">
            <b>{VIVA.length}</b>
            <span>viva Q&amp;A</span>
          </div>
          <div className="stat">
            <b>{CHECKLIST.length}</b>
            <span>checklist rules</span>
          </div>
        </div>
        <div className="row hero-actions">
          <Link className="btn play" to="/theory">
            Full theory →
          </Link>
          <Link className="btn enq" to="/lab">
            Visualizer →
          </Link>
          <Link className="btn gray" to="/practice">
            Practice questions →
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>1. Formula sheet — learn the middle column, verify with the right column</h3>
        <table className="table">
          <thead>
            <tr>
              <th>What they ask</th>
              <th>Formula</th>
              <th>Quick check</th>
            </tr>
          </thead>
          <tbody>
            {FORMULAS.map((f) => (
              <tr key={f.q}>
                <td>{f.q}</td>
                <td>
                  <b>{f.f}</b>
                </td>
                <td className="muted">{f.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginBottom: 0 }}>
          Conventions used above: root at level 0, height counted in edges, height of a leaf is 0 and height of NULL is
          −1. If your textbook starts levels at 1, shift the exponents by one and say so in the first line of your
          answer.
        </p>
      </div>

      <div className="card">
        <h3>2. The four traversals on the same tree</h3>
        <div className="grid-2">
          <div>
            <BinaryTreeSvg root={buildLetterTree()} edgeLabels />
            <p className="muted">
              The perfect A–G tree, height 2, 7 nodes. Every output in the table is read off this one picture.
            </p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Traversal</th>
                <th>Order</th>
                <th>On A–G</th>
                <th>Used for</th>
              </tr>
            </thead>
            <tbody>
              {TRAVERSALS.map((t) => (
                <tr key={t.name}>
                  <td>
                    <b>{t.name}</b>
                  </td>
                  <td>{t.order}</td>
                  <td>
                    <code>{t.ag}</code>
                  </td>
                  <td className="muted">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>3. Complexity table — the one they ask you to reproduce</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Search</th>
              <th>Insert</th>
              <th>Delete</th>
              <th>Space</th>
              <th>Remember</th>
            </tr>
          </thead>
          <tbody>
            {CX.map((r) => (
              <tr key={r.model}>
                <td>
                  <b>{r.model}</b>
                </td>
                <td>{r.search}</td>
                <td>{r.insert}</td>
                <td>{r.del}</td>
                <td>{r.space}</td>
                <td className="muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>4. The four rotations, drawn</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Same letters (LL, RR) means one rotation. Different letters (LR, RL) means two: fix the child first, then the
          unbalanced node. The in-order never changes — only the heights do.
        </p>
        <div className="ex-row">
          {(
            [
              ['LL — insert 30, 20, 10', [30, 20, 10], 'One RIGHT rotation at 30. Root becomes 20.'],
              ['RR — insert 10, 20, 30', [10, 20, 30], 'One LEFT rotation at 10. Root becomes 20.'],
              ['LR — insert 30, 10, 20', [30, 10, 20], 'Left at 10, then right at 30. Root becomes 20.'],
              ['RL — insert 10, 30, 20', [10, 30, 20], 'Right at 30, then left at 10. Root becomes 20.'],
            ] as [string, number[], string][]
          ).map(([label, seq, note]) => (
            <figure className="ex-viz" key={label}>
              <figcaption className="fig-title">{label}</figcaption>
              <BinaryTreeSvg root={withBalanceFactors(avlFromSequence(seq))} showBf compact />
              <p className="muted">{note}</p>
            </figure>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>5. Four models, four laws — pick one by the job</h3>
        <div className="ex-row">
          <figure className="ex-viz">
            <figcaption className="fig-title">BST — sorted inserts are the trap</figcaption>
            <BinaryTreeSvg root={bstFromSequence([10, 20, 30, 40])} compact />
            <p className="muted">
              Law: whole left &lt; node &lt; whole right. Job: “where is key k?”. Killer fact: sorted input gives a
              stick and O(n).
            </p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">AVL — same keys, refuses the stick</figcaption>
            <BinaryTreeSvg root={withBalanceFactors(avlFromSequence([10, 20, 30, 40]))} showBf compact />
            <p className="muted">
              Law: BST plus |BF| ≤ 1. Job: guaranteed O(log n) search. Killer fact: insert needs at most one rotation.
            </p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">Heap — the array IS the tree</figcaption>
            <HeapDualViz arr={heapFromSequence([10, 20, 30, 40], true)} compact />
            <p className="muted">
              Law: complete shape plus parent ≥ children. Job: “what is the best?”. Killer fact: in-order is not
              sorted, so never search here.
            </p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">B-Tree — fat nodes, one level of leaves</figcaption>
            <BTreeSvg root={bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root} compact />
            <p className="muted">
              Law: multiway, split at the median, all leaves on one level. Job: search when one step costs a disk read.
            </p>
          </figure>
        </div>
      </div>

      <div className="card">
        <h3>6. Viva and oral questions — {VIVA.length} answers, written the way you should say them</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Click a question to open the answer. Try saying it out loud before you read it.
        </p>
        <div className="qa-list">
          {VIVA.map((v) => (
            <div className={`qa${open === v.q ? ' on' : ''}`} key={v.q}>
              <button type="button" onClick={() => setOpen(open === v.q ? null : v.q)}>
                <span className="qa-mark">Q</span>
                {v.q}
                <span className="qa-chev">{open === v.q ? '−' : '+'}</span>
              </button>
              {open === v.q ? (
                <div className="qa-ans">
                  <span className="qa-mark ans">A</span>
                  <p>{v.a}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>7. Before you hand the paper in — {CHECKLIST.length} checks</h3>
        <ol className="check-list">
          {CHECKLIST.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </div>

      <div className="card tip-card">
        <b>If you have 60 minutes left:</b> read the formula sheet (section 1), redraw the four rotations from memory
        (section 4), solve the ten problems in Theory section 36 on paper, then answer the first ten viva questions out
        loud. That covers the highest-frequency marks in this unit.
      </div>
    </div>
  )
}

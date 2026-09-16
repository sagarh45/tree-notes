import type { Chapter } from './types'

export const CH13_EXAM: Chapter = {
  id: 'ch13',
  number: 13,
  title: 'Exam block — applications, solved problems, master map',
  syllabus: 'Applications · solved questions · which tree for which job · complexity tattoo',
  emoji: '📝',
  topics: [
    {
      id: 'exam-apps',
      title: 'Applications of trees',
      tagline: 'Hierarchy, or throw away half the search space per step.',
      definition:
        'Trees are used wherever data is <b>hierarchical</b> (one-to-many) or searching must be <b>logarithmic</b>. Hierarchy: file systems, DOM, process trees. Searching: BST / AVL / Red-Black in maps, B+ in databases. Priority: heaps. Encoding and prefixes: Huffman and tries.',
      simple: `<p>Do not write a bare list of words. Name the <b>job</b> and the <b>law</b>.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'File system / company chart — a general hierarchy',
          spec: 'C:(Windows(System32,Temp),Users(Sagar,Guest))',
        },
        {
          kind: 'trie',
          title: 'Autocomplete is a trie',
          words: ['app', 'apple', 'apply', 'apt'],
        },
        {
          kind: 'heap',
          title: 'Scheduler / Dijkstra — a heap of priorities',
          seq: [4, 9, 3, 7, 1],
        },
      ],
      example: {
        title: 'exam-ready tables',
        html: `
<h4>Systems and software</h4>
<table class="table"><thead><tr><th>Where</th><th>Which tree</th><th>Why</th></tr></thead><tbody>
<tr><td>File system</td><td>General tree / B+</td><td>Folders nest; B+ indexes the directory</td></tr>
<tr><td>Database index</td><td><b>B+ Tree</b></td><td>Fat nodes = fewer disk reads; linked leaves = range queries</td></tr>
<tr><td>Compiler parsing</td><td>Expression / parse tree</td><td>Precedence lives in the shape; post-order = code</td></tr>
<tr><td>HTML / XML / JSON</td><td>DOM tree</td><td>Tags nest, never overlap</td></tr>
<tr><td>std::map, TreeMap, Linux CFS</td><td><b>Red-Black</b></td><td>O(log n) with few rotations</td></tr>
<tr><td>OS scheduler</td><td><b>Heap</b></td><td>“Give me the best” in O(1)</td></tr>
</tbody></table>
<h4>Algorithms that are secretly trees</h4>
<table class="table"><thead><tr><th>Algorithm</th><th>Tree</th><th>Role</th></tr></thead><tbody>
<tr><td>Heap sort</td><td>Max-heap</td><td>Extract the maximum n times, in place</td></tr>
<tr><td>Dijkstra / Prim</td><td>Min-heap</td><td>Always expand the cheapest pending item</td></tr>
<tr><td>Huffman (ZIP / JPEG)</td><td>Huffman tree</td><td>Short codes for frequent symbols</td></tr>
<tr><td>Autocomplete / spell-check</td><td>Trie</td><td>Cost = word length</td></tr>
<tr><td>Game playing</td><td>Game tree + minimax</td><td>Each level is one player’s move</td></tr>
</tbody></table>
<p><b>4-line answer to write:</b> “Trees are used wherever data is hierarchical or searching must be logarithmic. Hierarchy: file systems, DOM, process trees. Searching: BST / AVL / Red-Black in maps, B+ in databases. Priority: heaps. Encoding and prefixes: Huffman and tries.”</p>`,
      },
      tips: ['Everyday examples if they ask: family tree, table of contents, tournament bracket, website menu, (1+2)×3.'],
    },

    {
      id: 'exam-solved',
      title: 'Solved exam problems',
      tagline: 'The ten patterns that keep repeating. Cover the answer, then compare.',
      definition:
        'These are the question <b>patterns</b> that repeat: construct a BST and traverse it, AVL with every rotation, rebuild from two traversals, B-Tree splits, Huffman codes, heap insert/extract, full-tree counting, Catalan numbers, LCRS conversion, iterative in-order.',
      simple: `<p>Read the question, cover the answer, solve it on paper, then look. Every picture below is drawn by the same engine the visualizer uses.</p>`,
      diagrams: [
        {
          kind: 'tree-steps',
          title: 'Q1 — construct BST 50, 30, 70, 20, 40, 60, 80',
          seq: [50, 30, 70, 20, 40, 60, 80],
        },
        {
          kind: 'traversal',
          title: 'Q1 — in-order of that BST (must be sorted)',
          seq: [50, 30, 70, 20, 40, 60, 80],
          order: 'inorder',
        },
        {
          kind: 'tree',
          title: 'Q1 — after delete 30 (two children → successor 40)',
          spec: '50(40(20,),70(60,80))',
          marks: { '40': 'new' },
          caption: 'Case 3: copy 40 into the 30-box, then delete the old leaf 40.',
        },
        {
          kind: 'avl-steps',
          title: 'Q2 — AVL insert 10, 20, 30, 40, 50, 25 (every rotation)',
          seq: [10, 20, 30, 40, 50, 25],
        },
        {
          kind: 'tree',
          title: 'Q3 — rebuild from Pre A B D E C F G, In D B E A F C G',
          spec: 'A(B(D,E),C(F,G))',
          caption: 'Pre gives the root (A). In splits left {D B E} and right {F C G}. Repeat.',
        },
        {
          kind: 'btree-steps',
          title: 'Q4 — B-Tree order 3: 10, 20, 5, 6, 12, 30, 7, 17',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
        },
        {
          kind: 'huffman',
          title: 'Q5 — Huffman A:5 B:9 C:12 D:13 E:16 F:45',
          items: [
            { ch: 'A', freq: 5 },
            { ch: 'B', freq: 9 },
            { ch: 'C', freq: 12 },
            { ch: 'D', freq: 13 },
            { ch: 'E', freq: 16 },
            { ch: 'F', freq: 45 },
          ],
          steps: true,
        },
        {
          kind: 'heap',
          title: 'Q6 — max-heap after 10, 20, 5, 30',
          seq: [10, 20, 5, 30],
          caption: 'Array [30, 20, 5, 10]. Extract-max → [20, 10, 5].',
        },
        {
          kind: 'tree',
          title: 'Q9 — LCRS of A(B,C,D) with B(E,F), D(G)',
          spec: 'A(B(E(,F),C(,D(G,))),)',
          edgeLabels: true,
        },
      ],
      example: {
        title: 'short written answers for the number questions',
        html: `
<p><b>Q7 (3 marks).</b> A full binary tree has 20 internal nodes. Leaves L = I + 1 = <b>21</b>. Total n = 41. Minimum height (edges, root at 0) = ⌈log₂(41+1)⌉ − 1 = 6 − 1 = <b>5</b>.</p>
<p><b>Q8 (3 marks).</b> Distinct BSTs on 1,2,3,4 = Catalan C₄ = (8)! / (5! · 4!) = <b>14</b>. By root: 1 → 5, 2 → 2, 3 → 2, 4 → 5.</p>
<p><b>Q10 (5 marks).</b> Non-recursive in-order: explicit stack, dive left, pop-and-print, then go right. On 4(2(1,3),6(5,7)) the output is 1 2 3 4 5 6 7 and the max stack depth is 3. Full dry run is in the Traversals chapter.</p>
<p><b>Q1 traversals:</b> Pre 50 30 20 40 70 60 80 · In 20 30 40 50 60 70 80 · Post 20 40 30 60 80 70 50 · Level 50 30 70 20 40 60 80.</p>
<p><b>Q5 codes:</b> F=0, C=100, D=101, A=1100, B=1101, E=111. Average length 2.24 bits.</p>`,
      },
      tips: [
        'After every BST / AVL drawing, read the in-order out loud. If it is not sorted, stop and fix the picture.',
        'For AVL, write BF on every node on the insertion path, name the case (LL/RR/LR/RL), then draw before and after.',
      ],
    },

    {
      id: 'exam-map',
      title: 'Master map — which tree for which job',
      tagline: 'The last page you revise the night before.',
      definition:
        'Every model is the same skeleton (nodes + edges, no cycles) with a <b>different law</b>. Pick the law that matches the job.',
      simple: `<p>BST family answers “where is key k?”. Heap answers “what is the best?”. Huffman answers “how do I name frequent symbols cheaply?”. Trie answers “what continues this prefix?”. B-Tree answers “how do I search when one step costs a disk jump?”.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Search — BST / AVL',
          seq: [8, 3, 10, 1, 6, 14, 4, 7, 13],
        },
        {
          kind: 'heap',
          title: 'Best-first — heap',
          seq: [10, 20, 5, 30, 15],
        },
        {
          kind: 'btree',
          title: 'Disk search — B-Tree',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
        },
        {
          kind: 'trie',
          title: 'Prefix — trie',
          words: ['cat', 'car', 'cart', 'dog'],
        },
      ],
      example: {
        title: 'one table to tattoo',
        html: `
<table class="table"><thead><tr><th>Job</th><th>Model</th><th>Why</th><th>Killer fact</th></tr></thead><tbody>
<tr><td>Search a key in RAM, simple code</td><td>BST</td><td>One comparison throws a side away</td><td>Sorted inserts → stick → O(n)</td></tr>
<tr><td>Guaranteed log n, many searches</td><td>AVL</td><td>Strict |BF| ≤ 1</td><td>Insert ≤ 1 rotation (single or double)</td></tr>
<tr><td>Guaranteed log n, many updates</td><td>Red-Black</td><td>Fewer rotations than AVL</td><td>std::map, TreeMap</td></tr>
<tr><td>“Give me the maximum”</td><td>Heap</td><td>Root is the answer in O(1)</td><td>Array, not a search tree</td></tr>
<tr><td>Database / disk pages</td><td>B-Tree / B+</td><td>Fat nodes = fewer I/O</td><td>B+ leaves are linked</td></tr>
<tr><td>Compress text</td><td>Huffman</td><td>Short codes for frequent letters</td><td>Prefix-free</td></tr>
<tr><td>Autocomplete</td><td>Trie</td><td>Time = word length</td><td>END flag ≠ leaf</td></tr>
<tr><td>Evaluate (1+2)*3</td><td>Expression tree</td><td>Post-order is the stack machine</td><td>Operators inside</td></tr>
<tr><td>In-order with no stack</td><td>Threaded tree</td><td>NULLs become successor links</td><td>Need a tag bit</td></tr>
</tbody></table>
<h4>Complexity tattoo</h4>
<table class="table"><thead><tr><th>Model</th><th>Search</th><th>Insert</th><th>Extra</th></tr></thead><tbody>
<tr><td>BST</td><td>O(h)</td><td>O(h)</td><td>h = n if skewed</td></tr>
<tr><td>AVL / RB</td><td>O(log n)</td><td>O(log n)</td><td>RB taller, fewer rotates</td></tr>
<tr><td>Heap</td><td>O(n) arbitrary</td><td>O(log n)</td><td>peek max O(1)</td></tr>
<tr><td>B-Tree</td><td>O(log<sub>m</sub> n)</td><td>O(log<sub>m</sub> n)</td><td>m huge on disk</td></tr>
<tr><td>Trie</td><td>O(L)</td><td>O(L)</td><td>space: alphabet × nodes</td></tr>
<tr><td>Huffman build</td><td>—</td><td>O(n log n)</td><td>n = alphabet size</td></tr>
<tr><td>Any full walk</td><td>Θ(n)</td><td>—</td><td>stack O(h) or queue O(w)</td></tr>
</tbody></table>`,
      },
      tips: [
        'How to write any model in the answer book: one-sentence definition, one drawn example, the algorithm as numbered steps, then the C function.',
        'Open the Visualizer after this page. For each row of the table, run one example pack until the picture in your head matches the screen.',
      ],
    },
  ],
}

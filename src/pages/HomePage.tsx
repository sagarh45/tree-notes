import { Link } from 'react-router-dom'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { TrieSvg } from '../components/viz/TrieSvg'
import { bstFromSequence } from '../lib/bst'
import { avlFromSequence } from '../lib/avl'
import { bTreeFromSequence } from '../lib/btree'
import { heapFromSequence } from '../lib/heap'
import { trieFromWords } from '../lib/trie'
import { withBalanceFactors } from '../lib/binaryTree'
import { THEORY_SECTIONS } from '../data/theory'
import { THEORY_FIGURES } from '../data/figures'
import { TERM_CARDS } from '../data/terms'
import { PROGRAMS } from '../data/programs'

const figureCount =
  Object.values(THEORY_FIGURES).reduce((n, list) => n + list.length, 0) + TERM_CARDS.length

const COVERAGE: { group: string; items: string[] }[] = [
  {
    group: 'Foundation',
    items: [
      'Definition, terminology (17 words, each with its own drawing)',
      'Why trees exist · real-life hierarchies',
      'Binary tree, node structure, full C new_node / insert',
      'Full · complete · perfect · skewed shapes',
      'Properties and formulas (levels, heights, Catalan, NULL count)',
      'Array (sequential) vs linked representation',
      'General tree and forest → binary tree (left-child right-sibling)',
    ],
  },
  {
    group: 'Core models',
    items: [
      'Four traversals, recursive, with call-stack playback',
      'Non-recursive traversals with an explicit stack (all three)',
      'Operations: height, count, leaves, mirror, copy, identical, LCA, diameter, level, paths',
      'BST: search, insert, delete (all three cases)',
      'AVL: balance factor, LL / RR / LR / RL rotations, insert',
      'AVL deletion with the R0 / R1 / R−1 case table',
      'Multiway trees and B-Tree of order m',
      'B-Tree insert with median split, search, and delete (borrow then merge)',
      'Complexity of every operation',
    ],
  },
  {
    group: 'Advanced models',
    items: [
      'The recursion stack, made visible',
      'Expression trees and the three notations',
      'Huffman coding, prefix-free codes, average code length',
      'Heap: the array IS the tree, swim and sink',
      'Heap sort, build-heap in O(n), tree sort, priority queues',
      'Threaded binary trees — recycling the NULL pointers',
      'Red-Black trees: five properties, three insert cases',
      'Tries for prefix search and autocomplete',
      'B+ Trees and why databases use them',
      'Reconstruction from two traversals',
    ],
  },
  {
    group: 'Exam block',
    items: [
      'How to write each model in the answer book',
      'Applications: systems, algorithms, everyday examples',
      '10 solved problems with full step-by-step working',
      'Master map: which tree for which job',
      'Formula sheet, complexity table, 22 viva answers, final checklist',
    ],
  },
]

export function HomePage() {
  return (
    <div>
      <div className="card hero-band hero-home">
        <div>
          <div className="hero-kicker">DATA STRUCTURES · UNIT IV</div>
          <h2>Trees — the complete package, and every model is drawn</h2>
          <p className="muted">
            Not a list of definitions. Every topic gets a proper definition, a plain-English description, a drawn
            diagram, a worked numeric example, a full C function and a live visualizer you can step through. Foundation
            to advanced, plus solved exam problems and a one-page revision sheet.
          </p>
          <div className="stat-strip">
            <div className="stat">
              <b>{THEORY_SECTIONS.length}</b>
              <span>theory sections</span>
            </div>
            <div className="stat">
              <b>{figureCount}</b>
              <span>drawn diagrams</span>
            </div>
            <div className="stat">
              <b>{PROGRAMS.length}</b>
              <span>full C programs</span>
            </div>
            <div className="stat">
              <b>8</b>
              <span>visualizer labs</span>
            </div>
          </div>
          <div className="row hero-actions">
            <Link className="btn play" to="/theory">
              Start with Theory →
            </Link>
            <Link className="btn enq" to="/lab">
              Open the Visualizer →
            </Link>
            <Link className="btn gray" to="/revise">
              Revision sheet →
            </Link>
          </div>
        </div>
        <div className="hero-figs">
          <div>
            <div className="fig-title">BST · 50, 30, 70, 20, 40</div>
            <BinaryTreeSvg root={bstFromSequence([50, 30, 70, 20, 40])} compact />
          </div>
          <div>
            <div className="fig-title">AVL · balance factors</div>
            <BinaryTreeSvg root={withBalanceFactors(avlFromSequence([10, 20, 30, 40, 25]))} showBf compact />
          </div>
        </div>
      </div>

      <div className="home-cards home-cards-5">
        <Link to="/theory">
          <span className="home-ico">📘</span>
          <h3>Theory</h3>
          <p className="muted">
            {THEORY_SECTIONS.length} sections, {figureCount} diagrams. Definition, description, drawing, example and
            full C code for every topic.
          </p>
          <span className="home-go">Read the notes →</span>
        </Link>
        <Link to="/lab">
          <span className="home-ico">🎬</span>
          <h3>Visualizer</h3>
          <p className="muted">
            8 labs: traversals with a live call stack, BST, AVL, B-Tree, heap, Red-Black, Huffman and trie — each with
            drawn example packs.
          </p>
          <span className="home-go">Play the steps →</span>
        </Link>
        <Link to="/programs">
          <span className="home-ico">💻</span>
          <h3>Programs</h3>
          <p className="muted">
            {PROGRAMS.length} complete C programs. Menu driven with <code>scanf</code> — you type every key, nothing is
            hard-coded in source.
          </p>
          <span className="home-go">Copy and run →</span>
        </Link>
        <Link to="/practice">
          <span className="home-ico">📝</span>
          <h3>Practice</h3>
          <p className="muted">
            MCQs, true/false and fill in the blanks, including the heap, Red-Black, Huffman and trie traps students
            always fall for.
          </p>
          <span className="home-go">Test yourself →</span>
        </Link>
        <Link to="/revise">
          <span className="home-ico">⚡</span>
          <h3>Revise</h3>
          <p className="muted">
            Formula sheet, complexity table, the four rotations drawn, 22 viva answers and a pre-submission checklist.
          </p>
          <span className="home-go">One-hour revision →</span>
        </Link>
      </div>

      <div className="card">
        <h3>Everything this package covers</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          If a topic appears in your syllabus and is not on this list, it does not belong to Unit IV.
        </p>
        <div className="cover-grid">
          {COVERAGE.map((c) => (
            <div className="cover-col" key={c.group}>
              <div className="cover-head">{c.group}</div>
              <ul>
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Eight models, eight different jobs</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Every model is the same skeleton — nodes, edges, no cycles — with a different <b>law</b> bolted on. Pick the
          law that matches the job.
        </p>
        <div className="ex-row">
          <figure className="ex-viz">
            <figcaption className="fig-title">Search · BST and AVL</figcaption>
            <BinaryTreeSvg root={bstFromSequence([8, 3, 10, 1, 6, 14, 4, 7, 13])} compact />
            <p className="muted">Law: whole left &lt; node &lt; whole right. In-order comes out sorted.</p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">Best-first · heap</figcaption>
            <HeapDualViz arr={heapFromSequence([10, 20, 5, 30, 15], true)} compact />
            <p className="muted">Law: complete shape plus parent ≥ children. The array and the tree are one object.</p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">Disk search · B-Tree</figcaption>
            <BTreeSvg root={bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17], 3).root} compact />
            <p className="muted">Law: fat nodes, split at the median, all leaves on one level.</p>
          </figure>
          <figure className="ex-viz">
            <figcaption className="fig-title">Prefix search · trie</figcaption>
            <TrieSvg root={trieFromWords(['cat', 'car', 'cart', 'dog'])} compact />
            <p className="muted">Law: one letter per edge, shared prefixes. Cost is the word length.</p>
          </figure>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>The question it answers</th>
              <th>The law</th>
              <th>Killer fact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BST</td>
              <td>Where is key k?</td>
              <td>Whole left &lt; node &lt; whole right</td>
              <td>Sorted inserts make a stick → O(n)</td>
            </tr>
            <tr>
              <td>AVL</td>
              <td>Guaranteed fast search</td>
              <td>BST plus |BF| ≤ 1</td>
              <td>Insert ≤ 1 rotation, delete ≤ O(log n)</td>
            </tr>
            <tr>
              <td>Red-Black</td>
              <td>Fast search with many updates</td>
              <td>BST plus five colour rules</td>
              <td>std::map, TreeMap, Linux scheduler</td>
            </tr>
            <tr>
              <td>Heap</td>
              <td>What is the best item?</td>
              <td>Complete array plus parent ≥ children</td>
              <td>Not a search tree; in-order is unsorted</td>
            </tr>
            <tr>
              <td>B-Tree / B+</td>
              <td>Search when a step costs a disk read</td>
              <td>Multiway, leaves on one level</td>
              <td>B+ links the leaves for range scans</td>
            </tr>
            <tr>
              <td>Huffman</td>
              <td>Cheap codes for frequent symbols</td>
              <td>Merge the two lightest trees</td>
              <td>Prefix-free, so no separators needed</td>
            </tr>
            <tr>
              <td>Trie</td>
              <td>What continues this prefix?</td>
              <td>One letter per edge</td>
              <td>End-of-word is a flag, not a leaf</td>
            </tr>
            <tr>
              <td>Expression / threaded</td>
              <td>Evaluate · traverse without a stack</td>
              <td>Operators inside; NULLs become threads</td>
              <td>Post-order is the stack machine</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>How to use this in four evenings</h3>
        <ol className="path-list">
          <li>
            <b>Evening 1 — Foundation (Theory 1–9).</b> Terminology with all 17 drawings, the formula section, both
            representations, and the general-tree conversion. Then do the Practice fill-in-the-blanks.
          </li>
          <li>
            <b>Evening 2 — Traversals and BST (Theory 10–14).</b> Run the Traversals lab with the call stack on, then
            BST search, insert and all three delete cases. Copy the BST menu program and run it.
          </li>
          <li>
            <b>Evening 3 — AVL and B-Tree (Theory 15–23).</b> Balance factors, the four rotations, AVL deletion, median
            splits, B-Tree search and deletion. Replay the AVL and B-Tree labs until you can predict the next frame.
          </li>
          <li>
            <b>Evening 4 — Advanced and exam (Theory 24–37).</b> Heap as an array, heap sort, Red-Black, Huffman, trie,
            threads, B+, reconstruction. Finish with the 10 solved problems and the revision sheet.
          </li>
        </ol>
      </div>

      <div className="card tip-card">
        <b>The one habit that gets marks:</b> after you draw any BST or AVL, read its in-order out loud. If it is not
        sorted, the drawing is wrong and every traversal you write after it will be wrong too. Two seconds of checking
        saves a whole question.
      </div>
    </div>
  )
}

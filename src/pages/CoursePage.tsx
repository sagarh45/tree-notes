import { Link, useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { THEORY_FIGURES, type Fig } from '../data/figures'
import { PROGRAMS } from '../data/programs'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { withBalanceFactors } from '../lib/binaryTree'

type TopicId =
  | 'definition'
  | 'traversal'
  | 'linked'
  | 'binary-ops'
  | 'bst-ops'
  | 'multiway'
  | 'btree'
  | 'avl'

type ViewId = 'theory' | 'visualization' | 'program'

type Topic = {
  id: TopicId
  no: number
  label: string
  title: string
  official: string
  visualKeys: string[]
}

const TOPICS: Topic[] = [
  {
    id: 'definition',
    no: 1,
    label: 'Definition',
    title: 'Tree Definition and Basic Concepts',
    official: 'Definition',
    visualKeys: ['intro', 'shapes'],
  },
  {
    id: 'traversal',
    no: 2,
    label: 'Traversal',
    title: 'Tree Traversal',
    official: 'Traversal',
    visualKeys: ['trav'],
  },
  {
    id: 'linked',
    no: 3,
    label: 'Linked Implementation',
    title: 'Linked Implementation of Binary Tree',
    official: 'Linked implementation',
    visualKeys: ['repr', 'binary'],
  },
  {
    id: 'binary-ops',
    no: 4,
    label: 'Binary Tree Operations',
    title: 'Operations on Binary Trees',
    official: 'Operations on Binary Trees: insert, delete, search operations',
    visualKeys: ['binary', 'ops'],
  },
  {
    id: 'bst-ops',
    no: 5,
    label: 'BST Operations',
    title: 'Binary Search Tree and Operations',
    official: 'Binary Search Trees: insert, delete, search operations',
    visualKeys: ['bst', 'bst-ops'],
  },
  {
    id: 'multiway',
    no: 6,
    label: 'Multiway Trees',
    title: 'Multiway Trees',
    official: 'Multiway Trees',
    visualKeys: ['multi'],
  },
  {
    id: 'btree',
    no: 7,
    label: 'B-Trees',
    title: 'B-Trees',
    official: 'B trees',
    visualKeys: ['multi', 'bsearch', 'bsplit', 'bdel'],
  },
  {
    id: 'avl',
    no: 8,
    label: 'AVL Tree & Rotations',
    title: 'AVL Tree: Single and Double Rotations',
    official: 'AVL Tree: Single and Double rotation of AVL Trees',
    visualKeys: ['avl', 'avl-ops', 'rot'],
  },
]

const VIEWS: { id: ViewId; label: string; caption: string }[] = [
  { id: 'theory', label: 'Theory', caption: 'concepts + rules + algorithms' },
  { id: 'visualization', label: 'Visualization', caption: 'diagrams + real traces + examples' },
  { id: 'program', label: 'Program', caption: 'C functions + complete programs' },
]

function isTopic(value: string | null): value is TopicId {
  return TOPICS.some((t) => t.id === value)
}

function isView(value: string | null): value is ViewId {
  return value === 'theory' || value === 'visualization' || value === 'program'
}

function FigureView({ fig }: { fig: Fig }) {
  if (fig.btree) return <BTreeSvg root={fig.btree} compact />
  return (
    <BinaryTreeSvg
      root={fig.showBf ? withBalanceFactors(fig.root ?? null) : (fig.root ?? null)}
      marks={fig.marks}
      tags={fig.tags}
      showBf={fig.showBf}
      showColor={fig.showColor}
      showIndex={fig.showIndex}
      showNulls={fig.showNulls}
      edgeLabels={fig.edgeLabels}
      threads={fig.threads}
      compact
    />
  )
}

function collectFigures(keys: string[], limit = 12) {
  const result: Fig[] = []
  for (const key of keys) {
    const list = THEORY_FIGURES[key] ?? []
    for (const fig of list) {
      if (result.length >= limit) return result
      result.push(fig)
    }
  }
  return result
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="topic-block">
      <div className="block-kicker">{title}</div>
      {children}
    </section>
  )
}

function Flow({ children }: { children: ReactNode }) {
  return <div className="topic-flow">{children}</div>
}

function CodeCard({ title, code }: { title: string; code: string }) {
  return (
    <section className="topic-block code-block">
      <div className="block-kicker">C PROGRAM / FUNCTION</div>
      <h3>{title}</h3>
      <pre>{code}</pre>
    </section>
  )
}

function CompletePrograms({ topic }: { topic: TopicId }) {
  let list = typeof PROGRAMS === 'undefined' ? [] : PROGRAMS
  if (topic === 'traversal') list = list.filter((p) => p.id === 'trav-user')
  else if (topic === 'bst-ops') list = list.filter((p) => p.topic === 'BST').slice(0, 5)
  else if (topic === 'btree') list = list.filter((p) => p.topic === 'B-Tree').slice(0, 4)
  else if (topic === 'avl') list = list.filter((p) => p.topic === 'AVL').slice(0, 4)
  else if (topic === 'binary-ops') list = list.filter((p) => p.topic === 'Binary tree').slice(0, 4)
  else list = []

  if (!list.length) return null
  return (
    <section className="topic-block">
      <div className="block-kicker">COMPLETE PROGRAMS</div>
      <p className="muted">Open any program below when you want the complete compilable version.</p>
      {list.map((p) => (
        <details className="topic-program" key={p.id}>
          <summary>{p.title}</summary>
          <p>{p.blurb}</p>
          <pre>{p.code}</pre>
        </details>
      ))}
    </section>
  )
}

function DefinitionTheory() {
  return (
    <>
      <Block title="THEORY">
        <p><b>Tree:</b> A tree is a non-linear hierarchical data structure consisting of nodes connected by edges. It has one unique root. Every other node has exactly one parent, and a tree contains no cycle.</p>
        <div className="topic-law"><b>Core property:</b> A tree with <b>n</b> nodes has exactly <b>n - 1</b> edges.</div>
        <h3>Important terminology</h3>
        <div className="topic-two-col">
          <div>
            <ul>
              <li><b>Root:</b> topmost node.</li>
              <li><b>Parent:</b> node directly above another node.</li>
              <li><b>Child:</b> node directly below a parent.</li>
              <li><b>Sibling:</b> nodes having the same parent.</li>
              <li><b>Leaf:</b> node having no child.</li>
              <li><b>Internal node:</b> node having at least one child.</li>
            </ul>
          </div>
          <div>
            <ul>
              <li><b>Degree:</b> number of children of a node.</li>
              <li><b>Path:</b> sequence of connected nodes.</li>
              <li><b>Level / depth:</b> distance from the root.</li>
              <li><b>Height:</b> longest downward path to a leaf.</li>
              <li><b>Ancestor:</b> node lying above another node.</li>
              <li><b>Subtree:</b> a node together with its descendants.</li>
            </ul>
          </div>
        </div>
      </Block>
      <Block title="BINARY TREE BASICS">
        <p>A <b>Binary Tree</b> is a tree in which every node has at most two children, called the <b>left child</b> and <b>right child</b>.</p>
        <div className="topic-two-col">
          <div><h3>Full Binary Tree</h3><p>Every node has either 0 or 2 children.</p></div>
          <div><h3>Complete Binary Tree</h3><p>All levels are full except possibly the last, and the last level fills from left to right.</p></div>
          <div><h3>Perfect Binary Tree</h3><p>Every internal node has two children and all leaves are at the same level.</p></div>
          <div><h3>Skewed Binary Tree</h3><p>Every node has only one child, so the structure behaves like a linked list.</p></div>
        </div>
        <Flow><b>Classroom order:</b> draw one tree → identify root/parent/child/sibling/leaf → calculate degree/depth/height → classify the binary-tree shape.</Flow>
      </Block>
    </>
  )
}

function TraversalTheory() {
  return (
    <>
      <Block title="THEORY">
        <p><b>Traversal</b> means visiting every node of a tree exactly once in a systematic order.</p>
        <table>
          <thead><tr><th>Traversal</th><th>Rule</th><th>Memory line</th></tr></thead>
          <tbody>
            <tr><td>Preorder</td><td>Root → Left → Right</td><td>Root first</td></tr>
            <tr><td>Inorder</td><td>Left → Root → Right</td><td>Root in the middle</td></tr>
            <tr><td>Postorder</td><td>Left → Right → Root</td><td>Root last</td></tr>
            <tr><td>Level order</td><td>Level by level</td><td>Queue is used</td></tr>
          </tbody>
        </table>
      </Block>
      <Block title="ALGORITHMS / STEPS">
        <h3>2.1 Preorder</h3>
        <Flow>If root is NULL return → visit root → preorder(left) → preorder(right).</Flow>
        <p>For the sample tree 4,2,6,1,3,5,7, preorder is <b>4 2 1 3 6 5 7</b>.</p>
        <h3>2.2 Inorder</h3>
        <Flow>If root is NULL return → inorder(left) → visit root → inorder(right).</Flow>
        <p>For the same tree, inorder is <b>1 2 3 4 5 6 7</b>. In a BST, inorder traversal gives sorted order.</p>
        <h3>2.3 Postorder</h3>
        <Flow>If root is NULL return → postorder(left) → postorder(right) → visit root.</Flow>
        <p>For the same tree, postorder is <b>1 3 2 5 7 6 4</b>.</p>
        <h3>2.4 Level Order</h3>
        <Flow>Enqueue root → dequeue one node → visit it → enqueue left/right children → repeat until the queue becomes empty.</Flow>
        <p>For the same tree, level order is <b>4 2 6 1 3 5 7</b>.</p>
      </Block>
    </>
  )
}

function LinkedTheory() {
  return (
    <>
      <Block title="THEORY">
        <p>In the linked representation of a binary tree, every node is created dynamically and contains three logical fields:</p>
        <div className="node-memory-box">LEFT POINTER &nbsp; | &nbsp; DATA &nbsp; | &nbsp; RIGHT POINTER</div>
        <ul>
          <li><b>LEFT</b> stores the address of the left child.</li>
          <li><b>DATA</b> stores the node value.</li>
          <li><b>RIGHT</b> stores the address of the right child.</li>
          <li>If a child is absent, the corresponding pointer contains <b>NULL</b>.</li>
        </ul>
      </Block>
      <Block title="STEPS">
        <Flow>Allocate memory with malloc → store data → initialize left = NULL → initialize right = NULL → connect the returned pointer from its parent.</Flow>
        <p><b>Why linked representation?</b> It grows dynamically and does not waste array positions when the tree is sparse or irregular.</p>
      </Block>
    </>
  )
}

function BinaryOpsTheory() {
  return (
    <>
      <Block title="CORE THEORY">
        <p>A general Binary Tree has <b>no value-ordering rule</b>. A smaller value is not required to go left and a larger value is not required to go right. Therefore its operations differ from BST operations.</p>
      </Block>
      <Block title="4.1 INSERT">
        <p>A common general method is <b>level-order insertion</b>. The new node is placed at the first empty child position found from left to right.</p>
        <Flow>Empty tree → new node becomes root. Otherwise perform BFS → first missing left child gets the node → otherwise first missing right child gets the node.</Flow>
      </Block>
      <Block title="4.2 SEARCH">
        <p>Because keys are not ordered, searching may need to inspect every node.</p>
        <Flow>Compare current node → if equal, found → search left subtree → if not found, search right subtree.</Flow>
        <div className="topic-law"><b>Worst-case time:</b> O(n)</div>
      </Block>
      <Block title="4.3 DELETE">
        <p>A standard deletion approach for a general binary tree uses the <b>deepest-rightmost node</b>.</p>
        <Flow>Find target → find deepest-rightmost node by level order → copy deepest value into target → disconnect deepest node → free it.</Flow>
        <p><b>Important:</b> this is not BST deletion. A normal Binary Tree does not use the inorder-successor rule.</p>
      </Block>
    </>
  )
}

function BstTheory() {
  return (
    <>
      <Block title="BST THEORY">
        <p>A <b>Binary Search Tree (BST)</b> is a Binary Tree in which, for every node, all values in the left subtree are smaller and all values in the right subtree are larger.</p>
        <div className="topic-law"><b>BST law:</b> LEFT &lt; ROOT &lt; RIGHT</div>
        <p>Search, insertion and deletion take <b>O(h)</b>, where h is tree height. A balanced BST is near O(log n); a skewed BST can degrade to O(n).</p>
      </Block>
      <Block title="5.1 INSERT">
        <Flow>Start at root → smaller key goes left → larger key goes right → repeat until a NULL link is found → insert there.</Flow>
        <p><b>Trace:</b> Insert 65 into 50,30,70,20,40,60,80: 65 &gt; 50 → right to 70 → 65 &lt; 70 → left to 60 → 65 &gt; 60 → insert as right child of 60.</p>
      </Block>
      <Block title="5.2 SEARCH">
        <Flow>Compare target with current node → equal = found → smaller = go left → larger = go right.</Flow>
        <p><b>Trace:</b> Search 60: 60 &gt; 50 → go 70 → 60 &lt; 70 → go 60 → found.</p>
      </Block>
      <Block title="5.3 DELETE">
        <div className="topic-three-cases">
          <div><b>Case 1: Leaf</b><span>Remove the node directly.</span></div>
          <div><b>Case 2: One child</b><span>Connect the parent directly to the existing child.</span></div>
          <div><b>Case 3: Two children</b><span>Replace with inorder successor, then delete that successor.</span></div>
        </div>
        <Flow>Find node → check number of children → 0 child: remove → 1 child: bypass → 2 children: smallest node of right subtree replaces target.</Flow>
      </Block>
    </>
  )
}

function MultiwayTheory() {
  return (
    <>
      <Block title="THEORY">
        <p>A <b>Multiway Tree</b> is a tree in which a node can have more than two children. A search node can also contain multiple sorted separator keys.</p>
        <p>For keys <b>K1, K2, ...</b>, child pointers represent value ranges separated by those keys.</p>
        <div className="topic-law"><b>Main idea:</b> more branching → smaller height → fewer node accesses.</div>
      </Block>
      <Block title="WHY IT MATTERS">
        <p>Multiway trees are useful when one node access is expensive, especially in databases and file systems. They are the conceptual foundation for B-Trees.</p>
        <Flow>Binary Tree: maximum 2 children → Multiway Tree: many children → B-Tree: ordered + balanced Multiway Search Tree.</Flow>
      </Block>
    </>
  )
}

function BTreeTheory() {
  return (
    <>
      <Block title="B-TREE THEORY">
        <p>A <b>B-Tree</b> is a balanced multiway search tree designed to keep height small while storing several sorted keys in one node.</p>
        <ul>
          <li>Keys inside each node remain sorted.</li>
          <li>A node with k keys can have k + 1 children.</li>
          <li>All leaves are at the same level.</li>
          <li>Overflow is repaired by splitting a node and promoting a separator key.</li>
        </ul>
      </Block>
      <Block title="7.1 SEARCH">
        <Flow>Compare with keys inside current node → if found stop → otherwise choose the child range that can contain the key → repeat.</Flow>
        <p><b>Example:</b> In root [20 | 40], searching 30 selects the middle child because 20 &lt; 30 &lt; 40.</p>
      </Block>
      <Block title="7.2 INSERT + SPLIT">
        <Flow>Find correct leaf → insert key in sorted order → overflow? → split node → promote middle key → if parent overflows, repeat upward.</Flow>
        <p><b>Example:</b> Order-3 style node [10 | 20] receives 5 → [5 | 10 | 20] overflows → promote 10 → children become [5] and [20].</p>
      </Block>
      <Block title="7.3 DELETE + BORROW / MERGE">
        <p>After deletion, a node can contain too few keys.</p>
        <Flow>Locate key → delete or replace → check underflow → borrow from sibling if possible → otherwise merge with sibling and pull parent separator down.</Flow>
      </Block>
    </>
  )
}

function AvlTheory() {
  return (
    <>
      <Block title="AVL THEORY">
        <p>An <b>AVL Tree</b> is a self-balancing Binary Search Tree. For every node, the difference between left and right subtree heights must be at most 1.</p>
        <div className="topic-law"><b>Balance Factor:</b> BF = height(left) - height(right). Valid values are -1, 0 and +1.</div>
        <p>Insertion begins like ordinary BST insertion. Then heights are updated while returning toward the root. If BF becomes +2 or -2, a rotation is required.</p>
      </Block>
      <Block title="8.1 SINGLE ROTATIONS">
        <h3>LL Case → Right Rotation</h3>
        <p>Insert 30, 20, 10. Node 30 becomes left-left heavy. Perform one right rotation at 30.</p>
        <Flow>LL → Right Rotation</Flow>
        <h3>RR Case → Left Rotation</h3>
        <p>Insert 10, 20, 30. Node 10 becomes right-right heavy. Perform one left rotation at 10.</p>
        <Flow>RR → Left Rotation</Flow>
      </Block>
      <Block title="8.2 DOUBLE ROTATIONS">
        <h3>LR Case → Left then Right</h3>
        <p>Insert 30, 10, 20. First rotate left at 10, then rotate right at 30.</p>
        <Flow>LR → Left Rotation on child → Right Rotation on unbalanced node</Flow>
        <h3>RL Case → Right then Left</h3>
        <p>Insert 10, 30, 20. First rotate right at 30, then rotate left at 10.</p>
        <Flow>RL → Right Rotation on child → Left Rotation on unbalanced node</Flow>
      </Block>
      <Block title="MASTER DECISION TABLE">
        <table>
          <thead><tr><th>Case</th><th>Insertion pattern</th><th>Correction</th></tr></thead>
          <tbody>
            <tr><td>LL</td><td>Left of Left</td><td>Right rotation</td></tr>
            <tr><td>RR</td><td>Right of Right</td><td>Left rotation</td></tr>
            <tr><td>LR</td><td>Right of Left</td><td>Left + Right</td></tr>
            <tr><td>RL</td><td>Left of Right</td><td>Right + Left</td></tr>
          </tbody>
        </table>
      </Block>
    </>
  )
}

function TheoryView({ topic }: { topic: TopicId }) {
  if (topic === 'definition') return <DefinitionTheory />
  if (topic === 'traversal') return <TraversalTheory />
  if (topic === 'linked') return <LinkedTheory />
  if (topic === 'binary-ops') return <BinaryOpsTheory />
  if (topic === 'bst-ops') return <BstTheory />
  if (topic === 'multiway') return <MultiwayTheory />
  if (topic === 'btree') return <BTreeTheory />
  return <AvlTheory />
}

const TRACE_DATA: Record<TopicId, { title: string; steps: string[] }[]> = {
  definition: [
    { title: 'Identify parts of a tree', steps: ['Take A as root', 'B and C are children of A', 'D and E are siblings', 'Leaf nodes have no child', 'For n nodes verify edges = n - 1'] },
    { title: 'Classify a binary-tree shape', steps: ['Check maximum two children', 'Check whether every internal node has 2 children', 'Check last-level left filling', 'Check whether all leaves share one level'] },
  ],
  traversal: [
    { title: 'Preorder trace', steps: ['Start at 4', 'Root first: 4', 'Left subtree: 2,1,3', 'Right subtree: 6,5,7', 'Output: 4 2 1 3 6 5 7'] },
    { title: 'Inorder trace', steps: ['Go left as far as possible', 'Visit 1, then 2, then 3', 'Visit root 4', 'Process right subtree 5,6,7', 'Output: 1 2 3 4 5 6 7'] },
    { title: 'Postorder trace', steps: ['Finish left subtree first', 'Finish right subtree next', 'Visit root last', 'Output: 1 3 2 5 7 6 4'] },
    { title: 'Level-order queue trace', steps: ['Queue [4]', 'Remove 4, add 2 and 6', 'Remove 2, add 1 and 3', 'Remove 6, add 5 and 7', 'Output: 4 2 6 1 3 5 7'] },
  ],
  linked: [
    { title: 'One node in memory', steps: ['Allocate struct Node', 'Store data = 10', 'left = NULL', 'right = NULL', 'root stores address of this node'] },
    { title: 'Connect three nodes', steps: ['Create 10 as root', 'Create 20 and assign root->left', 'Create 30 and assign root->right', 'Pointers now form the drawn tree'] },
  ],
  'binary-ops': [
    { title: 'Level-order insertion', steps: ['Insert 10 as root', 'Insert 20 at first empty left link', 'Insert 30 at first empty right link', 'Insert 40 at left link of 20'] },
    { title: 'General search', steps: ['Compare current node', 'No ordering shortcut exists', 'Visit left subtree', 'Then right subtree if needed', 'Worst case visits n nodes'] },
    { title: 'General delete', steps: ['Find target node', 'Find deepest-rightmost node', 'Copy deepest value to target', 'Disconnect deepest node'] },
  ],
  'bst-ops': [
    { title: 'Insert 65', steps: ['65 > 50 → right', '65 < 70 → left', '65 > 60 → right', 'NULL found → insert 65'] },
    { title: 'Search 60', steps: ['60 > 50 → right', '60 < 70 → left', '60 = 60 → found'] },
    { title: 'Delete leaf', steps: ['Find leaf key', 'It has 0 children', 'Parent link becomes NULL'] },
    { title: 'Delete two-child node', steps: ['Find target', 'Find smallest key in right subtree', 'Copy successor value', 'Delete successor from right subtree'] },
  ],
  multiway: [
    { title: 'Range selection', steps: ['Node contains [20 | 40]', 'Value < 20 uses left child', '20 < value < 40 uses middle child', 'Value > 40 uses right child'] },
    { title: 'Why height falls', steps: ['Binary node branches to at most 2', 'Multiway node branches to many children', 'More branching means fewer levels for the same number of keys'] },
  ],
  btree: [
    { title: 'Search 30', steps: ['Inspect root [20 | 40]', '30 lies between 20 and 40', 'Choose middle child', 'Search keys inside that child'] },
    { title: 'Split after inserting 5', steps: ['Node [10 | 20]', 'Insert 5 → [5 | 10 | 20]', 'Overflow occurs', 'Promote middle key 10', 'Children become [5] and [20]'] },
    { title: 'Deletion repair', steps: ['Delete key', 'Underflow?', 'Try borrowing from sibling', 'If sibling cannot lend, merge', 'Repair parent upward if required'] },
  ],
  avl: [
    { title: 'LL rotation', steps: ['Insert 30,20,10', 'BF(30) becomes +2', 'Pattern is left of left', 'Right-rotate 30', 'Final root is 20'] },
    { title: 'RR rotation', steps: ['Insert 10,20,30', 'BF(10) becomes -2', 'Pattern is right of right', 'Left-rotate 10', 'Final root is 20'] },
    { title: 'LR rotation', steps: ['Insert 30,10,20', 'Pattern is right of left', 'Left-rotate child 10', 'Right-rotate 30', 'Final root is 20'] },
    { title: 'RL rotation', steps: ['Insert 10,30,20', 'Pattern is left of right', 'Right-rotate child 30', 'Left-rotate 10', 'Final root is 20'] },
  ],
}

function VisualizationView({ topic, visualKeys }: { topic: TopicId; visualKeys: string[] }) {
  const figs = collectFigures(visualKeys, 12)
  return (
    <>
      <section className="topic-block visualization-intro">
        <div className="block-kicker">WORKED TRACE</div>
        <div className="trace-grid">
          {TRACE_DATA[topic].map((trace, i) => (
            <div className="trace-card" key={trace.title}>
              <div className="trace-number">{i + 1}</div>
              <h3>{trace.title}</h3>
              <ol>{trace.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            </div>
          ))}
        </div>
      </section>

      <section className="topic-block visual-block">
        <div className="block-kicker">DRAWN VISUALIZATIONS</div>
        <p className="muted">The diagrams below are kept inside this syllabus point, so students do not have to open a separate Visualizer page while learning.</p>
        {figs.length ? (
          <div className="topic-visual-grid">
            {figs.map((fig, index) => (
              <figure className="topic-figure" key={`${fig.title}-${index}`}>
                <figcaption><b>Example {index + 1}:</b> {fig.title}</figcaption>
                <FigureView fig={fig} />
                <p>{fig.caption}</p>
              </figure>
            ))}
          </div>
        ) : (
          <p className="muted">Worked traces above cover this point.</p>
        )}
      </section>
    </>
  )
}

function ProgramView({ topic }: { topic: TopicId }) {
  if (topic === 'definition') {
    return (
      <CodeCard title="Binary Tree node structure" code={`struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};`} />
    )
  }

  if (topic === 'linked') {
    return (
      <>
        <CodeCard title="Create a linked Binary Tree node" code={`#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int value) {
    struct Node *p = (struct Node *)malloc(sizeof(struct Node));
    p->data = value;
    p->left = NULL;
    p->right = NULL;
    return p;
}`} />
      </>
    )
  }

  if (topic === 'traversal') {
    return (
      <>
        <CodeCard title="Preorder, Inorder and Postorder" code={`void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void postorder(struct Node *root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}`} />
        <CompletePrograms topic={topic} />
      </>
    )
  }

  if (topic === 'binary-ops') {
    return (
      <>
        <CodeCard title="Binary Tree search" code={`struct Node *searchBT(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (root->data == key) return root;

    struct Node *p = searchBT(root->left, key);
    if (p != NULL) return p;

    return searchBT(root->right, key);
}`} />
        <CodeCard title="Level-order insertion" code={`struct Node *insertBT(struct Node *root, int x) {
    struct Node *q[100];
    int front = 0, rear = 0;

    if (root == NULL)
        return createNode(x);

    q[rear++] = root;
    while (front < rear) {
        struct Node *cur = q[front++];

        if (cur->left == NULL) {
            cur->left = createNode(x);
            return root;
        }
        q[rear++] = cur->left;

        if (cur->right == NULL) {
            cur->right = createNode(x);
            return root;
        }
        q[rear++] = cur->right;
    }
    return root;
}`} />
        <CompletePrograms topic={topic} />
      </>
    )
  }

  if (topic === 'bst-ops') {
    return (
      <>
        <CodeCard title="BST Insert and Search" code={`struct Node *insertBST(struct Node *root, int key) {
    if (root == NULL) return createNode(key);

    if (key < root->data)
        root->left = insertBST(root->left, key);
    else if (key > root->data)
        root->right = insertBST(root->right, key);

    return root;
}

struct Node *searchBST(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data) return root;
        if (key < root->data) root = root->left;
        else root = root->right;
    }
    return NULL;
}`} />
        <CodeCard title="BST Delete" code={`struct Node *minNode(struct Node *root) {
    while (root && root->left != NULL)
        root = root->left;
    return root;
}

struct Node *deleteBST(struct Node *root, int key) {
    if (root == NULL) return NULL;

    if (key < root->data)
        root->left = deleteBST(root->left, key);
    else if (key > root->data)
        root->right = deleteBST(root->right, key);
    else {
        if (root->left == NULL) {
            struct Node *t = root->right;
            free(root);
            return t;
        }
        if (root->right == NULL) {
            struct Node *t = root->left;
            free(root);
            return t;
        }

        struct Node *s = minNode(root->right);
        root->data = s->data;
        root->right = deleteBST(root->right, s->data);
    }
    return root;
}`} />
        <CompletePrograms topic={topic} />
      </>
    )
  }

  if (topic === 'multiway') {
    return (
      <CodeCard title="Basic Multiway node representation" code={`#define M 4

struct MNode {
    int keyCount;
    int keys[M - 1];
    struct MNode *child[M];
};`} />
    )
  }

  if (topic === 'btree') {
    return (
      <>
        <CodeCard title="Conceptual B-Tree search" code={`struct BNode *bTreeSearch(struct BNode *x, int key) {
    int i = 0;

    while (i < x->n && key > x->key[i])
        i++;

    if (i < x->n && key == x->key[i])
        return x;

    if (x->leaf)
        return NULL;

    return bTreeSearch(x->child[i], key);
}`} />
        <CompletePrograms topic={topic} />
      </>
    )
  }

  return (
    <>
      <CodeCard title="AVL single rotations" code={`struct Node *rotateRight(struct Node *z) {
    struct Node *y = z->left;
    struct Node *T3 = y->right;

    y->right = z;
    z->left = T3;

    updateHeight(z);
    updateHeight(y);
    return y;
}

struct Node *rotateLeft(struct Node *z) {
    struct Node *y = z->right;
    struct Node *T2 = y->left;

    y->left = z;
    z->right = T2;

    updateHeight(z);
    updateHeight(y);
    return y;
}`} />
      <CodeCard title="AVL rotation decision" code={`int balance = height(root->left) - height(root->right);

/* LL */
if (balance > 1 && key < root->left->data)
    return rotateRight(root);

/* RR */
if (balance < -1 && key > root->right->data)
    return rotateLeft(root);

/* LR */
if (balance > 1 && key > root->left->data) {
    root->left = rotateLeft(root->left);
    return rotateRight(root);
}

/* RL */
if (balance < -1 && key < root->right->data) {
    root->right = rotateRight(root->right);
    return rotateLeft(root);
}`} />
      <CompletePrograms topic={topic} />
    </>
  )
}

export function CoursePage() {
  const [params] = useSearchParams()
  const topicId: TopicId = isTopic(params.get('topic')) ? params.get('topic')! : 'definition'
  const view: ViewId = isView(params.get('view')) ? params.get('view')! : 'theory'
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0]
  const next = TOPICS[topic.no] ?? null
  const prev = TOPICS[topic.no - 2] ?? null

  return (
    <div className="course-page">
      <section className="topic-hero syllabus-point-hero">
        <div className="hero-kicker">SYLLABUS POINT {topic.no} OF {TOPICS.length}</div>
        <h2>{topic.title}</h2>
        <p><b>Official syllabus:</b> {topic.official}</p>
        <div className="topic-learning-path">Inside this point: Theory → Visualization → Program</div>
      </section>

      <nav className="topic-view-tabs" aria-label={`${topic.label} learning sections`}>
        {VIEWS.map((item) => (
          <Link
            key={item.id}
            to={`/?topic=${topic.id}&view=${item.id}`}
            className={view === item.id ? 'active' : undefined}
          >
            <span>{item.label}</span>
            <small>{item.caption}</small>
          </Link>
        ))}
      </nav>

      <div className="topic-view-content">
        {view === 'theory' ? <TheoryView topic={topic.id} /> : null}
        {view === 'visualization' ? <VisualizationView topic={topic.id} visualKeys={topic.visualKeys} /> : null}
        {view === 'program' ? <ProgramView topic={topic.id} /> : null}
      </div>

      <div className="syllabus-next-prev">
        {prev ? <Link to={`/?topic=${prev.id}&view=theory`}>← {prev.no}. {prev.label}</Link> : <span />}
        {next ? <Link to={`/?topic=${next.id}&view=theory`}>{next.no}. {next.label} →</Link> : <span />}
      </div>
    </div>
  )
}

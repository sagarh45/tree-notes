import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { THEORY_FIGURES, type Fig } from '../data/figures'
import { PROGRAMS } from '../data/programs'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { TrieSvg } from '../components/viz/TrieSvg'
import { HuffmanPanel } from '../components/viz/HuffmanPanel'
import { withBalanceFactors } from '../lib/binaryTree'

type VisualPick = { key: string; match?: string; take?: number }

type PointProps = {
  id: string
  number: string
  title: string
  syllabus: string
  children: ReactNode
}

function FigureView({ fig }: { fig: Fig }) {
  if (fig.heap) return <HeapDualViz arr={fig.heap} compact />
  if (fig.trie) return <TrieSvg root={fig.trie} compact />
  if (fig.forest?.length) return <HuffmanPanel forest={fig.forest} codes={fig.codes} compact />
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

function resolveVisuals(picks: VisualPick[]) {
  const out: Fig[] = []
  for (const pick of picks) {
    const list = THEORY_FIGURES[pick.key] ?? []
    if (pick.match) {
      const hit = list.find((f) => f.title.toLowerCase().includes(pick.match!.toLowerCase()))
      if (hit) out.push(hit)
    } else {
      out.push(...list.slice(0, pick.take ?? 1))
    }
  }
  return out
}

function VisualTrace({ picks, note }: { picks: VisualPick[]; note?: ReactNode }) {
  const figs = resolveVisuals(picks)
  if (!figs.length && !note) return null
  return (
    <div className="term" style={{ marginTop: 14 }}>
      <div className="term-name">Visualization / Worked Trace</div>
      {note ? <div className="ex" style={{ marginBottom: 12 }}>{note}</div> : null}
      {figs.length ? (
        <div className="ex-row">
          {figs.map((fig, i) => (
            <figure className="ex-viz" key={`${fig.title}-${i}`}>
              <figcaption className="fig-title">Example {i + 1}: {fig.title}</figcaption>
              <FigureView fig={fig} />
              <p className="muted">{fig.caption}</p>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CodeSnippet({ title, code }: { title: string; code: string }) {
  return (
    <div className="fn" style={{ marginTop: 14 }}>
      <div className="fn-name">C Program / Function: {title}</div>
      <pre>{code}</pre>
    </div>
  )
}

function FullProgram({ id }: { id: string }) {
  const p = PROGRAMS.find((x) => x.id === id)
  if (!p) return null
  return (
    <details className="fn" style={{ marginTop: 14 }}>
      <summary className="fn-name" style={{ cursor: 'pointer' }}>Complete C Program: {p.title}</summary>
      <p>{p.blurb}</p>
      <pre>{p.code}</pre>
    </details>
  )
}

function MiniFlow({ children }: { children: ReactNode }) {
  return <div className="law" style={{ marginTop: 12 }}>{children}</div>
}

function TeachingPoint({ id, number, title, syllabus, children }: PointProps) {
  return (
    <article className="card theory-article" id={id}>
      <header className="art-head">
        <span className="art-badge g-core">SYLLABUS POINT {number}</span>
        <h2><span className="art-num">{number}</span>{title}</h2>
        <p className="muted" style={{ marginBottom: 0 }}><b>Syllabus:</b> {syllabus}</p>
      </header>
      {children}
      <a className="to-top" href="#top">↑ syllabus index</a>
    </article>
  )
}

function SubPoint({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="theory-body" style={{ marginTop: 18 }}>
      <div className="fig-head">{title}</div>
      {children}
    </section>
  )
}

function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-15% 0px -72% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

const INDEX = [
  ['definition', '1', 'Definition'],
  ['traversal', '2', 'Traversal'],
  ['linked', '3', 'Linked implementation'],
  ['binary-ops', '4', 'Binary Tree operations'],
  ['bst', '5', 'Binary Search Tree operations'],
  ['multiway', '6', 'Multiway Trees'],
  ['btree', '7', 'B-Trees'],
  ['avl', '8', 'AVL Tree'],
  ['single-rotation', '9', 'Single rotation'],
  ['double-rotation', '10', 'Double rotation'],
] as const

export function SyllabusPage() {
  const ids = useMemo(() => INDEX.map((x) => x[0]), [])
  const active = useActive(ids)

  return (
    <div className="theory-shell">
      <aside className="theory-rail" aria-label="Syllabus index">
        <div className="rail-box">
          <div className="rail-head">
            <span className="rail-count">10</span>
            <div>
              <b>Unit IV syllabus</b>
              <div className="muted rail-sub">one point completely, then next</div>
            </div>
          </div>
          <nav className="rail-list">
            {INDEX.map(([id, no, title]) => (
              <a key={id} href={`#${id}`} className={active === id ? 'on' : undefined}>
                <span className="rail-num">{no}</span>{title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="theory-main">
        <section className="card hero-band" id="top">
          <div className="hero-kicker">UNIT IV · TREES · 7 HOURS</div>
          <h2>Complete Unit IV on one page, exactly in syllabus order</h2>
          <p className="muted">
            This page does not separate theory, diagrams and programs into different places. For every syllabus point,
            finish the <b>theory → algorithm / steps → visualization / real trace → C program</b>, and only then move to the next point.
          </p>
          <div className="law">
            <b>Official syllabus:</b> Definition, traversal, linked implementation, operations on Binary Trees and Binary Search Trees:
            insert, delete, search operations, Multiway Trees, B trees, AVL Tree: Single and Double rotation of AVL Trees.
          </div>
          <div className="stat-strip">
            <div className="stat"><b>10</b><span>teaching points</span></div>
            <div className="stat"><b>1</b><span>continuous page</span></div>
            <div className="stat"><b>3 + 3</b><span>BT + BST operations</span></div>
            <div className="stat"><b>4</b><span>AVL cases</span></div>
          </div>
        </section>

        <TeachingPoint id="definition" number="1" title="Definition" syllabus="Definition">
          <SubPoint title="1.1 Theory">
            <p><b>Tree:</b> A tree is a non-linear hierarchical data structure made of nodes connected by edges. It has one unique <b>root</b>. Every other node has exactly one parent and a tree contains no cycle.</p>
            <MiniFlow><b>Most important rule:</b> If a tree has <b>n</b> nodes, it has exactly <b>n - 1</b> edges.</MiniFlow>
            <table>
              <thead><tr><th>Term</th><th>Simple meaning</th></tr></thead>
              <tbody>
                <tr><td>Root</td><td>Topmost node; it has no parent.</td></tr>
                <tr><td>Parent / Child</td><td>Direct upper and lower connected nodes.</td></tr>
                <tr><td>Sibling</td><td>Nodes having the same parent.</td></tr>
                <tr><td>Leaf</td><td>Node with no child.</td></tr>
                <tr><td>Internal node</td><td>Node having at least one child.</td></tr>
                <tr><td>Degree</td><td>Number of children of a node.</td></tr>
                <tr><td>Level / Depth</td><td>Distance from the root.</td></tr>
                <tr><td>Height</td><td>Longest downward path from a node to a leaf.</td></tr>
                <tr><td>Subtree</td><td>A node together with all its descendants.</td></tr>
              </tbody>
            </table>
            <p><b>Binary Tree:</b> A tree in which every node has at most two children, called <b>left</b> and <b>right</b>.</p>
            <ul>
              <li><b>Full:</b> every node has either 0 or 2 children.</li>
              <li><b>Complete:</b> levels are filled left to right.</li>
              <li><b>Perfect:</b> every level is completely full.</li>
              <li><b>Skewed:</b> every node has one child, so the tree looks like a linked list.</li>
            </ul>
          </SubPoint>
          <VisualTrace
            picks={[{ key: 'intro', take: 2 }, { key: 'shapes', take: 4 }]}
            note={<><b>Real trace:</b> In the company-tree example, A is root, B and C are children of A, D/E/F are leaves. Six nodes give five edges.</>}
          />
          <div className="tip-card"><b>Finish this point before moving on:</b> student should be able to label root, parent, child, sibling, leaf, level, height and subtree on any small tree.</div>
        </TeachingPoint>

        <TeachingPoint id="traversal" number="2" title="Traversal" syllabus="Traversal">
          <p><b>Traversal</b> means visiting every node exactly once in a systematic order. Do not teach all names together and then show examples later. Complete one traversal fully, then go to the next.</p>

          <SubPoint title="2.1 Preorder Traversal — Root → Left → Right">
            <p><b>Theory:</b> Visit the root first, then completely traverse the left subtree, then the right subtree.</p>
            <MiniFlow><b>Algorithm:</b> 1) If root is NULL return. 2) Visit root. 3) Preorder(left). 4) Preorder(right).</MiniFlow>
            <VisualTrace picks={[{ key: 'trav', match: 'Tree for Ex1' }, { key: 'trav', match: 'letters A–G' }]} note={<><b>Trace:</b> For 4,2,6,1,3,5,7 → <b>4, 2, 1, 3, 6, 5, 7</b>. Root 4 is printed before both subtrees.</>} />
            <CodeSnippet title="Preorder" code={`void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}`} />
          </SubPoint>

          <SubPoint title="2.2 Inorder Traversal — Left → Root → Right">
            <p><b>Theory:</b> First traverse the left subtree, then visit the root, then traverse the right subtree. In a BST, inorder gives keys in ascending order.</p>
            <MiniFlow><b>Algorithm:</b> 1) If root is NULL return. 2) Inorder(left). 3) Visit root. 4) Inorder(right).</MiniFlow>
            <VisualTrace picks={[{ key: 'trav', match: 'Tree for Ex1' }, { key: 'trav', match: '50,30,70' }]} note={<><b>Trace:</b> 4,2,6,1,3,5,7 → <b>1, 2, 3, 4, 5, 6, 7</b>.</>} />
            <CodeSnippet title="Inorder" code={`void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}`} />
          </SubPoint>

          <SubPoint title="2.3 Postorder Traversal — Left → Right → Root">
            <p><b>Theory:</b> Both child subtrees are processed before their parent. This order is useful when children must be handled before deleting or evaluating the parent.</p>
            <MiniFlow><b>Algorithm:</b> 1) If root is NULL return. 2) Postorder(left). 3) Postorder(right). 4) Visit root.</MiniFlow>
            <VisualTrace picks={[{ key: 'trav', match: 'Tree for Ex1' }, { key: 'trav', match: 'skewed' }]} note={<><b>Trace:</b> 4,2,6,1,3,5,7 → <b>1, 3, 2, 5, 7, 6, 4</b>. Root 4 is visited last.</>} />
            <CodeSnippet title="Postorder" code={`void postorder(struct Node *root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}`} />
          </SubPoint>

          <SubPoint title="2.4 Level Order Traversal — Level by Level">
            <p><b>Theory:</b> Visit the root, then all nodes of level 1, then level 2 and so on. A <b>queue</b> is used.</p>
            <MiniFlow><b>Algorithm:</b> Enqueue root → dequeue one node → visit it → enqueue its left and right child → repeat until queue becomes empty.</MiniFlow>
            <VisualTrace picks={[{ key: 'trav', match: 'Tree for Ex1' }, { key: 'trav', match: 'classic' }]} note={<><b>Trace:</b> 4,2,6,1,3,5,7 → queue flow gives <b>4, 2, 6, 1, 3, 5, 7</b>.</>} />
            <CodeSnippet title="Level order" code={`void levelorder(struct Node *root) {
    struct Node *q[100];
    int front = 0, rear = 0;
    if (root == NULL) return;
    q[rear++] = root;
    while (front < rear) {
        struct Node *cur = q[front++];
        printf("%d ", cur->data);
        if (cur->left)  q[rear++] = cur->left;
        if (cur->right) q[rear++] = cur->right;
    }
}`} />
          </SubPoint>
          <FullProgram id="trav-user" />
        </TeachingPoint>

        <TeachingPoint id="linked" number="3" title="Linked Implementation" syllabus="Linked implementation">
          <SubPoint title="3.1 Theory and Memory Representation">
            <p>Each binary-tree node is stored dynamically with three logical fields:</p>
            <pre className="tree-pic">[ LEFT POINTER | DATA | RIGHT POINTER ]</pre>
            <ul>
              <li><b>LEFT</b> stores the address of the left child.</li>
              <li><b>DATA</b> stores the actual value.</li>
              <li><b>RIGHT</b> stores the address of the right child.</li>
              <li>If a child is absent, that pointer stores <b>NULL</b>.</li>
            </ul>
            <MiniFlow><b>Creation steps:</b> allocate memory → store data → set left = NULL → set right = NULL → connect the node from its parent.</MiniFlow>
          </SubPoint>
          <VisualTrace picks={[{ key: 'repr', take: 4 }, { key: 'binary', match: 'After user inserts' }]} note={<><b>Memory trace:</b> root contains the address of the first node. Each node stores addresses of its children, not the children themselves.</>} />
          <CodeSnippet title="Linked node creation" code={`struct Node {
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
        </TeachingPoint>

        <TeachingPoint id="binary-ops" number="4" title="Operations on Binary Trees" syllabus="operations on Binary Trees: insert, delete, search operations">
          <p>A normal binary tree has <b>no ordering rule</b>. Therefore insertion, search and deletion cannot use the smaller-left / larger-right rule of a BST.</p>

          <SubPoint title="4.1 Binary Tree Insert">
            <p><b>Theory:</b> One common general rule is <b>level-order insertion</b>: put the new node in the first empty child position found from left to right.</p>
            <MiniFlow><b>Steps:</b> If tree is empty create root → otherwise BFS with queue → first missing left child gets new node → otherwise first missing right child gets new node.</MiniFlow>
            <VisualTrace picks={[{ key: 'binary', match: 'After user inserts' }, { key: 'ops', take: 2 }]} note={<><b>Example flow:</b> Insert 10, 20, 30, 40 → 10 becomes root, 20 goes left, 30 goes right, 40 becomes left child of 20.</>} />
            <CodeSnippet title="Level-order insertion" code={`struct Node *insertBT(struct Node *root, int x) {
    struct Node *q[100];
    int f = 0, r = 0;
    if (root == NULL) return createNode(x);
    q[r++] = root;
    while (f < r) {
        struct Node *cur = q[f++];
        if (cur->left == NULL) {
            cur->left = createNode(x);
            return root;
        }
        q[r++] = cur->left;
        if (cur->right == NULL) {
            cur->right = createNode(x);
            return root;
        }
        q[r++] = cur->right;
    }
    return root;
}`} />
          </SubPoint>

          <SubPoint title="4.2 Binary Tree Search">
            <p><b>Theory:</b> Because values are not sorted, search may need to inspect every node.</p>
            <MiniFlow><b>Steps:</b> Compare current node → if equal found → recursively search left subtree → if not found search right subtree. Worst case O(n).</MiniFlow>
            <VisualTrace picks={[{ key: 'ops', take: 3 }]} note={<><b>Trace:</b> Search follows actual tree structure, not value comparison. It may visit both subtrees.</>} />
            <CodeSnippet title="Binary Tree search" code={`struct Node *searchBT(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (root->data == key) return root;
    struct Node *p = searchBT(root->left, key);
    if (p != NULL) return p;
    return searchBT(root->right, key);
}`} />
          </SubPoint>

          <SubPoint title="4.3 Binary Tree Delete">
            <p><b>Theory:</b> For a general binary tree, a common method is to replace the target value by the deepest-rightmost node and then remove that deepest node.</p>
            <MiniFlow><b>Steps:</b> Find target → find deepest-rightmost node using level order → copy deepest value into target → disconnect deepest node → free it.</MiniFlow>
            <VisualTrace picks={[{ key: 'ops', take: 4 }]} note={<><b>Important:</b> This is different from BST deletion. There is no inorder-successor rule in a normal unsorted binary tree.</>} />
            <CodeSnippet title="Binary Tree deletion idea" code={`/* After level-order finds target, deepest and deepestParent */
target->data = deepest->data;
if (deepestParent->left == deepest)
    deepestParent->left = NULL;
else
    deepestParent->right = NULL;
free(deepest);`} />
          </SubPoint>
        </TeachingPoint>

        <TeachingPoint id="bst" number="5" title="Binary Search Tree and Operations" syllabus="Binary Search Trees: insert, delete, search operations">
          <SubPoint title="5.1 BST Theory">
            <p><b>Binary Search Tree (BST):</b> For every node, all keys in its left subtree are smaller and all keys in its right subtree are larger.</p>
            <MiniFlow><b>BST law:</b> LEFT &lt; ROOT &lt; RIGHT. Because of this law, every comparison tells us which half to ignore.</MiniFlow>
            <p><b>Complexity:</b> Search, insert and delete take O(h), where h is tree height. Balanced: O(log n). Skewed: O(n).</p>
            <VisualTrace picks={[{ key: 'bst', take: 4 }]} note={<><b>Check:</b> Inorder traversal of every valid BST must be sorted.</>} />
          </SubPoint>

          <SubPoint title="5.2 BST Insert">
            <p><b>Theory:</b> Start at root. Smaller key goes left; larger key goes right. Repeat until a NULL link is found.</p>
            <MiniFlow><b>Trace:</b> Insert 18 into 45,15,79,10,20... → 18 &lt; 45 → left to 15 → 18 &gt; 15 → right to 20 → 18 &lt; 20 → insert as left child of 20.</MiniFlow>
            <VisualTrace picks={[{ key: 'bst-ops', match: 'After inserting 18' }, { key: 'bst', match: 'balanced' }]} />
            <CodeSnippet title="BST insertion" code={`struct Node *insertBST(struct Node *root, int key) {
    if (root == NULL) return createNode(key);
    if (key < root->data)
        root->left = insertBST(root->left, key);
    else if (key > root->data)
        root->right = insertBST(root->right, key);
    return root;
}`} />
          </SubPoint>

          <SubPoint title="5.3 BST Search">
            <p><b>Theory:</b> Compare target with current node. Equal means found; smaller means go left; larger means go right.</p>
            <MiniFlow><b>Trace:</b> Search 20 in the lecture tree: 20 &lt; 45 → go 15 → 20 &gt; 15 → go 20 → found.</MiniFlow>
            <VisualTrace picks={[{ key: 'bst-ops', match: 'Search 20' }, { key: 'bst-ops', match: 'Search 22' }]} />
            <CodeSnippet title="BST search" code={`struct Node *searchBST(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data) return root;
        if (key < root->data) root = root->left;
        else root = root->right;
    }
    return NULL;
}`} />
            <FullProgram id="search-user" />
          </SubPoint>

          <SubPoint title="5.4 BST Delete — all three cases">
            <p><b>Case 1: Leaf node:</b> remove it directly.</p>
            <p><b>Case 2: One child:</b> connect the parent directly to the existing child.</p>
            <p><b>Case 3: Two children:</b> replace the node by its inorder successor, the smallest key in the right subtree, then delete that successor.</p>
            <MiniFlow><b>Decision flow:</b> Find node → count children → 0 child: remove → 1 child: bypass → 2 children: successor replace + delete successor.</MiniFlow>
            <VisualTrace picks={[{ key: 'bst-ops', match: 'Delete-leaf' }, { key: 'bst-ops', match: 'One-child' }, { key: 'bst-ops', match: 'Two-child' }]} />
            <FullProgram id="delete-user" />
          </SubPoint>
        </TeachingPoint>

        <TeachingPoint id="multiway" number="6" title="Multiway Trees" syllabus="Multiway Trees">
          <SubPoint title="6.1 Theory">
            <p>A <b>multiway tree</b> allows a node to have more than two children. A node can also store multiple separator keys.</p>
            <p>For a multiway search node containing sorted keys <b>K1, K2, ...</b>, child ranges are separated by those keys. This reduces height because one node can branch in many directions.</p>
            <MiniFlow><b>Binary vs multiway:</b> Binary node → at most 2 children. Multiway node → 3, 4, 5 or more child pointers depending on order.</MiniFlow>
          </SubPoint>
          <VisualTrace picks={[{ key: 'multi', take: 3 }]} note={<><b>Teaching link:</b> Multiway Tree is the general idea. A B-Tree is the ordered, balanced multiway tree studied in the next point.</>} />
          <CodeSnippet title="Multiway node representation" code={`#define M 4
struct MNode {
    int keyCount;
    int keys[M - 1];
    struct MNode *child[M];
};`} />
        </TeachingPoint>

        <TeachingPoint id="btree" number="7" title="B-Trees" syllabus="B trees">
          <SubPoint title="7.1 B-Tree Theory and Properties">
            <p>A <b>B-Tree</b> is a balanced multiway search tree designed to keep height small.</p>
            <ul>
              <li>Keys inside every node are sorted.</li>
              <li>A node with k keys can have k + 1 children.</li>
              <li>All leaves are at the same level.</li>
              <li>When a node overflows, it is split and the middle key is promoted.</li>
            </ul>
            <VisualTrace picks={[{ key: 'multi', take: 2 }]} />
          </SubPoint>

          <SubPoint title="7.2 B-Tree Search">
            <p><b>Theory:</b> First search among the sorted keys inside the current node. If not found, choose the child range in which the key can occur.</p>
            <MiniFlow><b>Trace:</b> Search 17 → inspect root keys → select middle child → inspect [12,17] → found. Only a few node accesses are required.</MiniFlow>
            <VisualTrace picks={[{ key: 'bsearch', take: 2 }]} />
            <FullProgram id="bsearch-user" />
          </SubPoint>

          <SubPoint title="7.3 B-Tree Insert and Split">
            <p><b>Steps:</b> Find correct leaf → insert key in sorted order → if node overflows, split it → promote median to parent → if parent overflows repeat upward → if root splits, create a new root.</p>
            <MiniFlow><b>Real trace:</b> Order 3, insert 10, 20, 5. Node [10,20] receives 5 → [5,10,20] overflows → promote 10 → left child [5], right child [20].</MiniFlow>
            <VisualTrace picks={[{ key: 'bsplit', take: 4 }]} />
            <FullProgram id="btree-user" />
          </SubPoint>

          <SubPoint title="7.4 B-Tree Delete — Borrow and Merge">
            <p><b>Basic idea:</b> Delete from a leaf when possible. If deletion causes too few keys, first try to <b>borrow</b> from a sibling. If borrowing is impossible, <b>merge</b> with a sibling and pull a separator key down from the parent.</p>
            <MiniFlow><b>Flow:</b> locate key → delete/replace → check underflow → borrow if sibling has extra key → otherwise merge → repair parent upward if required.</MiniFlow>
            <VisualTrace picks={[{ key: 'bdel', take: 4 }]} />
          </SubPoint>
        </TeachingPoint>

        <TeachingPoint id="avl" number="8" title="AVL Tree" syllabus="AVL Tree">
          <SubPoint title="8.1 Theory and Balance Factor">
            <p>An <b>AVL tree</b> is a self-balancing Binary Search Tree. For every node, the height difference between left and right subtrees must remain at most 1.</p>
            <MiniFlow><b>Balance Factor:</b> BF = height(left subtree) - height(right subtree). Allowed values: <b>-1, 0, +1</b>. BF +2 or -2 means rebalancing is needed.</MiniFlow>
            <p>Insertion starts exactly like BST insertion. Then, while returning toward the root, update heights and check balance factors. If a node becomes unbalanced, identify LL, RR, LR or RL and rotate.</p>
          </SubPoint>
          <VisualTrace picks={[{ key: 'avl', take: 4 }, { key: 'avl-ops', take: 3 }]} note={<><b>Why AVL?</b> Sorted BST insertion can create a stick. AVL rotations keep height near O(log n).</>} />
          <FullProgram id="avl-user" />
        </TeachingPoint>

        <TeachingPoint id="single-rotation" number="9" title="Single Rotation of AVL Trees" syllabus="Single rotation of AVL Trees">
          <SubPoint title="9.1 LL Case → Single Right Rotation">
            <p><b>When?</b> The unbalanced node is left-heavy and the new key is inserted in the left subtree of its left child.</p>
            <MiniFlow><b>Trace:</b> Insert 30 → 20 → 10. BF(30) becomes +2. This is LL. Perform one <b>right rotation at 30</b>. New root becomes 20.</MiniFlow>
            <VisualTrace picks={[{ key: 'rot', match: 'LL result' }, { key: 'avl', match: '30,20,10' }]} />
            <CodeSnippet title="Right rotation for LL" code={`struct Node *rotateRight(struct Node *z) {
    struct Node *y = z->left;
    struct Node *T3 = y->right;
    y->right = z;
    z->left = T3;
    updateHeight(z);
    updateHeight(y);
    return y;
}`} />
          </SubPoint>

          <SubPoint title="9.2 RR Case → Single Left Rotation">
            <p><b>When?</b> The unbalanced node is right-heavy and the new key is inserted in the right subtree of its right child.</p>
            <MiniFlow><b>Trace:</b> Insert 10 → 20 → 30. BF(10) becomes -2. This is RR. Perform one <b>left rotation at 10</b>. New root becomes 20.</MiniFlow>
            <VisualTrace picks={[{ key: 'rot', match: 'RR result' }, { key: 'avl', match: '10,20,30' }]} />
            <CodeSnippet title="Left rotation for RR" code={`struct Node *rotateLeft(struct Node *z) {
    struct Node *y = z->right;
    struct Node *T2 = y->left;
    y->left = z;
    z->right = T2;
    updateHeight(z);
    updateHeight(y);
    return y;
}`} />
          </SubPoint>
        </TeachingPoint>

        <TeachingPoint id="double-rotation" number="10" title="Double Rotation of AVL Trees" syllabus="Double rotation of AVL Trees">
          <SubPoint title="10.1 LR Case → Left Rotation + Right Rotation">
            <p><b>When?</b> The node is left-heavy, but insertion happened in the <b>right subtree of its left child</b>.</p>
            <MiniFlow><b>Trace:</b> Insert 30 → 10 → 20. First rotate <b>left at 10</b>, then rotate <b>right at 30</b>. Final root is 20.</MiniFlow>
            <VisualTrace picks={[{ key: 'rot', match: 'LR result' }]} />
            <CodeSnippet title="LR double rotation" code={`root->left = rotateLeft(root->left);
root = rotateRight(root);`} />
          </SubPoint>

          <SubPoint title="10.2 RL Case → Right Rotation + Left Rotation">
            <p><b>When?</b> The node is right-heavy, but insertion happened in the <b>left subtree of its right child</b>.</p>
            <MiniFlow><b>Trace:</b> Insert 10 → 30 → 20. First rotate <b>right at 30</b>, then rotate <b>left at 10</b>. Final root is 20.</MiniFlow>
            <VisualTrace picks={[{ key: 'rot', match: 'RL result' }]} />
            <CodeSnippet title="RL double rotation" code={`root->right = rotateRight(root->right);
root = rotateLeft(root);`} />
          </SubPoint>

          <div className="law" style={{ marginTop: 16 }}>
            <b>Final AVL decision table:</b><br />
            LL → Right rotation · RR → Left rotation · LR → Left then Right · RL → Right then Left.
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <Link className="btn play" to="/lab">Replay all four rotations in Live Lab</Link>
            <Link className="btn enq" to="/practice">Unit IV Practice Questions</Link>
          </div>
        </TeachingPoint>

        <section className="card tip-card">
          <b>Classroom order:</b> Do not send students to a separate theory page and then a separate program page. Start at Point 1, finish its explanation and visual examples, then Point 2. Inside operations, finish Insert completely before Search, and finish Search before Delete. Inside AVL, finish LL and RR before LR and RL.
        </section>
      </div>
    </div>
  )
}

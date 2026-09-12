import { Link, useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { THEORY_FIGURES, type Fig } from '../data/figures'
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
  | 'single-rotation'
  | 'double-rotation'

type ViewId = 'theory' | 'visualization' | 'program'

type TopicMeta = {
  no: number
  label: string
  title: string
  official: string
}

const TOPICS: Record<TopicId, TopicMeta> = {
  definition: { no: 1, label: 'Definition', title: 'Tree Definition and Fundamentals', official: 'Definition' },
  traversal: { no: 2, label: 'Traversal', title: 'Tree Traversal', official: 'Traversal' },
  linked: { no: 3, label: 'Linked Implementation', title: 'Linked Implementation of Binary Tree', official: 'Linked implementation' },
  'binary-ops': { no: 4, label: 'Binary Tree Operations', title: 'Operations on Binary Trees', official: 'Operations on Binary Trees: insert, delete, search operations' },
  'bst-ops': { no: 5, label: 'BST Operations', title: 'Binary Search Tree Operations', official: 'Binary Search Trees: insert, delete, search operations' },
  multiway: { no: 6, label: 'Multiway Trees', title: 'Multiway Trees', official: 'Multiway Trees' },
  btree: { no: 7, label: 'B-Trees', title: 'B-Trees', official: 'B trees' },
  avl: { no: 8, label: 'AVL Tree', title: 'AVL Tree and Balance Factor', official: 'AVL Tree' },
  'single-rotation': { no: 9, label: 'Single Rotation', title: 'Single Rotation of AVL Trees', official: 'Single rotation of AVL Trees' },
  'double-rotation': { no: 10, label: 'Double Rotation', title: 'Double Rotation of AVL Trees', official: 'Double rotation of AVL Trees' },
}

function isTopic(value: string | null): value is TopicId {
  return !!value && Object.prototype.hasOwnProperty.call(TOPICS, value)
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

function collect(keys: string[], titleWords: string[] = [], limit = 8) {
  const all = keys.flatMap((key) => THEORY_FIGURES[key] ?? [])
  const filtered = titleWords.length
    ? all.filter((fig) => titleWords.some((word) => fig.title.toLowerCase().includes(word.toLowerCase())))
    : all
  return filtered.slice(0, limit)
}

function Flow({ children }: { children: ReactNode }) {
  return <div className="topic-flow">{children}</div>
}

function TheoryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="topic-card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function ProgramBox({ title, code }: { title: string; code: string }) {
  return (
    <section className="program-box">
      <h3>{title}</h3>
      <pre>{code}</pre>
    </section>
  )
}

function VisualGallery({ figures, intro }: { figures: Fig[]; intro: string }) {
  return (
    <>
      <div className="visual-intro">{intro}</div>
      {figures.length ? (
        <div className="visual-grid">
          {figures.map((fig, index) => (
            <figure className="visual-card" key={`${fig.title}-${index}`}>
              <figcaption><b>Example {index + 1}</b> · {fig.title}</figcaption>
              <FigureView fig={fig} />
              <p>{fig.caption}</p>
            </figure>
          ))}
        </div>
      ) : (
        <div className="visual-empty">Worked trace is shown in the steps below.</div>
      )}
    </>
  )
}

const nodeProgram = `#include <stdio.h>
#include <stdlib.h>

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
}`

const traversalProgram = `${nodeProgram}

void preorder(struct Node *root) {
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
}`

const btOpsProgram = `${nodeProgram}

struct Node *searchBT(struct Node *root, int key) {
    if (root == NULL || root->data == key) return root;
    struct Node *leftResult = searchBT(root->left, key);
    if (leftResult != NULL) return leftResult;
    return searchBT(root->right, key);
}

struct Node *insertBT(struct Node *root, int key) {
    struct Node *q[100];
    int front = 0, rear = 0;
    if (root == NULL) return createNode(key);
    q[rear++] = root;
    while (front < rear) {
        struct Node *cur = q[front++];
        if (cur->left == NULL) {
            cur->left = createNode(key);
            return root;
        }
        q[rear++] = cur->left;
        if (cur->right == NULL) {
            cur->right = createNode(key);
            return root;
        }
        q[rear++] = cur->right;
    }
    return root;
}

/* General BT delete idea:
   find target + deepest-rightmost node,
   copy deepest value into target,
   then disconnect and free deepest node. */`

const bstProgram = `${nodeProgram}

struct Node *insertBST(struct Node *root, int key) {
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
        root = key < root->data ? root->left : root->right;
    }
    return NULL;
}

struct Node *minNode(struct Node *root) {
    while (root && root->left) root = root->left;
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
}`

const multiwayProgram = `#define M 4

struct MNode {
    int keyCount;
    int keys[M - 1];
    struct MNode *child[M];
};

/* For order M:
   maximum children = M
   maximum keys = M - 1 */`

const btreeProgram = `#define MAX_KEYS 3

struct BNode {
    int n;
    int keys[MAX_KEYS];
    struct BNode *child[MAX_KEYS + 1];
    int leaf;
};

struct BNode *btreeSearch(struct BNode *x, int key) {
    int i = 0;
    while (i < x->n && key > x->keys[i]) i++;
    if (i < x->n && key == x->keys[i]) return x;
    if (x->leaf) return NULL;
    return btreeSearch(x->child[i], key);
}

/* Insertion:
   descend to correct leaf,
   insert in sorted order,
   split on overflow,
   promote median to parent. */`

const avlProgram = `${nodeProgram}

int height(struct Node *n) {
    if (n == NULL) return 0;
    int hl = height(n->left);
    int hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

int balanceFactor(struct Node *n) {
    if (n == NULL) return 0;
    return height(n->left) - height(n->right);
}`

const singleRotationProgram = `struct Node *rotateRight(struct Node *z) {
    struct Node *y = z->left;
    struct Node *T3 = y->right;
    y->right = z;
    z->left = T3;
    return y;
}

struct Node *rotateLeft(struct Node *z) {
    struct Node *y = z->right;
    struct Node *T2 = y->left;
    y->left = z;
    z->right = T2;
    return y;
}

/* LL -> rotateRight(unbalancedNode)
   RR -> rotateLeft(unbalancedNode) */`

const doubleRotationProgram = `/* LR case */
root->left = rotateLeft(root->left);
root = rotateRight(root);

/* RL case */
root->right = rotateRight(root->right);
root = rotateLeft(root);`

function TheoryContent({ topic }: { topic: TopicId }) {
  switch (topic) {
    case 'definition':
      return (
        <>
          <TheoryCard title="Tree definition">
            <p>A <b>tree</b> is a non-linear hierarchical data structure made of nodes connected by edges. It has one root, no cycles, and every node except the root has exactly one parent.</p>
            <Flow><b>Core property:</b> a tree with n nodes has exactly n − 1 edges.</Flow>
          </TheoryCard>
          <TheoryCard title="Important terminology">
            <div className="term-grid">
              <span><b>Root</b><small>topmost node</small></span>
              <span><b>Parent / Child</b><small>direct upper/lower relation</small></span>
              <span><b>Sibling</b><small>same parent</small></span>
              <span><b>Leaf</b><small>no children</small></span>
              <span><b>Degree</b><small>number of children</small></span>
              <span><b>Level / Depth</b><small>distance from root</small></span>
              <span><b>Height</b><small>longest downward path</small></span>
              <span><b>Subtree</b><small>node with descendants</small></span>
            </div>
          </TheoryCard>
          <TheoryCard title="Binary Tree basics">
            <p>A <b>Binary Tree</b> allows at most two children per node: left and right. Important shapes are Full, Complete, Perfect and Skewed.</p>
          </TheoryCard>
        </>
      )
    case 'traversal':
      return (
        <>
          <TheoryCard title="Traversal meaning"><p>Traversal means visiting every node exactly once in a systematic order.</p></TheoryCard>
          <TheoryCard title="Preorder"><Flow><b>Root → Left → Right</b></Flow><p>Visit the root first, then left subtree, then right subtree.</p></TheoryCard>
          <TheoryCard title="Inorder"><Flow><b>Left → Root → Right</b></Flow><p>For a BST, inorder gives keys in ascending order.</p></TheoryCard>
          <TheoryCard title="Postorder"><Flow><b>Left → Right → Root</b></Flow><p>Both subtrees are processed before the parent.</p></TheoryCard>
          <TheoryCard title="Level order"><Flow><b>Level by level using a queue</b></Flow><p>Visit root, then all nodes of the next level, and continue until the queue becomes empty.</p></TheoryCard>
        </>
      )
    case 'linked':
      return (
        <>
          <TheoryCard title="Linked representation"><p>Each node stores <b>left pointer + data + right pointer</b>. Missing children are represented by NULL.</p></TheoryCard>
          <TheoryCard title="Creation steps"><Flow>malloc memory → store data → left = NULL → right = NULL → connect node through parent pointer.</Flow></TheoryCard>
        </>
      )
    case 'binary-ops':
      return (
        <>
          <TheoryCard title="Binary Tree insert"><p>A normal Binary Tree has no ordering rule. A common method is level-order insertion into the first available child position.</p><Flow>Queue root → inspect left → inspect right → insert at first NULL link.</Flow></TheoryCard>
          <TheoryCard title="Binary Tree search"><p>Because values are not ordered, search may inspect every node. Worst case is O(n).</p><Flow>Compare node → search left subtree → search right subtree.</Flow></TheoryCard>
          <TheoryCard title="Binary Tree delete"><p>A common method replaces the target by the deepest-rightmost node and then removes that deepest node.</p><Flow>Find target → find deepest-rightmost → copy value → remove deepest.</Flow></TheoryCard>
        </>
      )
    case 'bst-ops':
      return (
        <>
          <TheoryCard title="BST rule"><Flow><b>Left subtree &lt; Root &lt; Right subtree</b></Flow><p>This ordering makes search, insertion and deletion directional.</p></TheoryCard>
          <TheoryCard title="BST insert"><Flow>Compare key → smaller goes left → larger goes right → insert at first NULL.</Flow></TheoryCard>
          <TheoryCard title="BST search"><Flow>Equal = found → smaller = left → larger = right.</Flow></TheoryCard>
          <TheoryCard title="BST delete: three cases">
            <div className="case-grid"><span><b>Case 1</b><small>Leaf: remove directly</small></span><span><b>Case 2</b><small>One child: bypass node</small></span><span><b>Case 3</b><small>Two children: replace with inorder successor</small></span></div>
          </TheoryCard>
        </>
      )
    case 'multiway':
      return (
        <>
          <TheoryCard title="Multiway Tree"><p>A Multiway Tree allows more than two children and may store multiple separator keys in one node.</p></TheoryCard>
          <TheoryCard title="Why it is useful"><Flow>Higher branching factor → smaller tree height → fewer node accesses.</Flow><p>It is the foundation for B-Trees used in storage and indexing.</p></TheoryCard>
        </>
      )
    case 'btree':
      return (
        <>
          <TheoryCard title="B-Tree properties"><p>A B-Tree is a balanced multiway search tree. Keys inside each node are sorted and all leaves remain at the same level.</p></TheoryCard>
          <TheoryCard title="Search"><Flow>Search keys inside node → choose correct child range → repeat.</Flow></TheoryCard>
          <TheoryCard title="Insertion and split"><Flow>Find leaf → insert sorted → overflow? split → promote median → repeat upward if needed.</Flow></TheoryCard>
          <TheoryCard title="Deletion"><Flow>Delete key → underflow? borrow from sibling → if impossible, merge with sibling.</Flow></TheoryCard>
        </>
      )
    case 'avl':
      return (
        <>
          <TheoryCard title="AVL definition"><p>An AVL Tree is a self-balancing Binary Search Tree.</p></TheoryCard>
          <TheoryCard title="Balance Factor"><Flow><b>BF = height(left) − height(right)</b></Flow><p>Valid values are −1, 0 and +1. BF +2 or −2 means rebalancing is required.</p></TheoryCard>
          <TheoryCard title="AVL insertion idea"><Flow>BST insert → update height → calculate BF → identify imbalance → rotate.</Flow></TheoryCard>
        </>
      )
    case 'single-rotation':
      return (
        <>
          <TheoryCard title="LL Case"><p>Insertion occurs in the left subtree of the left child.</p><Flow><b>LL → one Right Rotation</b></Flow><p>Example: 30, 20, 10 becomes root 20 with children 10 and 30.</p></TheoryCard>
          <TheoryCard title="RR Case"><p>Insertion occurs in the right subtree of the right child.</p><Flow><b>RR → one Left Rotation</b></Flow><p>Example: 10, 20, 30 becomes root 20 with children 10 and 30.</p></TheoryCard>
        </>
      )
    case 'double-rotation':
      return (
        <>
          <TheoryCard title="LR Case"><p>Insertion occurs in the right subtree of the left child.</p><Flow><b>LR → Left rotation on child → Right rotation on root</b></Flow><p>Example: 30, 10, 20.</p></TheoryCard>
          <TheoryCard title="RL Case"><p>Insertion occurs in the left subtree of the right child.</p><Flow><b>RL → Right rotation on child → Left rotation on root</b></Flow><p>Example: 10, 30, 20.</p></TheoryCard>
        </>
      )
  }
}

function VisualContent({ topic }: { topic: TopicId }) {
  const map: Record<TopicId, { keys: string[]; words?: string[]; intro: string }> = {
    definition: { keys: ['intro', 'shapes'], intro: 'Use these diagrams to identify root, parent, child, sibling, leaf, level, height, and Binary Tree shapes.' },
    traversal: { keys: ['trav'], intro: 'Run the same tree through Preorder, Inorder, Postorder and Level Order. Say the visit order while pointing at nodes.' },
    linked: { keys: ['repr', 'binary'], intro: 'Connect the logical tree drawing with the actual memory layout: data field plus left and right addresses.' },
    'binary-ops': { keys: ['binary', 'ops'], intro: 'Follow insertion, search and general Binary Tree deletion step by step. Notice there is no smaller-left/larger-right rule.' },
    'bst-ops': { keys: ['bst', 'bst-ops'], intro: 'Trace every comparison. Insert, search and the three deletion cases all depend on the BST ordering law.' },
    multiway: { keys: ['multi'], intro: 'Observe how one node stores multiple separator keys and creates more than two child ranges.' },
    btree: { keys: ['bsearch', 'bsplit', 'bdel', 'multi'], intro: 'Study search first, then insertion with median split, then deletion with borrow and merge.' },
    avl: { keys: ['avl', 'avl-ops'], intro: 'Compare balanced and unbalanced BSTs and calculate the Balance Factor at each node.' },
    'single-rotation': { keys: ['rot', 'avl'], words: ['LL', 'RR'], intro: 'Single rotation has two cases only: LL uses a right rotation and RR uses a left rotation.' },
    'double-rotation': { keys: ['rot', 'avl'], words: ['LR', 'RL'], intro: 'Double rotation has two cases: LR uses Left + Right, while RL uses Right + Left.' },
  }
  const cfg = map[topic]
  return <VisualGallery figures={collect(cfg.keys, cfg.words ?? [], 10)} intro={cfg.intro} />
}

function ProgramContent({ topic }: { topic: TopicId }) {
  switch (topic) {
    case 'definition': return <ProgramBox title="C structure for Binary Tree node" code={nodeProgram} />
    case 'traversal': return <ProgramBox title="Preorder, Inorder and Postorder in C" code={traversalProgram} />
    case 'linked': return <ProgramBox title="Linked node creation in C" code={nodeProgram} />
    case 'binary-ops': return <ProgramBox title="Binary Tree Insert + Search + Delete logic" code={btOpsProgram} />
    case 'bst-ops': return <ProgramBox title="BST Insert + Search + Delete" code={bstProgram} />
    case 'multiway': return <ProgramBox title="Multiway node representation" code={multiwayProgram} />
    case 'btree': return <ProgramBox title="B-Tree node and search function" code={btreeProgram} />
    case 'avl': return <ProgramBox title="AVL height and Balance Factor" code={avlProgram} />
    case 'single-rotation': return <ProgramBox title="LL and RR single rotations" code={singleRotationProgram} />
    case 'double-rotation': return <ProgramBox title="LR and RL double rotation calls" code={doubleRotationProgram} />
  }
}

export function CoursePage() {
  const [params] = useSearchParams()
  const topic: TopicId = isTopic(params.get('topic')) ? params.get('topic') : 'definition'
  const view: ViewId = isView(params.get('view')) ? params.get('view') : 'theory'
  const meta = TOPICS[topic]

  return (
    <div className="course-page">
      <section className="selected-topic-header">
        <div className="point-pill">SYLLABUS POINT {meta.no}</div>
        <h2>{meta.title}</h2>
        <p><b>Official syllabus:</b> {meta.official}</p>
      </section>

      <nav className="inside-topic-menu" aria-label={`${meta.label} sections`}>
        <Link to={`/?topic=${topic}&view=theory`} className={view === 'theory' ? 'active' : undefined}>
          <span>01</span><b>Theory</b><small>Concepts, rules, algorithms</small>
        </Link>
        <Link to={`/?topic=${topic}&view=visualization`} className={view === 'visualization' ? 'active' : undefined}>
          <span>02</span><b>Visualization</b><small>Diagrams, examples, real traces</small>
        </Link>
        <Link to={`/?topic=${topic}&view=program`} className={view === 'program' ? 'active' : undefined}>
          <span>03</span><b>Program</b><small>C code for this syllabus point</small>
        </Link>
      </nav>

      <section className="selected-view">
        <div className="selected-view-title">
          <span>{view === 'theory' ? 'THEORY' : view === 'visualization' ? 'VISUALIZATION' : 'PROGRAM'}</span>
          <h3>{meta.label}</h3>
        </div>
        {view === 'theory' && <TheoryContent topic={topic} />}
        {view === 'visualization' && <VisualContent topic={topic} />}
        {view === 'program' && <ProgramContent topic={topic} />}
      </section>
    </div>
  )
}

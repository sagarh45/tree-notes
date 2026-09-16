import type { Chapter } from './types'
import { BINARY_OPERATIONS } from './binary-operations'

const NODE_STRUCT = `struct Node {
    int data;             /* the value stored          */
    struct Node *left;    /* address of left child     */
    struct Node *right;   /* address of right child    */
};`

const CREATE_NODE = `struct Node *createNode(int value) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data  = value;
    n->left  = NULL;      /* no children yet */
    n->right = NULL;
    return n;
}`

const INSERT_FN = `/* Insert like a BST: smaller goes left, bigger goes right */
struct Node *insert(struct Node *root, int value) {
    if (root == NULL)                 /* empty spot found */
        return createNode(value);
    if (value < root->data)
        root->left  = insert(root->left,  value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;                      /* unchanged root comes back */
}`

export const CH2_BINARY: Chapter = {
  id: 'ch2',
  number: 2,
  title: 'Binary Tree',
  syllabus: 'Binary Tree ADT · types · properties · array and linked representation · construction · expression tree',
  emoji: '🌿',
  topics: [
    {
      id: 'bt-def',
      title: 'Binary tree — definition',
      tagline: 'At most two children, and the two sides have names: left and right.',
      definition:
        'A <b>binary tree</b> is a finite set of nodes that is either <b>empty</b>, or consists of a <b>root</b> and two disjoint binary trees called the <b>left subtree</b> and the <b>right subtree</b>. Every node has <b>0, 1 or 2</b> children.',
      simple: `
<p>A binary tree is a tree with one extra rule: <b>maximum two children</b>. And the children are <b>ordered</b> — one is the <b>left</b> child, the other is the <b>right</b> child.</p>
<p>So "only a left child" and "only a right child" are <b>different</b> binary trees, even if the values are the same.</p>`,
      points: [
        'The definition is <b>recursive</b>: a binary tree = root + left binary tree + right binary tree.',
        'An <b>empty</b> tree (root = NULL) is also a valid binary tree.',
        'Left subtree and right subtree never share a node (they are <b>disjoint</b>).',
      ],
      diagrams: [
        {
          kind: 'tree',
          title: 'Binary tree — root A, left subtree {B, D, E}, right subtree {C, F, G}',
          spec: 'A(B(D,E),C(F,G))',
          edgeLabels: true,
          caption: 'L / R written on the edges. B is the root of the left subtree, C is the root of the right subtree.',
        },
        {
          kind: 'tree',
          title: 'These two are DIFFERENT binary trees',
          spec: 'A(B,)',
          edgeLabels: true,
          caption: 'B as LEFT child of A …',
        },
        {
          kind: 'tree',
          title: '… and B as RIGHT child of A',
          spec: 'A(,B)',
          edgeLabels: true,
          caption: 'Same values, different tree. In a general tree these would be the same; in a binary tree they are not.',
        },
      ],
      syntax: [
        {
          title: 'Node structure (one node = data + two pointers)',
          code: NODE_STRUCT,
          note: 'Draw it in the exam as a box with three parts:  [ left | data | right ]',
        },
      ],
      tips: [
        'Always say <b>"at most two"</b>, not "two". A node may have 0 or 1 child too.',
        'Mention that left and right are <b>distinguished</b> (ordered). That is the one word examiners look for.',
      ],
    },

    {
      id: 'bt-types',
      title: 'Types of binary tree',
      tagline: 'Strict (full) · complete (perfect) · almost complete · skewed · extended.',
      definition: `
<b>Strictly (full) binary tree</b>: every node has 0 or 2 children.<br/>
<b>Complete (perfect) binary tree</b>: all levels are completely filled — maximum nodes for its height.<br/>
<b>Almost complete binary tree</b>: all levels full except the last, and the last level is filled from <b>left to right</b>.<br/>
<b>Skewed (degenerate) binary tree</b>: every node has only one child — left-skewed or right-skewed.<br/>
<b>Extended binary tree (2-tree)</b>: a binary tree in which every empty child pointer is replaced by a special <b>external</b> (dummy) node.`,
      simple: `
<p>These names only describe the <b>shape</b>:</p>
<ul>
<li><b>Strict / full</b>: nobody has exactly one child.</li>
<li><b>Complete / perfect</b>: a full triangle — every level is packed.</li>
<li><b>Almost complete</b>: a triangle with the bottom row filled from the left (this is the heap shape).</li>
<li><b>Skewed</b>: a straight line — the worst shape, it behaves like a linked list.</li>
<li><b>Extended</b>: draw a small square for every NULL. Squares = external nodes, circles = internal nodes.</li>
</ul>
<p class="muted"><b>Careful:</b> the class notes call the fully-packed tree "complete". Many other books call that one "perfect" and use "complete" for what our notes call "almost complete". Write the definition next to the name and you are safe in both worlds.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Strictly binary tree — every node has 0 or 2 children',
          spec: 'A(B(D,E(H,I)),C(F,G))',
          caption: 'No node has exactly one child. Leaves = D, H, I, F, G (L = 5). Total nodes = 2L − 1 = 9 ✓.',
        },
        {
          kind: 'tree',
          title: 'Complete (perfect) binary tree of height 3 — 15 nodes',
          seq: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15],
          caption: 'Levels hold 1, 2, 4, 8 nodes. Total = 2^(3+1) − 1 = 15. Leaves = 8 = non-leaves (7) + 1.',
        },
        {
          kind: 'tree',
          title: 'Almost complete binary tree — last level filled from the left',
          seq: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7],
          caption: 'Levels 0–2 are full. Level 3 has 4 of 8 nodes, all pushed to the left. This is the shape a heap always has.',
        },
        {
          kind: 'tree',
          title: 'Right-skewed binary tree',
          seq: [10, 20, 30, 40],
          caption: 'Insert 10, 20, 30, 40 (sorted!) into a BST and you get this stick. Height = n − 1 = 3.',
        },
        {
          kind: 'tree',
          title: 'Left-skewed binary tree',
          seq: [40, 30, 20, 10],
          caption: 'Same problem in the other direction. Search becomes O(n).',
        },
        {
          kind: 'tree',
          title: 'Extended binary tree — the ∅ stubs are the external nodes',
          spec: 'A(B(D,),C)',
          showNulls: true,
          caption: 'Internal nodes (circles) = 4, external nodes (∅) = 5. External = internal + 1 always.',
        },
      ],
      formulas: [
        'Strictly binary tree with <b>L</b> leaves has exactly <b>2L − 1</b> nodes (and L − 1 internal nodes).',
        'Complete (perfect) tree of height <b>h</b>: nodes = <b>2<sup>h+1</sup> − 1</b>, leaves = <b>2<sup>h</sup></b>.',
        'In a complete (perfect) tree: <b>leaves = non-leaves + 1</b>.',
        'Extended binary tree: <b>external nodes = internal nodes + 1</b>.',
        'Skewed tree with n nodes: height = <b>n − 1</b> (worst possible).',
      ],
      example: {
        title: 'classify the shape',
        html: `
<table class="table"><thead><tr><th>Tree</th><th>Strict?</th><th>Complete (all levels full)?</th><th>Almost complete?</th></tr></thead><tbody>
<tr><td>1 → 2, 1 → 3</td><td>Yes</td><td>Yes (h = 1, 3 nodes)</td><td>Yes</td></tr>
<tr><td>1 → 2, 1 → 3, 2 → 4</td><td><b>No</b> (2 has one child)</td><td>No</td><td>Yes (last level from the left)</td></tr>
<tr><td>1 → 2, 1 → 3, 3 → 6</td><td>No</td><td>No</td><td><b>No</b> (gap on the left of level 2)</td></tr>
<tr><td>1 → 2 → 3 → 4 (chain)</td><td>No</td><td>No</td><td>No — skewed</td></tr>
</tbody></table>`,
      },
      tips: [
        'When asked "how many nodes in a strictly binary tree with 6 leaves?" → 2·6 − 1 = <b>11</b>.',
        'When asked "maximum nodes with height 4?" → 2<sup>5</sup> − 1 = <b>31</b>.',
      ],
      mistakes: ['Mixing "complete" and "full". Write the definition in brackets after the name every time.'],
    },

    {
      id: 'bt-props',
      title: 'Properties of a binary tree (formulas)',
      tagline: 'Every number an examiner can ask, with a check.',
      definition:
        'For a binary tree with <b>n</b> nodes and height <b>h</b> (root at level 0, height counted in edges): maximum nodes at level <i>l</i> = 2<sup>l</sup>; maximum nodes in the tree = 2<sup>h+1</sup> − 1; minimum height = ⌈log₂(n + 1)⌉ − 1; maximum height = n − 1; edges = n − 1.',
      simple: `
<p>A binary tree of height h can be <b>fat</b> (every level packed) or <b>thin</b> (a stick). Every formula is just "how many nodes fit when it is fattest / thinnest".</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Fattest tree of height 2 → 7 nodes',
          seq: [4, 2, 6, 1, 3, 5, 7],
          caption: '1 + 2 + 4 = 7 = 2³ − 1.',
        },
        {
          kind: 'tree',
          title: 'Thinnest tree of height 2 → 3 nodes',
          seq: [1, 2, 3],
          caption: 'h + 1 = 3 nodes. Anything between 3 and 7 nodes can have height 2.',
        },
        {
          kind: 'tree',
          title: 'n + 1 NULL pointers (7 nodes → 8 ∅)',
          seq: [4, 2, 6, 1, 3, 5, 7],
          showNulls: true,
          caption: '7 nodes have 14 pointer fields; 6 are used as edges; 14 − 6 = 8 = n + 1 are NULL. Threaded trees reuse these.',
        },
      ],
      formulas: [
        'Max nodes at level <i>l</i> = <b>2<sup>l</sup></b> → level 0: 1, level 1: 2, level 2: 4, level 3: 8.',
        'Max nodes in a tree of height h = 2<sup>0</sup> + 2<sup>1</sup> + … + 2<sup>h</sup> = <b>2<sup>h+1</sup> − 1</b>.',
        'Min nodes in a tree of height h = <b>h + 1</b> (the stick).',
        'Min height for n nodes = <b>⌈log₂(n + 1)⌉ − 1</b>.  n = 7 → ⌈log₂8⌉ − 1 = 2.',
        'Max height for n nodes = <b>n − 1</b> (skewed).',
        'Number of edges = <b>n − 1</b>.',
        'Number of NULL pointers in the linked form = <b>n + 1</b>.',
        'Nodes with 2 children (n₂) and leaves (n₀): <b>n₀ = n₂ + 1</b> in ANY binary tree.',
        'Number of different binary tree <b>shapes</b> with n nodes = Catalan number = <b>(2n)! / ((n+1)!·n!)</b> → 1, 2, 5, 14, 42 for n = 1…5.',
      ],
      example: {
        title: 'typical numericals',
        html: `
<table class="table"><thead><tr><th>Question</th><th>Working</th><th>Answer</th></tr></thead><tbody>
<tr><td>Max nodes in a binary tree of height 4?</td><td>2<sup>4+1</sup> − 1</td><td><b>31</b></td></tr>
<tr><td>Max nodes at level 5?</td><td>2<sup>5</sup></td><td><b>32</b></td></tr>
<tr><td>Min height for 20 nodes?</td><td>⌈log₂ 21⌉ − 1 = 5 − 1</td><td><b>4</b></td></tr>
<tr><td>A binary tree has 10 nodes with two children. How many leaves?</td><td>n₀ = n₂ + 1</td><td><b>11</b></td></tr>
<tr><td>Strict binary tree has 15 nodes. Leaves?</td><td>n = 2L − 1 → L = 8</td><td><b>8</b></td></tr>
<tr><td>How many BSTs with keys 1, 2, 3?</td><td>Catalan C₃ = 6!/(4!·3!)</td><td><b>5</b></td></tr>
</tbody></table>`,
      },
      tips: [
        'If your book uses root = level 1, the formulas become 2<sup>l−1</sup> and 2<sup>h</sup> − 1. State your convention in line 1.',
        'n₀ = n₂ + 1 works for <b>every</b> binary tree, not only strict ones. Nodes with one child do not matter.',
      ],
    },

    {
      id: 'bt-linked',
      title: 'Linked representation of a binary tree',
      tagline: 'Each node = [ left | data | right ]. The tree is known by a pointer to the root.',
      definition:
        'In the <b>linked representation</b> every node is a structure with three fields: <b>left</b> (address of left child), <b>info / data</b> (the element), and <b>right</b> (address of right child). A pointer variable <b>root</b> stores the address of the root node; if the tree is empty, root = NULL. A missing child is shown by NULL.',
      simple: `
<p>Just like a linked list node has <code>data</code> and <code>next</code>, a tree node has <code>data</code>, <code>left</code> and <code>right</code>. Memory is taken with <code>malloc</code> only when a node is needed, so no space is wasted. This is the <b>most common</b> representation.</p>`,
      points: [
        '<b>Advantage</b>: any shape fits; insert/delete only change pointers; no wasted slots.',
        '<b>Disadvantage</b>: two extra pointers per node; n + 1 of the 2n pointers are NULL (wasted) — threaded trees fix this.',
      ],
      diagrams: [
        {
          kind: 'nodebox',
          title: 'Structure of one node',
          values: ['data'],
          caption: 'Left part = address of left child, middle = information, right part = address of right child.',
        },
        {
          kind: 'tree',
          title: 'Linked picture of A(B(D,E),C(,F)) — ∅ marks a NULL pointer',
          spec: 'A(B(D,E),C(,F))',
          showNulls: true,
          caption: '6 nodes → 12 pointer fields → 5 used, 7 NULL (= n + 1). C has NULL on the left because it has only a right child F.',
        },
        {
          kind: 'nodebox',
          title: 'Same tree written as boxes (read left→right: D, B, E, A, C, F)',
          values: ['D', 'B', 'E', 'A', 'C', 'F'],
          caption: 'In the exam draw arrows from the left/right part of a parent box to the child box, and write × (or NULL) in an empty part.',
        },
      ],
      syntax: [
        { title: 'Node declaration', code: NODE_STRUCT },
        { title: 'createNode() — make one node in memory', code: CREATE_NODE, note: 'malloc gives memory, we fill data and set both pointers to NULL.' },
        {
          title: 'Empty tree and root pointer',
          code: `struct Node *root = NULL;   /* empty tree */
root = createNode(50);      /* now the tree has one node: 50 */
root->left  = createNode(30);   /* hang 30 on the left  */
root->right = createNode(70);   /* hang 70 on the right */`,
          note: 'This "manual" hanging is only to show the idea. Real programs build the tree with insert() and keys typed by the user.',
        },
      ],
      tips: ['Draw the struct box AND the picture with NULL marks. Both together = full marks for "explain linked representation".'],
    },

    {
      id: 'bt-array',
      title: 'Array (sequential) representation',
      tagline: 'Position in the array tells you who the parent is — no pointers needed.',
      definition:
        'In the <b>array (sequential) representation</b> the root is stored at index <b>1</b>. For a node at index <b>i</b>: left child is at <b>2i</b>, right child at <b>2i + 1</b>, and its parent is at <b>⌊i / 2⌋</b>. A binary tree of height h needs an array of size <b>2<sup>h+1</sup> − 1</b>.',
      simple: `
<p>Number the nodes level by level, left to right, starting at 1. Put node number i into slot i. Now you never store pointers, because <b>the formula 2i / 2i+1 finds the children</b>.</p>
<p>Problem: if the tree is not "almost complete", many slots stay empty. A skewed tree of 4 nodes needs 15 slots and wastes 11. So arrays are used only for complete trees — that is exactly how a <b>heap</b> is stored.</p>`,
      points: [
        '<b>1-based</b> (class notes): left = 2i, right = 2i + 1, parent = i / 2.',
        '<b>0-based</b> (C arrays, heaps): left = 2i + 1, right = 2i + 2, parent = (i − 1) / 2.',
        'Efficient only for complete / almost complete trees; wasteful for skewed trees.',
      ],
      diagrams: [
        {
          kind: 'array',
          title: 'Complete tree → no empty slots',
          seq: [4, 2, 6, 1, 3, 5, 7],
          caption: 'Root 4 at [1]. Its children at [2] and [3]. Node at [3] (6) has children at [6] and [7]. Nothing is wasted.',
        },
        {
          kind: 'array',
          title: 'Tree of height 3 with gaps (from the notes) → empty slots appear',
          spec: 'A(B(D,E(,H)),C(,F(G,)))',
          caption: 'Array size 2⁴ − 1 = 15. Only 8 slots are used; 7 are empty (—). E is at [5], so its right child H is at 2·5 + 1 = [11].',
        },
        {
          kind: 'array',
          title: 'Right-skewed tree → most slots wasted',
          seq: [10, 20, 30, 40],
          caption: '4 nodes need 15 slots: [1], [3], [7], [15]. Eleven empty slots. This is why search trees use the linked form.',
        },
      ],
      formulas: [
        'left(i) = <b>2i</b>, right(i) = <b>2i + 1</b>, parent(i) = <b>⌊i/2⌋</b> (root at index 1).',
        'Array size needed for height h = <b>2<sup>h+1</sup> − 1</b>.',
        'For an almost-complete tree of n nodes, the last internal node is at index <b>⌊n/2⌋</b>.',
      ],
      syntax: [
        {
          title: 'Array form in C (1-based, slot 0 unused)',
          code: `#define MAX 100
int tree[MAX];          /* 0 = empty slot */

int left(int i)   { return 2 * i; }
int right(int i)  { return 2 * i + 1; }
int parent(int i) { return i / 2; }

/* example: tree[1] = 4; tree[2] = 2; tree[3] = 6; ... */`,
        },
      ],
      example: {
        title: 'find the position',
        html: `<p>Node X is stored at index <b>6</b>. Where are its children and parent?</p>
<ul>
<li>Left child: 2 × 6 = <b>12</b></li>
<li>Right child: 2 × 6 + 1 = <b>13</b></li>
<li>Parent: ⌊6 / 2⌋ = <b>3</b></li>
</ul>
<p>Node at index <b>9</b>: parent = ⌊9/2⌋ = 4, and since 9 is odd it is the <b>right</b> child of 4.</p>`,
      },
      tips: [
        'Compare the two representations in a 2-column table: memory, flexibility, wasted space, ease of finding parent. That is a classic 5-mark question.',
      ],
      mistakes: ['Mixing 0-based and 1-based formulas in one answer. Pick one and write it at the top.'],
    },

    {
      id: 'bt-construct',
      title: 'Construction of a binary tree from a list of keys',
      tagline: 'Class-notes example: 78, 26, 94, 43, 23, 14, 53, 76, 29',
      definition:
        'To construct a binary (search) tree from a sequence, the first key becomes the <b>root</b>. Every next key is compared from the root downward: go <b>left</b> if it is smaller, <b>right</b> if it is larger, until an empty position is found, and insert it there as a <b>leaf</b>.',
      simple: `
<p>Same rule at every node: <b>smaller → left, bigger → right</b>. A new key always ends up as a new <b>leaf</b>. Do it once by hand, then check with the visualizer.</p>`,
      diagrams: [
        {
          kind: 'tree-steps',
          title: 'Step by step: 78, 26, 94, 43, 23, 14, 53, 76, 29',
          seq: [78, 26, 94, 43, 23, 14, 53, 76, 29],
          caption: 'Blue = nodes compared on the way down. Orange = the newly inserted leaf.',
        },
      ],
      algorithm: [
        {
          title: 'insert(root, key)',
          steps: [
            'If <code>root</code> is NULL → create a new node with <code>key</code> and return it (this is the empty place).',
            'If <code>key &lt; root→data</code> → <code>root→left = insert(root→left, key)</code>.',
            'Else if <code>key &gt; root→data</code> → <code>root→right = insert(root→right, key)</code>.',
            '(Equal key: ignore it, or send it to one fixed side — say which.)',
            'Return <code>root</code>.',
          ],
        },
      ],
      syntax: [
        { title: 'createNode()', code: CREATE_NODE },
        { title: 'insert()', code: INSERT_FN },
      ],
      program: {
        title: 'Create a binary tree and display it using in-order traversal (class notes, Program 1)',
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int value) {
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->left = newNode->right = NULL;
    return newNode;
}

struct Node *insert(struct Node *root, int value) {
    if (root == NULL)
        return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

/* In-order: Left, Root, Right */
void inorder(struct Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node *root = NULL;
    int n, i, value;

    printf("How many keys? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        printf("Key %d: ", i + 1);
        scanf("%d", &value);
        root = insert(root, value);
    }

    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
        input: `How many keys? 7
Key 1: 50
Key 2: 30
Key 3: 70
Key 4: 20
Key 5: 40
Key 6: 60
Key 7: 80`,
        output: `Inorder Traversal: 20 30 40 50 60 70 80`,
      },
      example: {
        title: 'dry run of the first four keys',
        html: `
<table class="table"><thead><tr><th>Key</th><th>Path of comparisons</th><th>Placed as</th></tr></thead><tbody>
<tr><td>78</td><td>tree empty</td><td>root</td></tr>
<tr><td>26</td><td>26 &lt; 78 → left (empty)</td><td>left child of 78</td></tr>
<tr><td>94</td><td>94 &gt; 78 → right (empty)</td><td>right child of 78</td></tr>
<tr><td>43</td><td>43 &lt; 78 → left → 43 &gt; 26 → right (empty)</td><td>right child of 26</td></tr>
<tr><td>23</td><td>23 &lt; 78 → left → 23 &lt; 26 → left (empty)</td><td>left child of 26</td></tr>
</tbody></table>
<p>Continue the same way for 14, 53, 76, 29. Final in-order: 14 23 26 29 43 53 76 78 94 — sorted, which proves the tree is a BST.</p>`,
      },
      lab: 'bst',
      tips: ['After drawing, read the in-order from left to right. If it is not sorted, the drawing has a mistake.'],
    },

    {
      id: 'bt-expr',
      title: 'Expression tree',
      tagline: 'Operators inside, operands on the leaves.',
      definition:
        'An <b>expression tree</b> is a strictly binary tree that represents an arithmetic expression: every <b>internal node is an operator</b> and every <b>leaf is an operand</b>. In-order traversal gives the <b>infix</b> form, pre-order gives <b>prefix</b>, and post-order gives <b>postfix</b>.',
      simple: `
<p>The operator that is done <b>last</b> sits at the <b>root</b>. Brackets are never stored — the shape of the tree remembers the order of evaluation.</p>`,
      diagrams: [
        {
          kind: 'traversal',
          title: '(a + b) * c — post-order gives postfix a b + c *',
          spec: '*(+(a,b),c)',
          order: 'postorder',
          caption: 'Badge numbers = visiting order.',
        },
        {
          kind: 'traversal',
          title: 'a + b * c — * is deeper, so it is done first',
          spec: '+(a,*(b,c))',
          order: 'preorder',
          caption: 'Pre-order gives prefix + a * b c.',
        },
        {
          kind: 'tree',
          title: '(a − b) / (c + d) * e',
          spec: '*(/(-(a,b),+(c,d)),e)',
          caption: 'In-order (with brackets): ((a − b) / (c + d)) * e. Post-order: a b − c d + / e *.',
        },
      ],
      algorithm: [
        {
          title: 'build an expression tree from postfix (uses a stack)',
          steps: [
            'Read the postfix string left to right.',
            'If the symbol is an <b>operand</b> → make a leaf node and <b>push</b> it.',
            'If the symbol is an <b>operator</b> → <b>pop two</b> nodes; the first popped becomes the <b>right</b> child, the second the <b>left</b> child; make the operator node their parent and push it.',
            'At the end the stack holds exactly one node — the <b>root</b>.',
          ],
        },
        {
          title: 'evaluate an expression tree',
          steps: [
            'If the node is a leaf → return its number.',
            'Otherwise evaluate the left subtree (L) and the right subtree (R).',
            'Apply the operator of the node to L and R and return the result. (This is a post-order walk.)',
          ],
        },
      ],
      syntax: [
        {
          title: 'evaluate() in C (node stores a char op or an int value)',
          code: `int evaluate(struct ENode *n) {
    if (n->left == NULL && n->right == NULL)   /* leaf = operand */
        return n->value;
    int L = evaluate(n->left);
    int R = evaluate(n->right);
    switch (n->op) {
        case '+': return L + R;
        case '-': return L - R;
        case '*': return L * R;
        default : return L / R;
    }
}`,
        },
      ],
      example: {
        title: 'build from postfix  a b + c *',
        html: `
<table class="table"><thead><tr><th>Read</th><th>Action</th><th>Stack (top on right)</th></tr></thead><tbody>
<tr><td>a</td><td>operand → push leaf</td><td>a</td></tr>
<tr><td>b</td><td>operand → push leaf</td><td>a, b</td></tr>
<tr><td>+</td><td>pop b (right), pop a (left) → push (+)</td><td>(a + b)</td></tr>
<tr><td>c</td><td>push leaf</td><td>(a + b), c</td></tr>
<tr><td>*</td><td>pop c (right), pop (a+b) (left) → push (*)</td><td>((a + b) * c) = root</td></tr>
</tbody></table>`,
      },
      tips: [
        'Prefix / infix / postfix are just the three traversals of the same tree — that is the sentence to write.',
        'When popping for an operator, the <b>first pop is the RIGHT child</b>. Getting this backwards breaks subtraction and division.',
      ],
    },
    BINARY_OPERATIONS,
  ],
}

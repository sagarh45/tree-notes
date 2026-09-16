import type { Chapter } from './types'

const SAMPLE = '8(3(1,6(4,7)),10(,14(13,)))' // BST of 8,3,10,1,6,14,4,7,13

export const CH7_OPS: Chapter = {
  id: 'ch7',
  number: 7,
  title: 'Binary tree operations',
  syllabus: 'Height · count · leaves · mirror · copy · identical · LCA · diameter · paths',
  emoji: '🧰',
  topics: [
    {
      id: 'ops-idea',
      title: 'The one skeleton for every tree function',
      tagline: 'Solve left, solve right, combine. NULL is the base case.',
      definition:
        'Almost every “write a function on a binary tree” question has the same shape: <b>if the node is NULL return a base value; recurse on left; recurse on right; combine the two answers with the current node</b>.',
      simple: `
<p>You do not need a new idea for height, count, leaves, copy, identical… They are all the same four-line story. Learn the skeleton once.</p>
<pre class="tree-pic">TYPE f(node) {
    if (node == NULL) return BASE;
    L = f(node-&gt;left);
    R = f(node-&gt;right);
    return COMBINE(L, R, node);
}</pre>
<p>All pictures below use the same tree: insert <b>8, 3, 10, 1, 6, 14, 4, 7, 13</b>.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'The sample tree used in this chapter',
          spec: SAMPLE,
          caption: '9 nodes. Leaves: 1, 4, 7, 13. Height of root 8 is 3 (edges).',
        },
      ],
      tips: [
        'In the exam, write the skeleton first, then fill BASE and COMBINE. That already looks like a complete answer.',
      ],
    },

    {
      id: 'ops-height',
      title: 'Height, count, leaves, internal nodes',
      tagline: 'Four numbers, one walk.',
      definition:
        '<b>Height</b> of a node is the number of edges on the longest path down to a leaf (height of NULL = −1, height of a leaf = 0). <b>Count</b> is the number of nodes. A <b>leaf</b> has no children. An <b>internal</b> node has at least one child.',
      simple: `<p>Walk the tree once. At each node: height = 1 + taller child; count = 1 + left + right; a leaf is “both children NULL”.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Height of every node (leaf = 0)',
          spec: SAMPLE,
          tags: { '8': 'h=3', '3': 'h=2', '10': 'h=2', '1': 'h=0', '6': 'h=1', '14': 'h=1', '4': 'h=0', '7': 'h=0', '13': 'h=0' },
        },
        {
          kind: 'tree',
          title: 'Leaves highlighted',
          spec: SAMPLE,
          marks: { '1': 'found', '4': 'found', '7': 'found', '13': 'found' },
          dim: true,
          caption: '4 leaves. Internal nodes = 8, 3, 6, 10, 14 → 5. Check: 4 + 5 = 9.',
        },
      ],
      algorithm: [
        {
          title: 'height / count / leaves',
          steps: [
            'If node is NULL: height → −1, count → 0, leaves → 0.',
            'Otherwise compute the same three numbers on left and on right.',
            'height = 1 + max(hl, hr). count = 1 + cl + cr.',
            'If both children are NULL → this node is a leaf (return 1). Else leaves = leaves(left) + leaves(right).',
          ],
        },
      ],
      syntax: [
        {
          title: 'height, count, leaves',
          code: `int height(struct Node *n) {
    if (n == NULL) return -1;          /* empty tree */
    int hl = height(n->left);
    int hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

int count(struct Node *n) {
    if (n == NULL) return 0;
    return 1 + count(n->left) + count(n->right);
}

int leaves(struct Node *n) {
    if (n == NULL) return 0;
    if (n->left == NULL && n->right == NULL) return 1;
    return leaves(n->left) + leaves(n->right);
}`,
        },
      ],
      example: {
        title: 'bottom-up on the sample tree',
        html: `
<p>Leaves 1, 4, 7, 13 have height 0. height(6) = 1 + max(0,0) = 1. height(3) = 1 + max(0, 1) = <b>2</b>. height(14) = 1 + max(0, −1) = 1, so height(10) = 1 + max(−1, 1) = <b>2</b>. height(8) = 1 + max(2, 2) = <b>3</b>.</p>
<p>count = 9. leaves = 4. internal = 5.</p>`,
      },
      formulas: [
        'height(NULL) = <b>−1</b>, height(leaf) = <b>0</b>. Some books count nodes (leaf = 1) — write your convention.',
        'In a <b>full</b> binary tree, leaves = internal + 1.',
      ],
      mistakes: ['Returning 0 for height(NULL). That makes a leaf look like height 1. Use −1.'],
    },

    {
      id: 'ops-mirror',
      title: 'Mirror (and copy)',
      tagline: 'Swap every left with every right. Copy creates a new tree of the same shape.',
      definition:
        '<b>Mirroring</b> a binary tree swaps the left and right child of every node. <b>Copying</b> creates a brand-new tree with the same values and the same shape (pre-order: make the node, then attach the copied children).',
      simple: `<p>Mirror = reflection in a vertical mirror. A BST’s in-order becomes reverse-sorted after a mirror. Copy is the same walk, but you <code>malloc</code> a new node instead of swapping.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Original',
          spec: SAMPLE,
        },
        {
          kind: 'tree',
          title: 'After mirror — every left/right swapped',
          spec: '8(10(14(,13),),3(6(7,4),1))',
          caption: 'In-order of the mirror is 13 14 10 8 7 6 4 3 1 — reverse of the original.',
        },
      ],
      algorithm: [
        {
          title: 'mirror(n)',
          steps: [
            'If n is NULL, stop.',
            'Swap n→left and n→right.',
            'mirror(n→left); mirror(n→right). (Order of the two calls does not matter.)',
          ],
        },
        {
          title: 'copy(n)',
          steps: [
            'If n is NULL, return NULL.',
            'Create a new node with n→data. (This is pre-order — parent first.)',
            'new→left = copy(n→left); new→right = copy(n→right).',
            'Return the new node.',
          ],
        },
      ],
      syntax: [
        {
          title: 'mirror() and copy()',
          code: `void mirror(struct Node *n) {
    struct Node *t;
    if (n == NULL) return;
    t = n->left; n->left = n->right; n->right = t;
    mirror(n->left);
    mirror(n->right);
}

struct Node *copy(struct Node *n) {
    struct Node *c;
    if (n == NULL) return NULL;
    c = createNode(n->data);       /* parent first */
    c->left  = copy(n->left);
    c->right = copy(n->right);
    return c;
}`,
        },
      ],
      example: {
        title: 'why copy is pre-order and delete is post-order',
        html: `<p>To <b>copy</b> you must create the parent before you can attach children to it → visit the node first (pre-order). To <b>free</b> a tree you must free the children before you free the parent, otherwise you lose the pointers → visit the node last (post-order).</p>`,
      },
      tips: ['One sentence in the viva: “copy = pre-order, delete = post-order, in-order of a BST is sorted.”'],
    },

    {
      id: 'ops-same',
      title: 'Identical trees and LCA',
      tagline: 'Same shape + same values. LCA is the deepest common ancestor.',
      definition:
        'Two binary trees are <b>identical</b> if they are both empty, or their roots hold the same value and their left subtrees are identical and their right subtrees are identical. The <b>lowest common ancestor (LCA)</b> of two nodes is the deepest node that has both as descendants (a node is a descendant of itself).',
      simple: `<p>Identical = “walk both trees together; one mismatch and they are different.” LCA in a BST is even easier: walk from the root until the two keys split to different sides — that split node is the LCA.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'LCA of 4 and 7 is 6',
          spec: SAMPLE,
          marks: { '4': 'found', '7': 'found', '6': 'current' },
          dim: true,
          caption: '4 and 7 sit under 6. 3 and 8 are also common ancestors, but 6 is the lowest.',
        },
        {
          kind: 'tree',
          title: 'LCA of 1 and 14 is the root 8',
          spec: SAMPLE,
          marks: { '1': 'found', '14': 'found', '8': 'current' },
          dim: true,
          caption: 'The two keys are on opposite sides of 8, so 8 is the split point.',
        },
      ],
      algorithm: [
        {
          title: 'identical(a, b)',
          steps: [
            'If both are NULL → true. If exactly one is NULL → false.',
            'If a→data ≠ b→data → false.',
            'Return identical(a→left, b→left) AND identical(a→right, b→right).',
          ],
        },
        {
          title: 'lcaBST(root, p, q)  — for a BST',
          steps: [
            'If both p and q are smaller than root → LCA is in the left subtree.',
            'If both are larger → LCA is in the right subtree.',
            'Otherwise root is the split → return root.',
          ],
        },
      ],
      syntax: [
        {
          title: 'identical() and lcaBST()',
          code: `int identical(struct Node *a, struct Node *b) {
    if (a == NULL && b == NULL) return 1;
    if (a == NULL || b == NULL) return 0;
    return a->data == b->data
        && identical(a->left,  b->left)
        && identical(a->right, b->right);
}

struct Node *lcaBST(struct Node *r, int p, int q) {
    if (r == NULL) return NULL;
    if (p < r->data && q < r->data) return lcaBST(r->left,  p, q);
    if (p > r->data && q > r->data) return lcaBST(r->right, p, q);
    return r;                          /* split point */
}`,
        },
      ],
      example: {
        title: 'LCA of 4 and 7, then of 1 and 14',
        html: `<p>Start at 8. 4 and 7 are both &lt; 8 → go left to 3. Both &gt; 3 → go right to 6. 4 &lt; 6 and 7 &gt; 6 → <b>split at 6</b>.</p>
<p>1 and 14: 1 &lt; 8 &lt; 14 → already a split at the root.</p>`,
      },
    },

    {
      id: 'ops-dia',
      title: 'Diameter and root-to-leaf paths',
      tagline: 'Longest path in the tree. Print every path from the root to a leaf.',
      definition:
        'The <b>diameter</b> of a binary tree is the number of <b>edges</b> on the longest path between any two nodes (the path need not pass through the root). A <b>root-to-leaf path</b> is the sequence of nodes from the root down to one leaf.',
      simple: `<p>At every node the longest path that <i>bends</i> here is height(left) + height(right) + 2 (two edges up from the children). The diameter is the maximum of that number over all nodes. Paths: keep a running list, print it when you hit a leaf.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'A longest path: 4 — 6 — 3 — 8 — 10 — 14 — 13  (6 edges)',
          spec: SAMPLE,
          marks: { '4': 'path', '6': 'path', '3': 'path', '8': 'current', '10': 'path', '14': 'path', '13': 'path' },
          caption: 'Diameter = 6. It does go through the root in this tree, but that is not required.',
        },
      ],
      algorithm: [
        {
          title: 'diameter(n)',
          steps: [
            'If n is NULL, diameter = 0, height = −1.',
            'Compute (height, diameter) of left and of right.',
            'through = hl + hr + 2  (path that bends at n).',
            'diameter(n) = max(through, diaL, diaR). height(n) = 1 + max(hl, hr).',
          ],
        },
        {
          title: 'printPaths(n, path[])',
          steps: [
            'Append n→data to path.',
            'If n is a leaf → print the path.',
            'Else recurse on left and on right with the same path.',
            'Pop n→data before returning (backtrack).',
          ],
        },
      ],
      syntax: [
        {
          title: 'diameter (returns height, writes diameter) and printPaths',
          code: `int diaHelper(struct Node *n, int *dia) {
    if (n == NULL) return -1;
    int hl = diaHelper(n->left,  dia);
    int hr = diaHelper(n->right, dia);
    int through = hl + hr + 2;
    if (through > *dia) *dia = through;
    return 1 + (hl > hr ? hl : hr);
}

void printPaths(struct Node *n, int path[], int len) {
    if (n == NULL) return;
    path[len++] = n->data;
    if (n->left == NULL && n->right == NULL) {
        int i;
        for (i = 0; i < len; i++) printf("%d ", path[i]);
        printf("\\n");
        return;
    }
    printPaths(n->left,  path, len);
    printPaths(n->right, path, len);
}`,
        },
      ],
      example: {
        title: 'paths of the sample tree',
        html: `<pre>8 3 1
8 3 6 4
8 3 6 7
8 10 14 13</pre>
<p>Four leaves → four paths. Diameter 6 is the longest of 4–13 (through 8).</p>`,
      },
      program: {
        title: 'Menu: height, count, leaves, mirror, paths',
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *left, *right; };

struct Node *create(int v) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = v; n->left = n->right = NULL; return n;
}
struct Node *insert(struct Node *r, int v) {
    if (!r) return create(v);
    if (v < r->data) r->left = insert(r->left, v);
    else if (v > r->data) r->right = insert(r->right, v);
    return r;
}
int height(struct Node *n) {
    if (!n) return -1;
    int L = height(n->left), R = height(n->right);
    return 1 + (L > R ? L : R);
}
int count(struct Node *n) { return n ? 1 + count(n->left) + count(n->right) : 0; }
int leaves(struct Node *n) {
    if (!n) return 0;
    if (!n->left && !n->right) return 1;
    return leaves(n->left) + leaves(n->right);
}
void inorder(struct Node *n) { if (n) { inorder(n->left); printf("%d ", n->data); inorder(n->right); } }
void mirror(struct Node *n) {
    struct Node *t;
    if (!n) return;
    t = n->left; n->left = n->right; n->right = t;
    mirror(n->left); mirror(n->right);
}

int main() {
    struct Node *root = NULL;
    int n, v, i, ch;
    printf("How many keys? "); scanf("%d", &n);
    for (i = 0; i < n; i++) { scanf("%d", &v); root = insert(root, v); }
    printf("1.height  2.count  3.leaves  4.inorder  5.mirror\\nChoice: ");
    scanf("%d", &ch);
    if (ch == 1) printf("Height = %d\\n", height(root));
    else if (ch == 2) printf("Count = %d\\n", count(root));
    else if (ch == 3) printf("Leaves = %d\\n", leaves(root));
    else if (ch == 4) { inorder(root); printf("\\n"); }
    else if (ch == 5) { mirror(root); inorder(root); printf("\\n"); }
    return 0;
}`,
        input: `How many keys? 9
8 3 10 1 6 14 4 7 13
Choice: 1`,
        output: `Height = 3`,
      },
      complexity: [
        { op: 'height / count / leaves / mirror / copy', avg: 'Θ(n)', worst: 'Θ(n)', note: 'Must visit every node' },
        { op: 'LCA in a BST', avg: 'O(h)', worst: 'O(n)', note: 'One walk down' },
        { op: 'Diameter', avg: 'Θ(n)', worst: 'Θ(n)', note: 'One walk if you return height together' },
      ],
    },
  ],
}

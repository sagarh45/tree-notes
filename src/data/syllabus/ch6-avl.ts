import type { Chapter } from './types'

const AVL_HELPERS = `struct Node {
    int data, height;
    struct Node *left, *right;
};

int height(struct Node *n)      { return n ? n->height : 0; }
int max(int a, int b)           { return a > b ? a : b; }
int getBalance(struct Node *n)  { return n ? height(n->left) - height(n->right) : 0; }

struct Node *newNode(int key) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = key; n->left = n->right = NULL;
    n->height = 1;                      /* a new leaf has height 1 here */
    return n;
}`

const ROTATIONS = `/* Right rotation (used for LL) : y = z->left becomes the new root */
struct Node *rightRotate(struct Node *z) {
    struct Node *y  = z->left;
    struct Node *T2 = y->right;
    y->right = z;                       /* rotate */
    z->left  = T2;                      /* T2 moves across */
    z->height = 1 + max(height(z->left), height(z->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;                           /* new root of this subtree */
}

/* Left rotation (used for RR) : y = z->right becomes the new root */
struct Node *leftRotate(struct Node *z) {
    struct Node *y  = z->right;
    struct Node *T2 = y->left;
    y->left  = z;
    z->right = T2;
    z->height = 1 + max(height(z->left), height(z->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}`

const AVL_INSERT = `struct Node *insert(struct Node *node, int key) {
    /* 1. normal BST insert */
    if (node == NULL) return newNode(key);
    if (key < node->data)       node->left  = insert(node->left, key);
    else if (key > node->data)  node->right = insert(node->right, key);
    else return node;                                  /* no duplicates */

    /* 2. update height of this ancestor */
    node->height = 1 + max(height(node->left), height(node->right));

    /* 3. balance factor */
    int bf = getBalance(node);

    /* 4. four cases */
    if (bf > 1 && key < node->left->data)              /* LL */
        return rightRotate(node);
    if (bf < -1 && key > node->right->data)            /* RR */
        return leftRotate(node);
    if (bf > 1 && key > node->left->data) {            /* LR */
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (bf < -1 && key < node->right->data) {          /* RL */
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;                                       /* already balanced */
}`

export const CH6_AVL: Chapter = {
  id: 'ch6',
  number: 6,
  title: 'AVL Tree (height-balanced BST)',
  syllabus: 'AVL tree · balance factor · LL, RR, LR, RL rotations · insertion · deletion · search',
  emoji: '⚖️',
  topics: [
    {
      id: 'avl-def',
      title: 'AVL tree — definition and balance factor',
      tagline: 'A BST that refuses to become a stick.',
      definition:
        'An <b>AVL tree</b> (Adelson-Velsky and Landis, 1962) is a <b>height-balanced binary search tree</b>. For every node, the <b>balance factor</b> BF = height(left subtree) − height(right subtree) must be <b>−1, 0 or +1</b>. If any node gets BF = ±2 after an insertion or deletion, the tree is rebalanced with <b>rotations</b>. Height is always O(log n), so search, insert and delete are <b>O(log n)</b> in the worst case.',
      simple: `
<p>A normal BST can become skewed and slow. An AVL tree checks, at every node, that the left and right sides are <b>almost the same height</b> (difference at most 1). The moment the difference becomes 2, it fixes the shape with a rotation.</p>
<p><b>BF = +1</b>: left side is taller by one. <b>BF = 0</b>: equal. <b>BF = −1</b>: right side is taller by one. <b>BF = ±2</b>: unbalanced → rotate.</p>`,
      points: [
        'Every AVL tree is a BST; not every BST is an AVL tree.',
        'Balance factor is checked at <b>every</b> node, not only the root.',
        'Search is exactly the same as in a BST.',
      ],
      diagrams: [
        {
          kind: 'avl',
          title: 'An AVL tree — every BF is −1, 0 or +1',
          seq: [50, 30, 70, 20, 40, 60, 80, 10],
          caption: 'BF written above each node. Root 50 has BF +1 (left is taller by one), still allowed.',
        },
        {
          kind: 'tree',
          title: 'NOT an AVL tree — node 30 has BF +2',
          spec: '30(20(10,),)',
          showBf: true,
          marks: { 30: 'unbalanced' },
          caption: 'Left subtree of 30 has height 1, right subtree is empty (height −1) → BF = 1 − (−1) = +2. Not allowed → an LL rotation is needed.',
        },
        {
          kind: 'tree',
          title: 'Unbalanced: insert 10, 20, 30 into a plain BST',
          seq: [10, 20, 30],
          showBf: true,
          marks: { 10: 'unbalanced' },
          caption: 'BF of 10 = −2 (right height 1, left height −1). An AVL tree would rotate here.',
        },
      ],
      formulas: [
        '<b>BF(node) = height(left) − height(right)</b>, must be in {−1, 0, +1}.',
        'Height of an AVL tree with n nodes ≤ <b>1.44 log₂(n + 2)</b> → always O(log n).',
        'Minimum nodes in an AVL tree of height h: <b>N(h) = N(h−1) + N(h−2) + 1</b>, N(0) = 1, N(1) = 2 → 1, 2, 4, 7, 12, 20, 33 …',
      ],
      example: {
        title: 'why AVL?',
        html: `<p>BST operations cost O(h). A skewed BST has h = n, so O(n). AVL limits h to about 1.44·log₂n, so every operation is O(log n) — <b>guaranteed</b>, not just on average.</p>
<p>Minimum nodes for height 3 = N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = <b>7</b>. So an AVL tree with 7 nodes can be at most height 3, whereas a BST with 7 nodes can be height 6.</p>`,
      },
      lab: 'avl',
      tips: [
        'Write the BF formula and the allowed set {−1, 0, +1} in the very first line. Then say "invented by Adelson-Velsky and Landis in 1962".',
      ],
      mistakes: ['Computing BF as right − left. Then all the rotation cases flip. Stick to <b>left − right</b>.'],
    },

    {
      id: 'avl-rot',
      title: 'The four rotations — LL, RR, LR, RL',
      tagline: 'Name the case by the path from the unbalanced node to the new key.',
      definition: `Let <b>A</b> be the first node (from the inserted node upward) with BF = ±2.<br/>
<b>LL</b>: new node is in the <b>left</b> subtree of the <b>left</b> child of A → one <b>right</b> (clockwise) rotation at A.<br/>
<b>RR</b>: new node is in the <b>right</b> subtree of the <b>right</b> child of A → one <b>left</b> (anti-clockwise) rotation at A.<br/>
<b>LR</b>: new node is in the <b>right</b> subtree of the <b>left</b> child of A → left rotation at A's left child, then right rotation at A.<br/>
<b>RL</b>: new node is in the <b>left</b> subtree of the <b>right</b> child of A → right rotation at A's right child, then left rotation at A.<br/>
LL and RR are <b>single</b> rotations; LR and RL are <b>double</b> rotations.`,
      simple: `
<p>Walk two steps down from the unbalanced node <b>towards the new key</b>. Those two steps are the name of the case: <b>L</b>eft-<b>L</b>eft, <b>R</b>ight-<b>R</b>ight, <b>L</b>eft-<b>R</b>ight, <b>R</b>ight-<b>L</b>eft.</p>
<ul>
<li>Straight line (LL / RR) → <b>one</b> rotation: the middle node becomes the parent.</li>
<li>Zig-zag (LR / RL) → first straighten it (rotate the child), then it becomes LL / RR → rotate again.</li>
</ul>
<p>After every rotation the <b>middle value</b> of the three nodes ends up on top, the smallest on its left and the largest on its right. That is a quick sanity check.</p>`,
      diagrams: [
        { kind: 'avl-steps', title: 'LL case — insert 30, 20, 10', seq: [30, 20, 10], onlyRotations: true },
        { kind: 'avl-steps', title: 'RR case — insert 10, 20, 30', seq: [10, 20, 30], onlyRotations: true },
        { kind: 'avl-steps', title: 'LR case — insert 30, 10, 20', seq: [30, 10, 20], onlyRotations: true },
        { kind: 'avl-steps', title: 'RL case — insert 10, 30, 20', seq: [10, 30, 20], onlyRotations: true },
        {
          kind: 'ascii',
          title: 'General picture of the four cases (A = unbalanced, T = subtrees)',
          text: `LL:       A(+2)              B(0)
         /                  /    \\
        B(+1)     ===>     C      A
       /
      C

RR:   A(-2)                    B(0)
         \\                    /   \\
          B(-1)    ===>      A     C
            \\
             C

LR:   A(+2)          A(+2)           C(0)
     /              /               /   \\
    B(-1)   ==>    C(+1)   ==>     B     A
      \\           /
       C         B

RL:   A(-2)          A(-2)           C(0)
        \\              \\            /   \\
         B(+1)  ==>     C(-1) ==>  A     B
        /                 \\
       C                   B`,
          caption: 'In every case the final root is the middle value, with BF 0.',
        },
      ],
      algorithm: [
        {
          title: 'decide which rotation',
          steps: [
            'After inserting, go <b>up</b> from the new node and compute BF at each ancestor.',
            'Stop at the <b>first</b> node A with BF = +2 or −2.',
            'BF(A) = +2 → problem is on the LEFT. Look at A→left: if new key &lt; A→left→data → <b>LL</b>, else <b>LR</b>.',
            'BF(A) = −2 → problem is on the RIGHT. Look at A→right: if new key &gt; A→right→data → <b>RR</b>, else <b>RL</b>.',
            'Apply the rotation(s). Only the subtree at A changes; everything above stays.',
          ],
        },
        {
          title: 'right rotation at z (LL fix)',
          steps: ['y = z→left, T2 = y→right.', 'y→right = z.', 'z→left = T2.', 'Update heights of z then y.', 'Return y as the new root of this subtree.'],
        },
      ],
      syntax: [{ title: 'rightRotate() and leftRotate()', code: ROTATIONS, note: 'T2 (the middle subtree) is the only subtree that changes parent.' }],
      example: {
        title: 'name the case',
        html: `
<table class="table"><thead><tr><th>Insert order</th><th>Unbalanced node</th><th>Path to new key</th><th>Case</th><th>Result</th></tr></thead><tbody>
<tr><td>30, 20, 10</td><td>30 (BF +2)</td><td>left, left</td><td><b>LL</b> → right rotate 30</td><td>20(10, 30)</td></tr>
<tr><td>10, 20, 30</td><td>10 (BF −2)</td><td>right, right</td><td><b>RR</b> → left rotate 10</td><td>20(10, 30)</td></tr>
<tr><td>30, 10, 20</td><td>30 (BF +2)</td><td>left, right</td><td><b>LR</b> → left rotate 10, right rotate 30</td><td>20(10, 30)</td></tr>
<tr><td>10, 30, 20</td><td>10 (BF −2)</td><td>right, left</td><td><b>RL</b> → right rotate 30, left rotate 10</td><td>20(10, 30)</td></tr>
</tbody></table>
<p>All four give the same balanced tree 20(10, 30) — the middle key on top.</p>`,
      },
      lab: 'avl',
      tips: [
        'In the exam draw <b>three</b> pictures for a double rotation: before, after the first rotation, after the second.',
        'LR = "RR on the child, then LL on the node". RL = "LL on the child, then RR on the node".',
      ],
      mistakes: [
        'Rotating at the root instead of at the <b>first</b> unbalanced node on the way up.',
        'Forgetting to move T2 (the inner subtree) to the other side — the in-order changes and it stops being a BST.',
      ],
    },

    {
      id: 'avl-insert',
      title: 'Insertion in an AVL tree (with construction examples)',
      tagline: 'BST insert, then walk up, fix the first BF = ±2 you meet.',
      definition:
        'Insertion in an AVL tree = normal <b>BST insertion</b> as a leaf, followed by <b>updating the heights</b> of the ancestors and checking their balance factors. If a node becomes unbalanced (BF = ±2), apply the matching rotation (LL / RR / LR / RL). <b>At most one</b> single or double rotation is needed per insertion.',
      simple: `<p>Insert like a BST. Then climb back towards the root computing BF. First node with ±2 → rotate → done (one rotation always fixes an insertion).</p>`,
      diagrams: [
        {
          kind: 'avl-steps',
          title: 'Class-notes construction: H, I, J, B, A, E, C, F, D, G, K, L',
          seq: ['H', 'I', 'J', 'B', 'A', 'E', 'C', 'F', 'D', 'G', 'K', 'L'],
          caption: 'Red node = first unbalanced node (pivot). Orange = newly inserted key. Every rotation is shown as before → after.',
        },
        {
          kind: 'avl-steps',
          title: 'Class-notes example 2: 63, 9, 19, 27, 18, 108, 99, 81',
          seq: [63, 9, 19, 27, 18, 108, 99, 81],
        },
        {
          kind: 'avl',
          title: 'Final AVL tree for 63, 9, 19, 27, 18, 108, 99, 81',
          seq: [63, 9, 19, 27, 18, 108, 99, 81],
          caption: 'Check: in-order 9 18 19 27 63 81 99 108 is sorted, every BF ∈ {−1, 0, 1}.',
        },
      ],
      algorithm: [
        {
          title: 'AVL insert(node, key)',
          steps: [
            'Do a normal BST insert: if node = NULL create the leaf; else recurse left/right.',
            'On the way back, set <code>node→height = 1 + max(height(left), height(right))</code>.',
            'Compute <code>bf = height(left) − height(right)</code>.',
            'If bf &gt; 1 and key &lt; left→data → <b>LL</b> → return rightRotate(node).',
            'If bf &lt; −1 and key &gt; right→data → <b>RR</b> → return leftRotate(node).',
            'If bf &gt; 1 and key &gt; left→data → <b>LR</b> → left = leftRotate(left); return rightRotate(node).',
            'If bf &lt; −1 and key &lt; right→data → <b>RL</b> → right = rightRotate(right); return leftRotate(node).',
            'Otherwise return node unchanged.',
          ],
        },
      ],
      syntax: [
        { title: 'Node with height + helpers', code: AVL_HELPERS },
        { title: 'insert() with the four cases', code: AVL_INSERT },
      ],
      program: {
        title: 'AVL insert — keys from the user, prints pre-order after each insert',
        code: `#include <stdio.h>
#include <stdlib.h>

${AVL_HELPERS}

${ROTATIONS}

${AVL_INSERT}

void preorder(struct Node *r) {
    if (r) { printf("%d ", r->data); preorder(r->left); preorder(r->right); }
}
void inorder(struct Node *r) {
    if (r) { inorder(r->left); printf("%d(bf %d) ", r->data, getBalance(r)); inorder(r->right); }
}

int main() {
    struct Node *root = NULL;
    int n, key;
    printf("How many keys? ");
    scanf("%d", &n);
    while (n--) {
        printf("Insert: ");
        scanf("%d", &key);
        root = insert(root, key);
        printf("  pre-order now: "); preorder(root); printf("\\n");
    }
    printf("In-order with balance factors: ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
        input: `How many keys? 8
Insert: 63
Insert: 9
Insert: 19
Insert: 27
Insert: 18
Insert: 108
Insert: 99
Insert: 81`,
        output: `  pre-order now: 63
  pre-order now: 63 9
  pre-order now: 19 9 63
  pre-order now: 19 9 63 27
  pre-order now: 19 9 18 63 27
  pre-order now: 19 9 18 63 27 108
  pre-order now: 19 9 18 63 27 99 108
  pre-order now: 19 9 18 63 27 99 81 108
In-order with balance factors: 9(bf -1) 18(bf 0) 19(bf -1) 27(bf 0) 63(bf -1) 81(bf 0) 99(bf 0) 108(bf 0)`,
      },
      example: {
        title: 'the notes example explained step by step (H … L)',
        html: `<ol>
<li><b>H, I, J</b>: after J, H has BF −2 and J is right-of-right → <b>RR at H</b> → I(H, J).</li>
<li><b>B, A</b>: after A, H has BF +2, A is left-of-left → <b>LL at H</b> → I(B(A,H), J).</li>
<li><b>E</b>: I gets BF +2; E is in the right subtree of I's left child B → <b>LR at I</b>: left-rotate B, then right-rotate I → H(B(A,E), I(–,J)) … final root H.</li>
<li><b>C, F, D</b>: after D, B has BF −2 with D in the left of B's right child E → <b>RL at B</b>: right-rotate E, then left-rotate B.</li>
<li><b>G</b>: H becomes +2 with G right-of-left → <b>LR at H</b>.</li>
<li><b>K</b>: I becomes −2, K right-of-right → <b>RR at I</b>.</li>
<li><b>L</b>: no rotation. All BF ∈ {−1, 0, 1}.</li>
</ol>
<p>Compare each line with the pictures above — the pivot is coloured red in every "before" picture.</p>`,
      },
      complexity: [
        { op: 'Insert', avg: 'O(log n)', worst: 'O(log n)', note: 'O(log n) to find the place + at most one rotation O(1)' },
      ],
      lab: 'avl',
      tips: [
        'For construction questions write one line per key: "Insert E → I unbalanced (+2) → LR → draw". Marks are given per step.',
        'After the last key, write the in-order and confirm it is sorted.',
      ],
      mistakes: ['Forgetting to recompute BFs of <b>all</b> ancestors after a rotation — the next step then starts from a wrong picture.'],
    },

    {
      id: 'avl-delete',
      title: 'Deletion in an AVL tree',
      tagline: 'BST delete, then rebalance on the way up — possibly more than once.',
      definition:
        'Deletion in an AVL tree = normal <b>BST deletion</b> (leaf / one child / two children with in-order successor), followed by <b>rebalancing every ancestor</b> from the deleted position up to the root. Unlike insertion, a deletion may need <b>O(log n) rotations</b>, because fixing one node can unbalance a higher one.',
      simple: `<p>Delete exactly like a BST. Then climb up. At each ancestor recompute BF; if it is ±2, decide the case by looking at the <b>taller child</b> (not at the deleted key, it is gone) and rotate. Keep climbing — the tree above may still be unbalanced.</p>
<p>Textbooks call the delete cases <b>R0, R1, R−1</b> (deleted from the right subtree, left child has BF 0 / +1 / −1) and <b>L0, L1, L−1</b>. R1 and R0 are single right rotations, R−1 is a double (LR) rotation.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Notes example — before: delete 60',
          spec: '50(40(,45),60)',
          showBf: true,
          marks: { 60: 'unbalanced' },
          caption: 'All BF fine. Now delete the leaf 60.',
        },
        {
          kind: 'tree',
          title: 'After removing 60 → 50 has BF +2, its left child 40 has BF −1 → case R−1 (LR)',
          spec: '50(40(,45),)',
          showBf: true,
          marks: { 50: 'unbalanced', 40: 'path' },
          caption: 'Deleted from the RIGHT of 50; left child 40 leans RIGHT (BF −1) → double rotation: left-rotate 40, then right-rotate 50.',
        },
        {
          kind: 'tree',
          title: 'Result: 45 becomes the root with 40 and 50 as children',
          spec: '45(40,50)',
          showBf: true,
          marks: { 45: 'new' },
          caption: 'All BF = 0. In-order 40 45 50 ✓.',
        },
        {
          kind: 'tree',
          title: 'Case R0 — before: delete 40 from 30(20(10,25),40)',
          spec: '30(20(10,25),40)',
          showBf: true,
          marks: { 40: 'unbalanced' },
        },
        {
          kind: 'tree',
          title: 'After removing 40: 30 has BF +2, left child 20 has BF 0 → single right rotation',
          spec: '20(10,30(25,))',
          showBf: true,
          marks: { 20: 'new' },
          caption: 'Result 20(10, 30(25, –)). Root BF −1, all fine. In-order 10 20 25 30 ✓.',
        },
        { kind: 'fig', figKey: 'avl-del' },
      ],
      algorithm: [
        {
          title: 'AVL delete(root, key)',
          steps: [
            'Perform the standard BST delete (three cases).',
            'Return if the tree became empty.',
            'Update <code>root→height</code>.',
            'bf = getBalance(root).',
            'bf &gt; 1 and getBalance(root→left) ≥ 0 → <b>LL</b> (R0 / R1) → rightRotate(root).',
            'bf &gt; 1 and getBalance(root→left) &lt; 0 → <b>LR</b> (R−1) → left = leftRotate(left); rightRotate(root).',
            'bf &lt; −1 and getBalance(root→right) ≤ 0 → <b>RR</b> (L0 / L−1) → leftRotate(root).',
            'bf &lt; −1 and getBalance(root→right) &gt; 0 → <b>RL</b> (L1) → right = rightRotate(right); leftRotate(root).',
            'This happens at every level on the way back up (recursion does it automatically).',
          ],
        },
      ],
      syntax: [
        {
          title: 'deleteNode() with rebalancing',
          code: `struct Node *minValueNode(struct Node *n) {
    while (n->left) n = n->left;
    return n;
}

struct Node *deleteNode(struct Node *root, int key) {
    if (root == NULL) return root;
    if (key < root->data)      root->left  = deleteNode(root->left, key);
    else if (key > root->data) root->right = deleteNode(root->right, key);
    else {
        if (root->left == NULL || root->right == NULL) {       /* 0 or 1 child */
            struct Node *temp = root->left ? root->left : root->right;
            free(root);
            return temp;                                        /* may be NULL */
        }
        struct Node *temp = minValueNode(root->right);          /* 2 children */
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }

    root->height = 1 + max(height(root->left), height(root->right));
    int bf = getBalance(root);

    if (bf > 1 && getBalance(root->left) >= 0)  return rightRotate(root);      /* LL */
    if (bf > 1 && getBalance(root->left) < 0) {                                 /* LR */
        root->left = leftRotate(root->left);  return rightRotate(root);
    }
    if (bf < -1 && getBalance(root->right) <= 0) return leftRotate(root);      /* RR */
    if (bf < -1 && getBalance(root->right) > 0) {                               /* RL */
        root->right = rightRotate(root->right); return leftRotate(root);
    }
    return root;
}`,
          note: 'Difference from insert: the case is chosen by the BF of the taller child, and the check repeats at every ancestor.',
        },
      ],
      example: {
        title: 'delete 40 from the AVL tree 30(20(10,25),40)',
        html: `<ol>
<li>40 is a leaf → remove it (Case 1 of BST delete).</li>
<li>Climb up to 30: left height 1, right height −1 → BF = <b>+2</b> → unbalanced.</li>
<li>Deleted from the RIGHT, so look at the left child 20: its BF is <b>0</b> → case <b>R0</b> → single <b>right rotation at 30</b>.</li>
<li>Result: 20(10, 30(25, –)). BF(20) = −1, BF(30) = +1, all allowed.</li>
</ol>
<p>Compare: in the reused figures, deleting 10 from 30(20(10,25),40(35,–)) needs <b>no</b> rotation, while deleting 1 from 2(1,4(3,–)) needs a <b>double</b> rotation. The case depends on the BF of the other child.</p>`,
      },
      complexity: [{ op: 'Delete', avg: 'O(log n)', worst: 'O(log n)', note: 'Up to O(log n) rotations, each O(1)' }],
      tips: [
        'One sentence worth marks: "Insertion needs at most one (single or double) rotation; deletion may need a rotation at every level."',
      ],
    },

    {
      id: 'avl-search',
      diagrams: [{ kind: 'tree', title: 'Search 25 in a balanced BST', spec: '30(20(10,25),40)', marks: { '30': 'path', '20': 'path', '25': 'found' }, showBf: true, caption: '25 < 30: left. 25 > 20: right. Found 25. Search does not rotate the tree.' }],
      algorithm: [{ title: 'AVL search', steps: ['Start at the root.', 'If key equals the current value, return the node.', 'If key is smaller, move left; otherwise move right.', 'Repeat until found or the pointer becomes NULL.'] }],
      syntax: [{ title: 'Iterative AVL search', code: `struct Node *search(struct Node *root, int key) {
    while (root != NULL && root->data != key)
        root = key < root->data ? root->left : root->right;
    return root;
}` }],
      title: 'Search in an AVL tree and complexity summary',
      tagline: 'Same as BST search — but now guaranteed O(log n).',
      definition:
        'Searching in an AVL tree is <b>identical</b> to searching in a BST (compare, go left or right). Because the height is always O(log n), search, insertion and deletion are all <b>O(log n)</b> in the worst case.',
      simple: `<p>Nothing new to learn for search. The whole point of the rotations was to make this table true.</p>`,
      complexity: [
        { op: 'Search', avg: 'O(log n)', worst: 'O(log n)' },
        { op: 'Insert', avg: 'O(log n)', worst: 'O(log n)', note: '≤ 1 rotation' },
        { op: 'Delete', avg: 'O(log n)', worst: 'O(log n)', note: '≤ log n rotations' },
        { op: 'Space', avg: 'O(n)', worst: 'O(n)', note: 'one extra height/BF field per node' },
      ],
      example: {
        title: 'BST vs AVL in one table',
        html: `
<table class="table"><thead><tr><th></th><th>BST</th><th>AVL tree</th></tr></thead><tbody>
<tr><td>Balance condition</td><td>none</td><td>|BF| ≤ 1 at every node</td></tr>
<tr><td>Height</td><td>log n … n</td><td>always ≈ log n</td></tr>
<tr><td>Search / insert / delete (worst)</td><td>O(n)</td><td>O(log n)</td></tr>
<tr><td>Extra work</td><td>none</td><td>rotations + height field</td></tr>
<tr><td>Good when</td><td>random data, simple code</td><td>many searches, worst case matters</td></tr>
</tbody></table>`,
      },
      lab: 'avl',
      tips: ['"Advantages of AVL over BST" = guaranteed O(log n). "Disadvantage" = extra rotations and storage, more complex insert/delete.'],
    },
  ],
}

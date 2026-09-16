import type { Chapter } from './types'

/* Trees used in the class notes */
const T1 = '78(26(23,43),94(,97))' // Example 1 in the notes
const T2 = '10(5(2,),15(12,18))' // Example 2 in the notes
const PPT = 'A(B(D(I,J),F),C(G(,K),H))' // tree from the slides: in-order I D J B F A G K C H

export const CH3_TRAVERSAL: Chapter = {
  id: 'ch3',
  number: 3,
  title: 'Binary tree traversals',
  syllabus: 'Pre-order · In-order · Post-order · Level-order · recursive and non-recursive',
  emoji: '🚶',
  topics: [
    {
      id: 'trav-intro',
      title: 'What is traversal?',
      tagline: 'Visiting every node exactly once, in a fixed order.',
      definition:
        '<b>Traversal</b> is the process of visiting each node of a binary tree <b>exactly once</b> in a systematic way. The three standard (depth-first) traversals differ only in <b>when the root (N) is visited</b> relative to its left subtree (L) and right subtree (R): <b>Pre-order = NLR</b>, <b>In-order = LNR</b>, <b>Post-order = LRN</b>. <b>Level-order</b> (breadth-first) visits level by level from left to right.',
      simple: `
<p>There is only one thing to remember: <b>where does N (the node/root) come?</b></p>
<ul>
<li><b>Pre</b> = N first → <b>N</b> L R</li>
<li><b>In</b> = N in the middle → L <b>N</b> R</li>
<li><b>Post</b> = N last → L R <b>N</b></li>
</ul>
<p>Left always comes before Right. Each traversal is <b>recursive</b>: "traverse the left subtree" means apply the same rule inside that subtree.</p>`,
      diagrams: [
        {
          kind: 'traversal',
          title: 'Pre-order (N L R) on the notes tree',
          spec: T1,
          order: 'preorder',
        },
        {
          kind: 'traversal',
          title: 'In-order (L N R) on the same tree',
          spec: T1,
          order: 'inorder',
        },
        {
          kind: 'traversal',
          title: 'Post-order (L R N) on the same tree',
          spec: T1,
          order: 'postorder',
        },
        {
          kind: 'traversal',
          title: 'Level-order (breadth first)',
          spec: T1,
          order: 'levelorder',
        },
      ],
      example: {
        title: 'one tree, four answers',
        html: `
<table class="table"><thead><tr><th>Traversal</th><th>Rule</th><th>Output for the tree 78(26(23,43), 94(–,97))</th></tr></thead><tbody>
<tr><td>Pre-order</td><td>N L R</td><td><b>78 26 23 43 94 97</b></td></tr>
<tr><td>In-order</td><td>L N R</td><td><b>23 26 43 78 94 97</b> (sorted → it is a BST)</td></tr>
<tr><td>Post-order</td><td>L R N</td><td><b>23 43 26 97 94 78</b></td></tr>
<tr><td>Level-order</td><td>top to bottom, left to right</td><td><b>78 26 94 23 43 97</b></td></tr>
</tbody></table>
<p>Quick checks: pre-order always <b>starts</b> with the root; post-order always <b>ends</b> with the root; in-order of a BST is <b>sorted</b>.</p>`,
      },
      lab: 'traversal',
      tips: [
        'Trick for in-order: hang the tree, "drop" every node straight down and read left to right.',
        'Trick for pre-order: walk around the tree anticlockwise and write a node the <b>first</b> time you touch it. Post-order: write it the <b>last</b> time you touch it.',
      ],
    },

    {
      id: 'trav-pre',
      title: 'Pre-order traversal (N L R)',
      tagline: 'Root first. Used to copy a tree and to get prefix expressions.',
      definition:
        'In <b>pre-order traversal</b> the root is visited first, then the left subtree is traversed in pre-order, then the right subtree is traversed in pre-order (<b>NLR</b>).',
      simple: `<p>Say the node's name the <b>moment you arrive</b> at it. Then go left completely, then right completely.</p>`,
      diagrams: [
        {
          kind: 'traversal',
          title: 'Pre-order of notes Example 2',
          spec: T2,
          order: 'preorder',
          caption: 'Visit 10, then whole left subtree (5, 2), then whole right subtree (15, 12, 18).',
        },
        {
          kind: 'traversal',
          title: 'Pre-order of the slide tree',
          spec: PPT,
          order: 'preorder',
        },
      ],
      algorithm: [
        {
          title: 'Preorder(tree)',
          steps: [
            'If the tree is empty (root = NULL) → return.',
            '<b>Visit</b> the root (print its data).',
            'Traverse the <b>left</b> subtree: call Preorder(root→left).',
            'Traverse the <b>right</b> subtree: call Preorder(root→right).',
          ],
        },
      ],
      syntax: [
        {
          title: 'preorder() in C',
          code: `void preorder(struct Node *root) {
    if (root == NULL)
        return;
    printf("%d ", root->data);   /* N */
    preorder(root->left);        /* L */
    preorder(root->right);       /* R */
}`,
        },
      ],
      example: {
        title: 'expand it like the notes do (N L1 R1)',
        html: `
<p>Tree: root N = 78, left subtree L1 rooted at 26, right subtree R1 rooted at 94.</p>
<ol>
<li>Pre-order(T) = N L1 R1 = <b>78</b> L1 R1</li>
<li>L1 = 26 L2 R2 = 26 <b>23 43</b></li>
<li>R1 = 94 L3 R3, L3 is empty → 94 <b>97</b></li>
<li>Put together: 78 26 23 43 94 97</li>
</ol>`,
      },
      complexity: [{ op: 'Pre-order', avg: 'O(n)', worst: 'O(n)', note: 'Every node visited once. Stack space O(h): h = log n if balanced, n if skewed.' }],
      tips: ['Pre-order is used to <b>copy</b> a tree (create parent before children) and to get the <b>prefix</b> expression.'],
    },

    {
      id: 'trav-in',
      title: 'In-order traversal (L N R)',
      tagline: 'Left, root, right. For a BST this prints the keys in sorted order.',
      definition:
        'In <b>in-order traversal</b> the left subtree is traversed in in-order first, then the root is visited, then the right subtree is traversed in in-order (<b>LNR</b>).',
      simple: `<p>Go left as far as you can, print, step up, go right. For a <b>binary search tree</b> this gives the keys in <b>ascending order</b> — the most important fact in this unit.</p>`,
      diagrams: [
        {
          kind: 'traversal',
          title: 'In-order of notes Example 2',
          spec: T2,
          order: 'inorder',
          caption: 'Left subtree (2, 5), then root 10, then right subtree (12, 15, 18).',
        },
        {
          kind: 'traversal',
          title: 'In-order of the slide tree',
          spec: PPT,
          order: 'inorder',
        },
      ],
      algorithm: [
        {
          title: 'Inorder(tree)',
          steps: [
            'If root = NULL → return.',
            'Traverse the <b>left</b> subtree: Inorder(root→left).',
            '<b>Visit</b> the root (print).',
            'Traverse the <b>right</b> subtree: Inorder(root→right).',
          ],
        },
      ],
      syntax: [
        {
          title: 'inorder() in C',
          code: `void inorder(struct Node *root) {
    if (root == NULL)
        return;
    inorder(root->left);         /* L */
    printf("%d ", root->data);   /* N */
    inorder(root->right);        /* R */
}`,
        },
      ],
      example: {
        title: 'why the output is sorted for a BST',
        html: `<p>In a BST every key in the left subtree is smaller than the root and every key in the right subtree is bigger. In-order prints <i>left (all smaller) → root → right (all bigger)</i>, and this is true again inside every subtree. So the whole output is ascending.</p>
<p>Tree 78(26(23,43),94(–,97)) → <b>23 26 43 78 94 97</b> ✓ ascending.</p>`,
      },
      complexity: [{ op: 'In-order', avg: 'O(n)', worst: 'O(n)', note: 'n visits, O(h) stack.' }],
      tips: [
        '"Which traversal gives sorted output of a BST?" → <b>in-order</b>. Learn this cold.',
        'In-order + pre-order (or in-order + post-order) together uniquely rebuild a tree. Pre + post alone do not.',
      ],
    },

    {
      id: 'trav-post',
      title: 'Post-order traversal (L R N)',
      tagline: 'Children before parent. Used to delete a tree and to evaluate expressions.',
      definition:
        'In <b>post-order traversal</b> the left subtree is traversed in post-order, then the right subtree in post-order, and the root is visited <b>last</b> (<b>LRN</b>).',
      simple: `<p>You may print a node only after <b>both</b> its children are finished. So the root of the whole tree is always the <b>last</b> thing printed.</p>`,
      diagrams: [
        {
          kind: 'traversal',
          title: 'Post-order of notes Example 2',
          spec: T2,
          order: 'postorder',
          caption: '2, 5 (left done) → 12, 18, 15 (right done) → 10 last.',
        },
        {
          kind: 'traversal',
          title: 'Post-order of the slide tree',
          spec: PPT,
          order: 'postorder',
        },
      ],
      algorithm: [
        {
          title: 'Postorder(tree)',
          steps: [
            'If root = NULL → return.',
            'Traverse the <b>left</b> subtree: Postorder(root→left).',
            'Traverse the <b>right</b> subtree: Postorder(root→right).',
            '<b>Visit</b> the root (print).',
          ],
        },
      ],
      syntax: [
        {
          title: 'postorder() in C',
          code: `void postorder(struct Node *root) {
    if (root == NULL)
        return;
    postorder(root->left);       /* L */
    postorder(root->right);      /* R */
    printf("%d ", root->data);   /* N */
}`,
        },
        {
          title: 'Why post-order deletes a tree safely',
          code: `void freeTree(struct Node *root) {
    if (root == NULL) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);      /* children are already gone, now the parent */
}`,
          note: 'If you freed the parent first you would lose the addresses of the children (memory leak).',
        },
      ],
      example: {
        title: 'notes Example 1 expanded',
        html: `<ol>
<li>Post-order(T) = L1 R1 N = L1 R1 <b>78</b></li>
<li>L1 = L2 R2 26 = <b>23 43 26</b></li>
<li>R1 = L3 R3 94 = <b>97 94</b> (L3 empty)</li>
<li>Result: 23 43 26 97 94 78</li>
</ol>`,
      },
      complexity: [{ op: 'Post-order', avg: 'O(n)', worst: 'O(n)' }],
      tips: ['Post-order gives the <b>postfix</b> expression; postfix is what a stack machine / calculator evaluates.'],
    },

    {
      id: 'trav-level',
      title: 'Level-order traversal (breadth first)',
      tagline: 'Row by row. Needs a queue, not recursion.',
      definition:
        '<b>Level-order traversal</b> visits the nodes level by level, starting from the root (level 0), and within a level from left to right. It is implemented with a <b>queue</b>: dequeue a node, visit it, enqueue its left child then its right child.',
      simple: `<p>Read the tree like a book: first line, second line, third line… The queue remembers "who is waiting" so that children are printed after all nodes of the current level.</p>`,
      diagrams: [
        { kind: 'traversal', title: 'Level-order on the slide tree', spec: PPT, order: 'levelorder' },
        {
          kind: 'traversal',
          title: 'Level-order on a BST of 50, 30, 70, 20, 40, 60, 80',
          seq: [50, 30, 70, 20, 40, 60, 80],
          order: 'levelorder',
        },
      ],
      algorithm: [
        {
          title: 'LevelOrder(root)',
          steps: [
            'If root = NULL → return.',
            'Create an empty queue Q and <b>enqueue root</b>.',
            'While Q is not empty:',
            '&nbsp;&nbsp;a. <b>Dequeue</b> a node p and <b>visit</b> it.',
            '&nbsp;&nbsp;b. If p→left ≠ NULL → enqueue p→left.',
            '&nbsp;&nbsp;c. If p→right ≠ NULL → enqueue p→right.',
          ],
        },
      ],
      syntax: [
        {
          title: 'levelorder() with a simple array queue',
          code: `void levelorder(struct Node *root) {
    struct Node *queue[100];
    int front = 0, rear = 0;
    if (root == NULL) return;
    queue[rear++] = root;                 /* enqueue root */
    while (front < rear) {
        struct Node *p = queue[front++];  /* dequeue */
        printf("%d ", p->data);           /* visit   */
        if (p->left)  queue[rear++] = p->left;
        if (p->right) queue[rear++] = p->right;
    }
}`,
        },
      ],
      example: {
        title: 'queue trace for 50(30(20,40),70(60,80))',
        html: `
<table class="table"><thead><tr><th>Dequeue & print</th><th>Enqueue</th><th>Queue after</th></tr></thead><tbody>
<tr><td>—</td><td>50</td><td>50</td></tr>
<tr><td>50</td><td>30, 70</td><td>30 70</td></tr>
<tr><td>30</td><td>20, 40</td><td>70 20 40</td></tr>
<tr><td>70</td><td>60, 80</td><td>20 40 60 80</td></tr>
<tr><td>20, 40, 60, 80</td><td>—</td><td>empty</td></tr>
</tbody></table>
<p>Output: 50 30 70 20 40 60 80.</p>`,
      },
      complexity: [{ op: 'Level-order', avg: 'O(n)', worst: 'O(n)', note: 'Queue holds at most one level ≈ n/2 nodes → O(n) extra space.' }],
      lab: 'traversal',
      tips: ['Depth-first traversals use a <b>stack</b> (recursion); breadth-first uses a <b>queue</b>. One-line answer worth 2 marks.'],
    },

    {
      id: 'trav-program',
      diagrams: [{ kind: 'traversal', title: 'Program input: 78, 26, 94, 23, 43, 97', seq: [78, 26, 94, 23, 43, 97], order: 'levelorder', caption: 'The same tree is used by every traversal in the program.' }],
      title: 'Complete program — all four traversals',
      tagline: 'Build with insert(), then print pre / in / post / level order.',
      definition:
        'A single C program that reads n keys, builds the tree with <code>insert()</code>, and prints all traversals.',
      simple: `<p>This is the program version of everything above. Type the keys, compare the output with your hand-drawn answer.</p>`,
      program: {
        title: 'traversals.c',
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node *createNode(int v) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = v; n->left = n->right = NULL;
    return n;
}

struct Node *insert(struct Node *root, int v) {
    if (root == NULL) return createNode(v);
    if (v < root->data)      root->left  = insert(root->left, v);
    else if (v > root->data) root->right = insert(root->right, v);
    return root;
}

void preorder(struct Node *r)  { if (r) { printf("%d ", r->data); preorder(r->left); preorder(r->right); } }
void inorder(struct Node *r)   { if (r) { inorder(r->left); printf("%d ", r->data); inorder(r->right); } }
void postorder(struct Node *r) { if (r) { postorder(r->left); postorder(r->right); printf("%d ", r->data); } }

void levelorder(struct Node *root) {
    struct Node *q[100]; int f = 0, rr = 0;
    if (!root) return;
    q[rr++] = root;
    while (f < rr) {
        struct Node *p = q[f++];
        printf("%d ", p->data);
        if (p->left)  q[rr++] = p->left;
        if (p->right) q[rr++] = p->right;
    }
}

int main() {
    struct Node *root = NULL;
    int n, v;
    printf("Enter number of keys: ");
    scanf("%d", &n);
    printf("Enter %d keys: ", n);
    while (n--) { scanf("%d", &v); root = insert(root, v); }

    printf("Pre-order  : "); preorder(root);  printf("\\n");
    printf("In-order   : "); inorder(root);   printf("\\n");
    printf("Post-order : "); postorder(root); printf("\\n");
    printf("Level-order: "); levelorder(root); printf("\\n");
    return 0;
}`,
        input: `Enter number of keys: 6
Enter 6 keys: 78 26 94 23 43 97`,
        output: `Pre-order  : 78 26 23 43 94 97
In-order   : 23 26 43 78 94 97
Post-order : 23 43 26 97 94 78
Level-order: 78 26 94 23 43 97`,
      },
      lab: 'traversal',
    },

    {
      id: 'trav-nonrec',
      diagrams: [{ kind: 'traversal', title: 'The tree in the stack trace', spec: '10(5(2,),15(12,18))', order: 'inorder', caption: 'Badges show the visit order. The stack remembers ancestors while we move left.' }],
      title: 'Non-recursive (iterative) in-order using a stack',
      tagline: 'What the computer does behind recursion, written by hand.',
      definition:
        'Recursion secretly uses the system stack. A <b>non-recursive traversal</b> uses an explicit stack: keep pushing left children; when you cannot go left, <b>pop</b>, visit, and move to the right child.',
      simple: `<p>"Go left, go left, go left… can't? Pop and print. Then try right." Repeat until both the stack and the current pointer are empty.</p>`,
      algorithm: [
        {
          title: 'iterative in-order',
          steps: [
            'Set <code>cur = root</code>, stack empty.',
            'While <code>cur ≠ NULL</code> or stack not empty:',
            '&nbsp;&nbsp;a. While <code>cur ≠ NULL</code>: push cur, <code>cur = cur→left</code>.',
            '&nbsp;&nbsp;b. <code>cur = pop()</code>; <b>visit</b> cur.',
            '&nbsp;&nbsp;c. <code>cur = cur→right</code>.',
          ],
        },
        {
          title: 'iterative pre-order',
          steps: [
            'Push root.',
            'While stack not empty: pop p, <b>visit</b> p, push p→right (if any), then push p→left (if any).',
            'Right is pushed first so that left is popped first.',
          ],
        },
      ],
      syntax: [
        {
          title: 'inorderIterative()',
          code: `void inorderIterative(struct Node *root) {
    struct Node *stack[100]; int top = -1;
    struct Node *cur = root;
    while (cur != NULL || top != -1) {
        while (cur != NULL) {          /* go as far left as possible */
            stack[++top] = cur;
            cur = cur->left;
        }
        cur = stack[top--];            /* pop */
        printf("%d ", cur->data);      /* visit */
        cur = cur->right;              /* now the right subtree */
    }
}`,
        },
      ],
      example: {
        title: 'stack trace on 10(5(2,–),15(12,18))',
        html: `
<table class="table"><thead><tr><th>Action</th><th>Stack (top right)</th><th>Printed so far</th></tr></thead><tbody>
<tr><td>push 10, 5, 2 (going left)</td><td>10 5 2</td><td></td></tr>
<tr><td>pop 2, print; right of 2 is NULL</td><td>10 5</td><td>2</td></tr>
<tr><td>pop 5, print; right is NULL</td><td>10</td><td>2 5</td></tr>
<tr><td>pop 10, print; go right to 15, push 15, 12</td><td>15 12</td><td>2 5 10</td></tr>
<tr><td>pop 12, print</td><td>15</td><td>2 5 10 12</td></tr>
<tr><td>pop 15, print; push 18</td><td>18</td><td>2 5 10 12 15</td></tr>
<tr><td>pop 18, print</td><td>empty</td><td>2 5 10 12 15 18</td></tr>
</tbody></table>`,
      },
      complexity: [{ op: 'Iterative traversal', avg: 'O(n)', worst: 'O(n)', note: 'Stack size = height h.' }],
      tips: ['Post-order without recursion needs two stacks (or a "last visited" pointer) — mention it, rarely asked in full.'],
    },

    {
      id: 'trav-rebuild',
      title: 'Construct a tree from two traversals',
      tagline: 'In-order + pre-order (or in-order + post-order) → unique tree.',
      definition:
        'Given the <b>in-order</b> and <b>pre-order</b> sequences of a binary tree, the tree can be uniquely reconstructed: the first pre-order element is the root; it splits the in-order sequence into left and right subtrees; repeat recursively. With <b>post-order</b>, the root is the <b>last</b> element.',
      simple: `<p>Pre-order tells you <b>who is the root</b>. In-order tells you <b>who is on the left and who is on the right</b> of that root. Use them alternately.</p>`,
      diagrams: [
        { kind: 'fig', figKey: 'rebuild', index: 0 },
        { kind: 'fig', figKey: 'rebuild', index: 1 },
      ],
      algorithm: [
        {
          title: 'build(pre, in)',
          steps: [
            'Root = first element of pre-order (last element if post-order is given).',
            'Find the root in the in-order list. Everything to its <b>left</b> is the left subtree, everything to its <b>right</b> is the right subtree.',
            'Count the left part (say k elements). The next k pre-order elements belong to the left subtree; the rest to the right subtree.',
            'Recursively build the left and right subtrees.',
          ],
        },
      ],
      example: {
        title: 'Pre = A B D E C F G,  In = D B E A F C G',
        html: `<ol>
<li>Root = <b>A</b>. In-order: left of A = {D B E}, right of A = {F C G}.</li>
<li>Left subtree: pre = B D E → root <b>B</b>; in = D B E → left D, right E.</li>
<li>Right subtree: pre = C F G → root <b>C</b>; in = F C G → left F, right G.</li>
<li>Tree: A(B(D,E), C(F,G)). Check post-order: D E B F G C A.</li>
</ol>`,
      },
      tips: ['Pre + post alone are <b>not</b> enough (a node with one child could be left or right). In-order must be one of the two.'],
    },
  ],
}

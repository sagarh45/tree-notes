import type { Chapter } from './types'

/* Trees from the class notes */
const BST40 = '40(15(7,22(18(,20),30)),80(60,100(90,)))' // in-order 7 15 18 20 22 30 40 60 80 90 100
const BST40_55 = '40(15(7,22(18(,20),30)),80(60(55,),100(90,)))' // after inserting 55
const BST50 = '50(30(20,40(35(32,),42(,43))),90(60(55,70),100(,120)))' // deletion examples
const SKEW = '10(,20(,30(,40(,50(,60(,70))))))'

export const CH4_BST: Chapter = {
  id: 'ch4',
  number: 4,
  title: 'Binary Search Tree (BST)',
  syllabus: 'BST ADT · search · insert · delete (3 cases) · min / max / successor · complexity',
  emoji: '🔍',
  topics: [
    {
      id: 'bst-def',
      title: 'BST — definition and property',
      tagline: 'Left smaller, right bigger — at every node.',
      definition:
        'A <b>binary search tree</b> is a binary tree in which, for <b>every</b> node: all keys in its <b>left subtree are smaller</b> than the node, all keys in its <b>right subtree are larger</b>, and both subtrees are themselves binary search trees. Its <b>in-order traversal gives the keys in ascending order</b>.',
      simple: `
<p>A BST is a binary tree with an <b>ordering rule</b>. Because of the rule you never have to look at the whole tree — at each node one comparison tells you which side to go. That is why it is called a <i>search</i> tree.</p>
<p>Duplicates: either not allowed, or always sent to one fixed side (say right). Mention your choice.</p>`,
      points: [
        'Rule applies to the <b>whole</b> subtree, not just the direct child.',
        'In-order = sorted. If the in-order is not sorted, it is <b>not</b> a BST.',
        'Variants that keep it balanced: <b>AVL tree</b>, <b>Red-Black tree</b>.',
      ],
      diagrams: [
        {
          kind: 'tree',
          title: 'BST from the class notes (root 40)',
          spec: BST40,
          caption: 'Left of 40: 15, 7, 22, 18, 30, 20 — all smaller. Right of 40: 80, 60, 100, 90 — all larger.',
        },
        {
          kind: 'traversal',
          title: 'Its in-order is sorted',
          spec: BST40,
          order: 'inorder',
        },
        {
          kind: 'tree',
          title: 'NOT a BST — 25 is in the right subtree of 30 but 25 < 30',
          spec: '30(20,40(25,50))',
          marks: { 25: 'unbalanced' },
          caption: 'Locally 25 < 40 looks fine, but 25 sits in the RIGHT subtree of 30 while 25 < 30. The rule is about the whole subtree, not just the parent.',
        },
      ],
      syntax: [
        {
          title: 'Node (same as any binary tree)',
          code: `struct Node {
    int data;
    struct Node *left, *right;
};`,
        },
      ],
      example: {
        title: 'is it a BST? — check with in-order',
        html: `<p>Tree 30(20, 40(25, 50)). In-order: 20 30 <b>25</b> 40 50 → not ascending → <b>not a BST</b>.</p>
<p>Tree 40(15(7,22),80(60,100)). In-order: 7 15 22 40 60 80 100 → ascending → <b>BST</b>.</p>`,
      },
      lab: 'bst',
      tips: ['Two-line definition + "in-order gives sorted order" + one drawn example = full marks for "define BST".'],
      mistakes: ['Checking only parent–child (25 < 40 ✓) instead of the whole subtree (25 must also be > 30 ✗).'],
    },

    {
      id: 'bst-search',
      title: 'Searching in a BST',
      tagline: 'Compare, go left or right, repeat. Cost = height.',
      definition:
        'To <b>search</b> for a key: start at the root. If the key equals the node → <b>found</b>. If the key is smaller → search the <b>left</b> subtree; if larger → search the <b>right</b> subtree. If you reach NULL → <b>not found</b>. Time = O(h), h = height.',
      simple: `<p>It is binary search on a tree. Every comparison throws away one whole side.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Search 55 — found (notes example)',
          spec: BST40_55,
          marks: { 40: 'path', 80: 'path', 60: 'path', 55: 'found' },
          caption: '55 > 40 → right. 55 < 80 → left. 55 < 60 → left. 55 = 55 → found in 4 comparisons.',
        },
        {
          kind: 'tree',
          title: 'Search 25 — not found (notes example)',
          spec: BST40,
          marks: { 40: 'path', 15: 'path', 22: 'path', 30: 'current' },
          caption: '25 < 40 → left. 25 > 15 → right. 25 > 22 → right. 25 < 30 → left, but left of 30 is NULL → not present. 4 comparisons.',
        },
      ],
      algorithm: [
        {
          title: 'search(root, key)',
          steps: [
            'If root = NULL → return NULL (<b>not found</b>).',
            'If key = root→data → return root (<b>found</b>).',
            'If key &lt; root→data → return search(root→left, key).',
            'Else → return search(root→right, key).',
          ],
        },
      ],
      syntax: [
        {
          title: 'Recursive search',
          code: `struct Node *search(struct Node *root, int key) {
    if (root == NULL || root->data == key)
        return root;                       /* NULL = not found */
    if (key < root->data)
        return search(root->left, key);
    return search(root->right, key);
}`,
        },
        {
          title: 'Iterative search (no recursion, same idea)',
          code: `struct Node *searchIter(struct Node *root, int key) {
    while (root != NULL && root->data != key)
        root = (key < root->data) ? root->left : root->right;
    return root;
}`,
        },
      ],
      example: {
        title: 'dry run — search 55',
        html: `
<table class="table"><thead><tr><th>At node</th><th>Compare</th><th>Move</th></tr></thead><tbody>
<tr><td>40</td><td>55 &gt; 40</td><td>right → 80</td></tr>
<tr><td>80</td><td>55 &lt; 80</td><td>left → 60</td></tr>
<tr><td>60</td><td>55 &lt; 60</td><td>left → 55</td></tr>
<tr><td>55</td><td>55 = 55</td><td><b>found</b></td></tr>
</tbody></table>`,
      },
      complexity: [
        { op: 'Search (balanced tree)', avg: 'O(log n)', worst: 'O(log n)', note: 'Height ≈ log₂ n' },
        { op: 'Search (skewed tree)', avg: 'O(n)', worst: 'O(n)', note: 'Height = n − 1, like a linked list' },
      ],
      lab: 'bst',
      tips: ['Maximum comparisons = <b>height + 1</b>. In the notes tree height = 4, so at most 5 comparisons.'],
    },

    {
      id: 'bst-insert',
      title: 'Insertion in a BST',
      tagline: 'Search for the key; where the search falls off the tree, hang the new leaf.',
      definition:
        'To <b>insert</b> a key: search for it starting from the root; when a NULL position is reached, create a new node there. A new key is <b>always inserted as a leaf</b>. The BST property is preserved. Time = O(h).',
      simple: `<p>Insertion is just an unsuccessful search followed by "put it here". Nothing above the new node changes.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Insert 55 (notes example)',
          spec: BST40_55,
          marks: { 40: 'path', 80: 'path', 60: 'path', 55: 'new' },
          caption: '55 > 40 → right. 55 < 80 → left. 55 < 60 → left is empty → insert as left child of 60.',
        },
        {
          kind: 'tree',
          title: 'Insert 16 (notes example)',
          spec: '40(15(7,22(18(16,20),30)),80(60,100(90,)))',
          marks: { 40: 'path', 15: 'path', 22: 'path', 18: 'path', 16: 'new' },
          caption: '16 < 40 → left. 16 > 15 → right. 16 < 22 → left. 16 < 18 → left is empty → insert as left child of 18.',
        },
        {
          kind: 'tree-steps',
          title: 'Build a BST from 50, 30, 70, 20, 40, 60, 80',
          seq: [50, 30, 70, 20, 40, 60, 80],
        },
      ],
      algorithm: [
        {
          title: 'insert(root, key)',
          steps: [
            'If root = NULL → create a new node with key and <b>return it</b>.',
            'If key &lt; root→data → root→left = insert(root→left, key).',
            'Else if key &gt; root→data → root→right = insert(root→right, key).',
            'Return root (the tree above is unchanged).',
          ],
        },
      ],
      syntax: [
        {
          title: 'insert()',
          code: `struct Node *insert(struct Node *root, int key) {
    if (root == NULL)
        return createNode(key);            /* new leaf */
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    return root;                           /* duplicates ignored */
}`,
          note: 'Call it as  root = insert(root, key);  — the return value matters when the tree was empty.',
        },
      ],
      complexity: [
        { op: 'Insert', avg: 'O(log n)', worst: 'O(n)', note: 'Same path as search + O(1) to link the node' },
      ],
      lab: 'bst',
      tips: [
        'Sorted input (10, 20, 30, …) builds a <b>skewed</b> tree. That is the standard "disadvantage of BST" answer and the reason AVL exists.',
      ],
      mistakes: ['Forgetting <code>root = insert(root, key)</code> in main — the first insert never attaches.'],
    },

    {
      id: 'bst-minmax',
      title: 'Minimum, maximum and in-order successor',
      tagline: 'Extreme left = smallest. Extreme right = largest.',
      definition:
        'The <b>smallest</b> key is the <b>left-most</b> node (keep going left from the root). The <b>largest</b> key is the <b>right-most</b> node. The <b>in-order successor</b> of a node with a right subtree is the <b>left-most node of its right subtree</b> (the next key in sorted order).',
      simple: `<p>Because left is always smaller, walking left forever reaches the minimum. The successor of X is "the smallest thing bigger than X" — go right once, then left as far as possible.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Minimum = 20 (keep going left)',
          spec: BST50,
          marks: { 50: 'path', 30: 'path', 20: 'found' },
          caption: 'From 50 go left to 30, left to 20, left is NULL → 20 is the minimum.',
        },
        {
          kind: 'tree',
          title: 'Maximum = 120',
          spec: BST50,
          marks: { 50: 'path', 90: 'path', 100: 'path', 120: 'found' },
          caption: 'From 50 go right to 90, right to 100, right to 120, right is NULL → 120 is the maximum.',
        },
        {
          kind: 'tree',
          title: 'In-order successor of 50 = 55',
          spec: BST50,
          marks: { 50: 'current', 90: 'path', 60: 'path', 55: 'found' },
          caption: 'Right child of 50 is 90. Extreme left from 90: 90 → 60 → 55. So successor(50) = 55. In-order: … 43 50 <b>55</b> 60 …',
        },
      ],
      algorithm: [
        {
          title: 'findMin(root)',
          steps: ['If root = NULL → tree empty.', 'While root→left ≠ NULL: root = root→left.', 'Return root.'],
        },
        {
          title: 'inorderSuccessor(node) — when node has a right child',
          steps: ['Go to node→right.', 'Then keep going left until left = NULL.', 'That node is the successor. It has <b>no left child</b> (so at most one child) — important for deletion.'],
        },
      ],
      syntax: [
        {
          title: 'findMin / findMax',
          code: `struct Node *findMin(struct Node *root) {
    while (root != NULL && root->left != NULL)
        root = root->left;
    return root;
}

struct Node *findMax(struct Node *root) {
    while (root != NULL && root->right != NULL)
        root = root->right;
    return root;
}

/* successor when the right subtree exists */
struct Node *successor(struct Node *node) {
    return findMin(node->right);
}`,
        },
      ],
      example: {
        title: 'successors on the notes tree',
        html: `<p>In-order: 20 30 32 35 40 42 43 50 55 60 70 90 100 120.</p>
<ul>
<li>successor(30) = <b>32</b> (right child 40 → left-most is 32)</li>
<li>successor(40) = <b>42</b></li>
<li>successor(50) = <b>55</b></li>
<li>predecessor(50) = <b>43</b> (left child 30 → right-most is 43)</li>
</ul>`,
      },
      complexity: [{ op: 'Min / Max / Successor', avg: 'O(log n)', worst: 'O(n)', note: 'One root-to-leaf walk' }],
      tips: ['The successor never has a left child. Say this — it is the key to the two-children delete case.'],
    },

    {
      id: 'bst-delete',
      title: 'Deletion in a BST — three cases',
      tagline: 'Leaf: cut it. One child: bypass it. Two children: replace with in-order successor.',
      definition: `To <b>delete</b> a key, first search for the node (and its parent). Then:<br/>
<b>Case 1 — leaf</b>: set the parent's pointer to NULL and free the node.<br/>
<b>Case 2 — one child</b>: link the parent directly to the node's only child (bypass), free the node.<br/>
<b>Case 3 — two children</b>: find the <b>in-order successor</b> (left-most node of the right subtree), copy its value into the node, then delete the successor (which has at most one child, so Case 1 or 2).`,
      simple: `
<p>Cases 1 and 2 are pointer surgery. Case 3 is the trick: don't remove the node — <b>replace its value</b> with the next bigger value (successor) and remove <i>that</i> node instead, because the successor is always easy to delete.</p>
<p>(You may use the in-order <b>predecessor</b> — right-most of the left subtree — instead. Both keep the BST valid.)</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Start: BST from the notes (in-order 20 30 32 35 40 42 43 50 55 60 70 90 100 120)',
          spec: BST50,
          caption: 'Leaves: 20, 32, 43, 55, 70, 120. One child: 35, 42, 100. Two children: 30, 40, 50, 60, 90.',
        },
        {
          kind: 'tree',
          title: 'Case 1 — delete leaf 32',
          spec: '50(30(20,40(35,42(,43))),90(60(55,70),100(,120)))',
          marks: { 35: 'current' },
          caption: 'Parent 35: set 35→left = NULL. Nothing else moves.',
        },
        {
          kind: 'tree',
          title: 'Case 2 — delete 42 (one child, 43)',
          spec: '50(30(20,40(35(32,),43)),90(60(55,70),100(,120)))',
          marks: { 40: 'current', 43: 'new' },
          caption: '40→right pointed to 42; now 40→right = 43 (the only child of 42). 42 is freed.',
        },
        {
          kind: 'tree',
          title: 'Case 3 — delete 30 (two children) → successor is 32',
          spec: '50(32(20,40(35,42(,43))),90(60(55,70),100(,120)))',
          marks: { 32: 'new', 35: 'path' },
          caption: 'Successor of 30 = left-most of right subtree (40 → 35 → 32). Copy 32 into the node, delete the old leaf 32 under 35.',
        },
        {
          kind: 'tree',
          title: 'Case 3 again — delete 50 (root) → successor is 55',
          spec: '55(30(20,40(35(32,),42(,43))),90(60(,70),100(,120)))',
          marks: { 55: 'new', 60: 'path' },
          caption: 'Successor of 50 = 55 (50 → 90 → 60 → 55). Root now holds 55; old 55 (a leaf) is removed from under 60.',
        },
      ],
      algorithm: [
        {
          title: 'delete(root, key)',
          steps: [
            'If root = NULL → return NULL (key not present).',
            'If key &lt; root→data → root→left = delete(root→left, key); return root.',
            'If key &gt; root→data → root→right = delete(root→right, key); return root.',
            'Key found. <b>Case 1/2</b>: if root→left = NULL → temp = root→right; free(root); return temp. If root→right = NULL → temp = root→left; free(root); return temp.',
            '<b>Case 3</b>: temp = findMin(root→right); root→data = temp→data; root→right = delete(root→right, temp→data); return root.',
          ],
        },
      ],
      syntax: [
        {
          title: 'delete() — all three cases',
          code: `struct Node *delete(struct Node *root, int key) {
    if (root == NULL) return root;

    if (key < root->data)
        root->left = delete(root->left, key);
    else if (key > root->data)
        root->right = delete(root->right, key);
    else {
        /* Case 1 (leaf) and Case 2 (one child) */
        if (root->left == NULL) {
            struct Node *temp = root->right;
            free(root);
            return temp;
        }
        if (root->right == NULL) {
            struct Node *temp = root->left;
            free(root);
            return temp;
        }
        /* Case 3: two children */
        struct Node *temp = findMin(root->right);      /* successor */
        root->data = temp->data;                       /* copy value */
        root->right = delete(root->right, temp->data); /* remove successor */
    }
    return root;
}`,
          note: 'A leaf satisfies root->left == NULL, so it returns root->right which is NULL — Case 1 and Case 2 share the same code.',
        },
      ],
      program: {
        title: 'BST insert, search and delete (class notes, Program 2)',
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
    if (root == NULL) return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

struct Node *search(struct Node *root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (key < root->data)
        return search(root->left, key);
    else
        return search(root->right, key);
}

struct Node *findMin(struct Node *root) {
    while (root->left != NULL)
        root = root->left;
    return root;
}

struct Node *delete(struct Node *root, int key) {
    if (root == NULL) return root;
    if (key < root->data)
        root->left = delete(root->left, key);
    else if (key > root->data)
        root->right = delete(root->right, key);
    else {
        if (root->left == NULL) {            /* no child or right child only */
            struct Node *temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {    /* left child only */
            struct Node *temp = root->left;
            free(root);
            return temp;
        }
        struct Node *temp = findMin(root->right);   /* two children */
        root->data = temp->data;
        root->right = delete(root->right, temp->data);
    }
    return root;
}

void inorder(struct Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node *root = NULL;
    int n, i, value, key;

    printf("How many keys? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &value);
        root = insert(root, value);
    }
    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");

    printf("Key to search: ");
    scanf("%d", &key);
    if (search(root, key))
        printf("Node %d found in the tree.\\n", key);
    else
        printf("Node %d not found.\\n", key);

    printf("Key to delete: ");
    scanf("%d", &key);
    root = delete(root, key);
    printf("After deleting %d, Inorder Traversal: ", key);
    inorder(root);
    printf("\\n");
    return 0;
}`,
        input: `How many keys? 7
50 30 70 20 40 60 80
Key to search: 40
Key to delete: 70`,
        output: `Inorder Traversal: 20 30 40 50 60 70 80
Node 40 found in the tree.
After deleting 70, Inorder Traversal: 20 30 40 50 60 80`,
      },
      example: {
        title: 'delete 70 from 50(30(20,40),70(60,80))',
        html: `<ol>
<li>70 has <b>two children</b> (60, 80) → Case 3.</li>
<li>Successor = findMin(70→right) = findMin(80) = <b>80</b>.</li>
<li>Copy 80 into the node: tree is now 50(30(20,40),80(60,80)).</li>
<li>Delete the old 80 from the right subtree — it is a leaf → Case 1.</li>
<li>Result 50(30(20,40),80(60,–)). In-order: 20 30 40 50 60 80 ✓ (matches the program output).</li>
</ol>`,
      },
      complexity: [{ op: 'Delete', avg: 'O(log n)', worst: 'O(n)', note: 'Search O(h) + successor O(h) + O(1) relink' }],
      lab: 'bst',
      tips: [
        'Always <b>name the case</b> before you draw: "70 has two children → Case 3 → successor 80".',
        'Draw before/after trees side by side and re-check the in-order after deletion.',
      ],
      mistakes: [
        'Replacing with the successor but forgetting to <b>delete the successor node</b> → duplicate key.',
        'Using the right-most of the RIGHT subtree as successor. It is the LEFT-most of the right subtree.',
      ],
    },

    {
      id: 'bst-complexity',
      title: 'Complexity — balanced vs skewed BST',
      tagline: 'Everything costs O(h). h can be log n … or n.',
      definition:
        'Search, insert and delete in a BST all take <b>O(h)</b> time, where h is the height. For a <b>balanced</b> tree h ≈ log₂ n, so the operations are O(log n). For a <b>skewed</b> tree h = n − 1, so they degrade to O(n). A tree is <b>balanced</b> when the heights of the left and right subtrees of every node differ by at most 1.',
      simple: `<p>The same n keys can make a short bushy tree or a tall stick — it depends only on the <b>order of insertion</b>. The shape decides the speed. Height-balanced trees (AVL) force the good shape.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Balanced: 7 keys, height 2 → at most 3 comparisons',
          seq: [40, 20, 60, 10, 30, 50, 70],
        },
        {
          kind: 'tree',
          title: 'Skewed: same 7 keys inserted in sorted order, height 6 → up to 7 comparisons',
          spec: SKEW,
          caption: 'Insert 10, 20, 30, 40, 50, 60, 70. Every key goes right. Searching 70 touches all 7 nodes = O(n).',
        },
      ],
      complexity: [
        { op: 'Search / Insert / Delete', avg: 'O(log n)', worst: 'O(n)', note: 'Average over random insertion orders is O(log n); worst is sorted input' },
        { op: 'Traversal (any)', avg: 'O(n)', worst: 'O(n)', note: 'Must touch every node' },
        { op: 'Space', avg: 'O(n)', worst: 'O(n)', note: 'One node per key + O(h) recursion stack' },
      ],
      formulas: [
        'Best height for n nodes = ⌈log₂(n + 1)⌉ − 1.',
        'Worst height = n − 1 (skewed).',
        'Max comparisons in a search = h + 1.',
      ],
      tips: [
        '"Disadvantage of BST?" → its performance depends on insertion order; sorted input makes it O(n). "Solution?" → AVL / Red-Black / B-Tree.',
      ],
    },
  ],
}

import type { Topic } from './syllabus/types'
import { ALL_TOPICS } from './syllabus'
import { PROGRAMS } from './programs'
import { BTREE_PROGRAM, LINKED_PROGRAM } from './coursePrograms'
import { GENERAL_PROGRAM, MULTIWAY_OPERATIONS } from './extraPrograms'

const binaryOperations = ALL_TOPICS.find(t => t.id === 'bt-operations')!
const program = (id: string) => PROGRAMS.find(p => p.id === id)!

export const EXTRA_COURSE_TOPICS: Topic[] = [
  {
    id: 'general-create', title: 'Create a general tree and perform operations',
    definition: 'A general tree allows any number of children. Start with an empty root, create the root node, then attach each new child to its parent. A child-sibling representation stores the first child and next sibling pointers.',
    simple: '<p>Root se shuru karo. Har child ka parent choose karo. Binary tree ki tarah sirf do children ki limit nahi hai. Search aur traversal mein har child ko visit karna hota hai.</p><p>Yahan delete ka matlab <b>poora selected subtree</b> delete karna hai; siblings bache rehte hain. Yeh BST ki single-key deletion se alag hai.</p>',
    points: ['Empty tree: root = NULL. A single root has height 0.', 'Keys are unique in this example; missing parent or duplicate child leaves the tree unchanged.', 'Creation input: root key, edge count, parent-child pairs, search key, delete-subtree key.', 'Traversal, search, count and deletion take O(n) worst-case time.'],
    diagrams: [
      { kind: 'btree-shape', title: 'One parent, three children', tree: { keys: [1], children: [{ keys: [2], children: [{ keys: [5] }, { keys: [6] }] }, { keys: [3] }, { keys: [4] }] }, caption: 'These boxes are general-tree nodes, not B-Tree key ranges. Node 1 has three children.' },
      { kind: 'btree-shape', title: 'Delete the subtree rooted at 2', tree: { keys: [1], children: [{ keys: [3] }, { keys: [4] }] }, caption: 'Nodes 2, 5 and 6 are freed. Siblings 3 and 4 remain.' },
    ],
    algorithm: [
      { title: 'Create / add a child', steps: ['Allocate the root; initialize child and next pointers to NULL.', 'Search for the parent and reject a missing parent or duplicate key.', 'Append the new node to the parent\'s child list.'] },
      { title: 'Traverse / search / delete', steps: ['Preorder visits a node before recursively visiting each child.', 'Search compares at each visited node; return found or NULL.', 'For deletion, unlink the target from its sibling list.', 'Free all descendants before freeing the target. Keep the remaining siblings linked.'] },
    ],
    syntax: [{ title: 'Child-sibling node', code: 'struct Node {\n    int key;\n    struct Node *child, *next;\n};' }],
    program: GENERAL_PROGRAM,
  },
  {
    id: 'binary-create', title: 'Create an unordered binary tree from scratch',
    definition: 'Create an empty binary tree with root = NULL. Allocate each node and attach it at the first empty position in level order. Values do not decide left or right in this construction policy.',
    simple: '<p>10, 30, 5 insert karo: root 10, left 30, right 5. Yeh valid binary tree hai, par BST nahi. Pehle root, phir left slot, phir right slot fill hote hain.</p>',
    points: ['A new node has left = right = NULL.', 'This level-order policy creates a complete shape; an arbitrary binary tree need not be complete.', 'Duplicate values are allowed. The search/deletion program selects the first level-order match.', 'Input: node count, values, search key, delete key.'],
    diagrams: [
      { kind: 'tree', title: 'Example 1: three nodes', spec: '10(30,5)', showNulls: true },
      { kind: 'tree', title: 'Example 2: six nodes', spec: '8(2(9,4),7(1,))', caption: 'Input order: 8, 2, 7, 9, 4, 1. No comparisons between values are required.' },
    ],
    algorithm: [{ title: 'Create by repeated level-order insertion', steps: ['Set root = NULL.', 'Read a value and allocate a node.', 'If the tree is empty, make it the root.', 'Otherwise enqueue the root, visit nodes in level order and fill the first missing left/right pointer.', 'Repeat for every input value.'] }],
    syntax: [{ title: 'Empty tree and first node', code: 'struct Node *root = NULL;\nroot = createNode(10);\nroot->left = createNode(30);\nroot->right = createNode(5);' }],
    program: binaryOperations.program,
  },
  {
    id: 'tree-destroy', title: 'Clear a tree and free memory',
    definition: 'Destroy a linked tree in postorder: destroy its left subtree, destroy its right subtree, then free the node. Finally set the caller\'s root pointer to NULL.',
    simple: '<p>Pehle children free karo, phir parent. Parent pehle free karoge toh uske left/right pointers read karna invalid hai.</p>',
    diagrams: [{ kind: 'traversal', title: 'Free in the order 30, 5, 10', spec: '10(30,5)', order: 'postorder' }, { kind: 'tree', title: 'Last remaining root', spec: '10', caption: 'Free 10, then root = NULL. Calling destroy(NULL) is safe.' }],
    algorithm: [{ title: 'destroy(root)', steps: ['If root is NULL, return.', 'Destroy root.left, then root.right.', 'Free root. After the full call, set root = NULL.'] }],
    syntax: [{ title: 'Postorder cleanup', code: 'void destroy(struct Node *root) {\n    if (!root) return;\n    destroy(root->left);\n    destroy(root->right);\n    free(root);\n}\n/* In main: */\ndestroy(root);\nroot = NULL;' }],
    program: LINKED_PROGRAM,
    complexity: [{ op: 'Clear entire tree', avg: 'O(n)', worst: 'O(n)', note: 'O(h) recursion stack; every node freed once.' }],
  },
  {
    id: 'bst-queries', title: 'Predecessor, successor, kth smallest and range queries',
    definition: 'BST ordering also supports sorted queries: predecessor is the greatest smaller key, successor is the smallest greater key, kth smallest uses inorder rank, and a range query reports keys within inclusive bounds.',
    simple: '<p>Inorder list 10, 20, 30, 40, 50, 60, 70 ho toh 40 ka predecessor 30, successor 50 aur third smallest 30 hai. Range [25, 55] ka answer 30, 40, 50 hai.</p>',
    diagrams: [
      { kind: 'tree', title: 'Predecessor and successor of 40', spec: '40(20(10,30),60(50,70))', marks: { '40': 'current', '30': 'found', '50': 'found' } },
      { kind: 'traversal', title: 'Inorder ranks', spec: '40(20(10,30),60(50,70))', order: 'inorder' },
      { kind: 'tree', title: 'Inclusive range [25, 55]', spec: '40(20(10,30),60(50,70))', marks: { '30': 'found', '40': 'found', '50': 'found' }, dim: true },
    ],
    algorithm: [
      { title: 'Successor / predecessor', steps: ['For successor, keep a candidate whenever current key > target, then move left; otherwise move right.', 'For predecessor, keep a candidate whenever current key < target, then move right; otherwise move left.', 'Return the final candidate, or NULL when none exists.'] },
      { title: 'kth smallest / range', steps: ['Visit inorder and count visited nodes; the kth visited node is the kth smallest.', 'Reject k outside 1 through node count.', 'For range [lo, hi], visit left only when key > lo, print only when lo <= key <= hi, and visit right only when key < hi.'] },
    ],
    syntax: [{ title: 'Range pruning', code: 'void range(struct Node *r, int lo, int hi) {\n    if (!r) return;\n    if (r->data > lo) range(r->left, lo, hi);\n    if (lo <= r->data && r->data <= hi) printf("%d ", r->data);\n    if (r->data < hi) range(r->right, lo, hi);\n}' }],
    program: program('bstutil-user'),
    complexity: [{ op: 'Predecessor / successor', avg: 'O(log n)', worst: 'O(n)', note: 'O(h) in a plain BST.' }, { op: 'kth smallest without subtree sizes', avg: 'O(n)', worst: 'O(n)' }, { op: 'Range output of r keys', avg: 'O(log n + r)', worst: 'O(n)' }],
  },
  {
    id: 'multiway-operations', title: 'Create, insert, search, delete and traverse an m-way tree',
    definition: 'In a general m-way search tree, a node stores at most m - 1 sorted keys. There is no universal balancing rule. This example fills non-full leaves, descends into the matching child when full, and does not split or rebalance.',
    simple: '<p>Order 3 mein ek node mein maximum 2 keys. 20 aur 50 root mein aayenge. 10 left range mein, 30 aur 40 middle range mein, 60 right range mein. 35 insert karne par middle node full hai, isliye uske beech wale child mein naya node banega.</p><p>B-Tree mein full node split hota hai. Is unbalanced m-way policy mein nahi. Dono algorithms ko mix mat karo.</p>',
    points: ['Duplicates are ignored.', 'Deletion uses predecessor/successor when an adjacent subtree exists; otherwise remove the key and shift key/child slots together.', 'A zero-key leaf is freed. There is no minimum occupancy repair.', 'Inorder: child[0], key[0], child[1], key[1], ..., child[k].', 'Input: key count, keys, search key, deletion count, deletion keys.'],
    diagrams: [
      { kind: 'btree-shape', title: 'Example 1: 20, 50, 10, 30, 40, 60', tree: { keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40] }, { keys: [60] }] } },
      { kind: 'btree-shape', title: 'Example 2: insert 35 into a full middle node', tree: { keys: [20, 50], children: [{ keys: [10] }, { keys: [30, 40], children: [{ keys: [] }, { keys: [35] }, { keys: [] }] }, { keys: [60] }] }, caption: 'Empty boxes denote NULL ranges. Leaves need not have equal depth.' },
    ],
    algorithm: [
      { title: 'Insertion', steps: ['Create a node if the pointer is NULL.', 'Find the key or its range; ignore duplicates.', 'If this is a leaf with space, insert the key in sorted order.', 'Otherwise recursively insert into the range child. No splitting.'] },
      { title: 'Deletion', steps: ['Find the key by range search; a missing key leaves the tree unchanged.', 'If its left adjacent subtree exists, replace by its maximum key and recursively delete that key.', 'Otherwise if its right adjacent subtree exists, replace by its minimum key and recursively delete that key.', 'Otherwise remove the key and shift key/child slots. Free an empty leaf.'] },
    ],
    syntax: [{ title: 'Generalized inorder', code: 'for (int i = 0; i < node->n; ++i) {\n    inorder(node->child[i]);\n    printf("%d ", node->key[i]);\n}\ninorder(node->child[node->n]);' }],
    program: MULTIWAY_OPERATIONS,
    complexity: [{ op: 'Search / insert / delete', avg: 'Depends on shape', worst: 'O(n)', note: 'O(mh) with linear key scan; m is fixed here.' }, { op: 'Traversal / clear', avg: 'O(n)', worst: 'O(n)' }],
  },
  {
    id: 'btree-traverse', title: 'Sorted traversal and clearing a B Tree',
    definition: 'Generalized inorder visits each child range between its bounding keys and returns the B-Tree keys in sorted order. To clear the tree, free every child before freeing its parent.',
    simple: '<p>[20, 50] node ke liye order hai: left child, 20, middle child, 50, right child. Har key exactly ek baar aati hai. Delete-all aur delete-one alag operations hain.</p>',
    diagrams: [{ kind: 'btree-shape', title: 'Three ranges, one sorted output', tree: { keys: [20, 50], children: [{ keys: [5, 10] }, { keys: [30, 40] }, { keys: [60, 70] }] }, caption: '5 10 20 30 40 50 60 70' }, { kind: 'btree-shape', title: 'Single-node B Tree', tree: { keys: [10, 20, 30] }, caption: 'Traversal prints the keys in this node; there are no child calls.' }],
    algorithm: [{ title: 'Traverse / destroy', steps: ['For each key i, traverse child[i], then print key[i].', 'After the last key, traverse the last child.', 'For clearing, destroy all children first, then free the node and reset the root.'] }],
    program: BTREE_PROGRAM,
    complexity: [{ op: 'Traverse / clear', avg: 'O(n)', worst: 'O(n)' }],
  },
  {
    id: 'avl-traverse', title: 'AVL traversal, minimum, maximum and cleanup',
    definition: 'An AVL tree is still a BST. Inorder is sorted, minimum follows left pointers, maximum follows right pointers, and postorder cleanup frees all nodes. Read-only operations do not rotate the tree.',
    simple: '<p>Balance maintain karna insert/delete ka kaam hai. Search, traversal, min/max ya display karte waqt rotation nahi hota. Inorder aur balance factors dono check karke result verify karo.</p>',
    diagrams: [{ kind: 'traversal', title: 'Sorted inorder after balancing', spec: '20(10,30)', order: 'inorder' }, { kind: 'avl', title: 'Larger example: 40, 20, 60, 10, 30, 50, 70', seq: [40, 20, 60, 10, 30, 50, 70], caption: 'Minimum 10, maximum 70. Inorder: 10 20 30 40 50 60 70.' }],
    algorithm: [{ title: 'AVL read-only operations', steps: ['Use ordinary BST search or leftmost/rightmost walks.', 'Use preorder, inorder, postorder or a level-order queue for traversal.', 'Check each node has |height(left) - height(right)| <= 1.', 'To clear, recursively free children then parent and reset root = NULL.'] }],
    program: program('avl-del-user'),
    complexity: [{ op: 'Search / min / max', avg: 'O(log n)', worst: 'O(log n)' }, { op: 'Traversal / clear', avg: 'O(n)', worst: 'O(n)' }],
  },
]

export const LAB_CODE = {
  pre: `void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

/* User builds the tree with bst_insert + scanf. Never write A->left = new_node(...). */`,
  in: `void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

/* On a BST this prints keys in sorted order. */`,
  post: `void postorder(struct Node *root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

/* Free children before the parent if you delete the whole tree. */`,
  level: `void levelorder(struct Node *root) {
    if (root == NULL) return;
    struct Node *q[100];
    int front = 0, rear = 0;
    q[rear++] = root;
    while (front < rear) {
        struct Node *n = q[front++];
        printf("%d ", n->data);
        if (n->left)  q[rear++] = n->left;
        if (n->right) q[rear++] = n->right;
    }
}`,
  search: `struct Node *bst_search(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data) return root;
        if (key < root->data) root = root->left;
        else root = root->right;
    }
    return NULL;
}`,
  insert: `struct Node *bst_insert(struct Node *root, int key) {
    if (root == NULL) return new_node(key);
    if (key < root->data)
        root->left = bst_insert(root->left, key);
    else if (key > root->data)
        root->right = bst_insert(root->right, key);
    return root;
}

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->left = NULL;
    n->right = NULL;
    return n;
}`,
  delete: `struct Node *bst_delete(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (key < root->data)
        root->left = bst_delete(root->left, key);
    else if (key > root->data)
        root->right = bst_delete(root->right, key);
    else {
        if (root->left == NULL) return root->right;
        if (root->right == NULL) return root->left;
        struct Node *s = min_node(root->right);
        root->data = s->data;
        root->right = bst_delete(root->right, s->data);
    }
    return root;
}

struct Node *min_node(struct Node *n) {
    while (n->left != NULL) n = n->left;
    return n;
}`,
  avl: `struct Node *avl_insert(struct Node *n, int key) {
    if (n == NULL) return new_node(key);
    if (key < n->data) n->left = avl_insert(n->left, key);
    else if (key > n->data) n->right = avl_insert(n->right, key);
    else return n;
    int b = bf(n);
    if (b > 1 && key < n->left->data) return rotate_right(n);
    if (b < -1 && key > n->right->data) return rotate_left(n);
    if (b > 1 && key > n->left->data) {
        n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (b < -1 && key < n->right->data) {
        n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}

struct Node *rotate_right(struct Node *z) {
    struct Node *y = z->left;
    z->left = y->right;
    y->right = z;
    return y;
}

struct Node *rotate_left(struct Node *z) {
    struct Node *y = z->right;
    z->right = y->left;
    y->left = z;
    return y;
}`,
  heap: `void swim(int a[], int i) {          /* sift-up after append */
    while (i > 0) {
        int p = (i - 1) / 2;
        if (a[i] <= a[p]) break;
        swap(&a[i], &a[p]);
        i = p;
    }
}

void sink(int a[], int i, int n) {    /* sift-down after extract */
    for (;;) {
        int l = 2*i+1, r = 2*i+2, pick = i;
        if (l < n && a[l] > a[pick]) pick = l;
        if (r < n && a[r] > a[pick]) pick = r;
        if (pick == i) break;
        swap(&a[i], &a[pick]);
        i = pick;
    }
}

void heap_insert(int a[], int *n, int key) {
    a[(*n)++] = key;                  /* append = keep complete */
    swim(a, *n - 1);
}

int heap_extract(int a[], int *n) {
    int max = a[0];
    a[0] = a[--(*n)];                 /* last leaf → root */
    sink(a, 0, *n);
    return max;
}`,
  rbtree: `/* New node is RED. Fix while parent is RED. */
void rb_insert_fix(Node *z) {
    while (z->parent && z->parent->color == RED) {
        Node *p = z->parent, *g = p->parent, *u = uncle(z);
        if (u && u->color == RED) {           /* case 1: recolor */
            p->color = BLACK; u->color = BLACK; g->color = RED;
            z = g;                            /* climb */
        } else if (triangle(z)) {             /* case 2: rotate parent */
            rotate_at_parent(z);
        } else {                              /* case 3: rotate grandparent */
            p->color = BLACK; g->color = RED;
            rotate_at_grandparent(z);
        }
    }
    root->color = BLACK;
}`,
  huffman: `/* Repeat until one tree remains. */
while (forest has more than 1 tree) {
    a = extract_min(forest);          /* smallest freq */
    b = extract_min(forest);          /* next smallest */
    parent.freq = a.freq + b.freq;
    parent.left = a;  /* bit 0 */
    parent.right = b; /* bit 1 */
    insert(forest, parent);
}
/* Code of a letter = bits on the unique root→leaf path. */`,
  trie: `void trie_insert(Node *root, const char *w) {
    Node *cur = root;
    for (int i = 0; w[i]; i++) {
        int k = w[i] - 'a';
        if (cur->next[k] == NULL)
            cur->next[k] = new_trie_node();
        cur = cur->next[k];
    }
    cur->end = 1;   /* word ends here */
}`,
  btree: `void btree_insert(Node *root, int key, int m) {
    /* walk down to the leaf that should hold key */
    Node *leaf = find_leaf(root, key);
    insert_sorted(leaf, key);
    while (overflow(leaf, m)) {
        int median = split(leaf);
        if (leaf == root) {
            root = new_root(median, left, right);
            break;
        }
        promote(parent, median);
        leaf = parent;
    }
}`,
} as const

export const LAB_PSEUDO = {
  pre: `PREORDER(n):
  if n is null: return
  visit n            // Node
  PREORDER(n.left)   // Left
  PREORDER(n.right)  // Right`,
  in: `INORDER(n):
  if n is null: return
  INORDER(n.left)    // Left
  visit n            // Node
  INORDER(n.right)   // Right`,
  post: `POSTORDER(n):
  if n is null: return
  POSTORDER(n.left)
  POSTORDER(n.right)
  visit n`,
  level: `LEVELORDER(root):
  queue ← [root]
  while queue not empty:
      n ← dequeue()
      visit n
      enqueue children`,
  search: `BST-SEARCH(n, key):
  while n is not null:
      if key = n.data: return n
      if key < n.data: n ← n.left
      else:            n ← n.right
  return not-found`,
  insert: `BST-INSERT(n, key):
  if n is null: return new node(key)
  if key < n.data: n.left  ← INSERT(n.left, key)
  if key > n.data: n.right ← INSERT(n.right, key)
  return n`,
  delete: `BST-DELETE(n, key):
  find the node
  leaf: unlink
  one child: replace by that child
  two children: copy inorder successor, delete successor`,
  avl: `AVL-INSERT(n, key):
  BST insert as a leaf
  walk back up
  if |BF| = 2: rotate (LL / RR / LR / RL)
  return n`,
  heap: `HEAP-INSERT(a, key):
  append key at a[n]
  i ← n
  while i > 0 and a[i] > a[parent(i)]:
      swap with parent
      i ← parent(i)

HEAP-EXTRACT-MAX(a):
  max ← a[0]
  a[0] ← a[n-1]; n ← n-1
  sink a[0] with the larger child`,
  rbtree: `RB-INSERT(T, key):
  BST-insert key as a RED leaf
  while parent is RED:
      if uncle RED: recolor, climb to grandparent
      else if triangle: rotate at parent
      else line: rotate at grandparent, recolor
  paint root BLACK`,
  huffman: `HUFFMAN(freqs):
  forest ← one node per letter
  while |forest| > 1:
      merge two lightest trees
  codes ← 0/1 path from root to each letter`,
  trie: `TRIE-INSERT(root, word):
  cur ← root
  for each letter ch:
      if no child ch: create it
      cur ← that child
  mark cur as END of word`,
  btree: `B-TREE-INSERT(T, k):
  walk to leaf
  insert k in sorted order
  while node has > m-1 keys:
      split at median and promote
      if root split, grow a new root`,
} as const

export type LabSnippetId = keyof typeof LAB_CODE

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
  btree: `B-TREE-INSERT(T, k):
  walk to leaf
  insert k in sorted order
  while node has > m-1 keys:
      split at median and promote
      if root split, grow a new root`,
} as const

export type LabSnippetId = keyof typeof LAB_CODE

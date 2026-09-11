export type Program = {
  id: string
  title: string
  source: string
  blurb: string
  code: string
  /** Grouping shown in the sidebar. */
  topic?: 'Binary tree' | 'BST' | 'AVL' | 'B-Tree' | 'Heap' | 'Advanced'
}

const NODE = `struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node *insert(struct Node *root, int key) {
    if (root == NULL)
        return new_node(key);
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    return root;
}
`

export const PROGRAMS: Program[] = [
  {
    id: 'bst-menu',
    title: 'General BST menu (user types every key)',
    source: 'Insert / Search / Delete / Traversals',
    topic: 'BST',
    blurb:
      'No node is created in source as A->left = …. User types keys. Menu: insert, search, delete, four traversals, height.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
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
}

void levelorder(struct Node *root) {
    struct Node *q[200];
    int f = 0, r = 0;
    if (root == NULL) return;
    q[r++] = root;
    while (f < r) {
        struct Node *n = q[f++];
        printf("%d ", n->data);
        if (n->left) q[r++] = n->left;
        if (n->right) q[r++] = n->right;
    }
}

struct Node *search(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data) return root;
        if (key < root->data) root = root->left;
        else root = root->right;
    }
    return NULL;
}

struct Node *min_node(struct Node *n) {
    while (n->left != NULL) n = n->left;
    return n;
}

struct Node *delete_key(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (key < root->data)
        root->left = delete_key(root->left, key);
    else if (key > root->data)
        root->right = delete_key(root->right, key);
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
        struct Node *s = min_node(root->right);
        root->data = s->data;
        root->right = delete_key(root->right, s->data);
    }
    return root;
}

int height(struct Node *n) {
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n->left);
    hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

int main(void) {
    struct Node *root = NULL;
    int ch, key;
    printf("Build the tree yourself. Type keys. Do not hard-code nodes.\\n");
    while (1) {
        printf("\\n1.Insert  2.Search  3.Delete  4.Pre  5.In  6.Post  7.Level  8.Height  0.Exit\\n");
        printf("Choice: ");
        if (scanf("%d", &ch) != 1) return 0;
        if (ch == 0) break;
        if (ch == 1) {
            printf("Key to insert: ");
            scanf("%d", &key);
            root = insert(root, key);
        } else if (ch == 2) {
            printf("Key to search: ");
            scanf("%d", &key);
            printf(search(root, key) ? "Found\\n" : "Not found\\n");
        } else if (ch == 3) {
            printf("Key to delete: ");
            scanf("%d", &key);
            root = delete_key(root, key);
        } else if (ch == 4) { preorder(root); printf("\\n"); }
        else if (ch == 5) { inorder(root); printf("\\n"); }
        else if (ch == 6) { postorder(root); printf("\\n"); }
        else if (ch == 7) { levelorder(root); printf("\\n"); }
        else if (ch == 8) printf("height = %d\\n", height(root));
    }
    return 0;
}
`,
  },
  {
    id: 'trav-user',
    title: 'Recursive traversals — user inserts n keys first',
    topic: 'Binary tree',
    source: 'Pre / In / Post / Level',
    blurb: 'Ask n, then n keys. Tree is built only with insert(). Then print all four orders.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
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
}
void levelorder(struct Node *root) {
    struct Node *q[200];
    int f = 0, r = 0;
    if (root == NULL) return;
    q[r++] = root;
    while (f < r) {
        struct Node *n = q[f++];
        printf("%d ", n->data);
        if (n->left) q[r++] = n->left;
        if (n->right) q[r++] = n->right;
    }
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;
    printf("How many keys? ");
    scanf("%d", &n);
    printf("Enter %d keys:\\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &key);
        root = insert(root, key);
    }
    printf("Pre-order: ");  preorder(root);  printf("\\n");
    printf("In-order: ");   inorder(root);   printf("\\n");
    printf("Post-order: "); postorder(root); printf("\\n");
    printf("Level-order: "); levelorder(root); printf("\\n");
    return 0;
}
`,
  },
  {
    id: 'search-user',
    title: 'BST search — keys from keyboard',
    topic: 'BST',
    source: 'bst_search',
    blurb: 'Full function with proper syntax. User builds tree, then searches a key.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
struct Node *bst_search(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data)
            return root;
        if (key < root->data)
            root = root->left;
        else
            root = root->right;
    }
    return NULL;
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;
    printf("How many keys to insert? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        printf("insert: ");
        scanf("%d", &key);
        root = insert(root, key);
    }
    printf("Search key: ");
    scanf("%d", &key);
    if (bst_search(root, key) != NULL)
        printf("%d is present.\\n", key);
    else
        printf("%d is not present.\\n", key);
    return 0;
}
`,
  },
  {
    id: 'delete-user',
    title: 'BST delete — all three cases',
    topic: 'BST',
    source: 'leaf / one child / two children',
    blurb: 'Type a tree, then a delete key. Successor is min of right subtree.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

struct Node *min_node(struct Node *n) {
    while (n->left != NULL)
        n = n->left;
    return n;
}

struct Node *bst_delete(struct Node *root, int key) {
    if (root == NULL)
        return NULL;
    if (key < root->data)
        root->left = bst_delete(root->left, key);
    else if (key > root->data)
        root->right = bst_delete(root->right, key);
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
        struct Node *s = min_node(root->right);
        root->data = s->data;
        root->right = bst_delete(root->right, s->data);
    }
    return root;
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;
    printf("How many keys? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &key);
        root = insert(root, key);
    }
    printf("In-order before delete: ");
    inorder(root);
    printf("\\nKey to delete: ");
    scanf("%d", &key);
    root = bst_delete(root, key);
    printf("In-order after delete: ");
    inorder(root);
    printf("\\n");
    return 0;
}
`,
  },
  {
    id: 'avl-user',
    title: 'AVL insert with LL / RR / LR / RL rotations',
    topic: 'AVL',
    source: 'LL / RR / LR / RL',
    blurb: 'Full rotate_left, rotate_right, bf, avl_insert. Type keys like 10 20 30.',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    int h;
    struct Node *left, *right;
};

int height(struct Node *n) { return n ? n->h : -1; }
int max2(int a, int b) { return a > b ? a : b; }
void fixh(struct Node *n) {
    n->h = 1 + max2(height(n->left), height(n->right));
}
int bf(struct Node *n) {
    return n ? height(n->left) - height(n->right) : 0;
}

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->h = 0;
    n->left = n->right = NULL;
    return n;
}

struct Node *rotate_right(struct Node *z) {
    struct Node *y = z->left;
    z->left = y->right;
    y->right = z;
    fixh(z);
    fixh(y);
    return y;
}

struct Node *rotate_left(struct Node *z) {
    struct Node *y = z->right;
    z->right = y->left;
    y->left = z;
    fixh(z);
    fixh(y);
    return y;
}

struct Node *avl_insert(struct Node *n, int key) {
    if (n == NULL) return new_node(key);
    if (key < n->data) n->left = avl_insert(n->left, key);
    else if (key > n->data) n->right = avl_insert(n->right, key);
    else return n;
    fixh(n);
    if (bf(n) > 1 && key < n->left->data) return rotate_right(n);
    if (bf(n) < -1 && key > n->right->data) return rotate_left(n);
    if (bf(n) > 1 && key > n->left->data) {
        n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (bf(n) < -1 && key < n->right->data) {
        n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}

void inorder(struct Node *r) {
    if (!r) return;
    inorder(r->left);
    printf("%d ", r->data);
    inorder(r->right);
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;
    printf("How many keys? ");
    scanf("%d", &n);
    printf("Enter keys (try 10 20 30 or 30 20 10):\\n");
    for (i = 0; i < n; i++) {
        scanf("%d", &key);
        root = avl_insert(root, key);
    }
    printf("In-order: ");
    inorder(root);
    printf("\\nRoot = %d, height = %d\\n", root ? root->data : -1, height(root));
    return 0;
}
`,
  },
  {
    id: 'count-user',
    title: 'Height, node count and leaf count',
    topic: 'Binary tree',
    source: 'Simple metrics',
    blurb: 'height(NULL)=-1 so a leaf has height 0. All functions complete.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
int height(struct Node *n) {
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n->left);
    hr = height(n->right);
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
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;
    printf("How many keys? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &key);
        root = insert(root, key);
    }
    printf("n = %d\\n", count(root));
    printf("height = %d\\n", height(root));
    printf("leaves = %d\\n", leaves(root));
    return 0;
}
`,
  },
  {
    id: 'btree-user',
    title: 'Order-3 B-Tree insert — split at the median',
    topic: 'B-Tree',
    source: 'Split at median',
    blurb: 'Type keys until -1. No hard-coded 10,20,5 in main — you type them.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define M 3
#define MAXK (M - 1)

typedef struct Node {
    int nkeys;
    int keys[M];
    struct Node *child[M + 1];
    int leaf;
} Node;

Node *new_node(int leaf) {
    Node *x = (Node *)calloc(1, sizeof(Node));
    x->leaf = leaf;
    return x;
}

void print_tree(Node *x, int depth) {
    int i, d;
    if (!x) return;
    for (d = 0; d < depth; d++) printf("  ");
    printf("[");
    for (i = 0; i < x->nkeys; i++) printf("%s%d", i ? " " : "", x->keys[i]);
    printf("]\\n");
    if (!x->leaf)
        for (i = 0; i <= x->nkeys; i++) print_tree(x->child[i], depth + 1);
}

int find_child(Node *x, int k) {
    int i = 0;
    while (i < x->nkeys && k > x->keys[i]) i++;
    return i;
}

void insert_key(Node *x, int k, Node *right) {
    int i = x->nkeys - 1;
    while (i >= 0 && x->keys[i] > k) {
        x->keys[i + 1] = x->keys[i];
        x->child[i + 2] = x->child[i + 1];
        i--;
    }
    x->keys[i + 1] = k;
    x->child[i + 2] = right;
    x->nkeys++;
}

Node *split(Node *x, int *median) {
    int mid = x->nkeys / 2, i;
    Node *r = new_node(x->leaf);
    *median = x->keys[mid];
    r->nkeys = x->nkeys - mid - 1;
    for (i = 0; i < r->nkeys; i++) r->keys[i] = x->keys[mid + 1 + i];
    if (!x->leaf)
        for (i = 0; i <= r->nkeys; i++) r->child[i] = x->child[mid + 1 + i];
    x->nkeys = mid;
    return r;
}

Node *insert_rec(Node *x, int k, int *up, Node **right) {
    if (x->leaf) {
        insert_key(x, k, NULL);
    } else {
        int i = find_child(x, k);
        int cup = 0;
        Node *cr = NULL;
        insert_rec(x->child[i], k, &cup, &cr);
        if (cr) insert_key(x, cup, cr);
    }
    if (x->nkeys > MAXK) {
        *right = split(x, up);
        return x;
    }
    *right = NULL;
    return x;
}

Node *btree_insert(Node *root, int k) {
    int up;
    Node *right = NULL;
    if (!root) {
        root = new_node(1);
        root->keys[0] = k;
        root->nkeys = 1;
        return root;
    }
    insert_rec(root, k, &up, &right);
    if (right) {
        Node *nr = new_node(0);
        nr->keys[0] = up;
        nr->nkeys = 1;
        nr->child[0] = root;
        nr->child[1] = right;
        return nr;
    }
    return root;
}

int main(void) {
    Node *root = NULL;
    int k;
    printf("Enter keys, end with -1:\\n");
    while (scanf("%d", &k) == 1 && k != -1) {
        root = btree_insert(root, k);
        printf("After %d:\\n", k);
        print_tree(root, 0);
    }
    return 0;
}
`,
  },
  {
    id: 'heap',
    title: 'Max-heap as an array — insert and extract-max',
    topic: 'Heap',
    source: 'Insert + extract-max + print array/tree indexes',
    blurb: 'The array IS the tree. Insert appends then swims. Extract swaps root with last, then sinks.',
    code: `#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void swim(int a[], int i) {
    while (i > 0) {
        int p = (i - 1) / 2;
        if (a[i] <= a[p]) break;
        swap(&a[i], &a[p]);
        i = p;
    }
}

void sink(int a[], int i, int n) {
    for (;;) {
        int l = 2 * i + 1, r = 2 * i + 2, pick = i;
        if (l < n && a[l] > a[pick]) pick = l;
        if (r < n && a[r] > a[pick]) pick = r;
        if (pick == i) break;
        swap(&a[i], &a[pick]);
        i = pick;
    }
}

void print(int a[], int n) {
    int i;
    printf("array: ");
    for (i = 0; i < n; i++) printf("[%d]=%d ", i, a[i]);
    printf("\\n");
}

int main(void) {
    int a[100], n = 0, ch, k;
    for (;;) {
        printf("1 insert  2 extract-max  3 print  0 quit\\n");
        if (scanf("%d", &ch) != 1) break;
        if (ch == 0) break;
        if (ch == 1) {
            printf("key: ");
            scanf("%d", &k);
            a[n++] = k;
            swim(a, n - 1);
        } else if (ch == 2 && n) {
            printf("max = %d\\n", a[0]);
            a[0] = a[--n];
            if (n) sink(a, 0, n);
        } else if (ch == 3) print(a, n);
    }
    return 0;
}
`,
  },
  {
    id: 'huffman',
    title: 'Huffman codes from typed frequencies',
    topic: 'Advanced',
    source: 'Build code tree, print leaf codes',
    blurb: 'Type n, then letter and frequency pairs. Merges two lightest trees. Left=0, right=1.',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char ch;
    int freq;
    struct Node *left, *right;
} Node;

Node *newn(char ch, int f, Node *l, Node *r) {
    Node *n = (Node *)malloc(sizeof(Node));
    n->ch = ch; n->freq = f; n->left = l; n->right = r;
    return n;
}

void codes(Node *n, char *buf, int d) {
    if (!n) return;
    if (!n->left && !n->right) {
        buf[d] = 0;
        printf("%c  f=%d  %s\\n", n->ch, n->freq, d ? buf : "0");
        return;
    }
    buf[d] = '0'; codes(n->left, buf, d + 1);
    buf[d] = '1'; codes(n->right, buf, d + 1);
}

int main(void) {
    Node *f[64];
    int n, i, a, b;
    char c;
    printf("How many letters? ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        printf("letter freq: ");
        scanf(" %c %d", &c, &a);
        f[i] = newn(c, a, NULL, NULL);
    }
    while (n > 1) {
        a = 0; b = 1;
        if (f[b]->freq < f[a]->freq) { a = 1; b = 0; }
        for (i = 2; i < n; i++) {
            if (f[i]->freq < f[a]->freq) { b = a; a = i; }
            else if (f[i]->freq < f[b]->freq) b = i;
        }
        Node *p = newn('#', f[a]->freq + f[b]->freq, f[a], f[b]);
        if (a > b) { i = a; a = b; b = i; }
        f[a] = p;
        f[b] = f[n - 1];
        n--;
    }
    {
        char buf[64];
        codes(f[0], buf, 0);
    }
    return 0;
}
`,
  },
  {
    id: 'trie',
    title: 'Trie of words the user types',
    topic: 'Advanced',
    source: 'Insert words, search prefix / full word',
    blurb: '26 children. END flag so car and cart can both exist. Time is word length, not dictionary size.',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef struct Node {
    int end;
    struct Node *next[26];
} Node;

Node *newn(void) {
    Node *n = (Node *)calloc(1, sizeof(Node));
    return n;
}

void insert(Node *r, const char *w) {
    int i;
    for (i = 0; w[i]; i++) {
        int k = tolower((unsigned char)w[i]) - 'a';
        if (k < 0 || k > 25) continue;
        if (!r->next[k]) r->next[k] = newn();
        r = r->next[k];
    }
    r->end = 1;
}

int search(Node *r, const char *w) {
    int i;
    for (i = 0; w[i]; i++) {
        int k = tolower((unsigned char)w[i]) - 'a';
        if (k < 0 || k > 25 || !r->next[k]) return 0;
        r = r->next[k];
    }
    return r->end;
}

int main(void) {
    Node *root = newn();
    char w[64];
    int ch;
    for (;;) {
        printf("1 insert word  2 search word  0 quit\\n");
        if (scanf("%d", &ch) != 1) break;
        if (ch == 0) break;
        printf("word: ");
        scanf("%63s", w);
        if (ch == 1) insert(root, w);
        else printf(search(root, w) ? "found\\n" : "missing\\n");
    }
    return 0;
}
`,
  },
  {
    id: 'nonrec-user',
    title: 'Non-recursive traversals (explicit stack)',
    source: 'Iterative pre / in / post order',
    topic: 'Binary tree',
    blurb:
      'The guaranteed exam question. One explicit stack replaces recursion. Post-order uses the two-stack trick. You type n and the keys.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAXS 100

${NODE}
void preorder_iter(struct Node *root) {
    struct Node *stack[MAXS];
    int top = -1;
    if (root == NULL) return;
    stack[++top] = root;
    while (top >= 0) {
        struct Node *n = stack[top--];
        printf("%d ", n->data);                 /* visit on pop */
        if (n->right) stack[++top] = n->right;  /* push RIGHT first */
        if (n->left)  stack[++top] = n->left;   /* so LEFT pops first */
    }
}

void inorder_iter(struct Node *root) {
    struct Node *stack[MAXS], *cur = root;
    int top = -1;
    while (1) {
        while (cur != NULL) {          /* dive left, remember the way back */
            stack[++top] = cur;
            cur = cur->left;
        }
        if (top == -1) break;
        cur = stack[top--];
        printf("%d ", cur->data);      /* LEFT finished -> print NODE */
        cur = cur->right;              /* now the RIGHT subtree */
    }
}

void postorder_iter(struct Node *root) {
    struct Node *s1[MAXS], *s2[MAXS];
    int t1 = -1, t2 = -1;
    if (root == NULL) return;
    s1[++t1] = root;
    while (t1 >= 0) {                  /* this loop produces N R L */
        struct Node *n = s1[t1--];
        s2[++t2] = n;
        if (n->left)  s1[++t1] = n->left;
        if (n->right) s1[++t1] = n->right;
    }
    while (t2 >= 0)                    /* reversing it gives L R N */
        printf("%d ", s2[t2--]->data);
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    printf("\\nPre-order  (iterative): ");
    preorder_iter(root);
    printf("\\nIn-order   (iterative): ");
    inorder_iter(root);
    printf("\\nPost-order (two stacks): ");
    postorder_iter(root);
    printf("\\n\\nIn-order must come out sorted because the tree is a BST.\\n");
    return 0;
}
`,
  },
  {
    id: 'level-user',
    title: 'Level-order traversal, level by level, height and width',
    source: 'BFS with a queue',
    topic: 'Binary tree',
    blurb:
      'One queue gives you four answers: level-order output, each level on its own line, the height, and the widest level.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAXQ 200

${NODE}
void levelorder(struct Node *root) {
    struct Node *q[MAXQ];
    int front = 0, rear = 0;
    if (root == NULL) return;
    q[rear++] = root;
    while (front < rear) {
        struct Node *n = q[front++];
        printf("%d ", n->data);
        if (n->left)  q[rear++] = n->left;
        if (n->right) q[rear++] = n->right;
    }
}

/* Same queue, but process one whole level per outer iteration. */
void level_by_level(struct Node *root) {
    struct Node *q[MAXQ];
    int front = 0, rear = 0, level = 0;
    if (root == NULL) return;
    q[rear++] = root;
    while (front < rear) {
        int count = rear - front;          /* how many nodes on this level */
        int i;
        printf("Level %d (%d node%s): ", level, count, count == 1 ? "" : "s");
        for (i = 0; i < count; i++) {
            struct Node *n = q[front++];
            printf("%d ", n->data);
            if (n->left)  q[rear++] = n->left;
            if (n->right) q[rear++] = n->right;
        }
        printf("\\n");
        level++;
    }
}

int height(struct Node *n) {               /* height(leaf) = 0 */
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n->left);
    hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

int max_width(struct Node *root) {
    struct Node *q[MAXQ];
    int front = 0, rear = 0, best = 0;
    if (root == NULL) return 0;
    q[rear++] = root;
    while (front < rear) {
        int count = rear - front, i;
        if (count > best) best = count;
        for (i = 0; i < count; i++) {
            struct Node *n = q[front++];
            if (n->left)  q[rear++] = n->left;
            if (n->right) q[rear++] = n->right;
        }
    }
    return best;
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key;

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    printf("\\nLevel-order: ");
    levelorder(root);
    printf("\\n\\n");
    level_by_level(root);
    printf("\\nHeight (edges) = %d\\n", height(root));
    printf("Widest level   = %d nodes\\n", max_width(root));
    return 0;
}
`,
  },
  {
    id: 'shape-user',
    title: 'Mirror, copy and identical-check',
    source: 'Structural operations',
    topic: 'Binary tree',
    blurb:
      'Mirror swaps every left and right. Copy is pre-order (parent before children). Identical compares data and shape together.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void mirror(struct Node *n) {
    struct Node *t;
    if (n == NULL) return;
    mirror(n->left);
    mirror(n->right);
    t = n->left;                  /* swap the two pointers */
    n->left = n->right;
    n->right = t;
}

struct Node *copy_tree(struct Node *n) {
    struct Node *c;
    if (n == NULL) return NULL;
    c = new_node(n->data);        /* parent FIRST: this is pre-order */
    c->left  = copy_tree(n->left);
    c->right = copy_tree(n->right);
    return c;
}

int identical(struct Node *a, struct Node *b) {
    if (a == NULL && b == NULL) return 1;
    if (a == NULL || b == NULL) return 0;
    return (a->data == b->data)
        && identical(a->left,  b->left)
        && identical(a->right, b->right);
}

void free_tree(struct Node *n) {   /* post-order: children before parent */
    if (n == NULL) return;
    free_tree(n->left);
    free_tree(n->right);
    free(n);
}

int main(void) {
    struct Node *root = NULL, *clone = NULL;
    int n, i, key;

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    printf("\\nOriginal  in-order : ");
    inorder(root);
    printf("\\nOriginal  pre-order: ");
    preorder(root);

    clone = copy_tree(root);
    printf("\\n\\nDeep copy made. identical(root, clone) = %d (expect 1)\\n", identical(root, clone));

    mirror(clone);
    printf("Mirror    in-order : ");
    inorder(clone);
    printf("\\nMirror    pre-order: ");
    preorder(clone);
    printf("\\nidentical(root, mirror) = %d (expect 0 unless the tree is symmetric)\\n",
           identical(root, clone));
    printf("\\nNote: mirroring a BST reverses the in-order, so it is no longer a BST.\\n");

    free_tree(root);
    free_tree(clone);
    return 0;
}
`,
  },
  {
    id: 'query-user',
    title: 'LCA, diameter, level of a key and all root-to-leaf paths',
    source: 'Query operations',
    topic: 'Binary tree',
    blurb:
      'Four classic questions on one tree you build yourself. LCA uses the BST split rule; diameter takes the best of three choices.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
int height(struct Node *n) {
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n->left);
    hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

/* In a BST the LCA is the node where the two keys stop going the same way. */
struct Node *lca(struct Node *n, int p, int q) {
    while (n != NULL) {
        if (p < n->data && q < n->data)      n = n->left;
        else if (p > n->data && q > n->data) n = n->right;
        else return n;                        /* they split here */
    }
    return NULL;
}

/* Longest path between ANY two nodes, counted in edges. */
int diameter(struct Node *n) {
    int through, dl, dr;
    if (n == NULL) return 0;
    through = height(n->left) + height(n->right) + 2;
    dl = diameter(n->left);
    dr = diameter(n->right);
    if (dl > through) through = dl;
    if (dr > through) through = dr;
    return through;
}

int level_of(struct Node *n, int key, int level) {
    int l;
    if (n == NULL) return -1;
    if (n->data == key) return level;
    l = level_of(n->left, key, level + 1);
    if (l != -1) return l;
    return level_of(n->right, key, level + 1);
}

void print_paths(struct Node *n, int path[], int len) {
    if (n == NULL) return;
    path[len++] = n->data;
    if (n->left == NULL && n->right == NULL) {
        int i;
        for (i = 0; i < len; i++) printf("%d%s", path[i], i + 1 < len ? " -> " : "");
        printf("\\n");
    } else {
        print_paths(n->left,  path, len);
        print_paths(n->right, path, len);
    }
}

int main(void) {
    struct Node *root = NULL, *a;
    int n, i, key, p, q, path[100];

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    printf("\\nHeight   = %d edges\\n", height(root));
    printf("Diameter = %d edges (%d nodes)\\n", diameter(root), diameter(root) + 1);

    printf("\\nAll root-to-leaf paths:\\n");
    print_paths(root, path, 0);

    printf("\\nKey to locate: ");
    if (scanf("%d", &key) == 1)
        printf("level_of(%d) = %d  (root is level 0, -1 means not found)\\n", key, level_of(root, key, 0));

    printf("\\nTwo keys for LCA: ");
    if (scanf("%d %d", &p, &q) == 2) {
        a = lca(root, p, q);
        if (a) printf("LCA(%d, %d) = %d\\n", p, q, a->data);
        else   printf("One of the keys is not in the tree.\\n");
    }
    return 0;
}
`,
  },
  {
    id: 'avl-del-user',
    title: 'AVL insert AND delete with rebalancing',
    source: 'Menu: insert / delete / traversals',
    topic: 'AVL',
    blurb:
      'Delete is the harder half: one insert needs at most one rotation, but a delete may rotate at every ancestor. Rotation cases are chosen from the BF of the taller child.',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    int h;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->h = 0;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int ht(struct Node *n) { return n == NULL ? -1 : n->h; }

void fixh(struct Node *n) {
    int a = ht(n->left), b = ht(n->right);
    n->h = 1 + (a > b ? a : b);
}

int bf(struct Node *n) { return n == NULL ? 0 : ht(n->left) - ht(n->right); }

struct Node *rotate_right(struct Node *z) {
    struct Node *y = z->left;
    z->left = y->right;
    y->right = z;
    fixh(z);
    fixh(y);
    return y;
}

struct Node *rotate_left(struct Node *z) {
    struct Node *y = z->right;
    z->right = y->left;
    y->left = z;
    fixh(z);
    fixh(y);
    return y;
}

struct Node *avl_insert(struct Node *n, int key) {
    int b;
    if (n == NULL) return new_node(key);
    if (key < n->data)      n->left  = avl_insert(n->left,  key);
    else if (key > n->data) n->right = avl_insert(n->right, key);
    else return n;                                   /* duplicates ignored */
    fixh(n);
    b = bf(n);
    if (b > 1 && key < n->left->data)  return rotate_right(n);            /* LL */
    if (b < -1 && key > n->right->data) return rotate_left(n);            /* RR */
    if (b > 1 && key > n->left->data) {                                   /* LR */
        n->left = rotate_left(n->left);
        return rotate_right(n);
    }
    if (b < -1 && key < n->right->data) {                                 /* RL */
        n->right = rotate_right(n->right);
        return rotate_left(n);
    }
    return n;
}

struct Node *avl_delete(struct Node *n, int key) {
    int b;
    if (n == NULL) return NULL;
    if (key < n->data)      n->left  = avl_delete(n->left,  key);
    else if (key > n->data) n->right = avl_delete(n->right, key);
    else {
        if (n->left == NULL)  { struct Node *t = n->right; free(n); return t; }
        if (n->right == NULL) { struct Node *t = n->left;  free(n); return t; }
        {
            struct Node *s = n->right;               /* inorder successor */
            while (s->left) s = s->left;
            n->data  = s->data;
            n->right = avl_delete(n->right, s->data);
        }
    }
    fixh(n);
    b = bf(n);
    /* Delete cases are named from the BF of the TALLER CHILD, not from a new key. */
    if (b > 1 && bf(n->left) >= 0)  return rotate_right(n);               /* L0 / L1  */
    if (b > 1) { n->left = rotate_left(n->left); return rotate_right(n); } /* L-1     */
    if (b < -1 && bf(n->right) <= 0) return rotate_left(n);               /* R0 / R-1 */
    if (b < -1) { n->right = rotate_right(n->right); return rotate_left(n); } /* R1   */
    return n;
}

void inorder(struct Node *n) {
    if (n == NULL) return;
    inorder(n->left);
    printf("%d ", n->data);
    inorder(n->right);
}

void show(struct Node *n, int depth) {
    int i;
    if (n == NULL) return;
    show(n->right, depth + 1);
    for (i = 0; i < depth; i++) printf("      ");
    printf("%d(BF %+d)\\n", n->data, bf(n));
    show(n->left, depth + 1);
}

int main(void) {
    struct Node *root = NULL;
    int ch, key;
    for (;;) {
        printf("\\n1 insert  2 delete  3 inorder  4 show tree (rotated 90 deg)  0 quit\\n> ");
        if (scanf("%d", &ch) != 1 || ch == 0) break;
        if (ch == 1 || ch == 2) {
            printf("key: ");
            if (scanf("%d", &key) != 1) break;
            root = (ch == 1) ? avl_insert(root, key) : avl_delete(root, key);
            printf("done. tree now:\\n");
            show(root, 0);
        } else if (ch == 3) {
            printf("inorder (must be sorted): ");
            inorder(root);
            printf("\\n");
        } else if (ch == 4) {
            show(root, 0);
        }
    }
    return 0;
}
`,
  },
  {
    id: 'heapsort-user',
    title: 'Heap sort — build-heap in O(n), then swap and shrink',
    source: 'In-place Θ(n log n) sort',
    topic: 'Heap',
    blurb:
      'Max-heap gives ascending order. Build starts at index n/2 − 1 because the second half of the array is already made of leaves.',
    code: `#include <stdio.h>

void print_arr(const char *label, int a[], int n) {
    int i;
    printf("%-22s", label);
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");
}

/* Push a[i] down until the max-heap order holds below it. */
void heapify(int a[], int n, int i) {
    int big = i, l = 2 * i + 1, r = 2 * i + 2, t;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;   /* must pick the LARGER child */
    if (big != i) {
        t = a[i]; a[i] = a[big]; a[big] = t;
        heapify(a, n, big);
    }
}

void build_heap(int a[], int n) {
    int i;
    for (i = n / 2 - 1; i >= 0; i--)       /* last internal node, walk back to root */
        heapify(a, n, i);
}

void heap_sort(int a[], int n) {
    int i, t;
    build_heap(a, n);
    print_arr("after build_heap:", a, n);
    for (i = n - 1; i > 0; i--) {
        t = a[0]; a[0] = a[i]; a[i] = t;   /* biggest goes to its final slot */
        heapify(a, i, 0);                  /* NOTE: size is i, not n */
        printf("pass %-2d sorted tail -> ", n - i);
        print_arr("", a, n);
    }
}

int main(void) {
    int a[100], n, i;
    printf("How many numbers? ");
    if (scanf("%d", &n) != 1 || n <= 0 || n > 100) return 0;
    for (i = 0; i < n; i++) {
        printf("a[%d] = ", i);
        if (scanf("%d", &a[i]) != 1) return 0;
    }
    print_arr("input:", a, n);
    heap_sort(a, n);
    print_arr("SORTED:", a, n);
    printf("\\nMax-heap -> ascending order. Always O(n log n), in place, not stable.\\n");
    return 0;
}
`,
  },
  {
    id: 'treesort-user',
    title: 'Tree sort — BST insert then in-order',
    source: 'Sorting as a side effect of the BST rule',
    topic: 'BST',
    blurb:
      'Two lines of logic. Try it with random keys, then with already-sorted keys and watch the height explode — that is the O(n²) trap.',
    code: `#include <stdio.h>
#include <stdlib.h>

${NODE}
void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

int height(struct Node *n) {
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n->left);
    hr = height(n->right);
    return 1 + (hl > hr ? hl : hr);
}

int count(struct Node *n) {
    if (n == NULL) return 0;
    return 1 + count(n->left) + count(n->right);
}

int main(void) {
    struct Node *root = NULL;
    int n, i, key, h, c;

    printf("How many numbers to sort? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("number %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);          /* step 1: build the BST */
    }

    printf("\\nSorted output: ");
    inorder(root);                         /* step 2: read it in-order */
    printf("\\n");

    c = count(root);
    h = height(root);
    printf("\\nnodes = %d, height = %d\\n", c, h);
    printf("Best possible height for %d nodes is about log2(%d).\\n", c, c);
    if (h >= c - 1 && c > 2)
        printf("This tree is a STICK, so tree sort just cost O(n^2). Sorted input is the trap.\\n");
    else
        printf("The tree stayed bushy, so this run was about O(n log n).\\n");
    return 0;
}
`,
  },
  {
    id: 'expr-user',
    title: 'Expression tree from a postfix string, then evaluate it',
    source: 'Stack of tree pointers',
    topic: 'Advanced',
    blurb:
      'Type a postfix expression such as 12+3* using single-digit operands. Operands become leaves, operators pop two subtrees. Post-order evaluates it.',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node {
    char data;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(char c) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = c;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int is_op(char c) { return c == '+' || c == '-' || c == '*' || c == '/'; }

/* Scan postfix left to right: operand -> push a leaf.
   operator -> pop RIGHT first, then LEFT, join, push. */
struct Node *build(const char *post) {
    struct Node *stack[128];
    int top = -1, i;
    for (i = 0; post[i]; i++) {
        char c = post[i];
        if (c == ' ') continue;
        if (is_op(c)) {
            struct Node *n = new_node(c);
            if (top < 1) { printf("Bad postfix expression.\\n"); return NULL; }
            n->right = stack[top--];      /* right operand was pushed last */
            n->left  = stack[top--];
            stack[++top] = n;
        } else {
            stack[++top] = new_node(c);   /* operand becomes a leaf */
        }
    }
    return top == 0 ? stack[0] : NULL;
}

void preorder(struct Node *n)  { if (!n) return; printf("%c ", n->data); preorder(n->left);  preorder(n->right); }
void postorder(struct Node *n) { if (!n) return; postorder(n->left); postorder(n->right); printf("%c ", n->data); }

/* Inorder needs brackets, otherwise 1+2*3 and (1+2)*3 print the same. */
void inorder_paren(struct Node *n) {
    if (!n) return;
    if (is_op(n->data)) printf("(");
    inorder_paren(n->left);
    printf("%c", n->data);
    inorder_paren(n->right);
    if (is_op(n->data)) printf(")");
}

int eval(struct Node *n) {                /* evaluation IS post-order */
    int a, b;
    if (!n) return 0;
    if (!is_op(n->data)) return n->data - '0';
    a = eval(n->left);
    b = eval(n->right);
    switch (n->data) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b ? a / b : 0;
    }
    return 0;
}

void show(struct Node *n, int depth) {
    int i;
    if (!n) return;
    show(n->right, depth + 1);
    for (i = 0; i < depth; i++) printf("      ");
    printf("%c\\n", n->data);
    show(n->left, depth + 1);
}

int main(void) {
    char post[128];
    struct Node *root;

    printf("Postfix expression (single-digit operands, e.g. 12+3*): ");
    if (scanf("%127s", post) != 1) return 0;

    root = build(post);
    if (!root) return 0;

    printf("\\nTree (rotated 90 degrees, root on the left column):\\n");
    show(root, 0);

    printf("\\nPrefix  (pre-order) : ");
    preorder(root);
    printf("\\nInfix   (in-order)  : ");
    inorder_paren(root);
    printf("\\nPostfix (post-order): ");
    postorder(root);
    printf("\\n\\nValue = %d\\n", eval(root));
    return 0;
}
`,
  },
  {
    id: 'lcrs-user',
    title: 'General tree → binary tree (left-child right-sibling)',
    source: 'Natural correspondence',
    topic: 'Advanced',
    blurb:
      'You type the parent-child edges of a general tree. The program stores it in binary form: left = first child, right = next sibling. Pre-order is preserved and the general post-order becomes the binary in-order.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAXN 100

/* In LCRS form: left = FIRST CHILD, right = NEXT SIBLING. */
struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *slot[MAXN + 1];     /* slot[label] = that node, so we can find parents */

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node *get(int label) {
    if (label < 1 || label > MAXN) return NULL;
    if (!slot[label]) slot[label] = new_node(label);
    return slot[label];
}

/* Attach child as the LAST entry of the parent's sibling chain. */
void add_child(int parent, int child) {
    struct Node *p = get(parent), *c = get(child), *walk;
    if (!p || !c) return;
    if (p->left == NULL) {
        p->left = c;                 /* first child goes on the LEFT pointer */
        return;
    }
    walk = p->left;
    while (walk->right) walk = walk->right;
    walk->right = c;                 /* later children chain on RIGHT pointers */
}

void preorder(struct Node *n)  { if (!n) return; printf("%d ", n->data); preorder(n->left);  preorder(n->right); }
void inorder(struct Node *n)   { if (!n) return; inorder(n->left);  printf("%d ", n->data); inorder(n->right); }

void show(struct Node *n, int depth, const char *tag) {
    int i;
    if (!n) return;
    for (i = 0; i < depth; i++) printf("   ");
    printf("%s%d\\n", tag, n->data);
    show(n->left,  depth + 1, "L(first child) ");
    show(n->right, depth + 1, "R(sibling)     ");
}

/* Print the real children of a node by walking one left then all rights. */
void children_of(int label) {
    struct Node *n = slot[label], *c;
    if (!n) return;
    printf("children of %d: ", label);
    for (c = n->left; c; c = c->right) printf("%d ", c->data);
    printf("\\n");
}

int main(void) {
    int edges, i, p, c, rootLabel;

    printf("Root label (1..%d): ", MAXN);
    if (scanf("%d", &rootLabel) != 1) return 0;
    get(rootLabel);

    printf("How many parent-child edges? ");
    if (scanf("%d", &edges) != 1) return 0;
    printf("Enter them as: parent child   (children in left-to-right order)\\n");
    for (i = 0; i < edges; i++) {
        printf("edge %d: ", i + 1);
        if (scanf("%d %d", &p, &c) != 2) return 0;
        add_child(p, c);
    }

    printf("\\nLCRS binary tree:\\n");
    show(slot[rootLabel], 0, "");

    printf("\\nSibling check — ");
    children_of(rootLabel);

    printf("\\nPre-order of the binary tree  = pre-order of the general tree : ");
    preorder(slot[rootLabel]);
    printf("\\nIn-order  of the binary tree  = POST-order of the general tree: ");
    inorder(slot[rootLabel]);
    printf("\\n\\nRemember: a RIGHT pointer is a SIBLING, not a child.\\n");
    return 0;
}
`,
  },
  {
    id: 'thread-user',
    title: 'Threaded binary tree — in-order with no stack and no recursion',
    source: 'Recycling the NULL pointers',
    topic: 'Advanced',
    blurb:
      'A tree with n nodes wastes n + 1 NULL pointers. Turn each empty right pointer into a link to the in-order successor and the traversal becomes a plain while loop.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAXN 200

/* lt = 1 means left is a REAL child, 0 means left is a thread.
   rt = 1 means right is a REAL child, 0 means right is a thread. */
struct TNode {
    int data;
    struct TNode *left;
    struct TNode *right;
    int lt, rt;
};

struct TNode *new_node(int data) {
    struct TNode *n = (struct TNode *)malloc(sizeof(struct TNode));
    n->data = data;
    n->left = NULL;
    n->right = NULL;
    n->lt = 0;
    n->rt = 0;
    return n;
}

struct TNode *insert(struct TNode *root, int key) {
    if (root == NULL) return new_node(key);
    if (key < root->data) {
        if (root->lt) root->left = insert(root->left, key);
        else { root->left = new_node(key); root->lt = 1; }
    } else if (key > root->data) {
        if (root->rt) root->right = insert(root->right, key);
        else { root->right = new_node(key); root->rt = 1; }
    }
    return root;
}

/* Collect the in-order sequence once (recursively), then wire the threads. */
int collect(struct TNode *n, struct TNode *seq[], int k) {
    if (n == NULL) return k;
    if (n->lt) k = collect(n->left, seq, k);
    seq[k++] = n;
    if (n->rt) k = collect(n->right, seq, k);
    return k;
}

void make_threads(struct TNode *root) {
    struct TNode *seq[MAXN];
    int n = collect(root, seq, 0), i;
    for (i = 0; i < n; i++) {
        if (!seq[i]->lt && i > 0)     seq[i]->left  = seq[i - 1];  /* predecessor */
        if (!seq[i]->rt && i < n - 1) seq[i]->right = seq[i + 1];  /* successor   */
    }
    printf("threads created: %d nodes, %d recycled NULL pointers\\n", n, n + 1);
}

/* The payoff: in-order with O(1) extra space. */
void inorder_threaded(struct TNode *root) {
    struct TNode *cur = root;
    if (cur == NULL) return;
    while (cur->lt) cur = cur->left;        /* leftmost node is first */
    while (cur != NULL) {
        printf("%d ", cur->data);
        if (!cur->rt) {
            cur = cur->right;               /* follow the THREAD to the successor */
        } else {
            cur = cur->right;               /* real child, then dive left */
            while (cur->lt) cur = cur->left;
        }
    }
}

void report(struct TNode *n) {
    if (n == NULL) return;
    printf("node %3d : left %s", n->data, n->lt ? "child  " : "THREAD ");
    if (n->left)  printf("-> %-3d", n->left->data); else printf("-> nil");
    printf(" | right %s", n->rt ? "child  " : "THREAD ");
    if (n->right) printf("-> %-3d\\n", n->right->data); else printf("-> nil\\n");
    if (n->lt) report(n->left);
    if (n->rt) report(n->right);
}

int main(void) {
    struct TNode *root = NULL;
    int n, i, key;

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    make_threads(root);
    printf("\\nPointer report (THREAD = a recycled NULL):\\n");
    report(root);

    printf("\\nIn-order using threads only (no stack, no recursion): ");
    inorder_threaded(root);
    printf("\\n");
    return 0;
}
`,
  },
  {
    id: 'rebuild-user',
    title: 'Reconstruct a binary tree from pre-order + in-order',
    source: 'Unique reconstruction',
    topic: 'Advanced',
    blurb:
      'In-order gives the left/right split, pre-order gives the root. You type both lists and the program rebuilds the one tree that fits, then verifies it.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define MAXN 100

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n->data = data;
    n->left = NULL;
    n->right = NULL;
    return n;
}

int find_in(int in[], int lo, int hi, int key) {
    int i;
    for (i = lo; i <= hi; i++)
        if (in[i] == key) return i;
    return -1;
}

/* pre[*pi] is always the root of the slice in[lo..hi]. */
struct Node *build(int pre[], int *pi, int in[], int lo, int hi) {
    struct Node *n;
    int mid;
    if (lo > hi) return NULL;
    n = new_node(pre[*pi]);
    mid = find_in(in, lo, hi, pre[*pi]);
    (*pi)++;
    if (mid < 0) { printf("Lists do not match — check your input.\\n"); exit(1); }
    n->left  = build(pre, pi, in, lo, mid - 1);    /* left slice first */
    n->right = build(pre, pi, in, mid + 1, hi);
    return n;
}

void preorder(struct Node *n)  { if (!n) return; printf("%d ", n->data); preorder(n->left);  preorder(n->right); }
void inorder(struct Node *n)   { if (!n) return; inorder(n->left);  printf("%d ", n->data); inorder(n->right); }
void postorder(struct Node *n) { if (!n) return; postorder(n->left); postorder(n->right); printf("%d ", n->data); }

void show(struct Node *n, int depth) {
    int i;
    if (!n) return;
    show(n->right, depth + 1);
    for (i = 0; i < depth; i++) printf("      ");
    printf("%d\\n", n->data);
    show(n->left, depth + 1);
}

int main(void) {
    int pre[MAXN], in[MAXN], n, i, pi = 0;
    struct Node *root;

    printf("How many nodes? ");
    if (scanf("%d", &n) != 1 || n <= 0 || n > MAXN) return 0;

    printf("Enter the %d PRE-order values:\\n", n);
    for (i = 0; i < n; i++)
        if (scanf("%d", &pre[i]) != 1) return 0;

    printf("Enter the %d IN-order values:\\n", n);
    for (i = 0; i < n; i++)
        if (scanf("%d", &in[i]) != 1) return 0;

    root = build(pre, &pi, in, 0, n - 1);

    printf("\\nReconstructed tree (rotated 90 degrees):\\n");
    show(root, 0);

    printf("\\nVerify pre-order : ");
    preorder(root);
    printf("\\nVerify in-order  : ");
    inorder(root);
    printf("\\nBonus post-order : ");
    postorder(root);
    printf("\\n\\nPre + In is unique. Pre + Post is NOT, unless the tree is full.\\n");
    return 0;
}
`,
  },
  {
    id: 'bsearch-user',
    title: 'B-Tree of order 3 — insert, search and in-order traversal',
    source: 'Multiway search',
    topic: 'B-Tree',
    blurb:
      'Search scans the sorted keys inside a node to find the right gap, then descends through that child pointer. In-order of a B-Tree still comes out sorted.',
    code: `#include <stdio.h>
#include <stdlib.h>

#define M 3
#define MAXK (M - 1)

typedef struct Node {
    int nkeys;
    int keys[M];
    struct Node *child[M + 1];
    int leaf;
} Node;

Node *new_node(int leaf) {
    Node *x = (Node *)calloc(1, sizeof(Node));
    x->leaf = leaf;
    return x;
}

int find_child(Node *x, int k) {
    int i = 0;
    while (i < x->nkeys && k > x->keys[i]) i++;
    return i;
}

void insert_key(Node *x, int k, Node *right) {
    int i = x->nkeys - 1;
    while (i >= 0 && x->keys[i] > k) {
        x->keys[i + 1] = x->keys[i];
        x->child[i + 2] = x->child[i + 1];
        i--;
    }
    x->keys[i + 1] = k;
    x->child[i + 2] = right;
    x->nkeys++;
}

Node *split(Node *x, int *median) {
    int mid = x->nkeys / 2, i;
    Node *r = new_node(x->leaf);
    *median = x->keys[mid];
    r->nkeys = x->nkeys - mid - 1;
    for (i = 0; i < r->nkeys; i++) r->keys[i] = x->keys[mid + 1 + i];
    if (!x->leaf)
        for (i = 0; i <= r->nkeys; i++) r->child[i] = x->child[mid + 1 + i];
    x->nkeys = mid;
    return r;
}

void insert_rec(Node *x, int k, int *up, Node **right) {
    if (x->leaf) {
        insert_key(x, k, NULL);
    } else {
        int i = find_child(x, k), cup = 0;
        Node *cr = NULL;
        insert_rec(x->child[i], k, &cup, &cr);
        if (cr) insert_key(x, cup, cr);
    }
    if (x->nkeys > MAXK) { *right = split(x, up); return; }
    *right = NULL;
}

Node *btree_insert(Node *root, int k) {
    int up;
    Node *right = NULL;
    if (!root) {
        root = new_node(1);
        root->keys[0] = k;
        root->nkeys = 1;
        return root;
    }
    insert_rec(root, k, &up, &right);
    if (right) {
        Node *nr = new_node(0);
        nr->keys[0] = up;
        nr->nkeys = 1;
        nr->child[0] = root;
        nr->child[1] = right;
        return nr;                     /* the only way the tree grows taller */
    }
    return root;
}

/* Scan inside the node, then descend. visits counts the disk pages read. */
Node *btree_search(Node *n, int k, int *pos, int *visits) {
    while (n != NULL) {
        int i = 0;
        (*visits)++;
        while (i < n->nkeys && k > n->keys[i]) i++;
        if (i < n->nkeys && n->keys[i] == k) { *pos = i; return n; }
        if (n->leaf) return NULL;
        n = n->child[i];
    }
    return NULL;
}

/* child[0], key[0], child[1], key[1], ... -> sorted order */
void btree_inorder(Node *x) {
    int i;
    if (!x) return;
    for (i = 0; i < x->nkeys; i++) {
        if (!x->leaf) btree_inorder(x->child[i]);
        printf("%d ", x->keys[i]);
    }
    if (!x->leaf) btree_inorder(x->child[x->nkeys]);
}

void print_tree(Node *x, int depth) {
    int i, d;
    if (!x) return;
    for (d = 0; d < depth; d++) printf("   ");
    printf("[");
    for (i = 0; i < x->nkeys; i++) printf("%s%d", i ? " " : "", x->keys[i]);
    printf("]\\n");
    if (!x->leaf)
        for (i = 0; i <= x->nkeys; i++) print_tree(x->child[i], depth + 1);
}

int main(void) {
    Node *root = NULL, *hit;
    int ch, k, pos = 0, visits;
    for (;;) {
        printf("\\n1 insert key  2 search key  3 in-order (sorted)  4 print tree  0 quit\\n> ");
        if (scanf("%d", &ch) != 1 || ch == 0) break;
        if (ch == 1) {
            printf("key: ");
            if (scanf("%d", &k) != 1) break;
            root = btree_insert(root, k);
            print_tree(root, 0);
        } else if (ch == 2) {
            printf("key: ");
            if (scanf("%d", &k) != 1) break;
            visits = 0;
            hit = btree_search(root, k, &pos, &visits);
            if (hit) printf("FOUND %d at position %d of its node, after %d node visits\\n", k, pos, visits);
            else     printf("%d is NOT in the tree (%d node visits)\\n", k, visits);
        } else if (ch == 3) {
            printf("in-order: ");
            btree_inorder(root);
            printf("\\n");
        } else if (ch == 4) {
            print_tree(root, 0);
        }
    }
    return 0;
}
`,
  },
  {
    id: 'bstutil-user',
    title: 'BST utilities — min, max, successor, predecessor, kth, range, isBST',
    source: 'Everything else they ask about a BST',
    topic: 'BST',
    blurb:
      'Seven short functions that all lean on one fact: the in-order of a BST is sorted. kth-smallest and range-print are just controlled in-order walks.',
    code: `#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

${NODE}
struct Node *min_node(struct Node *n) {
    if (n == NULL) return NULL;
    while (n->left) n = n->left;
    return n;
}

struct Node *max_node(struct Node *n) {
    if (n == NULL) return NULL;
    while (n->right) n = n->right;
    return n;
}

/* Successor without parent pointers: remember the last left turn. */
struct Node *successor(struct Node *root, int key) {
    struct Node *best = NULL;
    while (root) {
        if (key < root->data) { best = root; root = root->left; }
        else root = root->right;
    }
    return best;
}

struct Node *predecessor(struct Node *root, int key) {
    struct Node *best = NULL;
    while (root) {
        if (key > root->data) { best = root; root = root->right; }
        else root = root->left;
    }
    return best;
}

/* kth smallest = the kth node of the in-order walk. */
void kth(struct Node *n, int k, int *seen, int *answer) {
    if (n == NULL || *answer != INT_MIN) return;
    kth(n->left, k, seen, answer);
    if (*answer != INT_MIN) return;
    (*seen)++;
    if (*seen == k) { *answer = n->data; return; }
    kth(n->right, k, seen, answer);
}

/* Print every key in [lo, hi] and skip whole subtrees that cannot help. */
void range_print(struct Node *n, int lo, int hi) {
    if (n == NULL) return;
    if (lo < n->data) range_print(n->left, lo, hi);
    if (lo <= n->data && n->data <= hi) printf("%d ", n->data);
    if (n->data < hi) range_print(n->right, lo, hi);
}

/* A tree is a BST iff its in-order is strictly increasing. */
int is_bst(struct Node *n, int *prev) {
    if (n == NULL) return 1;
    if (!is_bst(n->left, prev)) return 0;
    if (n->data <= *prev) return 0;
    *prev = n->data;
    return is_bst(n->right, prev);
}

void inorder(struct Node *n) {
    if (n == NULL) return;
    inorder(n->left);
    printf("%d ", n->data);
    inorder(n->right);
}

int main(void) {
    struct Node *root = NULL, *p;
    int n, i, key, lo, hi, k, seen, answer, prev;

    printf("How many keys? ");
    if (scanf("%d", &n) != 1) return 0;
    for (i = 0; i < n; i++) {
        printf("key %d: ", i + 1);
        if (scanf("%d", &key) != 1) return 0;
        root = insert(root, key);
    }

    printf("\\nin-order: ");
    inorder(root);
    printf("\\n");

    p = min_node(root);
    if (p) printf("minimum = %d (keep going LEFT)\\n", p->data);
    p = max_node(root);
    if (p) printf("maximum = %d (keep going RIGHT)\\n", p->data);

    prev = INT_MIN;
    printf("is_bst = %d (1 means the in-order is strictly increasing)\\n", is_bst(root, &prev));

    printf("\\nKey for successor / predecessor: ");
    if (scanf("%d", &key) == 1) {
        p = predecessor(root, key);
        printf("predecessor of %d = ", key);
        if (p) printf("%d\\n", p->data); else printf("none (it is the minimum)\\n");
        p = successor(root, key);
        printf("successor   of %d = ", key);
        if (p) printf("%d\\n", p->data); else printf("none (it is the maximum)\\n");
    }

    printf("\\nk for kth smallest: ");
    if (scanf("%d", &k) == 1) {
        seen = 0;
        answer = INT_MIN;
        kth(root, k, &seen, &answer);
        if (answer != INT_MIN) printf("%dth smallest = %d\\n", k, answer);
        else printf("the tree has fewer than %d keys\\n", k);
    }

    printf("\\nRange lo hi: ");
    if (scanf("%d %d", &lo, &hi) == 2) {
        printf("keys in [%d, %d]: ", lo, hi);
        range_print(root, lo, hi);
        printf("\\n");
    }
    return 0;
}
`,
  },
]

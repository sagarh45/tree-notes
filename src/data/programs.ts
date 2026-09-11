export type Program = {
  id: string
  title: string
  source: string
  blurb: string
  code: string
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
    title: '1. General BST menu (user types every key)',
    source: 'Insert / Search / Delete / Traversals',
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
    title: '2. Traversals — user inserts n keys first',
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
    title: '3. BST search — keys from keyboard',
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
    title: '4. BST delete (3 cases) — user keys',
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
    title: '5. AVL insert — user keys + rotations',
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
    title: '6. Height, count, leaves — user tree',
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
    title: '7. Order-3 B-Tree insert — keys from user',
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
    title: '11. Max-heap as an array (user types keys)',
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
    title: '12. Huffman codes from typed frequencies',
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
    title: '13. Trie of words the user types',
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
]

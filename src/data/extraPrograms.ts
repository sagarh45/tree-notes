import type { Program } from './syllabus/types'

export const GENERAL_PROGRAM: Program = {
  title: 'General tree: create, add child, search, traverse and delete a subtree',
  input: '1\n5\n1 2\n1 3\n1 4\n2 5\n2 6\n6\n2',
  output: 'Preorder: 1 2 5 6 3 4\nNodes: 6\nHeight: 2\nFound\nAfter delete: 1 3 4',
  code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *child, *next;
} Node;

Node *create(int key) {
    Node *n = calloc(1, sizeof *n);
    if (!n) exit(1);
    n->key = key;
    return n;
}
Node *find(Node *n, int key) {
    for (; n; n = n->next) {
        if (n->key == key) return n;
        Node *hit = find(n->child, key);
        if (hit) return hit;
    }
    return NULL;
}
void addChild(Node *root, int parent, int key) {
    Node *p = find(root, parent);
    if (!p || find(root, key)) return;
    Node **slot = &p->child;
    while (*slot) slot = &(*slot)->next;
    *slot = create(key);
}
void preorder(Node *n) {
    for (; n; n = n->next) {
        printf(" %d", n->key);
        preorder(n->child);
    }
}
int count(Node *n) {
    int total = 0;
    for (; n; n = n->next) total += 1 + count(n->child);
    return total;
}
int height(Node *n) {
    if (!n) return -1;
    int h = -1;
    for (Node *c = n->child; c; c = c->next) {
        int ch = height(c);
        if (ch > h) h = ch;
    }
    return h + 1;
}
void destroy(Node *n) {
    while (n) {
        Node *next = n->next;
        destroy(n->child);
        free(n);
        n = next;
    }
}
Node *deleteSubtree(Node *n, int key) {
    if (!n) return NULL;
    if (n->key == key) {
        Node *next = n->next;
        n->next = NULL; /* preserve the deleted node's siblings */
        destroy(n);
        return next;
    }
    n->child = deleteSubtree(n->child, key);
    n->next = deleteSubtree(n->next, key);
    return n;
}
int main(void) {
    int rootKey, edges, p, k, target;
    if (scanf("%d%d", &rootKey, &edges) != 2 || edges < 0 || edges > 100) return 1;
    Node *root = create(rootKey);
    for (int i = 0; i < edges; ++i) {
        if (scanf("%d%d", &p, &k) != 2) { destroy(root); return 1; }
        addChild(root, p, k);
    }
    printf("Preorder:"); preorder(root); puts("");
    printf("Nodes: %d\\nHeight: %d\\n", count(root), height(root));
    if (scanf("%d", &target) != 1) { destroy(root); return 1; }
    puts(find(root, target) ? "Found" : "Not found");
    if (scanf("%d", &target) != 1) { destroy(root); return 1; }
    root = deleteSubtree(root, target);
    printf("After delete:"); preorder(root); puts("");
    destroy(root);
    return 0;
}`,
}

export const MULTIWAY_OPERATIONS: Program = {
  title: 'Unbalanced 3-way search tree: create, insert, search, delete and traverse',
  input: '8\n20 50 10 30 40 60 35 70\n35\n4\n35 20 50 99',
  output: 'Inorder: 10 20 30 35 40 50 60 70\nFound\nAfter delete 35: 10 20 30 40 50 60 70\nAfter delete 20: 10 30 40 50 60 70\nAfter delete 50: 10 30 40 60 70\nAfter delete 99: 10 30 40 60 70',
  code: `#include <stdio.h>
#include <stdlib.h>
#define M 3

typedef struct Node {
    int n, key[M - 1];
    struct Node *child[M];
} Node;

Node *create(int key) {
    Node *p = calloc(1, sizeof *p);
    if (!p) exit(1);
    p->n = 1; p->key[0] = key;
    return p;
}
int position(Node *p, int key) {
    int i = 0;
    while (i < p->n && key > p->key[i]) ++i;
    return i;
}
int isLeaf(Node *p) {
    for (int i = 0; i <= p->n; ++i)
        if (p->child[i]) return 0;
    return 1;
}
Node *search(Node *p, int key) {
    while (p) {
        int i = position(p, key);
        if (i < p->n && key == p->key[i]) return p;
        p = p->child[i];
    }
    return NULL;
}
Node *insert(Node *p, int key) {
    if (!p) return create(key);
    int i = position(p, key);
    if (i < p->n && p->key[i] == key) return p;
    if (isLeaf(p) && p->n < M - 1) {
        for (int j = p->n; j > i; --j) p->key[j] = p->key[j - 1];
        p->key[i] = key; ++p->n;
    } else {
        p->child[i] = insert(p->child[i], key);
    }
    return p; /* no split and no balancing in this general m-way policy */
}
int minimum(Node *p) {
    while (p->child[0]) p = p->child[0];
    return p->key[0];
}
int maximum(Node *p) {
    while (p->child[p->n]) p = p->child[p->n];
    return p->key[p->n - 1];
}
Node *deleteKey(Node *p, int key) {
    if (!p) return NULL;
    int i = position(p, key);
    if (i == p->n || p->key[i] != key) {
        p->child[i] = deleteKey(p->child[i], key);
    } else if (p->child[i]) {
        p->key[i] = maximum(p->child[i]);
        p->child[i] = deleteKey(p->child[i], p->key[i]);
    } else if (p->child[i + 1]) {
        p->key[i] = minimum(p->child[i + 1]);
        p->child[i + 1] = deleteKey(p->child[i + 1], p->key[i]);
    } else {
        /* Both adjacent ranges are empty: shift key and child slots together. */
        for (int j = i; j < p->n - 1; ++j) {
            p->key[j] = p->key[j + 1];
            p->child[j + 1] = p->child[j + 2];
        }
        p->child[p->n] = NULL;
        if (--p->n == 0) { free(p); return NULL; }
    }
    return p;
}
void inorder(Node *p) {
    if (!p) return;
    for (int i = 0; i < p->n; ++i) {
        inorder(p->child[i]);
        printf(" %d", p->key[i]);
    }
    inorder(p->child[p->n]);
}
void destroy(Node *p) {
    if (!p) return;
    for (int i = 0; i <= p->n; ++i) destroy(p->child[i]);
    free(p);
}
int main(void) {
    Node *root = NULL;
    int n, key, d;
    if (scanf("%d", &n) != 1 || n < 0 || n > 200) return 1;
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &key) != 1) { destroy(root); return 1; }
        root = insert(root, key);
    }
    printf("Inorder:"); inorder(root); puts("");
    if (scanf("%d", &key) != 1) { destroy(root); return 1; }
    puts(search(root, key) ? "Found" : "Not found");
    if (scanf("%d", &d) != 1 || d < 0 || d > 200) { destroy(root); return 1; }
    for (int i = 0; i < d; ++i) {
        if (scanf("%d", &key) != 1) { destroy(root); return 1; }
        root = deleteKey(root, key);
        printf("After delete %d:", key); inorder(root); puts("");
    }
    destroy(root);
    return 0;
}`,
}

import type { Program } from './syllabus/types'

export const LINKED_PROGRAM: Program = {
  title: 'Create a linked binary tree and count nodes',
  output: 'Preorder: 10 30 5\nNodes: 3\nEdges: 2',
  code: `#include <stdio.h>
#include <stdlib.h>
struct Node { int data; struct Node *left, *right; };
struct Node *newNode(int value) {
    struct Node *p = malloc(sizeof *p);
    if (!p) exit(EXIT_FAILURE);
    p->data = value; p->left = p->right = NULL;
    return p;
}
int count(struct Node *p) {
    return p ? 1 + count(p->left) + count(p->right) : 0;
}
void preorder(struct Node *p) {
    if (!p) return;
    printf(" %d", p->data);
    preorder(p->left); preorder(p->right);
}
void destroy(struct Node *p) {
    if (!p) return;
    destroy(p->left); destroy(p->right); free(p);
}
int main(void) {
    struct Node *root = newNode(10);
    root->left = newNode(30);
    root->right = newNode(5);
    printf("Preorder:"); preorder(root);
    int n = count(root);
    printf("\\nNodes: %d\\nEdges: %d\\n", n, n ? n - 1 : 0);
    destroy(root);
    return 0;
}`,
}

export const MULTIWAY_PROGRAM: Program = {
  title: 'Search a multiway tree (three key ranges)', input: '40', output: 'Found',
  code: `#include <stdio.h>
#define M 4
struct Node { int count, keys[M-1]; struct Node *child[M]; };
int search(const struct Node *p, int key) {
    while (p) {
        int i = 0;
        while (i < p->count && key > p->keys[i]) ++i;
        if (i < p->count && key == p->keys[i]) return 1;
        p = p->child[i];
    }
    return 0;
}
int main(void) {
    struct Node left = {1, {10}, {NULL}};
    struct Node middle = {2, {30, 40}, {NULL}};
    struct Node right = {1, {60}, {NULL}};
    struct Node root = {2, {20, 50}, {&left, &middle, &right, NULL}};
    int key;
    if (scanf("%d", &key) != 1) return 1;
    puts(search(&root, key) ? "Found" : "Not found");
    return 0;
}`,
}

export const BTREE_PROGRAM: Program = {
  title: 'B-Tree order 4 (minimum degree 2): insert, search and delete',
  input: '8\n10 20 5 6 12 30 7 17\n17\n4\n6 12 20 5',
  output: 'Inorder: 5 6 7 10 12 17 20 30\nFound\nAfter delete 6: 5 7 10 12 17 20 30\nAfter delete 12: 5 7 10 17 20 30\nAfter delete 20: 5 7 10 17 30\nAfter delete 5: 7 10 17 30',
  code: `#include <stdio.h>
#include <stdlib.h>
/* Order 4: at most 3 keys, minimum 1 key outside the root. */
struct Node { int n, leaf, key[3]; struct Node *child[4]; };
struct Node *make(int leaf) {
    struct Node *p = calloc(1, sizeof *p);
    if (!p) exit(EXIT_FAILURE);
    p->leaf = leaf; return p;
}
int search(struct Node *p, int key) {
    if (!p) return 0;
    int i = 0;
    while (i < p->n && key > p->key[i]) ++i;
    if (i < p->n && key == p->key[i]) return 1;
    return p->leaf ? 0 : search(p->child[i], key);
}
void print(struct Node *p) {
    if (!p) return;
    for (int i = 0; i < p->n; ++i) {
        if (!p->leaf) print(p->child[i]);
        printf(" %d", p->key[i]);
    }
    if (!p->leaf) print(p->child[p->n]);
}
void split(struct Node *p, int i) {
    struct Node *left = p->child[i], *right = make(left->leaf);
    int median = left->key[1];
    right->n = 1; right->key[0] = left->key[2];
    if (!left->leaf) {
        right->child[0] = left->child[2];
        right->child[1] = left->child[3];
    }
    left->n = 1;
    for (int j = p->n; j > i; --j) p->child[j+1] = p->child[j];
    p->child[i+1] = right;
    for (int j = p->n-1; j >= i; --j) p->key[j+1] = p->key[j];
    p->key[i] = median; ++p->n;
}
void insertNonFull(struct Node *p, int key) {
    int i = p->n - 1;
    if (p->leaf) {
        while (i >= 0 && key < p->key[i]) { p->key[i+1] = p->key[i]; --i; }
        p->key[i+1] = key; ++p->n;
    } else {
        while (i >= 0 && key < p->key[i]) --i;
        ++i;
        if (p->child[i]->n == 3) {
            split(p, i);
            if (key > p->key[i]) ++i;
        }
        insertNonFull(p->child[i], key);
    }
}
struct Node *insert(struct Node *root, int key) {
    if (search(root, key)) return root;
    if (!root) root = make(1);
    if (root->n == 3) {
        struct Node *p = make(0); p->child[0] = root;
        split(p, 0); root = p;
    }
    insertNonFull(root, key); return root;
}
void merge(struct Node *p, int i) {
    struct Node *a = p->child[i], *b = p->child[i+1];
    int offset = a->n;
    a->key[offset] = p->key[i];
    for (int j = 0; j < b->n; ++j) a->key[offset+1+j] = b->key[j];
    if (!a->leaf) for (int j = 0; j <= b->n; ++j) a->child[offset+1+j] = b->child[j];
    a->n += b->n + 1;
    for (int j = i+1; j < p->n; ++j) p->key[j-1] = p->key[j];
    for (int j = i+2; j <= p->n; ++j) p->child[j-1] = p->child[j];
    --p->n; free(b);
}
void borrowLeft(struct Node *p, int i) {
    struct Node *a = p->child[i], *b = p->child[i-1];
    for (int j = a->n-1; j >= 0; --j) a->key[j+1] = a->key[j];
    if (!a->leaf) {
        for (int j = a->n; j >= 0; --j) a->child[j+1] = a->child[j];
        a->child[0] = b->child[b->n];
    }
    a->key[0] = p->key[i-1]; p->key[i-1] = b->key[b->n-1];
    ++a->n; --b->n;
}
void borrowRight(struct Node *p, int i) {
    struct Node *a = p->child[i], *b = p->child[i+1];
    a->key[a->n] = p->key[i];
    if (!a->leaf) a->child[a->n+1] = b->child[0];
    p->key[i] = b->key[0];
    for (int j = 1; j < b->n; ++j) b->key[j-1] = b->key[j];
    if (!b->leaf) for (int j = 1; j <= b->n; ++j) b->child[j-1] = b->child[j];
    ++a->n; --b->n;
}
void removeKey(struct Node *p, int key) {
    int i = 0;
    while (i < p->n && key > p->key[i]) ++i;
    if (i < p->n && p->key[i] == key) {
        if (p->leaf) {
            for (int j = i+1; j < p->n; ++j) p->key[j-1] = p->key[j];
            --p->n;
        } else if (p->child[i]->n >= 2) {
            struct Node *q = p->child[i];
            while (!q->leaf) q = q->child[q->n];
            p->key[i] = q->key[q->n-1];
            removeKey(p->child[i], p->key[i]);
        } else if (p->child[i+1]->n >= 2) {
            struct Node *q = p->child[i+1];
            while (!q->leaf) q = q->child[0];
            p->key[i] = q->key[0];
            removeKey(p->child[i+1], p->key[i]);
        } else { merge(p, i); removeKey(p->child[i], key); }
        return;
    }
    if (p->leaf) return;
    /* Ensure at least two keys before descending (top-down deletion). */
    if (p->child[i]->n == 1) {
        if (i > 0 && p->child[i-1]->n >= 2) borrowLeft(p, i);
        else if (i < p->n && p->child[i+1]->n >= 2) borrowRight(p, i);
        else if (i < p->n) merge(p, i);
        else { merge(p, i-1); --i; }
    }
    removeKey(p->child[i], key);
}
struct Node *deleteKey(struct Node *root, int key) {
    if (!search(root, key)) return root;
    removeKey(root, key);
    if (root->n == 0) {
        struct Node *old = root;
        root = old->leaf ? NULL : old->child[0]; free(old);
    }
    return root;
}
void destroy(struct Node *p) {
    if (!p) return;
    if (!p->leaf) for (int i = 0; i <= p->n; ++i) destroy(p->child[i]);
    free(p);
}
int main(void) {
    struct Node *root = NULL;
    int n, key, deletes;
    /* Input: count, keys, search key, deletion count, deletion keys. */
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000) return 1;
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &key) != 1) { destroy(root); return 1; }
        root = insert(root, key);
    }
    printf("Inorder:"); print(root); puts("");
    if (scanf("%d", &key) != 1) { destroy(root); return 1; }
    puts(search(root, key) ? "Found" : "Not found");
    if (scanf("%d", &deletes) != 1 || deletes < 0 || deletes > 1000) { destroy(root); return 1; }
    while (deletes--) {
        if (scanf("%d", &key) != 1) { destroy(root); return 1; }
        root = deleteKey(root, key);
        printf("After delete %d:", key); print(root); puts("");
    }
    destroy(root); return 0;
}`,
}

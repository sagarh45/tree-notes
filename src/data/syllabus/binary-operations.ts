import type { Topic } from './types'

export const BINARY_OPERATIONS: Topic = {
  id: 'bt-operations',
  title: 'Binary tree: insert, search and delete',
  tagline: 'There is no smaller-left rule in an ordinary binary tree.',
  definition: 'A <b>binary tree</b> allows at most two children per node. It does not order the values. Here we insert at the first empty position in <b>level order</b>, search both subtrees, and delete a value by replacing it with the deepest, rightmost node.',
  simple: '<p>Socho seats row-wise bhar rahe hain: pehle left seat, phir right. Value chhoti hai ya badi, usse position decide nahi hoti. Search mein dono sides dekhni pad sakti hain. Delete mein last seat ka value target par rakho, phir last node hata do.</p><p>This is one common insertion/deletion policy for a binary tree. A BST follows a different ordering rule.</p>',
  diagrams: [
    { kind: 'tree', title: 'Insert 10, 30, 5, 40, 20', spec: '10(30(40,20),5)', edgeLabels: true, caption: '30 is left of 10 and 5 is right of 10. This is a binary tree, but not a BST.' },
    { kind: 'tree', title: 'Search 5: check both sides', spec: '10(30(40,20),5)', marks: { '10': 'path', '30': 'path', '40': 'path', '20': 'path', '5': 'found' }, caption: 'A left-first search visits 10, 30, 40, 20, 5. Comparing 5 with 10 cannot tell us which side contains it.' },
    { kind: 'tree', title: 'Delete 30: move the last value 20', spec: '10(20(40,),5)', marks: { '20': 'new' }, caption: 'Copy 20 into the node containing 30. Disconnect and free the old last node. The remaining shape stays complete.' },
  ],
  algorithm: [
    { title: 'Insert using a queue', steps: ['If root is NULL, the new node becomes root.', 'Visit nodes level by level with a queue.', 'Attach the new node to the first empty left or right pointer. Stop.'] },
    { title: 'Search', steps: ['If root is NULL, return not found.', 'If the current value matches, return that node.', 'Search the left subtree. If absent, search the right subtree.'] },
    { title: 'Delete one occurrence', steps: ['Use level order to find the first matching node and the last node with its parent.', 'If no match exists, leave the tree unchanged.', 'If the tree has only one matching root, free it and return NULL.', 'Copy the last node value into the target. Disconnect the last node from its parent and free it.'] },
  ],
  syntax: [{ title: 'Search an unordered binary tree', code: `struct Node *search(struct Node *root, int key) {
    if (root == NULL || root->data == key) return root;
    struct Node *found = search(root->left, key);
    return found ? found : search(root->right, key);
}` }],
  example: { title: 'Same input, different ordering rule', html: '<table class="table"><thead><tr><th>Operation</th><th>Result</th></tr></thead><tbody><tr><td>Insert 10, 30, 5, 40, 20</td><td>Level order: 10 30 5 40 20</td></tr><tr><td>Search 5</td><td>Found in the right subtree</td></tr><tr><td>Delete 30</td><td>Level order: 10 20 5 40</td></tr><tr><td>Delete an absent value</td><td>No change</td></tr></tbody></table>' },
  complexity: [
    { op: 'Insert (queue scan)', avg: 'O(n)', worst: 'O(n)', note: 'O(n) queue space' },
    { op: 'Search', avg: 'O(n)', worst: 'O(n)', note: 'O(h) recursive stack' },
    { op: 'Delete', avg: 'O(n)', worst: 'O(n)', note: 'Find the target and last node; O(n) queue space' },
  ],
  mistakes: ['Do not use the BST successor rule on an unordered binary tree.', 'Copying the last value is only half of deletion: disconnect and free the last node too.'],
  program: {
    title: 'Binary tree operations with level-order insertion',
    input: '5\n10 30 5 40 20\n5\n30',
    output: 'Level order: 10 30 5 40 20\nFound\nAfter delete: 10 20 5 40',
    code: `#include <stdio.h>
#include <stdlib.h>
#define CAP 100

struct Node { int data; struct Node *left, *right; };

struct Node *newNode(int key) {
    struct Node *p = malloc(sizeof *p);
    if (!p) { fputs("Out of memory\\n", stderr); exit(1); }
    p->data = key; p->left = p->right = NULL;
    return p;
}

/* main limits the tree to CAP nodes, so this queue cannot overflow. */
struct Node *insert(struct Node *root, int key) {
    if (!root) return newNode(key);
    struct Node *q[CAP]; int front = 0, rear = 0;
    q[rear++] = root;
    while (front < rear) {
        struct Node *p = q[front++];
        if (!p->left) { p->left = newNode(key); break; }
        q[rear++] = p->left;
        if (!p->right) { p->right = newNode(key); break; }
        q[rear++] = p->right;
    }
    return root;
}

struct Node *search(struct Node *root, int key) {
    if (!root || root->data == key) return root;
    struct Node *found = search(root->left, key);
    return found ? found : search(root->right, key);
}

struct Node *deleteValue(struct Node *root, int key) {
    if (!root) return NULL;
    struct Node *q[CAP], *parents[CAP], *target = NULL;
    int front = 0, rear = 1;
    q[0] = root; parents[0] = NULL;
    while (front < rear) {
        struct Node *p = q[front++];
        if (!target && p->data == key) target = p;
        if (p->left) { q[rear] = p->left; parents[rear++] = p; }
        if (p->right) { q[rear] = p->right; parents[rear++] = p; }
    }
    if (!target) return root;
    struct Node *last = q[rear - 1], *parent = parents[rear - 1];
    if (!parent) { free(root); return NULL; }
    target->data = last->data;
    if (parent->left == last) parent->left = NULL;
    else parent->right = NULL;
    free(last);
    return root;
}

void levelOrder(struct Node *root) {
    if (!root) { puts("(empty)"); return; }
    struct Node *q[CAP]; int front = 0, rear = 0;
    q[rear++] = root;
    while (front < rear) {
        struct Node *p = q[front++];
        printf("%d%s", p->data, front < rear || p->left || p->right ? " " : "");
        if (p->left) q[rear++] = p->left;
        if (p->right) q[rear++] = p->right;
    }
    putchar('\\n');
}

void destroy(struct Node *p) {
    if (!p) return;
    destroy(p->left); destroy(p->right); free(p);
}

int main(void) {
    struct Node *root = NULL;
    int n, key;
    if (scanf("%d", &n) != 1 || n < 0 || n > CAP) return 1;
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &key) != 1) { destroy(root); return 1; }
        root = insert(root, key);
    }
    printf("Level order: "); levelOrder(root);
    if (scanf("%d", &key) != 1) { destroy(root); return 1; }
    puts(search(root, key) ? "Found" : "Not found");
    if (scanf("%d", &key) != 1) { destroy(root); return 1; }
    root = deleteValue(root, key);
    printf("After delete: "); levelOrder(root);
    destroy(root);
    return 0;
}`,
  },
}

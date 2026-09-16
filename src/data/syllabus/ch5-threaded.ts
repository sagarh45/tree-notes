import type { Chapter } from './types'

const SLIDE = 'A(B(D(H,I),E),C(F(,J),G))' // in-order H D I B E A F J C G

export const CH5_THREADED: Chapter = {
  id: 'ch5',
  number: 5,
  title: 'Threaded Binary Tree',
  syllabus: 'Threaded binary trees · one-way and two-way threading · in-order traversal without stack',
  emoji: '🧵',
  topics: [
    {
      id: 'tbt-def',
      title: 'Threaded binary tree — idea and definition',
      tagline: 'Recycle the wasted NULL pointers as shortcuts.',
      definition:
        'In a linked binary tree with n nodes there are <b>n + 1 NULL pointers</b>. A <b>threaded binary tree</b> replaces these NULLs with <b>threads</b>: a NULL <b>right</b> pointer is made to point to the node\'s <b>in-order successor</b>, and a NULL <b>left</b> pointer to its <b>in-order predecessor</b>. Threads make in-order traversal possible <b>without recursion and without a stack</b>.',
      simple: `
<p>More than half of the pointers in a normal tree are NULL — wasted. Threading says: instead of NULL, store "where would I go next in in-order?" Now you can walk the tree like a linked list.</p>
<ul>
<li><b>One-way (single) threaded</b>: only right NULLs become threads (→ successor). Most common.</li>
<li><b>Two-way (double) threaded</b>: both left (→ predecessor) and right (→ successor) NULLs become threads.</li>
</ul>
<p>Each node needs two extra flag bits (<code>lthread</code>, <code>rthread</code>) to say whether a pointer is a real child or a thread.</p>`,
      diagrams: [
        {
          kind: 'tree',
          title: 'Slide example: in-order H D I B E A F J C G — dashed = threads',
          spec: SLIDE,
          threads: true,
          caption: 'Every right-NULL now points to the next in-order node (H→D, I→B, E→A, J→C). Every left-NULL points to the previous one. The first and last node have no predecessor/successor (they point to a header node or stay NULL).',
        },
        {
          kind: 'tree',
          title: 'Small example 4,2,6,1,3,5,7 with in-order threads',
          seq: [4, 2, 6, 1, 3, 5, 7],
          threads: true,
          caption: '1→2, 3→4, 5→6 are right threads (successor). 3←2, 5←4, 7←6 are left threads (predecessor).',
        },
        {
          kind: 'tree',
          title: 'Same tree without threads — 8 NULL pointers wasted',
          seq: [4, 2, 6, 1, 3, 5, 7],
          showNulls: true,
        },
      ],
      syntax: [
        {
          title: 'Node of a threaded binary tree',
          code: `struct TNode {
    int data;
    struct TNode *left, *right;
    int lthread;   /* 1 = left  is a thread (predecessor), 0 = real child */
    int rthread;   /* 1 = right is a thread (successor),   0 = real child */
};`,
        },
      ],
      formulas: [
        'Normal tree: 2n pointer fields, n − 1 used, <b>n + 1 NULL</b>.',
        'Two-way threaded tree: all n + 1 NULLs are used as threads (minus the two ends).',
      ],
      tips: ['Draw threads as <b>dashed</b> arrows and label the flag bits. Say clearly: right thread → successor, left thread → predecessor.'],
    },

    {
      id: 'tbt-inorder',
      diagrams: [{ kind: 'tree', title: 'Follow the in-order threads', spec: '4(2(1,3),6(5,7))', threads: true, order: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7 }, caption: 'Start at 1. Dashed right links lead to the successor whenever there is no real right child.' }],
      title: 'In-order traversal of a threaded tree (no stack)',
      tagline: 'Go to the left-most node, then keep following "next".',
      definition:
        'In a right-threaded tree the in-order successor of a node p is: if p→rthread = 1 → p→right (the thread); otherwise the <b>left-most node of p→right</b>. Starting from the left-most node of the whole tree and repeatedly moving to the successor visits every node in in-order using <b>O(1) extra space</b>.',
      simple: `<p>Two rules only: (1) start at the far-left node; (2) to find "next": if the right pointer is a thread, just follow it; if it is a real child, go to that child and then as far left as possible.</p>`,
      algorithm: [
        {
          title: 'inorderThreaded(root)',
          steps: [
            'p = left-most node of the tree (follow real left children while lthread = 0).',
            'While p ≠ NULL:',
            '&nbsp;&nbsp;a. <b>visit</b> p.',
            '&nbsp;&nbsp;b. If p→rthread = 1 → p = p→right (follow the thread).',
            '&nbsp;&nbsp;c. Else → p = left-most node of p→right.',
          ],
        },
      ],
      syntax: [
        {
          title: 'successor() and inorderThreaded()',
          code: `struct TNode *leftMost(struct TNode *p) {
    if (p == NULL) return NULL;
    while (p->lthread == 0)        /* real left child exists */
        p = p->left;
    return p;
}

struct TNode *successor(struct TNode *p) {
    if (p->rthread == 1)           /* right pointer is a thread */
        return p->right;
    return leftMost(p->right);     /* real right child: go left-most */
}

void inorderThreaded(struct TNode *root) {
    struct TNode *p = leftMost(root);
    while (p != NULL) {
        printf("%d ", p->data);
        p = successor(p);
    }
}`,
        },
      ],
      example: {
        title: 'walk the tree 4(2(1,3),6(5,7))',
        html: `
<table class="table"><thead><tr><th>At</th><th>Right pointer is…</th><th>Next</th></tr></thead><tbody>
<tr><td>1 (left-most)</td><td>thread → 2</td><td>2</td></tr>
<tr><td>2</td><td>real child 3 → left-most of 3 = 3</td><td>3</td></tr>
<tr><td>3</td><td>thread → 4</td><td>4</td></tr>
<tr><td>4</td><td>real child 6 → left-most = 5</td><td>5</td></tr>
<tr><td>5</td><td>thread → 6</td><td>6</td></tr>
<tr><td>6</td><td>real child 7 → 7</td><td>7</td></tr>
<tr><td>7</td><td>thread → NULL / header</td><td>stop</td></tr>
</tbody></table>
<p>Output 1 2 3 4 5 6 7 — with no recursion and no stack.</p>`,
      },
      complexity: [
        { op: 'In-order traversal', avg: 'O(n)', worst: 'O(n)', note: 'O(1) extra space instead of O(h) stack' },
        { op: 'Insert / delete', avg: 'O(h)', worst: 'O(n)', note: 'Slightly more work: threads must be fixed' },
      ],
      program: {
        title: 'In-order of a right-threaded tree (no recursion)',
        code: `#include <stdio.h>
#include <stdlib.h>

struct TNode {
    int data;
    struct TNode *left, *right;
    int lthread, rthread;
};

struct TNode *leftMost(struct TNode *p) {
    if (p == NULL) return NULL;
    while (p->lthread == 0) p = p->left;
    return p;
}

struct TNode *successor(struct TNode *p) {
    if (p->rthread == 1) return p->right;
    return leftMost(p->right);
}

void inorderThreaded(struct TNode *root) {
    struct TNode *p = leftMost(root);
    while (p != NULL) {
        printf("%d ", p->data);
        p = successor(p);
    }
}

/* Build a tiny threaded tree 2(1,3) by hand so the walk is obvious. */
int main() {
    struct TNode a, b, c;
    b.data = 2; a.data = 1; c.data = 3;

    b.left = &a;  b.right = &c; b.lthread = 0; b.rthread = 0;
    a.left = NULL; a.right = &b; a.lthread = 1; a.rthread = 1;
    c.left = &b;  c.right = NULL; c.lthread = 1; c.rthread = 1;

    printf("In-order: ");
    inorderThreaded(&b);
    printf("\\n");
    return 0;
}`,
        output: `In-order: 1 2 3`,
      },
      tips: [
        '<b>Advantages</b>: no stack/recursion for traversal, fast successor/predecessor, uses wasted space. <b>Disadvantages</b>: extra flag bits, insertion and deletion are more complex.',
      ],
    },
  ],
}

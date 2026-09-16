import type { Chapter } from './types'

const NODE = `struct BNode {
    int nkeys;                 /* how many keys are stored now   */
    int keys[M-1];             /* sorted keys                    */
    struct BNode *child[M];    /* child[i] sits in the gap i     */
    int leaf;                  /* 1 = no children                */
};`

export const CH9_BTREE: Chapter = {
  id: 'ch9',
  number: 9,
  title: 'Multiway tree and B-Tree',
  syllabus: 'm-way tree · B-Tree of order m · insert (median split) · search · delete (borrow / merge)',
  emoji: '📚',
  topics: [
    {
      id: 'bt-multi',
      title: 'Multiway tree and B-Tree of order m',
      tagline: 'A node may hold many keys. Between two keys sits a child pointer.',
      definition:
        'A <b>multiway (m-way) search tree</b> lets a node have up to <b>m children</b> and <b>m − 1 sorted keys</b>. A <b>B-Tree of order m</b> is a multiway search tree that stays shallow and even: every node except the root has at least ⌈m/2⌉ children, the root has at least 2 children if it is not a leaf, and <b>all leaves sit on the same level</b>.',
      simple: `
<p>Think of a BST that got fat. Instead of one key and two sides, a node has several keys that split the number line into several ranges.</p>
<p>A node with keys 20 and 50 has <b>three</b> children: “&lt; 20”, “between 20 and 50”, “&gt; 50”.</p>
<p>Why B-Trees exist: one node = one <b>disk page</b>. A million keys in a binary tree ≈ 20 jumps. In a B-Tree with hundreds of keys per node ≈ 3 or 4 jumps. Databases live on this.</p>`,
      points: [
        'At most <b>m children</b> and <b>m − 1 keys</b> in a node.',
        'Except root and leaves: at least <b>⌈m/2⌉</b> children (so at least ⌈m/2⌉ − 1 keys).',
        'Root has at least 2 children if it is not a leaf.',
        'All leaves are at the <b>same level</b>.',
        'Keys inside a node are <b>sorted</b>.',
      ],
      diagrams: [
        {
          kind: 'btree',
          title: 'Order-3 B-Tree after 10, 20, 5, 6, 12, 30, 7, 17',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
          caption: 'Order 3 → at most 2 keys, at most 3 children. All leaves on one level.',
        },
        {
          kind: 'ascii',
          title: 'One fat node — keys are separators',
          text: `          [  20  |  50  ]
         /       |        \\
   keys < 20   20..50    keys > 50`,
          caption: 'Search 35 goes to the middle child in one step. A node with k keys always has k+1 children.',
        },
      ],
      syntax: [{ title: 'B-Tree node (order M)', code: NODE, note: 'child[i] is the subtree for keys that sit between keys[i−1] and keys[i].' }],
      example: {
        title: 'order m = 3 (a 2-3 tree)',
        html: `<p>A node may hold at most 2 keys. A 3rd key is overflow → split. Minimum keys in a non-root node = ⌈3/2⌉ − 1 = 1.</p>`,
      },
      formulas: [
        'Max keys in a node = <b>m − 1</b>. Max children = <b>m</b>.',
        'Min children (non-root, non-leaf) = <b>ceil(m/2)</b>. Max children = <b>m</b>.',
        'Height grows <b>only</b> when the root splits. Height shrinks <b>only</b> when the root becomes empty.',
      ],
      lab: 'btree',
      tips: ['Always write “order m” and “max keys = m−1” in the first line of a B-Tree answer.'],
    },

    {
      id: 'bt-ins',
      title: 'B-Tree insertion — walk to a leaf, split at the median',
      tagline: 'Overflow → split. Median goes up. Height grows only at the root.',
      definition:
        'To <b>insert</b> a key: walk to the correct leaf (like a BST, but each node has several keys), put the key in sorted order, and if the node now has more than m − 1 keys, <b>split at the median</b>. Left keys stay, right keys stay, the median is <b>pushed up</b> to the parent. If the parent overflows, split it too. If the <b>root</b> splits, make a new root — this is the only way the tree gets taller.',
      simple: `<p>Insert is “put it in the leaf, and if the box is too full, tear it in half and send the middle key upstairs.”</p>`,
      diagrams: [
        {
          kind: 'btree-steps',
          title: 'Order 3 — insert 10, 20, 5, 6, 12, 30, 7, 17 (exam style: insert then split)',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
        },
      ],
      algorithm: [
        {
          title: 'btree_insert(root, key, m)',
          steps: [
            'If the tree is empty → make a one-key root and stop.',
            'From the root, pick the child whose range contains the key (scan the sorted keys).',
            'Insert the key in sorted order in that leaf.',
            'If the node has more than m − 1 keys: split at the <b>median</b>. Left half stays, right half becomes a new node, median goes <b>up</b>.',
            'If the parent now overflows, split it too. Repeat upward.',
            'If the <b>root</b> splits → create a brand-new root that holds only the median. Height + 1. All leaves stay on one level.',
          ],
        },
      ],
      syntax: [
        {
          title: 'Idea of insert (full listing is in Programs)',
          code: `/* Walk to a leaf, insert sorted, split on overflow.
   If the root splits, make a new root — height + 1. */
Node *btree_insert(Node *root, int key) {
    int up;
    Node *right = NULL;
    if (root == NULL) {
        root = new_node(1);
        root->keys[0] = key;
        root->nkeys = 1;
        return root;
    }
    insert_rec(root, key, &up, &right);
    if (right) {                       /* root overflowed */
        Node *nr = new_node(0);
        nr->keys[0] = up;
        nr->nkeys = 1;
        nr->child[0] = root;
        nr->child[1] = right;
        return nr;
    }
    return root;
}`,
        },
      ],
      example: {
        title: 'order 3, first four keys',
        html: `
<table class="table"><thead><tr><th>Insert</th><th>What happens</th></tr></thead><tbody>
<tr><td>10</td><td>root [10]</td></tr>
<tr><td>20</td><td>root [10 20]</td></tr>
<tr><td>5</td><td>would be [5 10 20] = 3 keys = overflow. Median <b>10</b> goes up. New root [10] with children [5] and [20].</td></tr>
<tr><td>6</td><td>6 &lt; 10 → left leaf [5] becomes [5 6]. Still 2 keys — OK.</td></tr>
</tbody></table>
<p>Open the Visualizer B-Tree tab and replay 10, 20, 5, 6, 12, 30, 7, 17. Circle the median on every split.</p>`,
      },
      lab: 'btree',
      mistakes: [
        'Writing “compare with the middle key and go left or right”. A node has several keys — find the correct <b>gap</b>.',
        'Splitting without sending the median <b>up</b>. The median does not stay in both halves.',
      ],
    },

    {
      id: 'bt-find',
      title: 'B-Tree search',
      tagline: 'BST search with an extra inner loop inside each node.',
      definition:
        'B-Tree search is BST search plus an inner scan: inside a node find the first key ≥ the target. If it matches, done. Otherwise that index i is the child pointer to follow.',
      simple: `<p>At each node: walk the keys left to right until you find a key that is not smaller than yours. Equal → found. Leaf and not equal → not found. Else drop into child[i].</p>`,
      diagrams: [
        {
          kind: 'btree',
          title: 'Search 17 in the finished order-3 tree',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
          caption: 'Root [10]. 17 > 10 → right child [20]. 17 < 20 → left of 20, the leaf [12 17] — found.',
        },
      ],
      algorithm: [
        {
          title: 'btree_search(n, key)',
          steps: [
            'Start at the root.',
            'i = 0. While i < nkeys and key > keys[i], increase i.',
            'If i < nkeys and keys[i] == key → found (return this node and i).',
            'If the node is a leaf → not found.',
            'Else n = child[i], repeat.',
          ],
        },
      ],
      syntax: [
        {
          title: 'btree_search()',
          code: `struct BNode *btree_search(struct BNode *n, int key, int *pos) {
    int i;
    while (n != NULL) {
        i = 0;
        while (i < n->nkeys && key > n->keys[i]) i++;
        if (i < n->nkeys && n->keys[i] == key) {
            *pos = i;
            return n;
        }
        if (n->leaf) return NULL;
        n = n->child[i];
    }
    return NULL;
}`,
        },
      ],
      example: {
        title: 'search 17, then search 8',
        html: `<p><b>17:</b> root [10] (or [10 20] depending on the split picture). 17 &gt; 10, 17 &lt; 20 → child “between 10 and 20” holds [12, 17] → found in 2 node visits.</p>
<p><b>8:</b> 8 &lt; 10 → leftmost leaf [5, 6, 7]. 8 is bigger than every key, node is a leaf → not found.</p>`,
      },
      complexity: [
        { op: 'Search / insert / delete', avg: 'O(log n)', worst: 'O(log n)', note: 'Node visits = height = O(log_{⌈m/2⌉} n). On disk only the visits matter.' },
      ],
      lab: 'btree',
      mistakes: ['Saying a node with keys [10, 20] has two children. It has <b>three</b>.'],
    },

    {
      id: 'bt-del',
      title: 'B-Tree deletion — borrow, then merge',
      tagline: 'Underflow is the opposite of overflow. Try a sibling first.',
      definition:
        'Deletion’s problem is <b>underflow</b> (a non-root node has fewer than ceil(m/2) − 1 keys). Cure, in this order: (1) if the key is internal, replace it with its in-order predecessor or successor and delete that leaf key; (2) if a leaf underflows, <b>borrow</b> from a sibling that has a spare key (through the parent); (3) only if no sibling can spare, <b>merge</b> with a sibling and pull the parent separator down. The tree gets shorter only when the <b>root</b> becomes empty.',
      simple: `<p>Insert splits a full box. Delete joins a hungry box. Always try to borrow from a neighbour before you glue two boxes together.</p>`,
      diagrams: [
        {
          kind: 'btree',
          title: 'Start of the dry run — after inserting 10, 20, 5, 6, 12, 30',
          seq: [10, 20, 5, 6, 12, 30],
          order: 3,
          mode: 'exam',
          caption: 'Root [10 20], leaves [5 6], [12], [30]. Minimum keys in a non-root = 1.',
        },
        { kind: 'btree-shape', title: 'Borrow: delete 12 from the starting tree', tree: { keys: [6, 20], children: [{ keys: [5] }, { keys: [10] }, { keys: [30] }] }, caption: 'Independent example: left sibling [5 6] can spare 6. Parent 10 moves down; sibling 6 moves up. Borrow through the parent.' },
        { kind: 'btree-shape', title: 'Dry run: after deleting 6', tree: { keys: [10, 20], children: [{ keys: [5] }, { keys: [12] }, { keys: [30] }] }, caption: 'The left leaf still has the minimum one key. No repair needed.' },
        { kind: 'btree-shape', title: 'Then delete 12: merge', tree: { keys: [20], children: [{ keys: [5, 10] }, { keys: [30] }] }, caption: 'Neither sibling can spare. Merge the empty leaf with [5] and separator 10. The parent loses 10.' },
        { kind: 'btree-shape', title: 'Then delete internal key 20', tree: { keys: [10], children: [{ keys: [5] }, { keys: [30] }] }, caption: 'Replace 20 with predecessor 10. Remove the old leaf copy of 10.' },
        { kind: 'btree-shape', title: 'Then delete 5: root shrinks', tree: { keys: [10, 30] }, caption: 'Merge with separator 10 and sibling [30]. The empty root is removed. Height decreases by one.' },
      ],
      algorithm: [
        {
          title: 'btree_delete(root, key, m)',
          steps: [
            'Find the key. If it is in an <b>internal</b> node: replace it with its predecessor (max of left subtree) or successor (min of right), then delete that leaf key.',
            'If the leaf still has a spare key → just remove it. Done.',
            'If the leaf underflows and a <b>sibling has a spare</b> → BORROW: parent separator comes down, sibling’s nearest key goes up. Never move sibling → hungry directly.',
            'If no sibling can spare → MERGE: join hungry + parent separator + sibling. Parent loses one key. Re-check the parent for underflow.',
            'If the root becomes empty → drop it. Height − 1.',
          ],
        },
      ],
      example: {
        title: 'order 3 dry run',
        html: `
<ol>
<li><b>Delete 6</b> — leaf [5 6] has a spare → becomes [5]. (Case 1)</li>
<li><b>Delete 12</b> — leaf empty. Both siblings have only 1 key → <b>merge</b>. Pull 10 down with [5] → [5 10]. Root becomes [20] with children [5 10] and [30].</li>
<li><b>Delete 20</b> — 20 is internal → replace with predecessor 10. Then delete 10 from [5 10] → [5].</li>
<li><b>Delete 5</b> — leaf empty, sibling [30] cannot spare → merge with separator 10 → [10 30]. Root empty → drop the root. Tree = [10 30].</li>
</ol>`,
      },
      mistakes: [
        'Moving a key directly from one sibling to another. It must travel <b>through the parent</b>.',
        'Merging when a borrow was possible.',
        'Declaring the root “underflowed” at 1 key. The root may have 1 key.',
      ],
      tips: ['Write the four cases with one tiny picture each. That is a full 6-mark deletion answer.'],
      lab: 'btree',
    },
  ],
}

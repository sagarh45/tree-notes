import type { Chapter } from './types'

export const CH12_ADVANCED: Chapter = {
  id: 'ch12',
  number: 12,
  title: 'Red-Black, Trie and B+ Tree',
  syllabus: 'Red-Black tree · Trie (prefix tree) · B+ Tree',
  emoji: '🚀',
  topics: [
    {
      id: 'rb-def',
      title: 'Red-Black tree — the industry BST',
      tagline: 'Five colour rules. Fewer rotations than AVL. Used in std::map.',
      definition:
        'A <b>Red-Black tree</b> is a BST in which every node is painted RED or BLACK and five rules hold: (1) every node is red or black; (2) the root is black; (3) every NIL leaf is black; (4) <b>no two reds in a row</b>; (5) every path from a node to a descendant NIL has the <b>same number of black nodes</b> (black-height).',
      simple: `
<p>A black node is a 2-node of a 2-3-4 tree. A red node is an extra key glued onto its black parent (making a 3-node or 4-node). Recolor = split a 4-node. Rotate = restack a 3-node. That is why RB insert looks like “paint, then maybe rotate” instead of “always rotate like AVL”.</p>
<p>AVL is <b>stricter</b> (shorter). RB does <b>fewer rotations</b> on updates — that is why Java TreeMap, C++ std::map and the Linux CFS scheduler pick it.</p>`,
      diagrams: [
        {
          kind: 'rbtree',
          title: 'Insert 10, 20, 30 — red-red on the line, then one left rotation',
          seq: [10, 20, 30],
          caption: 'New nodes start RED. 30 under red 20 breaks rule 4. Uncle is NIL (black) and the path is a line → rotate at 10, paint 20 black.',
        },
        {
          kind: 'rbtree',
          title: 'CLRS-style pack 7, 3, 18, 10, 22, 8, 11, 26',
          seq: [7, 3, 18, 10, 22, 8, 11, 26],
          caption: 'Black nodes look filled, red nodes look pink. No two pinks touch. Root is black.',
        },
      ],
      algorithm: [
        {
          title: 'RB-insert(key)',
          steps: [
            'BST-insert the key as a <b>RED leaf</b>. Red does not change black-height, so rule 5 stays.',
            'If the parent is black → done (rule 4 holds).',
            '<b>Uncle is RED</b> → recolor: parent and uncle BLACK, grandparent RED. Climb to the grandparent. No rotate.',
            '<b>Uncle BLACK, triangle</b> (LR / RL) → rotate at the parent first, so it becomes a straight line.',
            '<b>Uncle BLACK, line</b> (LL / RR) → rotate at the grandparent, paint parent BLACK, grandparent RED.',
            'Finally paint the root BLACK.',
          ],
        },
      ],
      syntax: [
        {
          title: 'Node with a colour bit',
          code: `struct RBNode {
    int data;
    char color;                /* 'R' or 'B' */
    struct RBNode *left, *right, *parent;
};

/* New nodes are RED — except the very first root, which is painted BLACK. */
struct RBNode *newRB(int key) {
    struct RBNode *n = (struct RBNode *)malloc(sizeof *n);
    n->data = key; n->color = 'R';
    n->left = n->right = n->parent = NULL;
    return n;
}`,
        },
      ],
      example: {
        title: 'insert 10, then 20, then 30',
        html: `<p>10 black root. 20 red right of 10 — OK (parent black). 30 red right of 20 — red-red. Uncle of 30 is NIL (black), path is a line (RR) → left-rotate at 10, paint 20 black, 10 red. Root becomes 20 (then forced black). Same picture as AVL RR, but the <b>reason</b> was colour, not BF = −2.</p>`,
      },
      complexity: [
        { op: 'Search / insert / delete', avg: 'O(log n)', worst: 'O(log n)', note: 'Height ≤ 2 log₂(n+1). Insert ≤ 2 rotations; recolor may walk up.' },
      ],
      lab: 'rbtree',
      mistakes: [
        '“RB is more balanced than AVL.” Opposite. AVL is |BF| ≤ 1. RB can be up to ~2× taller.',
        'Inserting the new node as black (except the first root). New nodes are RED.',
      ],
      tips: ['Write the five properties, then the three insert cases (uncle red / triangle / line). That is a complete 6-mark answer.'],
    },

    {
      id: 'trie-def',
      title: 'Trie (prefix tree)',
      tagline: 'One letter per edge. Cost = word length, not dictionary size.',
      definition:
        'A <b>trie</b> stores strings so that <b>one letter lives on one edge</b>. All words that share a prefix share the same path. Search and insert cost <b>O(L)</b> where L is the length of <i>this</i> word — not the number of words in the dictionary. An <b>END flag</b> on a node marks a complete word (a word need not end at a leaf).',
      simple: `
<p>A BST on words compares whole strings at every node. A trie pays one step per letter and stops. Autocomplete, spell-check, IP routing — this is their tree.</p>
<p>The dummy root holds no letter. First letters hang off it. Node <code>r</code> of “car” is both a complete word AND a prefix of “cart” — that is why END is a flag, not “being a leaf”.</p>`,
      diagrams: [
        {
          kind: 'trie',
          title: 'Insert cat, car, cart, dog',
          words: ['cat', 'car', 'cart', 'dog'],
          caption: 'c–a is shared by cat / car / cart. Green END marks sit on t (cat), r (car) and t (cart). r is not a leaf.',
        },
        {
          kind: 'trie',
          title: 'Autocomplete of “ca” — the subtree under a',
          words: ['cat', 'car', 'cart', 'cap', 'dog'],
          caption: 'Walk c → a, then list every END in that subtree: cap, car, cart, cat.',
        },
      ],
      algorithm: [
        {
          title: 'trie_insert(root, word)',
          steps: [
            'Start at the dummy root.',
            'For each letter of the word: if a child edge with that letter exists, follow it; else create the child.',
            'After the last letter, set END = true on that node.',
          ],
        },
        {
          title: 'trie_search(root, word)',
          steps: [
            'Walk letter by letter. If a letter has no edge → not found.',
            'After the last letter, the word is present only if END is true. (Otherwise it is only a prefix.)',
          ],
        },
      ],
      syntax: [
        {
          title: 'Node with 26 children + END flag',
          code: `struct Trie {
    int end;                   /* 1 = a word ends here */
    struct Trie *next[26];     /* next['a'-'a'] … next['z'-'a'] */
};

struct Trie *newTrie(void) {
    struct Trie *t = (struct Trie *)calloc(1, sizeof *t);
    return t;
}

void insertWord(struct Trie *t, const char *w) {
    while (*w) {
        int i = *w++ - 'a';
        if (!t->next[i]) t->next[i] = newTrie();
        t = t->next[i];
    }
    t->end = 1;
}

int searchWord(struct Trie *t, const char *w) {
    while (*w) {
        int i = *w++ - 'a';
        if (!t->next[i]) return 0;
        t = t->next[i];
    }
    return t->end;             /* prefix alone is not enough */
}`,
        },
      ],
      example: {
        title: 'insert cat, then car, then cart',
        html: `
<ol>
<li><b>cat</b> — create c → a → t, mark t as END.</li>
<li><b>car</b> — reuse c → a, create r, mark r as END.</li>
<li><b>cart</b> — reuse c → a → r, create t, mark END. Node r is now both a word and a prefix.</li>
</ol>
<p>Search “car” → walk c, a, r and END is 1 → found. Search “ca” → walk c, a and END is 0 → not a word (only a prefix).</p>`,
      },
      complexity: [
        { op: 'Insert / search / delete', avg: 'O(L)', worst: 'O(L)', note: 'L = word length. Space can be 26 × nodes.' },
      ],
      lab: 'trie',
      mistakes: [
        '“A word is stored only at a leaf.” False — car and cart. Always draw the END mark.',
        'Putting letters on nodes instead of edges (both drawings exist; say which one you use).',
      ],
    },

    {
      id: 'bplus-def',
      title: 'B+ Tree — what databases actually use',
      tagline: 'All records live in the leaves. Leaves are linked left to right.',
      definition:
        'A <b>B+ Tree</b> is a B-Tree where <b>all records live in the leaves</b>, leaves are linked left-to-right, and internal nodes keep <b>copies</b> of keys only as signposts. A range query (“all marks from 40 to 70”) then walks a linked list of leaves instead of jumping around the tree.',
      simple: `<p>B-Tree = keys can sit upstairs. B+ = upstairs is only a road sign; the real data is on the ground floor, and the ground-floor rooms have a corridor connecting them.</p>`,
      diagrams: [
        {
          kind: 'btree',
          title: 'B-Tree of the same keys (records sit in every node)',
          seq: [10, 20, 5, 6, 12, 30, 7, 17],
          order: 3,
          mode: 'exam',
          caption: 'In a B+ Tree the internal keys 6, 10, 20 would be copies / separators. The real 6, 10, 20 live again in the leaves, and those leaves are linked.',
        },
        {
          kind: 'ascii',
          title: 'B+ idea — leaf highway',
          text: `          [ 10 ]
         /      \\
     [ 6 ]      [ 20 ]          ← signposts only
     /   \\      /    \\
  [5] → [6 7] → [10 12 17] → [20 30]   ← real records, linked`,
          caption: 'Range 7…20: find the start leaf, then follow next pointers. No more climbing.',
        },
      ],
      example: {
        title: 'B-Tree vs B+ Tree',
        html: `
<table class="table"><thead><tr><th></th><th>B-Tree</th><th>B+ Tree</th></tr></thead><tbody>
<tr><td>Where is the record?</td><td>In any node</td><td>Only in leaves</td></tr>
<tr><td>Internal keys</td><td>The actual keys</td><td>Copies / separators</td></tr>
<tr><td>Leaves</td><td>Not linked</td><td>Linked as a sorted list</td></tr>
<tr><td>Range scan</td><td>In-order walk of the tree</td><td>Find start leaf, then follow next</td></tr>
<tr><td>Fanout</td><td>Good</td><td>Better (internal nodes hold only keys)</td></tr>
<tr><td>Used by</td><td>Some file indexes</td><td>MySQL InnoDB, PostgreSQL, NTFS, HFS+</td></tr>
</tbody></table>`,
      },
      formulas: [
        'B+ keeps every B-Tree rule (order m, median split, all leaves on one level) and adds the leaf highway.',
        'A key may appear twice — once as a separator upstairs, once as the real record in a leaf.',
      ],
      lab: 'btree',
      mistakes: [
        '“B+ is just a fatter B-Tree.” The linked leaves are the point.',
        'Assuming that deleting a record always deletes the separator upstairs. Implementations vary — say so.',
      ],
      tips: ['4-mark difference question: three rows of the table above + “range query walks the leaf list”.'],
    },
  ],
}

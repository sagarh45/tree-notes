import type { Chapter } from './types'

export const CH11_HUFFMAN: Chapter = {
  id: 'ch11',
  number: 11,
  title: 'Huffman coding',
  syllabus: 'Huffman tree · prefix-free codes · average code length · construction',
  emoji: '🎟️',
  topics: [
    {
      id: 'huff-idea',
      title: 'Huffman tree — short tickets for frequent letters',
      tagline: 'Merge the two lightest trees. Left = 0, right = 1.',
      definition:
        '<b>Huffman coding</b> builds an <b>optimal prefix-free binary code</b>. Start with one tree per letter. Repeatedly merge the two trees with the <b>smallest frequencies</b>. Left edge = bit 0, right edge = bit 1. The code of a letter is the path from the root to that leaf. Frequent letters stay near the root → short codes.',
      simple: `
<p><b>Prefix-free</b> means no code is the beginning of another code. You can glue bits with no commas and still decode uniquely. Morse code is not prefix-free (you need gaps). Huffman is.</p>
<p>Internal nodes are <b>sums of frequencies</b>, not letters. Only leaves are letters.</p>`,
      diagrams: [
        {
          kind: 'huffman',
          title: 'Tiny example A:4 B:2 C:1 D:1 — every merge drawn',
          items: [
            { ch: 'A', freq: 4 },
            { ch: 'B', freq: 2 },
            { ch: 'C', freq: 1 },
            { ch: 'D', freq: 1 },
          ],
          steps: true,
        },
        {
          kind: 'huffman',
          title: 'Classic exam frequencies A:5 B:9 C:12 D:13 E:16 F:45',
          items: [
            { ch: 'A', freq: 5 },
            { ch: 'B', freq: 9 },
            { ch: 'C', freq: 12 },
            { ch: 'D', freq: 13 },
            { ch: 'E', freq: 16 },
            { ch: 'F', freq: 45 },
          ],
          caption: 'F is so frequent it becomes a child of the root — code 0, one bit.',
        },
      ],
      algorithm: [
        {
          title: 'huffman(letters with frequencies)',
          steps: [
            'Make a forest: one single-node tree per letter, labelled with its frequency.',
            'While more than one tree remains: pick the two lightest, make a new parent whose frequency is their sum, hang them as left and right.',
            'The last tree is the Huffman tree.',
            'Walk root → leaf: left edge writes 0, right edge writes 1. That bit-string is the code.',
          ],
        },
      ],
      syntax: [
        {
          title: 'Node + the merge loop (priority-queue idea)',
          code: `struct HNode {
    char ch;                 /* '\\0' on internal nodes */
    int freq;
    struct HNode *left, *right;
};

/* Repeatedly: extract the two lightest, join, insert the parent.
   A min-heap / priority queue does the "two lightest" step. */
struct HNode *huffman(struct HNode *forest[], int n) {
    while (n > 1) {
        /* find two smallest (or pop twice from a min-heap) */
        struct HNode *a = extractMin(forest, &n);
        struct HNode *b = extractMin(forest, &n);
        struct HNode *p = (struct HNode *)malloc(sizeof *p);
        p->ch = 0;
        p->freq = a->freq + b->freq;
        p->left = a; p->right = b;
        forest[n++] = p;
    }
    return forest[0];
}`,
        },
      ],
      example: {
        title: 'A:4 B:2 C:1 D:1',
        html: `
<ol>
<li>Forest: C(1) D(1) B(2) A(4).</li>
<li>Merge C and D → tree of 2. Forest: CD(2), B(2), A(4).</li>
<li>Merge CD(2) and B(2) → tree of 4. Forest: CDB(4), A(4).</li>
<li>Merge those two → root 8.</li>
</ol>
<p>One possible set of codes: A = <b>1</b> (one bit!), B = 01, C = 000, D = 001. A appears 4 times so it deserved the short ticket.</p>`,
      },
      lab: 'huffman',
      mistakes: [
        '“Huffman always gives A the shortest code.” Only if A is the most frequent.',
        'Writing letters on internal nodes. Internal labels are frequency sums.',
        'Treating Huffman as a BST. There is no “left &lt; right” on letters — only frequency.',
      ],
    },

    {
      id: 'huff-len',
      title: 'Average code length and why it is optimal',
      tagline: 'Weighted path length / total frequency. Shorter than a fixed-length code.',
      definition:
        'The <b>average code length</b> is (Σ freq(letter) × depth(letter)) / (Σ freq). Huffman minimises this among all binary prefix codes. The same sum without the division is the <b>weighted external path length</b>.',
      simple: `<p>Fixed-length for 6 letters needs 3 bits each. Huffman gives frequent letters 1 bit and rare letters 4 bits. The average drops below 3.</p>`,
      diagrams: [
        {
          kind: 'huffman',
          title: 'CLRS frequencies — F gets the short code',
          items: [
            { ch: 'A', freq: 5 },
            { ch: 'B', freq: 9 },
            { ch: 'C', freq: 12 },
            { ch: 'D', freq: 13 },
            { ch: 'E', freq: 16 },
            { ch: 'F', freq: 45 },
          ],
        },
      ],
      formulas: [
        'Average length = Σ (freq × depth) / Σ freq.',
        'For A:5 B:9 C:12 D:13 E:16 F:45: (5·4 + 9·4 + 12·3 + 13·3 + 16·3 + 45·1) / 100 = 224 / 100 = <b>2.24 bits</b> vs 3 bits fixed — about 25 % saved.',
      ],
      example: {
        title: 'the 6-letter exam question',
        html: `
<ol>
<li>5 + 9 = <b>14</b> → node(A,B). Pool: 12, 13, 14, 16, 45</li>
<li>12 + 13 = <b>25</b> → node(C,D). Pool: 14, 16, 25, 45</li>
<li>14 + 16 = <b>30</b> → node(AB, E). Pool: 25, 30, 45</li>
<li>25 + 30 = <b>55</b>. Pool: 45, 55</li>
<li>45 + 55 = <b>100</b> → root.</li>
</ol>
<p>Left = 0, right = 1 → F = <b>0</b>, C = 100, D = 101, A = 1100, B = 1101, E = 111.</p>
<p>Average = 2.24 bits / symbol.</p>`,
      },
      complexity: [{ op: 'Build Huffman tree', avg: 'O(n log n)', worst: 'O(n log n)', note: 'n = alphabet size; each merge is a heap extract' }],
      lab: 'huffman',
      tips: [
        'Always show the forest after every merge, then the final codes in a table, then the average-length sum.',
        'Say “prefix-free” and “no two codes share a prefix” — that sentence gets a mark by itself.',
      ],
    },
  ],
}

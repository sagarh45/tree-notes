import type { Chapter } from './types'

export const CH8_GENERAL: Chapter = {
  id: 'ch8',
  number: 8,
  title: 'General tree and forest',
  syllabus: 'General tree · forest · left-child right-sibling (natural correspondence)',
  emoji: '🌲',
  topics: [
    {
      id: 'gen-lcrs',
      title: 'General tree → binary tree (left-child, right-sibling)',
      tagline: 'Left = first child. Right = next brother or sister.',
      definition:
        'Any general tree (a node may have many children) can be stored as a <b>binary</b> tree with zero loss: the <b>left</b> pointer of a node is its <b>first child</b>, the <b>right</b> pointer is its <b>next sibling</b>. This is the <b>left-child right-sibling (LCRS)</b> or <b>natural correspondence</b> representation.',
      simple: `
<p>A general-tree node with 7 children would need a list of 7 pointers. LCRS says: keep only two pointers, the same as a binary tree.</p>
<ol>
<li>Keep the root.</li>
<li>First child becomes the <b>left</b> child.</li>
<li>The remaining children become a <b>right chain</b> under that first child: 2nd is right of 1st, 3rd is right of 2nd, …</li>
</ol>
<p>A right pointer now means “brother / sister”, not “right child of the original tree”.</p>`,
      diagrams: [
        {
          kind: 'ascii',
          title: 'General tree (A has 3 children)',
          text: `        A
     /  |  \\
    B   C   D
   / \\      |
  E   F     G`,
          caption: 'A node may have 0, 1, 2, 3, … children. Order of children matters.',
        },
        {
          kind: 'tree',
          title: 'Same tree after LCRS (binary)',
          spec: 'A(B(E(,F),C(,D(G,))),)',
          edgeLabels: true,
          caption: 'Left of A = first child B. Right chain B → C → D = the other children of A. Left of B = first child E. E → right = F (siblings). Left of D = G.',
        },
      ],
      algorithm: [
        {
          title: 'convert(general node)',
          steps: [
            'Binary node = same data as the general node.',
            'If it has children: left = convert(first child).',
            'Walk the remaining children and hang each as the right child of the previous converted sibling.',
            'The converted tree usually looks right-heavy and ugly. That is correct.',
          ],
        },
      ],
      example: {
        title: 'A(B, C, D) with B(E, F) and D(G)',
        html: `
<ol>
<li>A’s first child is B → B becomes A’s <b>left</b>.</li>
<li>A’s other children C, D become a right chain: B→right = C, C→right = D.</li>
<li>B’s first child E → B’s <b>left</b>. B’s second child F → E→right = F.</li>
<li>D’s only child G → D’s <b>left</b>.</li>
</ol>
<p>Check: from A go left once (B), then follow right pointers (C, D) — that is exactly the children of A.</p>`,
      },
      formulas: [
        'Preorder of the general tree = <b>preorder</b> of the LCRS binary tree.',
        'Postorder of the general tree = <b>inorder</b> of the LCRS binary tree.',
        'A general tree has no natural “in-order” (a node with 7 children has no single middle).',
      ],
      mistakes: [
        'Marking C as a <b>child</b> of B after conversion. C is B’s <b>sibling</b>. The right pointer is not a child in the original tree.',
        'Expecting the converted tree to be a BST or to look balanced. LCRS is about <b>storage</b>, not search.',
      ],
      tips: ['Draw the general tree, then redraw it with only two pointers per node. Label the right edges “sibling”.'],
    },

    {
      id: 'gen-forest',
      title: 'Forest → binary tree',
      tagline: 'Convert each tree, then join the roots as a right chain.',
      definition:
        'A <b>forest</b> is a set of disjoint trees (several roots). To store a forest as one binary tree: convert each tree with LCRS, then link the <b>roots</b> as a right-sibling chain: root(T₁)→right = root(T₂), root(T₂)→right = root(T₃), …',
      simple: `<p>Deleting the root of a tree leaves a forest — the children of the old root become the new roots. The opposite of “join roots on the right”.</p>`,
      diagrams: [
        {
          kind: 'ascii',
          title: 'Forest of two trees',
          text: `   B          C
  / \\         |
 D   E        F`,
        },
        {
          kind: 'tree',
          title: 'Joined as one binary tree',
          spec: 'B(D(,E),C(F,))',
          edgeLabels: true,
          caption: 'B→right = C joins the two roots. D→right = E are siblings under B. Left of C = F.',
        },
        {
          kind: 'tree',
          title: 'Company sample: deleting root A left this forest',
          spec: 'B(D,E(,G))',
          caption: 'B(D, E(G)) is one leftover tree. The other leftover tree is C(F). Join B→right = C to recover the binary form of the original.',
        },
      ],
      example: {
        title: 'why this shows up in the exam',
        html: `<p>Question: “Convert the forest { B(D,E), C(F) } to a binary tree.” Answer: convert each, then B→right = C. Result: B with left D, D→right = E, B→right = C, C→left = F.</p>
<p>The result is exactly the company sample tree after you remove A — which is why the two pictures belong together.</p>`,
      },
      tips: ['Forest = many trees. Binary form = first tree’s root as the binary root, remaining roots hanging to the right.'],
    },
  ],
}

import type { Chapter } from './types'

export const CH1_TREE: Chapter = {
  id: 'ch1',
  number: 1,
  title: 'Tree — basics and terminology',
  syllabus: 'Tree ADT · definition · terminology · real-life examples',
  emoji: '🌳',
  topics: [
    {
      id: 'tree-def',
      title: 'What is a Tree?',
      tagline: 'A non-linear structure that looks like an upside-down real tree.',
      definition:
        'A <b>tree</b> is a <b>non-linear, hierarchical</b> data structure made of <b>nodes</b> connected by <b>edges</b>, such that there is <b>exactly one path</b> between any two nodes. It starts from a special node called the <b>root</b> and has <b>no cycles</b>.',
      simple: `
<p>Think of a <b>family tree</b> or a <b>company chart</b>. One person is at the top (the <b>root</b>). Under them are children. Under those are more children. Nobody has two bosses, and nobody is their own grand-boss. That is a tree.</p>
<p>In computer science we draw the tree <b>upside down</b>: root at the top, leaves at the bottom.</p>`,
      points: [
        '<b>Non-linear</b>: data is not in one straight line like an array or a linked list.',
        '<b>Hierarchical</b>: parent → child relationship (one-to-many).',
        '<b>One root</b>, every other node has <b>exactly one parent</b>.',
        '<b>No cycles</b>: you can never walk in a loop.',
        'A tree with <b>n</b> nodes has exactly <b>n − 1</b> edges.',
      ],
      diagrams: [
        {
          kind: 'tree',
          title: 'A tree of 7 nodes (from the class notes)',
          spec: 'A(B(D,E(,G)),C(,F))',
          caption: 'A is the root. 7 nodes → 6 edges. D, G and F have no children (leaves).',
        },
        {
          kind: 'ascii',
          title: 'Real-life example: a company',
          text: `        President                ← root
       /          \\
  Vice-President  Vice-President   ← level 1
     /     \\           |
   PM      PM          PM          ← level 2
   |        |          |
Engineer Engineer   Engineer       ← leaves`,
          caption: 'Every employee reports to exactly one boss. That "exactly one parent" rule is what makes it a tree.',
        },
        {
          kind: 'ascii',
          title: 'Linear vs non-linear',
          text: `Array / Linked list (linear):   10 → 20 → 30 → 40

Tree (non-linear):                  10
                                   /  \\
                                 20    30
                                /
                              40`,
          caption: 'In a linear structure every element has one "next". In a tree an element can have many "next" (children).',
        },
      ],
      formulas: [
        'Edges = <b>n − 1</b> (n = number of nodes). Every node except the root brings exactly one edge with it.',
        'Only <b>one</b> path exists from the root to any node. Two paths ⇒ it is a <b>graph</b>, not a tree.',
      ],
      example: {
        title: 'is this a tree?',
        html: `
<table class="table"><thead><tr><th>Picture</th><th>Tree?</th><th>Reason</th></tr></thead><tbody>
<tr><td>A → B, A → C, B → D</td><td><b>Yes</b></td><td>One root A, each node has one parent, no loop. 4 nodes, 3 edges ✓</td></tr>
<tr><td>A → B, A → C, B → D, C → D</td><td><b>No</b></td><td>D has <b>two parents</b> (B and C). Two paths from A to D. This is a graph.</td></tr>
<tr><td>A → B, B → C, C → A</td><td><b>No</b></td><td>It is a <b>cycle</b> (loop). Trees never loop.</td></tr>
<tr><td>A → B and a separate C → D</td><td><b>No</b> (it is a <b>forest</b>)</td><td>Two roots. A forest = a set of trees.</td></tr>
</tbody></table>`,
      },
      tips: [
        'Start every tree answer with the definition line above, then draw one small tree with the root labelled.',
        'If asked "difference between tree and graph": tree = no cycle, one root, n−1 edges. Graph = cycles allowed, any number of edges.',
      ],
    },

    {
      id: 'tree-terms',
      title: 'Tree terminology',
      tagline: 'Root, edge, parent, child, sibling, leaf, degree, level, height, depth, path, subtree, forest.',
      definition:
        'Terminology describes the <b>position</b> of a node inside the tree. The most-asked terms are: <b>root, edge, parent, child, siblings, leaf, internal node, degree, level, depth, height, path, subtree, ancestor, descendant, forest</b>.',
      simple: `
<p>All the words come from a <b>family</b>: parent, child, sibling, ancestor, descendant. Only a few are new: <b>degree</b> (how many children), <b>level</b> (how deep from the root), <b>height</b> (how far to the deepest leaf).</p>
<p>We use <b>one sample tree</b> for every word below (A at the top, B and C under A, D and E under B, F under C). Each card draws the same tree and colours only the nodes that matter for that word.</p>`,
      termCards: true,
      diagrams: [
        {
          kind: 'tree',
          title: 'Levels on the class-notes tree (root = level 0)',
          spec: 'A(B(D,E(,G)),C(,F))',
          tags: { A: 'level 0', B: 'level 1', C: 'level 1', D: 'level 2', E: 'level 2', F: 'level 2', G: 'level 3' },
          caption: 'Level of a node = number of edges from the root. Height of the tree = deepest level = 3.',
        },
        {
          kind: 'tree',
          title: 'Height of every node (leaf = 0)',
          spec: 'A(B(D,E(,G)),C(,F))',
          tags: { A: 'h=3', B: 'h=2', C: 'h=1', D: 'h=0', E: 'h=1', F: 'h=0', G: 'h=0' },
          caption: 'Height of a node = longest path (in edges) from that node DOWN to a leaf. Height of the tree = height of the root = 3.',
        },
        {
          kind: 'tree',
          title: 'Degree of every node',
          spec: 'A(B(D,E(,G)),C(,F))',
          tags: { A: 'deg 2', B: 'deg 2', C: 'deg 1', D: 'deg 0', E: 'deg 1', F: 'deg 0', G: 'deg 0' },
          caption: 'Degree = number of children. Leaves always have degree 0. Degree of the tree = maximum degree = 2.',
        },
      ],
      formulas: [
        '<b>Level</b>(root) = 0, level(child) = level(parent) + 1. (Some books start at 1 — write your convention.)',
        '<b>Depth</b>(node) = number of edges from the root to that node = its level.',
        '<b>Height</b>(node) = number of edges on the longest path from that node down to a leaf. Height(leaf) = 0.',
        '<b>Height of tree</b> = height of the root = maximum level.',
        '<b>Path length</b> = number of edges on the path.',
        '<b>Weight</b> of a tree = number of leaf (external) nodes.',
      ],
      example: {
        title: 'answer these on the class-notes tree A(B(D,E(,G)),C(,F))',
        html: `
<table class="table"><thead><tr><th>Question</th><th>Answer</th><th>How</th></tr></thead><tbody>
<tr><td>Root</td><td>A</td><td>Only node with no parent.</td></tr>
<tr><td>Leaves</td><td>D, G, F</td><td>No children.</td></tr>
<tr><td>Internal nodes</td><td>A, B, C, E</td><td>At least one child.</td></tr>
<tr><td>Siblings of D</td><td>E</td><td>Same parent B. (E and F are NOT siblings — different parents.)</td></tr>
<tr><td>Degree of B / C / E</td><td>2 / 1 / 1</td><td>Count the children.</td></tr>
<tr><td>Level of G</td><td>3</td><td>A→B→E→G is 3 edges.</td></tr>
<tr><td>Height of B</td><td>2</td><td>Longest way down: B→E→G = 2 edges.</td></tr>
<tr><td>Height of tree</td><td>3</td><td>Height of root A.</td></tr>
<tr><td>Ancestors of G</td><td>E, B, A</td><td>Walk up to the root.</td></tr>
<tr><td>Descendants of B</td><td>D, E, G</td><td>Everything below B.</td></tr>
<tr><td>Number of edges</td><td>6</td><td>n − 1 = 7 − 1.</td></tr>
<tr><td>Weight</td><td>3</td><td>Three leaves.</td></tr>
</tbody></table>`,
      },
      tips: [
        'Height is counted in <b>edges</b> in these notes (leaf = 0). If your teacher counts nodes (leaf = 1), every height becomes +1 — say which one you use.',
        'Degree of a <b>node</b> ≠ degree of the <b>tree</b>. Degree of the tree is the maximum node degree.',
        '"Depth" and "level" are the same number in most books.',
      ],
      mistakes: [
        'Calling A the parent of D. A is the <b>grandparent</b> / ancestor. Parent means directly above.',
        'Counting the root as level 1 in one line and level 0 in the next. Stay consistent.',
      ],
    },

    {
      id: 'tree-why',
      title: 'Why trees? Where are they used?',
      tagline: 'Hierarchy + fast search.',
      definition:
        'Trees are used whenever data is naturally <b>hierarchical</b> (folders, HTML, organisation charts, expressions) or when we need <b>fast search / insert / delete</b> (BST, AVL, B-Tree give O(log n)).',
      simple: `
<p>Two reasons:</p>
<ol>
<li><b>The data itself is a hierarchy.</b> A folder inside a folder, a tag inside a tag, a manager above an employee.</li>
<li><b>Speed.</b> In a balanced tree of 1,000,000 keys, each comparison throws away half. So you need only about 20 comparisons (log₂ 1,000,000 ≈ 20) instead of up to 1,000,000 in a linked list.</li>
</ol>`,
      points: [
        '<b>File system</b>: C:\\ → Notes → DS → Trees.',
        '<b>HTML / XML DOM</b>: &lt;html&gt; is the root, &lt;body&gt; a child, paragraphs under body.',
        '<b>Expression trees</b> in compilers: (a + b) * c.',
        '<b>Databases</b>: indexes are B-Trees / B+ Trees.',
        '<b>Routing tables, decision trees, game trees (chess moves), Huffman coding</b>.',
      ],
      diagrams: [
        {
          kind: 'tree',
          title: 'Folder hierarchy as a tree',
          spec: 'C:(Notes(DS,OS),Games)',
          caption: 'Every folder has one parent folder. You cannot put a folder inside itself (no cycle).',
        },
        {
          kind: 'tree',
          title: 'Expression tree for (a + b) * c',
          spec: '*(+(a,b),c)',
          caption: 'Operators inside, operands at the leaves. In-order traversal gives a + b * c (add brackets), post-order gives postfix a b + c *.',
        },
      ],
      example: {
        title: 'why log n matters',
        html: `
<table class="table"><thead><tr><th>Number of keys n</th><th>Linked list (worst)</th><th>Balanced tree (≈ log₂ n)</th></tr></thead><tbody>
<tr><td>1,000</td><td>1,000 steps</td><td>10 steps</td></tr>
<tr><td>1,000,000</td><td>1,000,000 steps</td><td>20 steps</td></tr>
<tr><td>1,000,000,000</td><td>1,000,000,000 steps</td><td>30 steps</td></tr>
</tbody></table>
<p>Each level of a balanced tree cuts the search space in half. That is the whole reason BST, AVL and B-Tree exist.</p>`,
      },
      tips: ['"Applications of trees" is a standard 4-mark question. Write 5–6 bullet points with one line each.'],
    },
  ],
}

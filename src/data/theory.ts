export type TheorySection = {
  id: string
  title: string
  body: string
}

export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 'intro',
    title: '1. What is a Tree? (full concept)',
    body: `
<p><b>Exam definition:</b> A tree is a <b>non-linear, hierarchical</b> data structure. It has one special node called the <b>root</b>. Every other node has <b>exactly one parent</b>. There are <b>no cycles</b> (you cannot walk in a loop).</p>
<p><b>Simple meaning:</b> Data is not in one straight line (like an array or linked list). It is arranged like a family / company chart: one person at the top, then managers, then staff.</p>
<p><b>Three rules (write these):</b></p>
<ol>
  <li>There is a unique <b>root</b>. The root has no parent.</li>
  <li>Every other node has exactly one parent. The joining line is an <b>edge</b>.</li>
  <li>No cycles. So there is exactly one path from the root to any node.</li>
</ol>
<div class="ex"><b>Real-life example:</b> A college. Principal is the root. HODs report to the Principal. Teachers report to one HOD. A teacher does not report to two HODs. Nobody reports back to their own student. That is a tree.</div>
<p>If a teacher reported to two HODs, or an HOD reported back to a teacher, it would be a <b>graph</b>, not a tree.</p>
<p><b>Formula:</b> A tree with <b>n</b> nodes has exactly <b>n − 1</b> edges. Why? Every node except the root brings one edge with it.</p>
<div class="ex"><b>Example:</b> 6 people in a company chart ⇒ 6 nodes ⇒ 5 edges (5 “reports-to” lines).</div>
`,
  },
  {
    id: 'sample',
    title: '2. One sample tree (we use this everywhere)',
    body: `
<p>Keep this picture in your head. Every terminology below is explained on this same tree.</p>
<pre class="tree-pic">        A          ← CEO (root)
       / \\
      B   C        ← managers
     / \\   \\
    D   E   F      ← staff (leaves)</pre>
<p>Read it as: A is the boss. B and C report to A. D and E report to B. F reports to C. C has no left child (only a right child F).</p>
<p>Nodes = A, B, C, D, E, F so <b>n = 6</b>. Edges = 5. Check: n − 1 = 5. Correct.</p>
`,
  },
  {
    id: 'terms',
    title: '3. Terminology — each word with an example',
    body: `
<p>We use <b>one sample tree</b> everywhere (company chart: A at the top, B and C under A, then D E F). For <b>each word</b> that same tree is drawn again, with only the matching nodes coloured. Read the meaning, look at that drawing, then remember the exam line.</p>
<p><b>Colour key:</b> teal = the node the word is about · green = the matching set (leaves, children, siblings) · blue = a path / ancestor · faded = ignore for this word.</p>
`,
  },
  {
    id: 'why',
    title: '4. Why do we need trees? (concept)',
    body: `
<p>Use a tree when data is naturally <b>one-to-many</b> and has a <b>hierarchy</b>.</p>
<div class="term">
  <div class="term-name">Folders on a disk</div>
  <div class="ex"><b>Example:</b> C:\\Notes\\DS\\Trees. “Notes” is parent of “DS”. You cannot put a folder inside itself (no cycle).</div>
</div>
<div class="term">
  <div class="term-name">HTML page</div>
  <div class="ex"><b>Example:</b> &lt;html&gt; is root. &lt;body&gt; is a child. Paragraphs hang under body.</div>
</div>
<div class="term">
  <div class="term-name">Compiler expression</div>
  <div class="ex"><b>Example:</b> (1+2)*3 becomes a tree: * at root, + and 3 as children, 1 and 2 under +.</div>
</div>
<div class="term">
  <div class="term-name">Fast search</div>
  <p>In a balanced tree of n items, one comparison throws away about half the remaining keys. That is why BST / AVL / B-Tree exist.</p>
  <div class="ex"><b>Example:</b> 1,000,000 keys. A stick (linked list) may need ~1,000,000 steps. A bushy tree needs about 20 steps (log₂ 1,000,000 ≈ 20).</div>
</div>
`,
  },
  {
    id: 'binary',
    title: '5. Binary tree — concept + node function',
    body: `
<p><b>Definition:</b> A binary tree is a tree where every node has <b>at most two children</b>. The two places are named: <b>left</b> and <b>right</b>.</p>
<p><b>Important:</b> “only a right child” is not the same as “only a left child”. The empty side still has a name.</p>
<div class="ex"><b>Example from sample:</b> C has only a right child F. Left of C is NULL. If we had put F on the left instead, the picture would be a different binary tree.</div>
<p><b>Draw this in the exam</b> for every node:</p>
<pre class="tree-pic">  [ LEFT | DATA | RIGHT ]</pre>
<p>Arrows go from LEFT / RIGHT to child nodes. If no child, write NULL. <b>Never</b> write <code>A-&gt;left = new_node(...)</code> in a program. Type keys; call <code>insert()</code>.</p>

<div class="fn">
  <div class="fn-name">struct Node + new_node(data) — complete syntax</div>
  <p><b>What it does (simple):</b> Make one empty node, put data in it, set both children to NULL.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>Allocate memory for a Node.</li>
    <li>Put <code>data</code> in the DATA field.</li>
    <li>Set left = NULL, right = NULL.</li>
    <li>Return the pointer.</li>
  </ol>
  <pre>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int data) {
    struct Node *n = (struct Node *)malloc(sizeof(struct Node));
    n-&gt;data = data;
    n-&gt;left = NULL;
    n-&gt;right = NULL;
    return n;
}

struct Node *insert(struct Node *root, int key) {
    if (root == NULL)
        return new_node(key);
    if (key &lt; root-&gt;data)
        root-&gt;left = insert(root-&gt;left, key);
    else if (key &gt; root-&gt;data)
        root-&gt;right = insert(root-&gt;right, key);
    return root;
}</pre>
  <div class="ex"><b>Example (user types keys):</b> <code>insert(root, 45)</code> then <code>insert(root, 15)</code> then <code>insert(root, 79)</code>. First call makes the root. Next keys hang as leaves. Empty tree means root pointer is NULL.</div>
</div>

<p><b>Array representation</b> (only for complete trees / heaps). Root at index 0:</p>
<ul>
  <li>left child of i → index <b>2i + 1</b></li>
  <li>right child of i → index <b>2i + 2</b></li>
  <li>parent of i → index <b>⌊(i − 1) / 2⌋</b></li>
</ul>
<div class="ex"><b>Example:</b> Root A at index 0. Left B at 1, right C at 2. Left of B is D at 2·1+1 = 3. A skewed tree would leave many holes, so search trees use the linked form, not the array.</div>
`,
  },
  {
    id: 'shapes',
    title: '6. Shapes of a binary tree (with pictures)',
    body: `
<div class="term">
  <div class="term-name">Full binary tree</div>
  <p><b>Meaning:</b> Every node has <b>0 or 2</b> children. Nobody has exactly one child.</p>
  <div class="ex"><b>Example:</b> A with left B and right C, and B, C both leaves — full. Our sample tree is <b>not</b> full, because C has only one child F.</div>
</div>
<div class="term">
  <div class="term-name">Complete binary tree</div>
  <p><b>Meaning:</b> Filled level by level, left to right (heap shape). Last level may be incomplete, but all nodes there are as far left as possible.</p>
  <div class="ex"><b>Example:</b> A, then B and C, then D, E, F packed from the left — complete. If we had D and F but no E, it would not be complete.</div>
</div>
<div class="term">
  <div class="term-name">Perfect binary tree</div>
  <p><b>Meaning:</b> Every level is completely full. All leaves sit on the same level.</p>
  <div class="ex"><b>Example:</b> A, B, C, D, E, F, G (the visualizer A–G tree) is perfect of height 2. Number of nodes = 2<sup>h+1</sup> − 1 = 7.</div>
</div>
<div class="term">
  <div class="term-name">Skewed / degenerate tree</div>
  <p><b>Meaning:</b> Each node has only one child. It looks like a linked list. Height = n − 1.</p>
  <div class="ex"><b>Example:</b> Insert 10, then 20, then 30, then 40 into a BST. You get 10→20→30→40 to the right. Search becomes O(n). This is why AVL exists.</div>
</div>
`,
  },
  {
    id: 'props',
    title: 'Properties and formulas (every number they can ask)',
    body: `
<div class="law"><b>Law:</b> A binary tree of height <b>h</b> is squeezed between two shapes. The <b>perfect</b> tree is the fattest (most nodes), the <b>stick</b> is the thinnest (fewest nodes). Every formula below is just “how fat or thin can it be?”</div>
<p>Conventions used in this whole package (write them in the exam, examiners differ):</p>
<ul>
  <li><b>Root is at level 0.</b> Child level = parent level + 1.</li>
  <li><b>height(leaf) = 0</b> and <b>height(NULL) = −1</b>. Height is counted in <b>edges</b>.</li>
</ul>

<div class="fn">
  <div class="fn-name">The seven formulas</div>
  <table>
    <tr><th>#</th><th>Question</th><th>Formula</th><th>Check with a real tree</th></tr>
    <tr><td>1</td><td>Max nodes at level <i>l</i></td><td>2<sup>l</sup></td><td>Level 0 → 1 (A). Level 1 → 2 (B,C). Level 2 → 4 (D,E,F,G).</td></tr>
    <tr><td>2</td><td>Max nodes in a tree of height <i>h</i></td><td>2<sup>h+1</sup> − 1</td><td>h = 2 → 2³ − 1 = 7. The A–G tree has exactly 7.</td></tr>
    <tr><td>3</td><td>Min nodes for height <i>h</i></td><td>h + 1</td><td>h = 3 → 4 nodes. That is the stick 10-20-30-40.</td></tr>
    <tr><td>4</td><td>Min height for <i>n</i> nodes</td><td>⌈log₂(n+1)⌉ − 1</td><td>n = 7 → ⌈log₂8⌉ − 1 = 3 − 1 = <b>2</b>.</td></tr>
    <tr><td>5</td><td>Max height for <i>n</i> nodes</td><td>n − 1</td><td>n = 7 sorted inserts → height 6 (a stick).</td></tr>
    <tr><td>6</td><td>Edges</td><td>n − 1</td><td>7 nodes → 6 edges. Every non-root brings one edge.</td></tr>
    <tr><td>7</td><td>NULL (empty) child pointers</td><td>n + 1</td><td>7 nodes → 14 pointer slots, 6 used, <b>8 NULL</b>. This is what threaded trees recycle.</td></tr>
  </table>
</div>

<div class="term">
  <div class="term-name">Leaves vs internal nodes in a FULL binary tree</div>
  <p><b>Formula:</b> In a full binary tree (every node has 0 or 2 children), <b>L = I + 1</b> — leaves are one more than internal nodes. Total n = L + I = 2I + 1, so n is always <b>odd</b>.</p>
  <div class="ex"><b>Example:</b> Root 2 with leaves 1 and 3 → I = 1, L = 2. Check L = I + 1 ✓ and n = 3 (odd) ✓.<br/>
  A full tree with 4 leaves has 3 internal nodes and n = 7.<br/>
  <b>Exam question:</b> “A full binary tree has 15 nodes. How many leaves?” n = 2I + 1 → I = 7 → <b>L = 8</b>.</div>
</div>

<div class="term">
  <div class="term-name">How many different binary trees with n nodes? (Catalan number)</div>
  <p><b>Formula:</b> Number of distinct binary tree <b>shapes</b> with n nodes = Catalan number<br/>
  C<sub>n</sub> = (2n)! / ((n+1)! · n!) = <sup>2n</sup>C<sub>n</sub> / (n+1)</p>
  <p>For n <b>distinct keys</b>, the number of different <b>BSTs</b> is the same C<sub>n</sub> (the shape decides the BST, because the key placement is then forced). The number of different <b>labelled binary trees</b> is C<sub>n</sub> × n!.</p>
  <div class="ex"><b>Values to memorise:</b> C₁ = 1, C₂ = 2, C₃ = 5, C₄ = 14, C₅ = 42.<br/>
  <b>Worked:</b> n = 3 keys {1,2,3} → C₃ = 6!/(4!·3!) = 720/144 = <b>5</b> BSTs. They are: root 1 (right chain), root 3 (left chain), root 2 (balanced), root 1 with 3 then 2, root 3 with 1 then 2. All five are drawn below.</div>
</div>

<div class="term">
  <div class="term-name">Complete binary tree extras</div>
  <ul>
    <li>Height of a complete tree with n nodes = <b>⌊log₂ n⌋</b>.</li>
    <li>Number of leaves = <b>⌈n/2⌉</b>. Number of internal nodes = <b>⌊n/2⌋</b>.</li>
    <li>Array form (0-based): left = 2i+1, right = 2i+2, parent = ⌊(i−1)/2⌋. Last internal node = index <b>⌊n/2⌋ − 1</b> — that is where build-heap starts.</li>
  </ul>
  <div class="ex"><b>Example:</b> n = 7 complete tree → height ⌊log₂7⌋ = 2, leaves ⌈7/2⌉ = 4, internal ⌊7/2⌋ = 3. Build-heap starts at index ⌊7/2⌋ − 1 = 2.</div>
</div>

<div class="trap"><b>Exam trap 1:</b> If the book says “root is at level 1”, then max nodes at level l becomes 2<sup>l−1</sup> and max nodes of height h becomes 2<sup>h</sup> − 1. Always write your convention in the first line — you get the mark either way.<br/>
<b>Exam trap 2:</b> “Height = number of nodes on the longest path.” That is the <b>node-count</b> convention (= edges + 1). Using it, a leaf has height 1. Pick one, state it, stay consistent.<br/>
<b>Exam trap 3:</b> L = I + 1 holds for <b>full</b> trees only. In the company sample (C has one child) it fails: leaves D,E,F = 3, internal A,B,C = 3.</div>
`,
  },
  {
    id: 'repr',
    title: 'Representation — array (sequential) vs linked',
    body: `
<div class="law"><b>Law:</b> A tree is an idea. In memory you must pick a body for it. <b>Array</b>: position carries the parent-child relation, so you store no pointers — but holes waste memory unless the tree is complete. <b>Linked</b>: pointers carry the relation, so any shape fits — but you pay two pointers per node.</div>

<div class="term">
  <div class="term-name">1. Sequential / array representation</div>
  <p>Put the root at index 0 and fill <b>level by level, left to right</b>. Then:</p>
  <table>
    <tr><th>Relation</th><th>0-based index</th><th>1-based index</th></tr>
    <tr><td>left child of i</td><td>2i + 1</td><td>2i</td></tr>
    <tr><td>right child of i</td><td>2i + 2</td><td>2i + 1</td></tr>
    <tr><td>parent of i</td><td>⌊(i − 1)/2⌋</td><td>⌊i / 2⌋</td></tr>
  </table>
  <div class="ex"><b>Worked example — A–G tree:</b>
<pre class="tree-pic">index :  0  1  2  3  4  5  6
value :  A  B  C  D  E  F  G</pre>
  Left child of B (index 1) = 2·1+1 = 3 → D ✓. Right child of C (index 2) = 2·2+2 = 6 → G ✓. Parent of F (index 5) = ⌊4/2⌋ = 2 → C ✓.</div>
  <div class="ex"><b>The waste — skewed tree 10,20,30,40 (all right children):</b>
<pre class="tree-pic">index :  0   1   2   3   4   5   6   7   ...  14
value : 10   -  20   -   -   -  30   -   ...  40</pre>
  4 real nodes need an array of <b>15</b> slots. For height h you need 2<sup>h+1</sup> − 1 slots. That is why only <b>heaps</b> (always complete) use arrays, and search trees use pointers.</div>
</div>

<div class="term">
  <div class="term-name">2. Linked representation (the default)</div>
  <pre>struct Node {
    int data;
    struct Node *left;    /* LEFT  */
    struct Node *right;   /* RIGHT */
};</pre>
  <p>Draw every node as three boxes: <b>[ LEFT | DATA | RIGHT ]</b>. An empty side is written NULL (or crossed out).</p>
  <div class="ex"><b>Memory cost:</b> n nodes × (1 data + 2 pointers). Of those 2n pointer slots, only n − 1 point to real children, so <b>n + 1 are NULL</b> — about half the pointers are wasted. Threaded binary trees exist to reuse exactly those.</div>
</div>

<div class="fn">
  <div class="fn-name">Which one, when</div>
  <table>
    <tr><th></th><th>Array</th><th>Linked</th></tr>
    <tr><td>Extra memory</td><td>No pointers</td><td>2 pointers per node</td></tr>
    <tr><td>Holes / waste</td><td>Huge for skewed trees</td><td>None</td></tr>
    <tr><td>Insert / delete in middle</td><td>Costly (shift, recompute)</td><td>Cheap (repoint)</td></tr>
    <tr><td>Find parent</td><td>O(1) by formula</td><td>Needs a parent pointer or a walk</td></tr>
    <tr><td>Used by</td><td>Heap, heap-sort, complete trees</td><td>BST, AVL, RB, B-Tree, expression trees</td></tr>
  </table>
</div>
<div class="trap"><b>Exam trap:</b> “Array representation is always worse.” No — for a <b>heap</b> it is strictly better: O(1) parent, perfect cache locality, zero pointer memory. The array is not a compromise there, it is the design.</div>
`,
  },
  {
    id: 'general',
    title: 'General tree → binary tree (left-child right-sibling)',
    body: `
<div class="law"><b>Law:</b> Any general tree (a node may have 7 children) can be stored as a <b>binary</b> tree with zero loss, using one rule: <b>left pointer = first child, right pointer = next sibling</b>. This is the “left-child right-sibling” (LCRS) or <b>natural correspondence</b> representation.</div>
<p><b>Why we need it:</b> code for binary trees is simple (two pointers, clean recursion). A general tree would need a variable-length child array in every node. LCRS converts the hard shape into the easy shape.</p>

<div class="fn">
  <div class="fn-name">The three-step recipe</div>
  <ol>
    <li>Keep the <b>root</b> as the root.</li>
    <li>For every node, make its <b>first (leftmost) child</b> its <b>left</b> child in the binary tree.</li>
    <li>Link the remaining children as a <b>right chain</b>: second child becomes the right child of the first, third becomes the right child of the second, and so on.</li>
  </ol>
  <p>Result: a right-pointer chain always means “these are brothers and sisters”, and a left pointer always means “go one generation down”.</p>
</div>

<div class="story">
  <b>Worked example.</b> General tree: root <b>A</b> has three children <b>B, C, D</b>; B has children <b>E, F</b>; D has child <b>G</b>.
<pre class="tree-pic">General tree                LCRS binary tree
        A                        A
     /  |  \\                     /
    B   C   D                   B
   / \\      |                  / \\
  E   F     G                 E   C
                               \\    \\
                                F    D
                                    /
                                   G</pre>
  <ol>
    <li>A’s first child is B → B becomes A’s <b>left</b>.</li>
    <li>A’s other children C and D become a right chain under B: B→right = C, C→right = D.</li>
    <li>B’s first child E → B’s <b>left</b>. B’s second child F → E→right = F.</li>
    <li>D’s only child G → D’s <b>left</b>.</li>
  </ol>
  Check: from A go left once (B), then follow right pointers (C, D) — you just listed all children of A. That is the whole trick.
</div>

<div class="term">
  <div class="term-name">Forest → binary tree</div>
  <p>A <b>forest</b> is a list of trees T₁, T₂, T₃. Convert each tree with LCRS, then join the <b>roots</b> as a right chain: root(T₁)→right = root(T₂), root(T₂)→right = root(T₃).</p>
  <div class="ex"><b>Example:</b> Forest of B(D,E) and C(F). Convert: B with left D, D→right = E; C with left F. Then join B→right = C. The result is exactly the company sample tree — which is why deleting the root A of that tree gave a forest of two trees.</div>
</div>

<div class="term">
  <div class="term-name">Traversal correspondence (asked as a 2-mark question)</div>
  <table>
    <tr><th>On the general tree / forest</th><th>Equals on the LCRS binary tree</th></tr>
    <tr><td>Preorder</td><td>Preorder</td></tr>
    <tr><td>Postorder</td><td>Inorder</td></tr>
  </table>
  <p>So a general-tree postorder is computed by running <b>inorder</b> on its binary form. There is no natural “inorder” for a general tree (a node with 7 children has no single middle).</p>
</div>
<div class="trap"><b>Exam trap 1:</b> After conversion the tree usually looks <b>right-heavy and ugly</b>. That is correct, not a mistake — siblings become a chain.<br/>
<b>Exam trap 2:</b> A right pointer is <b>not</b> a child in the original tree. C is not a child of B; they are siblings. Marking C as B’s child loses the whole answer.<br/>
<b>Exam trap 3:</b> The converted tree is not a BST and is not balanced. LCRS is about <b>storage</b>, not about search.</div>
`,
  },
  {
    id: 'trav',
    title: '7. Traversals — four simple functions',
    body: `
<p><b>Concept:</b> “Visit” means print the node (or copy it, or check it). Recursion walks left and right. The only choice is <b>when</b> you visit: before the children, between them, or after them. Level-order is different: it uses a queue and goes floor by floor.</p>
<p>We use the <b>perfect A–G tree</b> in the Visualizer:</p>
<pre class="tree-pic">        A
       / \\
      B   C
     / \\ / \\
    D  E F  G</pre>

<div class="fn">
  <div class="fn-name">preorder(root) — NLR — Node first</div>
  <p><b>What it does:</b> Print the node, then go left, then go right.</p>
  <p><b>Steps:</b> if root is NULL stop; print data; preorder(left); preorder(right).</p>
  <pre>void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);   /* Node */
    preorder(root->left);        /* Left */
    preorder(root->right);       /* Right */
}</pre>
  <div class="ex"><b>Example:</b> A, then whole left (B D E), then whole right (C F G) → <b>A B D E C F G</b>. Use: copy a tree (root first, then subtrees).</div>
</div>

<div class="fn">
  <div class="fn-name">inorder(root) — LNR — Node in the middle</div>
  <p><b>What it does:</b> Finish the left subtree, print the node, then the right subtree.</p>
  <p><b>Steps:</b> if NULL stop; inorder(left); print; inorder(right).</p>
  <pre>void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);         /* Left */
    printf("%d ", root->data);   /* Node */
    inorder(root->right);        /* Right */
}</pre>
  <div class="ex"><b>Example:</b> Left of A is B-tree (D B E), then A, then C-tree (F C G) → <b>D B E A F C G</b>. On a BST this output is sorted.</div>
</div>

<div class="fn">
  <div class="fn-name">postorder(root) — LRN — Node last</div>
  <p><b>What it does:</b> Both children first, node at the end.</p>
  <p><b>Steps:</b> if NULL stop; postorder(left); postorder(right); print.</p>
  <pre>void postorder(struct Node *root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}</pre>
  <div class="ex"><b>Example:</b> D E B, then F G C, then A → <b>D E B F G C A</b>. Use: delete a tree safely (free children before parent); evaluate an expression tree.</div>
</div>

<div class="fn">
  <div class="fn-name">levelorder(root) — BFS with a queue</div>
  <p><b>What it does:</b> Print floor by floor: all of level 0, then 1, then 2.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>If root is NULL, stop.</li>
    <li>Put root in a queue.</li>
    <li>While queue is not empty: take the front node, print it, put its left child in the queue (if any), then its right child.</li>
  </ol>
  <pre>void levelorder(struct Node *root) {
    if (root == NULL) return;
    struct Node *q[100];
    int front = 0, rear = 0;
    q[rear++] = root;
    while (front &lt; rear) {
        struct Node *n = q[front++];
        printf("%d ", n->data);
        if (n->left)  q[rear++] = n->left;
        if (n->right) q[rear++] = n->right;
    }
}</pre>
  <div class="ex"><b>Example:</b> A, then B C, then D E F G → <b>A B C D E F G</b>. Same idea as BFS in graphs.</div>
</div>
<p><b>Complexity (all four):</b> each node once → time <b>Θ(n)</b>. Recursion uses O(height) stack. Level-order uses a queue of size about the widest level.</p>
`,
  },
  {
    id: 'nonrec',
    title: 'Non-recursive (iterative) traversals — bring your own stack',
    body: `
<div class="law"><b>Law:</b> Recursion is not free — the compiler keeps an invisible stack of return addresses. An iterative traversal just makes that stack <b>visible</b>. Same visits, same Θ(n) time, same O(h) space — but now you control it. This is a guaranteed exam question: “write inorder traversal without recursion”.</div>

<div class="fn">
  <div class="fn-name">1. Iterative IN-ORDER (the classic)</div>
  <p><b>Idea in one line:</b> push everything on the left edge, then pop-print-and-turn-right.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>Start with <code>cur = root</code>, empty stack.</li>
    <li>While <code>cur != NULL</code>: push cur, <code>cur = cur-&gt;left</code> (dive left).</li>
    <li>If the stack is empty → done. Else pop into cur, <b>print cur</b>.</li>
    <li>Set <code>cur = cur-&gt;right</code> and repeat from step 2.</li>
  </ol>
  <pre>void inorder_iter(struct Node *root) {
    struct Node *stack[100], *cur = root;
    int top = -1;
    while (1) {
        while (cur != NULL) {          /* dive left, remember the way */
            stack[++top] = cur;
            cur = cur-&gt;left;
        }
        if (top == -1) break;          /* nothing left to come back to */
        cur = stack[top--];            /* pop */
        printf("%d ", cur-&gt;data);      /* LEFT done → print NODE */
        cur = cur-&gt;right;              /* now the RIGHT subtree */
    }
}</pre>
  <div class="ex"><b>Dry run on 4,2,6,1,3,5,7</b> (BST built from those keys):<br/>
  Dive: push 4, push 2, push 1 → cur = NULL.<br/>
  Pop 1, print <b>1</b>, right of 1 is NULL.<br/>
  Pop 2, print <b>2</b>, go right → 3. Dive: push 3. Pop 3, print <b>3</b>.<br/>
  Pop 4, print <b>4</b>, go right → 6. Dive: push 6, push 5. Pop 5, print <b>5</b>. Pop 6, print <b>6</b>, right → 7. Push 7, pop 7, print <b>7</b>.<br/>
  Output <b>1 2 3 4 5 6 7</b> — sorted, as an inorder of a BST must be. Max stack depth = 3 = height + 1.</div>
</div>

<div class="fn">
  <div class="fn-name">2. Iterative PRE-ORDER (easiest — push right first)</div>
  <p><b>Idea:</b> a stack reverses order, so push the <b>right</b> child before the <b>left</b> child; the left then pops first.</p>
  <pre>void preorder_iter(struct Node *root) {
    struct Node *stack[100];
    int top = -1;
    if (root == NULL) return;
    stack[++top] = root;
    while (top &gt;= 0) {
        struct Node *n = stack[top--];
        printf("%d ", n-&gt;data);              /* visit on pop */
        if (n-&gt;right) stack[++top] = n-&gt;right;  /* right pushed FIRST */
        if (n-&gt;left)  stack[++top] = n-&gt;left;   /* left pops FIRST  */
    }
}</pre>
  <div class="ex"><b>On A–G:</b> push A. Pop A print A, push C then B. Pop B print B, push E then D. Pop D print D. Pop E print E. Pop C print C, push G then F. Pop F, pop G → <b>A B D E C F G</b> ✓</div>
</div>

<div class="fn">
  <div class="fn-name">3. Iterative POST-ORDER using TWO stacks (the trick answer)</div>
  <p><b>Idea:</b> Post-order is L R N. Reverse it and you get N R L — which is “preorder with left and right swapped”. So run that easy traversal into stack 2, then empty stack 2.</p>
  <pre>void postorder_iter(struct Node *root) {
    struct Node *s1[100], *s2[100];
    int t1 = -1, t2 = -1;
    if (root == NULL) return;
    s1[++t1] = root;
    while (t1 &gt;= 0) {                  /* this loop produces N R L */
        struct Node *n = s1[t1--];
        s2[++t2] = n;
        if (n-&gt;left)  s1[++t1] = n-&gt;left;
        if (n-&gt;right) s1[++t1] = n-&gt;right;
    }
    while (t2 &gt;= 0)                    /* reversing gives L R N */
        printf("%d ", s2[t2--]-&gt;data);
}</pre>
  <div class="ex"><b>On A–G:</b> s2 fills as A, C, G, F, B, E, D. Printing s2 from the top gives <b>D E B F G C A</b> ✓ — the real post-order.</div>
</div>

<div class="fn">
  <div class="fn-name">4. Level-order is already iterative (queue, not stack)</div>
  <p>There is no recursive version worth writing. Enqueue root; while the queue is non-empty, dequeue, print, enqueue left then right. Swap the stack for a queue and depth-first becomes breadth-first — that single swap is the whole difference between DFS and BFS.</p>
</div>

<div class="trap"><b>Exam trap 1:</b> In iterative <b>pre</b>-order you visit when you <b>pop</b>. In iterative <b>in</b>-order you visit when you pop too — but only after the left dive is exhausted. Writing <code>printf</code> at the wrong place silently prints preorder.<br/>
<b>Exam trap 2:</b> Push <b>right before left</b> in preorder. Reversed and your output is mirrored.<br/>
<b>Exam trap 3:</b> “Iterative saves space.” It saves the <i>function-call</i> stack, not the space: still O(h). Only <b>threaded</b> trees (or Morris traversal) reach O(1) extra space.<br/>
<b>Bonus (say this and you sound senior):</b> Morris inorder traversal builds temporary threads on the fly and runs in O(n) time with <b>O(1)</b> space — no stack, no recursion.</div>
`,
  },
  {
    id: 'ops',
    title: 'Binary tree operations — height, count, mirror, copy, LCA, diameter',
    body: `
<div class="law"><b>Law:</b> Almost every “write a function” question on trees is the same shape: <b>solve the left subtree, solve the right subtree, combine, and handle NULL as the base case</b>. Learn that skeleton once and you can derive all ten functions below in the exam hall.</div>
<pre class="tree-pic">TYPE f(node) {
    if (node == NULL) return BASE;      /* 1. base case      */
    L = f(node-&gt;left);                  /* 2. trust the left  */
    R = f(node-&gt;right);                 /* 3. trust the right */
    return COMBINE(L, R, node);         /* 4. combine         */
}</pre>
<p>All examples below use the BST built from <b>8, 3, 10, 1, 6, 14, 4, 7, 13</b> (drawn under this section).</p>

<div class="fn">
  <div class="fn-name">1. height(root) — tallest downward path</div>
  <pre>int height(struct Node *n) {
    int hl, hr;
    if (n == NULL) return -1;             /* BASE: empty is -1 */
    hl = height(n-&gt;left);
    hr = height(n-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);       /* COMBINE: taller side + 1 */
}</pre>
  <div class="ex"><b>Example (work bottom-up):</b> height(1) = height(4) = height(7) = height(13) = 0 — all leaves. height(6) = 1 + max(0, 0) = 1. height(3) = 1 + max(height(1)=0, height(6)=1) = <b>2</b>. height(14) = 1 + max(0, −1) = 1, so height(10) = 1 + max(−1, 1) = <b>2</b>. Finally height(8) = 1 + max(2, 2) = <b>3</b>.</div>
</div>

<div class="fn">
  <div class="fn-name">2. count(root) — total nodes &nbsp;·&nbsp; 3. leaves(root) &nbsp;·&nbsp; 4. internal(root)</div>
  <pre>int count(struct Node *n) {
    if (n == NULL) return 0;
    return 1 + count(n-&gt;left) + count(n-&gt;right);
}

int leaves(struct Node *n) {
    if (n == NULL) return 0;
    if (n-&gt;left == NULL &amp;&amp; n-&gt;right == NULL) return 1;
    return leaves(n-&gt;left) + leaves(n-&gt;right);
}

int internal(struct Node *n) {
    if (n == NULL || (n-&gt;left == NULL &amp;&amp; n-&gt;right == NULL)) return 0;
    return 1 + internal(n-&gt;left) + internal(n-&gt;right);
}</pre>
  <div class="ex"><b>Example:</b> count = 9. Leaves = 1, 4, 7, 13 → <b>4</b>. Internal = 8, 3, 6, 10, 14 → <b>5</b>. Check 4 + 5 = 9 ✓ (and note L ≠ I + 1 because this tree is not full — node 10 has one child).</div>
</div>

<div class="fn">
  <div class="fn-name">5. mirror(root) — swap every left and right</div>
  <p><b>What it does:</b> Turns the tree into its reflection. Pre-order of the mirror = pre-order of the original with L and R swapped. In a BST, mirroring produces a <b>reverse-sorted</b> inorder.</p>
  <pre>void mirror(struct Node *n) {
    struct Node *t;
    if (n == NULL) return;
    mirror(n-&gt;left);
    mirror(n-&gt;right);
    t = n-&gt;left;              /* swap the two pointers */
    n-&gt;left = n-&gt;right;
    n-&gt;right = t;
}</pre>
  <div class="ex"><b>Example on 2,1,3:</b> before → inorder 1 2 3. After mirror → root 2 with left 3, right 1 → inorder <b>3 2 1</b>. Both drawings are shown below.</div>
</div>

<div class="fn">
  <div class="fn-name">6. copy(root) — deep clone &nbsp;·&nbsp; 7. identical(a, b)</div>
  <pre>struct Node *copy(struct Node *n) {
    struct Node *c;
    if (n == NULL) return NULL;
    c = new_node(n-&gt;data);        /* root first → this is PRE-order */
    c-&gt;left  = copy(n-&gt;left);
    c-&gt;right = copy(n-&gt;right);
    return c;
}

int identical(struct Node *a, struct Node *b) {
    if (a == NULL &amp;&amp; b == NULL) return 1;
    if (a == NULL || b == NULL) return 0;
    return (a-&gt;data == b-&gt;data)
        &amp;&amp; identical(a-&gt;left,  b-&gt;left)
        &amp;&amp; identical(a-&gt;right, b-&gt;right);
}</pre>
  <div class="ex"><b>Why copy is pre-order:</b> you must create the parent before you can attach children to it. <b>Why delete is post-order:</b> you must free the children before you free the parent, or you lose their addresses.</div>
</div>

<div class="fn">
  <div class="fn-name">8. LCA — lowest common ancestor (BST version is beautiful)</div>
  <p><b>Idea in a BST:</b> walk down from the root. If both keys are smaller than the node, the answer is on the left. If both are bigger, go right. The moment they <b>split</b> (one smaller, one bigger, or one equals the node) — that node is the LCA.</p>
  <pre>struct Node *lca(struct Node *n, int p, int q) {
    while (n != NULL) {
        if (p &lt; n-&gt;data &amp;&amp; q &lt; n-&gt;data)      n = n-&gt;left;
        else if (p &gt; n-&gt;data &amp;&amp; q &gt; n-&gt;data) n = n-&gt;right;
        else return n;                        /* they split here */
    }
    return NULL;
}</pre>
  <div class="ex"><b>Example:</b> LCA(1, 7) on our tree: at 8 both are smaller → go left to 3. At 3, 1 &lt; 3 but 7 &gt; 3 → they split → <b>LCA = 3</b> ✓<br/>
  LCA(4, 7) → at 8 left, at 3 both bigger → right to 6. At 6 they split → <b>6</b>.<br/>
  LCA(13, 14) → at 8 both bigger → 10 → both bigger → 14; 13 &lt; 14 and 14 = 14 → <b>14</b> (a node is its own ancestor).</div>
</div>

<div class="fn">
  <div class="fn-name">9. diameter(root) — longest path between ANY two nodes</div>
  <p><b>Idea:</b> the longest path either passes <b>through</b> this node (left height + right height + 2 edges) or lies entirely inside one subtree. Take the maximum of the three.</p>
  <pre>int diameter(struct Node *n) {
    int through, dl, dr;
    if (n == NULL) return 0;
    through = height(n-&gt;left) + height(n-&gt;right) + 2;   /* edges */
    dl = diameter(n-&gt;left);
    dr = diameter(n-&gt;right);
    if (dl &gt; through) through = dl;
    if (dr &gt; through) through = dr;
    return through;
}</pre>
  <div class="ex"><b>Example:</b> Through the root 8 the path costs height(3) + height(10) + 2 = 2 + 2 + 2 = <b>6</b> edges. Inside the left subtree the best is 1–3–6–4 = 3 edges; inside the right it is 13–14–10 = 2 edges. The maximum is 6, so the diameter is the path <b>4 – 6 – 3 – 8 – 10 – 14 – 13</b>: 6 edges, 7 nodes.</div>
  <div class="trap"><b>Trap:</b> say whether you are counting <b>edges</b> or <b>nodes</b>. Node-count diameter = edge-count + 1.</div>
</div>

<div class="fn">
  <div class="fn-name">10. level of a key &nbsp;·&nbsp; print all root-to-leaf paths</div>
  <pre>int level_of(struct Node *n, int key, int level) {   /* call with level = 0 */
    int l;
    if (n == NULL) return -1;
    if (n-&gt;data == key) return level;
    l = level_of(n-&gt;left, key, level + 1);
    if (l != -1) return l;
    return level_of(n-&gt;right, key, level + 1);
}

void print_paths(struct Node *n, int path[], int len) {
    if (n == NULL) return;
    path[len++] = n-&gt;data;
    if (n-&gt;left == NULL &amp;&amp; n-&gt;right == NULL) {
        int i;
        for (i = 0; i &lt; len; i++) printf("%d ", path[i]);
        printf("\\n");
    } else {
        print_paths(n-&gt;left,  path, len);
        print_paths(n-&gt;right, path, len);
    }
}</pre>
  <div class="ex"><b>Example:</b> level_of(7) = 3 (8 → 3 → 6 → 7). Paths printed: <code>8 3 1</code>, <code>8 3 6 4</code>, <code>8 3 6 7</code>, <code>8 10 14 13</code>.</div>
</div>
<div class="law"><b>Revision line:</b> NULL returns 0 for counting, −1 for height, NULL for pointers, 1 for “identical”. Pick the base case first and the rest of the function writes itself.</div>
`,
  },
  {
    id: 'bst',
    title: '8. Binary Search Tree — full concept',
    body: `
<p><b>Definition:</b> A binary tree with a search rule. For <b>every</b> node:</p>
<ul>
  <li>every key in the <b>left subtree</b> is <b>smaller</b> than the node</li>
  <li>every key in the <b>right subtree</b> is <b>larger</b> than the node</li>
</ul>
<p>Not only the left child — the <b>whole</b> left subtree. Lecture examples keep keys unique.</p>
<div class="ex"><b>Worked example — build from 45, 15, 79, 90, 10, 55, 12, 20, 50</b>
<pre class="tree-pic">45 is root.
15 &lt; 45 → left of 45.
79 &gt; 45 → right of 45.
90 &gt; 45, 90 &gt; 79 → right of 79.
10 &lt; 45, 10 &lt; 15 → left of 15.
55 &gt; 45, 55 &lt; 79 → left of 79.
12 &lt; 45, 12 &lt; 15, 12 &gt; 10 → right of 10.
20 &lt; 45, 20 &gt; 15 → right of 15.
50 &gt; 45, 50 &lt; 79, 50 &lt; 55 → left of 55.

           45
         /    \\
       15      79
      /  \\    /  \\
    10   20  55   90
      \\     /
      12   50</pre>
In-order of this tree is 10, 12, 15, 20, 45, 50, 55, 79, 90 — sorted. That is your check.
</div>
<p><b>Why BST?</b> Array: search is fast, insert is slow. Linked list: insert is easy, search is slow. BST tries to give you both: walk one path of length about log n — if the tree stays bushy.</p>
`,
  },
  {
    id: 'bst-ops',
    title: '9. BST functions — search, insert, delete (simple)',
    body: `
<div class="fn">
  <div class="fn-name">bst_search(root, key)</div>
  <p><b>What it does:</b> Walk from the root. Equal → found. Smaller → left. Larger → right. NULL → not found.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>Start at root.</li>
    <li>While the pointer is not NULL: if key equals data, return this node; if key is smaller, go left; else go right.</li>
    <li>If you walk off the tree, return NULL.</li>
  </ol>
  <pre>struct Node *bst_search(struct Node *root, int key) {
    while (root != NULL) {
        if (key == root->data) return root;
        if (key &lt; root->data) root = root->left;
        else root = root->right;
    }
    return NULL;
}</pre>
  <div class="ex"><b>Example — search 20:</b> 20 &lt; 45 → left to 15. 20 &gt; 15 → right to 20. Equal. Found in 3 comparisons.<br/>
  <b>Search 18:</b> same path to 20, then 18 &lt; 20 → left of 20 is NULL. Not found.</div>
</div>

<div class="fn">
  <div class="fn-name">bst_insert(root, key)</div>
  <p><b>What it does:</b> Same walk as search. When you see NULL, hang a <b>new leaf</b> there. Old nodes do not move.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>If root is NULL, return new_node(key). This is the new leaf (or the first root).</li>
    <li>If key &lt; data, insert into the left subtree and attach the result to left.</li>
    <li>If key &gt; data, insert into the right subtree.</li>
    <li>If key is equal, do nothing (unique keys).</li>
    <li>Return root.</li>
  </ol>
  <pre>struct Node *bst_insert(struct Node *root, int key) {
    if (root == NULL) return new_node(key);
    if (key &lt; root->data) root->left = bst_insert(root->left, key);
    else if (key &gt; root->data) root->right = bst_insert(root->right, key);
    return root;
}</pre>
  <div class="ex"><b>Example — insert 18 into the tree above:</b> 18 &lt; 45 → 15, 18 &gt; 15 → 20, 18 &lt; 20 → left of 20 is empty. Hang 18 as left child of 20.</div>
</div>

<div class="fn">
  <div class="fn-name">bst_delete(root, key) — three cases</div>
  <p><b>What it does:</b> Find the key, then remove it without breaking the BST rule.</p>
  <p><b>Case 1 — leaf:</b> Parent’s pointer becomes NULL.</p>
  <div class="ex"><b>Example:</b> Delete 12. 12 is a leaf (right child of 10). Set 10→right = NULL.</div>
  <p><b>Case 2 — one child:</b> Replace the node by that one child.</p>
  <div class="ex"><b>Example:</b> Delete 10 while 12 is still there. 10 has only a right child 12 (no left). 15→left should now point to 12. Node 10 is gone.</div>
  <p><b>Case 3 — two children:</b> Do not pull both subtrees. Copy the <b>inorder successor</b> (smallest key in the right subtree = keep walking left). Then delete that successor (it has 0 or 1 child).</p>
  <div class="ex"><b>Example:</b> Delete 15. Right subtree of 15 starts at 20. Minimum there is 20 (20 has no left child). Copy 20 into the 15-box. Then delete the old 20 node.</div>
  <pre>struct Node *min_node(struct Node *n) {
    while (n->left != NULL) n = n->left;
    return n;
}

struct Node *bst_delete(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (key &lt; root->data) root->left = bst_delete(root->left, key);
    else if (key &gt; root->data) root->right = bst_delete(root->right, key);
    else {
        if (root->left == NULL) return root->right;   /* 0 or 1 child */
        if (root->right == NULL) return root->left;
        struct Node *s = min_node(root->right);       /* 2 children */
        root->data = s->data;
        root->right = bst_delete(root->right, s->data);
    }
    return root;
}</pre>
</div>
<p><b>Time:</b> O(h). Bushy tree ⇒ about log n. Sorted inserts ⇒ stick ⇒ O(n). Open Visualizer → BST → try search 20, insert 18, delete 12 / 10 / 15.</p>
`,
  },
  {
    id: 'avl',
    title: '10. AVL tree — balance factor (concept)',
    body: `
<p><b>Problem:</b> A BST can become a stick.</p>
<div class="ex"><b>Example:</b> Insert 10, 20, 30, 40. Each new key is larger, so it hangs on the right. Height = 3 for only 4 nodes. Searching 40 walks all four nodes — same as a list.</div>
<p><b>Definition:</b> An AVL tree is a BST where for <b>every</b> node, the heights of the two child subtrees differ by at most 1.</p>

<div class="term">
  <div class="term-name">Balance factor (BF)</div>
  <p><b>Formula:</b> BF(n) = height(left) − height(right)</p>
  <p><b>Legal values:</b> −1, 0, +1. If you see +2 or −2, the node is unbalanced and we rotate.</p>
  <p>height(NULL) = −1, so a leaf has BF = (−1) − (−1) = 0.</p>
  <div class="ex"><b>Example:</b> Node with only a left leaf child: height(left)=0, height(right)=−1, BF = 0 − (−1) = <b>+1</b> (slightly left-heavy, still legal).<br/>
  After inserting 10 then 20 then 30 as a stick: the root 10 has left height −1 and right height 1, BF = −2. Illegal. RR case.</div>
</div>
<p>AVL height stays O(log n). So search / insert / delete are <b>O(log n) even in the worst case</b>.</p>
`,
  },
  {
    id: 'rot',
    title: '11. Rotations — four cases, each with an example',
    body: `
<p><b>Concept:</b> Names: <b>z</b> = lowest unbalanced node, <b>y</b> = its taller child, <b>x</b> = next node towards the new key. A rotation lifts y (or x) and drops z. <b>In-order does not change</b> (still a BST). Only heights / BF change.</p>
<p><b>Memory trick:</b> Same letters (LL, RR) → one rotation. Different letters (LR, RL) → two. First rotate at y, then at z.</p>

<div class="fn">
  <div class="fn-name">rotate_right(z) — used for LL</div>
  <p><b>Simple picture:</b> y = z→left. y stands up. z becomes y’s right child. y’s old right subtree becomes z’s left subtree.</p>
  <pre>struct Node *rotate_right(struct Node *z) {
    struct Node *y = z-&gt;left;
    z-&gt;left = y-&gt;right;
    y-&gt;right = z;
    /* then update heights of z and y */
    return y;   /* new local root */
}</pre>
  <div class="ex"><b>LL example:</b> Insert 30, then 20, then 10. Path is left-left. z=30, y=20, x=10. One right rotation on 30. 20 becomes root, 10 left, 30 right.</div>
</div>

<div class="fn">
  <div class="fn-name">rotate_left(z) — used for RR</div>
  <p><b>Simple picture:</b> Mirror of the above. y = z→right. y stands up. z becomes y’s left child.</p>
  <pre>struct Node *rotate_left(struct Node *z) {
    struct Node *y = z-&gt;right;
    z-&gt;right = y-&gt;left;
    y-&gt;left = z;
    /* then update heights of z and y */
    return y;
}</pre>
  <div class="ex"><b>RR example:</b> Insert 10, then 20, then 30. Path is right-right. One left rotation on 10. 20 becomes root, 10 left, 30 right.</div>
</div>

<div class="term">
  <div class="term-name">LR (left-right) — two rotations</div>
  <p>Extra node is on the <b>right of the left child</b>. One right rotation on z would make it worse. First <b>left</b> rotate at y (straighten to LL), then <b>right</b> rotate at z.</p>
  <div class="ex"><b>Example:</b> Insert 30, then 10, then 20. z=30, y=10, x=20. Left rotate at 10 (20 rises), then right rotate at 30. 20 becomes the middle / local root.</div>
</div>

<div class="term">
  <div class="term-name">RL (right-left) — two rotations</div>
  <p>Mirror of LR. First <b>right</b> rotate at y, then <b>left</b> rotate at z.</p>
  <div class="ex"><b>Example:</b> Insert 10, then 30, then 20. Right rotate at 30, then left rotate at 10. 20 becomes local root.</div>
</div>
<p>Open Visualizer → AVL → buttons <b>LL demo / RR demo / LR demo / RL demo</b> and Play.</p>
`,
  },
  {
    id: 'avl-ops',
    title: '12. AVL insert (simple function)',
    body: `
<div class="fn">
  <div class="fn-name">avl_insert(n, key)</div>
  <p><b>What it does in two lines:</b> (1) BST-insert the key as a leaf. (2) On the way back up, if |BF| = 2, rotate.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>If n is NULL, return new_node(key).</li>
    <li>If key &lt; n, insert on left; if key &gt; n, insert on right.</li>
    <li>Compute BF of n.</li>
    <li>LL: BF &gt; 1 and key is in left-left → rotate_right(n).</li>
    <li>RR: BF &lt; −1 and key is in right-right → rotate_left(n).</li>
    <li>LR: BF &gt; 1 and key is in left-right → left rotate the left child, then right rotate n.</li>
    <li>RL: BF &lt; −1 and key is in right-left → right rotate the right child, then left rotate n.</li>
    <li>Otherwise return n unchanged.</li>
  </ol>
  <pre>struct Node *avl_insert(struct Node *n, int key) {
    if (n == NULL) return new_node(key);
    if (key &lt; n-&gt;data) n-&gt;left = avl_insert(n-&gt;left, key);
    else if (key &gt; n-&gt;data) n-&gt;right = avl_insert(n-&gt;right, key);
    else return n;
    int b = bf(n);
    if (b &gt; 1 &amp;&amp; key &lt; n-&gt;left-&gt;data) return rotate_right(n);          /* LL */
    if (b &lt; -1 &amp;&amp; key &gt; n-&gt;right-&gt;data) return rotate_left(n);         /* RR */
    if (b &gt; 1 &amp;&amp; key &gt; n-&gt;left-&gt;data) {
        n-&gt;left = rotate_left(n-&gt;left);
        return rotate_right(n);                                         /* LR */
    }
    if (b &lt; -1 &amp;&amp; key &lt; n-&gt;right-&gt;data) {
        n-&gt;right = rotate_right(n-&gt;right);
        return rotate_left(n);                                          /* RL */
    }
    return n;
}</pre>
  <div class="ex"><b>Example:</b> Insert 10, 20, 30. After 30, node 10 has BF = −2 and the key is on the right of the right child → RR → one left rotation. Root becomes 20. Try it in the Visualizer.</div>
</div>
<p><b>Search:</b> same while-loop as BST. Path is guaranteed short.</p>
`,
  },
  {
    id: 'avl-del',
    title: 'AVL deletion — the harder half (R0 / R1 / R−1 notation)',
    body: `
<div class="law"><b>Law:</b> AVL delete = <b>BST delete</b> first, then rebalance on the way up. The one difference from insert: an insert needs <b>at most one</b> rotation, a delete may need a rotation at <b>every ancestor</b> — up to O(log n) rotations.</div>
<p><b>Why:</b> a rotation after insert restores the subtree to its original height, so ancestors never notice. A rotation after delete can <b>shrink</b> the subtree height by 1, which can unbalance the parent, then the grandparent, and so on.</p>

<div class="term">
  <div class="term-name">The naming used in most Indian textbooks</div>
  <p>Let <b>A</b> be the lowest unbalanced node and <b>B</b> be the child on the <b>taller</b> side. Name the case by the taller side of A plus the BF of B:</p>
  <table>
    <tr><th>Case</th><th>Means</th><th>Do this</th></tr>
    <tr><td><b>L0</b></td><td>Left-heavy A, BF(B) = 0</td><td>Single <b>right</b> rotation (LL-type)</td></tr>
    <tr><td><b>L1</b></td><td>Left-heavy A, BF(B) = +1</td><td>Single <b>right</b> rotation (LL-type)</td></tr>
    <tr><td><b>L−1</b></td><td>Left-heavy A, BF(B) = −1</td><td><b>Double</b> LR: left at B, then right at A</td></tr>
    <tr><td><b>R0</b></td><td>Right-heavy A, BF(B) = 0</td><td>Single <b>left</b> rotation (RR-type)</td></tr>
    <tr><td><b>R−1</b></td><td>Right-heavy A, BF(B) = −1</td><td>Single <b>left</b> rotation (RR-type)</td></tr>
    <tr><td><b>R1</b></td><td>Right-heavy A, BF(B) = +1</td><td><b>Double</b> RL: right at B, then left at A</td></tr>
  </table>
  <p><b>One-line memory:</b> if B leans the <b>same</b> way as A (or is straight), one rotation. If B leans the <b>opposite</b> way, two rotations. Exactly the same rule as insert — only the trigger changed from “new key” to “shrunk side”.</p>
</div>

<div class="fn">
  <div class="fn-name">avl_delete(root, key) — full steps</div>
  <ol>
    <li>Normal <b>BST delete</b>: leaf → cut; one child → lift the child; two children → copy the <b>inorder successor</b>, then delete the successor from the right subtree.</li>
    <li>On the way back from recursion, <b>update the height</b> of the current node.</li>
    <li>Compute BF. If BF ∈ {−1, 0, +1}, return — nothing to do.</li>
    <li>If BF = +2 (left-heavy): look at BF of the <b>left child</b>. ≥ 0 → <code>rotate_right(node)</code>. &lt; 0 → <code>node-&gt;left = rotate_left(node-&gt;left); rotate_right(node)</code>.</li>
    <li>If BF = −2 (right-heavy): look at BF of the <b>right child</b>. ≤ 0 → <code>rotate_left(node)</code>. &gt; 0 → <code>node-&gt;right = rotate_right(node-&gt;right); rotate_left(node)</code>.</li>
    <li>Return the new subtree root and let the parent repeat steps 2–5. <b>Do not stop at the first rotation.</b></li>
  </ol>
  <pre>struct Node *avl_delete(struct Node *n, int key) {
    int b;
    if (n == NULL) return NULL;
    if (key &lt; n-&gt;data)      n-&gt;left  = avl_delete(n-&gt;left,  key);
    else if (key &gt; n-&gt;data) n-&gt;right = avl_delete(n-&gt;right, key);
    else {                                    /* found it */
        if (n-&gt;left == NULL)  { struct Node *t = n-&gt;right; free(n); return t; }
        if (n-&gt;right == NULL) { struct Node *t = n-&gt;left;  free(n); return t; }
        {   struct Node *s = n-&gt;right;        /* inorder successor */
            while (s-&gt;left) s = s-&gt;left;
            n-&gt;data  = s-&gt;data;
            n-&gt;right = avl_delete(n-&gt;right, s-&gt;data);
        }
    }
    fixh(n);                                  /* recompute height */
    b = bf(n);
    if (b &gt; 1  &amp;&amp; bf(n-&gt;left)  &gt;= 0) return rotate_right(n);            /* L0 / L1 */
    if (b &gt; 1) { n-&gt;left  = rotate_left(n-&gt;left);   return rotate_right(n); }  /* L-1 */
    if (b &lt; -1 &amp;&amp; bf(n-&gt;right) &lt;= 0) return rotate_left(n);             /* R0 / R-1 */
    if (b &lt; -1) { n-&gt;right = rotate_right(n-&gt;right); return rotate_left(n); }  /* R1 */
    return n;
}</pre>
</div>

<div class="story">
  <b>Worked example — delete 10 from the AVL built by 20, 10, 30, 25, 40, 35.</b>
  <ol>
    <li>That AVL looks like: root 30, left 20 (with right child 25), right 40 (with left child 35), and 10 as left child of 20.</li>
    <li>Delete 10: it is a leaf → cut it. Now node 20 has only a right child 25.</li>
    <li>Walk up. BF(20) = height(NULL) − height(25) = (−1) − 0 = <b>−1</b>. Legal.</li>
    <li>At node 30: left subtree (20, 25) has height 1, right subtree (40, 35) has height 1. BF = 0. Legal.</li>
    <li>Nothing to rotate. Answer: the tree stays 30 / (20 → right 25) / (40 → left 35).</li>
  </ol>
  <b>Now delete 25 as well.</b> Node 20 becomes a leaf. BF(30) = 0 − 1 = −1, still legal. But if you had deleted <b>20</b> instead, node 20 has one child 25 → 25 rises; then BF(30) = 0 − 1 = −1 — still fine. AVL delete often needs no rotation; that is why you must always <b>compute</b> BF instead of guessing.
</div>

<div class="story">
  <b>Worked example where a rotation IS needed — delete 4 from the AVL of 2, 1, 4, 3.</b>
  <ol>
    <li>The AVL is root 2, left 1, right 4, and 3 is the left child of 4.</li>
    <li>Delete 4 → it has one child 3, so 3 rises: root 2, left 1, right 3. BF(2) = 0. Balanced.</li>
    <li>Instead delete <b>1</b>: root 2 with right subtree (4 → left 3). BF(2) = (−1) − 1 = <b>−2</b> → unbalanced, right-heavy. BF of the right child 4 = height(3) − height(NULL) = 0 − (−1) = <b>+1</b> → opposite lean → case <b>R1</b> → <b>double rotation</b>: right at 4, then left at 2. Result: root 3, left 2, right 4. All BF = 0.</li>
  </ol>
</div>
<div class="trap"><b>Exam trap 1:</b> After a delete-rotation, <b>keep going up</b>. Stopping after one rotation is the most common lost mark.<br/>
<b>Exam trap 2:</b> For the two-children case you may use the inorder <b>predecessor</b> instead of the successor. Both are correct — just say which one you used, then stay consistent.<br/>
<b>Exam trap 3:</b> Insert rotations are chosen by “where the new key went”; delete rotations are chosen by “BF of the taller child”. Do not reuse the insert test.<br/>
<b>Killer fact:</b> insert ≤ 1 rotation, delete ≤ O(log n) rotations. That asymmetry is exactly why industry maps prefer Red-Black over AVL.</div>
`,
  },
  {
    id: 'multi',
    title: '13. Multiway tree and B-Tree — concept',
    body: `
<p><b>Multiway (m-way) tree:</b> A node may have up to <b>m children</b>, not only 2. Between the child pointers sit sorted keys that guide the search — same idea as BST, but wider.</p>
<div class="ex"><b>Example:</b> A node with keys 20 and 50 has three children: “&lt; 20”, “between 20 and 50”, “&gt; 50”. Search 35 goes to the middle child in one step.</div>

<div class="term">
  <div class="term-name">B-Tree of order m</div>
  <p>A multiway search tree with extra rules so it stays shallow and even:</p>
  <ol>
    <li>At most m children (at most m−1 keys) in a node.</li>
    <li>Except root and leaves, at least ⌈m/2⌉ children.</li>
    <li>Root has at least 2 children if it is not a leaf.</li>
    <li>All leaves are at the <b>same level</b>.</li>
    <li>Keys inside a node are sorted.</li>
  </ol>
  <div class="ex"><b>Example — order m = 3 (2-3 tree):</b> A node may hold at most 2 keys. A 3rd key is overflow → split. At most 3 children.</div>
</div>
<p><b>Why B-Trees:</b> One node can be one disk page. A million keys in a binary tree ≈ 20 levels (20 disk jumps). In a B-Tree with hundreds of keys per node ≈ 3 or 4 jumps. Databases use this every day.</p>
`,
  },
  {
    id: 'bsplit',
    title: '14. B-Tree insert — simple function idea',
    body: `
<div class="fn">
  <div class="fn-name">btree_insert(root, key, m)</div>
  <p><b>What it does:</b> Walk to the correct leaf, put the key in sorted order, split if the node is too full.</p>
  <p><b>Steps:</b></p>
  <ol>
    <li>From the root, pick the child whose range contains the key (like BST, but each node has several keys).</li>
    <li>Insert the key in sorted order in that leaf.</li>
    <li>If the node now has more than m−1 keys: <b>split at the median</b>. Left keys stay, right keys stay, median goes <b>up</b> to the parent.</li>
    <li>If the parent overflows, split it too.</li>
    <li>If the <b>root</b> splits, make a new root. Height grows by 1. This is the only way a B-Tree gets taller, so all leaves stay on one level.</li>
  </ol>
  <pre>/* Walk to leaf, insert in sorted order, split if overflow. Full listing: Programs tab. */
Node *btree_insert(Node *root, int key) {
    int up;
    Node *right = NULL;
    if (root == NULL) {                 /* first key the user typed */
        root = new_node(1);
        root-&gt;keys[0] = key;
        root-&gt;nkeys = 1;
        return root;
    }
    insert_rec(root, key, &amp;up, &amp;right);
    if (right) {                        /* root split → tree grows taller */
        Node *nr = new_node(0);
        nr-&gt;keys[0] = up;
        nr-&gt;nkeys = 1;
        nr-&gt;child[0] = root;
        nr-&gt;child[1] = right;
        return nr;
    }
    return root;
}</pre>
  <div class="ex"><b>Example — order 3, insert 10, 20, 5, 6:</b><br/>
  10 → root [10].<br/>
  20 → root [10 20].<br/>
  5 → root would be [5 10 20] = 3 keys = overflow. Median 10 goes up. New root [10] with children [5] and [20].<br/>
  6 → 6 &lt; 10 so go left, leaf [5] becomes [5 6]. Still 2 keys — OK.<br/>
  Play the full demo 10, 20, 5, 6, 12, 30, 7, 17 in the Visualizer B-Tree tab.
  </div>
</div>
`,
  },
  {
    id: 'bsearch',
    title: 'B-Tree search — walk the keys inside a node',
    body: `
<div class="law"><b>Law:</b> B-Tree search is BST search with an <b>extra inner loop</b>. Inside a node you scan the sorted keys to find the first key ≥ your target. If it matches, done. Otherwise you have also found <b>which child pointer</b> to follow — index <code>i</code>.</div>
<div class="fn">
  <div class="fn-name">btree_search(node, key)</div>
  <p><b>Steps:</b></p>
  <ol>
    <li>Start at the root.</li>
    <li>Set <code>i = 0</code>. While <code>i &lt; nkeys</code> and <code>key &gt; keys[i]</code>, increase i. (Now keys[i] is the first key not smaller than the target.)</li>
    <li>If <code>i &lt; nkeys</code> and <code>keys[i] == key</code> → <b>found</b>, return this node and i.</li>
    <li>If the node is a <b>leaf</b> → <b>not found</b>, return NULL.</li>
    <li>Else recurse into <code>child[i]</code> and repeat from step 2.</li>
  </ol>
  <pre>struct BNode *btree_search(struct BNode *n, int key, int *pos) {
    int i;
    while (n != NULL) {
        i = 0;
        while (i &lt; n-&gt;nkeys &amp;&amp; key &gt; n-&gt;keys[i]) i++;      /* scan inside the node */
        if (i &lt; n-&gt;nkeys &amp;&amp; n-&gt;keys[i] == key) {
            *pos = i;
            return n;                                        /* found */
        }
        if (n-&gt;leaf) return NULL;                            /* nowhere left to go */
        n = n-&gt;child[i];                                     /* descend */
    }
    return NULL;
}</pre>
  <div class="ex"><b>Example — order-3 tree built from 10, 20, 5, 6, 12, 30, 7, 17. Search 17:</b><br/>
  Root holds [10, 20]. 17 &gt; 10 so i = 1; 17 &lt; 20 so stop. keys[1] = 20 ≠ 17 → descend into child[1] (the “between 10 and 20” child).<br/>
  That node holds [12, 17]. 17 &gt; 12 so i = 1; keys[1] = 17 → <b>found</b> in 2 node visits.<br/>
  <b>Search 8:</b> root → i = 0 (8 &lt; 10) → child[0] holds [5, 6, 7]-ish. Scan: 8 &gt; every key → i = nkeys → node is a leaf → <b>not found</b>.</div>
</div>
<p><b>Cost:</b> node visits = height = O(log<sub>⌈m/2⌉</sub> n). Inside a node you do O(m) comparisons (or O(log m) with binary search). On disk only the <b>node visits</b> matter, because each visit is one page read — that is the entire reason B-Trees exist.</p>
<div class="trap"><b>Exam trap:</b> Do not write “compare with the middle key and go left or right”. A node has several keys; you must find the correct <b>gap</b> between two keys. A node with keys [10, 20] has <b>three</b> children, not two.</div>
`,
  },
  {
    id: 'bdel',
    title: 'B-Tree deletion — borrow, then merge (full cases)',
    body: `
<div class="law"><b>Law:</b> Insertion’s problem is <b>overflow</b> (too many keys) and its cure is <b>split</b>. Deletion’s problem is <b>underflow</b> (fewer than ⌈m/2⌉ − 1 keys) and its cure is, in order: <b>borrow from a sibling</b>, and only if no sibling can spare a key, <b>merge</b>. The tree gets shorter only when the <b>root</b> becomes empty.</div>
<p>For order <b>m = 3</b> (a 2-3 tree): a node may hold 1 or 2 keys. So <b>minimum keys = 1</b>. A non-root node with 0 keys has underflowed.</p>

<div class="term">
  <div class="term-name">Case 1 — key is in a LEAF that has a spare key</div>
  <p>Just delete it. No structural change.</p>
  <div class="ex"><b>Example (m = 3):</b> Leaf holds [5, 6]. Delete 6 → leaf becomes [5]. Still ≥ 1 key. Done.</div>
</div>

<div class="term">
  <div class="term-name">Case 2 — key is in an INTERNAL node</div>
  <p>You cannot leave a hole between two child pointers. So <b>replace</b> the key with its <b>inorder predecessor</b> (largest key of the left subtree) or <b>inorder successor</b> (smallest key of the right subtree), then delete <b>that</b> key from its leaf. Now you are back in the leaf cases.</p>
  <div class="ex"><b>Example:</b> Root [10] with children [5,6] and [12,20]. Delete 10 → its predecessor is 6 → put 6 in the root → delete 6 from the leaf → root [6], children [5] and [12,20].</div>
</div>

<div class="term">
  <div class="term-name">Case 3 — leaf underflows and a SIBLING has a spare key → BORROW (rotate)</div>
  <p>This is a <b>three-way rotation</b> through the parent, not a direct sibling-to-sibling move:</p>
  <ol>
    <li>The <b>parent’s separator key</b> comes <b>down</b> into the hungry node.</li>
    <li>The sibling’s nearest key (largest key of the left sibling, or smallest key of the right sibling) goes <b>up</b> to become the new separator.</li>
    <li>If the nodes are internal, the corresponding child pointer moves with the key.</li>
  </ol>
  <div class="ex"><b>Worked borrow:</b> parent [20], left child [10, 15], right child [30]. Delete 30 → right child has 0 keys → underflow. Left sibling has 2 keys → it can spare one.<br/>
  Parent key 20 moves down into the right child → right child = [20]. Left sibling’s largest key 15 moves up → parent = [15]. Result: parent [15], left [10], right [20]. All leaves still on one level ✓</div>
</div>

<div class="term">
  <div class="term-name">Case 4 — leaf underflows and NO sibling can spare → MERGE (join)</div>
  <p>Combine the hungry node, the <b>parent separator</b> pulled down, and the sibling into one node. The parent loses one key and one child pointer — which may make the <b>parent</b> underflow, so you repeat the whole check one level up.</p>
  <div class="ex"><b>Worked merge:</b> parent [20], left child [10], right child [30]. Delete 30 → right child empty, left sibling has only 1 key (cannot spare).<br/>
  Merge: pull the separator 20 down and join with [10] → single node [10, 20]. Parent now has 0 keys.<br/>
  If that parent was the <b>root</b>, delete it and make [10, 20] the new root → <b>height shrinks by 1</b>. This is the only way a B-Tree gets shorter, which is the mirror image of “height grows only when the root splits”.</div>
</div>

<div class="story">
  <b>Full dry run (m = 3).</b> Start from the tree built by inserting 10, 20, 5, 6, 12, 30:
<pre class="tree-pic">              [ 10 | 20 ]
             /      |      \\
        [5 6]     [12]     [30]</pre>
  <ol>
    <li><b>Delete 6</b> → leaf [5 6] has a spare key → becomes [5]. (Case 1)</li>
    <li><b>Delete 12</b> → leaf [12] becomes empty → underflow. Left sibling [5] has 1 key (no spare), right sibling [30] has 1 key (no spare) → <b>merge</b>. Pull separator 10 down and join with [5] → [5 10]. Root becomes [20] with children [5 10] and [30]. (Case 4)</li>
    <li><b>Delete 20</b> → 20 is in an internal node → replace with its predecessor 10 → root [10], children [5] and [30]; delete 10 from the leaf [5 10] → [5]. (Case 2 then Case 1)</li>
    <li><b>Delete 5</b> → leaf empty, sibling [30] has no spare → merge with separator 10 → [10 30]; root becomes empty → <b>drop the root</b>, tree = single node [10 30], height 0.</li>
  </ol>
</div>
<div class="trap"><b>Exam trap 1:</b> Never move a key directly from one sibling to another. It must travel <b>through the parent</b> — sibling key up, parent key down. Otherwise the separator no longer separates.<br/>
<b>Exam trap 2:</b> Always try <b>borrow before merge</b>. Merging when a borrow was possible is a wrong answer even if the final tree looks legal.<br/>
<b>Exam trap 3:</b> The <b>root</b> is allowed to have as few as 1 key (or 0 keys only when it is deleted). Do not declare the root “underflowed” at 1 key.<br/>
<b>Exam trap 4:</b> After any merge, re-check the <b>parent</b>. Underflow propagates upward exactly like overflow propagates upward on insert.</div>
`,
  },
  {
    id: 'cx',
    title: '15. Complexity — with meaning',
    body: `
<table>
  <tr><th>Structure</th><th>Search / Insert / Delete</th><th>When it is slow</th></tr>
  <tr><td>BST</td><td>O(h)</td><td>Skewed tree, h = n, so O(n)</td></tr>
  <tr><td>AVL</td><td>O(log n)</td><td>Always log n (rotations keep it bushy)</td></tr>
  <tr><td>B-Tree</td><td>O(log n) node visits</td><td>Still log n; each visit can hold many keys</td></tr>
  <tr><td>Any traversal</td><td>Θ(n)</td><td>You must touch every node</td></tr>
</table>
<div class="ex"><b>Example:</b> n = 8. Balanced height ≈ 3. Skewed height = 7. AVL refuses the height-7 shape and rotates instead.</div>
<p>new_node is O(1). Two pointers per binary node ⇒ space Θ(n).</p>
<div class="fn">
  <div class="fn-name">height / count / leaves — complete functions</div>
  <pre>int height(struct Node *n) {          /* exam: height(NULL) = -1, leaf = 0 */
    int hl, hr;
    if (n == NULL) return -1;
    hl = height(n-&gt;left);
    hr = height(n-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);
}

int count(struct Node *n) {
    if (n == NULL) return 0;
    return 1 + count(n-&gt;left) + count(n-&gt;right);
}

int leaves(struct Node *n) {
    if (n == NULL) return 0;
    if (n-&gt;left == NULL &amp;&amp; n-&gt;right == NULL) return 1;
    return leaves(n-&gt;left) + leaves(n-&gt;right);
}</pre>
</div>
`,
  },
  {
    id: 'exam',
    title: '16. How to write this in the exam (core models)',
    body: `
<ol>
  <li>Definition in one sentence, then the sample diagram.</li>
  <li>For binary node, draw LEFT | DATA | RIGHT.</li>
  <li>For a traversal, write NLR / LNR / LRN and one worked example (A–G or the given figure).</li>
  <li>For BST delete, name the case (leaf / one child / two children). For two children, show the successor.</li>
  <li>For AVL, compute BF on the path, write LL / RR / LR / RL, then draw before and after.</li>
  <li>For B-Tree, write order m, circle the median, show the split.</li>
  <li>Check: in-order of a BST must be sorted.</li>
</ol>
<p>The next sections are the <b>advanced models</b> most notes skip — heap, threads, expression, Huffman, Red-Black, trie, B+, reconstruction. Each one has a <b>Law</b> (tattoo this), a <b>Trap</b> (exam mistake), and a <b>dual picture</b> (two views of the same object).</p>
`,
  },
  {
    id: 'stack',
    title: '17. Recursion stack — what the computer actually does',
    body: `
<div class="law"><b>Law:</b> A recursive traversal is not “magic walking”. It is a <b>stack of unfinished function calls</b>. Enter a node = <b>push</b> a frame. Return = <b>pop</b>. “Visit” is a separate moment: you print, then you still have more work (the other child) sitting in the frame below.</div>
<p>Textbooks show only the printed letters: A B D E C F G. That hides the real machine. Open Visualizer → Traversals → Pre-order and watch the <b>call stack</b> grow and shrink. The printed chips are the visits. The stack frames are the ancestors that still owe you a right-child call.</p>
<div class="trap"><b>Exam trap:</b> “Space of preorder is O(1) because we only print.” Wrong. Recursion uses O(height) stack. A stick of n nodes needs n frames. Level-order does not use that stack — it uses a <b>queue</b> of the next floor.</div>
<div class="story">
  <b>Worked story on A–G (preorder):</b>
  <ol>
    <li>Call(A) — stack [A]. Print A. Must still do left of A and right of A.</li>
    <li>Call(B) — stack [A,B]. Print B.</li>
    <li>Call(D) — stack [A,B,D]. Print D. D is a leaf → return. Pop D.</li>
    <li>Back in B, go right to E. Call(E) — stack [A,B,E]. Print E. Return. Pop E, then pop B.</li>
    <li>Back in A, go right to C… and so on. Output A B D E C F G.</li>
  </ol>
  Same tree, inorder: you push A, push B, push D, then <b>print D first</b> because left is empty. The stack is identical in shape; only the print moment moved.
</div>
<p><b>Memory trick:</b> Pre = print on the way <i>down</i>. In = print at the <i>bottom of the left</i>. Post = print on the way <i>up</i>.</p>
`,
  },
  {
    id: 'expr',
    title: '18. Expression tree — the compiler’s secret',
    body: `
<div class="law"><b>Law:</b> An expression tree puts <b>operators at internal nodes</b> and <b>operands at leaves</b>. The operator acts on its two subtrees. Evaluating the tree is exactly <b>post-order</b>: finish both children, then apply the operator.</div>
<p>Human writing is infix: <code>(1+2)*3</code>. The compiler does not compute left-to-right blindly (that would do 1+2*3 = 9 if you forget precedence). It builds a tree so that <b>*</b> sits above <b>+</b>, and + sits above 1 and 2.</p>
<div class="ex"><b>Draw this every time:</b>
<pre class="tree-pic">        *
       / \\
      +   3
     / \\
    1   2</pre>
Post-order: 1, 2, +, 3, * → that is postfix <code>1 2 + 3 *</code>. A stack machine: push 1, push 2, see + so pop 2 and 1, push 3, see 3, push 3, see * pop 3 and 3, push 9.
</div>
<div class="trap"><b>Exam trap:</b> “Inorder of an expression tree is the original infix.” Almost — you must add parentheses, or 1+2*3 and (1+2)*3 have the <b>same</b> inorder letters but <b>different trees</b>. Always draw the tree, never trust the letters alone.</div>
<div class="fn">
  <div class="fn-name">Why three traversals map to three notations</div>
  <table>
    <tr><th>Traversal</th><th>Notation</th><th>On (1+2)*3</th></tr>
    <tr><td>Preorder (NLR)</td><td>Prefix</td><td>* + 1 2 3</td></tr>
    <tr><td>Inorder (LNR)</td><td>Infix</td><td>1 + 2 * 3 &nbsp;(needs parens)</td></tr>
    <tr><td>Postorder (LRN)</td><td>Postfix</td><td>1 2 + 3 *</td></tr>
  </table>
</div>
<p>Build the tree from postfix with a stack of <b>tree pointers</b>: operand → new leaf, push. Operator → pop right, pop left, make them children, push the operator node.</p>
`,
  },
  {
    id: 'huffman',
    title: '19. Huffman tree — short tickets for frequent letters',
    body: `
<div class="law"><b>Law:</b> Huffman coding builds an <b>optimal prefix-free binary code</b>. Repeatedly merge the two lightest trees. Left edge = bit 0, right edge = bit 1. The code of a letter is the path from the root to that leaf. Frequent letters stay near the root → short codes.</div>
<p><b>Prefix-free</b> means no code is the beginning of another code. So you can glue bits with no commas and still decode uniquely. Morse code is not prefix-free (you need gaps). Huffman is.</p>
<div class="story">
  <b>Worked story — A:4, B:2, C:1, D:1</b>
  <ol>
    <li>Forest of four trees: C(1) D(1) B(2) A(4).</li>
    <li>Merge lightest C and D → tree of 2. Forest: CD(2), B(2), A(4).</li>
    <li>Merge CD(2) and B(2) → tree of 4. Forest: CDB(4), A(4).</li>
    <li>Merge those two → root 8.</li>
  </ol>
  Possible codes: A = 1 (one bit!), B = 01, C and D = 000 / 001. A appears 4 times so it deserved the short ticket.
</div>
<div class="trap"><b>Exam trap 1:</b> “Huffman always gives A the shortest code.” No — only if A is the most frequent. If frequencies change, codes change.<br/>
<b>Exam trap 2:</b> Internal node labels are <b>sums of frequencies</b>, not letters. Only leaves are letters.<br/>
<b>Exam trap 3:</b> Huffman is not a BST. There is no “left &lt; right” on letters. The only order is frequency.</div>
<p>Weighted external path length = Σ freq(letter) × depth(letter). Huffman minimises this among binary prefix codes. Open Visualizer → Huffman → CLRS pack (F is so frequent it becomes a child of the root — code 0).</p>
`,
  },
  {
    id: 'heap',
    title: '20. Heap — the array IS the tree (most unique dual picture)',
    body: `
<div class="law"><b>Law:</b> A binary heap is a <b>complete</b> binary tree that is stored in an <b>array</b>, plus one extra order: in a max-heap, <b>parent ≥ both children</b>. There are no left/right pointers. Index formulas replace them: parent ⌊(i−1)/2⌋, left 2i+1, right 2i+2 (0-based).</div>
<p>This is the model nobody draws properly. Students draw a tree OR an array. The genius is they are the <b>same object</b>. Visualizer → Heap shows both, live, with the same indexes on the circles and on the cells.</p>
<div class="term">
  <div class="term-name">Two laws, not one</div>
  <p><b>Shape law (completeness):</b> fill level by level, left to right. The array has no holes. Insert = append at a[n]. Delete-max = move last into a[0] and shrink n.</p>
  <p><b>Order law (heap property):</b> parent ≥ children. After append, the new key may be too big → <b>swim / sift-up</b> (swap with parent). After extract, the new root may be too small → <b>sink / sift-down</b> (swap with the <i>larger</i> child).</p>
</div>
<div class="story">
  <b>Insert 30 into [50, 20, 40, 10]:</b>
  <ol>
    <li>Append → [50, 20, 40, 10, <b>30</b>] at index 4. Parent of 4 is ⌊3/2⌋ = 1, value 20.</li>
    <li>30 &gt; 20 → swap → [50, <b>30</b>, 40, 10, 20]. Parent of 1 is 0, value 50.</li>
    <li>30 &lt; 50 → stop. Root still 50. Tree stayed complete for free.</li>
  </ol>
</div>
<div class="trap"><b>Exam trap 1:</b> “Heap is a BST.” Never. In-order of a heap is <b>not</b> sorted. 40 can sit left of 20. Search for an arbitrary key is O(n).<br/>
<b>Exam trap 2:</b> “Extract-max walks to a leaf and deletes it.” No. Max is index 0 in O(1). You steal the last leaf to fill the hole, then sink.<br/>
<b>Exam trap 3:</b> Sinking must pick the <b>larger</b> child. If you swap with the smaller one, the other child can stay bigger than the parent — heap broken.</div>
<p><b>Why heaps exist:</b> priority queues, heap-sort, Dijkstra/Prim waiting lists. You need “give me the best, then fix in log n”, not “find 17”.</p>
<p><b>Height:</b> complete tree of n nodes has height ⌊log₂ n⌋. That is why insert/extract are O(log n) even in the worst case — the stick shape is illegal.</p>
`,
  },
  {
    id: 'sorting',
    title: 'Sorting with trees — heap sort and tree sort',
    body: `
<div class="law"><b>Law:</b> A tree can sort in two completely different ways. <b>Tree sort</b> = insert everything into a BST, then read it with <b>inorder</b>. <b>Heap sort</b> = build a max-heap, then repeatedly swap the root to the back and shrink. Tree sort needs extra memory and can degrade to O(n²); heap sort is <b>in-place</b> and <b>always</b> O(n log n).</div>

<div class="fn">
  <div class="fn-name">A. Tree sort — the two-line sorter</div>
  <p><b>Steps:</b> (1) for each input key call <code>bst_insert</code>; (2) call <code>inorder</code>. That is it.</p>
  <pre>/* read n keys from the user, then: */
for (i = 0; i &lt; n; i++) {
    scanf("%d", &amp;key);
    root = bst_insert(root, key);   /* O(h) each */
}
inorder(root);                      /* Θ(n) — prints sorted */</pre>
  <div class="ex"><b>Example:</b> keys 5, 3, 8, 1, 4 → BST root 5, left 3 (children 1, 4), right 8. Inorder = <b>1 3 4 5 8</b> ✓</div>
  <div class="trap"><b>Trap:</b> feed it <b>already sorted</b> input 1,2,3,4,5 and the BST becomes a stick: n inserts × O(n) = <b>O(n²)</b>. Tree sort is only O(n log n) on random input — or always, if you use an AVL instead of a plain BST.</div>
</div>

<div class="fn">
  <div class="fn-name">B. heapify / sink — the one function heap sort is built from</div>
  <p><b>What it does:</b> node <code>i</code> may be smaller than a child. Push it down until the heap order holds below it.</p>
  <pre>void heapify(int a[], int n, int i) {      /* max-heapify, 0-based */
    int big = i, l = 2 * i + 1, r = 2 * i + 2, t;
    if (l &lt; n &amp;&amp; a[l] &gt; a[big]) big = l;
    if (r &lt; n &amp;&amp; a[r] &gt; a[big]) big = r;   /* pick the LARGER child */
    if (big != i) {
        t = a[i]; a[i] = a[big]; a[big] = t;
        heapify(a, n, big);                /* keep sinking */
    }
}</pre>
</div>

<div class="fn">
  <div class="fn-name">C. build_heap — turn any array into a heap in O(n)</div>
  <p><b>Trick:</b> start from the <b>last internal node</b>, index <code>n/2 − 1</code>, and heapify backwards to 0. Leaves (the second half of the array) are already legal one-node heaps, so you skip them for free.</p>
  <pre>for (i = n / 2 - 1; i &gt;= 0; i--)
    heapify(a, n, i);</pre>
  <div class="ex"><b>Why O(n), not O(n log n):</b> half the nodes are leaves (0 work), a quarter sink at most 1 level, an eighth at most 2… the sum n·Σ(k/2<sup>k</sup>) converges to <b>2n</b>. Repeated <i>insertion</i> instead would cost O(n log n) — mention this and you have the full mark.</div>
</div>

<div class="fn">
  <div class="fn-name">D. heap_sort — build once, then swap-and-shrink</div>
  <p><b>Steps:</b></p>
  <ol>
    <li>Build a <b>max</b>-heap from the whole array.</li>
    <li>Swap <code>a[0]</code> (the maximum) with <code>a[n−1]</code>. The largest element is now in its final place.</li>
    <li>Shrink the heap by one (<code>n--</code>) and <code>heapify(a, n, 0)</code> to repair the root.</li>
    <li>Repeat until one element remains. Array is sorted <b>ascending</b>.</li>
  </ol>
  <pre>void heap_sort(int a[], int n) {
    int i, t;
    for (i = n / 2 - 1; i &gt;= 0; i--) heapify(a, n, i);   /* build: O(n)      */
    for (i = n - 1; i &gt; 0; i--) {                         /* n-1 extractions */
        t = a[0]; a[0] = a[i]; a[i] = t;                  /* max to the back */
        heapify(a, i, 0);                                 /* repair root     */
    }
}</pre>
  <div class="story">
    <b>Dry run on 4, 10, 3, 5, 1</b> (n = 5):
    <ol>
      <li>Build: start i = 1 → heapify at 10 (children 5, 1) — already fine. i = 0 → heapify at 4, larger child is 10 → swap → [10, 4, 3, 5, 1] → sink 4 (children 5, 1) → swap with 5 → <b>[10, 5, 3, 4, 1]</b>. Max-heap ✓</li>
      <li>Swap a[0] and a[4] → [1, 5, 3, 4, <b>10</b>]. Heapify first 4 → [5, 4, 3, 1, 10].</li>
      <li>Swap a[0] and a[3] → [1, 4, 3, <b>5</b>, 10]. Heapify first 3 → [4, 1, 3, 5, 10].</li>
      <li>Swap a[0] and a[2] → [3, 1, <b>4</b>, 5, 10]. Heapify first 2 → [3, 1, …].</li>
      <li>Swap a[0] and a[1] → <b>[1, 3, 4, 5, 10]</b> — sorted.</li>
    </ol>
  </div>
  <div class="trap"><b>Trap 1:</b> Use a <b>max</b>-heap for <b>ascending</b> order. Students reach for a min-heap and then wonder why the output is descending.<br/>
  <b>Trap 2:</b> After the swap you must heapify with the <b>reduced</b> size <code>i</code>, not <code>n</code>, otherwise the already-sorted tail gets pulled back in.<br/>
  <b>Trap 3:</b> Heap sort is <b>not stable</b>. Merge sort is. Say this if they ask for a comparison.</div>
</div>

<div class="fn">
  <div class="fn-name">E. Comparison table (learn this row by row)</div>
  <table>
    <tr><th></th><th>Tree sort (BST)</th><th>Heap sort</th></tr>
    <tr><td>Structure</td><td>Linked BST + inorder</td><td>Array as a complete tree</td></tr>
    <tr><td>Best / average</td><td>O(n log n)</td><td>O(n log n)</td></tr>
    <tr><td>Worst</td><td><b>O(n²)</b> on sorted input</td><td><b>O(n log n)</b> always</td></tr>
    <tr><td>Extra space</td><td>O(n) for nodes</td><td><b>O(1)</b> — in place</td></tr>
    <tr><td>Stable?</td><td>No</td><td>No</td></tr>
    <tr><td>Bonus</td><td>Structure stays for later searches</td><td>Also gives a priority queue</td></tr>
  </table>
</div>

<div class="term">
  <div class="term-name">F. Priority queue — the real reason heaps exist</div>
  <p>A priority queue serves the <b>highest-priority</b> item, not the oldest one. Implementations:</p>
  <table>
    <tr><th>Implementation</th><th>Insert</th><th>Extract-max</th></tr>
    <tr><td>Unsorted array</td><td>O(1)</td><td>O(n)</td></tr>
    <tr><td>Sorted array</td><td>O(n)</td><td>O(1)</td></tr>
    <tr><td><b>Binary heap</b></td><td><b>O(log n)</b></td><td><b>O(log n)</b></td></tr>
  </table>
  <div class="ex"><b>Where you have already used it:</b> Dijkstra’s shortest path and Prim’s MST pick the cheapest pending edge; an OS scheduler picks the highest-priority ready process; Huffman coding repeatedly extracts the two <b>lightest</b> trees — that is a <b>min</b>-heap doing the work.</div>
</div>
`,
  },
  {
    id: 'thread',
    title: '21. Threaded binary tree — recycling NULL',
    body: `
<div class="law"><b>Law:</b> In a binary tree most left/right pointers are NULL (about n+1 NULLs in n nodes). A <b>threaded</b> tree reuses an empty left pointer as a link to the <b>inorder predecessor</b>, and an empty right pointer as a link to the <b>inorder successor</b>. A bit (ltag/rtag) says “this is a real child” vs “this is a thread”.</div>
<p>Why bother? Inorder traversal of a threaded tree needs <b>no recursion and no stack</b>: from a node, if the right is a thread, just jump to the successor. Otherwise go to the leftmost node of the right subtree. Visualizer → Traversals → <b>Show inorder threads</b> draws those jumps as dashed curves on any tree you built.</p>
<div class="ex"><b>On the company sample</b> (inorder D, B, E, A, F, C):
<ul>
  <li>D has no left child → left thread to… nobody (D is first). Right of D is empty → thread to successor B.</li>
  <li>E’s left is empty → thread to predecessor B. E’s right empty → thread to A.</li>
  <li>F’s left empty → thread to A. F’s right empty → thread to C.</li>
</ul>
Real children stay solid: A→B, A→C, B→D, B→E, C→F.
</div>
<div class="trap"><b>Exam trap:</b> “Threads replace all pointers.” No. Only the <b>NULL</b> ones. If a node already has a left child, that pointer is a real child, not a thread. Also: threads follow <b>inorder</b>, not preorder. A preorder-threaded tree is a different (rarer) exam variant — say so if they ask.</div>
<p>Double-threaded = both left and right NULLs become threads. Single-threaded = only right NULLs (enough for inorder successor walks).</p>
`,
  },
  {
    id: 'rbtree',
    title: '22. Red-Black tree — the industry BST (not AVL)',
    body: `
<div class="law"><b>Law (5 properties):</b> (1) every node is RED or BLACK. (2) root is BLACK. (3) every NIL leaf is BLACK. (4) <b>no two reds in a row</b> (a red node’s children are black). (5) every path from a node to a descendant NIL has the <b>same number of black nodes</b> (black-height).</div>
<p><b>Mental model nobody teaches:</b> a black node is a 2-node of a 2-3-4 tree. A red node is an extra key glued onto its black parent (making a 3-node or 4-node). Recolor = split a 4-node. Rotate = restack a 3-node. That is why RB insert looks like “paint, then maybe rotate” instead of “always rotate like AVL”.</p>
<div class="term">
  <div class="term-name">Insert in three English cases</div>
  <p>Hang the new key as a <b>RED leaf</b> (BST insert). Red does not change black-height, so property 5 stays. Property 4 may break if the parent is also red. Then:</p>
  <ol>
    <li><b>Uncle is RED</b> → recolor: parent &amp; uncle BLACK, grandparent RED. Climb to grandparent. Cheap. No rotate.</li>
    <li><b>Uncle BLACK, triangle</b> (LR or RL) → rotate at the parent first, so it becomes a straight line.</li>
    <li><b>Uncle BLACK, line</b> (LL or RR) → rotate at the grandparent, paint parent BLACK, grandparent RED.</li>
  </ol>
  Finally paint the root BLACK.
</div>
<div class="story">
  <b>Insert 10, then 20, then 30:</b>
  10 black root. 20 red right of 10 — OK (parent black). 30 red right of 20 — red-red. Uncle of 30 is NIL (black), and the path is a line (RR) → left-rotate at 10, paint 20 black, 10 red. Root becomes 20 (then forced black). Same picture as AVL RR, but the <b>reason</b> was colour, not BF = −2.
</div>
<div class="trap"><b>Exam trap 1:</b> “RB is more balanced than AVL.” Opposite. AVL is stricter (|BF|≤1). RB height ≤ 2 log₂(n+1), so it can be up to ~2× taller. Insert/delete do <b>fewer rotations</b> (at most 2 on insert). That is why Java TreeMap, C++ std::map, the Linux CFS scheduler — they pick RB.<br/>
<b>Exam trap 2:</b> New node is RED, never black (except the very first root).<br/>
<b>Exam trap 3:</b> Recolor can walk all the way to the root; rotations are local.</div>
<p>Open Visualizer → Red-Black → 10, 20, 30 and the CLRS-style pack 7,3,18,10,22,8,11,26. Watch red/black paint before you memorise rotations.</p>
`,
  },
  {
    id: 'trie',
    title: '23. Trie (prefix tree) — search without comparing the whole key',
    body: `
<div class="law"><b>Law:</b> A trie stores strings so that <b>one letter lives on one edge</b> (or on the child). All words that share a prefix share the same path. Search / insert cost is <b>O(L)</b> where L is the length of <i>this</i> word — not the number of words in the dictionary.</div>
<p>BST on words compares whole strings at every node (O(L log n) in the worst case). A trie pays L and stops. Autocomplete, IP routing, dictionaries, spell-check — this is their tree.</p>
<div class="story">
  <b>Insert cat, then car, then cart, then dog:</b>
  <ol>
    <li>cat: create c → a → t, mark t as END.</li>
    <li>car: reuse c → a, then create r, mark r as END. The node a now has two children t and r.</li>
    <li>cart: reuse c → a → r, create t, mark END. Node r is both a complete word <i>and</i> a prefix of cart. That is why END is a flag, not “being a leaf”.</li>
    <li>dog: new branch d → o → g from the dummy root. No letter of cat is compared.</li>
  </ol>
</div>
<div class="trap"><b>Exam trap 1:</b> “A word is stored only at a leaf.” False. <code>car</code> and <code>cart</code> — car ends at an internal node. Always draw the END mark.<br/>
<b>Exam trap 2:</b> The dummy root holds no letter. First letters hang off it.<br/>
<b>Exam trap 3:</b> Space can be huge (up to 26 children per node). Compressed tries / radix trees glue single-child chains — that is the next-level answer if they ask “how do we save space?”</div>
<p>Visualizer → Trie. Type cat, car, cart. Watch the existing c–a path light up instead of growing a second copy. That reuse is the whole invention.</p>
`,
  },
  {
    id: 'bplus',
    title: '24. B+ Tree — what databases actually use',
    body: `
<div class="law"><b>Law:</b> A B+ Tree is a B-Tree where <b>all keys live in the leaves</b>, leaves are linked left-to-right, and internal nodes keep <b>copies</b> of keys only as signposts. Range queries (“all marks from 40 to 70”) then walk a linked list of leaves — one disk page after another — instead of jumping around the tree.</div>
<table>
  <tr><th></th><th>B-Tree</th><th>B+ Tree</th></tr>
  <tr><td>Where is the record?</td><td>In any node (internal or leaf)</td><td>Only in leaves</td></tr>
  <tr><td>Internal keys</td><td>The actual keys</td><td>Copies / separators</td></tr>
  <tr><td>Leaves</td><td>Not linked</td><td>Linked as a sorted list</td></tr>
  <tr><td>Range scan</td><td>Inorder walk of the tree</td><td>Find start leaf, then follow next pointers</td></tr>
  <tr><td>Fanout</td><td>Good</td><td>Better (internal nodes hold only keys, no records)</td></tr>
</table>
<div class="trap"><b>Exam trap:</b> “B+ is just a fatter B-Tree.” The linked leaves are the point. Also: a key may appear twice — once as a separator upstairs, once as the real record in a leaf. Deleting the record does not always delete the separator (implementations vary; say this and the examiner knows you think).</div>
<p>B-Tree of order m still matters: you must split at the median, height grows only at the root, all leaves on one level. B+ keeps those rules and adds the leaf highway. MySQL InnoDB, PostgreSQL, filesystems (NTFS, HFS+) — B+ family.</p>
`,
  },
  {
    id: 'rebuild',
    title: '25. Reconstruct a tree from two traversals',
    body: `
<div class="law"><b>Law:</b> Preorder + Inorder uniquely rebuild a binary tree. Postorder + Inorder also. Preorder + Postorder do <b>not</b> (unless the tree is full). Inorder is the spine: it tells you who is left of the root and who is right. Preorder (or postorder) tells you <b>which node is the root</b>.</div>
<div class="story">
  <b>Classic A–G:</b> Preorder = <b>A</b> B D E C F G. Inorder = D B E <b>A</b> F C G.
  <ol>
    <li>First of preorder is the root = A.</li>
    <li>In inorder, everything left of A (D B E) is the left subtree. Everything right (F C G) is the right.</li>
    <li>Next in preorder after A is B — root of the left piece. In D B E, left of B is D, right is E.</li>
    <li>After the left piece is consumed, preorder gives C — root of the right piece. In F C G, left of C is F, right is G.</li>
  </ol>
  You just rebuilt the unique tree. Draw it. Check: preorder of your drawing must match the given preorder.
</div>
<div class="trap"><b>Exam trap 1:</b> “Any two traversals fix the tree.” Pre + Post of a skewed tree is ambiguous (many shapes share them). You <b>need inorder</b> as one of the two.<br/>
<b>Exam trap 2:</b> Duplicate keys make reconstruction ambiguous. Lecture examples use unique letters.<br/>
<b>Exam trap 3:</b> Level-order + inorder also works (root is first of level-order), but they rarely ask it.</div>
<p><b>Algorithm (pre + in):</b> root = pre[0]. Split in[] at root. Recurse on left in-slice with the next |left| preorder keys, then the rest.</p>
`,
  },
  {
    id: 'apps',
    title: 'Applications of trees — the full answer sheet',
    body: `
<div class="law"><b>Law:</b> Every application below exists because the data is <b>hierarchical</b> (one-to-many) or because someone needed to <b>throw away half the search space per step</b>. If you can name the job and the law, you have the mark — a bare list of words gets half.</div>

<div class="fn">
  <div class="fn-name">1. Systems and software</div>
  <table>
    <tr><th>Where</th><th>Which tree</th><th>Why that one</th></tr>
    <tr><td>File system (folders, NTFS, ext4)</td><td>General tree / B+ Tree index</td><td>Folders nest one-to-many; B+ indexes the directory for fast lookup</td></tr>
    <tr><td>Database index (MySQL, Postgres)</td><td><b>B+ Tree</b></td><td>Fat nodes = fewer disk reads; linked leaves = fast range queries</td></tr>
    <tr><td>Compiler — parsing</td><td>Parse tree / <b>expression tree</b></td><td>Precedence lives in the shape; post-order = code generation</td></tr>
    <tr><td>Compiler — symbol table</td><td>BST / hash</td><td>Look up an identifier by name in O(log n)</td></tr>
    <tr><td>HTML / XML / JSON document</td><td>DOM tree</td><td>&lt;html&gt; is the root; tags nest, never overlap</td></tr>
    <tr><td>OS process hierarchy</td><td>General tree</td><td>Each process has exactly one parent (init / systemd is the root)</td></tr>
    <tr><td><code>std::map</code>, Java <code>TreeMap</code>, Linux CFS scheduler</td><td><b>Red-Black tree</b></td><td>O(log n) guaranteed with few rotations per update</td></tr>
    <tr><td>OS / network priority scheduling</td><td><b>Heap</b> (priority queue)</td><td>“Give me the best” in O(1), fix in O(log n)</td></tr>
  </table>
</div>

<div class="fn">
  <div class="fn-name">2. Algorithms that are secretly trees</div>
  <table>
    <tr><th>Algorithm</th><th>Tree used</th><th>The role</th></tr>
    <tr><td>Heap sort</td><td>Max-heap in an array</td><td>Extract the maximum n times, in place</td></tr>
    <tr><td>Dijkstra / Prim</td><td>Min-heap</td><td>Always expand the cheapest pending vertex/edge</td></tr>
    <tr><td>Huffman compression (ZIP, JPEG, MP3 headers)</td><td>Huffman tree</td><td>Short bit codes for frequent symbols, prefix-free</td></tr>
    <tr><td>Autocomplete, spell-check, dictionary</td><td><b>Trie</b></td><td>Cost = length of the word, not size of the dictionary</td></tr>
    <tr><td>IP routing (longest prefix match)</td><td>Radix / compressed trie</td><td>Prefixes are exactly what a trie stores</td></tr>
    <tr><td>Game playing (chess, tic-tac-toe)</td><td>Game tree + minimax</td><td>Each level is one player’s move</td></tr>
    <tr><td>Decision making / ML</td><td>Decision tree, random forest</td><td>Each internal node is a test, each leaf a class</td></tr>
    <tr><td>Blockchain, Git, IPFS</td><td>Merkle tree</td><td>One root hash verifies a whole dataset</td></tr>
    <tr><td>Range sum / range min queries</td><td>Segment tree, Fenwick tree</td><td>A node stores the answer for an interval</td></tr>
    <tr><td>Set union / Kruskal MST</td><td>Disjoint-set forest</td><td>Each set is a tree; find the root to identify the set</td></tr>
    <tr><td>Graphics / collision detection</td><td>Quadtree, Octree, BSP tree</td><td>Split space into 4 / 8 / 2 parts per level</td></tr>
  </table>
</div>

<div class="fn">
  <div class="fn-name">3. Everyday examples (use these when asked “give a real-life example”)</div>
  <ul>
    <li><b>Family tree / company chart:</b> one parent per person, one CEO at the root.</li>
    <li><b>Table of contents of a book:</b> chapters → sections → subsections.</li>
    <li><b>Tournament bracket:</b> the winner rises to the root — that is literally a “winner tree”.</li>
    <li><b>Website menu / sitemap:</b> Home → Products → Laptops.</li>
    <li><b>Mathematical expression:</b> (1 + 2) × 3.</li>
  </ul>
</div>

<div class="law"><b>Exam-ready 4-line answer:</b> “Trees are used wherever data is hierarchical or searching must be logarithmic. Hierarchy: file systems, DOM, process trees, family trees. Searching: BST / AVL / Red-Black in maps and symbol tables, B+ Trees in databases. Priority: heaps in schedulers, Dijkstra and Prim. Encoding and prefixes: Huffman for compression, tries for autocomplete.”</div>
`,
  },
  {
    id: 'solved',
    title: 'Solved exam problems — full step-by-step answers',
    body: `
<p>These are the exact question <b>patterns</b> that repeat. Read the question, cover the answer, solve it on paper, then compare. Diagrams for each one are drawn under this section.</p>

<div class="story">
  <b>Q1 (6 marks). Construct a BST from 50, 30, 70, 20, 40, 60, 80. Write all four traversals. Then delete 30 and redraw.</b>
  <p><b>Answer.</b> 50 is the root. 30 &lt; 50 → left. 70 &gt; 50 → right. 20 &lt; 50, &lt; 30 → left of 30. 40 &lt; 50, &gt; 30 → right of 30. 60 &gt; 50, &lt; 70 → left of 70. 80 &gt; 50, &gt; 70 → right of 70.</p>
<pre class="tree-pic">            50
         /       \\
       30         70
      /  \\       /  \\
    20    40   60    80</pre>
  <ul>
    <li><b>Pre (NLR):</b> 50 30 20 40 70 60 80</li>
    <li><b>In (LNR):</b> 20 30 40 50 60 70 80 &nbsp;← sorted, so the tree is correct</li>
    <li><b>Post (LRN):</b> 20 40 30 60 80 70 50</li>
    <li><b>Level:</b> 50 30 70 20 40 60 80</li>
  </ul>
  <p><b>Delete 30:</b> node 30 has <b>two</b> children → Case 3. Inorder successor = smallest key in the right subtree of 30 = <b>40</b>. Copy 40 into the 30-box, then delete the old leaf 40. New tree: 50 with left child 40 (left child 20) and right 70 (60, 80). Height drops from 2 to 2 on that side; inorder is now 20 40 50 60 70 80 ✓</p>
</div>

<div class="story">
  <b>Q2 (6 marks). Insert 10, 20, 30, 40, 50, 25 into an AVL tree. Show the balance factor and every rotation.</b>
  <p><b>Answer.</b></p>
  <ol>
    <li>Insert 10 → single node, BF 0.</li>
    <li>Insert 20 → right of 10. BF(10) = −1. Legal.</li>
    <li>Insert 30 → right of 20. BF(10) = −2, key went right-of-right → <b>RR → one left rotation at 10</b>. Root becomes 20, children 10 and 30. All BF 0.</li>
    <li>Insert 40 → right of 30. BF(30) = −1, BF(20) = 0 − 1 = −1. Legal, no rotation.</li>
    <li>Insert 50 → right of 40. BF(30) = −2 (right-of-right) → <b>RR → left rotation at 30</b>. Now 40 is the right child of 20, with children 30 and 50.</li>
    <li>Insert 25 → 25 &lt; 40, 25 &lt; 30 → left of 30. Check upward: BF(30) = +1, BF(40) = 1 − 0 = +1, BF(20) = 0 − 2 = −2 → unbalanced. The key went <b>right</b> of 20 then <b>left</b> → <b>RL → double rotation</b>: right-rotate at 40, then left-rotate at 20.</li>
  </ol>
  <p><b>Working the RL double rotation.</b> Right-rotate at 40: node 30 rises, so 30 gets right child 40, and 40 keeps 50. Then left-rotate at 20: node 30 rises to the top, 20 drops to 30’s left and adopts 25 as its right child.</p>
<pre class="tree-pic">Final AVL:
            30
         /      \\
       20        40
      /  \\         \\
    10    25         50</pre>
  <p><b>Verification (always do these two):</b> inorder = 10 20 25 30 40 50 — sorted ✓. Balance factors: BF(20) = 0 − 0 = 0, BF(40) = −1 − 0 = −1, BF(30) = 1 − 1 = 0 — every |BF| ≤ 1 ✓. Total rotations used: three (one RR, one RR, one RL double).</p>
</div>

<div class="story">
  <b>Q3 (4 marks). A binary tree has preorder A B D E C F G and inorder D B E A F C G. Construct the tree.</b>
  <p><b>Answer.</b> Preorder gives the root; inorder gives the left/right split.</p>
  <ol>
    <li>pre[0] = <b>A</b> → root. In inorder, left of A = (D B E), right of A = (F C G).</li>
    <li>Next unused preorder key = <b>B</b> → root of (D B E). Inorder splits it: left = D, right = E.</li>
    <li>Next = D → leaf. Next = E → leaf. Left subtree finished.</li>
    <li>Next = <b>C</b> → root of (F C G). Inorder splits: left = F, right = G. Both leaves.</li>
  </ol>
  <p>Result is the perfect A–G tree. <b>Verification:</b> write the preorder of your drawing — A B D E C F G ✓ matches the question.</p>
  <p><b>Follow-up they always add:</b> “Can you do it from preorder + postorder?” Answer: <b>not uniquely</b>, unless the tree is full. You need inorder as one of the two.</p>
</div>

<div class="story">
  <b>Q4 (6 marks). Insert 10, 20, 5, 6, 12, 30, 7, 17 into a B-Tree of order 3. Show every split.</b>
  <p><b>Answer.</b> Order 3 → at most 2 keys per node, at most 3 children. A 3rd key overflows and splits at the <b>median</b>.</p>
  <ol>
    <li>10 → [10]</li>
    <li>20 → [10 20]</li>
    <li>5 → would be [5 10 20] → overflow. Median <b>10</b> goes up → root [10], children [5] and [20].</li>
    <li>6 → 6 &lt; 10 → leaf [5] becomes [5 6].</li>
    <li>12 → 12 &gt; 10 → leaf [20] becomes [12 20].</li>
    <li>30 → 30 &gt; 10 → leaf [12 20 30] → overflow. Median <b>20</b> goes up → root [10 20], children [5 6], [12], [30].</li>
    <li>7 → 7 &lt; 10 → leaf [5 6 7] → overflow. Median <b>6</b> goes up → root [6 10 20] → that is 3 keys → the <b>root</b> overflows too. Median <b>10</b> goes up into a brand-new root → <b>height grows to 2</b>.</li>
    <li>17 → 17 is between 10 and 20 → goes into the leaf [12] → [12 17].</li>
  </ol>
<pre class="tree-pic">              [ 10 ]
            /        \\
        [ 6 ]        [ 20 ]
       /    \\        /     \\
    [5]     [7]  [12 17]   [30]</pre>
  <p><b>Check:</b> all leaves on the same level ✓, every node has ≤ 2 keys ✓, every non-root internal node has ≥ 2 children ✓.</p>
</div>

<div class="story">
  <b>Q5 (4 marks). Build the Huffman tree for A:5 B:9 C:12 D:13 E:16 F:45 and give each code. Compute the average code length.</b>
  <p><b>Answer.</b> Repeatedly merge the two smallest frequencies.</p>
  <ol>
    <li>5 + 9 = <b>14</b> → node(A,B). Pool: 12, 13, 14, 16, 45</li>
    <li>12 + 13 = <b>25</b> → node(C,D). Pool: 14, 16, 25, 45</li>
    <li>14 + 16 = <b>30</b> → node(AB, E). Pool: 25, 30, 45</li>
    <li>25 + 30 = <b>55</b>. Pool: 45, 55</li>
    <li>45 + 55 = <b>100</b> → root.</li>
  </ol>
  <p>Left edge = 0, right edge = 1 → F = <b>0</b> (1 bit), C = 100, D = 101, A = 1100, B = 1101, E = 111.</p>
  <p><b>Average length</b> = Σ freq × depth / Σ freq = (45·1 + 12·3 + 13·3 + 5·4 + 9·4 + 16·3) / 100 = (45 + 36 + 39 + 20 + 36 + 48)/100 = <b>2.24 bits</b> per symbol, versus 3 bits for a fixed-length code of 6 symbols — about 25 % saved.</p>
</div>

<div class="story">
  <b>Q6 (4 marks). Insert 10, 20, 5, 30 into a max-heap. Show the array after each step. Then extract the maximum.</b>
  <p><b>Answer.</b> Append at the end, then <b>swim</b> while the parent is smaller.</p>
  <ol>
    <li>10 → [10]</li>
    <li>20 → [10, 20]; parent of index 1 is index 0 → 20 &gt; 10 → swap → <b>[20, 10]</b></li>
    <li>5 → [20, 10, 5]; parent of index 2 is index 0 → 5 &lt; 20 → stop. <b>[20, 10, 5]</b></li>
    <li>30 → [20, 10, 5, 30]; parent of index 3 is index 1 (value 10) → swap → [20, 30, 5, 10]; parent of index 1 is index 0 (value 20) → swap → <b>[30, 20, 5, 10]</b></li>
  </ol>
  <p><b>Extract-max:</b> the answer is a[0] = 30. Move the last element 10 to the root and shrink → [10, 20, 5]. Sink 10: larger child is 20 → swap → <b>[20, 10, 5]</b>. Heap order restored in O(log n).</p>
</div>

<div class="story">
  <b>Q7 (3 marks). A full binary tree has 20 internal nodes. How many leaves and how many total nodes? What is its minimum possible height?</b>
  <p><b>Answer.</b> In a full binary tree L = I + 1 → <b>L = 21</b> leaves. Total n = I + L = <b>41</b> nodes. Minimum height for 41 nodes = ⌈log₂(41+1)⌉ − 1 = ⌈5.39⌉ − 1 = 6 − 1 = <b>5</b> (with height counted in edges and the root at level 0).</p>
</div>

<div class="story">
  <b>Q8 (3 marks). How many distinct binary search trees can be built from the keys 1, 2, 3, 4? List the root of each group.</b>
  <p><b>Answer.</b> Catalan C₄ = (2·4)! / (5! · 4!) = 40320 / (120 · 24) = <b>14</b> trees. Grouped by root: root 1 → C₀·C₃ = 5, root 2 → C₁·C₂ = 1·2 = 2, root 3 → C₂·C₁ = 2, root 4 → C₃·C₀ = 5. Total 5 + 2 + 2 + 5 = 14 ✓</p>
</div>

<div class="story">
  <b>Q9 (4 marks). Convert this general tree to a binary tree: A has children B, C, D; B has children E, F; D has child G.</b>
  <p><b>Answer.</b> Left pointer = first child, right pointer = next sibling.</p>
  <ul>
    <li>A → left = B. B → right = C, C → right = D (the sibling chain).</li>
    <li>B → left = E. E → right = F.</li>
    <li>D → left = G.</li>
  </ul>
  <p>Verification: starting at A, go left once then follow right pointers → B, C, D = exactly the children of A ✓. Also: postorder of the general tree = <b>inorder</b> of this binary tree.</p>
</div>

<div class="story">
  <b>Q10 (5 marks). Write a non-recursive inorder traversal and dry-run it on the BST of 4, 2, 6, 1, 3, 5, 7.</b>
  <p><b>Answer.</b> The code and the full dry run are in the “Non-recursive traversals” section above. Key points the examiner looks for: (1) an explicit stack, (2) the inner <i>dive left</i> loop, (3) <code>printf</code> after the <b>pop</b>, (4) then <code>cur = cur-&gt;right</code>, (5) loop ends when the stack is empty <b>and</b> cur is NULL. Output 1 2 3 4 5 6 7, maximum stack depth 3.</p>
</div>
`,
  },
  {
    id: 'master',
    title: '26. Master map — which tree, which universe',
    body: `
<p>Every advanced model is the same skeleton (nodes + edges, no cycles) with a <b>different law</b> bolted on. Pick the law that matches the job. This table is the last page you revise the night before the exam.</p>
<table>
  <tr><th>Job</th><th>Model</th><th>Why this one</th><th>Killer fact</th></tr>
  <tr><td>Search a key in RAM, simple code</td><td>BST</td><td>One comparison throws a side away</td><td>Sorted inserts → stick → O(n)</td></tr>
  <tr><td>Guaranteed log n, many searches</td><td>AVL</td><td>Strict |BF|≤1, shortest height</td><td>Insert ≤ 2 rotations</td></tr>
  <tr><td>Guaranteed log n, many inserts (maps)</td><td>Red-Black</td><td>Fewer rotations than AVL</td><td>std::map, TreeMap</td></tr>
  <tr><td>“Give me the maximum / highest priority”</td><td>Heap</td><td>Root is the answer in O(1)</td><td>Array, not a search tree</td></tr>
  <tr><td>Database / disk pages</td><td>B-Tree / B+</td><td>Fat nodes = fewer I/O</td><td>B+ leaves are linked</td></tr>
  <tr><td>Compress text</td><td>Huffman</td><td>Short codes for frequent letters</td><td>Prefix-free</td></tr>
  <tr><td>Autocomplete / dictionary</td><td>Trie</td><td>Time = word length</td><td>END flag ≠ leaf</td></tr>
  <tr><td>Evaluate (1+2)*3</td><td>Expression tree</td><td>Post-order is the stack machine</td><td>Operators inside, numbers at leaves</td></tr>
  <tr><td>Inorder with no stack</td><td>Threaded tree</td><td>NULL pointers become successor links</td><td>Need a tag bit</td></tr>
</table>
<div class="law"><b>One-line universe:</b> BST family answers “where is key k?”. Heap answers “what is the best?”. Huffman answers “how do I name frequent symbols cheaply?”. Trie answers “what continues this prefix?”. B-Tree answers “how do I search when one step costs a disk jump?”. If you can say that in the viva, you are done.</div>
<div class="fn">
  <div class="fn-name">Complexity tattoo</div>
  <table>
    <tr><th>Model</th><th>Search</th><th>Insert</th><th>Extra</th></tr>
    <tr><td>BST</td><td>O(h)</td><td>O(h)</td><td>h = n if skewed</td></tr>
    <tr><td>AVL / RB</td><td>O(log n)</td><td>O(log n)</td><td>RB taller, fewer rotates</td></tr>
    <tr><td>Heap</td><td>O(n) arbitrary</td><td>O(log n)</td><td>peek max O(1)</td></tr>
    <tr><td>B-Tree</td><td>O(log_m n)</td><td>O(log_m n)</td><td>m huge on disk</td></tr>
    <tr><td>Trie</td><td>O(L)</td><td>O(L)</td><td>space: alphabet × nodes</td></tr>
    <tr><td>Huffman build</td><td>—</td><td>O(n log n)</td><td>n = alphabet size</td></tr>
    <tr><td>Any walk of all nodes</td><td>Θ(n)</td><td>—</td><td>stack O(h) or queue O(w)</td></tr>
  </table>
</div>
<p>Now open <b>Visualizer</b>. For each row of this table, run one example pack. The picture in your head and the picture on the screen must become the same object.</p>
`,
  },
]

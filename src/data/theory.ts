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
<p><b>Delete (idea):</b> Do BST delete, then walk back up. Unlike insert, more than one ancestor may need a rotation.</p>
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
<p><b>Delete (idea only):</b> If the key is not in a leaf, swap with a leaf predecessor / successor (like BST). If a leaf has too few keys, first try to <b>borrow</b> from a sibling; else <b>join</b> (merge) and pull a parent key down.</p>
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

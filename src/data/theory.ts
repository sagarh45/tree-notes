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
    title: '16. How to write this in the exam',
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
<p>Then open <b>Visualizer</b> and replay the same numbers you will write in the answer book.</p>
`,
  },
]

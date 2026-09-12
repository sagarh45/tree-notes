import { Link, useSearchParams } from 'react-router-dom'
import { THEORY_FIGURES, type Fig } from '../data/figures'
import { PROGRAMS } from '../data/programs'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { withBalanceFactors } from '../lib/binaryTree'

type TopicId =
  | 'definition'
  | 'traversal'
  | 'linked'
  | 'binary-ops'
  | 'bst-ops'
  | 'multiway'
  | 'btree'
  | 'avl'

const TOPIC_LABELS: Record<TopicId, string> = {
  definition: 'Definition',
  traversal: 'Traversal',
  linked: 'Linked Implementation',
  'binary-ops': 'Binary Tree Operations',
  'bst-ops': 'BST Operations',
  multiway: 'Multiway Trees',
  btree: 'B-Trees',
  avl: 'AVL Tree & Rotations',
}

const TOPICS = Object.keys(TOPIC_LABELS) as TopicId[]

function isTopic(value: string | null): value is TopicId {
  return !!value && TOPICS.includes(value as TopicId)
}

function FigureView({ fig }: { fig: Fig }) {
  if (fig.btree) return <BTreeSvg root={fig.btree} compact />
  return (
    <BinaryTreeSvg
      root={fig.showBf ? withBalanceFactors(fig.root ?? null) : (fig.root ?? null)}
      marks={fig.marks}
      tags={fig.tags}
      showBf={fig.showBf}
      showColor={fig.showColor}
      showIndex={fig.showIndex}
      showNulls={fig.showNulls}
      edgeLabels={fig.edgeLabels}
      threads={fig.threads}
      compact
    />
  )
}

function figures(key: string, take = 2) {
  return (THEORY_FIGURES[key] ?? []).slice(0, take)
}

function matchFigure(key: string, text: string) {
  return (THEORY_FIGURES[key] ?? []).find((f) => f.title.toLowerCase().includes(text.toLowerCase()))
}

function Visuals({ items, note }: { items: Fig[]; note?: string }) {
  if (!items.length) return null
  return (
    <section className="topic-block visual-block">
      <div className="block-kicker">VISUALIZATION + REAL TRACE</div>
      {note ? <p className="trace-note">{note}</p> : null}
      <div className="topic-visual-grid">
        {items.map((fig, index) => (
          <figure className="topic-figure" key={`${fig.title}-${index}`}>
            <figcaption><b>Example {index + 1}:</b> {fig.title}</figcaption>
            <FigureView fig={fig} />
            <p>{fig.caption}</p>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Code({ title, code }: { title: string; code: string }) {
  return (
    <section className="topic-block code-block">
      <div className="block-kicker">C PROGRAM / FUNCTION</div>
      <h4>{title}</h4>
      <pre>{code}</pre>
    </section>
  )
}

function CompleteProgram({ id }: { id: string }) {
  const p = PROGRAMS.find((x) => x.id === id)
  if (!p) return null
  return (
    <details className="topic-program">
      <summary>Complete C Program: {p.title}</summary>
      <p>{p.blurb}</p>
      <pre>{p.code}</pre>
    </details>
  )
}

function Flow({ children }: { children: React.ReactNode }) {
  return <div className="topic-flow">{children}</div>
}

function TopicHeader({ no, title, syllabus }: { no: number; title: string; syllabus: string }) {
  return (
    <section className="topic-hero">
      <div className="hero-kicker">SYLLABUS POINT {no}</div>
      <h2>{title}</h2>
      <p><b>Official syllabus:</b> {syllabus}</p>
      <div className="topic-learning-path">Theory → Algorithm / Steps → Visualization → Worked Trace → C Program</div>
    </section>
  )
}

function DefinitionTopic() {
  const items = [...figures('intro', 2), ...figures('shapes', 4)]
  return (
    <>
      <TopicHeader no={1} title="Tree Definition and Basic Concepts" syllabus="Definition" />
      <section className="topic-block">
        <div className="block-kicker">THEORY</div>
        <p><b>Tree:</b> A tree is a non-linear hierarchical data structure made of nodes connected by edges. One node is the <b>root</b>. Every other node has exactly one parent and there is no cycle.</p>
        <div className="topic-law"><b>Core rule:</b> A tree with <b>n</b> nodes has exactly <b>n - 1</b> edges.</div>
        <div className="topic-two-col">
          <div>
            <h4>Important terminology</h4>
            <ul>
              <li><b>Root:</b> topmost node.</li>
              <li><b>Parent / Child:</b> directly connected upper and lower nodes.</li>
              <li><b>Sibling:</b> nodes having the same parent.</li>
              <li><b>Leaf:</b> node with no children.</li>
              <li><b>Internal node:</b> node having at least one child.</li>
              <li><b>Degree:</b> number of children of a node.</li>
              <li><b>Depth / Level:</b> distance from root.</li>
              <li><b>Height:</b> longest path from the node to a leaf.</li>
              <li><b>Subtree:</b> a node with all descendants below it.</li>
            </ul>
          </div>
          <div>
            <h4>Binary Tree</h4>
            <p>A binary tree is a tree in which every node has at most two children called <b>left child</b> and <b>right child</b>.</p>
            <ul>
              <li><b>Full:</b> every node has 0 or 2 children.</li>
              <li><b>Complete:</b> levels fill left to right.</li>
              <li><b>Perfect:</b> every level is completely full.</li>
              <li><b>Skewed:</b> each node has one child.</li>
            </ul>
          </div>
        </div>
        <Flow><b>Teaching order:</b> Draw root → add children → identify parent/child/sibling → mark leaves → count level/depth → find height → classify tree shape.</Flow>
      </section>
      <Visuals items={items} note="Use the first tree to label root, child, sibling and leaf. Then compare full, complete, perfect and skewed shapes." />
      <Code title="Minimum binary-tree node structure" code={`struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};`} />
    </>
  )
}

function TraversalTopic() {
  const main = matchFigure('trav', 'Tree for Ex1')
  const letters = matchFigure('trav', 'letters A–G')
  const skewed = matchFigure('trav', 'skewed')
  const visualItems = [main, letters, skewed].filter(Boolean) as Fig[]
  return (
    <>
      <TopicHeader no={2} title="Tree Traversal" syllabus="Traversal" />
      <section className="topic-block">
        <div className="block-kicker">THEORY</div>
        <p><b>Traversal</b> means visiting every node exactly once in a systematic order.</p>
        <table>
          <thead><tr><th>Traversal</th><th>Rule</th><th>Memory line</th></tr></thead>
          <tbody>
            <tr><td>Preorder</td><td>Root → Left → Right</td><td>Root first</td></tr>
            <tr><td>Inorder</td><td>Left → Root → Right</td><td>Root in the middle</td></tr>
            <tr><td>Postorder</td><td>Left → Right → Root</td><td>Root last</td></tr>
            <tr><td>Level order</td><td>Level by level</td><td>Use queue</td></tr>
          </tbody>
        </table>
      </section>

      <section className="topic-block sub-concept">
        <h3>2.1 Preorder</h3>
        <p><b>Theory:</b> Process root before both subtrees.</p>
        <Flow><b>Steps:</b> Visit root → preorder(left) → preorder(right).</Flow>
        <p><b>Trace:</b> For 4,2,6,1,3,5,7 → <b>4 2 1 3 6 5 7</b>.</p>
        <Code title="Preorder" code={`void preorder(struct Node *root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>2.2 Inorder</h3>
        <p><b>Theory:</b> Process left subtree, then root, then right subtree. For a BST, inorder output is sorted.</p>
        <Flow><b>Steps:</b> inorder(left) → visit root → inorder(right).</Flow>
        <p><b>Trace:</b> For 4,2,6,1,3,5,7 → <b>1 2 3 4 5 6 7</b>.</p>
        <Code title="Inorder" code={`void inorder(struct Node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>2.3 Postorder</h3>
        <p><b>Theory:</b> Process both child subtrees before the parent.</p>
        <Flow><b>Steps:</b> postorder(left) → postorder(right) → visit root.</Flow>
        <p><b>Trace:</b> For 4,2,6,1,3,5,7 → <b>1 3 2 5 7 6 4</b>.</p>
        <Code title="Postorder" code={`void postorder(struct Node *root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>2.4 Level Order</h3>
        <p><b>Theory:</b> Visit nodes level by level. A queue stores nodes waiting to be processed.</p>
        <Flow><b>Steps:</b> Enqueue root → dequeue node → visit → enqueue left/right children → repeat.</Flow>
        <p><b>Trace:</b> For 4,2,6,1,3,5,7 → <b>4 2 6 1 3 5 7</b>.</p>
        <Code title="Level order" code={`void levelorder(struct Node *root) {
    struct Node *q[100];
    int front = 0, rear = 0;
    if (root == NULL) return;
    q[rear++] = root;
    while (front < rear) {
        struct Node *cur = q[front++];
        printf("%d ", cur->data);
        if (cur->left) q[rear++] = cur->left;
        if (cur->right) q[rear++] = cur->right;
    }
}`} />
      </section>

      <Visuals items={visualItems} note="Run the same tree through all four traversal rules. Students should point to every visited node while saying the rule aloud." />
      <CompleteProgram id="trav-user" />
      <div className="topic-tools"><Link to="/lab" className="btn play">Open Traversal Visualizer</Link></div>
    </>
  )
}

function LinkedTopic() {
  const visualItems = [...figures('repr', 4), ...figures('binary', 1)]
  return (
    <>
      <TopicHeader no={3} title="Linked Implementation of Binary Tree" syllabus="Linked implementation" />
      <section className="topic-block">
        <div className="block-kicker">THEORY</div>
        <p>In linked representation, every node stores three logical fields:</p>
        <div className="node-memory-box">LEFT POINTER&nbsp;&nbsp;|&nbsp;&nbsp;DATA&nbsp;&nbsp;|&nbsp;&nbsp;RIGHT POINTER</div>
        <ul>
          <li><b>LEFT</b> stores the address of the left child.</li>
          <li><b>DATA</b> stores the value.</li>
          <li><b>RIGHT</b> stores the address of the right child.</li>
          <li>A missing child is represented by <b>NULL</b>.</li>
        </ul>
        <Flow><b>Creation flow:</b> malloc memory → assign data → set left = NULL → set right = NULL → connect returned pointer to its parent.</Flow>
      </section>
      <Visuals items={visualItems} note="The drawing and the C structure represent the same object: data plus two child addresses." />
      <Code title="Create one linked node" code={`struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int value) {
    struct Node *p = (struct Node *)malloc(sizeof(struct Node));
    p->data = value;
    p->left = NULL;
    p->right = NULL;
    return p;
}`} />
    </>
  )
}

function BinaryOpsTopic() {
  const visualItems = [...figures('binary', 3)]
  return (
    <>
      <TopicHeader no={4} title="Operations on Binary Trees" syllabus="operations on Binary Trees: insert, delete, search operations" />
      <section className="topic-block">
        <div className="block-kicker">CORE IDEA</div>
        <p>A normal binary tree has <b>no sorted search rule</b>. Therefore insert, search and delete are different from BST operations.</p>
      </section>

      <section className="topic-block sub-concept">
        <h3>4.1 Insert in Binary Tree</h3>
        <p><b>Method used here:</b> level-order insertion. Place the new node in the first empty child position from left to right.</p>
        <Flow>Empty tree → new node becomes root. Otherwise BFS with queue → first NULL left/right link gets the new node.</Flow>
        <Code title="Level-order insertion" code={`struct Node *insertBT(struct Node *root, int x) {
    struct Node *q[100];
    int f = 0, r = 0;
    if (root == NULL) return createNode(x);
    q[r++] = root;
    while (f < r) {
        struct Node *cur = q[f++];
        if (cur->left == NULL) {
            cur->left = createNode(x);
            return root;
        }
        q[r++] = cur->left;
        if (cur->right == NULL) {
            cur->right = createNode(x);
            return root;
        }
        q[r++] = cur->right;
    }
    return root;
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>4.2 Search in Binary Tree</h3>
        <p>Because keys are not ordered, the algorithm may need to visit every node. Worst-case time is <b>O(n)</b>.</p>
        <Flow>Compare root → if found stop → search left subtree → if not found search right subtree.</Flow>
        <Code title="Binary Tree search" code={`struct Node *searchBT(struct Node *root, int key) {
    if (root == NULL) return NULL;
    if (root->data == key) return root;
    struct Node *p = searchBT(root->left, key);
    if (p != NULL) return p;
    return searchBT(root->right, key);
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>4.3 Delete from Binary Tree</h3>
        <p>A common general-binary-tree method is to replace the target value with the <b>deepest-rightmost node</b>, then remove that deepest node.</p>
        <Flow>Find target → find deepest-rightmost node using level order → copy its value into target → disconnect deepest node → free it.</Flow>
        <Code title="Deletion core idea" code={`target->data = deepest->data;
if (deepestParent->left == deepest)
    deepestParent->left = NULL;
else
    deepestParent->right = NULL;
free(deepest);`} />
      </section>

      <Visuals items={visualItems} note="Use the same tree for all three operations so students can see that a normal binary tree does not compare smaller/greater values to choose a branch." />
    </>
  )
}

function BstTopic() {
  const insertFig = matchFigure('bst-ops', 'After inserting 18')
  const search20 = matchFigure('bst-ops', 'Search 20')
  const leaf = matchFigure('bst-ops', 'Delete-leaf')
  const one = matchFigure('bst-ops', 'One-child')
  const two = matchFigure('bst-ops', 'Two-child')
  return (
    <>
      <TopicHeader no={5} title="Binary Search Tree Operations" syllabus="Binary Search Trees: insert, delete, search operations" />
      <section className="topic-block">
        <div className="block-kicker">BST THEORY</div>
        <p>For every node in a Binary Search Tree:</p>
        <div className="topic-law"><b>LEFT SUBTREE &lt; ROOT &lt; RIGHT SUBTREE</b></div>
        <p>Search, insert and delete take <b>O(h)</b>, where h is height. A balanced BST is about O(log n); a skewed BST can become O(n).</p>
        <Visuals items={figures('bst', 3)} />
      </section>

      <section className="topic-block sub-concept">
        <h3>5.1 Insert</h3>
        <p>Compare the new key with the current node. Smaller goes left, larger goes right, until a NULL link is found.</p>
        <Flow><b>Trace:</b> Insert 18 in 45,15,79,10,20... → 18 &lt; 45 → 18 &gt; 15 → 18 &lt; 20 → insert left of 20.</Flow>
        {insertFig ? <Visuals items={[insertFig]} /> : null}
        <Code title="BST insert" code={`struct Node *insertBST(struct Node *root, int key) {
    if (root == NULL) return createNode(key);
    if (key < root->data)
        root->left = insertBST(root->left, key);
    else if (key > root->data)
        root->right = insertBST(root->right, key);
    return root;
}`} />
      </section>

      <section className="topic-block sub-concept">
        <h3>5.2 Search</h3>
        <Flow>Equal → found. Smaller → go left. Larger → go right.</Flow>
        <p><b>Trace:</b> Search 20 → 20 &lt; 45 → go 15 → 20 &gt; 15 → go 20 → found.</p>
        {search20 ? <Visuals items={[search20]} /> : null}
        <CompleteProgram id="search-user" />
      </section>

      <section className="topic-block sub-concept">
        <h3>5.3 Delete</h3>
        <div className="topic-three-cases">
          <div><b>Case 1: Leaf</b><span>Remove directly.</span></div>
          <div><b>Case 2: One child</b><span>Connect parent to the existing child.</span></div>
          <div><b>Case 3: Two children</b><span>Use inorder successor, then delete the successor.</span></div>
        </div>
        <Flow>Find node → count children → choose leaf / one-child / two-child case → preserve BST ordering.</Flow>
        <Visuals items={[leaf, one, two].filter(Boolean) as Fig[]} />
        <CompleteProgram id="delete-user" />
      </section>
      <div className="topic-tools"><Link to="/lab" className="btn play">Open BST Visualizer</Link></div>
    </>
  )
}

function MultiwayTopic() {
  return (
    <>
      <TopicHeader no={6} title="Multiway Trees" syllabus="Multiway Trees" />
      <section className="topic-block">
        <div className="block-kicker">THEORY</div>
        <p>A <b>multiway tree</b> allows a node to have more than two children. A node may also hold several ordered keys that separate child ranges.</p>
        <div className="topic-two-col">
          <div>
            <h4>Binary Tree</h4>
            <p>At most two child pointers per node.</p>
          </div>
          <div>
            <h4>Multiway Tree</h4>
            <p>Three, four or many child pointers depending on its order.</p>
          </div>
        </div>
        <Flow>More children per node → smaller height → fewer node accesses. This idea leads directly to B-Trees.</Flow>
      </section>
      <Visuals items={figures('multi', 3)} note="The separator keys divide the search space into multiple ranges instead of only left and right." />
      <Code title="Order-4 multiway node" code={`#define M 4
struct MNode {
    int keyCount;
    int keys[M - 1];
    struct MNode *child[M];
};`} />
    </>
  )
}

function BTreeTopic() {
  return (
    <>
      <TopicHeader no={7} title="B-Trees" syllabus="B trees" />
      <section className="topic-block">
        <div className="block-kicker">THEORY + PROPERTIES</div>
        <p>A <b>B-Tree</b> is a balanced multiway search tree designed to keep height small, especially for storage systems.</p>
        <ul>
          <li>Keys inside a node are sorted.</li>
          <li>A node with k keys can have k + 1 children.</li>
          <li>All leaves remain at the same level.</li>
          <li>Overflow is handled by splitting the node and promoting a middle key.</li>
        </ul>
      </section>

      <section className="topic-block sub-concept">
        <h3>7.1 Search</h3>
        <Flow>Scan keys inside current node → if found stop → otherwise choose the child range → repeat.</Flow>
        <p><b>Trace:</b> Search 17 in the worked order-3 example → inspect root separators → choose middle child → find 17 in that node.</p>
        <Visuals items={figures('bsearch', 2)} />
        <CompleteProgram id="bsearch-user" />
      </section>

      <section className="topic-block sub-concept">
        <h3>7.2 Insert and Split</h3>
        <Flow>Find correct leaf → insert key in sorted order → if overflow, split → promote median → continue upward if parent overflows.</Flow>
        <p><b>Trace:</b> Order 3, insert 10, 20, 5. [10,20] receives 5 → [5,10,20] overflows → promote 10 → children [5] and [20].</p>
        <Visuals items={figures('bsplit', 4)} />
        <CompleteProgram id="btree-user" />
      </section>
      <div className="topic-tools"><Link to="/lab" className="btn play">Open B-Tree Visualizer</Link></div>
    </>
  )
}

function AvlTopic() {
  const rr = matchFigure('rot', 'RR result')
  const ll = matchFigure('rot', 'LL result')
  const lr = matchFigure('rot', 'LR result')
  const rl = matchFigure('rot', 'RL result')
  return (
    <>
      <TopicHeader no={8} title="AVL Tree: Single and Double Rotations" syllabus="AVL Tree: Single and Double rotation of AVL Trees" />
      <section className="topic-block">
        <div className="block-kicker">AVL THEORY</div>
        <p>An <b>AVL tree</b> is a self-balancing Binary Search Tree.</p>
        <div className="topic-law"><b>Balance Factor (BF) = height(left) - height(right)</b></div>
        <p>For every node, BF must be <b>-1, 0 or +1</b>. BF +2 or -2 means the subtree must be rebalanced.</p>
        <Flow>Insert like BST → update heights while returning upward → compute BF → identify LL / RR / LR / RL → rotate.</Flow>
        <Visuals items={[...figures('avl', 4), ...figures('avl-ops', 2)]} />
      </section>

      <section className="topic-block sub-concept rotation-card">
        <h3>8.1 LL Case — Single Right Rotation</h3>
        <p>Insert <b>30, 20, 10</b>. Node 30 becomes left-left heavy.</p>
        <Flow>LL → one <b>right rotation</b> at the unbalanced node.</Flow>
        {ll ? <Visuals items={[ll]} /> : null}
      </section>

      <section className="topic-block sub-concept rotation-card">
        <h3>8.2 RR Case — Single Left Rotation</h3>
        <p>Insert <b>10, 20, 30</b>. Node 10 becomes right-right heavy.</p>
        <Flow>RR → one <b>left rotation</b> at the unbalanced node.</Flow>
        {rr ? <Visuals items={[rr]} /> : null}
      </section>

      <section className="topic-block sub-concept rotation-card">
        <h3>8.3 LR Case — Double Rotation</h3>
        <p>Insert <b>30, 10, 20</b>. The new key enters the right side of the left child.</p>
        <Flow>LR → left rotation on left child → right rotation on unbalanced node.</Flow>
        {lr ? <Visuals items={[lr]} /> : null}
      </section>

      <section className="topic-block sub-concept rotation-card">
        <h3>8.4 RL Case — Double Rotation</h3>
        <p>Insert <b>10, 30, 20</b>. The new key enters the left side of the right child.</p>
        <Flow>RL → right rotation on right child → left rotation on unbalanced node.</Flow>
        {rl ? <Visuals items={[rl]} /> : null}
      </section>

      <Code title="Rotation decision" code={`if (balance > 1 && key < root->left->data)
    return rotateRight(root);                 // LL

if (balance < -1 && key > root->right->data)
    return rotateLeft(root);                  // RR

if (balance > 1 && key > root->left->data) { // LR
    root->left = rotateLeft(root->left);
    return rotateRight(root);
}

if (balance < -1 && key < root->right->data) { // RL
    root->right = rotateRight(root->right);
    return rotateLeft(root);
}`} />
      <CompleteProgram id="avl-user" />
      <div className="topic-tools"><Link to="/lab" className="btn play">Open AVL Rotation Visualizer</Link></div>
    </>
  )
}

const RENDERERS: Record<TopicId, () => React.JSX.Element> = {
  definition: DefinitionTopic,
  traversal: TraversalTopic,
  linked: LinkedTopic,
  'binary-ops': BinaryOpsTopic,
  'bst-ops': BstTopic,
  multiway: MultiwayTopic,
  btree: BTreeTopic,
  avl: AvlTopic,
}

export function CoursePage() {
  const [params] = useSearchParams()
  const raw = params.get('topic')
  const topic: TopicId = isTopic(raw) ? raw : 'definition'
  const Current = RENDERERS[topic]

  return (
    <div className="course-page">
      <div className="course-context-row">
        <div>
          <span>Unit IV · Trees · 7 Hours</span>
          <b>{TOPIC_LABELS[topic]}</b>
        </div>
        <div className="course-mini-tools">
          <Link to="/practice">Practice</Link>
          <Link to="/revise">Revision</Link>
        </div>
      </div>
      <Current />
    </div>
  )
}

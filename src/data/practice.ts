export type Mcq = {
  id: string
  q: string
  options: string[]
  answer: number
  explain: string
}

export type TF = { id: string; q: string; answer: boolean; explain: string }
export type Fib = { id: string; q: string; answer: string; explain: string; alts?: string[] }

export const MCQS: Mcq[] = [
  {
    id: 'm1',
    q: 'A tree with n nodes has how many edges?',
    options: ['n', 'n − 1', 'n + 1', '2n'],
    answer: 1,
    explain: 'Every node except the root brings one edge.',
  },
  {
    id: 'm2',
    q: 'In a binary tree, a node with only a right child is',
    options: ['Illegal', 'The same as only-left', 'Allowed — left and right are different slots', 'Converted to a list'],
    answer: 2,
    explain: 'Binary trees are ordered. Empty left + occupied right is a real shape.',
  },
  {
    id: 'm3',
    q: 'Post-order of root A, left B, right C (both leaves) is',
    options: ['A B C', 'B A C', 'B C A', 'A C B'],
    answer: 2,
    explain: 'Left, right, node → B, C, then A.',
  },
  {
    id: 'm4',
    q: 'In-order traversal of a BST visits keys',
    options: ['Largest first', 'In sorted order', 'By level', 'Randomly'],
    answer: 1,
    explain: 'LNR on a BST is sorted. That is the fastest check of a drawing.',
  },
  {
    id: 'm5',
    q: 'Worst-case search in a BST of n nodes is O(n) when',
    options: ['The tree is perfect', 'The tree is skewed (e.g. sorted inserts)', 'You use level-order', 'Every BF is 0'],
    answer: 1,
    explain: 'Height becomes n−1. AVL forbids that shape.',
  },
  {
    id: 'm6',
    q: 'BST delete of a node with two children copies',
    options: ['The root', 'A random leaf', 'The inorder successor (min of right subtree)', 'The parent'],
    answer: 2,
    explain: 'Walk left in the right subtree. Then delete that successor.',
  },
  {
    id: 'm7',
    q: 'AVL balance factor is',
    options: ['left − right keys', 'height(left) − height(right)', 'n − 1', 'degree'],
    answer: 1,
    explain: 'Legal values are −1, 0, +1. height(NULL) = −1.',
  },
  {
    id: 'm8',
    q: 'BF = −2 means the node is',
    options: ['Left-left case', 'Right-heavy (RR or RL)', 'Perfect', 'A leaf'],
    answer: 1,
    explain: 'Negative BF → right side taller. Look at the right child to choose RR vs RL.',
  },
  {
    id: 'm9',
    q: 'LL imbalance is fixed by',
    options: ['One left rotation', 'One right rotation', 'Two left rotations', 'Deleting the root'],
    answer: 1,
    explain: 'Matching letters: LL → one right rotation at z.',
  },
  {
    id: 'm10',
    q: 'A B-Tree split promotes',
    options: ['The smallest key', 'The median key', 'The root only', 'All leaves'],
    answer: 1,
    explain: 'Left keys stay, right keys stay, median goes to the parent.',
  },
  {
    id: 'm11',
    q: 'B-Tree of order m = 3 allows at most how many keys in a node?',
    options: ['3', '2', '1', '4'],
    answer: 1,
    explain: 'At most m−1 keys, so 2. A 3rd key overflows.',
  },
  {
    id: 'm12',
    q: 'Level-order traversal uses a',
    options: ['Stack', 'Queue', 'Only recursion', 'Hash table'],
    answer: 1,
    explain: 'BFS: dequeue a node, enqueue its children.',
  },
  {
    id: 'm13',
    q: 'In a 0-based max-heap array, the parent of index i is',
    options: ['2i', '2i+1', '⌊(i−1)/2⌋', 'i−1 always'],
    answer: 2,
    explain: 'Parent ⌊(i−1)/2⌋, left 2i+1, right 2i+2. The array IS the tree.',
  },
  {
    id: 'm14',
    q: 'A binary heap is a search tree.',
    options: ['Yes, in-order is sorted', 'Yes, if it is a max-heap', 'No — parent≥children is not left<right', 'Only min-heaps are BSTs'],
    answer: 2,
    explain: 'Heap-order ≠ BST-order. Searching an arbitrary key is O(n).',
  },
  {
    id: 'm15',
    q: 'A new Red-Black node is inserted as',
    options: ['Black always', 'Red (except it may become the black root)', 'Blue', 'The same colour as its parent'],
    answer: 1,
    explain: 'Red keeps black-height unchanged. Then fix red-red by recolor or rotate.',
  },
  {
    id: 'm16',
    q: 'Huffman codes are prefix-free so that',
    options: ['Every letter has the same length', 'You can decode a bit stream with no commas / separators', 'The tree is a BST', 'Internal nodes store letters'],
    answer: 1,
    explain: 'No code is a prefix of another. Leaves are letters; internal nodes are frequency sums.',
  },
  {
    id: 'm17',
    q: 'Trie insert/search of a word of length L among n words is',
    options: ['O(n)', 'O(log n)', 'O(L)', 'O(L n)'],
    answer: 2,
    explain: 'You walk one edge per letter. Dictionary size n does not appear in the walk.',
  },
  {
    id: 'm18',
    q: 'Preorder + Postorder uniquely determine a binary tree.',
    options: ['Always', 'Never', 'Only if you also have inorder (or the tree is full)', 'Only for heaps'],
    answer: 2,
    explain: 'You need inorder as one of the two lists, except special cases like a full tree.',
  },
  {
    id: 'm19',
    q: 'A threaded binary tree reuses NULL pointers as',
    options: ['Parent links only', 'Inorder predecessor / successor', 'Heap indexes', 'Huffman bits'],
    answer: 1,
    explain: 'Empty left → predecessor, empty right → successor, plus a tag bit.',
  },
  {
    id: 'm20',
    q: 'B+ trees store records',
    options: ['In every internal node', 'Only in the linked leaves', 'Only at the root', 'In a separate heap'],
    answer: 1,
    explain: 'Internal keys are signposts. Range scan follows the leaf linked list.',
  },
]

export const TFS: TF[] = [
  {
    id: 't1',
    q: 'A tree may contain a cycle if the root has two children.',
    answer: false,
    explain: 'Trees never have cycles. Two children is still a tree.',
  },
  {
    id: 't2',
    q: 'An empty binary tree is represented by a NULL root.',
    answer: true,
    explain: 'The tree is identified by its root pointer.',
  },
  {
    id: 't3',
    q: 'Pre-order is Left, Node, Right.',
    answer: false,
    explain: 'That is in-order (LNR). Pre-order is NLR.',
  },
  {
    id: 't4',
    q: 'New BST keys are always inserted as leaves.',
    answer: true,
    explain: 'Insert walks to a NULL child and hangs a new node there.',
  },
  {
    id: 't5',
    q: 'AVL insert may need more than two rotations.',
    answer: false,
    explain: 'At most one single or one double rotation on insert.',
  },
  {
    id: 't6',
    q: 'A rotation changes in-order sequence.',
    answer: false,
    explain: 'In-order stays the same, so it remains a BST.',
  },
  {
    id: 't7',
    q: 'B-Tree height grows only when the root splits.',
    answer: true,
    explain: 'That keeps all leaves on one level.',
  },
  {
    id: 't8',
    q: 'Databases often use B-Trees because one node can match one disk page.',
    answer: true,
    explain: 'Fewer I/Os than a deep binary tree.',
  },
  {
    id: 't9',
    q: 'Inorder of a max-heap is sorted descending.',
    answer: false,
    explain: 'Heap is not a BST. Only parent ≥ children. Inorder can look random.',
  },
  {
    id: 't10',
    q: 'Red-Black trees are strictly more balanced than AVL trees.',
    answer: false,
    explain: 'AVL is stricter. RB can be up to about twice as tall, but rotates less often.',
  },
  {
    id: 't11',
    q: 'A trie node can be both END of a word and a prefix of a longer word.',
    answer: true,
    explain: 'car and cart. END is a flag, not “being a leaf”.',
  },
  {
    id: 't12',
    q: 'Evaluating an expression tree is a preorder walk.',
    answer: false,
    explain: 'Post-order: both children first, then the operator. That is postfix / a stack machine.',
  },
]

export const FIBS: Fib[] = [
  {
    id: 'f1',
    q: 'A tree with n nodes has ______ edges.',
    answer: 'n-1',
    explain: 'n minus one.',
    alts: ['n - 1', 'n−1'],
  },
  {
    id: 'f2',
    q: 'Pre-order order of Node, Left, Right is written ______.',
    answer: 'NLR',
    explain: 'Node Left Right.',
  },
  {
    id: 'f3',
    q: 'In the array representation, the left child of index i is at ______.',
    answer: '2i+1',
    explain: 'left = 2i+1, right = 2i+2 (0-based).',
    alts: ['2i + 1', '2*i+1'],
  },
  {
    id: 'f4',
    q: 'The inorder successor is the ______ of the right subtree.',
    answer: 'minimum',
    explain: 'Walk left until there is no left child.',
    alts: ['min', 'smallest'],
  },
  {
    id: 'f5',
    q: 'AVL legal balance factors are −1, 0 and ______.',
    answer: '1',
    explain: '|BF| ≤ 1.',
    alts: ['+1'],
  },
  {
    id: 'f6',
    q: 'RR imbalance is fixed by one ______ rotation.',
    answer: 'left',
    explain: 'RR → left rotate at z.',
  },
  {
    id: 'f7',
    q: 'A B-Tree split promotes the ______ key.',
    answer: 'median',
    explain: 'Middle key goes up.',
    alts: ['middle'],
  },
  {
    id: 'f8',
    q: 'Level-order is the tree version of graph ______.',
    answer: 'BFS',
    explain: 'Breadth-first search uses a queue.',
    alts: ['bfs', 'breadth first search'],
  },
  {
    id: 'f9',
    q: 'After appending into a heap, a too-large key ______ toward the root.',
    answer: 'swims',
    explain: 'Swim / sift-up. Extract uses sink / sift-down.',
    alts: ['swim', 'sifts up', 'sift-up', 'sift up'],
  },
  {
    id: 'f10',
    q: 'Huffman left edge is bit ______.',
    answer: '0',
    explain: 'Left = 0, right = 1 by convention in this course.',
  },
  {
    id: 'f11',
    q: 'A Red-Black root is always painted ______.',
    answer: 'black',
    explain: 'Property 2.',
    alts: ['BLACK', 'Black'],
  },
  {
    id: 'f12',
    q: 'To rebuild a binary tree you need inorder plus ______ or postorder.',
    answer: 'preorder',
    explain: 'Pre+in or post+in. Pre+post is not enough in general.',
    alts: ['pre', 'pre-order', 'pre order'],
  },
]

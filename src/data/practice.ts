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
]

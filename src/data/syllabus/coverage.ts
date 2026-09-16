// WIT 25ITU3CC2T, 2026-27, Unit IV (printed page 17).
export const CORE_CHAPTERS = new Set(['ch1', 'ch2', 'ch3', 'ch4', 'ch6', 'ch7', 'ch9'])

export const PROGRAM_LINKS: Record<string, string> = {
  'tree-def': 'linked-memory', 'bt-del': 'btree-delete',
  'bt-def': 'bt-operations', 'bt-linked': 'bt-operations', 'bt-array': 'bt-operations',
  'bt-expr': 'expr-user', 'trav-intro': 'trav-user', 'trav-pre': 'trav-user',
  'trav-in': 'trav-user', 'trav-post': 'trav-user', 'trav-level': 'level-user',
  'trav-nonrec': 'nonrec-user', 'trav-rebuild': 'rebuild-user',
  'bst-def': 'bst-menu', 'bst-search': 'search-user', 'bst-insert': 'bst-menu',
  'bst-minmax': 'bstutil-user', 'bst-complexity': 'bst-menu',
  'tbt-def': 'thread-user', 'avl-def': 'avl-user', 'avl-rot': 'avl-user',
  'avl-delete': 'avl-del-user', 'avl-search': 'search-user',
  'ops-idea': 'count-user', 'ops-height': 'count-user', 'ops-mirror': 'shape-user',
  'ops-same': 'query-user', 'gen-lcrs': 'lcrs-user', 'gen-forest': 'lcrs-user',
  'bt-multi': 'bsearch-user', 'bt-ins': 'btree-user', 'bt-find': 'bsearch-user',
  'heap-def': 'heap', 'heap-pq': 'heap', 'huff-idea': 'huffman',
  'huff-len': 'huffman', 'trie-def': 'trie',
}

export const SYLLABUS_POINTS = [
  { title: 'Definition and terminology', topic: 'tree-def' },
  { title: 'Pre-order, in-order and post-order', topic: 'trav-intro' },
  { title: 'Linked implementation', topic: 'bt-linked' },
  { title: 'Binary tree: insert, search, delete', topic: 'bt-operations' },
  { title: 'BST: insert, search, delete', topic: 'bst-def' },
  { title: 'Multiway trees', topic: 'bt-multi' },
  { title: 'B-Trees', topic: 'bt-ins' },
  { title: 'AVL tree', topic: 'avl-def' },
  { title: 'Single rotations', topic: 'avl-rot' },
  { title: 'Double rotations', topic: 'avl-rot' },
]

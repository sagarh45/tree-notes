import { PROGRAM_CATALOG } from './programCatalog'
import type { Program } from './syllabus/types'

const TREE = '7\n40 20 60 10 30 50 70'
export const PROGRAM_INPUTS: Record<string, string> = {
  'linked-memory': '', 'tbt-inorder': '',
  'bst-menu': '1 40\n1 20\n1 60\n1 10\n1 30\n5\n2 30\n3 20\n5\n8\n0',
  'trav-user': TREE, 'search-user': `${TREE}\n30`, 'delete-user': `${TREE}\n40`,
  'avl-user': '3\n30 10 20', 'count-user': TREE,
  'btree-user': '10 20 5 6 12 30 7 17 -1',
  heap: '1 40\n1 20\n1 60\n3\n2\n3\n0',
  huffman: '4\na 5\nb 9\nc 12\nd 13',
  trie: '1 car\n1 cart\n2 car\n2 cat\n0',
  'nonrec-user': TREE, 'level-user': TREE, 'shape-user': TREE,
  'query-user': `${TREE}\n30\n10 30`,
  'avl-del-user': '1 30\n1 20\n1 40\n1 10\n1 25\n3\n2 40\n3\n4\n5 25\n5 99\n6\n7\n8\n9\n6\n0',
  'heapsort-user': '5\n4 10 3 5 1', 'treesort-user': '5\n4 10 3 5 1',
  'expr-user': '12+3*', 'lcrs-user': '1\n5\n1 2\n1 3\n1 4\n2 5\n2 6',
  'thread-user': TREE,
  'rebuild-user': '7\n1 2 4 5 3 6 7\n4 2 5 1 6 3 7',
  'bsearch-user': '1 10\n1 20\n1 5\n1 6\n1 12\n1 30\n3\n2 12\n2 99\n0',
  'bstutil-user': `${TREE}\n40\n3\n25 55`,
  'bt-construct': '7\n50 30 70 20 40 60 80',
  'trav-program': '6\n78 26 94 23 43 97',
  'bst-delete': '7\n50 30 70 20 40 60 80\n40\n70',
  'avl-insert': '8\n63 9 19 27 18 108 99 81',
  'ops-dia': '9\n8 3 10 1 6 14 4 7 13\n1',
  'heap-sort': '5\n4 10 3 5 1',
}

export function programInput(program: Pick<Program, 'code' | 'input'>): string {
  const original = PROGRAM_CATALOG.find(p => p.code === program.code)
  // Derived rotation lessons deliberately use a different three-key example.
  if (program.input !== undefined && program.input !== original?.input) return program.input
  return (original && PROGRAM_INPUTS[original.id]) ?? program.input ?? ''
}

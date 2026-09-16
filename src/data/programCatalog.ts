import { PROGRAMS, type Program } from './programs'
import { CHAPTERS } from './syllabus'
import { LINKED_PROGRAM, MULTIWAY_PROGRAM, BTREE_PROGRAM } from './coursePrograms'

export type CatalogProgram = Program & { input?: string; output?: string; topicId?: string }

const GROUPS: Record<number, Program['topic']> = {
  2: 'Binary tree', 3: 'Binary tree', 4: 'BST', 6: 'AVL', 7: 'Binary tree', 9: 'B-Tree', 10: 'Heap',
}

export const PROGRAM_CATALOG: CatalogProgram[] = [
  { ...LINKED_PROGRAM, id: 'linked-memory', topic: 'Binary tree', source: 'Linked implementation', blurb: 'Allocate nodes, connect pointers, count and free the tree.' },
  { ...MULTIWAY_PROGRAM, id: 'multiway-search', topic: 'B-Tree', source: 'Multiway trees', blurb: 'Choose child pointers using sorted key ranges.' },
  { ...BTREE_PROGRAM, id: 'btree-delete', topic: 'B-Tree', source: 'B-Trees', blurb: 'Order 4: insertion, search, borrowing, merging and root shrinking.' },
  ...PROGRAMS,
  ...CHAPTERS.flatMap(ch => ch.topics.flatMap(t => t.program ? [{
    ...t.program,
    id: t.id,
    source: `Chapter ${ch.number}: ${ch.title}`,
    blurb: t.tagline ?? t.title,
    topic: GROUPS[ch.number] ?? 'Advanced',
    topicId: t.id,
  }] : [])),
]

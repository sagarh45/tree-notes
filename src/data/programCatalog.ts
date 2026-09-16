import { PROGRAMS, type Program } from './programs'
import { CHAPTERS } from './syllabus'

export type CatalogProgram = Program & { input?: string; output?: string; topicId?: string }

const GROUPS: Record<number, Program['topic']> = {
  2: 'Binary tree', 3: 'Binary tree', 4: 'BST', 6: 'AVL', 7: 'Binary tree', 9: 'B-Tree', 10: 'Heap',
}

export const PROGRAM_CATALOG: CatalogProgram[] = [
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

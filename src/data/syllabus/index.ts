import type { Chapter, Topic } from './types'
import { CH1_TREE } from './ch1-tree'
import { CH2_BINARY } from './ch2-binary'
import { CH3_TRAVERSAL } from './ch3-traversal'
import { CH4_BST } from './ch4-bst'
import { CH5_THREADED } from './ch5-threaded'
import { CH6_AVL } from './ch6-avl'
import { CH7_OPS } from './ch7-ops'
import { CH8_GENERAL } from './ch8-general'
import { CH9_BTREE } from './ch9-btree'
import { CH10_HEAP } from './ch10-heap'
import { CH11_HUFFMAN } from './ch11-huffman'
import { CH12_ADVANCED } from './ch12-advanced'
import { CH13_EXAM } from './ch13-exam'
import { TERM_CARDS } from '../terms'

export const CHAPTERS: Chapter[] = [
  CH1_TREE,
  CH2_BINARY,
  CH3_TRAVERSAL,
  CH4_BST,
  CH5_THREADED,
  CH6_AVL,
  CH7_OPS,
  CH8_GENERAL,
  CH9_BTREE,
  CH10_HEAP,
  CH11_HUFFMAN,
  CH12_ADVANCED,
  CH13_EXAM,
]

export const ALL_TOPICS: Topic[] = CHAPTERS.flatMap((c) => c.topics)

export function topicCount() {
  return ALL_TOPICS.length
}

export function diagramCount() {
  return ALL_TOPICS.reduce((n, t) => n + (t.diagrams?.length ?? 0) + (t.termCards ? TERM_CARDS.length : 0), 0)
}

export function programCount() {
  return ALL_TOPICS.filter((t) => t.program).length
}

export function findTopic(id: string): { chapter: Chapter; topic: Topic; index: number } | undefined {
  for (const chapter of CHAPTERS) {
    const index = chapter.topics.findIndex((t) => t.id === id)
    if (index >= 0) return { chapter, topic: chapter.topics[index]!, index }
  }
  return undefined
}

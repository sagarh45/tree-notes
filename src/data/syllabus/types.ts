import type { NodeValue } from '../../lib/binaryTree'
import type { TreeKind } from '../../types/lab'

export type BTreePicture = { keys: number[]; children?: BTreePicture[] }

/**
 * A diagram is described by a small spec; the <Diagram> component builds
 * and draws it. Keeping specs tiny lets every topic carry many pictures.
 */
export type Diagram =
  | { kind: 'btree-shape'; title: string; tree: BTreePicture; caption?: string }
  /** Binary tree built by BST-style insertion of the sequence (letters allowed). */
  | {
      kind: 'tree'
      title: string
      caption?: string
      seq?: NodeValue[]
      /** "A(B(D,E),C(,F))" — hand-drawn shape, when order of insertion is not the point */
      spec?: string
      marks?: Record<string, string>
      tags?: Record<string, string>
      order?: Record<string, number>
      showBf?: boolean
      showNulls?: boolean
      showIndex?: boolean
      edgeLabels?: boolean
      threads?: boolean
      dim?: boolean
    }
  /** One small picture per insert (BST growth). */
  | { kind: 'tree-steps'; title: string; seq: NodeValue[]; caption?: string }
  /** AVL final tree with balance factors. */
  | { kind: 'avl'; title: string; seq: NodeValue[]; caption?: string }
  /** AVL growth — before/after picture for every rotation, single picture otherwise. */
  | { kind: 'avl-steps'; title: string; seq: NodeValue[]; caption?: string; onlyRotations?: boolean }
  /** B-Tree final picture. mode: 'notes' = split-full-on-way-down, 'exam' = insert then split. */
  | { kind: 'btree'; title: string; seq: number[]; order: number; mode?: 'notes' | 'exam'; caption?: string }
  | { kind: 'btree-steps'; title: string; seq: number[]; order: number; mode?: 'notes' | 'exam'; caption?: string }
  /** Array (sequential) strip for a tree. */
  | { kind: 'array'; title: string; spec?: string; seq?: NodeValue[]; caption?: string; oneBased?: boolean }
  /** Linked node boxes  [L | data | R] */
  | { kind: 'nodebox'; title: string; values: NodeValue[]; caption?: string }
  /** Reuse a figure that already exists in figures.ts (by section key + index). */
  | { kind: 'fig'; figKey: string; index?: number; title?: string }
  /** Traversal order badges on a tree. */
  | { kind: 'traversal'; title: string; spec?: string; seq?: NodeValue[]; order: 'preorder' | 'inorder' | 'postorder' | 'levelorder'; caption?: string }
  /** Pre-formatted text picture (kept small and only when a shape is easier as text). */
  | { kind: 'ascii'; title: string; text: string; caption?: string }
  /** Max/min heap — tree and array are the same object. */
  | { kind: 'heap'; title: string; seq: number[]; max?: boolean; caption?: string }
  /** Huffman forest / final tree from letter frequencies. */
  | {
      kind: 'huffman'
      title: string
      items: { ch: string; freq: number }[]
      caption?: string
      steps?: boolean
    }
  /** Prefix trie built from a word list. */
  | { kind: 'trie'; title: string; words: string[]; caption?: string }
  /** Red-Black tree after inserting the sequence. */
  | { kind: 'rbtree'; title: string; seq: number[]; caption?: string }

export type CodeBlock = {
  title: string
  code: string
  /** short line under the code */
  note?: string
}

export type Program = {
  title: string
  code: string
  output?: string
  input?: string
}

export type ComplexityRow = { op: string; avg: string; worst: string; note?: string }

export type Topic = {
  id: string
  title: string
  /** one-line hook shown under the title */
  tagline?: string
  /** exam definition — write this in the answer */
  definition: string
  /** very plain words (HTML allowed) */
  simple: string
  /** quick bullet points (HTML allowed) */
  points?: string[]
  diagrams?: Diagram[]
  /** numbered algorithm(s) */
  algorithm?: { title: string; steps: string[] }[]
  /** C syntax pieces */
  syntax?: CodeBlock[]
  /** one complete runnable program */
  program?: Program
  /** worked example / dry run (HTML) */
  example?: { title: string; html: string }
  /** table rows */
  complexity?: ComplexityRow[]
  /** formulas (HTML) */
  formulas?: string[]
  tips?: string[]
  mistakes?: string[]
  /** open the matching visualizer */
  lab?: TreeKind
  /** show the 17 terminology cards inside this topic */
  termCards?: boolean
}

export type Chapter = {
  id: string
  number: number
  title: string
  /** the syllabus line this chapter covers */
  syllabus: string
  emoji: string
  topics: Topic[]
}

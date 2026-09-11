import { useState } from 'react'
import { BinaryTreeSvg } from '../viz/BinaryTreeSvg'
import { BTreeSvg } from '../viz/BTreeSvg'
import { HeapDualViz } from '../viz/HeapDualViz'
import { TrieSvg } from '../viz/TrieSvg'
import { HuffmanPanel } from '../viz/HuffmanPanel'
import { bstFromSequence } from '../../lib/bst'
import { avlFromSequence } from '../../lib/avl'
import { bTreeFromSequence } from '../../lib/btree'
import { heapFromSequence } from '../../lib/heap'
import { rbFromSequence } from '../../lib/rbtree'
import { trieFromWords } from '../../lib/trie'
import { huffmanBuild, parseFreqs } from '../../lib/huffman'
import { withBalanceFactors } from '../../lib/binaryTree'
import {
  AVL_PACKS,
  BST_PACKS,
  BTREE_PACKS,
  HEAP_PACKS,
  HUFF_PACKS,
  RB_PACKS,
  TRAV_PACKS,
  TRIE_PACKS,
} from '../../data/examplePacks'

type Tab =
  | 'All'
  | 'Traversals'
  | 'BST'
  | 'AVL'
  | 'B-Tree'
  | 'Heap'
  | 'Red-Black'
  | 'Huffman'
  | 'Trie'

const TABS: Tab[] = ['All', 'Traversals', 'BST', 'AVL', 'B-Tree', 'Heap', 'Red-Black', 'Huffman', 'Trie']

const NOTE: Record<string, string> = {
  Traversals: 'Same four traversals, ten different shapes. Notice how the skewed ones make the call stack as deep as n.',
  BST: 'Every one of these obeys “whole left < node < whole right”, so every in-order below is sorted.',
  AVL: 'Balance factors are printed above each node. Nowhere will you find a +2 or a −2 — that is the whole law.',
  'B-Tree': 'Order 3, so at most 2 keys and 3 children per node. In every picture all leaves sit on the same level.',
  Heap: 'The array strip and the tree are one object. The index on the circle is the index in the array.',
  'Red-Black': 'Never two reds in a row, and every root-to-NIL path has the same number of black nodes.',
  Huffman: 'Leaves are letters, internal nodes are frequency sums, and the code is the path from the root.',
  Trie: 'One letter per edge. Shared prefixes share a path, and a word can end at an internal node.',
}

function Card({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="ex-viz">
      <figcaption className="fig-title">{title}</figcaption>
      {children}
      <p className="muted">{note}</p>
    </figure>
  )
}

function group(tab: Tab) {
  switch (tab) {
    case 'Traversals':
      return TRAV_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`${p.seq.length} keys · in-order comes out sorted`}>
          <BinaryTreeSvg root={bstFromSequence(p.seq)} edgeLabels compact />
        </Card>
      ))
    case 'BST':
      return BST_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`${p.seq.length} keys · insert order: ${p.seq.join(', ')}`}>
          <BinaryTreeSvg root={bstFromSequence(p.seq)} compact />
        </Card>
      ))
    case 'AVL':
      return AVL_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`${p.seq.length} keys · every |BF| ≤ 1 after rebalancing`}>
          <BinaryTreeSvg root={withBalanceFactors(avlFromSequence(p.seq))} showBf compact />
        </Card>
      ))
    case 'B-Tree':
      return BTREE_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`order 3 · ${p.seq.length} keys · all leaves on one level`}>
          <BTreeSvg root={bTreeFromSequence(p.seq, 3).root} compact />
        </Card>
      ))
    case 'Heap':
      return HEAP_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`max-heap · array [${heapFromSequence(p.seq, true).join(', ')}]`}>
          <HeapDualViz arr={heapFromSequence(p.seq, true)} compact />
        </Card>
      ))
    case 'Red-Black':
      return RB_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`${p.seq.length} keys · root is always black`}>
          <BinaryTreeSvg root={rbFromSequence(p.seq)} showColor compact />
        </Card>
      ))
    case 'Huffman':
      return HUFF_PACKS.map((p) => {
        const built = huffmanBuild(parseFreqs(p.text))
        return (
          <Card key={p.id} title={p.label} note="Left edge = 0, right edge = 1. Code length = depth of the leaf.">
            <HuffmanPanel forest={built.root ? [built.root] : []} codes={built.codes} compact />
          </Card>
        )
      })
    case 'Trie':
      return TRIE_PACKS.map((p) => (
        <Card key={p.id} title={p.label} note={`${p.words.length} words · green ring marks the end of a word`}>
          <TrieSvg root={trieFromWords(p.words)} compact />
        </Card>
      ))
    default:
      return null
  }
}

const COUNT =
  TRAV_PACKS.length +
  BST_PACKS.length +
  AVL_PACKS.length +
  BTREE_PACKS.length +
  HEAP_PACKS.length +
  RB_PACKS.length +
  HUFF_PACKS.length +
  TRIE_PACKS.length

export function ModelGallery() {
  const [tab, setTab] = useState<Tab>('All')
  const shown: Tab[] = tab === 'All' ? TABS.filter((t) => t !== 'All') : [tab]

  return (
    <div className="card">
      <h3>Complete diagram gallery — all {COUNT} example trees in one place</h3>
      <p className="muted" style={{ marginTop: 0 }}>
        Every example pack in this lab, drawn. Scroll through a whole model to see how the same law produces very
        different shapes, then load any of them above and step through the operation.
      </p>
      <div className="tabs" role="tablist" aria-label="Gallery filter">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {shown.map((t) => (
        <section key={t}>
          <div className="fig-head">
            {t} <span className="fig-pill">{group(t)?.length ?? 0}</span>
          </div>
          <p className="muted" style={{ marginTop: 0, fontSize: '0.9rem' }}>
            {NOTE[t]}
          </p>
          <div className="ex-row">{group(t)}</div>
        </section>
      ))}
    </div>
  )
}

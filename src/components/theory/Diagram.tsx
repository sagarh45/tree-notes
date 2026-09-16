import { useId, useMemo, useRef } from 'react'
import { Expand, X } from 'lucide-react'
import type { BTreePicture, Diagram as DiagramSpec } from '../../data/syllabus/types'
import type { BTreeNode } from '../../lib/btree'
import { THEORY_FIGURES } from '../../data/figures'
import { BinaryTreeSvg } from '../viz/BinaryTreeSvg'
import { BTreeSvg } from '../viz/BTreeSvg'
import { HeapDualViz } from '../viz/HeapDualViz'
import { TrieSvg } from '../viz/TrieSvg'
import { HuffmanPanel } from '../viz/HuffmanPanel'
import { inorderThreads, traversalTrace, withBalanceFactors, type BinNode, type NodeValue } from '../../lib/binaryTree'
import {
  arrayRepresentation,
  avlBuildFrames,
  avlFinal,
  bstBuildFrames,
  bstFinal,
  bTreeProactiveFrames,
  bTreeReactiveFrames,
  idOfValue,
  marksByValue,
  treeFromSpec,
} from '../../lib/stepBuilders'
import { heapFromSequence } from '../../lib/heap'
import { huffmanBuild } from '../../lib/huffman'
import { trieFromWords } from '../../lib/trie'
import { rbFromSequence } from '../../lib/rbtree'

function buildRoot(spec?: string, seq?: NodeValue[]): BinNode | null {
  if (spec) return treeFromSpec(spec)
  if (seq) return bstFinal(seq)
  return null
}

function visitOrderMap(root: BinNode | null, order: 'preorder' | 'inorder' | 'postorder' | 'levelorder') {
  const out: Record<string, number> = {}
  let k = 1
  for (const s of traversalTrace(root, order)) {
    if (s.action === 'visit') out[s.id] = k++
  }
  return out
}

function Figure({ title, caption, children }: { title?: string; caption?: string; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  return (
    <figure className="ex-viz dg">
      <div className="diagram-heading">
        {title ? <figcaption className="fig-title">{title}</figcaption> : null}
        <button type="button" className="icon-button" aria-label={`Enlarge diagram: ${title ?? 'Tree'}`} title="Enlarge diagram" onClick={() => dialog.current?.showModal()}><Expand size={16} /></button>
      </div>
      {children}
      {caption ? <p className="muted dg-cap">{caption}</p> : null}
      <dialog ref={dialog} className="diagram-dialog" aria-labelledby={titleId}>
        <div className="diagram-heading"><h3 id={titleId}>{title ?? 'Tree diagram'}</h3><button type="button" className="icon-button" title="Close diagram" aria-label="Close diagram" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
        {children}
        {caption ? <p>{caption}</p> : null}
      </dialog>
    </figure>
  )
}

export function Diagram({ d }: { d: DiagramSpec }) {
  const built = useMemo(() => build(d), [d])
  return built
}

function build(d: DiagramSpec): React.ReactElement | null {
  switch (d.kind) {
    case 'btree-shape': {
      const convert = (node: BTreePicture, id = 'shape'): BTreeNode => ({
        id, keys: node.keys, children: (node.children ?? []).map((child, i) => convert(child, `${id}-${i}`)),
      })
      return <Figure title={d.title} caption={d.caption}><BTreeSvg root={convert(d.tree)} compact /></Figure>
    }
    case 'tree': {
      const raw = buildRoot(d.spec, d.seq)
      const root = d.showBf ? withBalanceFactors(raw) : raw
      const marks = d.marks ? marksByValue(root, d.marks) : undefined
      const tags = d.tags ? marksByValue(root, d.tags) : undefined
      const order = d.order
        ? Object.fromEntries(
            Object.entries(d.order)
              .map(([v, n]) => [idOfValue(root, isNaN(Number(v)) ? v : Number(v)) ?? '', n])
              .filter(([id]) => id),
          )
        : undefined
      return (
        <Figure title={d.title} caption={d.caption}>
          <BinaryTreeSvg
            root={root}
            marks={marks}
            tags={tags}
            visitOrder={order}
            showBf={d.showBf}
            showNulls={d.showNulls}
            showIndex={d.showIndex}
            edgeLabels={d.edgeLabels}
            threads={d.threads ? inorderThreads(root) : undefined}
            dimUnmarked={d.dim}
            compact
          />
        </Figure>
      )
    }
    case 'traversal': {
      const root = buildRoot(d.spec, d.seq)
      const order = visitOrderMap(root, d.order)
      const seqText = Object.entries(order)
        .sort((a, b) => a[1] - b[1])
        .map(([id]) => String(findValue(root, id)))
        .join(' → ')
      return (
        <Figure title={d.title} caption={d.caption ? `${d.caption} Output: ${seqText}` : `Output: ${seqText}`}>
          <BinaryTreeSvg root={root} visitOrder={order} edgeLabels compact />
        </Figure>
      )
    }
    case 'tree-steps': {
      const frames = bstBuildFrames(d.seq)
      return (
        <div className="dg-steps">
          {d.title ? <div className="dg-steps-title">{d.title}</div> : null}
          <div className="ex-row">
            {frames.map((f, i) => {
              const marks: Record<string, string> = { [f.newId]: 'new' }
              for (const id of f.path) marks[id] = 'path'
              return (
                <Figure key={i} title={`Step ${i + 1} · insert ${f.key}`} caption={f.note}>
                  <BinaryTreeSvg root={f.root} marks={marks} compact />
                </Figure>
              )
            })}
          </div>
          {d.caption ? <p className="muted dg-cap">{d.caption}</p> : null}
        </div>
      )
    }
    case 'avl': {
      const root = avlFinal(d.seq)
      return (
        <Figure title={d.title} caption={d.caption}>
          <BinaryTreeSvg root={root} showBf compact />
        </Figure>
      )
    }
    case 'avl-steps': {
      const frames = avlBuildFrames(d.seq)
      const shown = d.onlyRotations ? frames.filter((f) => f.rotation) : frames
      return (
        <div className="dg-steps">
          {d.title ? <div className="dg-steps-title">{d.title}</div> : null}
          <div className="ex-row">
            {shown.map((f) => {
              const stepNo = frames.indexOf(f) + 1
              if (f.rotation) {
                const pivotMark = f.pivot !== undefined ? marksByValue(f.before, { [String(f.pivot)]: 'unbalanced' }) : {}
                const newMark = marksByValue(f.before, { [String(f.key)]: 'new' })
                return (
                  <div className="dg-pair" key={stepNo}>
                    <Figure title={`Step ${stepNo} · insert ${f.key} → unbalanced`}>
                      <BinaryTreeSvg root={f.before} marks={{ ...pivotMark, ...newMark }} showBf compact />
                    </Figure>
                    <div className="dg-arrow" aria-hidden="true">
                      <span className="dg-rot">{f.rotation}</span>↓
                    </div>
                    {f.middle ? <Figure title={`First: ${f.rotation === 'LR' ? 'left' : 'right'} rotate the child`} caption="The pivot is still unbalanced. The second rotation is required."><BinaryTreeSvg root={f.middle} showBf compact /></Figure> : null}
                    <Figure title={`After ${f.rotation} rotation at ${f.pivot}`} caption={f.note}>
                      <BinaryTreeSvg root={f.after} marks={marksByValue(f.after, { [String(f.key)]: 'new' })} showBf compact />
                    </Figure>
                  </div>
                )
              }
              return (
                <Figure key={stepNo} title={`Step ${stepNo} · insert ${f.key}`} caption={f.note}>
                  <BinaryTreeSvg root={f.after} marks={marksByValue(f.after, { [String(f.key)]: 'new' })} showBf compact />
                </Figure>
              )
            })}
          </div>
          {d.caption ? <p className="muted dg-cap">{d.caption}</p> : null}
        </div>
      )
    }
    case 'btree': {
      const frames = d.mode === 'exam' ? bTreeReactiveFrames(d.seq, d.order) : bTreeProactiveFrames(d.seq, d.order)
      const last = frames[frames.length - 1]
      return (
        <Figure title={d.title} caption={d.caption}>
          {last ? <BTreeSvg root={last.tree} compact /> : null}
        </Figure>
      )
    }
    case 'btree-steps': {
      const frames = d.mode === 'exam' ? bTreeReactiveFrames(d.seq, d.order) : bTreeProactiveFrames(d.seq, d.order)
      return (
        <div className="dg-steps">
          {d.title ? <div className="dg-steps-title">{d.title}</div> : null}
          <div className="ex-row">
            {frames.map((f, i) => (
              <Figure key={i} title={`Step ${i + 1} · insert ${f.key}${f.split ? ' · SPLIT' : ''}`} caption={f.note}>
                <BTreeSvg root={f.tree} highlightKey={f.key} compact />
              </Figure>
            ))}
          </div>
          {d.caption ? <p className="muted dg-cap">{d.caption}</p> : null}
        </div>
      )
    }
    case 'array': {
      const root = buildRoot(d.spec, d.seq)
      const arr = arrayRepresentation(root)
      const base = d.oneBased === false ? 0 : 1
      return (
        <Figure title={d.title} caption={d.caption}>
          <div className="dg-array-wrap">
            <BinaryTreeSvg root={root} compact />
            <div className="dg-array" role="table" aria-label="Array representation">
              {arr.map((v, i) => (
                <div key={i} className={`dg-cell${v === null ? ' empty' : ''}`}>
                  <span className="dg-idx">[{i + base}]</span>
                  <span className="dg-val">{v === null ? '—' : v}</span>
                </div>
              ))}
            </div>
          </div>
        </Figure>
      )
    }
    case 'nodebox': {
      return (
        <Figure title={d.title} caption={d.caption}>
          <div className="dg-boxes">
            {d.values.map((v, i) => (
              <div className="dg-nodebox" key={i}>
                <span className="dg-ptr">left</span>
                <span className="dg-data">{v}</span>
                <span className="dg-ptr">right</span>
              </div>
            ))}
          </div>
        </Figure>
      )
    }
    case 'ascii':
      return (
        <Figure title={d.title} caption={d.caption}>
          <pre className="tree-pic">{d.text}</pre>
        </Figure>
      )
    case 'heap': {
      const arr = heapFromSequence(d.seq, d.max !== false)
      return (
        <Figure title={d.title} caption={d.caption}>
          <HeapDualViz arr={arr} compact />
        </Figure>
      )
    }
    case 'huffman': {
      const built = huffmanBuild(d.items)
      if (d.steps) {
        return (
          <div className="dg-steps">
            {d.title ? <div className="dg-steps-title">{d.title}</div> : null}
            <div className="ex-row">
              {built.snaps.map((s, i) => (
                <Figure key={i} title={i === 0 ? 'Start — every letter is a tree' : `Merge ${i}`} caption={s.note}>
                  <HuffmanPanel forest={s.forest} codes={s.codes} compact />
                </Figure>
              ))}
            </div>
            {d.caption ? <p className="muted dg-cap">{d.caption}</p> : null}
          </div>
        )
      }
      return (
        <Figure title={d.title} caption={d.caption}>
          <HuffmanPanel forest={built.root ? [built.root] : []} codes={built.codes} compact />
        </Figure>
      )
    }
    case 'trie':
      return (
        <Figure title={d.title} caption={d.caption}>
          <TrieSvg root={trieFromWords(d.words)} compact />
        </Figure>
      )
    case 'rbtree':
      return (
        <Figure title={d.title} caption={d.caption}>
          <BinaryTreeSvg root={rbFromSequence(d.seq)} showColor compact />
        </Figure>
      )
    case 'fig': {
      const list = THEORY_FIGURES[d.figKey] ?? []
      const items = d.index === undefined ? list : list[d.index] ? [list[d.index]] : []
      return (
        <>
          {items.map((fig) => (
            <Figure key={fig.title} title={d.title ?? fig.title} caption={fig.caption}>
              {fig.heap ? (
                <HeapDualViz arr={fig.heap} compact />
              ) : fig.trie ? (
                <TrieSvg root={fig.trie} compact />
              ) : fig.forest?.length ? (
                <HuffmanPanel forest={fig.forest} codes={fig.codes} compact />
              ) : fig.btree ? (
                <BTreeSvg root={fig.btree} compact />
              ) : (
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
              )}
            </Figure>
          ))}
        </>
      )
    }
    default:
      return null
  }
}

function findValue(root: BinNode | null, id: string): NodeValue | '' {
  if (!root) return ''
  if (root.id === id) return root.value
  const l = findValue(root.left, id)
  if (l !== '') return l
  return findValue(root.right, id)
}

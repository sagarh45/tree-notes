import { useCallback, useState } from 'react'
import { PlaybackBar } from '../components/lab/PlaybackBar'
import { CodePanel } from '../components/lab/CodePanel'
import { VariablesPanel } from '../components/lab/VariablesPanel'
import { ExplanationPanel } from '../components/lab/ExplanationPanel'
import { ComplexityPanel } from '../components/lab/ComplexityPanel'
import { HistoryPanel } from '../components/lab/HistoryPanel'
import { BinaryTreeSvg, Legend } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { TrieSvg } from '../components/viz/TrieSvg'
import { CallStack } from '../components/viz/CallStack'
import { HuffmanPanel } from '../components/viz/HuffmanPanel'
import { usePlayback } from '../hooks/usePlayback'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { LAB_CODE, LAB_PSEUDO, type LabSnippetId } from '../data/labCode'
import {
  AVL_PACKS,
  BST_PACKS,
  BTREE_PACKS,
  HEAP_PACKS,
  HUFF_PACKS,
  RB_PACKS,
  TRAV_PACKS,
  TRIE_PACKS,
} from '../data/examplePacks'
import { inorderThreads, type BinNode, type VisitKind } from '../lib/binaryTree'
import { bstFromSequence } from '../lib/bst'
import { avlFromSequence, type RotKind } from '../lib/avl'
import { bTreeFromSequence, emptyBTree, type BTreeNode } from '../lib/btree'
import { heapFromSequence } from '../lib/heap'
import { rbFromSequence } from '../lib/rbtree'
import { parseFreqs } from '../lib/huffman'
import { trieFromWords } from '../lib/trie'
import { buildTraversalSteps, idleTraversal } from '../engines/traversalLab'
import { buildBstDelete, buildBstInsert, buildBstSearch, idleBst } from '../engines/bstLab'
import { buildAvlInsert, buildRotationDemo, idleAvl } from '../engines/avlLab'
import { buildBTreeInsert, idleBTree } from '../engines/btreeLab'
import { buildHeapExtract, buildHeapInsert, idleHeap } from '../engines/heapLab'
import { buildRbInsert, idleRb } from '../engines/rbtreeLab'
import { buildHuffman, idleHuffman } from '../engines/huffmanLab'
import { buildTrieInsert, emptyTrie, idleTrie } from '../engines/trieLab'
import type { ComplexityRow, HistoryEntry, TreeKind, TreeStep } from '../types/lab'

const TRAVERSAL_CX: ComplexityRow[] = [
  { op: 'Pre / In / Post', time: 'Θ(n)', space: 'O(h)', note: 'Call-stack depth = height' },
  { op: 'Level-order', time: 'Θ(n)', space: 'O(w)', note: 'Queue ≈ widest level' },
]
const BST_CX: ComplexityRow[] = [
  { op: 'Search / Insert / Delete', time: 'O(h)', space: 'O(n)', note: 'h ≈ log n if bushy, h = n if skewed' },
]
const AVL_CX: ComplexityRow[] = [{ op: 'Search / Insert / Delete', time: 'O(log n)', space: 'O(n)', note: 'Rotations are O(1)' }]
const BT_CX: ComplexityRow[] = [{ op: 'Search / Insert / Delete', time: 'O(log n)', space: 'O(n)', note: 'O(log_m n) node visits' }]
const HEAP_CX: ComplexityRow[] = [
  { op: 'Peek max', time: 'O(1)', space: 'O(1)', note: 'Always index 0' },
  { op: 'Insert / Extract', time: 'O(log n)', space: 'O(n)', note: 'Height of a complete tree' },
]
const RB_CX: ComplexityRow[] = [{ op: 'Search / Insert / Delete', time: 'O(log n)', space: 'O(n)', note: '≤ 2 rotations on insert; recolors may walk up' }]
const HUFF_CX: ComplexityRow[] = [{ op: 'Build', time: 'O(n log n)', space: 'O(n)', note: 'n = number of letters' }]
const TRIE_CX: ComplexityRow[] = [{ op: 'Insert / Search', time: 'O(L)', space: 'O(ALPHABET · nodes)', note: 'L = word length, not dictionary size' }]

const CORE: [TreeKind, string][] = [
  ['traversal', 'Traversals'],
  ['bst', 'BST'],
  ['avl', 'AVL'],
  ['btree', 'B-Tree'],
]
const ADV: [TreeKind, string][] = [
  ['heap', 'Heap'],
  ['rbtree', 'Red-Black'],
  ['huffman', 'Huffman'],
  ['trie', 'Trie'],
]

export function LabPage() {
  const [kind, setKind] = useState<TreeKind>('traversal')
  const [travRoot, setTravRoot] = useState<BinNode | null>(null)
  const [bstRoot, setBstRoot] = useState<BinNode | null>(null)
  const [avlRoot, setAvlRoot] = useState<BinNode | null>(null)
  const [btRoot, setBtRoot] = useState<BTreeNode>(() => emptyBTree())
  const [heapArr, setHeapArr] = useState<number[]>([])
  const [rbKeys, setRbKeys] = useState<number[]>([])
  const [trieRoot, setTrieRoot] = useState(() => emptyTrie())
  const [huffText, setHuffText] = useState('A:4,B:2,C:1,D:1')
  const [steps, setSteps] = useState<TreeStep[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [value, setValue] = useState('10')
  const [codeMode, setCodeMode] = useState<'code' | 'pseudo'>('code')
  const [showThreads, setShowThreads] = useState(false)
  const playback = usePlayback(steps)

  const commit = useCallback((built: TreeStep[], text: string, apply?: () => void) => {
    setSteps(built)
    apply?.()
    setHistory((h) => [...h, { id: crypto.randomUUID(), text, at: Date.now() }])
  }, [])

  const resetAll = useCallback(() => {
    setTravRoot(null)
    setBstRoot(null)
    setAvlRoot(null)
    setBtRoot(emptyBTree())
    setHeapArr([])
    setRbKeys([])
    setTrieRoot(emptyTrie())
    setSteps([])
    setHistory([])
    setValue('10')
    setShowThreads(false)
    playback.restart()
  }, [playback])

  const switchKind = (k: TreeKind) => {
    setKind(k)
    setSteps([])
    setShowThreads(false)
    if (k === 'btree') setValue('8')
    else if (k === 'huffman') setValue('A:4,B:2,C:1,D:1')
    else if (k === 'trie') setValue('cat')
    else setValue('10')
  }

  const num = () => {
    const v = Number(value)
    return Number.isFinite(v) ? Math.trunc(v) : null
  }

  const runTraversal = (t: VisitKind) => {
    commit(buildTraversalSteps(travRoot, t), `${t}`)
  }

  const runInsert = () => {
    if (kind === 'huffman') {
      commit(buildHuffman(value), `Huffman ${value}`)
      setHuffText(value)
      return
    }
    if (kind === 'trie') {
      const r = buildTrieInsert(trieRoot, value)
      commit(r.steps, `Trie insert ${value}`, () => setTrieRoot(r.root))
      return
    }
    const v = num()
    if (v === null) {
      window.alert('Enter a number.')
      return
    }
    if (kind === 'traversal') {
      const r = buildBstInsert(travRoot, v)
      commit(r.steps, `Insert ${v}`, () => setTravRoot(r.root))
    } else if (kind === 'bst') {
      const r = buildBstInsert(bstRoot, v)
      commit(r.steps, `Insert ${v}`, () => setBstRoot(r.root))
    } else if (kind === 'avl') {
      const r = buildAvlInsert(avlRoot, v)
      commit(r.steps, `AVL insert ${v}`, () => setAvlRoot(r.root))
    } else if (kind === 'btree') {
      const r = buildBTreeInsert(btRoot, v, 3)
      commit(r.steps, `B-Tree insert ${v}`, () => setBtRoot(r.root))
    } else if (kind === 'heap') {
      const r = buildHeapInsert(heapArr, v)
      commit(r.steps, `Heap insert ${v}`, () => setHeapArr(r.arr))
    } else if (kind === 'rbtree') {
      const r = buildRbInsert(rbKeys, v)
      commit(r.steps, `RB insert ${v}`, () => setRbKeys(r.keys))
    }
    setValue(String((v ?? 0) + 5))
  }

  const runSearch = () => {
    const v = num()
    if (v === null) return
    if (kind === 'bst') commit(buildBstSearch(bstRoot, v), `Search ${v}`)
  }

  const runDelete = () => {
    const v = num()
    if (v === null) return
    if (kind === 'bst') {
      const r = buildBstDelete(bstRoot, v)
      commit(r.steps, `Delete ${v}`, () => setBstRoot(r.root))
    }
  }

  const runExtract = () => {
    const r = buildHeapExtract(heapArr)
    commit(r.steps, 'Extract-max', () => setHeapArr(r.arr))
  }

  const runRot = (rot: RotKind) => commit(buildRotationDemo(rot), `${rot} rotation demo`)

  const loadSeq = (seq: number[]) => {
    if (kind === 'traversal') {
      setTravRoot(bstFromSequence(seq))
      setSteps([])
    } else if (kind === 'bst') {
      setBstRoot(bstFromSequence(seq))
      setSteps([])
    } else if (kind === 'avl') {
      setAvlRoot(avlFromSequence(seq))
      setSteps([])
    } else if (kind === 'heap') {
      const a = heapFromSequence(seq, true)
      setHeapArr(a)
      setSteps([])
    } else if (kind === 'rbtree') {
      setRbKeys(seq)
      setSteps([])
    } else {
      const built = bTreeFromSequence(seq, 3)
      const frames: TreeStep[] = []
      let cur = emptyBTree()
      for (const key of seq) {
        const r = buildBTreeInsert(cur, key, 3)
        frames.push(...r.steps)
        cur = r.root
      }
      setBtRoot(built.root)
      commit(frames, `Example ${seq.join(', ')}`)
      return
    }
    setHistory((h) => [...h, { id: crypto.randomUUID(), text: `Load ${seq.join(', ')}`, at: Date.now() }])
  }

  const clearTree = () => {
    if (kind === 'traversal') setTravRoot(null)
    else if (kind === 'bst') setBstRoot(null)
    else if (kind === 'avl') setAvlRoot(null)
    else if (kind === 'btree') setBtRoot(emptyBTree())
    else if (kind === 'heap') setHeapArr([])
    else if (kind === 'rbtree') setRbKeys([])
    else if (kind === 'trie') setTrieRoot(emptyTrie())
    setSteps([])
    setHistory((h) => [...h, { id: crypto.randomUUID(), text: 'Clear', at: Date.now() }])
  }

  useKeyboardShortcuts(
    {
      onPlayPause: () => (playback.playing ? playback.pause() : playback.play()),
      onNext: playback.next,
      onPrev: playback.prev,
      onReset: resetAll,
      onInsert: runInsert,
      onSearch: runSearch,
      onDelete: kind === 'heap' ? runExtract : runDelete,
    },
    true,
  )

  const idle: TreeStep =
    kind === 'traversal'
      ? idleTraversal(travRoot)
      : kind === 'bst'
        ? idleBst(bstRoot)
        : kind === 'avl'
          ? idleAvl(avlRoot)
          : kind === 'btree'
            ? idleBTree(btRoot, 3)
            : kind === 'heap'
              ? idleHeap(heapArr)
              : kind === 'rbtree'
                ? idleRb(rbKeys)
                : kind === 'huffman'
                  ? idleHuffman(parseFreqs(huffText))
                  : idleTrie(trieRoot)

  const current = steps.length && playback.current ? playback.current : idle
  const snippetId = current.codeSnippetId as LabSnippetId
  const codeMap = codeMode === 'code' ? LAB_CODE : LAB_PSEUDO
  const codeText = codeMap[snippetId] ?? LAB_CODE.pre
  const complexity =
    kind === 'traversal'
      ? TRAVERSAL_CX
      : kind === 'bst'
        ? BST_CX
        : kind === 'avl'
          ? AVL_CX
          : kind === 'btree'
            ? BT_CX
            : kind === 'heap'
              ? HEAP_CX
              : kind === 'rbtree'
                ? RB_CX
                : kind === 'huffman'
                  ? HUFF_CX
                  : TRIE_CX

  const threads = showThreads && kind === 'traversal' ? inorderThreads(current.tree) : current.threads

  return (
    <div>
      <div className="card">
        <h2>TREES LAB — Core + Advanced models</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Every model is a different <b>law</b> on the same idea of a tree. Type a value, press Insert, then Play. The
          picture, the array / stack, and the C code move together.
        </p>
        <div className="tabs" role="tablist" aria-label="Core tree type">
          {CORE.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => switchKind(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="tabs adv-tabs" role="tablist" aria-label="Advanced tree type">
          {ADV.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => switchKind(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Operation Controls</h3>
        <div className="row">
          <label className="field">
            {kind === 'trie' ? 'Word (a–z)' : kind === 'huffman' ? 'Frequencies' : 'Key (from user)'}
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Value"
              onKeyDown={(e) => e.key === 'Enter' && runInsert()}
            />
          </label>
          <button type="button" className="btn enq" onClick={runInsert}>
            {kind === 'huffman' ? 'Build' : 'Insert'}
          </button>
          {kind === 'traversal' && (
            <>
              <button type="button" className="btn play" onClick={() => runTraversal('preorder')}>
                Pre-order
              </button>
              <button type="button" className="btn play" onClick={() => runTraversal('inorder')}>
                In-order
              </button>
              <button type="button" className="btn peek" onClick={() => runTraversal('postorder')}>
                Post-order
              </button>
              <button type="button" className="btn deq" onClick={() => runTraversal('levelorder')}>
                Level-order
              </button>
              <button
                type="button"
                className={`btn gray${showThreads ? ' on' : ''}`}
                onClick={() => setShowThreads((s) => !s)}
              >
                {showThreads ? 'Hide threads' : 'Show inorder threads'}
              </button>
            </>
          )}
          {kind === 'bst' && (
            <>
              <button type="button" className="btn peek" onClick={runSearch}>
                Search
              </button>
              <button type="button" className="btn deq" onClick={runDelete}>
                Delete
              </button>
            </>
          )}
          {kind === 'avl' &&
            (['LL', 'RR', 'LR', 'RL'] as const).map((rot) => (
              <button key={rot} type="button" className="btn gray" onClick={() => runRot(rot)}>
                {rot} demo
              </button>
            ))}
          {kind === 'heap' && (
            <button type="button" className="btn deq" onClick={runExtract}>
              Extract-max
            </button>
          )}
          <button type="button" className="btn gray" onClick={clearTree}>
            Clear
          </button>
          <button type="button" className="btn warn" onClick={resetAll}>
            Reset empty
          </button>
        </div>
        <p className="muted" style={{ margin: '10px 0 6px', fontWeight: 800 }}>
          Example packs — tap a drawn model
        </p>
        <div className="ex-row">
          {kind === 'huffman'
            ? HUFF_PACKS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="pack-card"
                  onClick={() => {
                    setHuffText(p.text)
                    setValue(p.text)
                    commit(buildHuffman(p.text), p.label)
                  }}
                >
                  <div className="pack-title">{p.label}</div>
                </button>
              ))
            : kind === 'trie'
              ? TRIE_PACKS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="pack-card"
                    onClick={() => {
                      const t = trieFromWords(p.words)
                      setTrieRoot(t)
                      setSteps([])
                      setHistory((h) => [...h, { id: crypto.randomUUID(), text: p.label, at: Date.now() }])
                    }}
                  >
                    <div className="pack-title">{p.label}</div>
                    <TrieSvg root={trieFromWords(p.words)} compact />
                  </button>
                ))
              : (kind === 'traversal'
                  ? TRAV_PACKS
                  : kind === 'bst'
                    ? BST_PACKS
                    : kind === 'avl'
                      ? AVL_PACKS
                      : kind === 'heap'
                        ? HEAP_PACKS
                        : kind === 'rbtree'
                          ? RB_PACKS
                          : BTREE_PACKS
                ).map((p) => (
                  <button key={p.id} type="button" className="pack-card" onClick={() => loadSeq(p.seq)}>
                    <div className="pack-title">{p.label}</div>
                    {kind === 'btree' ? (
                      <BTreeSvg root={bTreeFromSequence(p.seq, 3).root} compact />
                    ) : kind === 'heap' ? (
                      <HeapDualViz arr={heapFromSequence(p.seq, true)} compact />
                    ) : (
                      <BinaryTreeSvg
                        root={
                          kind === 'avl'
                            ? avlFromSequence(p.seq)
                            : kind === 'rbtree'
                              ? rbFromSequence(p.seq)
                              : bstFromSequence(p.seq)
                        }
                        showBf={kind === 'avl'}
                        showColor={kind === 'rbtree'}
                        compact
                      />
                    )}
                  </button>
                ))}
        </div>
        <p className="muted" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
          Shortcuts: <span className="kbd">Space</span> play/pause · <span className="kbd">←</span>{' '}
          <span className="kbd">→</span> steps · <span className="kbd">I</span> insert · <span className="kbd">S</span>{' '}
          search · <span className="kbd">D</span> delete / extract · <span className="kbd">R</span> reset
        </p>
      </div>

      <div className="grid-2">
        <div>
          {kind === 'btree' && current.btree ? (
            <BTreeSvg root={current.btree} highlightId={current.highlightBId} highlightKey={current.highlightKey} />
          ) : kind === 'heap' ? (
            <HeapDualViz arr={current.heap ?? heapArr} focus={current.heapFocus} marks={current.marks} />
          ) : kind === 'huffman' ? (
            <HuffmanPanel forest={current.forest} marks={current.marks} codes={current.codes} />
          ) : kind === 'trie' ? (
            <TrieSvg root={current.trieRoot ?? trieRoot} highlight={current.trieHi} />
          ) : (
            <BinaryTreeSvg
              root={current.tree}
              marks={current.marks}
              visitOrder={current.visitOrder}
              showBf={current.showBf || kind === 'avl'}
              showColor={current.showColor || kind === 'rbtree'}
              showIndex={current.showIndex}
              edgeLabels={current.edgeLabels || kind === 'traversal'}
              threads={threads}
            />
          )}
          {current.callStack ? <CallStack frames={current.callStack} /> : null}
          {current.queue ? <CallStack queue={current.queue} /> : null}
          {current.visitList ? (
            <div className="visit-list" aria-label="Visit order">
              {current.visitList.map((v, i) => (
                <span key={`${v}-${i}`} className={`chip${i === current.visitList!.length - 1 ? ' on' : ''}`}>
                  {v}
                </span>
              ))}
            </div>
          ) : kind === 'rbtree' ? (
            <div className="legend">
              <span>
                <i style={{ background: '#fecaca', borderColor: '#dc2626' }} /> RED (new / glued)
              </span>
              <span>
                <i style={{ background: '#0f172a', borderColor: '#0f172a' }} /> BLACK (2-node spine)
              </span>
            </div>
          ) : (
            <Legend />
          )}
          <PlaybackBar
            index={playback.index}
            total={playback.total}
            playing={playback.playing}
            speed={playback.speed}
            onPlay={playback.play}
            onPause={playback.pause}
            onNext={playback.next}
            onPrev={playback.prev}
            onRestart={playback.restart}
            onSpeed={playback.setSpeed}
          />
          <ExplanationPanel explanation={current.explanation} message={current.message} tone={current.messageTone} />
        </div>
        <div>
          <CodePanel
            title={snippetId}
            code={codeText}
            activeLine={codeMode === 'code' ? current.codeLine : null}
            mode={codeMode}
            onMode={setCodeMode}
          />
          <VariablesPanel variables={current.variables} />
          <ComplexityPanel
            rows={complexity}
            note={
              kind === 'bst'
                ? 'Sorted inserts make a stick (O(n)). That is why AVL and Red-Black exist.'
                : kind === 'avl'
                  ? 'LL = one right rotation. RR = one left. LR / RL = two rotations.'
                  : kind === 'btree'
                    ? 'Height grows only when the root splits, so all leaves stay at one level.'
                    : kind === 'heap'
                      ? 'The ARRAY is the tree. Completeness is free. Heap-order is restored by swim/sink.'
                      : kind === 'rbtree'
                        ? 'Recolor is cheaper than rotate. Industry maps (std::map, TreeMap) use RB, not AVL.'
                        : kind === 'huffman'
                          ? 'Prefix-free: no code is the start of another code. That is why you can decode without commas.'
                          : kind === 'trie'
                            ? 'Time depends on word length L, not on how many words are stored.'
                            : 'Watch the call stack: enter = push, return = pop. Print is a separate moment.'
            }
          />
          <HistoryPanel entries={history} />
        </div>
      </div>

      <div className="card">
        <h3>Master comparison — pick the model by the law it enforces</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>The law</th>
              <th>Secret representation</th>
              <th>Worst search</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BST</td>
              <td>whole left &lt; node &lt; whole right</td>
              <td>linked nodes</td>
              <td>O(n) if skewed</td>
            </tr>
            <tr>
              <td>AVL</td>
              <td>BST + |BF| ≤ 1</td>
              <td>linked + height</td>
              <td>O(log n)</td>
            </tr>
            <tr>
              <td>Red-Black</td>
              <td>BST + 5 colour laws</td>
              <td>linked + 1 colour bit</td>
              <td>O(log n) (slightly taller than AVL)</td>
            </tr>
            <tr>
              <td>Heap</td>
              <td>parent ≥ children + complete shape</td>
              <td>ARRAY (no pointers)</td>
              <td>O(n) — not a search tree</td>
            </tr>
            <tr>
              <td>B-Tree</td>
              <td>multiway, leaves on one level</td>
              <td>fat nodes = disk pages</td>
              <td>O(log n) node visits</td>
            </tr>
            <tr>
              <td>Huffman</td>
              <td>greedy lightest-two merge</td>
              <td>binary tree of bits</td>
              <td>code length = depth of letter</td>
            </tr>
            <tr>
              <td>Trie</td>
              <td>one letter per edge, shared prefixes</td>
              <td>26-way (or map) children</td>
              <td>O(L)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

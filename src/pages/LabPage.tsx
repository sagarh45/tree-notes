import { useCallback, useState } from 'react'
import { PlaybackBar } from '../components/lab/PlaybackBar'
import { CodePanel } from '../components/lab/CodePanel'
import { VariablesPanel } from '../components/lab/VariablesPanel'
import { ExplanationPanel } from '../components/lab/ExplanationPanel'
import { ComplexityPanel } from '../components/lab/ComplexityPanel'
import { HistoryPanel } from '../components/lab/HistoryPanel'
import { BinaryTreeSvg, Legend } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { usePlayback } from '../hooks/usePlayback'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { LAB_CODE, LAB_PSEUDO, type LabSnippetId } from '../data/labCode'
import { AVL_PACKS, BST_PACKS, BTREE_PACKS, TRAV_PACKS } from '../data/examplePacks'
import { type BinNode, type VisitKind } from '../lib/binaryTree'
import { bstFromSequence } from '../lib/bst'
import { avlFromSequence, type RotKind } from '../lib/avl'
import { bTreeFromSequence, emptyBTree, type BTreeNode } from '../lib/btree'
import { buildTraversalSteps, idleTraversal } from '../engines/traversalLab'
import { buildBstDelete, buildBstInsert, buildBstSearch, idleBst } from '../engines/bstLab'
import { buildAvlInsert, buildRotationDemo, idleAvl } from '../engines/avlLab'
import { buildBTreeInsert, idleBTree } from '../engines/btreeLab'
import type { ComplexityRow, HistoryEntry, TreeKind, TreeStep } from '../types/lab'

const TRAVERSAL_CX: ComplexityRow[] = [
  { op: 'Pre / In / Post', time: 'Θ(n)', space: 'O(h)', note: 'Recursion stack = height' },
  { op: 'Level-order', time: 'Θ(n)', space: 'O(w)', note: 'Queue ≈ widest level' },
]
const BST_CX: ComplexityRow[] = [
  { op: 'Search / Insert / Delete', time: 'O(h)', space: 'O(n)', note: 'h ≈ log n if bushy, h = n if skewed' },
]
const AVL_CX: ComplexityRow[] = [
  { op: 'Search / Insert / Delete', time: 'O(log n)', space: 'O(n)', note: 'Rotations are O(1)' },
]
const BT_CX: ComplexityRow[] = [
  { op: 'Search / Insert / Delete', time: 'O(log n)', space: 'O(n)', note: 'O(log_m n) node visits' },
]

export function LabPage() {
  const [kind, setKind] = useState<TreeKind>('traversal')
  const [travRoot, setTravRoot] = useState<BinNode | null>(null)
  const [bstRoot, setBstRoot] = useState<BinNode | null>(null)
  const [avlRoot, setAvlRoot] = useState<BinNode | null>(null)
  const [btRoot, setBtRoot] = useState<BTreeNode>(() => emptyBTree())
  const [steps, setSteps] = useState<TreeStep[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [value, setValue] = useState('10')
  const [codeMode, setCodeMode] = useState<'code' | 'pseudo'>('code')
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
    setSteps([])
    setHistory([])
    setValue('10')
    playback.restart()
  }, [playback])

  const switchKind = (k: TreeKind) => {
    setKind(k)
    setSteps([])
    if (k === 'btree') setValue('8')
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
    }
    setValue(String(v + 5))
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
      onDelete: runDelete,
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
          : idleBTree(btRoot, 3)

  const current = steps.length && playback.current ? playback.current : idle
  const snippetId = current.codeSnippetId as LabSnippetId
  const codeMap = codeMode === 'code' ? LAB_CODE : LAB_PSEUDO
  const codeText = codeMap[snippetId] ?? LAB_CODE.pre
  const complexity = kind === 'traversal' ? TRAVERSAL_CX : kind === 'bst' ? BST_CX : kind === 'avl' ? AVL_CX : BT_CX

  return (
    <div>
      <div className="card">
        <h2>TREES LAB</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Type a key in the box and press Insert — that is how every tree is built. Or tap any drawn example below.
          No node is created by writing A→left in code.
        </p>
        <div className="tabs" role="tablist" aria-label="Tree type">
          {(
            [
              ['traversal', 'Traversals'],
              ['bst', 'BST'],
              ['avl', 'AVL'],
              ['btree', 'B-Tree'],
            ] as const
          ).map(([k, label]) => (
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
            Key (from user)
            <input value={value} onChange={(e) => setValue(e.target.value)} aria-label="Key" onKeyDown={(e) => e.key === 'Enter' && runInsert()} />
          </label>
          <button type="button" className="btn enq" onClick={runInsert}>
            Insert
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
          <button type="button" className="btn gray" onClick={clearTree}>
            Clear
          </button>
          <button type="button" className="btn warn" onClick={resetAll}>
            Reset empty
          </button>
        </div>
        <p className="muted" style={{ margin: '10px 0 6px', fontWeight: 800 }}>
          Example packs — tap a drawn tree (each one is different)
        </p>
        <div className="ex-row">
          {(kind === 'traversal' ? TRAV_PACKS : kind === 'bst' ? BST_PACKS : kind === 'avl' ? AVL_PACKS : BTREE_PACKS).map(
            (p) => (
              <button key={p.id} type="button" className="pack-card" onClick={() => loadSeq(p.seq)}>
                <div className="pack-title">{p.label}</div>
                {kind === 'btree' ? (
                  <BTreeSvg root={bTreeFromSequence(p.seq, 3).root} compact />
                ) : (
                  <BinaryTreeSvg
                    root={kind === 'avl' ? avlFromSequence(p.seq) : bstFromSequence(p.seq)}
                    showBf={kind === 'avl'}
                    compact
                  />
                )}
              </button>
            ),
          )}
        </div>
        <p className="muted" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
          Shortcuts: <span className="kbd">Space</span> play/pause · <span className="kbd">←</span>{' '}
          <span className="kbd">→</span> steps · <span className="kbd">I</span> insert · <span className="kbd">S</span>{' '}
          search · <span className="kbd">D</span> delete · <span className="kbd">R</span> reset
        </p>
      </div>

      <div className="grid-2">
        <div>
          {kind === 'btree' && current.btree ? (
            <BTreeSvg root={current.btree} highlightId={current.highlightBId} highlightKey={current.highlightKey} />
          ) : (
            <BinaryTreeSvg
              root={current.tree}
              marks={current.marks}
              visitOrder={current.visitOrder}
              showBf={current.showBf || kind === 'avl'}
            />
          )}
          {current.visitList ? (
            <div className="visit-list" aria-label="Visit order">
              {current.visitList.map((v, i) => (
                <span key={`${v}-${i}`} className={`chip${i === current.visitList!.length - 1 ? ' on' : ''}`}>
                  {v}
                </span>
              ))}
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
                ? 'Sorted inserts make a stick (O(n)). That is why AVL exists.'
                : kind === 'avl'
                  ? 'LL = one right rotation. RR = one left. LR / RL = two rotations.'
                  : kind === 'btree'
                    ? 'Height grows only when the root splits, so all leaves stay at one level.'
                    : 'Every node is visited once, so time is always Θ(n).'
            }
          />
          <HistoryPanel entries={history} />
        </div>
      </div>

      <div className="card">
        <h3>Comparison</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Point</th>
              <th>BST</th>
              <th>AVL</th>
              <th>B-Tree</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shape rule</td>
              <td>Left &lt; node &lt; right</td>
              <td>BST + |BF| ≤ 1</td>
              <td>Multiway, leaves at one level</td>
            </tr>
            <tr>
              <td>Worst search</td>
              <td>O(n) if skewed</td>
              <td>O(log n)</td>
              <td>O(log n)</td>
            </tr>
            <tr>
              <td>Insert extra work</td>
              <td>Hang a leaf</td>
              <td>At most two rotations</td>
              <td>Split overflowing nodes</td>
            </tr>
            <tr>
              <td>Typical use</td>
              <td>In-memory search</td>
              <td>Guaranteed log n in RAM</td>
              <td>Databases / disk pages</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { THEORY_SECTIONS } from '../data/theory'
import { THEORY_FIGURES, type Fig } from '../data/figures'
import { TERM_CARDS } from '../data/terms'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { BTreeSvg } from '../components/viz/BTreeSvg'
import { HeapDualViz } from '../components/viz/HeapDualViz'
import { TrieSvg } from '../components/viz/TrieSvg'
import { HuffmanPanel } from '../components/viz/HuffmanPanel'
import { withBalanceFactors } from '../lib/binaryTree'

function TermLegend() {
  return (
    <div className="legend" style={{ margin: '8px 0 16px' }}>
      <span>
        <i style={{ background: 'var(--teal)', borderColor: 'var(--teal)' }} /> this word’s node
      </span>
      <span>
        <i style={{ background: 'var(--green-soft)', borderColor: 'var(--green)' }} /> matching set
      </span>
      <span>
        <i style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)' }} /> path / ancestor
      </span>
      <span>
        <i style={{ background: '#f1f5f9', borderColor: '#cbd5e1' }} /> ignore for this word
      </span>
    </div>
  )
}

function FigureView({ fig }: { fig: Fig }) {
  if (fig.heap) return <HeapDualViz arr={fig.heap} compact />
  if (fig.trie) return <TrieSvg root={fig.trie} compact />
  if (fig.forest?.length) return <HuffmanPanel forest={fig.forest} codes={fig.codes} compact />
  if (fig.btree) return <BTreeSvg root={fig.btree} compact />
  return (
    <BinaryTreeSvg
      root={fig.showBf ? withBalanceFactors(fig.root ?? null) : (fig.root ?? null)}
      showBf={fig.showBf}
      showColor={fig.showColor}
      showIndex={fig.showIndex}
      edgeLabels={fig.edgeLabels}
      threads={fig.threads}
      compact
    />
  )
}

export function TheoryPage() {
  return (
    <div>
      <div className="card">
        <h2>Unit IV — Trees, from first node to every advanced model</h2>
        <p className="muted">
          Core: definition → BST → AVL → B-Tree. Advanced: heap (array IS the tree), Red-Black, Huffman, trie, threads,
          expression trees, B+, reconstruction. Every model has a Law, a Trap, and a drawing. Functions are full C.
          Programs take keys from you — never A→left = … in source.
        </p>
        <div className="toc-grid">
          {THEORY_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </div>
        <p style={{ marginTop: 12 }}>
          <Link className="btn play" to="/lab" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Open Visualizer Lab →
          </Link>{' '}
          <Link className="btn gray" to="/programs" style={{ textDecoration: 'none', display: 'inline-block' }}>
            All C Programs →
          </Link>
        </p>
      </div>

      {THEORY_SECTIONS.map((s) => (
        <article className="card theory-article" id={s.id} key={s.id}>
          <h2>{s.title}</h2>
          <div className="theory-body" dangerouslySetInnerHTML={{ __html: s.body }} />

          {s.id === 'terms' ? (
            <div className="theory-body">
              <TermLegend />
              {TERM_CARDS.map((t) => (
                <div className="term-split" key={t.id} id={`term-${t.id}`}>
                  <div>
                    <div className="term-name">{t.title}</div>
                    <p>
                      <b>Meaning:</b> {t.meaning}
                    </p>
                    <div className="ex">
                      <b>On this drawing:</b> {t.example}
                    </div>
                    <p>
                      <b>Exam line:</b> {t.exam}
                    </p>
                  </div>
                  <div>
                    {t.root ? (
                      <BinaryTreeSvg
                        root={t.root}
                        marks={t.marks}
                        tags={t.tags}
                        visitOrder={t.visitOrder}
                        dimUnmarked
                        compact
                      />
                    ) : null}
                    {t.roots?.length ? (
                      <div className="ex-row" style={{ marginTop: t.root ? 10 : 0 }}>
                        {t.roots.map((r) => (
                          <div key={r.title}>
                            <div className="pack-title">{r.title}</div>
                            <BinaryTreeSvg root={r.root} marks={r.marks} tags={r.tags} dimUnmarked compact />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <p className="muted">{t.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : THEORY_FIGURES[s.id]?.length ? (
            <div className="ex-row">
              {THEORY_FIGURES[s.id]!.map((fig) => (
                <div className="ex-viz" key={fig.title}>
                  <div className="term-name" style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: 8 }}>
                    {fig.title}
                  </div>
                  <FigureView fig={fig} />
                  <p className="muted">{fig.caption}</p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}

      <div className="card tip-card">
        <b>Study path:</b> Core theory (1–16) → Advanced models (17–26) with every drawing → Visualizer (core tabs, then
        Heap / Red-Black / Huffman / Trie) → Programs → Practice. If a Law and a Trap do not stick, replay that example
        pack until the picture and the sentence are the same object.
      </div>
    </div>
  )
}

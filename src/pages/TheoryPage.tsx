import { useEffect, useMemo, useState } from 'react'
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

type Group = 'FOUNDATION' | 'CORE MODELS' | 'ADVANCED' | 'EXAM'

const GROUP_OF: Record<string, Group> = {
  intro: 'FOUNDATION',
  sample: 'FOUNDATION',
  terms: 'FOUNDATION',
  why: 'FOUNDATION',
  binary: 'FOUNDATION',
  shapes: 'FOUNDATION',
  props: 'FOUNDATION',
  repr: 'FOUNDATION',
  general: 'FOUNDATION',
  trav: 'CORE MODELS',
  nonrec: 'CORE MODELS',
  ops: 'CORE MODELS',
  bst: 'CORE MODELS',
  'bst-ops': 'CORE MODELS',
  avl: 'CORE MODELS',
  rot: 'CORE MODELS',
  'avl-ops': 'CORE MODELS',
  'avl-del': 'CORE MODELS',
  multi: 'CORE MODELS',
  bsplit: 'CORE MODELS',
  bsearch: 'CORE MODELS',
  bdel: 'CORE MODELS',
  cx: 'CORE MODELS',
  exam: 'CORE MODELS',
  solved: 'EXAM',
  apps: 'EXAM',
  master: 'EXAM',
}

function groupOf(id: string): Group {
  return GROUP_OF[id] ?? 'ADVANCED'
}

/** Titles in the data still carry old hand-numbers; the page numbers itself. */
function cleanTitle(title: string) {
  return title.replace(/^\d+\.\s*/, '')
}

function TermLegend() {
  return (
    <div className="legend legend-terms">
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
  )
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [ids])
  return active
}

export function TheoryPage() {
  const ids = useMemo(() => THEORY_SECTIONS.map((s) => s.id), [])
  const active = useActiveSection(ids)
  const [query, setQuery] = useState('')

  const figureCount = useMemo(
    () => Object.values(THEORY_FIGURES).reduce((n, list) => n + list.length, 0) + TERM_CARDS.length,
    [],
  )

  const q = query.trim().toLowerCase()
  const matches = useMemo(
    () =>
      q
        ? THEORY_SECTIONS.filter(
            (s) => cleanTitle(s.title).toLowerCase().includes(q) || s.body.toLowerCase().includes(q),
          )
        : THEORY_SECTIONS,
    [q],
  )

  return (
    <div className="theory-shell">
      <aside className="theory-rail" aria-label="Section index">
        <div className="rail-box">
          <div className="rail-head">
            <span className="rail-count">{THEORY_SECTIONS.length}</span>
            <div>
              <b>Sections</b>
              <div className="muted rail-sub">{figureCount} drawn diagrams</div>
            </div>
          </div>
          <input
            className="rail-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter sections…"
            aria-label="Filter sections"
          />
          <nav className="rail-list">
            {THEORY_SECTIONS.map((s, i) => {
              const hidden = q ? !matches.some((m) => m.id === s.id) : false
              const prev = i > 0 ? groupOf(THEORY_SECTIONS[i - 1].id) : null
              const g = groupOf(s.id)
              return (
                <div key={s.id} className={hidden ? 'rail-hidden' : undefined}>
                  {g !== prev ? <div className="rail-group">{g}</div> : null}
                  <a href={`#${s.id}`} className={active === s.id ? 'on' : undefined}>
                    <span className="rail-num">{i + 1}</span>
                    {cleanTitle(s.title)}
                  </a>
                </div>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="theory-main">
        <div className="card hero-band" id="top">
          <div className="hero-kicker">UNIT IV · DATA STRUCTURES</div>
          <h2>Trees — the complete notes, and every single one of them is drawn</h2>
          <p className="muted">
            Definition, description, diagram, worked example, full C function and a live visualizer for every topic.
            Foundation (definition → formulas → representation → general-tree conversion), core models (traversals,
            iterative traversals, tree operations, BST, AVL with deletion, B-Tree with search and deletion), the
            advanced models most notes skip (heap, heap sort, Red-Black, Huffman, trie, threads, expression trees, B+),
            and finally solved exam problems.
          </p>
          <div className="stat-strip">
            <div className="stat">
              <b>{THEORY_SECTIONS.length}</b>
              <span>theory sections</span>
            </div>
            <div className="stat">
              <b>{figureCount}</b>
              <span>drawn diagrams</span>
            </div>
            <div className="stat">
              <b>10</b>
              <span>solved exam problems</span>
            </div>
            <div className="stat">
              <b>8</b>
              <span>live visualizer labs</span>
            </div>
          </div>
          <div className="row hero-actions">
            <Link className="btn play" to="/lab">
              Open Visualizer Lab →
            </Link>
            <Link className="btn enq" to="/programs">
              All C Programs →
            </Link>
            <Link className="btn gray" to="/revise">
              Formula sheet →
            </Link>
          </div>
        </div>

        {q && matches.length === 0 ? (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              Nothing matches “{query}”. Clear the filter to see all {THEORY_SECTIONS.length} sections.
            </p>
          </div>
        ) : null}

        {THEORY_SECTIONS.map((s, i) => {
          const hidden = q ? !matches.some((m) => m.id === s.id) : false
          if (hidden) return null
          const figs = THEORY_FIGURES[s.id] ?? []
          return (
            <article className="card theory-article" id={s.id} key={s.id}>
              <header className="art-head">
                <span className={`art-badge g-${groupOf(s.id).split(' ')[0].toLowerCase()}`}>{groupOf(s.id)}</span>
                <h2>
                  <span className="art-num">{i + 1}</span>
                  {cleanTitle(s.title)}
                </h2>
              </header>
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
              ) : figs.length ? (
                <>
                  <div className="fig-head">
                    Diagrams for this section <span className="fig-pill">{figs.length}</span>
                  </div>
                  <div className="ex-row">
                    {figs.map((fig) => (
                      <figure className="ex-viz" key={fig.title}>
                        <figcaption className="fig-title">{fig.title}</figcaption>
                        <FigureView fig={fig} />
                        <p className="muted">{fig.caption}</p>
                      </figure>
                    ))}
                  </div>
                </>
              ) : null}
              <a className="to-top" href="#top">
                ↑ back to index
              </a>
            </article>
          )
        })}

        <div className="card tip-card">
          <b>Study path:</b> Foundation (1–9) so the vocabulary and formulas are automatic → core models (10–23) where
          every operation has a full C function → the exam block (24, 35–37) for applications, solved problems and the
          master map → advanced models (25–34) to sound senior in the viva. After each section, open the matching
          Visualizer tab and replay one example pack until the Law and the picture are the same object in your head.
        </div>
      </div>
    </div>
  )
}

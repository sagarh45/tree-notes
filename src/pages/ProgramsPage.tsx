import { useMemo, useState } from 'react'
import { PROGRAMS, type Program } from '../data/programs'

const TOPIC_ORDER: NonNullable<Program['topic']>[] = [
  'Binary tree',
  'BST',
  'AVL',
  'B-Tree',
  'Heap',
  'Advanced',
]

const TOPIC_NOTE: Record<string, string> = {
  'Binary tree': 'Structure, traversals (recursive and iterative) and the query functions.',
  BST: 'The search rule: search, insert, all three delete cases, and every utility built on the sorted in-order.',
  AVL: 'Balance factors, the four rotations, and the harder delete path.',
  'B-Tree': 'Multiway search: median splits, in-node scanning, sorted traversal.',
  Heap: 'The array that IS a tree — swim, sink, and heap sort.',
  Advanced: 'Huffman, tries, expression trees, threads, general-tree conversion and reconstruction.',
}

export function ProgramsPage() {
  const [activeId, setActiveId] = useState(PROGRAMS[0].id)
  const [copied, setCopied] = useState(false)
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const byTopic = new Map<string, Program[]>()
    for (const t of TOPIC_ORDER) byTopic.set(t, [])
    for (const p of PROGRAMS) {
      const t = p.topic ?? 'Advanced'
      if (!byTopic.has(t)) byTopic.set(t, [])
      byTopic.get(t)!.push(p)
    }
    return [...byTopic.entries()].filter(([, list]) => list.length > 0)
  }, [])

  /** Sidebar order = grouped order, so the numbers match what the user sees. */
  const ordered = useMemo(() => grouped.flatMap(([, list]) => list), [grouped])
  const numberOf = useMemo(() => {
    const m = new Map<string, number>()
    ordered.forEach((p, i) => m.set(p.id, i + 1))
    return m
  }, [ordered])

  const q = query.trim().toLowerCase()
  const shows = (p: Program) =>
    !q || p.title.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)

  const prog = PROGRAMS.find((p) => p.id === activeId) ?? PROGRAMS[0]
  const lines = useMemo(() => prog.code.replace(/\r\n/g, '\n').split('\n'), [prog])

  const copy = async () => {
    await navigator.clipboard.writeText(prog.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div>
      <div className="card hero-band">
        <div className="hero-kicker">C PROGRAMS</div>
        <h2>{PROGRAMS.length} complete programs — you type every key, nothing is hard-coded</h2>
        <p className="muted">
          Each program is general and menu driven with <code>scanf</code>. There is no{' '}
          <code>A-&gt;left = new_node(...)</code> anywhere in the source: the tree is always built by calling{' '}
          <code>insert()</code> with keys you enter. Every listing compiles as-is in C.
        </p>
        <div className="stat-strip">
          <div className="stat">
            <b>{PROGRAMS.length}</b>
            <span>programs</span>
          </div>
          <div className="stat">
            <b>{grouped.length}</b>
            <span>topics</span>
          </div>
          <div className="stat">
            <b>{PROGRAMS.reduce((n, p) => n + p.code.split('\n').length, 0)}</b>
            <span>lines of C</span>
          </div>
          <div className="stat">
            <b>0</b>
            <span>hard-coded nodes</span>
          </div>
        </div>
      </div>

      <div className="prog-layout">
        <aside className="card prog-side" aria-label="Program list">
          <h3 style={{ marginBottom: 8 }}>Program list</h3>
          <input
            className="rail-search"
            style={{ width: '100%' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or code…"
            aria-label="Search programs"
          />
          {grouped.map(([topic, list]) => {
            const visible = list.filter(shows)
            if (!visible.length) return null
            return (
              <div key={topic}>
                <div className="rail-group">{topic}</div>
                {TOPIC_NOTE[topic] ? <p className="prog-topic-note">{TOPIC_NOTE[topic]}</p> : null}
                {visible.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={p.id === activeId ? 'prog-item active' : 'prog-item'}
                    onClick={() => setActiveId(p.id)}
                  >
                    <span className="prog-num">{numberOf.get(p.id)}</span>
                    {p.title}
                  </button>
                ))}
              </div>
            )
          })}
          {q && !PROGRAMS.some(shows) ? (
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              Nothing matches “{query}”.
            </p>
          ) : null}
        </aside>

        <div className="card prog-main">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="art-badge g-core">{prog.topic ?? 'Advanced'}</span>
              <h2 style={{ marginBottom: 4 }}>
                {numberOf.get(prog.id)}. {prog.title}
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                {prog.source} · {lines.length} lines
              </p>
            </div>
            <div className="row">
              <button type="button" className="btn gray" onClick={copy}>
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button
                type="button"
                className="btn play"
                onClick={() => window.open('https://onecompiler.com/c', '_blank', 'noopener,noreferrer')}
              >
                ▶ Run on OneCompiler
              </button>
            </div>
          </div>
          <p>{prog.blurb}</p>
          <div className="code-panel">
            <div className="head">
              <span>{prog.id}.c</span>
              <span>C · {lines.length} lines</span>
            </div>
            <pre>
              {lines.map((line, i) => (
                <span className="code-line" key={i}>
                  <span className="code-ln">{i + 1}</span>
                  {line || ' '}
                </span>
              ))}
            </pre>
          </div>
          <p className="muted" style={{ fontSize: '0.88rem' }}>
            How to use it: copy the code, paste it into OneCompiler, press Run, then type the keys when it asks. Feed
            the <b>same</b> keys into the matching Visualizer tab and the two outputs must agree step for step — that
            is how you know you understood it and not just memorised it.
          </p>
        </div>
      </div>

      <div className="card tip-card">
        <b>Exam habit:</b> when they ask “write a program”, they want the struct, the function, and a{' '}
        <code>main</code> that reads input. Write the struct first, then the one function they asked about, then a tiny
        main with <code>scanf</code>. Never invent nodes in source — that is the fastest way to lose marks for
        “program is not general”.
      </div>
    </div>
  )
}

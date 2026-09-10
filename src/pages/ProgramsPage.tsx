import { useMemo, useState } from 'react'
import { PROGRAMS } from '../data/programs'

export function ProgramsPage() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const prog = PROGRAMS[active]
  const lines = useMemo(() => prog.code.replace(/\r\n/g, '\n').split('\n'), [prog])

  const copy = async () => {
    await navigator.clipboard.writeText(prog.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div>
      <div className="card">
        <h2>All Tree Programs (C)</h2>
        <p className="muted">
          Every program is general. You type n and the keys. No <code>A-&gt;left = new_node(...)</code>. Copy and run on
          OneCompiler.
        </p>
      </div>

      <div className="prog-layout">
        <aside className="card prog-side" aria-label="Program list">
          <h3>Program List ({PROGRAMS.length})</h3>
          {PROGRAMS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={i === active ? 'prog-item active' : 'prog-item'}
              onClick={() => setActive(i)}
            >
              {p.title}
            </button>
          ))}
        </aside>

        <div className="card prog-main">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>{prog.title}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {prog.source}
              </p>
            </div>
            <div className="row">
              <button type="button" className="btn gray" onClick={copy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                className="btn play"
                onClick={() => window.open('https://onecompiler.com/c', '_blank', 'noopener,noreferrer')}
              >
                ▶ Run Real (OneCompiler)
              </button>
            </div>
          </div>
          <p>{prog.blurb}</p>
          <div className="code-panel">
            <div className="head">
              <span>{prog.id}.c</span>
              <span>C Program</span>
            </div>
            <pre>
              {lines.map((line, i) => (
                <span className="code-line" key={i}>
                  <span style={{ color: '#64748b', display: 'inline-block', width: 36 }}>{i + 1}</span>
                  {line || ' '}
                </span>
              ))}
            </pre>
          </div>
          <p className="muted" style={{ fontSize: '0.88rem' }}>
            Tip: Copy → paste into OneCompiler → Run. Match output with Visualizer Lab behaviour.
          </p>
        </div>
      </div>
    </div>
  )
}

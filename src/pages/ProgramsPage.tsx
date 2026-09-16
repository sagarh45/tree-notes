import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Copy, Download, ExternalLink } from 'lucide-react'
import { PROGRAM_CATALOG } from '../data/programCatalog'

const GROUPS = ['Binary tree', 'BST', 'AVL', 'B-Tree', 'Heap', 'Advanced']
const ORDERED = GROUPS.flatMap(group => PROGRAM_CATALOG.filter(p => (p.topic ?? 'Advanced') === group))

export function ProgramsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const q = query.trim().toLowerCase()
  const visible = ORDERED.filter(p => !q || `${p.title} ${p.blurb} ${p.code}`.toLowerCase().includes(q))
  const requested = params.get('program')
  const prog = visible.find(p => p.id === requested) ?? visible[0]
  const select = (id: string) => { setParams({ program: id }); setStatus('') }
  const copy = async () => {
    if (!prog) return
    try { await navigator.clipboard.writeText(prog.code); setStatus('Code copied.') }
    catch { setStatus('Clipboard unavailable. Download the C file instead.') }
  }
  const download = () => {
    if (!prog) return
    const url = URL.createObjectURL(new Blob([prog.code], { type: 'text/x-c;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${prog.id}.c`
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div>
      <header className="notes-heading">
        <p className="eyebrow">UNIT IV / C</p>
        <h2>Programs</h2>
        <p className="muted">{PROGRAM_CATALOG.length} complete listings / Binary tree, BST, AVL and more</p>
      </header>
      <div className="prog-layout">
        <aside className="prog-side" aria-label="Program list">
          <label className="program-search-label">Search programs
            <input className="rail-search" value={query} onChange={e => { setQuery(e.target.value); setStatus('') }} placeholder="Title or code" />
          </label>
          <label className="program-mobile-select">Program
            <select value={prog?.id ?? ''} disabled={!visible.length} onChange={e => select(e.target.value)}>
              {!visible.length ? <option value="">No matching programs</option> : null}
              {visible.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </label>
          <div className="program-desktop-list">
            {GROUPS.map(group => {
              const items = visible.filter(p => (p.topic ?? 'Advanced') === group)
              return items.length ? <div key={group}><div className="rail-group">{group}</div>{items.map(p => (
                <button key={p.id} type="button" className={p.id === prog?.id ? 'prog-item active' : 'prog-item'} aria-current={p.id === prog?.id ? 'true' : undefined} onClick={() => select(p.id)}>
                  <span className="prog-num">{ORDERED.indexOf(p) + 1}</span>{p.title}
                </button>
              ))}</div> : null
            })}
          </div>
          <p className="muted notes-result" role="status">{visible.length} programs</p>
        </aside>
        {prog ? <section className="prog-main">
          <div className="program-heading">
            <div>
              <p className="eyebrow">{prog.topic ?? 'Advanced'}</p>
              <h2>{prog.title}</h2>
              <p className="muted">{prog.blurb}</p>
            </div>
            <div className="row program-actions">
              <button className="icon-button" title="Copy code" aria-label="Copy code" onClick={copy}>{status === 'Code copied.' ? <Check size={19} /> : <Copy size={19} />}</button>
              <button className="icon-button" title="Download C file" aria-label="Download C file" onClick={download}><Download size={19} /></button>
              <a className="icon-button" title="Open C compiler" aria-label="Open C compiler" href="https://onecompiler.com/c" target="_blank" rel="noreferrer"><ExternalLink size={19} /></a>
            </div>
          </div>
          <div className="copy-status" role="status">{status}</div>
          {prog.topicId ? <Link className="topic-program-link" to={`/theory#${prog.topicId}`}>Related theory</Link> : null}
          <div className="code-panel">
            <div className="head"><span>{prog.id}.c</span><span>C</span></div>
            <pre><code>{prog.code}</code></pre>
          </div>
          {prog.input ? <div className="tb-output"><b>Sample input</b><pre>{prog.input}</pre></div> : null}
          {prog.output ? <div className="tb-output"><b>Sample output</b><pre>{prog.output}</pre></div> : null}
        </section> : <section className="notes-empty"><h3>No matching programs</h3><button className="btn gray" onClick={() => setQuery('')}>Clear search</button></section>}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PROGRAM_CATALOG } from '../data/programCatalog'
import { programInput } from '../data/programInputs'
import { CodePanel } from '../components/CodePanel'

const GROUPS = ['Binary tree', 'BST', 'AVL', 'B-Tree', 'Heap', 'Advanced']
const ORDERED = GROUPS.flatMap(group => PROGRAM_CATALOG.filter(p => (p.topic ?? 'Advanced') === group))

export function ProgramsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const visible = ORDERED.filter(p => !q || `${p.title} ${p.blurb} ${p.code}`.toLowerCase().includes(q))
  const requested = params.get('program')
  const prog = visible.find(p => p.id === requested) ?? visible[0]
  const select = (id: string) => setParams({ program: id })

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
            <input className="rail-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title or code" />
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
          </div>
          {prog.topicId ? <Link className="topic-program-link" to={`/theory#${prog.topicId}`}>Related theory</Link> : null}
          <CodePanel key={prog.id} title={`${prog.id}.c`} code={prog.code} sampleInput={programInput(prog)} />
          {prog.output ? <div className="tb-output"><b>Expected sample output</b><pre>{prog.output}</pre></div> : null}
        </section> : <section className="notes-empty"><h3>No matching programs</h3><button className="btn gray" onClick={() => setQuery('')}>Clear search</button></section>}
      </div>
    </div>
  )
}

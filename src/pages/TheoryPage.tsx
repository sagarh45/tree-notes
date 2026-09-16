import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUp, Search, X } from 'lucide-react'
import { TopicCard } from '../components/theory/TopicCard'
import { CHAPTERS, ALL_TOPICS } from '../data/syllabus'
import { CORE_CHAPTERS } from '../data/syllabus/coverage'

const SEARCH_TEXT = new Map(ALL_TOPICS.map(t => [t.id, JSON.stringify(t).replace(/<[^>]*>/g, ' ').toLowerCase()]))
const TOPIC_NUMBERS = new Map(CHAPTERS.flatMap(ch => ch.topics.map((t, i) => [t.id, `${ch.number}.${i + 1}`])))

function useActiveId(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    let frame = 0
    const update = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])
  return ids.includes(active) ? active : (ids[0] ?? '')
}

export function TheoryPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('all')
  const [chapter, setChapter] = useState('all')
  const q = query.trim().toLowerCase()
  const shown = useMemo(() => CHAPTERS
    .filter(ch => (scope === 'all' || CORE_CHAPTERS.has(ch.id)) && (chapter === 'all' || chapter === ch.id))
    .map(ch => ({ ...ch, topics: ch.topics.filter(t => !q ||
      `${ch.title} ${ch.syllabus}`.toLowerCase().includes(q) || SEARCH_TEXT.get(t.id)?.includes(q)) }))
    .filter(ch => ch.topics.length), [scope, chapter, q])
  const ids = useMemo(() => shown.flatMap(ch => ch.topics.map(t => t.id)), [shown])
  const active = useActiveId(ids)

  useEffect(() => {
    if (!hash) return
    setQuery('')
    setScope('all')
    setChapter('all')
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [hash])

  const reset = () => { setQuery(''); setScope('all'); setChapter('all') }
  const jump = (id: string) => {
    navigate(`#${id}`)
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="theory-shell" id="top">
      <aside className="theory-rail" aria-label="Syllabus index">
        <div className="rail-box">
          <div className="rail-head"><b>Chapter index</b><span className="muted">{ids.length} topics</span></div>
          <nav className="rail-list">
            {shown.map(ch => (
              <div key={ch.id}>
                <div className="rail-group">{ch.number}. {ch.title}</div>
                {ch.topics.map(t => (
                  <Link key={t.id} to={`#${t.id}`} className={active === t.id ? 'on' : undefined} aria-current={active === t.id ? 'location' : undefined}>
                    <span className="rail-num">{TOPIC_NUMBERS.get(t.id)}</span>
                    {t.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <div className="theory-main">
        <header className="notes-heading">
          <p className="eyebrow">UNIT IV / WIT 2026-27</p>
          <h2>Trees</h2>
          <p className="muted">Nodes, branches, searching and balancing.</p>
        </header>
        <div className="notes-controls">
          <div className="scope-tabs" role="group" aria-label="Reading scope">
            <button type="button" aria-pressed={scope === 'all'} onClick={() => setScope('all')}>All notes</button>
            <button type="button" aria-pressed={scope === 'core'} onClick={() => { setScope('core'); setChapter('all') }}>Syllabus focus</button>
          </div>
          <label className="notes-search">
            <Search size={18} aria-hidden="true" />
            <input aria-label="Search notes" placeholder="Search topic, algorithm or code" value={query} onChange={e => setQuery(e.target.value)} />
            {query ? <button className="icon-button" title="Clear search" aria-label="Clear search" onClick={() => setQuery('')}><X size={17} /></button> : null}
          </label>
          <label className="chapter-select">Chapter
            <select value={chapter} onChange={e => setChapter(e.target.value)}>
              <option value="all">All chapters</option>
              {CHAPTERS.filter(ch => scope === 'all' || CORE_CHAPTERS.has(ch.id)).map(ch => <option key={ch.id} value={ch.id}>{ch.number}. {ch.title}</option>)}
            </select>
          </label>
          <label className="theory-mobile-jump">Topic
            <select aria-label="Jump to topic" value={active} disabled={!ids.length} onChange={e => jump(e.target.value)}>
              {!ids.length ? <option value="">No matching topics</option> : null}
              {shown.map(ch => <optgroup key={ch.id} label={ch.title}>{ch.topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>)}
            </select>
          </label>
          <span className="notes-result" role="status">{ids.length} of {ALL_TOPICS.length} topics</span>
        </div>

        {!ids.length ? <div className="notes-empty"><h3>No matching topics</h3><p className="muted">{query ? `No results for "${query}".` : 'This selection has no topics.'}</p><button className="btn gray" onClick={reset}>Clear filters</button></div> : null}
        {shown.map(ch => (
          <section key={ch.id} id={ch.id} className="chapter-block">
            <header className="ch-banner">
              <div>
                <div className="ch-kicker">Chapter {ch.number} / {CORE_CHAPTERS.has(ch.id) ? 'Syllabus focus' : 'Extra reading'}</div>
                <h2>{ch.title}</h2>
                <p className="muted">{ch.syllabus}</p>
              </div>
            </header>
            {ch.topics.map(t => <TopicCard key={t.id} topic={t} number={TOPIC_NUMBERS.get(t.id)!} />)}
          </section>
        ))}
        <a className="to-top" href="#top"><ArrowUp size={16} aria-hidden="true" /> Back to top</a>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Search, X } from 'lucide-react'
import { COURSE, COURSE_TOPICS, LEGACY_POINTS, lessonForTopic } from '../data/course'
import { TopicCard } from '../components/theory/TopicCard'
import '../course.css'

export function TheoryEntry() {
  const { hash } = useLocation()
  const point = lessonForTopic(hash.slice(1))
  return <Navigate to={point ? `/?point=${point}${hash === '#avl-rot' ? '#avl-double' : hash}` : hash ? `/reference${hash}` : '/?point=tree-basics'} replace />
}

export function CoursePage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { hash } = useLocation()
  const [search, setSearch] = useState('')
  const requested = params.get('point') ?? params.get('topic')
  const legacy = requested ? LEGACY_POINTS[requested] : undefined
  const lesson = COURSE.find(p => p.id === (legacy?.point ?? requested)) ?? COURSE[0]
  const index = COURSE.indexOf(lesson)
  const q = search.trim().toLowerCase()
  const matches = q ? COURSE.flatMap(l => l.topics.filter(id => {
    const t = COURSE_TOPICS.get(id)!
    return `${t.title} ${t.definition}`.toLowerCase().includes(q)
  }).map(id => ({ lesson: l, topic: COURSE_TOPICS.get(id)! }))) : []

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      else window.scrollTo({ top: 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [lesson.id, hash])

  if (legacy) return <Navigate replace to={`/?point=${hash ? lessonForTopic(hash.slice(1)) ?? legacy.point : legacy.point}${hash || (legacy.topic ? `#${legacy.topic}` : '')}`} />

  return <div className="course-layout">
    <aside className="course-index" aria-label="Master syllabus">
      <div className="course-index-title"><BookOpen size={18} /><b>Unit IV syllabus</b><span>{COURSE.length} sections</span></div>
      <nav>{COURSE.map((l, i) => <Link key={l.id} to={`/?point=${l.id}`} aria-current={l.id === lesson.id ? 'page' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{l.title}</Link>)}</nav>
      <Link className="course-reference" to="/reference">Extra reference notes <ArrowRight size={16} /></Link>
    </aside>
    <div className="course-content">
      <div className="course-mobile-point"><label htmlFor="syllabus-point">Section</label><select id="syllabus-point" value={lesson.id} onChange={e => setParams({ point: e.target.value })}>{COURSE.map((l, i) => <option key={l.id} value={l.id}>{i + 1}. {l.title}</option>)}</select><label htmlFor="syllabus-topic">Topic</label><select id="syllabus-topic" value={lesson.topics.includes(hash.slice(1)) ? hash.slice(1) : ''} onChange={e => navigate(`/?point=${lesson.id}#${e.target.value}`)}><option value="">All topics</option>{lesson.groups.map(group => <optgroup key={group.title} label={group.title}>{group.topics.map(id => <option key={id} value={id}>{index + 1}.{lesson.topics.indexOf(id) + 1} {COURSE_TOPICS.get(id)!.title}</option>)}</optgroup>)}</select></div>
      <header className="course-heading" id="lesson-top">
        <p className="eyebrow">UNIT IV / SECTION {index + 1} OF {COURSE.length}</p>
        <h2>{lesson.title}</h2><p>{lesson.description}</p>
      </header>
      <label className="notes-search course-search"><Search size={18} /><input aria-label="Find a syllabus topic" placeholder="Find a syllabus topic" value={search} onChange={e => setSearch(e.target.value)} />{q ? <button className="icon-button" title="Clear search" aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button> : null}</label>
      {q ? <div className="course-search-results" role="region" aria-label="Search results"><p role="status">{matches.length} matching topics</p>{matches.map(({ lesson: l, topic }) => <Link key={topic.id} to={`/?point=${l.id}#${topic.id}`} onClick={() => setSearch('')}><span>{l.title}</span><b>{topic.title}</b><ArrowRight size={16} /></Link>)}</div> : null}
      <nav className="lesson-contents" aria-label="Section topics">{lesson.groups.map(group => <div className="lesson-contents-group" key={group.title}><h3>{group.title}</h3>{group.topics.map(id => <Link key={id} to={`/?point=${lesson.id}#${id}`}><span>{index + 1}.{lesson.topics.indexOf(id) + 1}</span>{COURSE_TOPICS.get(id)!.title}</Link>)}</div>)}</nav>
      <div key={lesson.id} className="lesson-topics">{lesson.groups.map(group => <section key={group.title} className="lesson-group"><h2 className="lesson-group-title">{group.title}</h2>{group.topics.map(id => <TopicCard key={id} topic={COURSE_TOPICS.get(id)!} number={`${index + 1}.${lesson.topics.indexOf(id) + 1}`} lesson />)}</section>)}</div>
      <nav className="lesson-pagination" aria-label="Study sequence">
        {index > 0 ? <Link to={`/?point=${COURSE[index - 1].id}`}><ArrowLeft size={18} /><span><small>Previous section</small>{COURSE[index - 1].title}</span></Link> : <span />}
        {index < COURSE.length - 1 ? <Link to={`/?point=${COURSE[index + 1].id}`}><span><small>Next section</small>{COURSE[index + 1].title}</span><ArrowRight size={18} /></Link> : <Link to="/practice"><span><small>Next</small>Practice questions</span><ArrowRight size={18} /></Link>}
      </nav>
    </div>
  </div>
}

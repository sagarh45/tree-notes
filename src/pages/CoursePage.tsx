import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Search, X } from 'lucide-react'
import { COURSE, COURSE_TOPICS, lessonForTopic } from '../data/course'
import { TopicCard } from '../components/theory/TopicCard'
import '../course.css'

export function TheoryEntry() {
  const { hash } = useLocation()
  const point = lessonForTopic(hash.slice(1))
  return <Navigate to={point ? `/?point=${point}${hash}` : hash ? `/reference${hash}` : '/?point=definition'} replace />
}

export function CoursePage() {
  const [params, setParams] = useSearchParams()
  const { hash } = useLocation()
  const [search, setSearch] = useState('')
  const requested = params.get('point') ?? params.get('topic')
  const lesson = COURSE.find(p => p.id === requested) ?? COURSE[0]
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

  return <div className="course-layout">
    <aside className="course-index" aria-label="Master syllabus">
      <div className="course-index-title"><BookOpen size={18} /><b>Unit IV syllabus</b><span>10 points</span></div>
      <nav>{COURSE.map((l, i) => <Link key={l.id} to={`/?point=${l.id}`} aria-current={l.id === lesson.id ? 'page' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{l.title}</Link>)}</nav>
      <Link className="course-reference" to="/reference">Extra reference notes <ArrowRight size={16} /></Link>
    </aside>
    <div className="course-content">
      <div className="course-mobile-point"><label htmlFor="syllabus-point">Syllabus point</label><select id="syllabus-point" value={lesson.id} onChange={e => setParams({ point: e.target.value })}>{COURSE.map((l, i) => <option key={l.id} value={l.id}>{i + 1}. {l.title}</option>)}</select></div>
      <header className="course-heading" id="lesson-top">
        <p className="eyebrow">UNIT IV / POINT {index + 1} OF 10</p>
        <h2>{lesson.title}</h2><p>{lesson.description}</p>
      </header>
      <label className="notes-search course-search"><Search size={18} /><input aria-label="Find a syllabus topic" placeholder="Find a syllabus topic" value={search} onChange={e => setSearch(e.target.value)} />{q ? <button className="icon-button" title="Clear search" aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button> : null}</label>
      {q ? <div className="course-search-results" role="region" aria-label="Search results"><p role="status">{matches.length} matching topics</p>{matches.map(({ lesson: l, topic }) => <Link key={topic.id} to={`/?point=${l.id}#${topic.id}`} onClick={() => setSearch('')}><span>{l.title}</span><b>{topic.title}</b><ArrowRight size={16} /></Link>)}</div> : null}
      <nav className="lesson-contents" aria-label="This point">{lesson.topics.map((id, i) => <Link key={id} to={`/?point=${lesson.id}#${id}`}><span>{index + 1}.{i + 1}</span>{COURSE_TOPICS.get(id)!.title}</Link>)}</nav>
      <div key={lesson.id} className="lesson-topics">{lesson.topics.map((id, i) => <TopicCard key={id} topic={COURSE_TOPICS.get(id)!} number={`${index + 1}.${i + 1}`} lesson />)}</div>
      <nav className="lesson-pagination" aria-label="Study sequence">
        {index > 0 ? <Link to={`/?point=${COURSE[index - 1].id}`}><ArrowLeft size={18} /><span><small>Previous point</small>{COURSE[index - 1].title}</span></Link> : <span />}
        {index < COURSE.length - 1 ? <Link to={`/?point=${COURSE[index + 1].id}`}><span><small>Next point</small>{COURSE[index + 1].title}</span><ArrowRight size={18} /></Link> : <Link to="/practice"><span><small>Next</small>Practice questions</span><ArrowRight size={18} /></Link>}
      </nav>
    </div>
  </div>
}

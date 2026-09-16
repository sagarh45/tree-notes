import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { BinaryTreeSvg } from '../components/viz/BinaryTreeSvg'
import { bstFromSequence } from '../lib/bst'
import { CHAPTERS, ALL_TOPICS } from '../data/syllabus'
import { CORE_CHAPTERS, SYLLABUS_POINTS } from '../data/syllabus/coverage'
import { PROGRAM_CATALOG } from '../data/programCatalog'

const SAMPLE = bstFromSequence([30, 20, 40, 10, 25])

export function HomePage() {
  return (
    <div>
      <header className="notes-heading">
        <p className="eyebrow">WIT / 25ITU3CC2T / UNIT IV</p>
        <h2>Trees</h2>
        <p className="muted">7 teaching hours / {CHAPTERS.length} chapters / {ALL_TOPICS.length} topics / {PROGRAM_CATALOG.length} C programs</p>
      </header>
      <div className="syllabus-layout">
        <section>
          <h3 className="section-title">Syllabus 2026-27</h3>
          <div className="syllabus-points">
            {SYLLABUS_POINTS.map((point, i) => (
              <Link key={point.topic} to={`/theory#${point.topic}`}><span className="syllabus-point-number">{i + 1}</span><span>{point.title}</span><ArrowRight size={18} aria-hidden="true" /></Link>
            ))}
          </div>
        </section>
        <section className="tree-exercise">
          <h3 className="section-title">Read this tree</h3>
          <BinaryTreeSvg root={SAMPLE} edgeLabels />
          <p>Root, leaf nodes aur height kya hain?</p>
          <details><summary>Answer</summary><p>Root: <b>30</b>. Leaves: <b>10, 25, 40</b>. Height: <b>2 edges</b>. In-order: <b>10, 20, 25, 30, 40</b>.</p></details>
          <Link className="topic-program-link" to="/lab?tab=bst">BST lab <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </div>
      <section className="chapter-directory">
        <h3 className="section-title">All chapters</h3>
        <div className="chapter-directory-list">
          {CHAPTERS.map(ch => (
            <Link key={ch.id} to={`/theory#${ch.id}`}>
              <span className="chapter-directory-number">{String(ch.number).padStart(2, '0')}</span>
              <span><b>{ch.title}</b><small>{ch.topics.length} topics / {CORE_CHAPTERS.has(ch.id) ? 'Syllabus focus' : 'Extra reading'}</small></span>
              <BookOpen size={19} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

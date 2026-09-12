import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../menu.css'

const SYLLABUS_TABS = [
  ['definition', '1. Definition'],
  ['traversal', '2. Traversal'],
  ['linked', '3. Linked Implementation'],
  ['binary-ops', '4. Binary Tree Operations'],
  ['bst-ops', '5. BST Operations'],
  ['multiway', '6. Multiway Trees'],
  ['btree', '7. B-Trees'],
  ['avl', '8. AVL Tree & Rotations'],
] as const

export function AppShell() {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const selected = pathname === '/' ? (params.get('topic') ?? 'definition') : ''

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('trees-theme', 'light')
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, selected, params.get('view')])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="app-shell course-shell">
      <div className="read-bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="app-header course-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="34" height="34" role="presentation">
              <line x1="20" y1="11" x2="11" y2="24" />
              <line x1="20" y1="11" x2="29" y2="24" />
              <line x1="11" y1="24" x2="6" y2="34" />
              <line x1="11" y1="24" x2="16" y2="34" />
              <line x1="29" y1="24" x2="34" y2="34" />
              <circle cx="20" cy="11" r="5" />
              <circle cx="11" cy="24" r="4.4" />
              <circle cx="29" cy="24" r="4.4" />
              <circle cx="6" cy="34" r="3.6" />
              <circle cx="16" cy="34" r="3.6" />
              <circle cx="34" cy="34" r="3.6" />
            </svg>
          </span>
          <div>
            <h1>Unit IV — Trees</h1>
            <p>Main menu follows the syllabus. Open one point, then study Theory, Visualization and Program inside it.</p>
          </div>
        </div>
      </header>

      <nav className="nav-bar syllabus-heading-tabs" aria-label="Unit IV syllabus headings">
        {SYLLABUS_TABS.map(([id, label]) => (
          <Link
            key={id}
            to={`/?topic=${id}&view=theory`}
            className={selected === id ? 'active' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <main className="main course-main">
        <Outlet />
      </main>

      <footer className="app-footer course-footer">
        <b>Unit IV — Trees.</b> Complete one syllabus point fully: Theory → Visualization → Program, then move to the next point.
      </footer>
    </div>
  )
}

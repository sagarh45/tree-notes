import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import '../menu.css'

const SYLLABUS_POINTS = [
  ['definition', '1', 'Definition'],
  ['traversal', '2', 'Traversal'],
  ['linked', '3', 'Linked Implementation'],
  ['binary-ops', '4', 'Binary Tree Operations'],
  ['bst-ops', '5', 'BST Operations'],
  ['multiway', '6', 'Multiway Trees'],
  ['btree', '7', 'B-Trees'],
  ['avl', '8', 'AVL Tree'],
  ['single-rotation', '9', 'Single Rotation'],
  ['double-rotation', '10', 'Double Rotation'],
] as const

export function AppShell() {
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

  return (
    <div className="app-shell syllabus-app">
      <header className="unit-header">
        <div>
          <div className="unit-badge">DATA STRUCTURES · UNIT IV · 7 HOURS</div>
          <h1>Unit IV — Trees</h1>
          <p>Choose a syllabus point from the menu. Inside every point: Theory → Visualization → Program.</p>
        </div>
      </header>

      <section className="syllabus-menu-wrap">
        <div className="syllabus-menu-title">SYLLABUS POINTS</div>
        <nav className="syllabus-menu-grid" aria-label="Unit IV syllabus points">
          {SYLLABUS_POINTS.map(([id, no, label]) => (
            <Link
              key={id}
              to={`/?topic=${id}&view=theory`}
              className={selected === id ? 'active' : undefined}
            >
              <span className="menu-no">{no}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </section>

      <main className="main syllabus-main">
        <Outlet />
      </main>

      <footer className="syllabus-footer">
        Unit IV teaching flow: select one syllabus point → finish Theory → Visualization → Program → move to the next point.
      </footer>
    </div>
  )
}

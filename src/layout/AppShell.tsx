import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../menu.css'

const SYLLABUS_MENU = [
  ['/definition', '1. Definition', 'Definition'],
  ['/traversal', '2. Traversal', 'Traversal'],
  ['/linked-implementation', '3. Linked Implementation', 'Linked'],
  ['/binary-tree-operations', '4. Binary Tree Operations', 'BT Ops'],
  ['/bst-operations', '5. BST Operations', 'BST Ops'],
  ['/multiway-trees', '6. Multiway Trees', 'Multiway'],
  ['/b-trees', '7. B-Trees', 'B-Tree'],
  ['/avl-tree', '8. AVL Tree', 'AVL'],
  ['/single-rotation', '9. Single Rotation', 'Single'],
  ['/double-rotation', '10. Double Rotation', 'Double'],
] as const

const TOPIC_CLASS: Record<string, string> = {
  '/definition': 'topic-definition',
  '/traversal': 'topic-traversal',
  '/linked-implementation': 'topic-linked',
  '/binary-tree-operations': 'topic-binary-ops',
  '/bst-operations': 'topic-bst',
  '/multiway-trees': 'topic-multiway',
  '/b-trees': 'topic-btree',
  '/avl-tree': 'topic-avl',
  '/single-rotation': 'topic-single-rotation',
  '/double-rotation': 'topic-double-rotation',
}

export function AppShell() {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()
  const topicClass = TOPIC_CLASS[pathname] ?? ''

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('trees-theme', 'light')
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

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
    <div className={`app-shell syllabus-app ${topicClass}`}>
      <div className="read-bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="app-header">
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
            <p>Select a syllabus point. Everything for that point stays together: theory, steps, visualization, trace and C program.</p>
          </div>
        </div>
      </header>

      <nav className="nav-bar syllabus-menu" aria-label="Unit IV syllabus menu">
        {SYLLABUS_MENU.map(([to, label]) => (
          <NavLink key={to} to={to} end>
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <b>Unit IV — Trees.</b> Menu follows the syllabus. Finish one point completely, then move to the next.
        <div className="footer-tools">
          <NavLink to="/lab">Live Visualizer</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/revise">Revision</NavLink>
        </div>
      </footer>

      <nav className="bottom-nav syllabus-bottom" aria-label="Mobile syllabus menu">
        {SYLLABUS_MENU.slice(0, 5).map(([to, , short]) => (
          <NavLink key={to} to={to} end>{short}</NavLink>
        ))}
      </nav>
    </div>
  )
}

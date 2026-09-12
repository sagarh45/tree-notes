import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../menu.css'

const SYLLABUS_MENU = [
  ['definition', '1. Definition'],
  ['traversal', '2. Traversal'],
  ['linked', '3. Linked Implementation'],
  ['binary-ops', '4. Binary Tree Operations'],
  ['bst', '5. BST Operations'],
  ['multiway', '6. Multiway Trees'],
  ['btree', '7. B-Trees'],
  ['avl', '8. AVL Tree'],
  ['single-rotation', '9. Single Rotation'],
  ['double-rotation', '10. Double Rotation'],
] as const

export function AppShell() {
  const [progress, setProgress] = useState(0)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('trees-theme', 'light')
  }, [])

  useEffect(() => {
    if (pathname === '/' && hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else if (!hash) {
      window.scrollTo({ top: 0 })
    }
  }, [pathname, hash])

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

  const activeId = pathname === '/' ? (hash ? hash.slice(1) : 'definition') : ''

  return (
    <div className="app-shell">
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
            <p>Select the syllabus point. Inside it: theory → steps → visualization → trace → C program.</p>
          </div>
        </div>
      </header>

      <nav className="nav-bar syllabus-menu" aria-label="Unit IV syllabus points">
        {SYLLABUS_MENU.map(([id, label]) => (
          <a key={id} href={`/#${id}`} className={activeId === id ? 'active' : undefined}>
            {label}
          </a>
        ))}
      </nav>

      <main className="main"><Outlet /></main>

      <footer className="app-footer">
        <b>Unit IV — Trees.</b> Menu = syllabus. Each syllabus point contains its complete theory, algorithm, examples, visualization and code together.
      </footer>
    </div>
  )
}

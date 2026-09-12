import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const LINKS: [string, string, string, string][] = [
  ['/', 'Syllabus', 'Syllabus', '📚'],
  ['/lab', 'Visualizer', 'Lab', '🎬'],
  ['/programs', 'Programs', 'Code', '💻'],
  ['/practice', 'Practice', 'Quiz', '📝'],
  ['/revise', 'Revise', 'Revise', '⚡'],
]

export function AppShell() {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('trees-theme', 'light')
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
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
            <p>Syllabus-first teaching flow · theory → algorithm → visual trace → C program</p>
          </div>
        </div>
      </header>
      <nav className="nav-bar" aria-label="Primary">
        {LINKS.map(([to, label, , ico]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <span className="nav-ico" aria-hidden="true">
              {ico}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <b>Unit IV — Trees.</b> Complete each official syllabus point in order: theory, steps, examples, visual trace and C program.
      </footer>
      <nav className="bottom-nav" aria-label="Mobile">
        {LINKS.map(([to, , short, ico]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <span aria-hidden="true">{ico}</span>
            {short}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

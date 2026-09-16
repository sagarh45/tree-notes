import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { BookOpen, Code2, FlaskConical, GraduationCap, Home, ListChecks, type LucideIcon } from 'lucide-react'

const LINKS: [string, string, string, LucideIcon][] = [
  ['/', 'Syllabus', 'Syllabus', Home],
  ['/theory', 'Theory', 'Theory', BookOpen],
  ['/lab', 'Visualizer', 'Lab', FlaskConical],
  ['/programs', 'Programs', 'Code', Code2],
  ['/practice', 'Practice', 'Quiz', ListChecks],
  ['/revise', 'Revise', 'Revise', GraduationCap],
]

export function AppShell() {
  const [progress, setProgress] = useState(0)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
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
            <p>Data Structures / WIT / 2026-27</p>
          </div>
        </div>
      </header>
      <nav className="nav-bar" aria-label="Primary">
        {LINKS.map(([to, label, , Icon]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <span className="nav-ico" aria-hidden="true">
              <Icon size={18} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="main">
        <Suspense fallback={<p role="status" className="muted">Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="app-footer">
        <b>Unit IV / Trees.</b> WIT 25ITU3CC2T, 2026-27. Core syllabus and additional reference notes.
      </footer>
      <nav className="bottom-nav" aria-label="Mobile">
        {LINKS.map(([to, , short, Icon]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <Icon size={20} aria-hidden="true" />
            {short}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

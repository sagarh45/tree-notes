import { Outlet, NavLink } from 'react-router-dom'
import { useEffect } from 'react'

export function AppShell() {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('trees-theme', 'light')
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Unit IV — Trees (Complete Package)</h1>
        <p>Theory · Visualizer · Programs · Practice — 8 models, every one drawn</p>
      </header>
      <nav className="nav-bar" aria-label="Primary">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/theory">Theory</NavLink>
        <NavLink to="/lab">Visualizer</NavLink>
        <NavLink to="/programs">Programs</NavLink>
        <NavLink to="/practice">Practice</NavLink>
      </nav>
      <main className="main">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Mobile">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/theory">Theory</NavLink>
        <NavLink to="/lab">Lab</NavLink>
        <NavLink to="/programs">Code</NavLink>
        <NavLink to="/practice">Quiz</NavLink>
      </nav>
    </div>
  )
}

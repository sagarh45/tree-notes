import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import { AppShell } from './layout/AppShell'

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const TheoryPage = lazy(() => import('./pages/TheoryPage').then(m => ({ default: m.TheoryPage })))
const LabPage = lazy(() => import('./pages/LabPage').then(m => ({ default: m.LabPage })))
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })))
const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })))
const RevisionPage = lazy(() => import('./pages/RevisionPage').then(m => ({ default: m.RevisionPage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="theory" element={<TheoryPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="revise" element={<RevisionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

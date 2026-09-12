import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { SyllabusPage } from './pages/SyllabusPage'
import { HomePage } from './pages/HomePage'
import { LabPage } from './pages/LabPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { PracticePage } from './pages/PracticePage'
import { RevisionPage } from './pages/RevisionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<SyllabusPage />} />
          <Route path="theory" element={<SyllabusPage />} />
          <Route path="overview" element={<HomePage />} />
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

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { SyllabusPage } from './pages/SyllabusPage'
import { LabPage } from './pages/LabPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { PracticePage } from './pages/PracticePage'
import { RevisionPage } from './pages/RevisionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/definition" replace />} />

          <Route path="definition" element={<SyllabusPage />} />
          <Route path="traversal" element={<SyllabusPage />} />
          <Route path="linked-implementation" element={<SyllabusPage />} />
          <Route path="binary-tree-operations" element={<SyllabusPage />} />
          <Route path="bst-operations" element={<SyllabusPage />} />
          <Route path="multiway-trees" element={<SyllabusPage />} />
          <Route path="b-trees" element={<SyllabusPage />} />
          <Route path="avl-tree" element={<SyllabusPage />} />
          <Route path="single-rotation" element={<SyllabusPage />} />
          <Route path="double-rotation" element={<SyllabusPage />} />

          <Route path="theory" element={<Navigate to="/definition" replace />} />
          <Route path="overview" element={<Navigate to="/definition" replace />} />

          <Route path="lab" element={<LabPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="revise" element={<RevisionPage />} />

          <Route path="*" element={<Navigate to="/definition" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

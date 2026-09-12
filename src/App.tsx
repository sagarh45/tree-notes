import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CoursePage } from './pages/CoursePage'
import { LabPage } from './pages/LabPage'
import { PracticePage } from './pages/PracticePage'
import { RevisionPage } from './pages/RevisionPage'
import { ProgramsPage } from './pages/ProgramsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<CoursePage />} />

          <Route path="theory" element={<Navigate to="/?topic=definition" replace />} />
          <Route path="overview" element={<Navigate to="/?topic=definition" replace />} />
          <Route path="definition" element={<Navigate to="/?topic=definition" replace />} />
          <Route path="traversal" element={<Navigate to="/?topic=traversal" replace />} />
          <Route path="linked-implementation" element={<Navigate to="/?topic=linked" replace />} />
          <Route path="binary-tree-operations" element={<Navigate to="/?topic=binary-ops" replace />} />
          <Route path="bst-operations" element={<Navigate to="/?topic=bst-ops" replace />} />
          <Route path="multiway-trees" element={<Navigate to="/?topic=multiway" replace />} />
          <Route path="b-trees" element={<Navigate to="/?topic=btree" replace />} />
          <Route path="avl-tree" element={<Navigate to="/?topic=avl" replace />} />
          <Route path="single-rotation" element={<Navigate to="/?topic=avl" replace />} />
          <Route path="double-rotation" element={<Navigate to="/?topic=avl" replace />} />

          <Route path="lab" element={<LabPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="revise" element={<RevisionPage />} />

          <Route path="*" element={<Navigate to="/?topic=definition" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

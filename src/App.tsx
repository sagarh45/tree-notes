import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CoursePage } from './pages/CoursePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<CoursePage />} />

          <Route path="definition" element={<Navigate to="/?topic=definition&view=theory" replace />} />
          <Route path="traversal" element={<Navigate to="/?topic=traversal&view=theory" replace />} />
          <Route path="linked-implementation" element={<Navigate to="/?topic=linked&view=theory" replace />} />
          <Route path="binary-tree-operations" element={<Navigate to="/?topic=binary-ops&view=theory" replace />} />
          <Route path="bst-operations" element={<Navigate to="/?topic=bst-ops&view=theory" replace />} />
          <Route path="multiway-trees" element={<Navigate to="/?topic=multiway&view=theory" replace />} />
          <Route path="b-trees" element={<Navigate to="/?topic=btree&view=theory" replace />} />
          <Route path="avl-tree" element={<Navigate to="/?topic=avl&view=theory" replace />} />
          <Route path="single-rotation" element={<Navigate to="/?topic=single-rotation&view=theory" replace />} />
          <Route path="double-rotation" element={<Navigate to="/?topic=double-rotation&view=theory" replace />} />

          <Route path="theory" element={<Navigate to="/?topic=definition&view=theory" replace />} />
          <Route path="overview" element={<Navigate to="/?topic=definition&view=theory" replace />} />
          <Route path="lab" element={<Navigate to="/?topic=definition&view=visualization" replace />} />
          <Route path="programs" element={<Navigate to="/?topic=definition&view=program" replace />} />
          <Route path="practice" element={<Navigate to="/?topic=definition&view=theory" replace />} />
          <Route path="revise" element={<Navigate to="/?topic=definition&view=theory" replace />} />

          <Route path="*" element={<Navigate to="/?topic=definition&view=theory" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

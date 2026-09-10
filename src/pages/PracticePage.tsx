import { useState } from 'react'
import { FIBS, MCQS, TFS } from '../data/practice'

export function PracticePage() {
  const [mcqSel, setMcqSel] = useState<Record<string, number | null>>({})
  const [mcqChecked, setMcqChecked] = useState(false)
  const [tfSel, setTfSel] = useState<Record<string, boolean | null>>({})
  const [tfChecked, setTfChecked] = useState(false)
  const [fibAns, setFibAns] = useState<Record<string, string>>({})
  const [fibChecked, setFibChecked] = useState(false)

  const mcqScore = MCQS.reduce((acc, q) => acc + (mcqSel[q.id] === q.answer ? 1 : 0), 0)
  const tfScore = TFS.reduce((acc, q) => acc + (tfSel[q.id] === q.answer ? 1 : 0), 0)
  const fibScore = FIBS.reduce((acc, q) => {
    const a = (fibAns[q.id] || '').trim().toLowerCase()
    return acc + (a === q.answer.toLowerCase() || (q.alts ?? []).some((x) => x.toLowerCase() === a) ? 1 : 0)
  }, 0)

  return (
    <div>
      <div className="card">
        <h2>Practice — MCQ · True/False · Fill in blanks</h2>
        <p className="muted">Check yourself after Theory + Visualizer. Simple English questions from Unit IV Trees.</p>
      </div>

      <div className="card">
        <h3>A. Multiple Choice</h3>
        {MCQS.map((q, idx) => (
          <div className="quiz-q" key={q.id}>
            <b>
              {idx + 1}. {q.q}
            </b>
            <div className="quiz-opts">
              {q.options.map((opt, i) => {
                let cls = ''
                if (mcqChecked) {
                  if (i === q.answer) cls = 'correct'
                  else if (mcqSel[q.id] === i) cls = 'wrong'
                } else if (mcqSel[q.id] === i) cls = 'picked'
                return (
                  <button
                    key={opt}
                    type="button"
                    className={cls}
                    onClick={() => !mcqChecked && setMcqSel((s) => ({ ...s, [q.id]: i }))}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {mcqChecked && <p className="muted">{q.explain}</p>}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setMcqChecked(true)}>
            Check MCQ
          </button>
          <button
            type="button"
            className="btn gray"
            onClick={() => {
              setMcqSel({})
              setMcqChecked(false)
            }}
          >
            Reset
          </button>
          {mcqChecked && (
            <span className="muted">
              Score: {mcqScore} / {MCQS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>B. True / False</h3>
        {TFS.map((q, idx) => (
          <div className="quiz-q" key={q.id}>
            <b>
              {idx + 1}. {q.q}
            </b>
            <div className="quiz-opts">
              {[true, false].map((v) => {
                let cls = ''
                if (tfChecked) {
                  if (v === q.answer) cls = 'correct'
                  else if (tfSel[q.id] === v) cls = 'wrong'
                } else if (tfSel[q.id] === v) cls = 'picked'
                return (
                  <button
                    key={String(v)}
                    type="button"
                    className={cls}
                    onClick={() => !tfChecked && setTfSel((s) => ({ ...s, [q.id]: v }))}
                  >
                    {v ? 'True' : 'False'}
                  </button>
                )
              })}
            </div>
            {tfChecked && <p className="muted">{q.explain}</p>}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setTfChecked(true)}>
            Check T/F
          </button>
          <button
            type="button"
            className="btn gray"
            onClick={() => {
              setTfSel({})
              setTfChecked(false)
            }}
          >
            Reset
          </button>
          {tfChecked && (
            <span className="muted">
              Score: {tfScore} / {TFS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>C. Fill in the blanks</h3>
        {FIBS.map((q, idx) => (
          <div className="quiz-q" key={q.id}>
            <b>
              {idx + 1}. {q.q}
            </b>
            <label className="field" style={{ marginTop: 8 }}>
              Answer
              <input
                value={fibAns[q.id] || ''}
                onChange={(e) => setFibAns((s) => ({ ...s, [q.id]: e.target.value }))}
                disabled={fibChecked}
              />
            </label>
            {fibChecked && (
              <p className="muted">
                Expected: <b>{q.answer}</b> — {q.explain}
              </p>
            )}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setFibChecked(true)}>
            Check FIB
          </button>
          <button
            type="button"
            className="btn gray"
            onClick={() => {
              setFibAns({})
              setFibChecked(false)
            }}
          >
            Reset
          </button>
          {fibChecked && (
            <span className="muted">
              Score: {fibScore} / {FIBS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Cheatsheet</h3>
        <div className="cheatsheet">
          <div>
            <b>Edges</b>n nodes ⇒ n − 1 edges
          </div>
          <div>
            <b>Array children</b>left = 2i+1, right = 2i+2
          </div>
          <div>
            <b>Traversals</b>Pre NLR · In LNR · Post LRN · Level = BFS
          </div>
          <div>
            <b>BST</b>whole left &lt; node &lt; whole right
          </div>
          <div>
            <b>Successor</b>minimum of the right subtree
          </div>
          <div>
            <b>AVL BF</b>height(L) − height(R) ∈ {'{-1,0,1}'}
          </div>
          <div>
            <b>Rotations</b>LL right · RR left · LR left then right · RL right then left
          </div>
          <div>
            <b>B-Tree order m</b>≤ m children, ≤ m−1 keys, leaves at one level
          </div>
        </div>
      </div>
    </div>
  )
}

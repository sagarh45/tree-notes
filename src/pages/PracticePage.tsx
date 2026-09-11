import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FIBS, MCQS, NUMERICALS, TFS } from '../data/practice'

export function PracticePage() {
  const [mcqSel, setMcqSel] = useState<Record<string, number | null>>({})
  const [mcqChecked, setMcqChecked] = useState(false)
  const [tfSel, setTfSel] = useState<Record<string, boolean | null>>({})
  const [tfChecked, setTfChecked] = useState(false)
  const [fibAns, setFibAns] = useState<Record<string, string>>({})
  const [fibChecked, setFibChecked] = useState(false)
  const [openNum, setOpenNum] = useState<string | null>(null)

  const mcqScore = MCQS.reduce((acc, q) => acc + (mcqSel[q.id] === q.answer ? 1 : 0), 0)
  const tfScore = TFS.reduce((acc, q) => acc + (tfSel[q.id] === q.answer ? 1 : 0), 0)
  const fibScore = FIBS.reduce((acc, q) => {
    const a = (fibAns[q.id] || '').trim().toLowerCase()
    return acc + (a === q.answer.toLowerCase() || (q.alts ?? []).some((x) => x.toLowerCase() === a) ? 1 : 0)
  }, 0)

  const total = MCQS.length + TFS.length + FIBS.length
  const attempted =
    Object.values(mcqSel).filter((v) => v !== null && v !== undefined).length +
    Object.values(tfSel).filter((v) => v !== null && v !== undefined).length +
    Object.values(fibAns).filter((v) => v.trim().length > 0).length
  const scored = (mcqChecked ? mcqScore : 0) + (tfChecked ? tfScore : 0) + (fibChecked ? fibScore : 0)
  const anyChecked = mcqChecked || tfChecked || fibChecked

  return (
    <div>
      <div className="card hero-band">
        <div className="hero-kicker">SELF TEST</div>
        <h2>
          {total} objective questions and {NUMERICALS.length} solved numericals
        </h2>
        <p className="muted">
          Do these after each theory block, not at the end. The explanations under every answer name the exact trap the
          question was built around, so a wrong answer is worth more than a right one.
        </p>
        <div className="stat-strip">
          <div className="stat">
            <b>{MCQS.length}</b>
            <span>multiple choice</span>
          </div>
          <div className="stat">
            <b>{TFS.length}</b>
            <span>true / false</span>
          </div>
          <div className="stat">
            <b>{FIBS.length}</b>
            <span>fill the blank</span>
          </div>
          <div className="stat">
            <b>{NUMERICALS.length}</b>
            <span>numericals</span>
          </div>
        </div>
        <div className="score-row">
          <div className="score-bar" aria-hidden="true">
            <span style={{ width: `${total ? (attempted / total) * 100 : 0}%` }} />
          </div>
          <b>
            {attempted} / {total} attempted
            {anyChecked ? ` · ${scored} correct so far` : ''}
          </b>
        </div>
        <div className="row hero-actions">
          <Link className="btn play" to="/theory">
            Back to theory →
          </Link>
          <Link className="btn gray" to="/revise">
            Formula sheet →
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>
          A. Multiple choice <span className="fig-pill">{MCQS.length}</span>
        </h3>
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
            {mcqChecked && <p className="quiz-why">{q.explain}</p>}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setMcqChecked(true)}>
            Check answers
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
              Score: <b>{mcqScore}</b> / {MCQS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>
          B. True or false <span className="fig-pill">{TFS.length}</span>
        </h3>
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
            {tfChecked && <p className="quiz-why">{q.explain}</p>}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setTfChecked(true)}>
            Check answers
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
              Score: <b>{tfScore}</b> / {TFS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>
          C. Fill in the blanks <span className="fig-pill">{FIBS.length}</span>
        </h3>
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
              <p className="quiz-why">
                Expected: <b>{q.answer}</b> — {q.explain}
              </p>
            )}
          </div>
        ))}
        <div className="row">
          <button type="button" className="btn play" onClick={() => setFibChecked(true)}>
            Check answers
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
              Score: <b>{fibScore}</b> / {FIBS.length}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <h3>
          D. Numericals — solve on paper first <span className="fig-pill">{NUMERICALS.length}</span>
        </h3>
        <p className="muted" style={{ marginTop: 0 }}>
          These are full-mark questions. Draw the tree yourself, then open the working and compare every step, not just
          the final answer.
        </p>
        <div className="qa-list">
          {NUMERICALS.map((n, i) => (
            <div className={`qa${openNum === n.id ? ' on' : ''}`} key={n.id}>
              <button type="button" onClick={() => setOpenNum(openNum === n.id ? null : n.id)}>
                <span className="qa-mark">{i + 1}</span>
                {n.q}
                <span className="qa-chev">{openNum === n.id ? '−' : '+'}</span>
              </button>
              {openNum === n.id ? (
                <div className="qa-ans" style={{ flexDirection: 'column' }}>
                  <p>
                    <b>Answer:</b> {n.answer}
                  </p>
                  <ol className="check-list" style={{ marginTop: 6 }}>
                    {n.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Cheatsheet</h3>
        <div className="cheatsheet">
          <div>
            <b>Edges</b>n nodes ⇒ n − 1 edges, n + 1 NULL pointers
          </div>
          <div>
            <b>Max nodes</b>level l: 2ˡ · height h: 2ʰ⁺¹ − 1
          </div>
          <div>
            <b>Full tree</b>L = I + 1 · n = 2I + 1 (odd)
          </div>
          <div>
            <b>Catalan</b>#BSTs on n keys = (2n)!/((n+1)! n!)
          </div>
          <div>
            <b>Array children</b>left = 2i+1, right = 2i+2, parent = ⌊(i−1)/2⌋
          </div>
          <div>
            <b>Traversals</b>Pre NLR · In LNR · Post LRN · Level = BFS
          </div>
          <div>
            <b>Iterative</b>pre: push right first · post: two stacks
          </div>
          <div>
            <b>BST</b>whole left &lt; node &lt; whole right
          </div>
          <div>
            <b>Successor</b>minimum of the right subtree
          </div>
          <div>
            <b>General → binary</b>left = first child, right = next sibling
          </div>
          <div>
            <b>AVL BF</b>height(L) − height(R) ∈ {'{-1,0,1}'}
          </div>
          <div>
            <b>Rotations</b>LL right · RR left · LR left then right · RL right then left
          </div>
          <div>
            <b>AVL delete</b>case from the taller child’s BF · up to O(log n) rotations
          </div>
          <div>
            <b>B-Tree order m</b>≤ m children, ≤ m−1 keys, leaves at one level
          </div>
          <div>
            <b>B-Tree delete</b>borrow first, merge second, re-check the parent
          </div>
          <div>
            <b>Heap</b>array IS the tree · parent ≥ kids · swim / sink
          </div>
          <div>
            <b>Build-heap</b>start at n/2 − 1 · costs O(n)
          </div>
          <div>
            <b>Heap sort</b>max-heap → ascending · in place · not stable
          </div>
          <div>
            <b>Red-Black</b>new = RED · no red-red · root BLACK
          </div>
          <div>
            <b>Huffman</b>merge two lightest · left 0 right 1 · prefix-free
          </div>
          <div>
            <b>Trie</b>letter on the edge · time O(L) · END ≠ leaf
          </div>
          <div>
            <b>Threads</b>NULL left → pred · NULL right → succ
          </div>
          <div>
            <b>Rebuild</b>need inorder + (pre or post)
          </div>
          <div>
            <b>Diameter</b>height(L) + height(R) + 2 edges, or best subtree
          </div>
        </div>
      </div>
    </div>
  )
}

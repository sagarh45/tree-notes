import { useId, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import type { LessonCase } from '../../data/lessonCases'
import { usePlayback, type Speed } from '../../hooks/usePlayback'
import { BinaryTreeSvg } from '../viz/BinaryTreeSvg'
import { BTreeSvg } from '../viz/BTreeSvg'

export function LessonPlayer({ cases }: { cases: LessonCase[] }) {
  const [selected, setSelected] = useState(cases[0].id)
  const example = cases.find(c => c.id === selected) ?? cases[0]
  const controlId = useId()
  return <section className="lesson-player" aria-label="Step-by-step visualization">
    <div className="case-picker"><label htmlFor={controlId}>Case</label>
      <select id={controlId} value={example.id} onChange={e => setSelected(e.target.value)}>{cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
      <span>{cases.length} {cases.length === 1 ? 'case' : 'cases'}</span>
    </div>
    <CasePlayback key={example.id} example={example} />
  </section>
}

function CasePlayback({ example }: { example: LessonCase }) {
  const playback = usePlayback(example.steps)
  const step = playback.current
  const [showSteps, setShowSteps] = useState(false)
  if (!step) return null
  return <>
    <div className="lesson-playback" aria-label="Case playback">
      <button className="icon-button" type="button" title="Previous step" aria-label="Previous step" disabled={playback.index === 0} onClick={playback.prev}><ArrowLeft size={18} /></button>
      <button className="icon-button" type="button" title={playback.playing ? 'Pause' : 'Play all steps'} aria-label={playback.playing ? 'Pause' : 'Play all steps'} onClick={playback.playing ? playback.pause : playback.play}>{playback.playing ? <Pause size={18} /> : <Play size={18} />}</button>
      <button className="icon-button" type="button" title="Next step" aria-label="Next step" disabled={playback.index === playback.total - 1} onClick={playback.next}><ArrowRight size={18} /></button>
      <button className="icon-button" type="button" title="Restart case" aria-label="Restart case" onClick={playback.restart}><RotateCcw size={18} /></button>
      <label className="lesson-speed">Speed<select aria-label="Animation speed" value={playback.speed} onChange={e => playback.setSpeed(Number(e.target.value) as Speed)}>{[0.5, 1, 1.5, 2].map(s => <option key={s} value={s}>{s}x</option>)}</select></label>
      <output className="lesson-step-count" aria-live="polite">Step {playback.index + 1} / {playback.total}</output>
      <input className="lesson-scrubber" type="range" aria-label="Select step" min="0" max={Math.max(0, playback.total - 1)} value={playback.index} onChange={e => playback.seek(Number(e.target.value))} />
    </div>
    <div className="lesson-current">
      <h3>{step.label}</h3>
      <div className="lesson-stage">
        {step.btree ? <BTreeSvg root={step.btree} highlightId={step.highlightBId} highlightKey={step.highlightKey} /> :
          <BinaryTreeSvg root={step.tree} marks={step.marks} visitOrder={step.visitOrder} showBf={step.showBf} edgeLabels={step.edgeLabels} emptyText="root = NULL" />}
      </div>
      <p className="lesson-step-note" aria-live="polite">{step.explanation.happening}</p>
      {step.visitList ? <p className="trace-strip"><b>Output</b><code>{step.visitList.join(' ') || '(empty)'}</code></p> : null}
      {step.callStack ? <p className="trace-strip"><b>Call stack</b><code>{step.callStack.join(' > ') || '(empty)'}</code></p> : null}
      {step.queue ? <p className="trace-strip"><b>Queue</b><code>{step.queue.join(' ') || '(empty)'}</code></p> : null}
    </div>
    <details className="case-transcript" open={showSteps} onToggle={e => setShowSteps(e.currentTarget.open)}>
      <summary>All {playback.total} steps</summary>
      {showSteps ? <ol>{example.steps.map((s, i) => <li key={i} aria-current={i === playback.index ? 'step' : undefined}><b>{s.label}</b><p>{s.explanation.happening}</p></li>)}</ol> : null}
    </details>
  </>
}

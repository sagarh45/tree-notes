import { useEffect, useId, useRef, useState } from 'react'
import { Play, RotateCcw, Square, Terminal } from 'lucide-react'
import type { CResult } from '../lib/runWasi'

export function ProgramRunner({ code, sampleInput }: { code: string; sampleInput: string }) {
  const id = useId()
  const [input, setInput] = useState(sampleInput)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'running' | 'done'>('idle')
  const [result, setResult] = useState<CResult | null>(null)
  const job = useRef<{ worker: Worker; timer: ReturnType<typeof setTimeout> } | null>(null)
  const busy = phase === 'loading' || phase === 'running'

  function cleanup() {
    if (job.current) { job.current.worker.terminate(); clearTimeout(job.current.timer); job.current = null }
  }
  useEffect(() => cleanup, [])

  function finish(result: CResult) { cleanup(); setResult(result); setPhase('done') }
  function run() {
    cleanup()
    setResult(null)
    setPhase('loading')
    try {
      const worker = new Worker(new URL('../workers/cRunner.ts', import.meta.url), { type: 'module' })
      job.current = { worker, timer: setTimeout(() => finish({ output: '', exitCode: -1, error: 'Loading timed out. Check your connection and retry.' }), 20000) }
      worker.onmessage = (event: MessageEvent<{ type: string; result: CResult }>) => {
        if (job.current?.worker !== worker) return
        if (event.data.type === 'running') {
          clearTimeout(job.current.timer)
          job.current.timer = setTimeout(() => finish({ output: '', exitCode: -1, error: 'Stopped after 5 seconds. Check the input counts and menu choices.' }), 5000)
          setPhase('running')
        } else finish(event.data.result)
      }
      worker.onerror = () => {
        if (job.current?.worker === worker) finish({ output: '', exitCode: -1, error: 'Could not execute this program. Reload and try again.' })
      }
      worker.postMessage({ code, input })
    } catch (error) {
      finish({ output: '', exitCode: -1, error: error instanceof Error ? error.message : 'This browser cannot start the C runner.' })
    }
  }

  const changeInput = (next: string) => { setInput(next); setResult(null); setPhase('idle') }
  return <section className="program-runner" aria-label="C program runner">
    <div className="runner-bar">
      <b><Terminal size={17} /> C output</b>
      <div className="row">
        <button className="icon-button" type="button" title="Reset sample input" aria-label="Reset sample input" disabled={busy} onClick={() => changeInput(sampleInput)}><RotateCcw size={17} /></button>
        {busy ? <button className="btn runner-stop" type="button" onClick={() => finish({ output: '', exitCode: -1, error: 'Execution stopped.' })}><Square size={15} /> Stop</button>
          : <button className="btn runner-run" type="button" onClick={run}><Play size={16} /> Run</button>}
      </div>
    </div>
    <div className="runner-io">
      <div><label htmlFor={id}>Input (stdin)</label><textarea id={id} spellCheck={false} value={input} maxLength={16000} disabled={busy} onChange={e => changeInput(e.target.value)} aria-label="Program input" /></div>
      <div><b className="runner-output-label">Output (stdout)</b><pre className="runner-output" aria-label="Program output" tabIndex={0}>{result?.output || (busy ? 'Running...' : result ? '(no output)' : '')}</pre></div>
    </div>
    <p className={`runner-status${result?.error || (result && result.exitCode !== 0) ? ' runner-error' : ''}`} role="status">
      {busy ? (phase === 'loading' ? 'Loading program...' : 'Running...') : result?.error ?? (result ? `Exited with code ${result.exitCode}${result.exitCode !== 0 ? '. Check the program input.' : '.'}` : 'Ready')}
    </p>
  </section>
}

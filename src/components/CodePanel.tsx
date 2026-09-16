import { memo, useMemo, useState, type CSSProperties } from 'react'
import { Check, Copy, Download, Minus, Plus, WrapText } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-c'
import { ProgramRunner } from './ProgramRunner'
import '../code.css'

export const CodePanel = memo(function CodePanel({ code, title = 'C', note, sampleInput }: { code: string; title?: string; note?: string; sampleInput?: string }) {
  const [status, setStatus] = useState('')
  const [font, setFont] = useState(17)
  const [wrap, setWrap] = useState(false)
  const html = useMemo(() => Prism.highlight(code, Prism.languages.c, 'c'), [code])
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setStatus('Code copied.') }
    catch { setStatus('Clipboard unavailable. Download the C file instead.') }
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/x-c;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url; a.download = title.endsWith('.c') ? title : 'tree-example.c'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="code-panel source-panel" style={{ '--code-font': `${font}px` } as CSSProperties}>
    <div className="head">
      <span>{title}</span>
      <div className="source-tools">
        <div className="font-controls" role="group" aria-label="Code font size">
          <button className="icon-button" title="Decrease code font" aria-label="Decrease code font" disabled={font <= 14} onClick={() => setFont(font - 1)}><Minus size={16} /></button><output>{font}</output><button className="icon-button" title="Increase code font" aria-label="Increase code font" disabled={font >= 24} onClick={() => setFont(font + 1)}><Plus size={16} /></button>
        </div>
        <button className="icon-button" title="Wrap long code lines" aria-label="Wrap long code lines" aria-pressed={wrap} onClick={() => setWrap(!wrap)}><WrapText size={17} /></button>
        <button className="icon-button" title="Download C file" aria-label="Download C file" onClick={download}><Download size={17} /></button>
        <button className="icon-button" title="Copy code" aria-label="Copy code" onClick={copy}>{status === 'Code copied.' ? <Check size={17} /> : <Copy size={17} />}</button>
      </div>
    </div>
    <pre className={`source-code${wrap ? ' source-wrap' : ''}`} tabIndex={0} aria-label="C source code"><code className="language-c" dangerouslySetInnerHTML={{ __html: html }} /></pre>
    {status ? <span className="copy-status" role="status">{status}</span> : null}
    {note ? <div className="tb-code-note">{note}</div> : null}
    {sampleInput !== undefined ? <ProgramRunner key={`${code}\0${sampleInput}`} code={code} sampleInput={sampleInput} /> : null}
  </div>
})

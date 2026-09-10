type Props = {
  title: string
  code: string
  activeLine: number | null
  mode: 'code' | 'pseudo'
  onMode: (m: 'code' | 'pseudo') => void
}

export function CodePanel({ title, code, activeLine, mode, onMode }: Props) {
  const lines = code.replace(/\r\n/g, '\n').split('\n')
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Code</h3>
        <div className="tabs" role="tablist" aria-label="Code or pseudocode">
          <button type="button" role="tab" aria-selected={mode === 'code'} onClick={() => onMode('code')}>
            C Code
          </button>
          <button type="button" role="tab" aria-selected={mode === 'pseudo'} onClick={() => onMode('pseudo')}>
            Pseudocode
          </button>
        </div>
      </div>
      <div className="code-panel">
        <div className="head">
          <span>{title}</span>
          <span style={{ opacity: 0.85, fontSize: '0.85rem' }}>{mode === 'code' ? 'C' : 'Steps'}</span>
        </div>
        <pre aria-label={title}>
          {lines.map((line, i) => (
            <span key={i} className={`code-line${activeLine === i ? ' active' : ''}`}>
              <span style={{ color: '#64748b', display: 'inline-block', width: 36 }}>{i + 1}</span>
              {line || ' '}
            </span>
          ))}
        </pre>
      </div>
    </div>
  )
}

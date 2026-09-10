import type { Speed } from '../../hooks/usePlayback'

type Props = {
  index: number
  total: number
  playing: boolean
  speed: Speed
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onRestart: () => void
  onSpeed: (s: Speed) => void
}

const SPEEDS: Speed[] = [0.5, 1, 1.5, 2]

export function PlaybackBar({
  index,
  total,
  playing,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSpeed,
}: Props) {
  return (
    <div className="card" aria-label="Playback controls">
      <h3>Playback</h3>
      <div className="playback">
        <button type="button" className="btn gray" onClick={onPrev} aria-label="Previous step" disabled={total === 0}>
          ← Prev
        </button>
        {playing ? (
          <button type="button" className="btn warn" onClick={onPause} aria-label="Pause">
            Pause
          </button>
        ) : (
          <button type="button" className="btn play" onClick={onPlay} aria-label="Play" disabled={total === 0}>
            Play
          </button>
        )}
        <button type="button" className="btn gray" onClick={onNext} aria-label="Next step" disabled={total === 0}>
          Next →
        </button>
        <button type="button" className="btn gray" onClick={onRestart} aria-label="Restart" disabled={total === 0}>
          Restart
        </button>
        <div className="speed-group" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button key={s} type="button" className={speed === s ? 'active' : ''} onClick={() => onSpeed(s)}>
              {s}x
            </button>
          ))}
        </div>
        <span className="step-meta" aria-live="polite">
          Step {total ? index + 1 : 0} / {total}
        </span>
      </div>
    </div>
  )
}

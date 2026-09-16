import type { Speed } from '../../hooks/usePlayback'
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react'

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
    <div className="playback-panel" aria-label="Playback controls">
      <h3>Playback</h3>
      <div className="playback">
        <button type="button" className="icon-button" onClick={onPrev} title="Previous step" aria-label="Previous step" disabled={total === 0 || index === 0}>
          <ArrowLeft size={18} />
        </button>
        {playing ? (
          <button type="button" className="icon-button" onClick={onPause} title="Pause" aria-label="Pause">
            <Pause size={18} />
          </button>
        ) : (
          <button type="button" className="icon-button" onClick={onPlay} title="Play" aria-label="Play" disabled={total === 0}>
            <Play size={18} />
          </button>
        )}
        <button type="button" className="icon-button" onClick={onNext} title="Next step" aria-label="Next step" disabled={total === 0 || index >= total - 1}>
          <ArrowRight size={18} />
        </button>
        <button type="button" className="icon-button" onClick={onRestart} title="Restart" aria-label="Restart" disabled={total === 0}>
          <RotateCcw size={18} />
        </button>
        <div className="speed-group" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button key={s} type="button" aria-pressed={speed === s} className={speed === s ? 'active' : ''} onClick={() => onSpeed(s)}>
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

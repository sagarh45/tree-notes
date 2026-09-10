import { useCallback, useEffect, useRef, useState } from 'react'
import type { TreeStep } from '../types/lab'

export type Speed = 0.5 | 1 | 1.5 | 2

export function usePlayback(steps: TreeStep[]) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)
  const timer = useRef<number | null>(null)

  const max = Math.max(0, steps.length - 1)
  const safeIndex = steps.length ? Math.min(index, max) : 0
  const current = steps[safeIndex] ?? null

  const stop = useCallback(() => {
    setPlaying(false)
    if (timer.current) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => {
    setIndex(0)
    stop()
  }, [steps, stop])

  useEffect(() => {
    if (!playing || !steps.length) return
    const ms = 900 / speed
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, ms)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing, speed, steps.length])

  const play = () => {
    if (!steps.length) return
    if (safeIndex >= max) setIndex(0)
    setPlaying(true)
  }
  const pause = () => stop()
  const next = () => {
    stop()
    setIndex((i) => Math.min(i + 1, max))
  }
  const prev = () => {
    stop()
    setIndex((i) => Math.max(i - 1, 0))
  }
  const restart = () => {
    stop()
    setIndex(0)
  }

  return {
    index: safeIndex,
    total: steps.length,
    current,
    playing,
    speed,
    setSpeed,
    play,
    pause,
    next,
    prev,
    restart,
    stop,
  }
}

import { useEffect } from 'react'

type Handlers = {
  onPlayPause?: () => void
  onNext?: () => void
  onPrev?: () => void
  onReset?: () => void
  onInsert?: () => void
  onSearch?: () => void
  onDelete?: () => void
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable
}

export function useKeyboardShortcuts(handlers: Handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      if (e.code === 'Space') {
        e.preventDefault()
        handlers.onPlayPause?.()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handlers.onNext?.()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlers.onPrev?.()
      } else if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        handlers.onReset?.()
      } else if (e.key.toLowerCase() === 'i') {
        handlers.onInsert?.()
      } else if (e.key.toLowerCase() === 's') {
        handlers.onSearch?.()
      } else if (e.key.toLowerCase() === 'd') {
        handlers.onDelete?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlers, enabled])
}

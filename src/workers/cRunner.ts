import { runWasi } from '../lib/runWasi'

self.onmessage = async (event: MessageEvent<{ code: string; input: string }>) => {
  try {
    const { code, input } = event.data
    if (input.length > 16000) throw new Error('Input is limited to 16,000 characters.')
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code))
    const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
    const response = await fetch(`/programs/${hash}.wasm`)
    if (!response.ok || !response.headers.get('content-type')?.includes('application/wasm')) {
      throw new Error('Program could not be loaded. Refresh the page and try again.')
    }
    const bytes = await response.arrayBuffer()
    self.postMessage({ type: 'running' })
    self.postMessage({ type: 'result', result: await runWasi(bytes, input) })
  } catch (error) {
    self.postMessage({ type: 'result', result: { output: '', exitCode: -1, error: error instanceof Error ? error.message : 'Could not start the C program.' } })
  }
}

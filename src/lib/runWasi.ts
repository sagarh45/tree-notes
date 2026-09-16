export type CResult = { output: string; exitCode: number; error?: string }

export async function runWasi(bytes: ArrayBuffer, input: string): Promise<CResult> {
  const { WASI, File, OpenFile, ConsoleStdout } = await import('@bjorn3/browser_wasi_shim')
  let output = ''
  let written = 0
  const decoder = new TextDecoder()
  const capture = new ConsoleStdout(data => {
    written += data.byteLength
    if (written > 65536) throw new Error('Output limit reached (64 KB). Reduce the input.')
    output += decoder.decode(data, { stream: true })
  })
  const wasi = new WASI(['tree-program'], [], [
    new OpenFile(new File(new TextEncoder().encode(input ? `${input}\n` : ''), { readonly: true })),
    capture, capture,
  ])
  try {
    const { instance } = await WebAssembly.instantiate(bytes, { wasi_snapshot_preview1: wasi.wasiImport })
    const exitCode = wasi.start(instance as unknown as Parameters<typeof wasi.start>[0])
    output += decoder.decode()
    return { output, exitCode }
  } catch (error) {
    return { output, exitCode: -1, error: error instanceof Error ? error.message : 'Program execution failed.' }
  }
}

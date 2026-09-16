const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const { PROGRAM_CATALOG, COURSE_TOPICS } = require('./load-data.cjs')

async function main() {
  const { runClang } = await import('@yowasp/clang')
  const out = path.resolve(__dirname, '../public/programs')
  fs.mkdirSync(out, { recursive: true })
  const programs = [...PROGRAM_CATALOG, ...[...COURSE_TOPICS.values()].flatMap(t => t.program ? [t.program] : [])]
  const unique = new Map(programs.map(p => [createHash('sha256').update(p.code).digest('hex'), p]))
  let built = 0
  for (const [hash, program] of unique) {
    const target = path.join(out, `${hash}.wasm`)
    if (fs.existsSync(target) && WebAssembly.validate(fs.readFileSync(target))) continue
    const files = await runClang(['clang', '-std=c11', '-O1', '-Wl,--max-memory=33554432', '-Wl,-z,stack-size=1048576', 'main.c', '-o', 'main.wasm'], { 'main.c': program.code })
    const bytes = files['main.wasm']
    if (!(bytes instanceof Uint8Array) || !WebAssembly.validate(bytes)) throw new Error(`C compilation failed: ${program.title}`)
    fs.writeFileSync(target, bytes)
    built++
    console.log(`Compiled: ${program.title} (${bytes.byteLength} bytes)`)
  }
  console.log(`C runner: ${unique.size} exact-source WASM programs ready (${built} compiled).`)
}
main().catch(error => { console.error(error); process.exitCode = 1 })

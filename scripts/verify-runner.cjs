const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const cp = require('node:child_process')
const { Worker } = require('node:worker_threads')
const { createHash } = require('node:crypto')
const { PROGRAM_CATALOG, COURSE_TOPICS, programInput } = require('./load-data.cjs')

const normalized = text => text.trim().replace(/\r\n/g, '\n')
const out = path.resolve(__dirname, '../.verification')
fs.mkdirSync(out, { recursive: true })
function execute(program, input) {
  const hash = createHash('sha256').update(program.code).digest('hex')
  const bytes = Uint8Array.from(fs.readFileSync(path.resolve(__dirname, `../public/programs/${hash}.wasm`))).buffer
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'run-program-worker.cjs'), { workerData: { bytes, input } })
    const timer = setTimeout(() => { worker.terminate(); reject(new Error(`Timeout: ${program.title}`)) }, 10000)
    worker.once('message', result => { clearTimeout(timer); worker.terminate(); resolve(result) })
    worker.once('error', error => { clearTimeout(timer); worker.terminate(); reject(error) })
  })
}
async function main() {
  for (const program of PROGRAM_CATALOG) {
    const exe = path.join(out, `${program.id}${process.platform === 'win32' ? '.exe' : ''}`)
    const compile = cp.spawnSync('gcc', ['-x', 'c', '-std=c11', '-o', exe, '-'], { input: program.code, encoding: 'utf8' })
    assert.equal(compile.status, 0, `${program.id}: ${compile.stderr}`)
    const input = programInput(program)
    const native = cp.spawnSync(exe, [], { input, encoding: 'utf8', timeout: 5000 })
    assert.equal(native.status, 0, `${program.id}: native sample failed: ${native.error ?? native.stderr}`)
    const wasm = await execute(program, input)
    assert.equal(wasm.error, undefined, `${program.id}: ${wasm.error}`)
    assert.equal(wasm.exitCode, 0, `${program.id}: WASM exit code`)
    assert.equal(normalized(wasm.output), normalized(native.stdout), `${program.id}: browser and GCC output differ`)
    if (['general-tree', 'multiway-operations', 'linked-memory', 'btree-delete', 'bt-operations'].includes(program.id)) {
      assert.equal(normalized(wasm.output), program.output, `${program.id}: sample expectation`)
    }
    console.log(`PASS native/WASM: ${program.id}`)
  }
  for (const id of ['avl-single', 'avl-double']) {
    const program = COURSE_TOPICS.get(id).program
    const result = await execute(program, programInput(program))
    assert.equal(result.exitCode, 0)
    assert(result.output.includes('10(bf 0) 20(bf 0) 30(bf 0)'))
  }
  const multiway = PROGRAM_CATALOG.find(p => p.id === 'multiway-operations')
  let seed = 7219
  const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32
  for (let trial = 0; trial < 15; trial++) {
    const keys = Array.from({ length: 70 }, () => Math.floor(random() * 120) - 60)
    const deletes = [...keys].sort(() => random() - 0.5).concat(999)
    const values = new Set(keys)
    const sorted = () => [...values].sort((a, b) => a - b).map(k => ` ${k}`).join('')
    const expected = [`Inorder:${sorted()}`, 'Found']
    for (const key of deletes) { values.delete(key); expected.push(`After delete ${key}:${sorted()}`) }
    const result = await execute(multiway, `${keys.length}\n${keys.join(' ')}\n${keys[0]}\n${deletes.length}\n${deletes.join(' ')}`)
    assert.equal(result.exitCode, 0)
    assert.equal(normalized(result.output), expected.join('\n'))
  }
  const empty = await execute(multiway, '0\n99\n1\n99')
  assert.equal(normalized(empty.output), 'Inorder:\nNot found\nAfter delete 99:')
  const invalid = await execute(multiway, '-1')
  assert.equal(invalid.exitCode, 1)
  const general = PROGRAM_CATALOG.find(p => p.id === 'general-tree')
  const rootDelete = await execute(general, '1\n2\n1 2\n1 3\n99\n1')
  assert.equal(normalized(rootDelete.output), 'Preorder: 1 2 3\nNodes: 3\nHeight: 1\nNot found\nAfter delete:')
  const search = PROGRAM_CATALOG.find(p => p.id === 'multiway-search')
  assert.equal(normalized((await execute(search, '99')).output), 'Not found')
  assert.equal(normalized((await execute(search, '40')).output), 'Found')
  console.log(`PASS: ${PROGRAM_CATALOG.length} C programs match native GCC, both rotation samples, 15 randomized multiway deletion runs, custom input and error exits.`)
}
main().catch(error => { console.error(error); process.exitCode = 1 })

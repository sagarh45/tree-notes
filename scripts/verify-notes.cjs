const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const cp = require('node:child_process')
const Module = require('node:module')
const ts = require('typescript')

for (const extension of ['.ts', '.tsx']) {
  Module._extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, file)
}

const { ALL_TOPICS } = require('../src/data/syllabus/index.ts')
const { PROGRAM_CATALOG } = require('../src/data/programCatalog.ts')
const { PROGRAM_LINKS, SYLLABUS_POINTS } = require('../src/data/syllabus/coverage.ts')
const { bTreeFromSequence, bTreeInsert } = require('../src/lib/btree.ts')
const { arrayRepresentation, treeFromSpec, bTreeReactiveFrames } = require('../src/lib/stepBuilders.ts')
const { Diagram } = require('../src/components/theory/Diagram.tsx')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

assert.equal(new Set(ALL_TOPICS.map(t => t.id)).size, ALL_TOPICS.length, 'Topic IDs must be unique')
assert.equal(new Set(PROGRAM_CATALOG.map(p => p.id)).size, PROGRAM_CATALOG.length, 'Program IDs must be unique')
for (const p of SYLLABUS_POINTS) assert(ALL_TOPICS.some(t => t.id === p.topic), `Missing syllabus topic ${p.topic}`)
for (const [topic, program] of Object.entries(PROGRAM_LINKS)) {
  assert(ALL_TOPICS.some(t => t.id === topic), `Missing topic ${topic}`)
  assert(PROGRAM_CATALOG.some(p => p.id === program), `Broken program link ${program}`)
}
let diagrams = 0
for (const t of ALL_TOPICS) {
  assert(t.diagrams?.length || t.termCards, `Missing diagram for ${t.id}`)
  for (const d of t.diagrams ?? []) {
    assert(renderToStaticMarkup(React.createElement(Diagram, { d })).length > 0, `Blank diagram in ${t.id}`)
    diagrams++
  }
}
assert.deepEqual(arrayRepresentation(treeFromSpec('10(,5)')), [10, null, 5])

const flatten = n => n.children.length ? n.children.flatMap((child, i) => [...flatten(child), ...(i < n.keys.length ? [n.keys[i]] : [])]) : n.keys
for (const order of [3, 4, 5]) {
  const root = bTreeFromSequence([10, 20, 5, 6, 12, 30, 7, 17, 40, 50, 60], order).root
  for (const key of flatten(root)) assert.deepEqual(bTreeInsert(root, key, order).root, root, 'Duplicate key changed the B-Tree')
  const frames = bTreeReactiveFrames([10, 20, 5, 6, 12, 30], order)
  assert.deepEqual(flatten(frames.at(-1).tree), [5, 6, 10, 12, 20, 30])
}
console.log(`PASS: ${ALL_TOPICS.length} topics, ${diagrams} diagram specs, syllabus/program links, B-Tree duplicate regression`)

for (const p of PROGRAM_CATALOG) {
  const result = cp.spawnSync('gcc', ['-x', 'c', '-std=c11', '-fsyntax-only', '-'], { input: p.code, encoding: 'utf8' })
  assert.equal(result.status, 0, `${p.id}: ${result.error ?? result.stderr}`)
}
console.log(`PASS: all ${PROGRAM_CATALOG.length} C listings pass GCC C11 syntax checking`)

const out = path.resolve(__dirname, '../.verification')
fs.mkdirSync(out, { recursive: true })
const exe = path.join(out, process.platform === 'win32' ? 'binary-operations.exe' : 'binary-operations')
const program = PROGRAM_CATALOG.find(p => p.id === 'bt-operations')
const compiled = cp.spawnSync('gcc', ['-x', 'c', '-std=c11', '-o', exe, '-'], { input: program.code, encoding: 'utf8' })
assert.equal(compiled.status, 0, compiled.stderr)
const cases = [
  [program.input, program.output],
  ['0\n1\n1\n', 'Level order: (empty)\nNot found\nAfter delete: (empty)'],
  ['1\n-7\n-7\n-7\n', 'Level order: -7\nFound\nAfter delete: (empty)'],
  ['3\n10 30 5\n99\n99\n', 'Level order: 10 30 5\nNot found\nAfter delete: 10 30 5'],
  ['3\n10 30 5\n10\n10\n', 'Level order: 10 30 5\nFound\nAfter delete: 5 30'],
  ['3\n10 30 5\n5\n5\n', 'Level order: 10 30 5\nFound\nAfter delete: 10 30'],
  ['3\n10 10 5\n10\n10\n', 'Level order: 10 10 5\nFound\nAfter delete: 5 10'],
]
for (const [input, output] of cases) {
  const run = cp.spawnSync(exe, [], { input, encoding: 'utf8', timeout: 5000 })
  assert.equal(run.status, 0, String(run.error ?? run.stderr))
  assert.equal(run.stdout.trim().replace(/\r\n/g, '\n'), output)
}
console.log('PASS: binary-tree sample, empty tree, single node, missing key, root/last deletion, duplicates')

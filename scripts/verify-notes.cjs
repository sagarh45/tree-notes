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

const { COURSE, COURSE_TOPICS } = require('../src/data/course.ts')
const { topicCases, avlDeletion, AVL_DELETE_CASES } = require('../src/data/lessonCases.ts')
const { LINKED_PROGRAM, MULTIWAY_PROGRAM, BTREE_PROGRAM } = require('../src/data/coursePrograms.ts')
const { rotationScenario, avlInsertObserved, avlInsert } = require('../src/lib/avl.ts')
const { visitValues, heightOf } = require('../src/lib/binaryTree.ts')
const { BinaryTreeSvg } = require('../src/components/viz/BinaryTreeSvg.tsx')
const { avlBuildFrames } = require('../src/lib/stepBuilders.ts')
assert.deepEqual(COURSE.map(s => s.title), ['Tree Basics', 'Binary Tree', 'Binary Search Tree', 'Multiway Trees', 'B Tree', 'AVL Tree'])
assert.equal(new Set(COURSE.flatMap(s => s.topics)).size, COURSE.flatMap(s => s.topics).length, 'A topic belongs to exactly one main section')
let caseCount = 0
for (const lesson of COURSE) {
  let programs = 0, players = 0
  for (const id of lesson.topics) {
    const topic = COURSE_TOPICS.get(id)
    assert(topic, `Missing course topic: ${id}`)
    assert(topic.diagrams?.length || topic.termCards, `Missing course diagram: ${id}`)
    for (const d of topic.diagrams ?? []) assert(renderToStaticMarkup(React.createElement(Diagram, { d })).length > 0, `Blank course diagram: ${id}`)
    programs += Boolean(topic.program || PROGRAM_LINKS[id])
    const cases = topicCases(id)
    players += cases.length
    caseCount += cases.length
    assert.equal(new Set(cases.map(c => c.id)).size, cases.length, `Duplicate case IDs: ${id}`)
    for (const c of cases) {
      assert(c.steps.length, `No steps: ${id}/${c.id}`)
      for (const step of c.steps) assert(step.explanation.happening, `No explanation: ${id}/${c.id}`)
    }
  }
  assert(programs, `Missing program in syllabus point ${lesson.id}`)
  assert(players, `Missing interactive visualization in ${lesson.id}`)
}
const sorted = tree => visitValues(tree, 'inorder')
const balanced = tree => {
  if (!tree) return
  assert(Math.abs(heightOf(tree.left) - heightOf(tree.right)) <= 1, `Unbalanced final node ${tree.value}`)
  balanced(tree.left); balanced(tree.right)
}
for (const kind of ['LL', 'RR', 'LR', 'RL']) {
  const frames = rotationScenario(kind)
  assert.equal(Math.abs(frames[0].tree.bf), 2, `${kind} must start unbalanced`)
  assert.equal(frames.length, kind.length === 2 && kind[0] !== kind[1] ? 3 : 2)
  for (const f of frames) assert.deepEqual(sorted(f.tree), sorted(frames[0].tree), `${kind} lost a subtree`)
  balanced(frames.at(-1).tree)
}
for (const seq of [[30, 10, 20], [10, 30, 20], ['C', 'A', 'B']]) {
  const last = avlBuildFrames(seq).at(-1)
  assert(last.middle, 'Double rotation skipped the intermediate tree')
  assert.deepEqual(sorted(last.before), sorted(last.middle))
  assert.deepEqual(sorted(last.middle), sorted(last.after))
}
assert.deepEqual(sorted(avlBuildFrames([20, 10, 30, 20]).at(-1).after), [10, 20, 30])
const drawing = renderToStaticMarkup(React.createElement(BinaryTreeSvg, { root: treeFromSpec('20(10,30)') }))
assert.equal((drawing.match(/<line class="tn-edge"/g) ?? []).length, 2)
assert(!/<path class="tn-edge"/.test(drawing), 'Curved tree edge remains')
assert(drawing.includes('marker-end='), 'Arrowheads missing')

let seed = 20260916
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
let cascades = 0
for (let trial = 0; trial < 30; trial++) {
  const keys = Array.from({ length: 30 }, (_, i) => i - 10)
  for (let i = keys.length - 1; i > 0; --i) { const j = Math.floor(random() * (i + 1)); [keys[i], keys[j]] = [keys[j], keys[i]] }
  let tree = null
  const values = new Set()
  for (const key of keys) {
    const reference = avlInsert(tree, key)
    const result = avlInsertObserved(tree, key)
    values.add(key)
    for (const step of result.steps) assert.deepEqual(sorted(step.tree), [...values].sort((a,b) => a-b), 'Insert trace lost the outer tree')
    assert.deepEqual(sorted(result.root), sorted(reference))
    balanced(result.root)
    tree = result.root
  }
  assert.equal(avlInsertObserved(tree, keys[0]).steps.length, 0, 'Duplicate should be ignored')
  for (const key of [...keys, 999]) {
    const steps = avlDeletion(tree, key)
    values.delete(key)
    tree = steps.at(-1).tree
    assert.deepEqual(sorted(tree), [...values].sort((a,b) => a-b), 'AVL deletion lost keys')
    balanced(tree)
    if (steps.filter(s => /^(LL|RR|LR|RL) at/.test(s.label)).length > 1) cascades++
  }
}
assert(cascades > 0, 'Randomized coverage did not exercise cascading rotations')
for (const c of AVL_DELETE_CASES) {
  const tree = treeFromSpec(c.spec)
  balanced(tree)
  const steps = avlDeletion(tree, c.key)
  balanced(steps.at(-1).tree)
  assert.deepEqual(sorted(steps.at(-1).tree), sorted(tree).filter(v => v !== c.key))
}
console.log(`PASS: ${COURSE.length} main sections, ${caseCount} cases, straight arrows, four rotations, full-tree insertion traces, ${cascades} cascading AVL deletion repairs`)

for (const [id, p] of Object.entries({ linked: LINKED_PROGRAM, multiway: MULTIWAY_PROGRAM, btree: BTREE_PROGRAM })) {
  const output = path.join(out, `${id}-course${process.platform === 'win32' ? '.exe' : ''}`)
  const compile = cp.spawnSync('gcc', ['-x', 'c', '-std=c11', '-Wall', '-Wextra', '-o', output, '-'], { input: p.code, encoding: 'utf8' })
  assert.equal(compile.status, 0, compile.stderr)
  const run = cp.spawnSync(output, [], { input: p.input ?? '', encoding: 'utf8', timeout: 5000 })
  assert.equal(run.status, 0, String(run.error ?? run.stderr))
  assert.equal(run.stdout.trim().replace(/\r\n/g, '\n'), p.output)
  if (id === 'btree') {
    for (let trial = 0; trial < 30; trial++) {
      const keys = Array.from({ length: 60 }, () => Math.floor(random() * 100) - 50)
      const deletes = [...keys].reverse().concat([999])
      const values = new Set(keys)
      const expected = [`Inorder: ${[...values].sort((a,b) => a-b).join(' ')}`, 'Found']
      for (const key of deletes) { values.delete(key); expected.push(`After delete ${key}:${[...values].sort((a,b) => a-b).map(v => ` ${v}`).join('')}`) }
      const run = cp.spawnSync(output, [], { input: `${keys.length}\n${keys.join(' ')}\n${keys[0]}\n${deletes.length}\n${deletes.join(' ')}\n`, encoding: 'utf8', timeout: 5000 })
      assert.equal(run.status, 0, String(run.error ?? run.stderr))
      assert.equal(run.stdout.trim().replace(/\r\n/g, '\n'), expected.join('\n'))
    }
  }
}
console.log('PASS: linked, multiway and full B-Tree C samples; 30 randomized insert/search/delete program runs')

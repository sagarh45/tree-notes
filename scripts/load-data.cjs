const fs = require('node:fs')
const Module = require('node:module')
const ts = require('typescript')

Module._extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, file)

const { PROGRAM_CATALOG } = require('../src/data/programCatalog.ts')
const { COURSE_TOPICS } = require('../src/data/course.ts')
const { programInput } = require('../src/data/programInputs.ts')
module.exports = { PROGRAM_CATALOG, COURSE_TOPICS, programInput }

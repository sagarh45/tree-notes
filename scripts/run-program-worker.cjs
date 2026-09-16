const { parentPort, workerData } = require('node:worker_threads')
require('./load-data.cjs')
const { runWasi } = require('../src/lib/runWasi.ts')
runWasi(workerData.bytes, workerData.input).then(result => parentPort.postMessage(result)).catch(error => { throw error })

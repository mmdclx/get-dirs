const tape = require('tape')
const fs = require('fs')
const stream = require('stream')
const callbackStream = require('callback-stream')
const getDirs = require('../index')

const testDir = __dirname + '/testDirectory'

tape.test('it will return a stream.Readable which will stream found directories', t => {
  const dirs = getDirs(testDir, readableStream => {
    t.true(readableStream instanceof stream.Readable)

    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(dirs, [
          Buffer.from(`${testDir}/folderA`),
          Buffer.from(`${testDir}/folderB`),
          Buffer.from(`${testDir}/folderA/folderAA`),
        ])
        t.end()
      })
    )
  })
})

tape.test('the stream.Readable will dispatch end event when directory listing is finished', t => {
  const dirs = getDirs(testDir, readableStream => {
    readableStream.on('data', buffer => {}) // required to flow stream

    readableStream.on('end', () => {
      t.pass('stream dispatched end event')
      t.end()
    })
  })
})

tape.test('it will throw an error if no root directory is given', t => {
  t.throws(getDirs, /Please provide a root directory/)
  t.end()
})

tape.test('it will throw an error if no callback for stream.Readable is given', t => {
  t.throws(getDirs.bind(null, './'), /Please provide a callback function that takes a stream.Readable/)
  t.end()
})

tape.test('it will throw an error if root directory does not exist', t => {
  t.throws(
    getDirs.bind(null, './this_folder_does_not_exist', readableStream => {}), /ENOENT/)
  t.end()
})

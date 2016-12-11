const tape = require('tape')
const fs = require('fs')
const stream = require('stream')
const callbackStream = require('callback-stream')
const getDirs = require('../index')

const testDir = __dirname + '/testDirectory'

tape.test('it will return a stream.Readable which will stream found directories', t => {
  const dirs = getDirs(testDir, [], readableStream => {
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
  const dirs = getDirs(testDir, [], readableStream => {
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

tape.test('it will ignore any directories that match the strings passed to the exclude arg', t => {

  getDirs(testDir, ['folderAA'], readableStream => {
    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(dirs, [
          Buffer.from(`${testDir}/folderA`),
          Buffer.from(`${testDir}/folderB`)
        ])
      })
    )
  })

  getDirs(testDir, ['folderAA', 'folderB'], readableStream => {
    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(dirs, [
          Buffer.from(`${testDir}/folderA`)
        ])
      })
    )
  })

  getDirs(testDir, ['fold'], readableStream => {
    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(dirs, [])
      })
    )
  })

  t.end()
})

tape.test('it will ignore any directories that match a passed-in RegEx object', t => {
  fs.mkdirSync(`${testDir}/.secretFolder`)
  fs.mkdirSync(`${testDir}/test.folder`)

  const exclude = [/^\.\w+|\/\./] // match any root or nested /.dotFolders, nothing else
  getDirs(testDir, exclude, readableStream => {
    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(dirs, [
          Buffer.from(`${testDir}/folderA`),
          Buffer.from(`${testDir}/folderB`),
          Buffer.from(`${testDir}/test.folder`),
          Buffer.from(`${testDir}/folderA/folderAA`),
        ])
        fs.rmdirSync(`${testDir}/.secretFolder`)
        fs.rmdirSync(`${testDir}/test.folder`)
        t.end()
      })
    )
  })
})

tape.test('it will throw an error if something other than a string or RegEx is passed into exclusion array', t => {
  const exclude = [1, 2, 3]
  t.throws(getDirs.bind(null, testDir, exclude, readableStream => {}), /Only strings or RegExp objects are allowed in exclude array/)
  t.end()
})

tape.test('callback function is allowed to be passed as second argument', t => {
  getDirs(testDir, readableStream => {
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

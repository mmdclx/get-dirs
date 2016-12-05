const test = require('tape')
const fs = require('fs')
const getDirs = require('../get-dirs')

const testDir = __dirname + '/testDirectory'

test('get-dirs', t => {

  t.test('it will return, in an array, only directories', t => {
    const dirs = getDirs(testDir)

    t.deepEqual(dirs, [
      `${testDir}/folderA`,
      `${testDir}/folderA/folderAA`,
      `${testDir}/folderB`
    ])
    t.end()
  })

})

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

  t.test('it will throw an error if no root directory is given', t => {
    t.throws(getDirs, Error)
    t.end()
  })

  t.test('it will throw an error if root directory does not exist', t => {
    try {
      getDirs('./this_folder_does_not_exist')
    } catch(ex) {
      t.equal(ex.code, 'ENOENT')
    }
    t.end()
  })

})

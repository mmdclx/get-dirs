const test = require('tape')
const fs = require('fs')
const getDirs = require('../index')

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

  t.test('it will ignore any directories that match the naming passed to exclude arg', t => {

    let excludeDir = ['folderAA']
    let dirs = getDirs(testDir, excludeDir)
    t.deepEqual(dirs, [
      `${testDir}/folderA`,
      `${testDir}/folderB`
    ])

    excludeDir = ['folderAA', 'folderB']
    dirs = getDirs(testDir, excludeDir)
    t.deepEqual(dirs, [
      `${testDir}/folderA`
    ])

    excludeDir = ['fold']
    dirs = getDirs(testDir, excludeDir)
    t.deepEqual(dirs, [])

    t.end()

  })

  t.test('it will ignore any directories that match a passed-in RegEx object', t => {
    fs.mkdirSync(`${testDir}/.secretFolder`)
    fs.mkdirSync(`${testDir}/test.folder`)

    const exclude = [new RegExp('\/\.')]
    const dirs = getDirs(testDir, exclude)
    t.deepEqual(dirs, [
      `${testDir}/folderA`,
      `${testDir}/folderA/folderAA`,
      `${testDir}/folderB`,
      `${testDir}/test.folder`
    ])

    fs.rmdirSync(`${testDir}/.secretFolder`)
    fs.rmdirSync(`${testDir}/test.folder`)
    t.end()
  })

  t.test('it will ignore any directories that match a passed-in RegEx literal', t => {
    t.fail()
    t.end()
  })
})

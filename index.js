const fs = require('fs')
const path = require('path')

module.exports = function getDirs(rootDir, exclude) {
  if(isUndefined(rootDir)) {
    throw new Error('Please provide a root directory.')
  }
  if(!isUndefined(exclude)) {
    if(!Array.isArray(exclude)) {
      throw new Error('exclude arg must be an array of strings to exclude from output')
    }
    exclude = exclude.map(v => {
      return new RegExp(v, 'i')
    })
  }

  let dirs = [];

  (function readDir(dir) {
    let files = fs.readdirSync(dir)

    files.map(file => {
      return path.join(dir, file)
    }).filter(file => {
      try {
        let toExclude = false
        if(!isUndefined(exclude)) {
          toExclude = exclude.some(currVal => {
            let result = file.search(currVal)
            return result >= 0
          })
        }
        if(fs.statSync(file).isDirectory() && !toExclude) {
          return true
        }
      } catch(ex) {
        return false
      }
    }).forEach(foundDir => {
      dirs.push(foundDir)
      readDir(foundDir)
    })
  })(rootDir)

  return dirs
}

function isUndefined(v) {
  return typeof v === 'undefined'
}

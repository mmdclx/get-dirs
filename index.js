const fs = require('fs')
const path = require('path')
const stream = require('stream')

module.exports = function getDirs(rootDir, exclude, cb) {

  if(isUndefined(rootDir)) {
    throw new Error('Please provide a root directory.')
  }
  if(!isUndefined(exclude)) {
    if(typeof exclude === 'function') { // if cb is passed in as 2nd argument
      cb = exclude
      exclude = []
    }
    else if(!Array.isArray(exclude)) {
      throw new Error('exclude arg must be an array of strings to exclude from output')
    }
    else {
      exclude = exclude.map(v => {
        if(typeof v === 'string') {
          return new RegExp(v, 'i')
        } else if(v instanceof RegExp) {
          return v
        } else {
          throw new Error('Only strings or RegExp objects are allowed in exclude array. There is a problem with value: ' + v + ', which is an instance of: ' + Object.getPrototypeOf(v))
        }
      })
    }
  }

  class DirReadable extends stream.Readable {
    constructor(options) {
      super(options)
    }
    _read(size) {}
  }

  const readableStream = new DirReadable({
    encoding: 'utf-8'
  })

  // Keep track of recursive calls, so complete() can be called
  let asyncCounter = 0

  function readDir(dir, complete) {

    asyncCounter++

    fs.readdir(dir, (err, files) => {
      if(err) {
        if(err.code === 'EACCES') {
          console.error('Permission denied for dir: "' + err.path + '". Try running again with sudo')
        }
      }
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
        readableStream.push(foundDir)
        readDir(foundDir, complete)
      })

      asyncCounter--

      if(asyncCounter === 0)
        complete()
    })
  }

  readDir(rootDir, function complete() {
    readableStream.push(null)
  })

  cb(readableStream)
}

function isUndefined(v) {
  return typeof v === 'undefined'
}

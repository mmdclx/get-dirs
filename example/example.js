const getDirs = require('../index')

const matchDotFolders = /^\.\w+|\/\./ // RegExp to exclude any root or nested .dotFolders/
const exclusions = ['node_modules', matchDotFolders] // exclusions are optional

getDirs('../', exclusions, readableStream => {
  readableStream
    .on('data', dir => {
      console.log(dir)
    })
    .on('end', () => {
      console.log('listing of directories completed.')
    })
})

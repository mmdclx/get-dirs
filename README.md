# get-dirs
📂 `get-dirs` is a tiny helper for Node.js that walks your directory tree and streams each folder it finds.

Pass the starting path and receive a `Readable` stream of absolute directory paths.
You can also 🚫 skip folders by passing an array of patterns. Each pattern may be a plain string or a `RegExp`.
See usage:

## Usage

```javascript
const getDirs = require('get-dirs')

const matchDotFolders = /^\.\w+|\/\./ // RegExp to exclude any root or nested .dotFolders/
const exclusions = ['node_modules', matchDotFolders] // exclusions are optional

getDirs(__dirname, exclusions, readableStream => {
  readableStream
    .on('data', dir => {
      console.log(dir)
    })
    .on('end', () => {
      console.log('Listing of directories completed.')
    })
})
```

```javascript
// Skip folderB inside the test directory
getDirs('./test/testDirectory', ['folderB'], stream => {
  stream.on('data', dir => console.log(dir))
  stream.on('end', () => console.log('Done'))
})
```

Tested on Mac OSX only so far.

**note**: prior versions of this package used `instanceof RegExp` to validate the
`exclude` argument. In some versions of the Node REPL each expression is
evaluated in its own context, so a `RegExp` created there would fail the check.
The library now performs a context-agnostic test, so the example works in the
REPL as well as in a script.

## Run unit tests
```sh
$ npm test
```

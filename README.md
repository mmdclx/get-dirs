# get-dirs
`get-dirs` 🌳 recursively walks a directory and returns a Node.js `Readable`
stream of absolute folder paths. Supply a starting path and optionally pass an
array of patterns to 🚫 skip directories using strings or `RegExp`s.

See the example below for details.

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

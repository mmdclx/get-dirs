# get-dirs
Given a root directory, get-dirs will return a readable Stream that will push
all sub-directories.

Allows for exclusions: strings to match, or RegExp instances. See usage.

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

# get-dirs
Given a root directory, get-dirs will synchronously return an array with
all sub-directories.

Allows for exclusions: strings to match, or RegExp instances. See usage.

## Usage
```javascript
const getDirs = require('get-dirs')

const matchDotFolders = /^\.\w+|\/\./ // RegExp to exclude any root or nested .dotFolders/
const exclusions = ['node_modules', matchDotFolders]

const dirs = getDirs(__dirname, exclusions)  // exclusions is optional

console.log(dirs)
```

Tested on Mac OSX only so far.

**note**: running the above example in the node REPL will cause an error — the `get-dirs`
module will claim that the RegExp is not actually an `instanceof RegExp`. I don't know why,
but it will work fine run inside a `js` file. If anyone knows why please feel free to enlighten me.

## Run unit tests
```sh
$ npm test
```

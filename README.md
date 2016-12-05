# get-dirs

get-dirs is an npm package to recursively get all directories and subdirectories of a path. Allows for exclusions (eg 'node_modules').

get-dirs will synchronously gather all sub-directories, and return an array.

## Usage
```javascript
const getDirs = require('get-dirs')

const matchDotFolders = /^\.\w+|\/\./ // RegExp to exclude any root or nested .dotFolders/
const exclusions = ['node_modules', matchDotFolders]

const dirs = getDirs(__dirname, exclusions)  // exclusions is an optional arg

console.log(dirs)
```

Tested on Mac OSX only so far.

## Run unit tests
```bash
$ npm test
```

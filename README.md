# get-dirs

get-dirs is an npm package to recursively get all directories and subdirectories of a path. Allows for exclusions (eg 'node_modules').

get-dirs will synchronously gather all sub-directories, and return an array.

## Usage
```javascript
const getDirs = require('get-dirs')

const exclusions = ['node_modules', '.git'] // optional arg
const dirs = getDirs(__dirname, exclusions)

console.log(dirs)
```

Tested on Mac OSX only so far.

## Run unit tests
```bash
$ npm test
```

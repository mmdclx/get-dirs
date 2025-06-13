const tape = require('tape');
const mock = require('mock-fs');
const stream = require('stream');
const callbackStream = require('callback-stream');

// Only run on Windows
const isWin = process.platform === 'win32';
const test = isWin ? tape : tape.skip;
const getDirs = require('../index');

const rootDir = 'C:/testDir';

const mockConfig = {
  'C:/testDir/folderA': {
    'folderAA': {}
  },
  'C:/testDir/folderB': {}
};

test('getDirs works on Windows paths', t => {
  mock(mockConfig);

  getDirs(rootDir, [], readableStream => {
    t.true(readableStream instanceof stream.Readable);

    readableStream.pipe(
      callbackStream((err, dirs) => {
        t.deepEqual(
          dirs.map(d => d.toString()),
          [
            'C:/testDir/folderA',
            'C:/testDir/folderB',
            'C:/testDir/folderA/folderAA'
          ]
        );
        mock.restore();
        t.end();
      })
    );
  });
});

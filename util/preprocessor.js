#!/usr/bin/env node

/**
 * simple text preprocessor for solidity files
 * extends https://www.npmjs.com/package/preprocessor with inline includes.
 */

const fs = require('fs');
const Preprocessor = require('preprocessor');
const optimist = require('optimist');

const solProcessor = (inputfile, outputfile, defines) => {
  let content = fs.readFileSync(inputfile).toString();

  const matches = content.match(/@@include\(\'[^\)]*\'\)/g);
  const includes = [];
  for (const idx in matches) {
    const filename = matches[idx].slice(11, -2);
    if (typeof includes[filename] === 'undefined') {
      includes[filename] = fs.readFileSync(filename).toString();
    }
    content = content.replace(matches[idx], includes[filename]);
  }

  fs.writeFileSync(outputfile, new Preprocessor(content).process(defines));
};

const preprocessContracts = (sourceDir, destinationDir, defines) => {
  const contracts = fs.readdirSync(sourceDir)
    .filter(elem => elem.match(/.sol$/));

  console.log(`Defines: ${JSON.stringify(defines)}`);
  for (var idx in contracts) {
    console.log(`Processing ${contracts[idx]} ...`);
    solProcessor(
      sourceDir + contracts[idx],
      destinationDir + contracts[idx],
      defines
    );
  }
};

const cmdline = () => {
  const argv = optimist
    .usage('Simple text preprocessor. \nUsage: $0')
    .options('s', {
      alias: 'source',
      description: 'Source Dir',
      demand: true,
    })
    .options('d', {
      alias: 'destination',
      description: 'Destination Dir',
      demand: true,
    })
    .argv;

  let sourceDir = argv.source;
  if (sourceDir.slice(-1) !== '/') sourceDir += '/';
  let destinationDir = argv.destination;
  if (destinationDir.slice(-1) !== '/') destinationDir += '/';
  delete argv._;
  delete argv.$0;
  delete argv.source;
  delete argv.destination;
  console.log(argv);
  preprocessContracts(sourceDir, destinationDir, argv);
};

if (typeof process.argv !== 'undefined') cmdline();

#!/usr/bin/env node
import { Command } from 'commander';
import { transform } from './lib';

const program = new Command();
program.storeOptionsAsProperties(false);

program.name('sico')
program.arguments('<pattern>');
program.option(`-w --write`, 'overwrite origin files', false);
program.option(`-p --pretty`, 'pretty output', false);
program.option(`-o --output <destination>`, 'output path for new files (can not coexist with write)');
program.action(async (pattern) => {
  const options = program.opts();
  const { output, write } = options;
  if(output && write) {
    throw new Error('--write and --output are in conflict')
  }
  try {
    await transform(pattern, options);
  } catch(err) {
    console.error(err);
    console.error(err.stack);
    process.exit(2);
  }
});

try {
  program.parse(process.argv);
} catch(err) {
  console.error(`ERROR: `, err.message);
  process.exit(1);
}

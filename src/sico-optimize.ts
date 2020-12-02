#!/usr/bin/env node
import { Command } from 'commander';
import { transform } from './lib/optimize';

const program = new Command();
program.storeOptionsAsProperties(false);

program.arguments('<pattern>');
program.option(`-w --write`, 'overwrite origin files', false);
program.option(`-p --pretty`, 'pretty output', false);
program.option(`--current-color`, 'transform color to currentColor', false);
program.option(`--convert-path-data`, 'convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more', false);
program.option(`--set-size-1em`, 'set svg width and height to 1em', false);
program.option(`-o --output <destination>`, 'output path for new files (can not coexist with write)');
program.action(async (pattern) => {
  const options = program.opts();
  const { output, write } = options;
  if(output && write) {
    throw new Error('--write and --output are in conflict')
  }
  try {
    await transform(pattern, options as any);
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

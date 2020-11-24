#!/usr/bin/env node
import { Command } from 'commander';
import { pack } from './lib/sprite';

const program = new Command();
program.storeOptionsAsProperties(false);

program.arguments('<pattern>');
program.option(`-p --pretty`, 'pretty output', false);
program.requiredOption(`-o --output-file <filename>`, 'output file for new files (can not coexist with write)');
program.action(async (pattern) => {
  const options = program.opts();
  try {
    await pack(pattern, options as any);
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

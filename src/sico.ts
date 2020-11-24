#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program.storeOptionsAsProperties(false);

program.name('sico')
program.version(require('../package.json').version);

program.command(`sprite`, 'package svg files to a single sprite file', { executableFile: './sico-sprite' });
program.command(`optimize`, 'optimize svg icons', { executableFile: './sico-optimize' });

try {
  program.parse(process.argv);
} catch(err) {
  console.error(`ERROR: `, err.message);
  process.exit(1);
}

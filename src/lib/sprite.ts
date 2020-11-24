import fs from 'fs';
import path from 'path';
import svgSpreact from 'svg-spreact';
import { runPattern } from './commons';

interface Options {
  pretty: boolean;
  outputFile: string;
}

export async function pack(pattern: string, options: Options) {
  const matchs = await runPattern(pattern);
  if(matchs.length < 1) {
    process.stdout.write('no matching files\n');
    return;
  }

  const uniqueFilter = new Set();

  const filenames = matchs.map(file => {
    const filename = path.parse(file).name;
    if (uniqueFilter.has(filename)) {
      console.log(`ERROR: sprite name conflict {${filename}} of file ${file}`);
      process.exit(2);
    } else {
      uniqueFilter.add(filename);
    }
    return filename;
  });

  const svgs = matchs.map(file => {
    console.log(`INFO: match file: ${file}`);
    return fs.readFileSync(path.resolve(file), { encoding: 'utf-8' });
  });
  const sprite = await svgSpreact(svgs, {
    tidy: options.pretty,
    optimize: false,
    processId: n => {
      return filenames[n];
    }
  });
  fs.writeFileSync(path.resolve(options.outputFile), sprite.defs, { encoding: 'utf-8' });
  console.log(`INFO: write svg sprite to file ${options.outputFile}`);

}
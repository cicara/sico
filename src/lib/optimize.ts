import fs from 'fs';
import path from 'path';
import glob from 'glob';
import Svgo from 'svgo';
import pretty from 'pretty';
import commondir from 'commondir';
import * as svgson from 'svgson';

interface Options {
  write?: boolean;
  pretty: boolean;
  output?: string;
  setSize1em: boolean;
  currentColor: boolean;
  convertPathData: boolean;
}

function runPattern(pattern: string) {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(pattern, (err, matchs) => {
      if(err) {
        reject(err);
      } else {
        resolve(matchs);
      }
    });
  });
}

async function readSVGFile(filepath: string) {
  return await fs.promises.readFile(filepath, { encoding: 'utf-8' });
}

function setCurrentColor(node: svgson.INode) {
  if(node.attributes) {
    if(node.attributes.fill && node.attributes.fill !== 'none') {
      node.attributes.fill = 'currentColor';
    }
    if(node.attributes.stroke && node.attributes.stroke !== 'none') {
      node.attributes.stroke = 'currentColor';
    }
  }
  if(node.children && node.children.length > 0) {
    node.children = node.children.map(child => setCurrentColor(child)).filter(child => child !== null) as Array<svgson.INode>;
  }
  return node;
}

function removeEmptyDefs(node: svgson.INode) {
  if(node.name === 'defs') {
    if(node.children.length < 1) {
      return null;
    }
  }
  if(node.children && node.children.length > 0) {
    node.children = node.children.map(child => removeEmptyDefs(child)).filter(child => child !== null) as Array<svgson.INode>;
  }
  return node;
}

export async function transform(pattern: string, options: Options) {
  const svgo = new Svgo({
    plugins: [
      { removeViewBox: false },
      { convertPathData: options.convertPathData },
      { removeUselessDefs: true },
      { removeStyleElement: true },
      { removeScriptElement: true },
      {
        removeAttrs: {
          attrs: [
            '(class|style)',
            // 'svg:width',
            // 'svg:height',
            'aria-labelledby',
            'aria-describedby',
            'xmlns:xlink',
            'data-name',
          ],
        },
      },
    ],
  });
  const matchs = await runPattern(pattern);
  if(matchs.length < 1) {
    return;
  }

  let results: Array<any> = await Promise.all(
    matchs.map(async match => {
      const filepath = path.resolve(match);
      const svg = await readSVGFile(filepath);
      // step 1
      const optimizedSvg = await svgo.optimize(svg);
      // step 2
      let svgNode = await svgson.parse(optimizedSvg.data);
      if(options.currentColor) {
        svgNode = setCurrentColor(svgNode);
      }
      svgNode = removeEmptyDefs(svgNode)!;
      // step 3
      if(options.setSize1em) {
        svgNode.attributes.width = '1em';
        svgNode.attributes.height = '1em';
      }

      return {
        svg: svgson.stringify(svgNode),
        file: filepath,
      };
    }),
  );

  if(options.pretty) {
    results = results.map(result => ({ ...result, svg: pretty(result.svg) }));
  }

  if(options.write) {
    await Promise.all(
      results.map(async result => {
        await fs.promises.writeFile(result.file, result.svg, { encoding: 'utf-8' });
        process.stdout.write(`success write file: ${ result.file }\n`);
      }),
    );
  } else if(options.output) {
    const common = results.length > 1? commondir(results.map(result => result.file)) : path.dirname(results[0].file);

    results = results.map((result) => {
      result.shortpath = path.relative(common, result.file);
      return result;
    });

    await Promise.all(
      results.map(async result => {
        const destination = path.resolve(options.output!, result.shortpath);
        const destinationDir = path.dirname(destination);
        if(!fs.existsSync(destinationDir)) {
          await fs.promises.mkdir(destinationDir, { recursive: true });
        }
        await fs.promises.writeFile(destination, result.svg, { encoding: 'utf-8' });
        process.stdout.write(`success write file: ${ destination }\n`);
      }),
    );
  } else {
    results.forEach(result => {
      process.stdout.write(`<!-- ${ result.file } -->\n`);
      process.stdout.write(`${ result.svg  }\n`)
    });
  }
}
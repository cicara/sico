import { glob } from 'glob';

export function runPattern(pattern: string) {
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
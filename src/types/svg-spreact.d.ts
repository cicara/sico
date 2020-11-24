declare module 'svg-spreact' {

  interface SpreactOptions {
    tidy: boolean;
    optimize: boolean;
    processId: (n: number) => string;
  }

  interface Spreact {
    defs: string;
  }

  export default async function(svgs: Array<string>, options: SpreactOptions): Promise<Spreact>;

}
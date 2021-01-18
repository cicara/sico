Svg Icon Optimize
====

- Pack svg sprites
- Optimize svg file for svg icons

### Usage
```shell
npm install -g sico
```

### Options
```txt
$ sico --help
Usage: sico [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  sprite          package svg files to a single sprite file
  optimize        optimize svg icons
  help [command]  display help for command
```

```txt
$ sico sprite --help
Usage: sico-sprite [options] <pattern>

Options:
  -p --pretty                  pretty output (default: false)
  -o --output-file <filename>  output file for new files (can not coexist with write)
  -h, --help                   display help for command
```

```txt
$ sico optimize --help
Usage: sico-optimize [options] <pattern>

Options:
  -w --write                 overwrite origin files (default: false)
  -p --pretty                pretty output (default: false)
  --current-color            transform color to currentColor (default: false)
  --convert-path-data        convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more (default: false)
  --set-size-1em             set svg width and height to 1em (default: false)
  -o --output <destination>  output path for new files (can not coexist with write)
  -h, --help                 display help for command
```

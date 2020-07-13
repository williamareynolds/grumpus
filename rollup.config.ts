import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [typescript({
    typescript: require('typescript')
  })],
  external: [
    'axios',
    'fp-ts/lib/Either',
    'fp-ts/lib/Task',
    'fp-ts/lib/TaskEither',
    'fp-ts/lib/pipeable',
    'io-ts/lib/Decoder',
    'io-ts/lib/Schema',
    'io-ts/lib/Tree',
  ]
}

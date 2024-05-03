import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve' // eslint-disable-line import/namespace
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'

import pkg from './package.json' assert { type: 'json' }

const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const resolve = fp => path.resolve(_dirname, fp)

const inputFileName = 'src/index.ts'
const moduleName = pkg.name.replace(/^@.*\//, '')
const banner = `
/**
 * @license
 * author: ${pkg.author}
 * ${moduleName} v${pkg.version}
 * Released under the ${pkg.license} license.
 */
`

const external = [...Object.keys(pkg.dependencies || {})]

const pluginsBase = [
  typescript({
    outputToFilesystem: false,
  }),
  nodeResolve({
    browser: true,
    jsnext: true,
  }),
  commonjs({
    extensions: ['.js', '.ts'],
  }),
  babel({
    babelHelpers: 'bundled',
    configFile: resolve('.babelrc'),
  }),
]

/* Main Config */
export default [
  /* CommonJS */
  {
    external,
    input: inputFileName,
    output: {
      banner,
      exports: 'named',
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [...pluginsBase],
  },

  /* UMD */
  {
    input: inputFileName,
    output: {
      banner,
      file: pkg.browser,
      format: 'umd',
      name: 'inquire',
    },
    plugins: [...pluginsBase],
  },

  /* Minified UMD */
  {
    input: inputFileName,
    output: {
      banner,
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'inquire',
    },
    plugins: [...pluginsBase, terser()],
  },

  /* ESM */
  {
    external,
    input: inputFileName,
    output: {
      banner,
      exports: 'named',
      file: pkg.module,
      format: 'es',
    },
    plugins: [...pluginsBase],
  },

  /* Types Declarations */
  {
    input: './.build/src/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]

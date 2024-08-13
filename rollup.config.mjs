import commonjs from '@rollup/plugin-commonjs'

import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dts } from 'rollup-plugin-dts'

export default [
  defineConfig({
    input: ['./src/index.ts'],
    output: [
      {
        file: './dist/index.cjs.js',
        format: 'commonjs',
        sourcemap: false,
      },
      {
        file: './dist/index.esm.js',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [del({ targets: 'dist', runOnce: true }), typescript(), nodeResolve(), commonjs()],
  }),
  defineConfig({
    input: './dist/types/index.d.ts',
    output: [{ file: './dist/index.d.ts', format: 'esm' }],
    plugins: [dts(), del({ hook: 'buildEnd', targets: 'dist/types' })],
  }),
]

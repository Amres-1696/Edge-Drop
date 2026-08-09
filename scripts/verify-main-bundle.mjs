import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bundlePath = resolve(root, 'out/main/index.js')
const bundle = await readFile(bundlePath, 'utf8')

const forbidden = [
  { pattern: /from\s+["']zustand["']/, name: 'zustand' },
  { pattern: /use-sync-external-store/, name: 'use-sync-external-store' }
]

const leaked = forbidden.filter(({ pattern }) => pattern.test(bundle)).map(({ name }) => name)
if (leaked.length > 0) {
  console.error(
    `\n[main-boundary] 主进程错误引入了渲染层状态依赖：${leaked.join(', ')}。\n` +
    '请检查 electron/main 是否导入了 src/i18n、src/store 或仅供 React 使用的模块。\n'
  )
  process.exit(1)
}

console.log('[main-boundary] 主进程未引入 Zustand 或 use-sync-external-store。')

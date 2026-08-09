import { access, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractFile, listPackage } from '@electron/asar'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const resources = join(root, 'dist', 'win-unpacked', 'resources')
const asarPath = join(resources, 'app.asar')

const entries = new Set(listPackage(asarPath).map((entry) => entry.replaceAll('\\', '/')))
const requiredPackages = [
  'electron-updater',
  'builder-util-runtime',
  'use-sync-external-store',
  'loose-envify',
  'scheduler',
  'svgpath',
  'motion-utils'
]

const missingPackages = requiredPackages.filter(
  (name) => !entries.has(`/node_modules/${name}/package.json`)
)

if (missingPackages.length > 0) {
  console.error(`\n[package-contents] app.asar 缺少生产依赖：${missingPackages.join(', ')}。\n`)
  process.exit(1)
}

const packagedMain = extractFile(asarPath, join('out', 'main', 'index.js')).toString('utf8')
if (/from\s+["']zustand["']|use-sync-external-store/.test(packagedMain)) {
  console.error('\n[package-contents] 打包后的主进程仍然包含渲染层状态依赖。\n')
  process.exit(1)
}

const nativeFiles = [
  join(resources, 'koffi', 'win32_x64', 'koffi.node'),
  join(resources, 'resvg', 'resvgjs.win32-x64-msvc.node')
]

for (const path of nativeFiles) {
  await access(path)
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
console.log(`[package-contents] v${packageJson.version} 的 ASAR 依赖、主进程边界和原生组件均完整。`)

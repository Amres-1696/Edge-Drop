import { lstat, readFile, realpath } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const modulesPath = join(root, 'node_modules')

function fail(message) {
  console.error(`\n[package-env] ${message}\n`)
  process.exit(1)
}

let modulesStats
try {
  modulesStats = await lstat(modulesPath)
} catch {
  fail('node_modules 不存在。请先在当前项目目录运行 npm ci。')
}

const resolvedModules = await realpath(modulesPath)
const samePath = resolvedModules.localeCompare(modulesPath, undefined, { sensitivity: 'accent' }) === 0

if (modulesStats.isSymbolicLink() || !samePath) {
  fail(
    `检测到共享或链接形式的 node_modules：${resolvedModules}\n` +
    'electron-builder 可能因此漏掉传递依赖。请删除该链接，并在当前项目目录运行 npm ci 后再打包。'
  )
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const lockJson = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'))
const lockedRoot = lockJson.packages?.['']

if (!lockedRoot || lockedRoot.version !== packageJson.version) {
  fail('package.json 与 package-lock.json 的项目版本不一致，请先运行 npm install 更新锁文件。')
}

const npmArgs = ['ls', '--omit=dev', '--all']
if (!process.env.npm_execpath) {
  fail('请通过 npm run verify:package-env 执行此检查，以便可靠定位 npm CLI。')
}

const npmResult = spawnSync(
  process.execPath,
  [process.env.npm_execpath, ...npmArgs],
  { cwd: root, stdio: 'inherit' }
)

if (npmResult.error || npmResult.status !== 0) {
  fail('生产依赖树不完整。请在当前项目目录运行 npm ci，并处理 npm ls 报告的问题。')
}

console.log('[package-env] 当前目录使用独立且完整的生产依赖树，可以开始打包。')

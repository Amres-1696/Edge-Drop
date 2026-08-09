# Edge Drop 备忘录与待办实施计划

## 基线

- 分支：`feature/notes-todos`
- 工作区：`.worktrees/notes-todos`
- 规格：`specs/2026-08-09-notes-todos-ux-spec.md`
- 原则：主进程为数据真相源；记录与剪贴板分开持久化；不引入第二套动画库。

## 阶段 1：领域模型与转换规则

1. 在 `shared/types.ts` 增加 Note、Todo、附件、记录快照和 UI 工作区类型。
2. 新建 `electron/store/recordConversion.ts`，实现文本、链接、图片、图片集合和文件到记录草稿的纯转换规则。
3. 新建 `tests/recordConversion.test.ts`，覆盖标题提取、正文保留、文件命名、图片集合和重复来源识别。
4. 验证：定向 Vitest + Node/Web TypeScript 类型检查。

## 阶段 2：RecordStore 与资源生命周期

1. 扩展 `electron/store/paths.ts`，增加 `records.json` 与 `record-assets`。
2. 新建 `electron/store/RecordStore.ts`：加载、加密、原子写入、CRUD、完成/恢复、置顶、搜索源数据、转换去重、图片资源复制和删除 tombstone。
3. 新建 `tests/recordStore.test.ts`，使用临时目录和可注入适配器验证重启恢复、独立生命周期、图片复制、文件引用、撤销删除及损坏文件保护。
4. 验证：定向 Vitest + 全部 Store 测试。

## 阶段 3：类型化 IPC 与 Renderer 状态

1. 扩展 `shared/ipc.ts`、`shared/bridge.ts` 和 `electron/preload/index.ts`。
2. 在 `electron/main/state.ts` 初始化 RecordStore，并广播 `state:records`。
3. 在 `electron/main/ipc.ts` 注册转换、备忘、待办、删除/恢复和清理已完成项目接口。
4. 新建 `src/store/recordStore.ts`，实现乐观更新、错误回滚和保存状态。
5. 在 `src/App.tsx` 完成记录加载与事件订阅。
6. 验证：Node/Web TypeScript 类型检查。

## 阶段 4：两层导航与记录页面

1. 重构 `Header.tsx` 为一级工作区切换和上下文二级导航。
2. 在 `appStore.ts` 增加工作区、记录页签、搜索展开和编辑器 UI 状态。
3. 新建 `RecordsView.tsx`、`NotesView.tsx`、`TodosView.tsx`、`NoteEditor.tsx`。
4. 在 `Panel.tsx` 接入工作区视图、上下文底栏和编辑器互斥。
5. 新建 `src/styles/records.css` 并接入样式入口。
6. 验证：Web TypeScript 类型检查 + 生产 Renderer 构建。

## 阶段 5：剪贴板联动与微互动

1. 在 `ClipboardItem.tsx` 增加“保存为备忘 / 添加为待办 / 查看”动作。
2. 接入 Segmented Control、Expanding Search、Press Depth、Value Flash、Show More、Accordion、Icon Morph、Hold to Confirm 和 New Items Pill 的适配实现。
3. 所有动作读取系统和应用减少动态效果，不使用长期 `will-change`、静态 `translateZ(0)` 或 `backface-visibility`。
4. 增加快捷键：`Ctrl+F`、记录页 `Ctrl+N`、`Esc`、待办输入 `Enter`、编辑器 `Ctrl+S`。
5. 验证：组件关键状态测试、键盘路径检查和全量类型检查。

## 阶段 6：本地化、回归与交付

1. 为 `TranslationKeys`、英文和简体中文补齐记录功能文案；其他语言通过英文回退，不在组件中写死用户可见字符串。
2. 扩展本地化测试，保证 `en` 与 `zh-CN` 新键完全对应。
3. 运行全部 Vitest、Node/Web TypeScript、`electron-vite` 生产构建和 `git diff --check`。
4. 启动开发构建，人工检查剪贴板、备忘、待办、编辑器、减少动态效果和 100%/125%/150% 字体缩放。
5. 修复回归后生成 Windows 安装包，保存在本地输出目录；是否上传远端按用户后续指令执行。

## 提交策略

- 每个阶段至少一个小提交，提交信息清楚说明领域、IPC、UI 或测试变更。
- 不修改 `main`，完成后在功能分支提供完整验证证据。
- 不覆盖用户已有的中文增强改动和上游待整合内容。

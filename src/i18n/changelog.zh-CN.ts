export interface ChangelogHighlight {
  title: string
  description: string
}

export interface ChangelogRelease {
  version: string
  date: string
  isLatest: boolean
  summary: string
  highlights: ChangelogHighlight[]
}

/**
 * 中文版发布记录。
 *
 * 这份数据同时供渲染进程和主进程使用，确保离线回退、首次渲染和
 * GitHub Releases 同步后的界面不会混入英文说明。
 */
export const ZH_CN_CHANGELOG: ChangelogRelease[] = [
  {
    version: 'v0.2.5',
    date: '2026年8月3日',
    isLatest: true,
    summary: '新增 30 种语言本地化、笔记本睡眠与解锁保护、字体大小调节、多文件批量操作，以及多项性能和显示质量优化。',
    highlights: [
      {
        title: '30 种语言完整本地化',
        description: '所有界面、设置、引导和托盘菜单均接入正式翻译体系，同时支持阿拉伯语与希伯来语从右到左布局。'
      },
      {
        title: '多文件批量选择与操作栏',
        description: '预览多个文件时可逐项选择，并执行全选、复制所选、粘贴所选和清除选择。'
      },
      {
        title: '字体大小与悬停激活设置',
        description: '可调节界面文字大小，并可关闭屏幕边缘悬停激活，仅保留 Alt+C 快捷键。'
      },
      {
        title: '自动更新与手动检查',
        description: '新增自动更新开关、快速手动检查、后台下载和重启安装流程，同时隔离 Microsoft Store 构建。'
      },
      {
        title: '性能、显示器与睡眠保护',
        description: '降低边缘轮询耗电，修复多显示器重连位置、睡眠解锁误触发复制提示和预览面板纵向偏移。'
      },
      {
        title: '清晰文字与全分辨率图片',
        description: '移除导致文字软化的亚像素渲染路径，并直接加载完整分辨率图片，改善高缩放显示器上的清晰度。'
      }
    ]
  },
  {
    version: 'v0.2.2',
    date: '2026年7月29日',
    isLatest: false,
    summary: '新增固定式三分类设置导航、基于 Web Audio API 的触感音效、边缘触发位置预设和 5% 磁吸刻度滑块。',
    highlights: [
      {
        title: '固定式三分类设置导航',
        description: '将设置整理为“行为、位置、外观”三个标签页；顶部导航保持固定，并分别记忆各页面的滚动位置。'
      },
      {
        title: '合成式 Web Audio 触感音效',
        description: '无需外部音频资源，即可为旋钮刻度、按钮、开关和删除操作提供触感音效反馈。'
      },
      {
        title: '独立边缘触发对齐与位置提示',
        description: '可将触发区域设为顶部、居中或底部，并通过动态 clipPath 和边缘微光提示当前位置。'
      },
      {
        title: '5% 磁吸刻度滑块与退出操作',
        description: '滑块支持细腻的实时跟随，并在松开时吸附到 5% 刻度；设置中同时加入了退出 Edge-Drop 的操作。'
      }
    ]
  },
  {
    version: 'v0.2.1',
    date: '2026年7月28日',
    isLatest: false,
    summary: '新增跨重启的多显示器配置保留、五分类分段筛选、统一图像分类和高清抗锯齿曲边。',
    highlights: [
      {
        title: '跨重启保留显示器配置',
        description: '四级显示器匹配流程会记住所选显示器；设备重启后仍可通过几何信息重新识别，并在失败时回退到主显示器。'
      },
      {
        title: '五分类分段筛选栏',
        description: '加入“全部、文本、链接、图片、文件”五类快速筛选，并使用平滑滑动的选中指示条。'
      },
      {
        title: '统一图像分类',
        description: '系统截图（Win+Shift+S）与复制的 .png、.jpg、.webp、.svg 等图像文件统一归入“图片”分类。'
      },
      {
        title: '高清抗锯齿曲边',
        description: '通过 padding-box 裁剪和设备像素对齐，在不同显示缩放比例下呈现清晰平滑的曲边。'
      }
    ]
  },
  {
    version: 'v0.2.0',
    date: '2026年7月26日',
    isLatest: false,
    summary: '新增静默后台自动更新、GitHub Releases 更新记录同步、快捷链接启动和独立的置顶项目区域。',
    highlights: [
      {
        title: '静默后台自动更新',
        description: '新版本会在后台静默下载，完成后可通过“重启并更新”按钮一键安装。'
      },
      {
        title: '默认浏览器一键打开链接',
        description: '复制的链接会显示专用打开按钮，可直接在默认浏览器中访问。'
      },
      {
        title: '独立的置顶项目区域',
        description: '置顶项目集中显示在剪贴板顶部的独立区域中。'
      },
      {
        title: '更新记录实时同步',
        description: '发布记录与 GitHub Releases 同步，并提供离线回退数据。'
      },
      {
        title: 'Microsoft Store 构建隔离',
        description: '独立构建流程确保 Microsoft Store（MSIX）版本符合商店政策。'
      }
    ]
  },
  {
    version: 'v0.1.5',
    date: '2026年7月24日',
    isLatest: false,
    summary: '新增可自定义的复制提示样式和 2×2 选择面板，并修复中、大面板高度下的悬停稳定性问题。',
    highlights: [
      {
        title: '四种矢量提示图标',
        description: '支持 Edge-Drop 标志、对勾、复制和星光四种复制提示样式。'
      },
      {
        title: '2×2 网格样式选择器',
        description: '在设置的“提示样式”中加入 2×2 网格面板，可快速预览并单击选择。'
      },
      {
        title: '清晰的矢量图形渲染',
        description: '移除图标背景圆形徽章，让图标以纯矢量形式显示，并保留轻微发光阴影。'
      },
      {
        title: '修复设置按钮区域的悬停边界',
        description: '修复鼠标移向设置按钮时，中等（60%）和较大（80%）高度面板提前收起的问题。'
      },
      {
        title: '重新校准纵向热区',
        description: '更新边缘悬停检测中的面板高度计算，使展开面板的整个纵向区域保持有效。'
      }
    ]
  },
  {
    version: 'v0.1.4',
    date: '2026年7月23日',
    isLatest: false,
    summary: '为游戏玩家和演示场景加入自动全屏保护，通过 Windows 原生 API 检测 Direct3D 游戏和全屏媒体。',
    highlights: [
      {
        title: '自动检测游戏与全屏状态',
        description: '使用 Windows 原生 API 识别 Direct3D 全屏游戏、演示模式和系统忙碌状态。'
      },
      {
        title: '抑制悬停并立即自动收起',
        description: '前台运行全屏游戏、视频或演示时，自动暂停边缘悬停并立即收起面板。'
      },
      {
        title: '零额外延迟与快捷键访问',
        description: '后台每秒检测一次，不增加边缘悬停检测开销；全局快捷键 Alt+C 仍可使用。'
      },
      {
        title: '全屏保护开关',
        description: '在“行为”设置中加入“全屏保护”开关，默认开启。'
      },
      {
        title: 'GitHub 支持与反馈入口',
        description: '在设置中加入“社区与支持”区域，可直接提交问题和功能建议。'
      }
    ]
  },
  {
    version: 'v0.1.3',
    date: '2026年7月23日',
    isLatest: false,
    summary: '重构多显示器架构，统一显示器选择来源、系统托盘状态，并支持显示器断开后的自动恢复。',
    highlights: [
      {
        title: '统一显示器引擎与托盘实时同步',
        description: '应用设置与系统托盘共用同一份显示器列表和选择状态。'
      },
      {
        title: '显示器断开后自动恢复',
        description: '承载面板的副显示器断开后，Edge-Drop 会自动切换回主显示器。'
      },
      {
        title: '短暂弹出确认位置',
        description: '显示器配置变化后，剪贴板面板会自动展开 1.5 秒，直观确认新位置。'
      },
      {
        title: '预览面板通用单击粘贴',
        description: '单击预览面板中的文本、图像缩略图或文件，即可粘贴到当前活动应用。'
      },
      {
        title: '动画控制',
        description: '增加独立的弹性展开动画和背景模糊动画设置。'
      }
    ]
  },
  {
    version: 'v0.1.2',
    date: '2026年7月22日',
    isLatest: false,
    summary: '升级安全基础设施，包括 Windows DPAPI 历史记录加密、进程隔离、Electron 34 和预览面板拖放合并。',
    highlights: [
      {
        title: 'Windows DPAPI safeStorage 加密与 Electron 34',
        description: '使用 Windows 原生 DPAPI 加密本地剪贴板历史记录，并将核心运行时升级至 Electron v34.2.0。'
      },
      {
        title: '拖入预览面板合并项目',
        description: '可将剪贴板中的项目直接拖到已打开的预览面板中，快速堆叠和合并。'
      },
      {
        title: '单文件自适应全宽布局',
        description: '预览单个文件时，内容会动态扩展为全宽布局。'
      },
      {
        title: '统一图像文件渲染',
        description: '从文件资源管理器或桌面复制的图像文件会自动显示为带缩略图的图像卡片。'
      }
    ]
  },
  {
    version: 'v0.1.1',
    date: '2026年7月18日',
    isLatest: false,
    summary: '新增多显示器配置、左右屏幕边缘选择和后台内存优化。',
    highlights: [
      {
        title: '多显示器与位置支持',
        description: '可选择任意已连接显示器，并将面板固定在屏幕左侧或右侧。'
      },
      {
        title: '资源与内存优化',
        description: '重构图像处理后，空闲时的内存占用最多降低 60%。'
      },
      {
        title: '问题修复与界面优化',
        description: '修复主显示器默认高亮准确性和 Z-index 渲染问题。'
      }
    ]
  },
  {
    version: 'v0.1.0',
    date: '2026年7月10日',
    isLatest: false,
    summary: 'Edge-Drop 首个版本发布：一款常驻屏幕边缘、无需单击即可唤出的桌面剪贴板架。',
    highlights: [
      {
        title: '无单击激活与边缘悬停',
        description: '面板固定在屏幕边缘，停留 120 毫秒后通过物理弹簧动画展开。'
      },
      {
        title: '系统级 OLE 原生拖放',
        description: '可将项目直接拖入 Photoshop、Word、Slack 或文件资源管理器。'
      },
      {
        title: '灵活集合与 3D 堆叠',
        description: '一次复制多个文件时，会自动组合为可展开的 3D 卡片堆。'
      },
      {
        title: '可配置剪贴板引擎',
        description: '支持无痕模式、100 至 1000 条历史记录容量、自动删除计时器和纵向边缘触发区域。'
      }
    ]
  }
]

export function getLocalizedRelease(version: string): ChangelogRelease | undefined {
  const normalized = version.startsWith('v') ? version : `v${version}`
  return ZH_CN_CHANGELOG.find((release) => release.version === normalized)
}

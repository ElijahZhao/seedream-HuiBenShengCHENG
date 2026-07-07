<div align="center">

# 🎨 Seedream 绘本生成器

**AI 驱动的儿童绘本创作工具 — 桌面端 + 移动端混合应用**

<p>
  <a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases">
    <img src="https://img.shields.io/github/v/release/ElijahZhao/seedream-HuiBenShengCHENG?color=blue&style=flat-square" alt="Release">
  </a>
  <a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/ElijahZhao/seedream-HuiBenShengCHENG/build.yml?branch=main&style=flat-square" alt="Build">
  </a>
  <img src="https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p>
  <a href="#-功能特性">功能特性</a> •
  <a href="#-界面预览">界面预览</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-下载安装">下载安装</a> •
  <a href="#-技术栈">技术栈</a> •
  <a href="#-项目结构">项目结构</a>
</p>

</div>

---

## ✨ 功能特性

- 🤖 **AI 故事生成** — 基于火山方舟大模型，输入主题即可生成完整儿童故事
- 🖼️ **AI 插图绘制** — Seedream 模型为每个场景自动生成精美插画
- 🎨 **15 种艺术风格** — 水彩、油画、像素风、国潮、宫崎骏等多种风格一键切换
- 💾 **完全本地存储** — SQLite 本地数据库，所有绘本数据保存在设备端，隐私无忧
- 🖥️ **桌面端应用** — Windows / macOS 原生桌面程序（Tauri 构建）
- 📱 **移动端应用** — Android APK 独立安装包（Capacitor 构建）
- 📖 **绘本预览与导出** — 翻页式浏览已生成的绘本，支持导出分享
- 🔒 **本地账号系统** — bcryptjs 加密，无需联网注册

## 📸 界面预览

<div align="center">

| 创作页面 | 生成中 | 我的作品 |
|:---|:---|:---|
| 输入主题、选择风格、一键生成故事 | 实时进度展示，多图并行生成 | 本地画廊，随时翻阅已生成绘本 |

</div>

## 🚀 快速开始

### 前置条件

- 火山方舟 API Key（用于 AI 文字和图片生成）

> 💡 获取方式：[火山方舟控制台](https://console.volcengine.com/ark) → 开通管理 → API Key 管理
>
> 费用参考：文字生成每日 **50 万 tokens 免费**，图片生成约 **0.22 元/张**

### 首次使用流程

1. 下载对应平台的安装包并打开应用
2. 在设置页填入火山方舟 API Key（应用自动检测连通性）
3. 注册本地账号（数据完全离线存储，无需联网）
4. 点击「开始创作」，输入绘本主题
5. 选择喜欢的艺术风格，等待 AI 生成故事和插画
6. 在「我的作品」中随时查看和翻阅

## ⬇️ 下载安装

| 平台 | 格式 | 系统要求 |
|:---|:---|:---|
| Windows | `.exe` 安装包 | Windows 10 / 11 |
| macOS | `.dmg` 安装包 | macOS 10.15+（Intel / Apple Silicon） |
| Android | `.apk` 安装包 | Android 8.0（API 26）以上 |

> 📦 最新版本请在 [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) 页面下载

## 🛠️ 技术栈

| 层级 | 技术选型 |
|:---|:---|
| 前端框架 | Next.js 16 + React 19 + TypeScript 5 |
| UI 组件库 | shadcn/ui + Tailwind CSS v4 |
| 桌面端壳 | Tauri 2（Rust） |
| 移动端壳 | Capacitor 8 |
| 本地数据库 | SQLite（sql.js WASM） |
| 本地认证 | bcryptjs + localStorage |
| AI 接口 | 火山方舟 Ark API（OpenAI 兼容） |
| 包管理器 | pnpm 9+ |

## 📦 手动构建

```bash
# 1. 克隆仓库
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG

# 2. 安装依赖
pnpm install

# 3. 桌面端开发调试
pnpm tauri:dev

# 4. 桌面端打包
pnpm tauri:build

# 5. 移动端同步
pnpm cap:sync
```

详细构建指南请参考 [`BUILD_GUIDE.md`](./BUILD_GUIDE.md)。

## 🏗️ 项目结构

```
├── src/app/                    # Next.js App Router 页面
│   ├── create/                 # 故事创作页（输入主题、选择风格）
│   ├── generating/             # 图片生成页（并行生成、进度展示）
│   ├── my-works/               # 作品画廊（本地绘本列表）
│   ├── preview/[id]/           # 绘本预览（翻页阅读）
│   ├── setup/                  # 首次引导 / API Key 配置
│   ├── login/                  # 本地登录
│   └── register/               # 本地注册
├── src/lib/
│   ├── db.ts                   # SQLite 本地数据库（sql.js）
│   ├── volcengine.ts           # 火山方舟 API 封装（SSE 流式 + 图片生成）
│   ├── localAuth.ts            # 本地认证模块
│   └── styleConfig.ts          # 15 种艺术风格配置
├── src-tauri/                  # Tauri 桌面端配置（Rust）
├── .github/workflows/          # GitHub Actions 自动构建（Windows/macOS/Android）
├── capacitor.config.ts         # Capacitor 移动端配置
├── public/sql.js/              # sql.js WASM 文件（静态导出必需）
└── next.config.ts              # Next.js 静态导出配置
```

## ⚠️ 注意事项

- **数据本地存储**：所有绘本数据均存储在本地设备 SQLite 中，卸载应用或清除浏览器数据将导致丢失
- **API 费用**：图片生成按次计费，请确保火山方舟账户有足够余额
- **首次必配**：首次使用必须在设置页配置有效的火山方舟 API Key
- **网络依赖**：故事生成和图片生成需要联网调用火山方舟 API，绘本浏览可离线

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](LICENSE) © Seedream

---

<div align="center">

Made with ❤️ using <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a>

</div>

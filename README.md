<div align="center">

# 🎨 Seedream 绘本生成器

**AI 驱动的儿童绘本创作工具 | 桌面端 + 移动端混合应用**

<p>
  <img src="https://img.shields.io/badge/Release-v1.0.0-blue?style=flat-square" alt="Release">
  <img src="https://img.shields.io/badge/Platforms-Windows%20%7C%20macOS%20%7C%20Android-9cf?style=flat-square" alt="Platforms">
  <img src="https://img.shields.io/badge/AI-火山方舟%20%7C%20豆包-orange?style=flat-square" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p>
  <a href="#功能特性">功能特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#下载安装">下载安装</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#构建指南">构建指南</a>
</p>

</div>

---

## ✨ 功能特性

- 🤖 **AI 故事生成** — 基于火山方舟大模型，一句话生成完整儿童故事
- 🖼️ **AI 插图绘制** — Seedream 模型自动为每个场景生成精美插画
- 🎨 **15 种艺术风格** — 水彩、油画、像素风、国潮等多种风格一键切换
- 💾 **完全本地存储** — 所有绘本数据保存在本地，隐私无忧
- 🖥️ **桌面端应用** — Windows / macOS 原生桌面程序
- 📱 **移动端应用** — Android APK 独立安装包
- 📖 **绘本预览与导出** — 翻页式浏览，支持导出分享

## 📸 界面预览

<div align="center">

| 创作页面 | 生成中 | 我的作品 |
|---------|--------|---------|
| 输入主题、选择风格、一键生成 | 实时进度展示，多图并行生成 | 本地画廊，随时翻阅 |

</div>

## 🚀 快速开始

### 1. 获取 API Key

前往 [火山方舟控制台](https://console.volcengine.com/ark) 开通并获取 API Key。

> 💡 文字生成每日 **50 万 tokens 免费**，图片生成约 **0.22 元/张**

### 2. 下载安装

| 平台 | 下载 | 说明 |
|------|------|------|
| Windows | `.exe` 安装包 | 支持 Win10/11 |
| macOS | `.dmg` 安装包 | 支持 Intel / Apple Silicon |
| Android | `.apk` 安装包 | 支持 Android 8.0+ |

> 最新版本请在 [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) 页面下载

### 3. 开始使用

1. 打开应用，首次进入设置页填入火山方舟 API Key
2. 注册本地账号（数据完全离线存储）
3. 点击「开始创作」，输入绘本主题
4. 选择喜欢的艺术风格，等待 AI 生成
5. 在「我的作品」中随时查看和翻阅

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| UI 组件 | shadcn/ui + Tailwind CSS v4 |
| 桌面端壳 | Tauri 2 (Rust) |
| 移动端壳 | Capacitor 8 |
| 本地数据库 | SQLite (sql.js) |
| AI 接口 | 火山方舟 Ark API |
| 认证 | bcryptjs + localStorage |

## 📦 构建指南

详细构建步骤请参考 [`BUILD_GUIDE.md`](./BUILD_GUIDE.md)。

```bash
# 安装依赖
pnpm install

# 桌面端开发调试
pnpm tauri:dev

# 桌面端打包
pnpm tauri:build

# 移动端同步
pnpm cap:sync
```

## 🏗️ 项目结构

```
├── src/app/              # Next.js 页面路由
│   ├── create/           # 故事创作页
│   ├── generating/       # 图片生成页
│   ├── my-works/         # 作品画廊
│   ├── preview/          # 绘本预览
│   └── setup/            # 首次引导/API Key 设置
├── src/lib/
│   ├── db.ts             # SQLite 本地数据库
│   ├── volcengine.ts     # 火山方舟 API 封装
│   └── localAuth.ts      # 本地认证模块
├── src-tauri/            # Tauri 桌面端配置
├── .github/workflows/    # GitHub Actions 自动构建
└── capacitor.config.ts   # Capacitor 移动端配置
```

## ⚠️ 注意事项

- 所有数据均存储在本地设备，卸载应用将丢失数据
- 图片生成依赖火山方舟 API，请确保账户有足够余额
- 首次使用必须配置有效的 API Key

## 📄 许可证

[MIT](LICENSE)

---

<div align="center">

Made with ❤️ by Seedream

</div>

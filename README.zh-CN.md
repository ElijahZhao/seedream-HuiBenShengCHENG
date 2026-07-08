<div align="center">

# 🎨 Seedream 绘本生成器

**AI 驱动的儿童绘本创作工具 — 输入主题，一键生成精美绘本**

<a href="https://seedream-huibenshengcheng.onrender.com">
  <img src="https://img.shields.io/badge/🚀_在线体验-Seedream绘本-purple?style=for-the-badge" alt="Try Online">
</a>
<a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases">
  <img src="https://img.shields.io/github/v/release/ElijahZhao/seedream-HuiBenShengCHENG?color=blue&style=flat-square" alt="Release">
</a>
<a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/actions">
  <img src="https://img.shields.io/github/actions/workflow/status/ElijahZhao/seedream-HuiBenShengCHENG/build.yml?branch=main&style=flat-square" alt="Build">
</a>
<img src="https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
<img src="https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
<img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android">
<img src="https://img.shields.io/badge/Web-6366F1?style=flat-square&logo=browser&logoColor=white" alt="Web">

<p>
  <b>中文</b> | <a href="README.md">English</a>
</p>

<p>
  <a href="#-功能特性">功能特性</a> •
  <a href="#-在线体验">在线体验</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-下载安装">下载安装</a> •
  <a href="#%EF%B8%8F-技术栈">技术栈</a>
</p>

</div>

---

## ✨ 功能特性

- **🤖 AI 故事生成** — 输入成语典故（如"程门立雪"）或任意主题，AI 自动识别并生成对应故事
- **🖼️ AI 插图绘制** — Seedream 模型为每个场景自动生成精美插画，支持并行生成
- **🎨 15 种艺术风格** — 水彩、油画、动漫、素描、剪纸、浮世绘等多种风格一键切换
- **📖 翻页式预览** — 仿实体书翻页效果浏览绘本，沉浸式阅读体验
- **📄 PDF 导出** — 一键导出完整绘本 PDF，可打印或分享
- **💾 本地作品库** — 所有绘本保存在本地数据库，随时查看管理
- **🔒 本地账号系统** — 注册登录，保护个人作品隐私
- **🌐 多端部署** — Web 在线版 + Windows/macOS 桌面端 + Android 移动端

---

## 🌐 在线体验

> **无需下载，无需配置 API Key，打开即用！**

🔗 **[点击这里立即体验 Seedream 绘本生成器](https://seedream-huibenshengcheng.onrender.com)**

<div align="center">

| 创建故事 | 选择角色 | 分镜确认 | 预览绘本 |
|:---:|:---:|:---:|:---:|
| 输入主题，AI 自动生成完整故事 | 确认角色设定 | 审核分镜布局 | 翻页浏览，导出 PDF |

</div>

---

## 🚀 快速开始

### 在线版（推荐）

直接访问 [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com)，无需任何配置，打开即用。

### 桌面端 / 移动端

1. 下载对应平台的安装包（见下方）
2. 打开应用，注册本地账号
3. 点击「开始创作」，输入绘本主题
4. 选择喜欢的艺术风格，等待 AI 生成
5. 在「我的作品」中查看和导出绘本

---

## ⬇️ 下载安装

| 平台 | 格式 | 下载链接 |
|:---|:---|:---|
| 🌐 Web | 在线版 | [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) |
| 🖥️ Windows | `.exe` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 🍎 macOS | `.dmg` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 📱 Android | `.apk` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

---

## 🛠️ 技术栈

| 层级 | 技术选型 |
|:---|:---|
| 前端框架 | Next.js 16 + React 19 + TypeScript 5 |
| UI 组件库 | shadcn/ui + Tailwind CSS v4 |
| 桌面端 | Tauri 2（Rust） |
| 移动端 | Capacitor 8 |
| 本地数据库 | SQLite（sql.js WASM） |
| 本地认证 | Web Crypto SHA-256 |
| AI 接口 | 火山方舟 Ark API（doubao-seed 系列模型） |
| Web 部署 | Render Static Site |

---

## 📦 手动构建

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm build
```

---

## 📄 许可证

[MIT](LICENSE) © Seedream

---

<div align="center">
Made with ❤️ using <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a>
<br/>
🚀 Deployed on <a href="https://render.com">Render</a>
</div>

<div align="center">

# 🎨 Seedream 绘本生成器 — AI 儿童绘本创作平台

**AI 驱动的智能绘本创作工具 — 输入主题，一键生成精美插图绘本**

<a href="https://seedream-huibenshengcheng.onrender.com">
  <img src="https://img.shields.io/badge/🚀_在线体验-Seedream绘本-purple?style=for-the-badge" alt="在线体验">
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
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">

<p>
  <b>中文</b> | <a href="README.md">English</a>
</p>

<p>
  <a href="#-功能特性">功能特性</a> •
  <a href="#-在线体验">在线体验</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目架构">项目架构</a> •
  <a href="#%EF%B8%8F-技术栈">技术栈</a> •
  <a href="#-下载安装">下载安装</a>
</p>

</div>

---

## ✨ 功能特性

### 🧠 AI 智能创作
- **智能故事生成** — 输入成语典故（如"程门立雪"）、童话主题或任意创意，AI 自动识别语境并生成完整的适龄故事，包含角色和场景设计
- **典故识别与保护** — 自动区分典故改编与自由创作，改编时保留原始人物、情节和结局，忠实于原著
- **丰富的场景描述** — 每个场景画面描述 80 字以上，包含丰富的视觉细节，专为 AI 插画生成优化

### 🎨 插画与风格
- **15 种艺术风格** — 水彩、动漫、黏土、素描、粉彩、波普、浮世绘、油画、拼贴、彩铅、剪纸、岩彩、矢量、复古、扁平
- **并行图片生成** — 最多 5 张图片同时生成，大幅提升创作速度
- **可交互风格展示** — 预览和对比不同艺术风格，点击查看详情

### 📖 阅读与分享
- **翻页式预览** — 仿实体书翻页效果，左右页面导航，沉浸式阅读体验
- **PDF 导出** — 一键导出精美观版 PDF（jsPDF 原生渲染，无图片质量损失，文件体积小）
- **完整排版** — 封面 + 内容页 + 封底，专业绘本排版布局

### ☁️ 云端认证与存储（Supabase 驱动）
- **跨设备同步** — 注册一次，在任何设备或浏览器上访问自己的作品
- **云数据库** — 所有绘本存储在 PostgreSQL 数据库中，启用行级安全策略（RLS）
- **安全认证** — 基于 Supabase Auth 的邮箱密码认证
- **隐私优先** — 每个用户只能访问自己的数据

### ✏️ 编辑与定制
- **可编辑分镜** — AI 生成后可修改场景描述和旁白文字
- **表单自动保存** — 创作表单自动保存到 localStorage，永不丢失进度
- **智能表单清理** — 开始新创作时自动清除旧表单数据

### 🌐 多端支持
- **Web** — 部署为静态站点，无需服务器
- **桌面端** — Windows / macOS 原生应用（Tauri 2 + Rust）
- **移动端** — Android 应用（Capacitor 8）

---

## 🌐 在线体验

> **无需下载，无需配置 API Key，打开即用！**

🔗 **[点击这里立即体验 Seedream 绘本生成器](https://seedream-huibenshengcheng.onrender.com)**

**创作流程：**
1. **构思** — 输入故事主题或成语典故，AI 自动生成完整故事
2. **定制** — 审核角色设定，编辑分镜场景
3. **生成** — AI 为每个场景生成所选艺术风格的精美插画
4. **预览** — 翻页浏览完成的绘本
5. **导出** — 下载 PDF 或保存到云端作品库

---

## 🚀 快速开始

### 在线版（推荐）

直接访问 [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com)，注册账号即可开始创作。

### 桌面端 / 移动端

1. 从 [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) 下载对应平台的安装包
2. 打开应用，注册账号
3. 点击「开始创作」，输入绘本主题
4. 选择喜欢的艺术风格，等待 AI 生成
5. 在「我的作品」中查看和导出绘本

---

## 🏗️ 项目架构

```
seedream-HuiBenShengCHENG/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx            # 首页（Hero、功能介绍、风格展示）
│   │   ├── create/             # 故事创作表单（主题、年龄、风格、页数）
│   │   ├── characters/         # 角色设计审核
│   │   ├── storyboard/         # 分镜编辑（可编辑场景描述和旁白）
│   │   ├── generating/         # AI 图片生成（并行，最多 5 张）
│   │   ├── preview/            # 绘本预览 + PDF 导出
│   │   ├── my-works/           # 用户云端作品库
│   │   ├── login/              # Supabase 邮箱登录
│   │   ├── register/           # Supabase 邮箱注册
│   │   ├── setup/              # API Key 配置
│   │   └── diagnostics/        # 系统健康检查
│   ├── components/             # 可复用 UI 组件
│   │   ├── ui/                 # shadcn/ui 组件库
│   │   ├── navigation.tsx      # 顶部导航栏（感知登录状态）
│   │   ├── StyleShowcase.tsx   # 可交互风格展示卡片
│   │   ├── Footer.tsx          # 页脚
│   │   └── AnimatedBackground.tsx
│   └── lib/                    # 核心库
│       ├── supabaseClient.ts   # Supabase 客户端配置
│       ├── localAuth.ts        # 认证模块（Supabase Auth + localStorage）
│       ├── db.ts               # 数据库模块（Supabase PostgreSQL）
│       ├── volcengine.ts       # 火山方舟 API（文本 + 图片生成）
│       ├── styleConfig.ts      # 艺术风格定义
│       ├── diagnostics.ts      # 诊断检查
│       └── utils/              # 语言检测、PDF 文本辅助
├── public/                     # 静态资源（图标、图片）
├── tailwind.config.ts          # Tailwind CSS v4 配置
├── next.config.ts              # Next.js 配置（静态导出）
└── .github/workflows/          # CI/CD（Windows、macOS、Android 构建）
```

---

## 🛠️ 技术栈

| 层级 | 技术选型 |
|:---|:---|
| 前端框架 | Next.js 16 + React 19 + TypeScript 5 |
| UI 组件库 | shadcn/ui + Tailwind CSS v4 |
| 云数据库 | Supabase PostgreSQL（启用 RLS） |
| 云认证 | Supabase Auth（邮箱密码） |
| 桌面引擎 | Tauri 2（Rust） |
| 移动框架 | Capacitor 8 |
| 本地存储 | IndexedDB + localStorage（离线回退） |
| PDF 生成 | jsPDF（原生 API，无 html2canvas） |
| AI 文本模型 | 火山方舟 — doubao-seed-2-0-mini |
| AI 图片模型 | 火山方舟 — doubao-seedream-5-0 |
| Web 部署 | Render Static Site |
| CI/CD | GitHub Actions |

---

## ⬇️ 下载安装

| 平台 | 格式 | 下载链接 |
|:---|:---|:---|
| 🌐 Web | 在线版 | [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) |
| 🖥️ Windows | `.exe` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 🍎 macOS | `.dmg` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 📱 Android | `.apk` 安装包 | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

---

## 📦 手动构建

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm build
```

### 环境变量（可选）

| 变量 | 说明 | 默认值 |
|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 已内置 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 已内置 |

> 应用已预配置 API Key 和 Supabase 凭证，开箱即用。环境变量仅在需要使用自建 Supabase 实例时配置。

---

## 🤝 参与贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

---

## 📄 许可证

[MIT](LICENSE) © Seedream

---

<div align="center">
由 <a href="https://github.com/ElijahZhao">Elijah Lin</a> 用 ❤️ 制作<br/>
基于 <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a> + <a href="https://supabase.com">Supabase</a> 构建<br/>
🚀 部署于 <a href="https://render.com">Render</a> • 🤖 AI 驱动 <a href="https://www.volcengine.com/product/doubao">字节跳动豆包 Seed</a>
</div>

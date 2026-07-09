<div align="center">

<img src="public/icon.png" alt="Seedream Logo" width="80" height="80" />

# Seedream 绘本 — AI 儿童绘本创作平台

**输入一个主题，AI 生成完整故事 + 15 种风格插画 + 翻页式预览 + PDF 导出**

[![在线体验](https://img.shields.io/badge/🚀_在线体验-Seedream绘本-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIgMTJoMjAiPjwvcGF0aD48cGF0aCBkPSJNMiAxMmwxMCA5bDEwLTkiPjwvcGF0aD48L3N2Zz4=)](https://generate-huiben.onrender.com)
[![构建状态](https://img.shields.io/github/actions/workflow/status/ElijahZhao/seedream-HuiBenShengCHENG/build.yml?branch=main&style=flat-square&logo=github&label=CI/CD)](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/actions)
[![MIT 许可证](https://img.shields.io/badge/许可证-MIT-3ECF8E?style=flat-square)](LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

<p>
  <a href="README.md">English</a> | <b>中文</b>
</p>

</div>

<img src="docs/screenshot-home.png" alt="Seedream 首页截图" width="100%" />

<br/>

## 为什么选择 Seedream？

大多数 AI 只能生成单张图片。Seedream 创作的是**完整的绘本**——连贯的故事线、一致的角色、逐场景分镜、专业排版。输入一个主题，输出一本成品书。

## 创作流程

```
💡 输入主题  →  📝 AI 生成故事  →  🎭 角色设计  →  🎬 分镜编辑  →  🎨 插画生成  →  📖 预览导出
```

| 步骤 | 操作 | 耗时 |
|:---:|---|---|
| **1. 构思** | 输入主题或成语典故，AI 生成完整故事、角色和场景 | ~5秒 |
| **2. 角色** | 审核 AI 设计的角色设定（姓名、外貌、性格） | 即时 |
| **3. 分镜** | 编辑 AI 生成的场景描述、旁白和景别 | 按需 |
| **4. 生成** | AI 为每个场景生成所选风格的插画（最多 5 张并行） | ~2-3分钟 |
| **5. 导出** | 翻页浏览绘本，导出 PDF 或保存到云端 | 即时 |

## 核心功能

### AI 故事引擎
- **成语典故识别** — 输入"程门立雪"等典故，AI 自动保留原著人物、情节和寓意
- **适龄内容** — 故事自动适配目标年龄段（3-5、6-8、9-12 岁）
- **精细场景描述** — 每个场景 80 字以上视觉描述，专为 AI 插画生成优化

### 15 种艺术风格

| 风格 | 风格 | 风格 |
|:---:|:---:|:---:|
| 🎨 水彩画 | 🌸 浮世绘 | ✏️ 铅笔素描 |
| 🌸 日本动漫 | 🖼️ 油画 | 🖍️ 彩铅 |
| 🏺 黏土动画 | ✂️ 剪纸 | 🪨 岩彩 |
| 🎨 粉彩画 | 🔷 矢量 | 📺 复古 |
| 💥 波普艺术 | 🧩 拼贴 | 📐 扁平设计 |

### 技术亮点
- **并行生成** — 最多 5 张图片同时生成，大幅提速
- **PDF 导出** — jsPDF 原生渲染（非 html2canvas），文件体积小、质量高
- **云端同步** — Supabase PostgreSQL + 行级安全策略（RLS）
- **离线回退** — IndexedDB + localStorage，无网络也能保存
- **灵动动画** — 纯 CSS 呼吸脉冲、弹跳入场、漂浮等儿童友好动画
- **多端支持** — Web / Windows / macOS / Android

## 快速开始

### 在线体验（推荐）

> 无需下载，无需配置 API Key，打开即用。

**[立即创作你的第一本绘本 →](https://generate-huiben.onrender.com)**

### 本地开发

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm dev
```

### 环境变量（可选）

应用已预配置凭证，开箱即用。仅在使用自建后端时需要配置：

| 变量 | 说明 |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase 匿名密钥 |

## 技术栈

| 层级 | 技术选型 |
|:---|:---|
| 框架 | Next.js 16 + React 19 + TypeScript 5 |
| UI | shadcn/ui + Tailwind CSS v4 + tw-animate-css |
| 数据库 | Supabase PostgreSQL（RLS） |
| 认证 | Supabase Auth（邮箱密码） |
| AI 文本 | 火山方舟 — doubao-seed-2-0-mini |
| AI 图片 | 火山方舟 — doubao-seedream-5-0 |
| PDF | jsPDF（原生渲染） |
| 桌面端 | Tauri 2（Rust） |
| 移动端 | Capacitor 8 |
| 部署 | Render • CI/CD GitHub Actions |

## 项目结构

```
src/
├── app/                  # Next.js App Router 页面
│   ├── page.tsx          # 首页
│   ├── create/           # 故事创作表单
│   ├── characters/       # 角色审核
│   ├── storyboard/       # 分镜编辑
│   ├── generating/       # 并行图片生成
│   ├── preview/          # 绘本预览 + PDF 导出
│   ├── my-works/         # 云端作品库
│   ├── login/  register/ # 认证页面
│   └── api/              # 后端 API 路由
├── components/           # 可复用 UI 组件
└── lib/                  # 核心逻辑
    ├── supabaseClient.ts # Supabase 配置
    ├── volcengine.ts     # 火山方舟 API
    ├── db.ts             # 数据库层
    ├── localAuth.ts      # 认证模块
    └── styleConfig.ts    # 15 种艺术风格定义
```

## 下载

| 平台 | 链接 |
|:---|:---|
| 🌐 Web | [generate-huiben.onrender.com](https://generate-huiben.onrender.com) |
| 🖥️ Windows / 🍎 macOS / 📱 Android | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

## 参与贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交 (`git commit -m 'Add amazing feature'`)
4. 推送 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

## 许可证

[MIT](LICENSE) © 2026 Seedream

---

<div align="center">
基于 <a href="https://nextjs.org">Next.js</a> + <a href="https://supabase.com">Supabase</a> + <a href="https://www.volcengine.com/product/doubao">字节跳动豆包 Seed</a> 构建<br/>
由 <a href="https://github.com/ElijahZhao">Elijah Lin</a> 用 ❤️ 制作
</div>
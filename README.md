<div align="center">

<img src="public/icon.png" alt="Seedream Logo" width="80" height="80" />

# Seedream — AI 儿童绘本创作平台

**输入一个主题，AI 生成完整故事 + 15 种风格插画 + 翻页式预览 + PDF 导出**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Generate_Huiben-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIgMTJoMjAiPjwvcGF0aD48cGF0aCBkPSJNMiAxMmwxMCA5bDEwLTkiPjwvcGF0aD48L3N2Zz4=)](https://generate-huiben.onrender.com)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ElijahZhao/seedream-HuiBenShengCHENG/build.yml?branch=main&style=flat-square&logo=github&label=CI/CD)](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/actions)
[![MIT License](https://img.shields.io/badge/License-MIT-3ECF8E?style=flat-square)](LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

<p>
  <b>English</b> | <a href="README.zh-CN.md">中文</a>
</p>

</div>

<img src="docs/screenshot-home.png" alt="Seedream Homepage" width="100%" />

<br/>

## Why Seedream?

Most AI image generators produce single images. Seedream creates **complete picture books** — with coherent storylines, consistent characters, scene-by-scene storyboards, and professional layouts. One theme in, a finished book out.

## Creation Workflow

```
💡 Theme Input  →  📝 AI Story  →  🎭 Characters  →  🎬 Storyboard  →  🎨 Illustrations  →  📖 Preview & Export
```

| Step | What Happens | Time |
|:---:|---|---|
| **1. Create** | Enter a theme or Chinese idiom — AI generates a full story with characters and scenes | ~5s |
| **2. Characters** | Review AI-designed character profiles (name, appearance, personality) | Instant |
| **3. Storyboard** | Edit AI-generated scene descriptions, narration, and shot types | As needed |
| **4. Generate** | AI illustrates each scene in your chosen art style (up to 5 in parallel) | ~2-3 min |
| **5. Preview** | Flip through your book page-by-page, then export to PDF or save to cloud | Instant |

## Key Features

### AI Story Engine
- **Chinese Idiom Recognition** — Input idioms like "程门立雪" and AI preserves the original tale's characters, plot, and moral
- **Age-Appropriate Content** — Stories adapt to target age group (3-5, 6-8, 9-12)
- **Rich Scene Descriptions** — 80+ word visual prompts per scene, optimized for illustration generation

### 15 Art Styles

| Style | Style | Style |
|:---:|:---:|:---:|
| 🎨 Watercolor | 🌸 Ukiyo-e | ✏️ Pencil Sketch |
| 🌸 Anime | 🖼️ Oil Painting | 🖍️ Colored Pencil |
| 🏺 Clay 3D | ✂️ Paper Cut | 🪨 Mineral Pigment |
| 🎨 Pastel | 🔷 Vector | 📺 Retro |
| 💥 Pop Art | 🧩 Collage | 📐 Flat Design |

### Technical Highlights
- **Parallel Generation** — Up to 5 images generated simultaneously
- **PDF Export** — Native jsPDF rendering (no html2canvas), compact file size
- **Cloud Sync** — Supabase PostgreSQL with Row-Level Security
- **Offline Fallback** — IndexedDB + localStorage when cloud is unavailable
- **Playful Animations** — CSS-only breathing, bounce, and float animations for child-friendly UX
- **Multi-Platform** — Web, Windows, macOS, Android

## Quick Start

### Try Online (Recommended)

> No download, no API key setup — just open and create.

**[Generate your first picture book now →](https://generate-huiben.onrender.com)**

### Local Development

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm dev
```

### Environment Variables (Optional)

The app works out of the box with built-in credentials. Override only if you want your own backend:

| Variable | Description |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | Next.js 16 + React 19 + TypeScript 5 |
| UI | shadcn/ui + Tailwind CSS v4 + tw-animate-css |
| Database | Supabase PostgreSQL (RLS) |
| Auth | Supabase Auth (email/password) |
| AI Text | ByteDance Ark — doubao-seed-2-0-mini |
| AI Image | ByteDance Ark — doubao-seedream-5-0 |
| PDF | jsPDF (native rendering) |
| Desktop | Tauri 2 (Rust) |
| Mobile | Capacitor 8 |
| Hosting | Render • CI/CD via GitHub Actions |

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing page
│   ├── create/           # Story creation form
│   ├── characters/       # Character review
│   ├── storyboard/       # Editable storyboard
│   ├── generating/       # Parallel image generation
│   ├── preview/          # Book reader + PDF export
│   ├── my-works/         # Cloud library
│   ├── login/  register/ # Auth pages
│   └── api/              # Backend API routes
├── components/           # Reusable UI (shadcn/ui + custom)
└── lib/                  # Core logic
    ├── supabaseClient.ts # Supabase config
    ├── volcengine.ts     # ByteDance Ark API
    ├── db.ts             # Database layer
    ├── localAuth.ts      # Auth module
    └── styleConfig.ts    # 15 art style definitions
```

## Download

| Platform | Link |
|:---|:---|
| 🌐 Web | [generate-huiben.onrender.com](https://generate-huiben.onrender.com) |
| 🖥️ Windows / 🍎 macOS / 📱 Android | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE) © 2026 Seedream

---

<div align="center">
Built with <a href="https://nextjs.org">Next.js</a> + <a href="https://supabase.com">Supabase</a> + <a href="https://www.volcengine.com/product/doubao">ByteDance Doubao Seed</a><br/>
Made with ❤️ by <a href="https://github.com/ElijahZhao">Elijah Lin</a>
</div>
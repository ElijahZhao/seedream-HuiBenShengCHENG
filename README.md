<div align="center">

# 🎨 Seedream — AI Children's Picture Book Generator

**AI-powered children's picture book creation tool — desktop + mobile hybrid app**

<p>
  <a href="README.zh-CN.md">中文</a> | <b>English</b>
</p>

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
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-download--install">Download</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#%EF%B8%8F-project-structure">Structure</a>
</p>

</div>

---

## ✨ Features

- **🤖 AI Story Generation** — Powered by the ByteDance Ark LLM API. Enter a theme and get a complete children's story with multiple chapters.
- **🖼️ AI Illustration** — Seedream image model generates beautiful scene illustrations in parallel.
- **🎨 15 Art Styles** — One-click switching between watercolor, oil painting, pixel art, Chinese ink, Ghibli, and more.
- **💾 Fully Local Storage** — All picture books are saved in an on-device SQLite database. No cloud dependency for data.
- **🖥️ Desktop Apps** — Native Windows / macOS installers built with Tauri 2 (Rust).
- **📱 Mobile App** — Signed Android APK built with Capacitor 8.
- **📖 Flip-through Preview** — Browse generated picture books in a paginated reader.
- **🔒 Local Account System** — bcryptjs-encrypted auth, no internet registration required.

## 📸 Screenshots

<div align="center">

| Creation Page | Generating | My Works |
|:---|:---|:---|
| Enter a theme, pick a style, and generate | Real-time progress with parallel image generation | Local gallery of all generated books |

</div>

## 🚀 Quick Start

### Prerequisites

- **ByteDance Ark Platform API Key** (for text and image generation)
  - Get one at [Ark Console](https://console.volcengine.com/ark) → Management → API Key Management
  - Text generation: ~500K free tokens per day
  - Image generation: ~¥0.22 per image

### First-time Setup

1. Download and install the app for your platform from the [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) page.
2. Open the app and enter your Ark API Key in the Settings page (connectivity is auto-checked).
3. Register a local account (data stays fully offline).
4. Tap **Start Creating**, enter a picture book theme.
5. Pick your favorite art style and wait for AI generation.
6. View your creations anytime in **My Works**.

## ⬇️ Download & Install

| Platform | Format | System Requirements |
|:---|:---|:---|
| Windows | `.exe` installer | Windows 10 / 11 |
| macOS | `.dmg` installer | macOS 10.15+ (Intel / Apple Silicon) |
| Android | `.apk` | Android 8.0+ (API 26) |

> 📦 Download the latest release from the [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) page.

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend Framework | Next.js 16 + React 19 + TypeScript 5 |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Desktop Shell | Tauri 2 (Rust) |
| Mobile Shell | Capacitor 8 |
| Local Database | SQLite (sql.js WASM) |
| Local Auth | bcryptjs + localStorage |
| AI API | ByteDance Ark API (OpenAI-compatible) |
| Package Manager | pnpm 9+ |

## 📦 Manual Build

```bash
# 1. Clone the repository
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG

# 2. Install dependencies
pnpm install

# 3. Desktop dev mode
pnpm tauri:dev

# 4. Desktop build
pnpm tauri:build

# 5. Mobile sync
pnpm cap:sync
```

For detailed build instructions, see [`BUILD_GUIDE.md`](./BUILD_GUIDE.md).

## 🏗️ Project Structure

```
├── src/app/                    # Next.js App Router pages
│   ├── create/                 # Story creation (theme input, style picker)
│   ├── generating/             # Image generation (parallel gen, progress UI)
│   ├── my-works/               # Works gallery (local picture book list)
│   ├── preview/[id]/           # Picture book preview (flip-through reader)
│   ├── setup/                  # First-time setup / API Key config
│   ├── login/                  # Local login
│   └── register/               # Local registration
├── src/lib/
│   ├── db.ts                   # SQLite local database (sql.js)
│   ├── volcengine.ts           # ByteDance Ark API wrapper (SSE streaming + image gen)
│   ├── localAuth.ts            # Local authentication module
│   └── styleConfig.ts          # 15 art style configurations
├── src-tauri/                  # Tauri desktop config (Rust)
├── .github/workflows/          # GitHub Actions CI (Windows / macOS / Android)
├── capacitor.config.ts         # Capacitor mobile config
├── public/sql.js/              # sql.js WASM files (required for static export)
└── next.config.ts              # Next.js static export config
```

## ⚠️ Notes

- **Local data only**: All picture books are stored in local device SQLite. Uninstalling the app or clearing browser data will erase them.
- **API costs**: Image generation is billed per request. Make sure your Ark account has sufficient balance.
- **First-time setup required**: You must configure a valid Ark API Key in Settings before first use.
- **Network dependency**: Story generation and image generation require internet to call the Ark API. Browsing saved books works offline.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

[MIT](LICENSE) © Seedream

---

<div align="center">
Made with ❤️ using <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a>
</div>

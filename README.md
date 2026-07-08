<div align="center">

# 🎨 Seedream — AI Children's Picture Book Generator

**AI-powered picture book creator — enter a theme, generate a beautiful picture book in minutes**

<a href="https://seedream-huibenshengcheng.onrender.com">
  <img src="https://img.shields.io/badge/🚀_Try_Online-Seedream-purple?style=for-the-badge" alt="Try Online">
</a>
<a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases">
  <img src="https://img.shields.io/github/v/release/ElijahZhao/seedream-HuiBenShengCHENG?label=Release&include_prereleases" alt="Release">
</a>
<a href="https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/actions">
  <img src="https://img.shields.io/github/actions/workflow/status/ElijahZhao/seedream-HuiBenShengCHENG/build.yml?branch=main&style=flat-square" alt="Build">
</a>
<img src="https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
<img src="https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
<img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android">
<img src="https://img.shields.io/badge/Web-6366F1?style=flat-square&logo=browser&logoColor=white" alt="Web">
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">

<p>
  <a href="README.zh-CN.md">中文</a> | <b>English</b>
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-try-online">Try Online</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-download--install">Download</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a>
</p>

</div>

---

## ✨ Features

- **🤖 AI Story Generation** — Enter a Chinese idiom (e.g. "Cheng Men Li Xue") or any theme, AI identifies and generates the matching story
- **🖼️ AI Illustration** — Seedream model generates beautiful scene illustrations with parallel processing
- **🎨 15 Art Styles** — Watercolor, oil painting, anime, sketch, paper cut, ukiyo-e, and more
- **📖 Flip-through Preview** — Paginated reader with realistic page-turning experience
- **📄 PDF Export** — One-click export to complete PDF, ready to print or share
- **💾 Local Library** — All picture books saved in local database, browse anytime
- **🔒 Local Account System** — Register and login to protect your creations
- **🌐 Multi-Platform** — Web + Windows/macOS desktop + Android mobile

---

## 🌐 Try Online

> **No download, no API key setup — just open and create!**

🔗 **[Try Seedream Picture Book Generator now](https://seedream-huibenshengcheng.onrender.com)**

<div align="center">

| Create Story | Character Design | Storyboard | Preview |
|:---:|:---:|:---:|:---:|
| Enter a theme, AI generates the full story | Confirm character designs | Review scene layouts | Flip-through reader, export PDF |

</div>

---

## 🚀 Quick Start

### Web (Recommended)

Visit [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) — no setup required.

### Desktop / Mobile

1. Download the installer for your platform (see below)
2. Open the app and register a local account
3. Tap "Start Creating", enter a picture book theme
4. Pick your favorite art style and wait for AI generation
5. View and export your creations in "My Works"

---

## ⬇️ Download & Install

| Platform | Format | Download |
|:---|:---|:---|
| 🌐 Web | Online | [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) |
| 🖥️ Windows | `.exe` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 🍎 macOS | `.dmg` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 📱 Android | `.apk` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | Next.js 16 + React 19 + TypeScript 5 |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Desktop | Tauri 2 (Rust) |
| Mobile | Capacitor 8 |
| Local Database | SQLite (sql.js WASM) |
| Local Auth | Web Crypto SHA-256 |
| AI API | ByteDance Ark API (doubao-seed series) |
| Web Hosting | Render Static Site |

---

## 📦 Manual Build

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm build
```

---

## 📄 License

[MIT](LICENSE) © Seedream

---

<div align="center">
Made with ❤️ using <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a>
<br/>
🚀 Deployed on <a href="https://render.com">Render</a>
</div>

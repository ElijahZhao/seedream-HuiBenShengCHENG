<div align="center">

# 🎨 Seedream — AI Children's Picture Book Generator

**AI-powered picture book creator for kids — enter a theme, generate a beautiful illustrated picture book in minutes**

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
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">

<p>
  <a href="README.zh-CN.md">中文</a> | <b>English</b>
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-try-online">Try Online</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-download--install">Download</a>
</p>

</div>

---

## ✨ Features

### 🧠 AI-Powered Creation
- **Smart Story Generation** — Enter a Chinese idiom (e.g. "Cheng Men Li Xue"), a fairy tale theme, or any idea — AI identifies the context and generates a complete, age-appropriate story with characters and scenes
- **Chinese Idiom Recognition** — Automatically distinguishes between classical allusions (典故) and free-form themes, preserving original characters, plot, and ending when adapting well-known stories
- **Rich Scene Descriptions** — Each scene description is 80+ words with detailed visual details, optimized for AI illustration generation

### 🎨 Illustration & Style
- **15 Art Styles** — Watercolor, anime, clay, sketch, pastel, pop art, ukiyo-e, oil painting, collage, colored pencil, paper cut, mineral pigment, vector, vintage, and flat design
- **Parallel Image Generation** — Up to 5 images generated simultaneously for faster creation
- **Interactive Style Showcase** — Preview and compare art styles before creating

### 📖 Reading & Sharing
- **Flip-through Preview** — Realistic paginated book reader with left/right page navigation
- **PDF Export** — One-click export to a compact, high-quality PDF (jsPDF native rendering, no image quality loss, small file size)
- **Cover & Back Cover** — Professional PDF layout with title page, scene pages, and closing page

### 🔒 Cloud Auth & Storage (Powered by Supabase)
- **Cross-Device Sync** — Register once, access your works from any device or browser
- **Cloud Database** — All picture books stored in PostgreSQL with Row-Level Security (RLS)
- **Secure Auth** — Email/password authentication via Supabase Auth
- **Privacy First** — Each user can only access their own data

### ✏️ Editing & Customization
- **Editable Storyboard** — Modify scene descriptions and narration text after AI generation
- **Form Auto-Save** — Creation form automatically saves to localStorage, never lose progress
- **Smart Form Clearing** — Old form data automatically cleared when starting a new creation

### 🌐 Multi-Platform
- **Web** — Deploy as a static site, no server needed
- **Desktop** — Windows & macOS native apps via Tauri 2 (Rust)
- **Mobile** — Android app via Capacitor 8

---

## 📸 Screenshots

<div align="center">

| Homepage | Story Creation | Style Selection |
|:---:|:---:|:---:|
| Hero landing with CTA buttons | Enter theme, set age group & pages | 15 interactive art style cards |
| Storyboard Editing | Preview & Read | PDF Export |
| Editable scene descriptions | Flip-through book reader | One-click PDF download |

</div>

---

## 🌐 Try Online

> **No download, no API key setup — just open and create!**

🔗 **[Try Seedream Picture Book Generator now](https://seedream-huibenshengcheng.onrender.com)**

**How it works:**
1. **Create** — Enter a story theme or Chinese idiom, AI generates the full story
2. **Customize** — Review characters, edit storyboard scenes if needed
3. **Generate** — AI creates illustrations for each scene in your chosen art style
4. **Preview** — Flip through your completed picture book
5. **Export** — Download as PDF or save to your cloud library

---

## 🚀 Quick Start

### Web (Recommended)

Visit [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) — register an account and start creating immediately.

### Desktop / Mobile

1. Download the installer for your platform from [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases)
2. Open the app and create an account
3. Tap "Start Creating", enter a picture book theme
4. Pick your favorite art style and wait for AI generation
5. View and export your creations in "My Works"

---

## 🏗️ Architecture

```
seedream-HuiBenShengCHENG/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage (hero, features, style showcase)
│   │   ├── create/             # Story creation form (theme, age, style, pages)
│   │   ├── characters/         # Character design review
│   │   ├── storyboard/         # Scene storyboard (editable)
│   │   ├── generating/         # AI image generation (parallel, max 5)
│   │   ├── preview/            # Book reader + PDF export
│   │   ├── my-works/           # User's saved picture books
│   │   ├── login/              # Supabase email login
│   │   ├── register/           # Supabase email registration
│   │   ├── setup/              # API key configuration
│   │   └── diagnostics/        # System health checker
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── navigation.tsx      # Top nav bar (auth state aware)
│   │   ├── StyleShowcase.tsx   # Interactive art style cards
│   │   ├── Footer.tsx          # Page footer
│   │   └── AnimatedBackground.tsx
│   └── lib/                    # Core libraries
│       ├── supabaseClient.ts   # Supabase client configuration
│       ├── localAuth.ts        # Auth module (Supabase Auth + localStorage)
│       ├── db.ts               # Database module (Supabase PostgreSQL)
│       ├── volcengine.ts       # ByteDance Ark API (text + image generation)
│       ├── styleConfig.ts      # Art style definitions
│       ├── diagnostics.ts      # Diagnostics checks
│       └── utils/              # Language detection, PDF text helpers
├── public/                     # Static assets (icons, images)
├── tailwind.config.ts          # Tailwind CSS v4 configuration
├── next.config.ts              # Next.js configuration (static export)
└── github/workflows/           # CI/CD (Windows, macOS, Android builds)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend Framework | Next.js 16 + React 19 + TypeScript 5 |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Cloud Database | Supabase PostgreSQL (RLS enabled) |
| Cloud Auth | Supabase Auth (email/password) |
| Desktop Engine | Tauri 2 (Rust) |
| Mobile Framework | Capacitor 8 |
| Local Storage | IndexedDB + localStorage (offline fallback) |
| PDF Generation | jsPDF (native API, no html2canvas) |
| AI Text Model | ByteDance Ark — doubao-seed-2-0-mini |
| AI Image Model | ByteDance Ark — doubao-seedream-5-0 |
| Web Hosting | Render Static Site |
| CI/CD | GitHub Actions |

---

## ⬇️ Download & Install

| Platform | Format | Download |
|:---|:---|:---|
| 🌐 Web | Online | [seedream-huibenshengcheng.onrender.com](https://seedream-huibenshengcheng.onrender.com) |
| 🖥️ Windows | `.exe` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 🍎 macOS | `.dmg` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |
| 📱 Android | `.apk` installer | [Releases](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/releases) |

---

## 📦 Manual Build

```bash
git clone https://github.com/ElijahZhao/seedream-HuiBenShengCHENG.git
cd seedream-HuiBenShengCHENG
pnpm install
pnpm build
```

### Environment Variables (optional)

| Variable | Description | Default |
|:---|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Built-in |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Built-in |

> The app works out of the box with pre-configured API keys and Supabase credentials. Environment variables are only needed if you want to use your own Supabase instance.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[MIT](LICENSE) © Seedream

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ElijahZhao">Elijah Lin</a><br/>
Built with <a href="https://nextjs.org">Next.js</a> + <a href="https://tauri.app">Tauri</a> + <a href="https://capacitorjs.com">Capacitor</a> + <a href="https://supabase.com">Supabase</a><br/>
🚀 Deployed on <a href="https://render.com">Render</a> • 🤖 Powered by <a href="https://www.volcengine.com/product/doubao">ByteDance Doubao Seed</a>
</div>

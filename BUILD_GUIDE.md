# Seedream 混合 App 构建指南

## 前置条件

### 通用
- Node.js 18+ 
- pnpm 9+

### 桌面端（Windows .exe / Mac .dmg）
- [Rust](https://rustup.rs) — 一键安装，约 200MB
- Windows: Visual Studio Build Tools（C++ 编译支持）
- Mac: Xcode Command Line Tools（`xcode-select --install`）

### 移动端（Android .apk）
- [Android Studio](https://developer.android.com/studio)
- Java 17+

## 安装依赖

```bash
cd projects
pnpm install
```

## 桌面端构建

### 开发调试
```bash
pnpm tauri:dev
```
自动启动 Next.js 开发服务器 + Tauri 窗口，支持热更新。

### 打包
```bash
pnpm tauri:build
```
产出文件在 `src-tauri/target/release/bundle/` 下：
- Windows: `msi/Seedream_1.0.0_x64_en-US.msi` 和 `nsis/Seedream_1.0.0_x64-setup.exe`
- Mac: `dmg/Seedream.dmg` 和 `macos/Seedream.app`

## 移动端构建

### 1. 添加 Android 平台（首次）
```bash
pnpm cap:add:android
```
这会创建 `android/` 目录，包含完整的 Android 项目。

### 2. 同步前端代码到 Android 项目
每次修改前端代码后都需要同步：
```bash
pnpm cap:sync
```

### 3. 配置网络权限（已自动配置）
Capacitor 默认已包含 INTERNET 权限，无需额外配置。

### 4. 打开 Android Studio 构建
```bash
pnpm cap:open:android
```
在 Android Studio 中：
1. Build → Generate Signed Bundle / APK
2. 选 APK
3. 填入签名信息（首次需要创建签名文件）
4. Finish

产出文件在 `android/app/build/outputs/apk/` 下。

### 5. 直接安装到手机（调试）
手机开启开发者模式 + USB 调试，连接电脑后：
```bash
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## 首次使用

App 启动后会进入引导页，用户需要：
1. 填入火山方舟 API Key
2. 注册本地账号
3. 开始创作绘本

## 注意事项

- 火山方舟 API Key 获取：console.volcengine.com/ark → 开通管理 → API Key 管理
- 图片生成按次收费（约 0.22 元/张）
- 文字生成每日 50 万 tokens 免费
- 所有数据存储在本地设备上
- Android 版本需要 Android 8.0（API 26）以上

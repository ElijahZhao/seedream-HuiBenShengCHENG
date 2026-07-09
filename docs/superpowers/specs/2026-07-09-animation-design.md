# Seedream 绘本前端动画设计方案

## 概述

为 Seedream 儿童绘本创作平台添加生动的 CSS 动画效果，提升面向儿童用户的交互体验。目标儿童年龄段为 3-5+ 岁，动画风格要求活泼、有趣、不过度刺激。

## 设计原则

- **CSS-only**：不引入任何新依赖，使用已有的 `tw-animate-css` 库 + 自定义 CSS @keyframes
- **零结构改动**：不改变现有布局、颜色、间距、组件结构，仅添加 CSS 类名
- **中等强度**：动画明显但舒适，不过度跳动
- **风格融合**：绘本翻页（A）+ 魔法气泡弹跳（B）+ 卡通弹性（C）的混搭风格

## 4 种自定义动画

### 1. Breathing（呼吸脉冲）
- **用途**：主要 CTA 按钮（"开始创作绘本"、"下一步"、"登录"等）
- **效果**：按钮在 idle 状态轻微缩放脉冲，像在轻轻呼吸，吸引儿童点击
- **关键帧**：`scale(1) → scale(1.04) → scale(1)`，周期 3s，ease-in-out

### 2. Bounce-In（弹跳入场）
- **用途**：卡片、功能项、角色卡片等元素首次出现
- **效果**：元素从下方弹跳入场，配合 `opacity` 过渡，落地后轻微回弹
- **关键帧**：`translateY(40px) scale(0.95) → 弹跳 → 静止`，0.6s

### 3. Bounce-Click（点击弹跳）
- **用途**：所有可点击按钮的 `:active` 状态
- **效果**：点击时先缩小再弹回，模拟真实物理按压感
- **关键帧**：`scale(1) → scale(0.92) → scale(1.04) → scale(1)`，0.4s

### 4. Float（漂浮）
- **用途**：背景装饰元素、徽章图标
- **效果**：缓慢上下浮动，配合轻微旋转，像云朵或气泡
- **关键帧**：`translateY(0) rotate(0deg) → translateY(-8px) rotate(2deg) → translateY(0) rotate(0deg)`，4s

## 每页具体修改

### 首页 `/` (page.tsx)
- "开始创作绘本"按钮 → 添加 `animate-breathing`（呼吸脉冲）
- "我的创作"按钮 → 添加 `animate-breathing`（延迟 1s）
- 6 个功能卡片 → 添加 `animate-bounce-in` 和 `animation-delay` 依次入场
- 4 个故事章节卡片 → 添加 `animate-bounce-in` 和 `animation-delay`
- 背景装饰圆 → 添加 `animate-float`
- 所有按钮 → 添加 `active:animate-bounce-click`

### 创建页面 `/create`
- 主卡片 → `animate-bounce-in`（整体入场）
- 表单元素（主题输入、描述、年龄、风格、页数）→ 依次 `animate-fade-in-up` + `delay-*`
- "下一步"按钮 → `animate-breathing`

### 角色页面 `/characters`
- 角色卡片 → 依次 `animate-bounce-in` + `delay-*`
- "下一步"按钮 → `animate-breathing`

### 故事板页面 `/storyboard`
- 场景列表卡片 → `animate-bounce-in`
- 场景详情卡片 → `animate-bounce-in`（延迟）
- "开始生成绘本"按钮 → `animate-breathing`

### 生成页面 `/generating`
- 主卡片 → `animate-bounce-in`
- 场景缩略图 → 依次 `animate-fade-in-up` + `delay-*`
- 进度条 → 自动过渡
- 加载旋转图标 → 已有 `animate-spin`

### 预览页面 `/preview`
- 书籍查看器 → `animate-bounce-in`
- 翻页按钮 → `animate-breathing`
- 保存/导出按钮 → `animate-breathing`（延迟）
- 信息卡片 → `animate-bounce-in`（延迟）

### 登录页面 `/login`
- 登录卡片 → `animate-bounce-in`
- 表单元素 → 依次 `animate-fade-in-up` + `delay-*`
- 登录按钮 → `animate-breathing`

### 注册页面 `/register`
- 注册卡片 → `animate-bounce-in`
- 表单元素 → 依次 `animate-fade-in-up` + `delay-*`
- 注册按钮 → `animate-breathing`

## 延迟系统

使用已有的 `.delay-100` 到 `.delay-1000` 类，按元素顺序递增：
- 第 1 个元素：`delay-100`
- 第 2 个元素：`delay-200`
- 第 3 个元素：`delay-300`
- 以此类推...

## 技术要求

- 所有动画在 `@layer utilities` 中定义，确保 Tailwind 优先级正确
- 动画使用 `@media (prefers-reduced-motion: reduce)` 时禁用
- 使用 `will-change: transform` 优化性能（仅对动画元素）
- 使用 `transform` 和 `opacity` 属性（GPU 加速，不触发重排）
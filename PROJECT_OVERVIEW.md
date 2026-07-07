# Seedream 绘本 - AI 儿童绘本创作平台

> 让想象力成为绘本 | 由内而外的全面解析

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术架构](#技术架构)
3. [核心功能](#核心功能)
4. [技术栈详解](#技术栈详解)
5. [项目结构](#项目结构)
6. [数据库设计](#数据库设计)
7. [API 接口设计](#api-接口设计)
8. [前端页面](#前端页面)
9. [UI/UX 设计](#uiux-设计)
10. [部署与运维](#部署与运维)
11. [性能优化](#性能优化)
12. [未来规划](#未来规划)

---

## 1. 项目概述

### 1.1 产品定位

**Seedream 绘本**是一款基于人工智能技术的儿童绘本创作平台，旨在让用户（尤其是家长、教育工作者和内容创作者）能够轻松创作出专业级的儿童绘本作品。

### 1.2 核心价值

- **降低创作门槛**：无需专业绘画技能，AI 自动生成高质量插画
- **提升创作效率**：从故事到绘本，完整流程仅需数分钟
- **保持风格统一**：AI 智能维护角色一致性和画面风格
- **多风格支持**：提供 15 种精选艺术风格，满足不同需求
- **即用即享**：实时预览、一键导出 PDF，分享便捷

### 1.3 目标用户

- 👨‍👩‍👧‍👦 家长：为孩子创作个性化绘本
- 👩‍🏫 教育工作者：制作教学素材和故事书
- 🎨 内容创作者：快速产出绘本作品
- 📚 出版社：辅助编辑和预览工作

---

## 2. 技术架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端层 (Next.js 16)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  首页    │  │  创建页  │  │  预览页  │  │ 用户中心 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API 路由层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth API    │  │  Story API   │  │ Image API    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     业务逻辑层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  用户认证    │  │  故事生成    │  │  图片生成    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  豆包大模型   │  │  AWS S3      │
│   数据库      │  │  LLM & 生图   │  │  对象存储     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 技术选型原则

- **现代化**：采用最新稳定版本的技术栈
- **类型安全**：全栈 TypeScript，减少运行时错误
- **性能优先**：SSR、流式输出、懒加载等优化策略
- **开发体验**：热更新、类型提示、组件化开发
- **可维护性**：清晰的代码结构、规范的命名、完善的文档

---

## 3. 核心功能

### 3.1 用户认证系统

**功能特性**
- 用户注册/登录（密码加密存储）
- 会话管理（Cookie + localStorage 双重存储）
- 跨域/子域名环境兼容
- 实时登录状态同步

**技术实现**
- 使用 `bcryptjs` 进行密码加密
- Cookie 存储用户 ID 和用户名
- localStorage 作为 Cookie 的补充，支持不同环境
- 登录状态在导航栏实时显示

**相关文件**
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`

### 3.2 AI 故事创作

**功能特性**
- 根据用户输入的主题和描述生成完整故事
- 自动设计角色设定和场景分镜
- 支持不同年龄段的内容适配
- JSON 格式化输出，便于前端处理

**技术实现**
- 集成豆包大语言模型（Seed-1.6-Flash）
- 精心设计的 System Prompt 确保输出质量
- 流式输出（SSE），实时展示生成进度
- 包含角色、场景、旁白等完整结构

**故事结构**
```json
{
  "title": "绘本标题",
  "characters": [
    {
      "name": "角色名",
      "description": "详细外貌描述",
      "role": "主角/配角/反派"
    }
  ],
  "scenes": [
    {
      "id": "scene-1",
      "shotType": "medium",
      "description": "详细的画面描述",
      "text": "旁白文字",
      "characters": ["角色名"]
    }
  ]
}
```

**相关文件**
- `src/app/api/generate-story/route.ts`
- `src/app/create/page.tsx`

### 3.3 AI 插画生成

**功能特性**
- 为每个场景自动生成高质量插画
- 支持 15 种艺术风格
- 智能匹配角色和场景描述
- 三层容错机制确保稳定性

**技术实现**
- 集成豆包生图大模型
- 每个场景的 prompt 包含：
  - 故事主题和背景
  - 详细的角色描述和动作
  - 场景环境和氛围
  - 艺术风格指导
- 对象存储（S3）保存生成的图片

**容错机制**
1. **403 错误自动重试**：遇到权限错误自动重试
2. **占位图降级**：生成失败时使用占位图
3. **详细错误处理**：记录错误日志，便于排查

**相关文件**
- `src/app/api/generate-images/route.ts`
- `src/app/generating/page.tsx`

### 3.4 作品管理

**功能特性**
- 保存作品到数据库
- 查看个人作品列表
- 删除作品
- 查看作品详情

**技术实现**
- PostgreSQL 存储作品元数据
- JSON 字段存储故事数据和场景信息
- 关联用户 ID，支持多用户系统
- 支持封面图片 URL

**相关文件**
- `src/app/api/picturebooks/route.ts`
- `src/app/api/picturebooks/[id]/route.ts`
- `src/app/my-works/page.tsx`

### 3.5 PDF 导出

**功能特性**
- 一键导出完整绘本为 PDF
- 支持中文显示（使用 html2canvas）
- A4 标准尺寸，适合打印
- 包含封面和所有页面

**技术实现**
- 使用 `jsPDF` 创建 PDF 文档
- 使用 `html2canvas` 渲染内容为图片（支持中文）
- 每页包含插画和旁白文字
- 优化导出性能，添加进度提示

**相关文件**
- `src/app/preview/[id]/page.tsx`

---

## 4. 技术栈详解

### 4.1 前端技术栈

#### 核心框架
- **Next.js 16.1.1**：React 框架，支持 App Router、SSR、流式渲染
- **React 19.2.3**：最新的 React 版本，性能优化和新特性
- **TypeScript 5**：类型安全的 JavaScript 超集

#### UI 组件库
- **shadcn/ui**：基于 Radix UI 的组件库
- **Tailwind CSS 4**：实用优先的 CSS 框架
- **Radix UI**：无样式的可访问性组件

#### 状态管理
- **React Hooks**：useState、useEffect、useRef 等
- **LocalStorage**：客户端数据持久化

#### 样式方案
- **Tailwind CSS 4**：原子化 CSS
- **CSS Modules**：组件级样式
- **自定义动画**：@keyframes 实现复杂动画

#### 工具库
- **lucide-react**：图标库
- **class-variance-authority**：样式变体管理
- **clsx & tailwind-merge**：类名合并工具
- **date-fns**：日期处理
- **jspdf**：PDF 生成
- **html2canvas**：HTML 转图片

### 4.2 后端技术栈

#### 数据库
- **PostgreSQL**：关系型数据库
- **Drizzle ORM**：类型安全的 ORM
- **drizzle-kit**：数据库迁移工具

#### 认证与安全
- **bcryptjs**：密码加密
- **Cookie**：会话管理
- **JWT**（可选扩展）

#### 文件存储
- **AWS S3**：对象存储服务
- **@aws-sdk/client-s3**：S3 客户端
- **@aws-sdk/lib-storage**：S3 上传工具

#### AI 集成
- **coze-coding-dev-sdk**：豆包 AI SDK
  - LLMClient：大语言模型客户端
  - ImageGenerationClient：生图客户端
  - S3Storage：对象存储集成

### 4.3 开发工具

#### 包管理器
- **pnpm 9.0.0**：高效的包管理器
- **only-allow**：强制使用 pnpm

#### 代码质量
- **ESLint 9**：代码检查
- **TypeScript**：类型检查
- **Prettier**（可选）：代码格式化

#### 构建工具
- **Webpack**：Next.js 内置打包工具
- **PostCSS**：CSS 处理
- **Turbopack**（可选）：更快的构建

---

## 5. 项目结构

```
projects/
├── .coze                          # 项目配置文件
├── drizzle/                       # 数据库迁移文件
├── public/                        # 静态资源
│   ├── wechat-qrcode.jpg          # 微信公众号二维码
│   └── douyin-qrcode.jpg          # 抖音二维码
├── scripts/                       # 构建脚本
│   ├── build.sh                   # 生产构建脚本
│   ├── dev.sh                     # 开发启动脚本
│   └── start.sh                   # 生产启动脚本
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API 路由
│   │   │   ├── auth/              # 认证相关
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── generate-story/    # 故事生成
│   │   │   │   └── route.ts
│   │   │   ├── generate-images/   # 图片生成
│   │   │   │   └── route.ts
│   │   │   ├── picturebooks/      # 作品管理
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── search-story/      # 故事搜索
│   │   │   │   └── route.ts
│   │   │   └── debug/             # 调试工具
│   │   │       └── route.ts
│   │   ├── characters/            # 角色确认页
│   │   │   └── page.tsx
│   │   ├── clear-cookies/         # 清除 Cookie 工具
│   │   │   └── page.tsx
│   │   ├── components/            # 页面级组件
│   │   │   └── StyleShowcase.tsx
│   │   ├── create/                # 创建绘本页
│   │   │   └── page.tsx
│   │   ├── debug/                 # 调试页面
│   │   │   ├── cookies/
│   │   │   ├── diagnose/
│   │   │   └── diagnose-story/
│   │   ├── examples/              # 示例作品页
│   │   │   └── page.tsx
│   │   ├── generating/            # 生成中页面
│   │   │   └── page.tsx
│   │   ├── layout.tsx             # 根布局
│   │   ├── login/                 # 登录页
│   │   │   └── page.tsx
│   │   ├── my-works/              # 我的作品页
│   │   │   └── page.tsx
│   │   ├── page.tsx               # 首页
│   │   ├── preview/               # 预览页
│   │   │   └── [id]/page.tsx
│   │   ├── register/              # 注册页
│   │   │   └── page.tsx
│   │   ├── storyboard/            # 分镜确认页
│   │   │   └── page.tsx
│   │   └── globals.css            # 全局样式
│   ├── components/                # 共享组件
│   │   ├── AnimatedBackground.tsx # 动画背景组件
│   │   ├── Footer.tsx             # 页脚组件
│   │   ├── navigation.tsx         # 导航栏组件
│   │   ├── scroll-reveal.tsx      # 滚动揭示组件
│   │   └── ui/                    # shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ... (50+ 组件)
│   └── storage/                   # 存储层
│       └── database/
│           ├── client.ts          # 数据库客户端
│           └── shared/
│               └── schema.ts      # 数据库模型
├── drizzle.config.ts              # Drizzle 配置
├── eslint.config.mjs              # ESLint 配置
├── next.config.ts                 # Next.js 配置
├── package.json                   # 项目依赖
├── postcss.config.mjs             # PostCSS 配置
├── tsconfig.json                  # TypeScript 配置
└── README.md                      # 项目说明
```

---

## 6. 数据库设计

### 6.1 数据库模型

#### 用户表 (users)

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  password TEXT,
  avatar VARCHAR(500),
  is_active BOOLEAN DEFAULT true NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX users_email_idx ON users(email);
```

**字段说明**
- `id`: 用户唯一标识（UUID）
- `email`: 邮箱地址，唯一
- `name`: 用户昵称
- `password`: 加密后的密码
- `avatar`: 头像 URL
- `is_active`: 账号是否激活
- `metadata`: 额外元数据（JSON 格式）
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**
- `users_email_idx`: 邮箱索引，加速查询

#### 绘本表 (picturebooks)

```sql
CREATE TABLE picturebooks (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  theme VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  age_group VARCHAR(20) NOT NULL,
  style VARCHAR(50) NOT NULL,
  page_count INTEGER NOT NULL,
  story_data JSONB NOT NULL,
  cover_image VARCHAR(500),
  is_published BOOLEAN DEFAULT false NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX picturebooks_user_id_idx ON picturebooks(user_id);
CREATE INDEX picturebooks_is_published_idx ON picturebooks(is_published);
```

**字段说明**
- `id`: 绘本唯一标识（UUID）
- `user_id`: 作者用户 ID，外键关联 users 表
- `title`: 绘本标题
- `theme`: 故事主题
- `description`: 故事描述
- `age_group`: 目标年龄段
- `style`: 艺术风格
- `page_count`: 页数
- `story_data`: 故事数据（JSON 格式，包含角色和场景）
- `cover_image`: 封面图片 URL
- `is_published`: 是否发布
- `view_count`: 查看次数
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**
- `picturebooks_user_id_idx`: 用户 ID 索引，加速查询用户作品
- `picturebooks_is_published_idx`: 发布状态索引

**外键约束**
- `user_id` 关联 `users.id`，级联删除（删除用户时自动删除其作品）

### 6.2 数据关系

```
users (1) ─────── (N) picturebooks
                    │
                    ├── story_data (JSONB)
                    │   ├── characters (Array)
                    │   │   └── name, description, role
                    │   └── scenes (Array)
                    │       └── id, shotType, description, text, imageUrl
                    │
                    └── cover_image (S3 URL)
```

---

## 7. API 接口设计

### 7.1 认证相关 API

#### POST /api/auth/register
**描述**：用户注册

**请求体**
```json
{
  "email": "user@example.com",
  "name": "用户名",
  "password": "password123"
}
```

**响应**
```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

#### POST /api/auth/login
**描述**：用户登录

**请求体**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "用户名"
  }
}
```

**Set-Cookie**
```
userId=uuid; Max-Age=2592000; Path=/
userName=用户名; Max-Age=2592000; Path=/
```

#### POST /api/auth/logout
**描述**：用户登出

**响应**
```json
{
  "success": true,
  "message": "登出成功"
}
```

#### GET /api/auth/me
**描述**：获取当前登录用户信息

**响应**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "用户名",
    "avatar": "avatar_url"
  }
}
```

### 7.2 故事生成 API

#### POST /api/generate-story
**描述**：生成绘本故事

**请求体**
```json
{
  "theme": "小狐狸找月亮",
  "description": "一只橙色的小狐狸想找到天上的月亮...",
  "ageGroup": "3-5",
  "style": "watercolor",
  "pageCount": 8
}
```

**响应**：流式输出（Server-Sent Events）

```json
data: {"type":"progress","message":"正在生成故事..."}
data: {"type":"progress","message":"故事生成完成！"}
data: {"type":"complete","data":{"title":"小狐狸找月亮","characters":[...],"scenes":[...]}}
```

### 7.3 图片生成 API

#### POST /api/generate-images
**描述**：生成绘本插画

**请求体**
```json
{
  "scenes": [
    {
      "id": "scene-1",
      "description": "橙色小狐狸在森林里抬头看月亮",
      "shotType": "medium",
      "text": "小狐狸决定去寻找月亮",
      "characters": ["小狐狸"]
    }
  ],
  "style": "watercolor",
  "ageGroup": "3-5",
  "theme": "小狐狸找月亮",
  "characters": [
    {
      "name": "小狐狸",
      "description": "橙色毛发，大眼睛，毛茸茸的尾巴",
      "role": "主角"
    }
  ]
}
```

**响应**
```json
{
  "success": true,
  "images": [
    {
      "sceneId": "scene-1",
      "url": "https://s3.amazonaws.com/bucket/image.jpg"
    }
  ]
}
```

### 7.4 作品管理 API

#### GET /api/picturebooks
**描述**：获取用户作品列表

**查询参数**
- `userId`: 用户 ID（可选，支持从 Cookie、请求体或查询参数获取）

**响应**
```json
{
  "success": true,
  "picturebooks": [
    {
      "id": "uuid",
      "title": "小狐狸找月亮",
      "theme": "小狐狸找月亮",
      "ageGroup": "3-5",
      "style": "watercolor",
      "pageCount": 8,
      "coverImage": "cover_url",
      "createdAt": "2024-01-01T00:00:00Z",
      "viewCount": 100
    }
  ]
}
```

#### POST /api/picturebooks
**描述**：保存作品

**请求体**
```json
{
  "userId": "uuid",
  "title": "小狐狸找月亮",
  "theme": "小狐狸找月亮",
  "description": "故事描述",
  "ageGroup": "3-5",
  "style": "watercolor",
  "pageCount": 8,
  "storyData": {...},
  "coverImage": "cover_url"
}
```

**响应**
```json
{
  "success": true,
  "picturebook": {
    "id": "uuid",
    ...
  }
}
```

#### DELETE /api/picturebooks/[id]
**描述**：删除作品

**查询参数**
- `userId`: 用户 ID

**响应**
```json
{
  "success": true,
  "message": "删除成功"
}
```

### 7.5 故事搜索 API

#### POST /api/search-story
**描述**：搜索故事内容

**请求体**
```json
{
  "theme": "小狐狸"
}
```

**响应**
```json
{
  "success": true,
  "description": "一只橙色的小狐狸，名叫小橙，它有着蓬松的橙色毛发..."
}
```

---

## 8. 前端页面

### 8.1 首页 (/)

**功能**
- 产品介绍和功能展示
- 4 步创作流程说明
- 15 种艺术风格展示
- 引导用户开始创作

**核心组件**
- Hero Section：主标题和 CTA 按钮
- Features Grid：功能特点展示
- Style Showcase：艺术风格卡片
- AnimatedBackground：动态背景

**技术亮点**
- 滚动触发动画效果
- 渐变背景和阴影效果
- 响应式布局（移动端适配）

### 8.2 创建页 (/create)

**功能**
- 输入故事主题和描述
- 选择目标年龄段
- 选择艺术风格
- 设置绘本页数
- 搜索故事主题（AI 辅助）

**表单字段**
- 故事主题（必填）
- 故事描述（可选，可 AI 生成）
- 目标年龄（3-5岁、6-8岁、9-12岁）
- 艺术风格（15 种选择）
- 页数（4-32页，支持自由输入）

**交互优化**
- 实时表单验证
- 快捷按钮（推荐页数）
- AI 搜索辅助功能
- 流式生成进度展示

### 8.3 角色确认页 (/characters)

**功能**
- 查看 AI 生成的角色
- 确认角色描述
- 进入下一步（分镜确认）

**展示内容**
- 角色名称
- 角色外貌描述
- 角色定位（主角/配角/反派）

### 8.4 分镜确认页 (/storyboard)

**功能**
- 查看所有场景分镜
- 预览插画（如有）
- 开始生成完整插画

**展示内容**
- 场景缩略图
- 景别类型
- 画面描述
- 旁白文字

### 8.5 生成中页面 (/generating)

**功能**
- 展示生成进度
- 实时显示生成的插画
- 完成后跳转到预览页

**进度展示**
- 场景生成进度条
- 当前生成场景
- 已完成的场景预览

### 8.6 预览页 (/preview/[id])

**功能**
- 翻页查看完整绘本
- 导出 PDF
- 保存作品
- 查看角色和分镜信息

**交互功能**
- 上一页/下一页
- 页面导航
- PDF 导出（支持中文）
- 保存到作品集
- 分享链接

### 8.7 我的作品页 (/my-works)

**功能**
- 查看个人作品列表
- 删除作品
- 查看作品详情
- 创建新作品

**展示内容**
- 作品封面
- 作品标题
- 故事主题
- 艺术风格
- 创建时间
- 查看次数

### 8.8 用户认证页面

#### 登录页 (/login)
- 邮箱和密码登录
- 记住我功能
- 跳转注册页

#### 注册页 (/register)
- 邮箱注册
- 密码设置
- 跳转登录页

---

## 9. UI/UX 设计

### 9.1 设计理念

**设计原则**
- 🎨 **生动活泼**：面向儿童，色彩明亮、形状圆润
- 🌈 **和谐统一**：紫色到青色的渐变主题
- ✨ **动感十足**：云彩、小动物、气球等动态元素
- 📱 **响应式设计**：完美适配移动端和桌面端

### 9.2 配色方案

**主色调**
- 紫色 (#7C3AED)：AI 智能、创造力
- 青色 (#06B6D4)：科技感、清新

**辅助色**
- 粉色 (#EC4899)：温暖、可爱
- 橙色 (#F97316)：活力、能量

**背景色**
- 浅紫色 (#FAF5FF)：温柔梦幻
- 白色 (#FFFFFF)：干净整洁
- 渐变背景：从浅紫到浅青

**文字色**
- 深紫色 (#1E1B4B)：主要文字
- 灰色 (#9CA3AF)：次要文字

### 9.3 字体系统

**标题字体**
- **Cormorant Garamond**：优雅的衬线字体，用于大标题

**正文字体**
- **Libre Baskerville**：易读的衬线字体，用于正文

**UI 字体**
- **Nunito**：圆润的无衬线字体，用于按钮和标签

### 9.4 设计系统

**组件库**
- **shadcn/ui**：基于 Radix UI 的现代化组件库
- 50+ 预置组件，包括按钮、卡片、表单、对话框等

**视觉效果**
- **毛玻璃效果 (Glassmorphism)**：半透明背景 + 模糊
- **软 3D 效果 (Claymorphism)**：柔和的立体感
- **渐变效果**：从紫色到青色的渐变
- **阴影系统**：多层次的柔和阴影

**动画效果**
- **云彩浮动**：5 朵不同云彩，浮动动画
- **星星闪烁**：10 颗星星，随机闪烁
- **小动物漂浮**：6 只可爱动物，漂浮动画
- **气球上升**：4 个气球，从底部升起
- **花瓣摇摆**：15 个花瓣，随风摇摆
- **滚动揭示**：元素随滚动进入视野

### 9.5 交互设计

**微交互**
- 按钮悬停：缩放 + 阴影变化
- 卡片悬停：上浮 + 边框高亮
- 输入框聚焦：边框颜色变化
- 页面滚动：导航栏阴影变化

**反馈机制**
- 加载状态：骨架屏 + 进度条
- 错误提示：Toast 通知
- 成功提示：成功动画
- 确认操作：对话框

**无障碍**
- 键盘导航支持
- ARIA 标签
- 高对比度模式
- 屏幕阅读器友好

---

## 10. 部署与运维

### 10.1 项目配置

**.coze 配置文件**
```toml
[project]
entrypoint = "src/app/page.tsx"
requires = ["nodejs-24"]

[dev]
build = ["pnpm", "install", "--prefer-frozen-lockfile", "--prefer-offline"]
run = ["npx", "next", "dev", "--webpack", "--port", "5000"]

[deploy]
build = ["pnpm", "install", "--prefer-frozen-lockfile", "--prefer-offline", "&&", "npx", "next", "build"]
run = ["npx", "next", "start", "--port", "5000"]
```

### 10.2 环境变量

需要配置的环境变量：
- `COZE_BUCKET_ENDPOINT_URL`：S3 对象存储端点
- `COZE_BUCKET_NAME`：S3 存储桶名称
- `DATABASE_URL`：PostgreSQL 数据库连接字符串

### 10.3 构建流程

**开发环境**
```bash
coze dev
# 或
pnpm install
npx next dev --port 5000
```

**生产构建**
```bash
coze build
# 或
pnpm install
npx next build
```

**生产启动**
```bash
coze start
# 或
npx next start --port 5000
```

### 10.4 端口配置

- **开发/生产端口**：5000
- **S3 端口**：443（HTTPS）
- **数据库端口**：5432（默认）

### 10.5 服务检查

**检查端口占用**
```bash
ss -lptn 'sport = :5000'
```

**检查服务状态**
```bash
curl -I http://localhost:5000
```

---

## 11. 性能优化

### 11.1 前端优化

**代码分割**
- Next.js 自动路由级代码分割
- 动态导入（`next/dynamic`）

**懒加载**
- 图片懒加载（Next.js Image 组件）
- 组件懒加载

**缓存策略**
- CDN 缓存静态资源
- Service Worker 缓存（可选）
- LocalStorage 缓存用户数据

**渲染优化**
- SSR（服务端渲染）首屏
- Streaming（流式渲染）生成内容
- 客户端 hydration

**包大小优化**
- Tree Shaking
- 代码压缩
- 依赖分析

### 11.2 后端优化

**API 优化**
- 流式响应（SSE）
- 请求缓存
- 批量处理

**数据库优化**
- 索引优化
- 查询优化
- 连接池

**文件存储优化**
- CDN 加速
- 图片压缩
- 缓存策略

### 11.3 AI 调用优化

**LLM 优化**
- 精简 Prompt
- 缓存相似请求
- 流式输出

**图片生成优化**
- 批量生成
- 容错重试
- 占位图降级

---

## 12. 未来规划

### 12.1 功能扩展

**短期计划**
- [ ] 角色自定义上传
- [ ] 背景音乐添加
- [ ] 语音旁白
- [ ] 分享到社交媒体
- [ ] 作品评论和点赞

**中期计划**
- [ ] 多人协作创作
- [ ] 角色模板库
- [ ] 场景模板库
- [ ] 高级编辑功能
- [ ] 动画绘本支持

**长期计划**
- [ ] 移动端 App
- [ ] 国际化支持
- [ ] 付费订阅模式
- [ ] 版权保护机制
- [ ] 社区市场

### 12.2 技术升级

**性能提升**
- [ ] 边缘计算（Edge Runtime）
- [ ] Server Components 优化
- [ ] WebSocket 实时通信
- [ ] Web Workers 后台处理

**技术栈升级**
- [ ] Next.js 最新版本
- [ ] React Server Actions
- [ ] Turbopack 构建工具
- [ ] 微前端架构（可选）

---

## 附录

### A. 技术支持

- **豆包 AI 文档**：https://www.volcengine.com/
- **Next.js 文档**：https://nextjs.org/docs
- **shadcn/ui 文档**：https://ui.shadcn.com
- **Drizzle ORM 文档**：https://orm.drizzle.team/

### B. 常见问题

**Q: 如何更换 AI 模型？**
A: 修改 `src/app/api/generate-story/route.ts` 中的模型配置。

**Q: 如何添加新的艺术风格？**
A: 在风格映射对象中添加新的风格定义。

**Q: 如何修改数据库结构？**
A: 修改 `src/storage/database/shared/schema.ts`，然后运行迁移。

**Q: 如何部署到生产环境？**
A: 使用 `coze build` 构建，然后 `coze start` 启动。

### C. 开发规范

**代码规范**
- 使用 TypeScript 类型注解
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

**提交规范**
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- docs: 文档更新
- chore: 构建/工具

**命名规范**
- 组件：PascalCase（如 `MyComponent`）
- 文件：kebab-case（如 `my-component.tsx`）
- 变量：camelCase（如 `myVariable`）
- 常量：UPPER_SNAKE_CASE（如 `MY_CONSTANT`）

---

## 联系方式

**项目名称**：Seedream 绘本
**版本**：v1.0.0
**最后更新**：2025-01-19

**团队**
- 前端开发：Next.js + React + TypeScript
- 后端开发：Node.js + PostgreSQL + Drizzle ORM
- AI 集成：豆包大语言模型 + 生图模型
- UI/UX 设计：shadcn/ui + Tailwind CSS

**致谢**
感谢所有为这个项目做出贡献的开发者和设计师！

---

**© 2025 Seedream Team. All rights reserved.**

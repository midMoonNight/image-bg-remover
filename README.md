# Image Background Remover

AI 智能图片去背景工具，基于 Next.js + Tailwind CSS + Remove.bg API 构建。

## 功能特性

- ✨ 拖拽或点击上传图片
- 🤖 AI 智能去除背景
- 📥 一键下载 PNG 透明背景图片
- 📱 响应式设计，支持移动端
- ⚡ 无需注册，即传即处理

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **部署**: Cloudflare Pages
- **API**: Remove.bg

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/tkxy/image-bg-remover.git
cd image-bg-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

获取 API Key: https://www.remove.bg/api

### 4. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建部署

```bash
npm run build
```

构建输出在 `dist` 目录，可直接部署到 Cloudflare Pages。

## 部署到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Pages → 创建项目
3. 连接 GitHub 仓库或上传 `dist` 文件夹
4. 添加环境变量 `REMOVE_BG_API_KEY`
5. 部署完成

## 项目结构

```
image-bg-remover/
├── app/
│   ├── api/remove-bg/route.ts  # API 路由
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/
│   ├── UploadZone.tsx          # 上传组件
│   ├── LoadingSpinner.tsx      # 加载动画
│   └── ImagePreview.tsx        # 图片预览
├── next.config.js              # Next.js 配置
├── tailwind.config.js          # Tailwind 配置
└── package.json
```

## 使用限制

- 支持格式: JPG, PNG, WEBP
- 最大文件大小: 5MB
- 处理依赖 Remove.bg API 额度

## License

MIT

# 📸 拍照识字应用

一个基于 React + Gemini AI 的智能拍照识字应用，支持实时拍照、文字识别和历史记录管理。

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ 功能特性

- 📷 **实时拍照**：使用设备摄像头进行拍照
- 🔍 **智能识别**：基于 Google Gemini AI 进行文字识别
- 📝 **历史记录**：自动保存识别历史，支持查看和管理
- 🎨 **现代 UI**：简洁美观的用户界面
- 📱 **响应式设计**：支持移动端和桌面端

## 🛠️ 技术栈

- **前端框架**：React 19.2.0
- **构建工具**：Vite 6.2.0
- **AI 服务**：Google Gemini API
- **语言**：TypeScript
- **样式**：CSS Modules

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v18 或更高版本)
- npm 或 yarn
- Gemini API Key

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/josephdeng8908/-.git
cd 拍照应用
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

复制 `.env.example` 到 `.env.local` 并填写你的 API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
GEMINI_API_KEY=你的_Gemini_API_Key
```

> 💡 获取 API Key：访问 [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **启动开发服务器**

```bash
npm run dev
```

5. **打开浏览器**

访问 http://localhost:5173

## 📦 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
拍照应用/
├── components/          # React 组件
│   ├── CameraView.tsx   # 拍照视图
│   ├── HistoryView.tsx  # 历史记录视图
│   └── LoadingView.tsx  # 加载视图
├── services/            # 服务层
│   ├── aiService.ts     # AI 服务接口
│   └── geminiService.ts # Gemini API 实现
├── hooks/               # 自定义 Hooks
├── App.tsx              # 主应用组件
├── index.tsx            # 应用入口
├── types.ts             # TypeScript 类型定义
└── vite.config.ts       # Vite 配置
```

## 🔧 开发指南

### 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | ✅ |

### 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交信息规范

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [AI Studio 项目](https://ai.studio/apps/drive/10rcq_uctHgZnsNJU1dRWi1AfQmG8HWhh)
- [Google Gemini API](https://ai.google.dev/)
- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/josephdeng8908/-/issues)
- Email: dwf89044485@gmail.com

---

⭐ 如果这个项目对你有帮助，请给个 Star！

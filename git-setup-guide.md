# 🚀 Git + GitHub 最佳实践指南

## 场景：AI 生成的新项目上传到 GitHub

### 📝 前置准备

#### 1. 创建 .gitignore 文件（必须！）

在项目根目录创建 `.gitignore`，避免提交不必要的文件：

```gitignore
# 依赖目录（最重要！）
node_modules/
vendor/
__pycache__/
.venv/
venv/

# 环境变量（敏感信息）
.env
.env.local
.env.*.local
*.key
*.pem
config/secrets.yml

# 构建产物
dist/
build/
out/
*.min.js
*.min.css

# 日志文件
*.log
logs/
npm-debug.log*

# 编辑器配置
.vscode/
.idea/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db
desktop.ini

# 临时文件
*.tmp
*.temp
.cache/
```

#### 2. 创建 README.md（推荐）

```markdown
# 项目名称

简短描述项目功能

## 功能特性

- 功能 1
- 功能 2

## 技术栈

- React / Vue / Python 等
- 其他依赖

## 快速开始

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

## 环境变量

复制 `.env.example` 到 `.env` 并填写：

\`\`\`
API_KEY=your_api_key
\`\`\`
```

#### 3. 创建 .env.example（如果有环境变量）

```bash
# API 配置
API_KEY=your_api_key_here
API_URL=https://api.example.com

# 数据库配置
DATABASE_URL=postgresql://localhost:5432/mydb
```

---

### 🔧 完整操作流程

#### 方案 A：使用 HTTPS（简单，适合新手）

```bash
# 1. 进入项目目录
cd /path/to/your/project

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件到暂存区
git add .

# 4. 查看将要提交的文件（检查是否有敏感信息）
git status

# 5. 首次提交
git commit -m "Initial commit: 项目初始化"

# 6. 重命名分支为 main（GitHub 默认）
git branch -M main

# 7. 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 8. 推送到 GitHub
git push -u origin main
```

**首次推送时会要求输入 GitHub 用户名和密码（或 Personal Access Token）**

---

#### 方案 B：使用 SSH（推荐，一次配置永久使用）

**前置：配置 SSH 密钥**

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"
# 一路回车，使用默认设置

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub
# 复制输出的内容

# 3. 添加到 GitHub
# 访问 https://github.com/settings/keys
# 点击 "New SSH key"
# 粘贴公钥，保存

# 4. 测试连接
ssh -T git@github.com
# 看到 "Hi username!" 表示成功
```

**使用 SSH 推送**

```bash
# 1-6 步同上...

# 7. 添加远程仓库（使用 SSH 地址）
git remote add origin git@github.com:你的用户名/仓库名.git

# 8. 推送到 GitHub
git push -u origin main
```

---

### 📦 日常开发工作流

#### 标准流程

```bash
# 1. 修改代码...

# 2. 查看修改了哪些文件
git status

# 3. 查看具体修改内容
git diff

# 4. 添加修改的文件
git add .                    # 添加所有修改
# 或
git add file1.js file2.css   # 添加特定文件

# 5. 提交修改（写清楚做了什么）
git commit -m "feat: 添加用户登录功能"

# 6. 推送到 GitHub
git push
```

#### 提交信息规范（推荐）

```bash
# 功能开发
git commit -m "feat: 添加用户注册功能"

# Bug 修复
git commit -m "fix: 修复登录按钮点击无响应问题"

# 文档更新
git commit -m "docs: 更新 README 安装说明"

# 样式调整
git commit -m "style: 调整导航栏样式"

# 代码重构
git commit -m "refactor: 重构用户认证逻辑"

# 性能优化
git commit -m "perf: 优化图片加载速度"

# 测试相关
git commit -m "test: 添加登录功能单元测试"
```

---

### 🛠️ 实用工具脚本

#### 快速同步脚本 (sync.sh)

```bash
#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📦 开始同步代码到 GitHub...${NC}\n"

# 检查是否有修改
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✅ 没有需要提交的修改${NC}"
    exit 0
fi

# 显示修改的文件
echo -e "${YELLOW}📝 修改的文件:${NC}"
git status -s

# 添加所有修改
git add .

# 提交修改
if [ -z "$1" ]; then
    COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

echo -e "\n${YELLOW}💾 提交: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

# 推送到 GitHub
echo -e "${YELLOW}🚀 推送到 GitHub...${NC}"
if git push; then
    echo -e "\n${GREEN}✅ 同步成功！${NC}"
else
    echo -e "\n${RED}❌ 推送失败${NC}"
    exit 1
fi
```

**使用方法：**

```bash
# 赋予执行权限
chmod +x sync.sh

# 使用自定义提交信息
./sync.sh "添加了新功能"

# 使用默认时间戳
./sync.sh
```

---

### ⚠️ 重要注意事项

#### 1. **永远不要提交敏感信息**

❌ 不要提交：
- API 密钥、Token
- 数据库密码
- 私钥文件 (.pem, .key)
- .env 文件

✅ 应该做：
- 使用 `.gitignore` 忽略敏感文件
- 提供 `.env.example` 作为模板
- 在 README 中说明如何配置

#### 2. **不要提交 node_modules**

```bash
# 如果不小心提交了，删除并重新提交
git rm -r --cached node_modules
git commit -m "chore: 移除 node_modules"
git push
```

#### 3. **提交前检查**

```bash
# 查看将要提交的文件
git status

# 查看具体修改内容
git diff

# 确认无误后再提交
git commit -m "your message"
```

---

### 🔄 常见场景处理

#### 场景 1：提交了错误的文件

```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 重新添加正确的文件
git add correct_files
git commit -m "correct message"
```

#### 场景 2：修改最后一次提交信息

```bash
git commit --amend -m "新的提交信息"
git push --force  # 如果已经推送了
```

#### 场景 3：拉取远程更新

```bash
# 拉取并合并
git pull origin main

# 如果有冲突，解决后：
git add .
git commit -m "merge: 解决冲突"
git push
```

#### 场景 4：查看提交历史

```bash
# 查看提交历史
git log --oneline --graph --all

# 查看某个文件的修改历史
git log -p filename
```

---

### 🎯 最佳实践总结

1. ✅ **提交前必做**：
   - 检查 `.gitignore` 是否完整
   - 确认没有敏感信息
   - 写清楚提交信息

2. ✅ **提交频率**：
   - 完成一个小功能就提交
   - 不要积累太多修改
   - 每天至少推送一次

3. ✅ **分支管理**（团队协作）：
   - `main` 分支保持稳定
   - 新功能在 `feature/xxx` 分支开发
   - 修复 bug 在 `fix/xxx` 分支

4. ✅ **代码审查**：
   - 推送前自己先 review 一遍
   - 使用 `git diff` 检查修改
   - 确保代码可以运行

---

### 📚 进阶技巧

#### 使用 Git Hooks 自动化

```bash
# 提交前自动运行测试
echo "npm test" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# 提交前自动格式化代码
echo "npm run format" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

#### 使用 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          npm install
          npm run build
          # 部署命令...
```

---

### 🆘 遇到问题？

```bash
# 查看 Git 配置
git config --list

# 查看远程仓库
git remote -v

# 查看当前分支
git branch

# 查看帮助
git help <command>
```

---

## 🎉 总结

记住这个流程：

1. **创建 GitHub 仓库**（空仓库）
2. **本地准备**（.gitignore, README）
3. **初始化 Git**（`git init`）
4. **首次提交**（`git add . && git commit`）
5. **连接远程**（`git remote add origin`）
6. **推送代码**（`git push -u origin main`）
7. **日常开发**（改代码 → add → commit → push）

**最重要的三点：**
- 🔒 不要提交敏感信息
- 📝 写清楚提交信息
- 🔄 经常提交和推送

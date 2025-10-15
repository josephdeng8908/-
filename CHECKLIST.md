# ✅ Git 最佳实践检查清单

## 📊 当前项目状态

### ❌ 需要修复的问题

- [ ] **严重**：node_modules (91MB) 已被提交到 Git
- [ ] **中等**：.env.local 已被提交到 Git
- [ ] **中等**：.DS_Store 已被提交到 Git
- [ ] **轻微**：README.md 需要完善
- [ ] **轻微**：缺少 .env.example 文件

### ✅ 已做好的配置

- [x] 已创建 .gitignore 文件
- [x] 已连接到 GitHub 远程仓库
- [x] 使用 main 作为主分支
- [x] 有基础 README.md
- [x] 创建了快速同步脚本

---

## 🔧 修复步骤

### 步骤 1：选择修复方案

#### 方案 A：简单修复（推荐新手）

**优点**：
- ✅ 简单安全，不会破坏现有历史
- ✅ 立即生效
- ✅ 适合个人项目

**缺点**：
- ❌ 仓库大小不会减小（历史中仍有大文件）
- ❌ 已提交的敏感信息仍在历史中

**执行命令**：
```bash
./fix-git-simple.sh
git push
```

---

#### 方案 B：彻底清理（推荐有经验者）

**优点**：
- ✅ 彻底删除历史中的大文件
- ✅ 减小仓库体积
- ✅ 清理敏感信息

**缺点**：
- ❌ 会重写 Git 历史
- ❌ 需要强制推送
- ❌ 团队项目需要通知所有成员

**执行命令**：
```bash
./fix-git-history.sh
git push origin main --force
```

⚠️ **警告**：方案 B 会重写历史，请确保：
1. 已备份重要数据
2. 如果是团队项目，已通知所有成员
3. 理解强制推送的后果

---

### 步骤 2：完善项目文档

```bash
# 1. 使用新的 README
mv README.md README-OLD.md
mv README-NEW.md README.md

# 2. 提交更改
git add .
git commit -m "docs: 完善项目文档和配置"
git push
```

---

### 步骤 3：验证配置

```bash
# 检查 .gitignore 是否生效
git status

# 确认以下文件不在追踪列表中：
# - node_modules/
# - .env.local
# - .DS_Store
```

---

## 📋 日常开发检查清单

### 提交前检查

- [ ] 运行 `git status` 查看修改的文件
- [ ] 确认没有敏感信息（API keys, 密码等）
- [ ] 确认没有不必要的文件（node_modules, .DS_Store 等）
- [ ] 运行 `git diff` 查看具体修改内容
- [ ] 写清楚提交信息

### 提交信息规范

```bash
# 好的提交信息 ✅
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复拍照按钮无响应问题"
git commit -m "docs: 更新 README 安装说明"

# 不好的提交信息 ❌
git commit -m "update"
git commit -m "fix bug"
git commit -m "修改"
```

### 推送前检查

- [ ] 代码可以正常运行
- [ ] 没有语法错误
- [ ] 已测试主要功能
- [ ] 提交信息清晰明确

---

## 🎯 最佳实践总结

### 永远不要提交

```gitignore
# 依赖目录
node_modules/
vendor/
__pycache__/

# 环境变量和密钥
.env
.env.local
*.key
*.pem

# 构建产物
dist/
build/
out/

# 系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
```

### 应该提交

```
# 源代码
src/
components/
services/

# 配置文件
package.json
tsconfig.json
vite.config.ts

# 文档
README.md
LICENSE

# 环境变量模板
.env.example

# Git 配置
.gitignore
```

---

## 🔄 推荐的工作流程

### 日常开发

```bash
# 1. 开始工作前，拉取最新代码
git pull

# 2. 修改代码...

# 3. 查看修改
git status
git diff

# 4. 提交修改
git add .
git commit -m "feat: 添加新功能"

# 5. 推送到 GitHub
git push

# 或使用快速脚本
./sync.sh "添加新功能"
```

### 功能开发（推荐）

```bash
# 1. 创建功能分支
git checkout -b feature/user-login

# 2. 开发功能...

# 3. 提交修改
git add .
git commit -m "feat: 实现用户登录功能"

# 4. 切回主分支
git checkout main

# 5. 合并功能分支
git merge feature/user-login

# 6. 推送到 GitHub
git push

# 7. 删除功能分支（可选）
git branch -d feature/user-login
```

---

## 📚 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 指南](https://guides.github.com/)
- [Git 最佳实践](https://github.com/git-tips/tips)
- [语义化提交信息](https://www.conventionalcommits.org/)

---

## 🆘 常见问题

### Q: 不小心提交了敏感信息怎么办？

```bash
# 1. 立即修改密码/密钥
# 2. 从 Git 历史中删除
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# 3. 强制推送
git push origin main --force
```

### Q: 如何撤销最后一次提交？

```bash
# 撤销提交，保留修改
git reset --soft HEAD~1

# 撤销提交和修改
git reset --hard HEAD~1
```

### Q: 如何查看提交历史？

```bash
# 简洁视图
git log --oneline --graph --all

# 详细视图
git log -p

# 查看某个文件的历史
git log -p filename
```

---

## ✅ 完成检查

修复完成后，确认以下几点：

- [ ] `git status` 显示工作区干净
- [ ] node_modules 不在追踪列表中
- [ ] .env.local 不在追踪列表中
- [ ] .DS_Store 不在追踪列表中
- [ ] README.md 内容完整
- [ ] .env.example 文件存在
- [ ] 可以正常推送到 GitHub

---

**🎉 恭喜！你的项目现在符合 Git 最佳实践了！**

#!/bin/bash

# 快速同步脚本 - 将本地修改推送到 GitHub

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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
echo -e "\n${YELLOW}➕ 添加所有修改...${NC}"
git add .

# 提交修改（使用参数或默认消息）
COMMIT_MSG="${1:-Update: $(date '+%Y-%m-%d %H:%M:%S')}"
echo -e "${YELLOW}💾 提交修改: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

# 推送到 GitHub
echo -e "${YELLOW}🚀 推送到 GitHub...${NC}"
if git push origin $(git branch --show-current); then
    echo -e "\n${GREEN}✅ 同步成功！${NC}"
else
    echo -e "\n${RED}❌ 推送失败，请检查网络或权限${NC}"
    exit 1
fi

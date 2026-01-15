#!/bin/bash

# mslee98.github.io에 빌드된 파일 배포 스크립트

echo "🚀 Building VitePress site..."
yarn docs:build

echo "📦 Build completed. Files are in .vitepress/dist"

# mslee98.github.io 저장소 경로
DEPLOY_DIR="../mslee98.github.io"

# 저장소가 없으면 클론
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "📥 Cloning mslee98.github.io repository..."
  cd ..
  git clone https://github.com/mslee98/mslee98.github.io.git
  cd github-blog
fi

# 빌드된 파일 복사
echo "📋 Copying build files..."
cd "$DEPLOY_DIR"

# 기존 파일 삭제 (.git 제외)
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' -exec rm -rf {} +

# 빌드된 파일 복사
cp -r ../github-blog/.vitepress/dist/* .

# Git 커밋 및 푸시
echo "💾 Committing and pushing..."
git add .
git commit -m "Deploy: Update from ms-fundamentals" || echo "No changes to commit"
git push origin main

echo "✅ Deployment complete!"

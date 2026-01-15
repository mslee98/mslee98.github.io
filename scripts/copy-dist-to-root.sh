#!/bin/bash

# 빌드된 파일을 루트로 복사하는 스크립트

echo "🚀 Building VitePress site..."
yarn docs:build

echo "📦 Copying build files to root..."

# 빌드된 파일을 루트로 복사
cp -r .vitepress/dist/* .

echo "✅ Build files copied to root!"
echo ""
echo "다음 단계:"
echo "1. git add ."
echo "2. git commit -m 'Deploy: Add build files'"
echo "3. git push origin main"

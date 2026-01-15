const fs = require('fs');
const path = require('path');

const sourceDistDir = path.join(__dirname, '..', '.vitepress', 'dist');
const targetDistDir = path.join(__dirname, '..', 'dist');

// dist 디렉토리가 존재하는지 확인
if (!fs.existsSync(sourceDistDir)) {
  console.error('❌ .vitepress/dist directory not found. Please build first.');
  process.exit(1);
}

console.log('📦 Copying build files to dist/ directory...');

// 기존 dist 디렉토리 삭제 (있다면)
if (fs.existsSync(targetDistDir)) {
  fs.rmSync(targetDistDir, { recursive: true, force: true });
  console.log('  🗑️  Removed existing dist/ directory');
}

// dist 디렉토리 생성
fs.mkdirSync(targetDistDir, { recursive: true });

// .vitepress/dist의 내용을 루트/dist로 복사
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
      copyRecursive(
        path.join(src, item),
        path.join(dest, item)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 복사 실행
try {
  const items = fs.readdirSync(sourceDistDir);
  items.forEach(item => {
    const srcPath = path.join(sourceDistDir, item);
    const destPath = path.join(targetDistDir, item);
    copyRecursive(srcPath, destPath);
    console.log(`  ✅ Copied: ${item}`);
  });
  
  console.log('\n✅ Build files copied to dist/ directory successfully!');
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}

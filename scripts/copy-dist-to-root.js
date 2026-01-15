const fs = require('fs');
const path = require('path');

const sourceDistDir = path.join(__dirname, '..', '.vitepress', 'dist');
const rootDir = path.join(__dirname, '..');
const targetDocsDir = path.join(rootDir, 'docs');

// dist 디렉토리가 존재하는지 확인
if (!fs.existsSync(sourceDistDir)) {
  console.error('❌ .vitepress/dist directory not found. Please build first.');
  process.exit(1);
}

console.log('📦 Copying build files to docs/ directory...');

// 기존 docs 디렉토리 삭제 (빌드된 파일만, 소스 파일은 sites/에 있음)
if (fs.existsSync(targetDocsDir)) {
  fs.rmSync(targetDocsDir, { recursive: true, force: true });
  console.log('  🗑️  Removed existing docs/ directory');
}

// docs 디렉토리 생성
fs.mkdirSync(targetDocsDir, { recursive: true });

// .vitepress/dist의 내용을 docs/로 복사
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
    const destPath = path.join(targetDocsDir, item);
    copyRecursive(srcPath, destPath);
    console.log(`  ✅ Copied: ${item}`);
  });
  
  console.log('\n✅ Build files copied to docs/ directory successfully!');
  console.log('   GitHub Pages will serve files from /docs directory.');
  console.log('   Source markdown files are in sites/ directory.');
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}

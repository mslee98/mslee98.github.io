import { defineConfig } from 'vitepress';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { loadPosts } from './utils/loadPosts';

// 빌드 타임에 postsData.ts 자동 생성
if (typeof process !== 'undefined') {
  try {
    const posts = loadPosts();
    const postsDataPath = join(process.cwd(), '.vitepress', 'utils', 'postsData.ts');
    const postsDataContent = `// 빌드 타임에 자동 생성된 게시글 데이터
import type { Post } from './posts'
export const allPosts: Post[] = ${JSON.stringify(posts, null, 2)}
`;
    writeFileSync(postsDataPath, postsDataContent, 'utf-8');
    console.log(`✓ Generated postsData.ts with ${posts.length} posts`);
  } catch (error) {
    console.warn('Failed to generate postsData.ts:', error);
  }
}

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: 'ms98 Blog',
  description: 'ms98-ssg-blog',
  
  // dead link 체크 비활성화 (wiki 디렉토리 삭제로 인한 링크 에러 방지)
  ignoreDeadLinks: true,
  
  // 빌드에서 제외할 파일/디렉토리
  srcExclude: ['README.md', '**/node_modules/**'],
  
  // 빌드 옵션
  vite: {
    ssr: {
      noExternal: ['vue', 'vitepress']
    },
    build: {
      rollupOptions: {
        external: (id) => {
          // vue/server-renderer는 external로 처리하지 않음 (VitePress가 필요로 함)
          return false
        },
        output: {
          // vue/server-renderer 관련 경고 무시
          inlineDynamicImports: false
        }
      }
    }
  },
  
  themeConfig: {
    // 네비게이션 바 (상단)
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/docs/aboutme/' },
      { text: 'Portfolio', link: 'https://r3f-portpolio.vercel.app/' },
      { text: 'Article', link: '/docs/article/' },
      {
        text: 'Insight',
        items: [
          { text: 'Web Design', link: '/docs/insight/webDesign' },
          { text: 'UX Design', link: '/docs/insight/uxDesign' },
          { text: 'Front Tech', link: '/docs/insight/frontTech' },
          { text: 'Front 지식', link: '/docs/insight/frontKnowledge' }
        ]
      }
    ],

    // 사이드바 메뉴 (경로별로 설정)
    sidebar: {
      // Article 목록 페이지는 사이드바 없음 (태그 클라우드가 우측에 있음)
      '/docs/article/': [],

      // 기본 사이드바 (다른 경로들)
      // 개별 포스트 페이지는 frontmatter의 outline: deep 설정으로 목차가 자동 표시됩니다
      '/': []
    },

    // 소셜 링크 (선택사항)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mslee98/ms-fundamentals' }
    ],

    // 검색 기능 활성화
    search: {
      provider: 'local'
    }
  }
})


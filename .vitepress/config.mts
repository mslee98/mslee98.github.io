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
  title: 'MS98 Tech Blog',
  description: '인터랙티브한 프론트엔드 아키텍처를 실험하며 React·WebGL·시각화 기반 웹 기술과 학습 과정을 정리하는 개발자 기술 블로그',

  // SEO SETTING
  sitemap: { 
    hostname: "https://mslee98.github.io/",
  },
  // cannonical 
  transformPageData(pageData) {
    const canonicalUrl = `https://mslee98.github.io/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ])
  },
  // google g tag
  head: [
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-WH0QXJRHK1", // 태그 ID
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-WH0QXJRHK1');`, // 태그 ID
    ],
  ],
  
  // GitHub Pages 배포를 위한 base 경로 설정
  // mslee98.github.io는 루트 도메인이므로 base는 '/'로 설정
  base: '/',
  // srcDir는 기본값(루트 디렉토리)을 사용
  // 소스 파일: 루트의 index.md와 sites/ 디렉토리
  // 빌드 결과물: .vitepress/dist → scripts/copy-dist-to-root.js가 docs/로 복사
  
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
    footer: {
      message: '인터랙션과 구조를 실험하는 프론트엔드 기록장',
      copyright: '© 2026 MS98 · 대전 어딘가에서 코딩 중'
    },
    // 네비게이션 바 (상단)
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/sites/aboutme/' },
      { text: 'Portfolio', link: 'https://r3f-portpolio.vercel.app/' },
      { text: 'Lab', link: 'https://mslee-lab-shell.netlify.app/' },
      { text: 'Article', link: '/sites/article/' },
      {
        text: 'Insight',
        items: [
          { text: 'Web Design', link: '/sites/insight/webDesign' },
          { text: 'UX Design', link: '/sites/insight/uxDesign' },
          { text: 'Front Tech', link: '/sites/insight/frontTech' },
          { text: 'Front 지식', link: '/sites/insight/frontKnowledge' },
          { text: 'WebGL / Three.js', link: '/sites/insight/webglThreejs' }
        ]
      }
    ],

    // 사이드바 메뉴 (경로별로 설정)
    sidebar: {
      // Article 목록 페이지는 사이드바 없음 (태그 클라우드가 우측에 있음)
      '/sites/article/': [],

      // article - 모노레포 섹션 사이드바
      '/sites/article/monorepo/': [
        {
          text: '모노레포 개념',
          items: [
            { text: '모노레포 서론', link: '/sites/article/monorepo/' },
            { text: '모노레포란 무엇인가?', link: '/sites/article/monorepo/introduction' },
            { text: 'Monorepo vs Multirepo 장단점', link: '/sites/article/monorepo/pros-and-cons' },
            { text: '모노레포 도구', link: '/sites/article/monorepo/tools' }
          ]
        }
      ],

      // article - 패키지 매니저 섹션 사이드바
      '/sites/article/packageManager/': [
        {
          text: '패키지매니저 개념',
          items: [
            { text: '패키지매니저란?', link: '/sites/article/packageManager/' },
            { text: '패키지매니저 동작과정', link: '/sites/article/packageManager/lifeCycle' },
            { text: 'Monorepo vs Multirepo 장단점', link: '/sites/article/monorepo/pros-and-cons' },
            { text: '모노레포 도구', link: '/sites/article/monorepo/tools' }
          ]
        }
      ],

      // AboutMe 페이지 사이드바
      '/sites/aboutme/': [
        {
          text: 'About Me',
          items: [
            { text: '기본정보', link: '/sites/aboutme/' },
            { text: '기술스택', link: '/sites/aboutme/skills' },
            { text: '자격증', link: '/sites/aboutme/certificate' }
          ]
        }
      ],

      // 기본 사이드바 (다른 경로들)
      // 개별 포스트 페이지는 frontmatter의 outline: deep 설정으로 목차가 자동 표시됩니다
      '/': []
    },

    // 소셜 링크 (선택사항)
    socialLinks: [
    {
      icon: 'github',
      link: 'https://github.com/mslee98/mslee98.github.io'
    },
  ],


    // 검색 기능 활성화
    search: {
      provider: 'local'
    }
  }
})

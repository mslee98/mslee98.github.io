import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
// export default defineConfig({
//   title: "ms",
//   description: "ms-blog-test",
//   themeConfig: {
//     // https://vitepress.dev/reference/default-theme-config
//     nav: [
//       { text: 'Home', link: '/' },
//       { text: 'Examples', link: '/markdown-examples' }
//     ],

//     sidebar: [
//       {
//         text: 'Examples',
//         items: [
//           { text: 'Markdown Examples', link: '/markdown-examples' },
//           { text: 'Runtime API Examples', link: '/api-examples' }
//         ]
//       }
//     ],

//     socialLinks: [
//       { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
//     ]
//   }
// });


// import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ms98 Blog',
  description: 'ms98-ssg-blog',
  
  themeConfig: {
    // 네비게이션 바 (상단)
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About me', link: '/markdown-examples' }
    ],

    // 사이드바 메뉴 (왼쪽)
    sidebar: [
      {
        text: '시작하기',
        items: [
          { text: '홈', link: '/' },
        ]
      },
      {
        text: '문서',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'API Examples', link: '/api-examples' },
        ]
      },
      {
        text: 'Fundamentals',
        items: [
          // 여기에 fundamentals 폴더의 문서들을 추가할 수 있습니다
          // 예: { text: '문서 제목', link: '/fundmentals/파일명' }
          { text: '프론트엔드', link: '/fundmentals/test.md' }
        ]
      }
    ],

    // 소셜 링크 (선택사항)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mslee98/ms-fundamentals' }
    ]
  }
})


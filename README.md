###### 

### 설치
```
yarn
또는
yarn install 
```

### 실행
```
yarn docs:dev
```

### 빌드
```
yarn docs:build
```

- 해당 블로그 build의 경우 **vitepress build && npm run docs:copy-dist** 명령어가 실행 됨.
- **docs:copy-dist**는 **root/scripts/copy-dist-to-root/js**를 실행시켜 **root/.vitepress/dist** 경로에 빌드 파일을 **root/docs** 경로 내부에 복사

### 배포
```
yarn docs:build // 해당 명령어를 통해 root/docs 디렉토리를 생성 후 배포하려는 서비스에서 baseUrl을 /docs 로 선택
```
- github.io 사이트를 배포하면 자동적으로 배포 됨 글 작성 후 배포하면 2번씩 실행되기에 CI 부분믄 **yarn:docs build**로 대체

### 프로젝트 구조
```
root/
├── .gitattributes
├── .gitignore
├── .vitepress/                    # VitePress 설정 및 커스텀 컴포넌트
│   ├── components/
│   │   ├── ArticlePage.vue
│   │   ├── Giscus.vue
│   │   ├── PostList.vue
│   │   └── TagCloud.vue
│   ├── config.mts                 # VitePress 설정 파일
│   ├── theme/
│   │   ├── custom.css
│   │   ├── index.ts
│   │   └── Layout.vue
│   └── utils/
│       ├── loadPosts.ts
│       ├── posts.ts
│       └── postsData.ts
├── docs/                           # 빌드 결과물 (배포용)
│   ├── 404.html
│   ├── assets/                     # 빌드된 자산 파일들
│   ├── hashmap.json
│   ├── images/                     # 이미지 파일들
│   │   ├── hero-img.png
│   │   └── techstack/              # 기술 스택 아이콘들
│   │       ├── babel.svg
│   │       ├── ...
│   ├── index.html
│   ├── sites/                      # 빌드된 HTML 파일들
│   │   ├── aboutme/
│   │   ├── article/
│   │   ├── insight/
│   │   └── index.html
│   └── vp-icons.css
├── index.md                        # 루트 인덱스 파일(home)
├── package.json
├── public/                         # 정적 파일 (소스)
│   └── images/
│       ├── hero-img.png
│       └── techstack/              # 기술 스택 아이콘들
│           ├── babel.svg
│           ├── ...
├── README.md
├── scripts/                        # 배포 및 빌드 스크립트
│   ├── copy-dist-to-root.js
│   ├── copy-dist
```
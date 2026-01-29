---
title: 패키지 매니저란
description: 패키지 매니저가 무엇인지, 그리고 어떻게 작동하는지에 대해 정리한다.
date: 2026-01-24
tags:
  - npm
  - yarn
  - pnpm
  - frontend
outline: deep
---

# 패키지 매니저란?

패키지 매니저는 한마디로 말하면  
**라이브러리의 다운로드, 의존성 해결, 버전 고정, 그리고 실행 환경 연결까지 책임지는 도구**다.

프론트엔드 개발을 하다 보면 이런 코드는 너무 당연하게 작성한다.

```js
import React from 'react'
```

그런데 가만히 생각해보면 여기에는 꽤 많은 정보가 생략되어 있다.

**react**는 정확히 어느 버전을 쓰는 걸까?
이 모듈은 어디에 존재하는 파일일까?
프로젝트의 모든 파일이 같은 React를 쓰고 있다는 건 어떻게 보장될까?

이걸 우리가 일일이 신경 쓰지 않아도 되게 해주는 역할을 바로 패키지 매니저가 한다

ECMAScript 스펙만 놓고 보면, import는 원래 명확한 경로만 허용한다.

```js
import something from './something.js'
import lib from '../lib/index.js'
```

이 모호함을 해결하기 위해 등장한 것이
`package.json` + **패키지 매니저** 조합이다.

우리가 프로젝트 루트에 작성하는 `package.json`에는 이런 정보가 들어 있다.

```json
{
  "dependencies": {
    "react": "^18.2.0" // 18.2.0 ~ 19 미만 버전중 가장 최신인 버전을 선택
  }
}
```

1. package.json을 읽고

2. 명시된 의존성 범위를 해석한 뒤

3. 실제로 설치할 정확한 버전을 결정하고

4. 그 결과를 lockfile에 고정한다

위 과정을 통해 의존성을 가져올 수 있다.

## 참고
[Toss | node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)  
[Toss | 패키지 매니저의 과거, 토스의 선택, 그리고 미래](https://toss.tech/article/lightning-talks-package-manager)  

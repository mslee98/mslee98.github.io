---
title: 패키지 매니저는 어떻게 동작할까?
description: 패키지 매니저의 Resolution, Fetch, Link의 역할을 설명한다.
tags:
  - npm
  - yarn
  - pnpm
  - frontend
outline: deep
---

# 패키지 매니저 동작 과정

```bash
➤  mslee98@MacBookPro yarn
```
위와 같은 명령어를 입력하면 아래와 같은 결과가 나타난다.

```bash
➤ YN0000: · Yarn 4.5.2
➤ YN0000: ┌ Resolution step # 1단계
➤ YN0000: └ Completed
➤ YN0000: ┌ Post-resolution validation
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step # 2단계
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step # 3단계
➤ YN0000: └ Completed
➤ YN0000: · Done with warnings in 0s 142ms
```

그렇다면 **패키지 매니저**는 크게 `Resolution`, `Fetch`, `Link` 3단계를 거친다.

## Resolution 단계
:::info Resolution 단계 요약
- 라이브러리 버전 고정
- 라이브러리의 다른 의존성 확인
- 라이브러리의 다른 의존성 버전 고정
:::

`package.json`을 보면 의존성이 아래처럼 명시되어 있다.
```json
"dependencies": {
    "react": "^18.2.0"
  }
```
`react`라고 명시되어 있으면 **`^`**이 나타내는 규칙에 따라 `≥ 18.2.0, < 19` 사이의 버전을 사용하며,
패키지 매니저는 저 범위 내에서 가장 최신 버전을 사용하려고 한다. 

**즉, 라이브러리 버전을 고정한다.**


## Fetch 단계
:::info Fetch 단계 요약
- 결정된 버전의 패키지 파일을 다운로드하는 과정
:::

이 단계에서는 Resolution 결과로 결정된 버전의 패키지를 실제로 다운로드한다.  
(일반적으로 대부분은 `npm` 레지스트리에서 받아온다.)

## Link 단계
:::info Link 단계 요약
- Resolution/Fetch 된 라이브러리를 소스 코드에서 사용할 수 있는 환경을 제공하는 과정
:::

`package.json`에 명시된 모든 의존성을 `node_modules` 디렉토리 아래에 배치하는 것이 **Linker**의 역할이다.

> - **npm / Yarn Classic** — `node_modules` 기반 Link
> - **Yarn Berry** — `node_modules` 없이 PnP(Plug'n'Play)로 처리

이어서 각 패키지 매니저의 Linker 방식을 살펴보겠다.

> - npm Linker
> - pnpm Linker
> - PnP Linker



### 1. npm Linker

npm Linker는 의존성 그래프를 폴더 중첩 구조로 물리적으로 표현한다.
즉, 의존성 관계를 그대로 node_modules 폴더 구조로 만든다.

왜 이런 구조가 필요할까?

#### npm Linker 구조

`import React from 'react'` 구문을 만난다면 
현재 파일 위치 기준으로 ./node_modules/react 없다면 ../node_modules/react 루트까지 반복한다.

그렇기에 node_modules를 타고 올라가는 구조가 필요하며,
의존성마다 자기 node_modules를 가질 수 있게 만든다.

npm / Node.js 글을 읽다 보면 **순환참조**에 대한 내용이 나오는데, 여기서는 개념만 정리해 둔다.

<details>
  <summary>순환참조! 조금 더 상세하게</summary> 

  ***순환참조란?*** 서로 다른 모듈에서 서로가 서로를 부를 때 나타나는 현상이다
  ```
  A -> B -> C -> A
  ```
  모듈이 서로가 서로를 호출하는 경우에 의존성이 없어서 못 읽는 문제를 말한다.

  ```
  // a.js
  const b = require('./b')

  // b.js
  const a = require('./a')
  ```

  의존성 분리가 잘못된것이지 npm이랑은 관련이 없다.

</details>

```
my-service/
└─ `node_modules/`
|  ├─ react/
|  |  
|  └─ @tossteam/tds-mobile/
|     └─ `node_modules/`
|         └─ @radix-ui/react-dialog
|
└─ src
    └─ index.ts
```

하지만 위 방식의 근본적인 문제가 있는데 바로 **중복**이다
- 버전이 같아도 트리가 다르면 물리적으로 복사된다.

```
lib-a/node_modules/react
lib-b/node_modules/react
lib-c/node_modules/react
...
```

npm에서는 이 문제를 완화하기 위해 **Hoisting** 기법을 사용한다.

#### Hoisting(유령 의존성)

npm Linker는 구조상 같은 패키지가 여러 의존성 트리에 있으면 여러 번 복사될 수 있고,
이 중복을 줄이기 위해 호이스팅을 사용한다.

공통으로 사용되는 라이브러리를 최상단으로 올리는 방식

```
node_modules/
└─ react   ← 하나만 둠
```

<figure>  
  <img src="./npm-hoisting.png" alt="Alternative text for image"/>  
    <figcaption>
     출처: <a href="https://toss.tech/article/node-modules-and-yarn-berry" target="_blank">[node_modules로부터-우리를-구원해-줄-Yarn-Berry]</a> 
    </figcaption>
</figure>

왼쪽 트리에서는 `[A (1.0)]`과 `[B (1.0)]` 패키지는 두 번 설치되므로 디스크 공간을 낭비한다.
`npm`과 `Yarn Classic(v1)`에서는 디스크 공간을 아끼기 위해 Hoisting을 하여 오른쪽 트리로 바꾼다. 
 
호이스팅 된 `package-1`에서는 기존에 바로 `require()`할 수 없던 `[B (1.0)]`을 라이브러리로 불러올 수 있게 되는데
**직접적으로 의존하고 있지 않은 라이브러리를 `require()` 할 수 있는 현상을 유령 의존성이라 한다.**

---

#### 정리

하지만 임시방편일 뿐 문제가 많다.

> **첫 번째로** 위에서 언급한 **상향 탐색** 문제  
> — `import` 시 현재 경로부터 루트까지 `node_modules`를 반복해서 탐색하는 비효율 

> **두 번째로** 호이스팅 자체의 한계가 있다.
> - 버전이 다르면 호이스팅 불가
> - peerDependency가 있으면 호이스팅이 깨짐 (호환성을 위해 필요한 의존성)
> - 의존성 구조가 조금만 바뀌어도 호이스팅 결과가 달라짐

> **세 번째로** 위에서 언급한 ***유령 의존성(Phantom Dependency)***
> - 직접적으로 `require()` 할 수 없던 의존성을 직접적으로 의존하게 되는 문제

<br><br>

`node_modules` 구조 자체에 한계가 있기 때문에, `pnpm`과 **Yarn Berry(v2+)** 는 각각 다른 방식으로 개선했다.

- **pnpm** — `node_modules`는 유지하되 **Hard Link** 방식으로 중복·성능 문제를 해결  
  → 자세한 내용은 [2. pnpm Linker](#2-pnpm-linker) 참고
- **Yarn Berry** — **PnP(Plug'n'Play)** 로 `node_modules`를 대체  
  → 자세한 내용은 [3. PnP Linker](#3-pnp-linker) 참고

---

### 2. pnpm Linker

`npm`에 단점들 때문에 `pnpm`이 만들어졌다. 쉽게 퍼포먼스가 향상된 `npm`이라고 생각하면 된다.

pnpm은 `node_modules` 구조를 유지하면서 어떻게 성능을 높였을까?

모든 패키지는 단 하나만 저장하고, 프로젝트에서는 링크로만 사용하는 ***`Hard Link`*** 방식 덕분

#### Hard Link방식

쉽게는 `alias`를 거는 행위를 말한다.
`npm`처럼 단순 복붙이 아니라 `alias`가 생기면 접근하여 의존성 디스크에 하나만 설치가 되게 한다.

이 방식은 `node_modules`를 쓸 때도 파일을 매번 복사할 필요가 없어져 속도가 빠르다.

요약하자면
> 모든 패키지는 단 하나만 저장하고, 프로젝트에서는 링크로만 사용한다

<details>
  <summary>조금 더 상세하게</summary> 

  ***pnpm 디렉토리구조***
  
  pnpm은 실제 파일을 저장할 전역 스토어를 가지고 있고, 아래와 같다.

  ```
  ~/.pnpm-store/v3/
  └─ files/
    └─ 4f/
       └─ a23c... (파일 해시)
  ```

  - 파일 단위 해시
  - 동일 파일 중복 저장하지 않음
  - 패키지 버전이 달라고 파일이 같으면 재사용

  실제 파일은 모두 `~/.pnpm-store/v3/` 저장하고, 

  패키지 구성에서는 

  ```
  project/
  └─ node_modules/
    └─ .pnpm/
       └─ lodash@4.17.21/
          └─ node_modules/
             └─ lodash/
                ├─ index.js  (hard link)
                ├─ fp.js     (hard link)
  ```

Hard Link를 통해 접근한다.

하지만 pnpm 동작방식을 찾다보면 symlink(Symbolic Link)라는 말이 나오는데 이는 무엇인가?
Node.js의 require() 해석 규칙(루트까지 상향탐색) 때문인데,

```
node_modules/foo
node_modules/foo/node_modules/bar
../node_modules/bar
```

- **Node.js에서는 부모 디렉토리를 끝없이 올라가며 탐색하고 이를 최적화하기 위해서 Hoisting을 해버린다.**

```
project/
└─ node_modules/
  ├─ foo/
  ├─ bar/
```

```js
// foo/index.js
require("bar") // package.json에 없어도 동작
```

npm은 hoisting된 node_modules 구조 때문에
패키지가 명시하지 않은 의존성에도 우연히 접근할 수 있고,
그 결과 실행 환경에 따라 동작이 달라질 수 있다.

- npm은 상위에 있으면 접근 가능 vs pnpm은 package.json에서 선언한 것만 접근 가능

  pnpm에서는 이를 막고자 Symbolic Link를 사용하며 npm이 느슨하다면 pnpm은 엄격하다고도 표현한다.
  ```
  project/
  └─ node_modules/
  ├─ foo -> .pnpm/foo@1.0.0/node_modules/foo   (symlink)
  ├─ bar -> .pnpm/bar@1.0.0/node_modules/bar   (symlink)
  └─ .pnpm/
  ```
  - top-level `node_modules`는 Symbolic Link로만 구성된다.
  - 각 패키지는 `.pnpm/<pkg>/node_modules` 안에서만 의존성을 가진다.
  
  
</details>


---

### 3. PnP Linker

**Yarn Berry(v2+)** 는 `node_modules`를 아예 두지 않고, **PnP(Plug'n'Play)** 로 의존성을 해석한다.

:::info PnP 단계 요약
- `node_modules` 디렉토리를 사용하지 않음
- `.pnp.cjs` 파일에 패키지 이름 → 디스크 경로 매핑 정보 저장
- Node가 `import`를 해석할 때 이 매핑을 사용하도록 **Resolver**를 끼워 넣음
:::

#### PnP 동작 방식

1. **설치 결과**  
   패키지 파일은 전역 캐시(또는 프로젝트 내 `.yarn/cache`)에만 두고, 프로젝트 루트에는 **`.pnp.cjs`** (및 `.pnp.loader.mjs`) 파일만 생성된다.  
   이 파일에 “어떤 패키지가 어느 경로에 있는지” 정보가 들어 있다.

2. **모듈 해석**  
   `import 'react'` 같은 요청이 오면, Node.js 기본 규칙(node_modules 상향 탐색) 대신 **PnP Resolver**가 `.pnp.cjs`를 보고 `react`의 실제 경로를 반환한다.  
   따라서 `node_modules` 폴더 없이도 정확히 선언된 의존성만 접근 가능하다.

3. **특징**  
   - **유령 의존성 제거** — `package.json`에 없으면 접근 불가  
   - **설치 속도** — 디스크에 심볼릭 링크/복사를 거의 하지 않아 빠름  
   - **일부 도구 호환** — `node_modules`를 가정하는 도구는 `nodeLinker: node-modules` 설정으로 전환하거나, `yarn dlx npx` 등 PnP 인식 방식 사용 필요

<details>
  <summary>PnP 디렉토리 구조 예시</summary>

```
project/
├─ .pnp.cjs              # 패키지 ID → 경로 매핑
├─ .pnp.loader.mjs       # Node가 PnP를 쓰도록 하는 로더
├─ .yarn/
│  └─ cache/             # 실제 패키지 파일 (압축본)
└─ package.json
```

- `node_modules/` 디렉토리는 생성되지 않는다.
- `require('react')` → Resolver가 `.pnp.cjs`를 보고 캐시 안의 `react` 경로를 반환한다.

</details>

정리하면, **npm**은 `node_modules` + 호이스팅, **pnpm**은 `node_modules` + 심볼릭 링크/전역 스토어, **Yarn Berry**는 PnP로 `node_modules` 없이 매핑 파일만으로 의존성을 해석한다.
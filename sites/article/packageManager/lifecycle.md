---
title: 패키지 매니저는 어떻게 동작할까?
description: 패키지 매니저의 Resolution, Fetch, Link의 역할을 설명한다.
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

그렇다 **패키지 매니저**는 크게 `Resolution`, `Fetch`, `Link` 3단계를 거친다.

## Resolution 단계
:::info Resolution 단계 요약
- 라이브러리 버전 고정
- 라이브러리의 다른 의존성 확인
- 라이브러리의 다른 의존성 버전 고정
:::

`package.json`을 보면 의존성이 아래처럼 명시되어있다.
```json
"dependencies": {
    "react": "^18.2.0"
  }
```
`react` 이라고 명시되어 있으면 **`^`**이 나타내는 규칙에 따라 `≥ 18.2.0, < 19` 사이의 버전을 사용하며,
패키지 매니저는 저 범위 내에서 가장 최신 버전을 사용하려고 한다. 

**즉, 라이브러리 버전을 고정한다.**


## Fetch 단계
:::info Fetch 단계 요약
- 결정된 버전의 파일을 다운로드 하는 과정
:::

이 부분에서는 Resolution의 결과로 결정된 버전을 실제로 다운로드 하는 과정이다

(일반적으로 99%는 `npm`레지스트리에서 받아온다)

## Link 단계
:::info Link 단계 요약
- Resolution/Fetch 된 라이브러리를 소스 코드에서 사용할 수 있는 환경을 제공하는 과정
:::

`package.json`에서 명시하는 모든 의존성을 `node_modules` 디렉토리 밑에다가 하나하나씩 쓰는게 `npm Linker`의 역할
> - npm / yarn(classic) - node_modules 기반 Link
> - Yarn Berry는 node_mdules없이 PnP로 처리한다.

각 패키지 매니저의 방식을 살펴보고 자세하게 기술해보겠음

> - npm Linker
> - pnpm Linker
> - PnP Linker



### 1. npm Linker

npm Linker는 의존성 그래프를 폴더 중첩 구조로 물리적으로 표현한다.
즉, 의존성 관계를 그대로 node_modules 폴더 구조로 만든다.

왜 이런 구조가 필요할까?

#### npm Linker 구조(feat. 순회참조)

`import React from 'react'`구문을 만난다면 
현재 파일 위치 기준으로 ./node_modules/react 없다면 ../node_modules/react 루트까지 반복한다.

그렇기에 node_modules를 타고 올라가는 구조가 필요하며,
의존성마다 자기 node_modules를 가질 수 있게 만든다.

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

npm 에서는 이 문제를 해결하기 위해 Hostring 기법을 사용하는데

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
***직접적으로 의존하고 있지 않은 라이브러리를 `require()` 할 수 있는 현상을 유령 의존성이라 한다.***

---

#### 정리

하지만 임시방편일 뿐 문제가 많다.


> **첫 번째로**는 위에서 언급한 ***순회참조***
> - `import` 현재 경로로 부터 최상단 루트까지 `node_modules`를 탐색하는 순회 참조 문제. 
> <br><br>
> 
> **두 번쨰로** 구조적인 부분에서
> - 버전이 다른경우 X
> - perrDependency가 있다면 X (사용하지는 않지만 호환성을 위해 필요한 의존성)
> - 의존성 구조가 조금만 바뀌어도 X
> <br><br>
>
> **세 번쨰로** 위에서 언급한 ***유령 의존성(Phantom Dependency)***
> - 직접적으로 `require()` 할 수 없던 의존성을 직접적으로 의존하게 되는 문제

<br><br>

`node_modules` 구조 자체가 큰 문제가 있는데 `pnpm`과 `Yarn Berry(v2+)`는 어떻게 해결한걸까
- `pnpm` > `node_modules` 그래도 사용하나, ***Hard Link***방식으로 해결 
  - 자세한건 [2.pnpm Linker](#2.pnpm-Linker) 참조
- `Yarn Berry` > `PnP` 방식으로 `node_modules`를 대체 
  - 자세한건 [3.PnP Linker](#3.PnP-Linker) 참조

---

### 2. pnpm Linker


---

### 3. PnP Linker
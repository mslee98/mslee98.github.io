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
`react` 이라고 명시되어 있으면 **`^`**이 나타내는 규칙에 따라 `≥ 18.2.0, <19` 사이의 버전을 사용하며,
패키지 매니저는 저 범위 내에서 가장 최신 버전을 사용하려고 한다. 

**즉, 라이브러리 버전을 고정한다.**


## Fetch 단계
:::info Fetch 단계 요약
- 라이브러리 버전 고정
- 라이브러리의 다른 의존성 확인
- 라이브러리의 다른 의존성 버전 고정
:::

## Link 단계
:::info Link 단계 요약
- 라이브러리 버전 고정
- 라이브러리의 다른 의존성 확인
- 라이브러리의 다른 의존성 버전 고정
:::
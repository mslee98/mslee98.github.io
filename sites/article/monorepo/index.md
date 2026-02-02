---
# 시리즈에서는 index.md에만 date를 작성하도록

title: 모노레포(Monorepo) 정리
description: 프론트엔드 관점에서 모노레포와 멀티레포를 비교하고, 직접 구성해보며 느낀 점을 정리한다.
date: 2026-01-27
tags:
  - monorepo
---

<!-- 
https://velog.io/@phobos90/%EB%A7%88%ED%81%AC%EB%8B%A4%EC%9A%B4%EB%AC%B8%EB%B2%95%EC%A0%95%EB%A6%AC 마크다운 작성 법

### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" /> 

:::tip
:::

<details>
  <summary>접기/펼치기</summary> 
  접은 내용(ex 소스 코드)
</details>

> [!NOTE]  
> Highlights information that users should take into account, even when skimming. 

> [!IMPORTANT]  
> Crucial information necessary for users to succeed. 

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

-->

# <Badge type="warning">작성 중 | 2026-01-27</Badge>

## 서론

요즘 채용 공고를 보다 보면  
**`monorepo`**, **`디자인 시스템`**, **`공통 패키지`**, **`플랫폼 팀`** 같은 키워드가  
너무 자연스럽게 등장한다.

어느 순간부터 프론트엔드 생태계에서는  
이런 개념들이  
“있으면 좋은 것”이 아니라  
**웬만하면 갖추고 있어야 하는 기본값**처럼 느껴진다.

규모가 있는 조직이라면  
플랫폼 팀이 공통 인프라와 개발 환경을 정리해주고,  
각 서비스 팀은 그 위에서 비교적 편하게 개발할 수 있다.

하지만 현실은 늘 그렇게 이상적이진 않다.

- 플랫폼 팀은 없고  
- 서비스는 하나둘 늘어나고  
- 공통 코드는 생기기 시작하는데  
- 구조를 잡아줄 사람은 딱히 없는 상황  

이런 환경에서는 결국  
**구조를 고민하고, 선택하고, 책임지는 역할이 개발자 개인에게 돌아오는 경우**가 많다.

---

사실 개인적으로는  
플랫폼 팀이 하는 일들이 늘 궁금했다.

- 공통 컴포넌트를 어떻게 설계하는지  
- 디자인 시스템은 어떤 기준으로 나누는지  
- Storybook은 어디까지 쓰는 게 적절한지  
- CI/CD나 배포 파이프라인은 어떻게 구성하는지  

한 번쯤은  
**“서비스 만드는 개발자”가 아니라  
“개발 환경을 만드는 개발자”의 관점에서 일해보고 싶다는 생각**도 계속 들었다.

이 시리즈는  
“모노레포가 유행이니까 써보자”라는 이야기보다는,

- 왜 이런 구조가 등장하게 되었는지  
- 어떤 문제를 해결하려는 선택인지  
- 그리고 이게 우리 팀, 혹은 나 혼자 하는 프로젝트에도 의미가 있는지  

를 **프론트엔드 개발자 관점에서 천천히 정리해보는 기록**이다.

정답을 알려주려는 글은 아니다.  
다만 이 글을 읽고 나서,

> *“이 정도 규모라면 이런 선택도 가능하겠구나”*  
> *“이건 지금 우리 상황에서는 조금 과한 것 같네”*

같은 판단을  
스스로 내려볼 수 있다면,  
그걸로 충분하다고 생각한다.



## 목차

- [모노레포란 무엇인가?](./introduction)  
  → 개념과 등장 배경, 왜 거론되기 시작했는지

- [Monorepo vs Multirepo 장단점](./pros-and-cons)  
  → 프론트엔드 관점에서의 현실적인 비교

- [모노레포 초기 세팅](./tools)  
  → 실제로 구성해보며 부딪힌 포인트들

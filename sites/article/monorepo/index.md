---
# 시리즈에서는 index.md에만 데이트를 작성하도록

title: 모노레포(Monorepo) 정리
description: 프론트엔드 관점에서 모노레포와 멀티레포를 비교하고, 직접 구성해보며 느낀 점을 정리한다.
date: 2026-01-27
tags:
  - monorepo
---

<!-- 
### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" /> 
-->

# <Badge type="warning">작성 중</Badge>
> 작성일: 2026-01-27

## 서론

요즘 이직을 준비하면서 느낀 점은  
프론트엔드 생태계가 생각보다 훨씬 복잡해졌다는 것이다.

Monorepo, 디자인 시스템, 공통 패키지, 플랫폼 팀 같은 개념들은  
이제 선택이 아니라 **개발 생산성을 위한 기본 전제**처럼 느껴진다.

규모가 있는 조직이라면 플랫폼 팀이 공통 인프라와 개발 환경을 관리하지만,  
그렇지 않은 환경에서는 이러한 구조를 **개발자 개인이 이해하고 감당해야 하는 경우도 많다.**

이 글에서는  
프론트엔드 관점에서 **모노레포가 왜 등장했고**,  
**어떤 문제를 해결하려는 전략인지**를 차근히 정리해보려 한다.



## 목차

- [모노레포란 무엇인가?](./introduction)
- [Monorepo vs Multirepo 장단점](./pros-and-cons)
- [모노레포 초기 세팅](./tools)

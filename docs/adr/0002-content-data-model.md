# ADR-0002: 콘텐츠 데이터 모델 — Post/Project/Page, 카테고리는 배열, 인증 테이블 없음

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: platform

## Context

기존 frontmatter는 Post(`title`, `date`, `description`, `category` 쉼표 문자열), Project(`thumbnail`, `github`, `demo`, `tech[]` 추가)였다.
이관 시점에 글 4개·프로젝트 2개·About 1개뿐이고 카테고리별 페이지는 없다. 관리자는 1명이다.

## Decision

`Post`, `Project`, `Page` 세 모델을 둔다(`prisma/schema.prisma`).
공개 여부는 `status`(DRAFT/PUBLISHED)로, 표시 날짜·정렬 키는 `publishedAt`으로 한다(기존 `date`를 옮긴다).
카테고리와 기술 스택은 `String[]` 컬럼이다. About은 `Page { key: "about" }` 한 행이다.
slug는 기존 파일명을 그대로 써서 공개 URL을 유지한다(`home-server.status`처럼 점이 있어도 바꾸지 않는다).
Auth.js용 User/Account/Session 테이블은 만들지 않는다(JWT 세션 + GitHub id allowlist).

## Consequences

**좋아진 것**

- 테이블 3개로 끝나고 조인이 없다.
- 기존 URL이 깨지지 않는다.

**감수한 것**

- 카테고리 이름을 바꾸려면 모든 글의 배열을 고쳐야 하고, 카테고리 목록 조회는 `unnest`가 필요하다.
- 관리자를 여러 명으로 늘리려면 인증 테이블을 새로 도입해야 한다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| Tag 테이블 + 다대다 | 카테고리 페이지가 없고 글이 적어 쓰일 곳이 없다 |
| 공개 여부를 `publishedAt IS NOT NULL`로 판단 | 발행했던 글을 내릴 때 원래 날짜를 잃는다 |
| About을 파일로 유지 | 사용자가 관리자에서 About도 편집하기로 했다 |

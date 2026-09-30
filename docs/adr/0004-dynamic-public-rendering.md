# ADR-0004: 공개 페이지는 요청 시 렌더링하고 빌드는 DB에 의존하지 않는다

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: platform

## Context

정적 export를 버리고 DB에서 읽게 되면서(ADR-0001) 렌더링 시점을 정해야 했다.
`generateStaticParams`나 정적 prerender가 남아 있으면 `next build`(곧 `docker build`)가 DB 연결을 요구한다.
트래픽은 적고, 관리자가 저장한 내용은 바로 보여야 한다.

## Decision

`src/app/(public)/layout.tsx`에 `dynamic = "force-dynamic"`을 두어 공개 페이지 전체를 요청 시 렌더링한다.
`generateStaticParams`는 쓰지 않는다. 공개 쿼리는 `status: PUBLISHED`만 읽고, 없으면 `notFound()`다.

## Consequences

**좋아진 것**

- DB 없이 빌드된다 (`.env` 없이 `npm run build` 확인).
- 캐시 무효화를 신경 쓸 필요가 없어 저장 즉시 반영된다.

**감수한 것**

- 모든 요청이 DB 조회와 MDX 컴파일을 거친다.
- DB가 내려가면 공개 페이지도 에러가 난다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| ISR + `generateStaticParams` | 빌드에 DB가 필요하다 |
| Cache Components(`'use cache'` + `updateTag`) | 지금 규모에선 불필요. 느려지면 이 경로로 옮긴다 |

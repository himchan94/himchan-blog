# ADR-0006: GitHub Pages 정적 배포를 버리고 VPS에서 Docker Compose로 배포한다

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: platform

## Context

`output: "export"` 결과물을 GitHub Actions가 gh-pages 브랜치로 올리는 방식이었다.
DB와 관리자 기능(ADR-0001, ADR-0005)이 생기면서 Node 서버가 필요해졌다. 배포 대상은 cloud VPS로 정했다.

## Decision

`output: "standalone"`으로 빌드하고 멀티스테이지 `Dockerfile`(node:24-alpine)로 이미지를 만든다.
`docker-compose.yml`에 `postgres`, 1회성 `migrate`(builder 단계에서 `prisma migrate deploy`), `app`을 둔다.
`migrate`와 `app`은 `app` profile에 묶어, 로컬 개발에서 `docker compose up`은 DB만 띄운다.
PostgreSQL 포트는 `127.0.0.1`에만 바인딩한다. GitHub Pages 워크플로와 `gh-pages`는 제거한다.

## Consequences

**좋아진 것**

- 빌드가 DB 없이 돌고(ADR-0004), 마이그레이션이 앱 기동 전에 한 번 실행된다.
- 로컬과 운영이 같은 compose 파일을 쓴다.

**감수한 것**

- 서버·DB 운영, 백업, HTTPS 리버스 프록시를 직접 해야 한다.
- 이미지는 VPS에서 빌드한다(레지스트리·CI 없음). 빌드 중 VPS 자원을 쓴다.
- `migrate`는 builder 이미지를 써서 이미지가 하나 더 생긴다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| Vercel + 관리형 PG | 사용자가 VPS를 선택했다 |
| 앱 컨테이너 시작 시 migrate 실행 | standalone 이미지에 prisma CLI가 없고, 넣으면 이미지가 커진다 |
| GitHub Actions로 이미지 빌드·푸시 | VPS가 아직 없고, 1인 블로그에 레지스트리 운영은 과하다. 필요하면 추가한다 |

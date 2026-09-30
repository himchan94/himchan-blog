# ADR-0001: 콘텐츠 저장소를 MDX 파일에서 PostgreSQL + Prisma 7로 옮긴다

- **Status**: Accepted
- **Date**: 2026-09-30
- **Domain**: platform

## Context

글·프로젝트·About이 `src/content/**/*.mdx` 파일이었고 `output: "export"`로 GitHub Pages에 정적 배포했다.
글 하나를 쓰려면 커밋과 재배포가 필요했다. 관리자 화면에서 작성·수정하려면 런타임에 읽고 쓸 저장소가 필요하다.
1인 운영 블로그이고 배포 대상은 cloud VPS(docker compose)다. 2026-09 기준 Prisma `latest` 태그는 8.0 RC였다.

## Decision

콘텐츠는 docker로 띄운 PostgreSQL 17에 저장하고 Prisma 7.10.0(정확 버전 고정)으로 접근한다.
Prisma 7 방식을 따른다: `prisma.config.ts`에서 `dotenv/config`로 `DATABASE_URL`을 읽고,
`prisma-client` generator로 `src/generated/prisma`(gitignore, `postinstall`에서 생성)에 클라이언트를 만들고,
`@prisma/adapter-pg` 드라이버 어댑터로 연결한다. 연결 객체는 `src/lib/db.ts` 하나뿐이다.

## Consequences

**좋아진 것**

- 재배포 없이 글을 쓰고 고칠 수 있다.
- 스키마 변경이 `prisma/migrations/`에 SQL로 남는다.

**감수한 것**

- 정적 호스팅을 쓸 수 없다. Node 서버와 DB를 운영·백업해야 한다.
- 생성된 클라이언트를 커밋하지 않으므로 설치 후 `prisma generate`가 반드시 돌아야 한다.
- Prisma 8 정식 출시 후 업그레이드는 별도로 해야 한다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| MDX 파일 유지 + Git 기반 CMS | 관리자 화면·DB를 쓰려는 목표와 맞지 않는다 |
| Drizzle | 사용자가 Prisma를 선택했다 |
| Prisma 8 RC | 개인 블로그 운영 DB에 RC를 쓸 이유가 없다 |
| 관리형 PG (Neon/Supabase) | VPS에서 compose로 함께 운영하기로 했다 |

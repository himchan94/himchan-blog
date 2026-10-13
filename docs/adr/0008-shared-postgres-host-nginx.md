# ADR-0008: 운영 DB는 서버의 공용 Postgres를 쓰고, 앞단은 호스트 nginx가 맡는다

- **Status**: Accepted
- **Date**: 2026-10-14
- **Domain**: platform

## Context

ADR-0006은 블로그 compose 안에 `postgres`를 두고 로컬과 운영이 같은 구성을 쓰게 했다.
같은 VPS(2코어·8GB)에 다른 개인 프로젝트가 늘어날 예정이고, 프로젝트마다 Postgres를 띄우면 메모리·백업·포트 관리가 프로젝트 수만큼 늘어난다.
리버스 프록시는 서버에 직접 설치한 nginx를 쓰기로 했다. 서버 디렉토리는 공용 인프라 `/srv/infra/*`, 앱 `/srv/apps/*`로 나눈다.

## Decision

운영 Postgres는 `/srv/infra/postgres`의 공용 compose(외부 network `postgres`, 루프백 바인딩)에서 돈다.
블로그는 전용 DB와 그 DB만 소유한 전용 계정을 받아 쓰고, `migrate`·`app`은 외부 network로 `postgres` 호스트에 붙는다.
블로그 compose의 `postgres`는 `dev` profile로 옮겨 로컬에서만 띄운다.
`app`은 `127.0.0.1:3000`에만 포트를 열고 호스트 nginx가 프록시한다.

## Consequences

**좋아진 것**

- Postgres 인스턴스·백업 지점이 서버에 하나다.
- 블로그를 `down -v`해도 운영 DB 볼륨이 지워지지 않는다.

**감수한 것**

- 로컬과 운영의 DB 구성이 다르다. 로컬은 `docker compose --profile dev up -d`로 DB를 띄운다.
- 공용 Postgres를 점검하거나 업그레이드하면 모든 프로젝트가 같이 멈춘다.
- 공용 Postgres가 없으면 `app`이 뜨지 않는다(외부 network 필요). 로컬에서 `app` profile을 띄우려면 `docker network create postgres`가 필요하다.
- 앱 계정에 superuser·`CREATEDB`를 주지 않으므로 서버에서 `prisma migrate dev`(shadow DB)는 돌지 않는다. 운영은 `migrate deploy`만 쓴다.
- 호스트 nginx는 docker network에 붙지 않으므로 앱마다 루프백 포트를 겹치지 않게 배정해야 한다.

## Alternatives

| 대안 | 버린 이유 |
|------|-----------|
| 프로젝트별 Postgres 컨테이너 (ADR-0006 유지) | 프로젝트가 늘면 메모리·백업·포트가 프로젝트 수만큼 늘어난다 |
| 공용 Postgres에 superuser로 접속 | 한 앱이 다른 프로젝트 DB까지 읽고 쓸 수 있다 |
| 프록시를 컨테이너(nginx·Caddy)로 두고 docker network로 라우팅 | 사용자가 호스트 nginx를 선택했다 |
| 외부·팀 프로젝트와 공용 Postgres 공유 | 팀 공유 서버에 개인 데이터를 두지 않는다 (ADR-0007과 같은 기준) |
